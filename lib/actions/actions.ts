"use server";
import { insertChatFeedback, insertChatMessage } from "@/app/_auth/dal";
import { verifySession } from "@/app/_auth/sessions";
import { ChatMessage } from "@/data/types";
import { actionClient } from "@/lib/safe-actions";
import { FormSchema, NewIssueFormSchem } from "@/lib/schemas";
import { flattenValidationErrors } from "next-safe-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const updateIssueAction = actionClient
  .schema(FormSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        id,
        priority,
        problem_description,
        type,
        instruction,
        missing_equipments,
      },
    }) => {
      const updateData = {
        priority,
        problem_description,
        type,
        instruction,
        missing_equipments,
      };

      const response = await fetch(`${process.env.LUNNI_SERVICES}/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.LUNNI_API}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        console.error("Update failed:", response.status, await response.text());
        throw new Error(`Update failed: ${response.status}`);
      }

      // Revalidate the 'issues' tag
      revalidateTag("issues");

      return {
        message: "Vikailmoitus Päivitetty! 🎉",
      };
    },
  );

export const postNewIssueAction = actionClient
  .schema(NewIssueFormSchem, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    try {
      return { message: "Vikailmoitus luotu onnistuneesti!" }; // FIXME: Lunnin järjestelmän vikailmoituksen lisääminen ei ole vielä käytössä
      const response = await fetch(`${process.env.LUNNI_SERVICES}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LUNNI_API}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("New issue creation failed:", response.status, errorText);
        throw new Error(
          `New issue creation failed: ${response.status} - ${errorText}`,
        );
      }

      revalidateTag("issues");
      return { message: "Vikailmoitus luotu onnistuneesti!" };
    } catch (error) {
      console.error("Error in postNewIssueAction:", error);
      throw error;
    }
  });

const toggleIssueStatus = async (issueId: number, isCompleted: boolean) => {
  const updateData = isCompleted
    ? {
        result: "picklist_service_result_done",
      }
    : {
        result: "picklist_service_result_pending",
        completed: null,
      };

  try {
    const response = await fetch(`${process.env.LUNNI_SERVICES}/${issueId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to ${isCompleted ? "close" : "open"} issue. Server responded with ${response.status}: ${errorText}`,
      );
    }

    const responseData = await response.json();
    // Check if the update was successful
    if (response.status !== 200) {
      console.warn("Unexpected response status:", response.status);
    }

    revalidateTag("issues");
    return {
      message: `Vikailmoitus ${isCompleted ? "suljettu" : "avattu"} onnistuneesti`,
      data: responseData,
      is_completed: isCompleted,
    };
  } catch (error) {
    console.error("Error in toggleIssueStatus:", error);
    throw error;
  }
};
export const closeIssueAction = actionClient
  .schema(z.object({ issueId: z.number() }))
  .action(async ({ parsedInput: { issueId } }) =>
    toggleIssueStatus(issueId, true),
  );

export const openIssueAction = actionClient
  .schema(z.object({ issueId: z.number() }))
  .action(async ({ parsedInput: { issueId } }) =>
    toggleIssueStatus(issueId, false),
  );

export async function insertChatMessageAction(message: ChatMessage) {
  return await insertChatMessage(message);
}

export async function insertChatFeedbackAction(feedback: {
  userId: number;
  isPositive: boolean;
  content: string;
  feedbackDetails: string;
}) {
  return await insertChatFeedback(feedback);
}

export async function getSessionAction() {
  try {
    const session = await verifySession();
    return session;
  } catch (error) {
    return null;
  }
}

export async function revalidateIssues() {
  revalidateTag("issues");
}

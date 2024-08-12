"use server";
import { ChatMessage, IssueFormValues } from "@/data/types";
import { actionClient } from "@/lib/safe-actions";
import { FormSchema, NewIssueFormSchem } from "@/lib/schemas";
import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { verifySession } from "@/app/_auth/sessions";
import { insertChatMessage } from "@/app/_auth/dal";

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
  console.log(
    `Attempting to ${isCompleted ? "close" : "open"} issue ${issueId}`,
  );
  return {
    message: `Vikailmoitus ${isCompleted ? "suljettu" : "avattu"} onnistuneesti`,
  }; // FIXME: Lunnin järjestelmän vikailmoituksen tilan muuttaminen ei ole vielä käytössä
  const updateData = { is_completed: isCompleted };

  console.log("Sending update data:", updateData);

  try {
    const response = await fetch(`${process.env.LUNNI_SERVICES}/${issueId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to ${isCompleted ? "close" : "open"} issue. Server responded with ${response.status}: ${errorText}`,
      );
    }

    const responseData = await response.json();
    console.log("Response data:", responseData);

    // Check if the update was successful
    if (responseData.is_completed !== isCompleted) {
      console.warn(
        "Warning: Server did not update the is_completed status as expected",
      );
    }

    revalidateTag("issues");
    return {
      message: `Vikailmoitus ${isCompleted ? "suljettu" : "avattu"} onnistuneesti`,
      data: responseData,
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

export async function getSessionAction() {
  try {
    const session = await verifySession();
    return session;
  } catch (error) {
    return null;
  }
}

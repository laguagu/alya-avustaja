"use server";
import { ChatMessage, IssueFormValues } from "@/data/types";
import { actionClient } from "@/lib/safe-actions";
import { FormSchema } from "@/lib/schemas";
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
        locationName,
        priority,
        problem_description,
        type,
        instruction,
        missing_equipments,
      },
    }) => {
      await fetch(
        `https://6549f6b1e182221f8d523a44.mockapi.io/api/issues/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationName,
            priority,
            problem_description,
            type,
            instruction,
            missing_equipments,
          }),
        },
      );
      return { message: "Vikailmoitus Päivitetty! 🎉" };
    },
  );

export const postNewIssueAction = actionClient
  .schema(FormSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        locationName,
        priority,
        problem_description,
        type,
        instruction,
        missing_equipments,
      },
    }) => {
      console.log(
        "postNewIssue",
        locationName,
        priority,
        problem_description,
        type,
        instruction,
        missing_equipments,
      );
      throw new Error("not implemented");
      await fetch(`https://6549f6b1e182221f8d523a44.mockapi.io/api/issues/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationName,
          priority,
          problem_description,
          type,
          instruction,
          missing_equipments,
        }),
      });
      revalidateTag("issues");
      return { message: "Vikailmoitus Päivitetty! 🎉" };
    },
  );

export const closeIssueAction = actionClient
  .schema(z.object({ issueId: z.number() }), {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { issueId } = parsedInput;
    const response = await fetch(
      `https://6549f6b1e182221f8d523a44.mockapi.io/api/issues/${issueId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_completed: true }),
      },
    );

    if (!response.ok) {
      throw new Error("Vikailmoituksen sulkeminen epäonnistui");
    }
    revalidateTag("issues");
    return { message: "Vikailmoitus suljettu onnistuneesti" };
  });

export const openIssueAction = actionClient
  .schema(z.object({ issueId: z.number() }), {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { issueId } = parsedInput;
    const response = await fetch(
      `https://6549f6b1e182221f8d523a44.mockapi.io/api/issues/${issueId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_completed: false }),
      },
    );

    if (!response.ok) {
      console.log("response", response);
      throw new Error("Vikailmoituksen avaaminen epäonnistui");
    }
    revalidateTag("issues");
    return { message: "Vikailmoitus avattu onnistuneesti" };
  });

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

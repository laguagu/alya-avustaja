"use server";
import { IssueFormValues } from "@/data/types";
import { actionClient } from "@/lib/safe-actions";
import { FormSchema } from "@/lib/schemas";
import { flattenValidationErrors } from "next-safe-action";
import { getAllUsers } from "@/db/drizzle/db";
import { z } from "zod";
import { revalidateTag } from "next/cache";

export async function updateIssueDataAction(
  issueId: number | undefined,
  formData: IssueFormValues
) {
  console.log("updateIssueData", issueId, formData);
  if (issueId === undefined) {
    throw new Error("issueId is undefined");
  }

  const url = `https://apiv3.lunni.io/services/${issueId}`;
  throw new Error("Not implemented");
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data; // Return the updated data
}

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
        }
      );
      return { message: "Vikailmoitus Päivitetty! 🎉" };
    }
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
        missing_equipments
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
    }
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
      }
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
      }
    );

    if (!response.ok) {
      console.log("response", response);
      throw new Error("Vikailmoituksen avaaminen epäonnistui");
    }
    revalidateTag("issues");
    return { message: "Vikailmoitus avattu onnistuneesti" };
  });

export const fetchUsers = async () => {
  const users = await getAllUsers();
  return users;
};

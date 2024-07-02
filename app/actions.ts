"use server"

import { IssueFormValues } from "@/data/types";
import { actionClient } from "@/lib/safe-actions";
import { FormSchema } from "@/lib/schemas";
import { flattenValidationErrors } from "next-safe-action";

export async function updateIssueData(
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
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id, locationName, priority, problem_description, type, instruction, missing_equipments } }) => {
      await fetch(`https://6549f6b1e182221f8d523a44.mockapi.io/api/issues/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locationName, priority, problem_description, type, instruction, missing_equipments }),
    });
    
    return { message: "Vikailmoitus Päivitetty! 🎉" }
  });
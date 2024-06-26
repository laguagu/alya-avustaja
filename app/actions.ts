"use server"

import { IssueFormValues } from "@/data/types";
import { FormSchema } from "@/lib/schemas";

export async function updateIssueData(
  issueId: number | undefined,
  formData: IssueFormValues
) {
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
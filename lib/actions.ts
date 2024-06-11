import { IssueFormValues } from "@/data/vikailmoitusMockData";

export async function getIssuesNumber(): Promise<number> {
  "use server";
  if (!process.env.LUNNI_SERVICES) {
    console.error("LUNNI_SERVICES environment variable is not set");
    return 0;
  }

  try {
    const response = await fetch(`${process.env.LUNNI_SERVICES}`, {
      method: "GET",
      // cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      console.error("Failed to fetch issues");
      return 0;
    }
    const data = await response.json();
    return Array.isArray(data) ? data.length : 0; // Varmista, että data on taulukko
  } catch (error) {
    console.error("Error fetching issues:", error);
    return 0;
  }
}

export async function fetchLunniFormData(id: string): Promise<IssueFormValues> {
  const response = await fetch(
    `https://apiv3.lunni.io/services/${id}?fields=location_id,priority,problem_description,type,instruction,used_equipments`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`, // Replace with your actual access token
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  return {
    location_id: data.location_id ?? null,
    priority: data.priority ?? "",
    problem_description: data.problem_description ?? "",
    type: data.type ?? "",
    instruction: data.instruction ?? "",
    used_equipments: data.used_equipments ?? "",
  };
}

import { DeviceItemExample, IssueFormValues } from "@/data/types";

// Haetaan vikailmoitusten määrä lunniapista joka tullaan näyttämään sidebarissa
export async function getIssuesNumber(): Promise<number> {
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
        Authorization: `Bearer ${process.env.LUNNI_API}`, 
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
    missing_equipments: data.used_equipments ?? "",
  };
}

async function retrieveLocationName(locationId: number): Promise<Location | null> {
  const response = await fetch(
    `https://apiv3.lunni.io/locations/${locationId}`
  );
  const data = await response.json();

  if (!data) {
    throw new Error("Failed to fetch location data");
  }

  return data;
}

export async function updateIssueData(
  issueId: number | undefined,
  formData: IssueFormValues
) {
  throw new Error("Not implemented");
  if (issueId === undefined) {
    throw new Error("issueId is undefined");
  }

  const url = `https://apiv3.lunni.io/services/${issueId}`;

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
  return data; // Palautetaan päivitetty data
}

export async function fetchAllFurnitures(): Promise<DeviceItemExample[]> {
  const FurnitureItems = await fetch(
    `${process.env.LUNNI_UNITS}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`, 
        "Content-Type": "application/json",
      },
    }
    // {cache: "no-store"} // This will disable cache
  );
  const data = await FurnitureItems.json();
  console.log(data);
  return data;
}

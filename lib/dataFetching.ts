import { arabiaKaikkiTilaukset } from "@/data/arabiaKaikkiTilaukset";
import {
  DeviceItemCard,
  DeviceItemExample,
  DevicesTableColums,
  IssueFormValues,
  ServiceTask,
} from "@/data/types";

// Haetaan vikailmoitusten määrä lunniapista joka tullaan näyttämään sidebarissa
export async function getIssuesNumber(): Promise<number> {
  if (!process.env.LUNNI_SERVICES) {
    console.error("LUNNI_SERVICES environment variable is not set");
    return 0;
  }

  try {
    const response = await fetch(
      `${process.env.LUNNI_SERVICES}?fields=is_completed`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.LUNNI_API}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 1000, tags: ["issues"] },
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch issues");
      return 0;
    }
    const data = await response.json();
    // Suodatetaan data niin, että lasketaan vain aktiiviset (is_active === 1) vikailmoitukset
    const activeIssuesCount = data.filter(
      (issue: { is_completed: number }) => issue.is_completed === 0,
    ).length;
    return activeIssuesCount;
  } catch (error) {
    console.error("Error fetching issues:", error);
    return 0;
  }
}

export async function getIssueFormDataById(
  id: string,
): Promise<IssueFormValues | null> {
  const response = await fetch(
    `https://apiv3.lunni.io/services/${id}?fields=location_id,priority,problem_description,type,instruction,missing_equipments,is_completed`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();

  return {
    id: data.id,
    location_id: data.location_id ?? null,
    priority: data.priority ?? "",
    problem_description: data.problem_description ?? "",
    type: data.type ?? "",
    instruction: data.instruction ?? "",
    missing_equipments: data.missing_equipments ?? "",
    is_completed: data.is_completed ?? 0,
  };
}

async function retrieveLocationName(
  locationId: number,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://apiv3.lunni.io/locations/${locationId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LUNNI_API}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null; // Return null if fetching fails
  }
}

export async function updateIssueData(
  issueId: number | undefined,
  formData: IssueFormValues,
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

export async function fetchFurnitures(): Promise<DevicesTableColums[]> {
  const url = process.env.LUNNI_UNITS;
  if (!url) {
    throw new Error("LUNNI_UNITS environment variable is not defined");
  }

  try {
    const response = await fetch(`${url}?&fields=name,serial,brand,model`, {
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error("No data found");
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch furniture data:", error);
    throw error;
  }
}

export async function fetchAllFurnitures(): Promise<DeviceItemExample[]> {
  const url = process.env.LUNNI_UNITS;
  if (!url) {
    throw new Error("LUNNI_UNITS environment variable is not defined");
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error("No data found");
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch furniture data:", error);
    throw error;
  }
}

export async function fetchIssuesData(): Promise<ServiceTask[]> {
  try {
    const response = await fetch(`${process.env.LUNNI_SERVICES}`, {
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Virhe haettaessa tietoja:", error);
    return []; // Palauta tyhjä taulukko tai sopiva virheilmoitus
  }
}

async function getDataForDevice(
  device_id: string,
): Promise<DeviceItemCard | null> {
  try {
    const response = await fetch(
      `https://apiv3.lunni.io/devices/${device_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LUNNI_API}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch device data");
    }

    const data = await response.json();
    return {
      id: data.id.toString(),
      name: data.name,
      model: data.model,
      brand: data.brand,
      devicecategory_id: data.devicecategory_id,
      image: data.image?.toString() ?? undefined,
      location: data.location,
      default_location_id: data.default_location_id,
      serial: data.serial,
      image_url: data.image_url,
    };
  } catch (error) {
    console.error("Error fetching device data:", error);
    return null; // Return null if fetching fails
  }
}

export async function retrieveFurnitureParts(
  furnitureName: string,
): Promise<string[] | null> {
  try {
    const item = arabiaKaikkiTilaukset.find(
      (order) => order.nimi === furnitureName,
    );

    if (!item) {
      throw new Error("Failed to fetch parts list");
    }

    return item.osat;
  } catch (error) {
    return null; // Palauttaa null, jos datan haku epäonnistuu
  }
}

export async function fetchIssuePageData(
  issueId: string,
  deviceId: string,
): Promise<{
  issueData: IssueFormValues | null;
  deviceData: DeviceItemCard | null;
  locationData: string | null;
  partsList: string[] | null;
}> {
  const issueFormPromise = issueId
    ? getIssueFormDataById(issueId)
    : Promise.resolve(null);
  const deviceDataPromise = deviceId
    ? getDataForDevice(deviceId)
    : Promise.resolve(null);

  const [issueData, deviceData] = await Promise.all([
    issueFormPromise,
    deviceDataPromise,
  ]);

  const locationDataPromise = deviceData?.default_location_id
    ? retrieveLocationName(deviceData.default_location_id)
    : Promise.resolve(null);

  const furniturePartsPromise = deviceData?.name
    ? retrieveFurnitureParts(deviceData.name)
    : Promise.resolve(null);

  const [locationData, partsList] = await Promise.all([
    locationDataPromise,
    furniturePartsPromise,
  ]);
  return { issueData, deviceData, locationData, partsList };
}

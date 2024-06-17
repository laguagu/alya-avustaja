import { DeviceItemCard, IssueFormValues } from "@/data/types";
import { issuesData, deviceData, locationData } from "@/data/types";
import { arabiaKaikkiTilaukset } from "./arabiaKaikkiTilaukset";

// Käytetään mockattua dataa
export async function getIssueFormDataById(
  id: string
): Promise<IssueFormValues | null> {
  try {
    const data = issuesData.find((item) => item.id.toString() === id);

    if (!data) {
      throw new Error("Failed to fetch data");
    }

    return {
      id: data.id,
      priority: data.priority ?? "",
      problem_description: data.problem_description ?? "",
      type: data.type ?? "",
      instruction: data.instruction ?? "",
      missing_equipments: data.missing_equipments ?? "",
    };
  } catch (error) {
    console.error("Error fetching Lunni form data:", error);
    return null; // Palauttaa null, jos datan haku epäonnistuu
  }
}

export async function getDataForDevice(
  device_id: string
): Promise<DeviceItemCard | null> {
  try {
    const data = deviceData.find((item) => item.id.toString() === device_id);

    if (!data) {
      return null;
    }

    return {
      id: data.id.toString(),
      name: data.name,
      model: data.model,
      brand: data.brand,
      devicecategory_id: data.devicecategory_id,
      image: data.image?.toString() ?? undefined,
      location: data.location,
      default_location_id: data.default_location_id, // Huonekalun sijainti
      serial: data.serial,
      image_url: data.image_url,
    };
  } catch (error) {
    console.error("Error fetching device data:", error);
    return null; // Palauttaa null, jos datan haku epäonnistuu
  }
}

export async function retrieveLocationName(
  locationId: number
): Promise<string | null> {
  try {
    const data = locationData.find((item) => item.id === locationId);

    if (!data) {
      throw new Error("Failed to fetch location data");
    }

    return data.name;
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null; // Palauttaa null, jos datan haku epäonnistuu
  }
}

export async function retrieveFurnitureParts(
  furnitureName: string
): Promise<string[] | null> {
  try {
    const item = arabiaKaikkiTilaukset.find(
      (order) => order.nimi === furnitureName
    );

    if (!item) {
      throw new Error("Failed to fetch parts list");
    }

    return item.osat;
  } catch (error) {
    console.error("Error fetching parts list:", error);
    return null; // Palauttaa null, jos datan haku epäonnistuu
  }
}

export async function updateIssueData(issueId: number | undefined, formData: IssueFormValues) {
  if (issueId === undefined) {
    throw new Error('issueId is undefined');
  }

  const url = `https://apiv3.lunni.io/services/${issueId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data; // Palautetaan päivitetty data
}
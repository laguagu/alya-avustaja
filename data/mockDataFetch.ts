import { DeviceItemCard, IssueFormValues } from "@/data/types";
import { issuesData, deviceData, locationData } from "@/data/types";
import { arabiaKaikkiTilaukset } from "./arabiaKaikkiTilaukset";

// Käytetään mockattua dataa
export async function fetchLunniFormData(id: string): Promise<IssueFormValues | null> {
  try {
    const data = issuesData.find((item) => item.id.toString() === id);

    if (!data) {
      throw new Error("Failed to fetch data");
    }

    return {
      // location_id: data.location_id ?? null,
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


export async function fetchDeviceData(
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
      default_location_id: data.default_location_id,
      serial: data.serial,
    };
  } catch (error) {
    console.error("Error fetching device data:", error);
    return null; // Palauttaa null, jos datan haku epäonnistuu
  }
}

export async function fetchLocationData(locationId: number): Promise<string | null> {
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

export async function fetchPartsList(furnitureName: string): Promise<string[] | null> {
  try {
    const item = arabiaKaikkiTilaukset.find((order) => order.nimi === furnitureName);

    if (!item) {
      throw new Error("Failed to fetch parts list");
    }

    return item.osat;
  } catch (error) {
    console.error("Error fetching parts list:", error);
    return null; // Palauttaa null, jos datan haku epäonnistuu
  }
}

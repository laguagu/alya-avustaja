import { arabiaKaikkiTilaukset } from "@/data/arabiaKaikkiTilaukset";
import {
  DeviceItemCard,
  DeviceItemExample,
  DevicesTableColums,
  FilteredServiceItem,
  IssueFormValues,
} from "@/data/types";

async function getDataForDevice(
  device_id: string,
): Promise<DeviceItemCard | null> {
  const fields = [
    "id",
    "name",
    "model",
    "brand",
    "devicecategory_id",
    "image",
    "location",
    "default_location_id",
    "serial",
  ];

  const fieldsQuery = fields.join(",");

  try {
    const response = await fetch(
      `https://apiv3.lunni.io/devices/${device_id}?fields=${fieldsQuery}`,
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
    return data;
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

export async function fetchFurnitures(): Promise<DevicesTableColums[]> {
  const url = process.env.LUNNI_UNITS;
  if (!url) {
    throw new Error("LUNNI_UNITS environment variable is not defined");
  }

  const fields = ["name", "serial", "brand", "model"];
  const fieldsQuery = fields.join(",");

  try {
    const response = await fetch(`${url}?&fields=${fieldsQuery}`, {
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

async function retrieveLocationName(
  default_location_id: number,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://apiv3.lunni.io/locations/${default_location_id}`,
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
        next: { revalidate: 250, tags: ["issues"] },
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
  const fields = [
    "location_id",
    "priority",
    "problem_description",
    "type",
    "instruction",
    "missing_equipments",
    "is_completed",
    "service_contact_name",
    "service_contact_phone",
  ];

  const fieldsQuery = fields.join(",");

  const response = await fetch(
    `https://apiv3.lunni.io/services/${id}?fields=${fieldsQuery}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LUNNI_API}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ei välimuistitusta, jotta data päivittyy oikein
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  return data;
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

export async function fetchServiceWithImage(): Promise<FilteredServiceItem[]> {
  const fields = [
    "id",
    "name",
    "device_id",
    "device_serial",
    "device_brand",
    "device_model",
    "location_id",
    "problem_description",
    "priority",
    "created",
    "updated",
    "completed",
    "is_completed",
    "instruction",
    "description",
    "created",
  ];

  const fieldsQuery = fields.join(",");

  // Fetch all issues from Lunni API
  try {
    const response = await fetch(
      `${process.env.LUNNI_SERVICES}?fields=${fieldsQuery}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LUNNI_API}`,
          "Content-Type": "application/json",
        },
        next: { tags: ["issues"], revalidate: 150 },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const services = await response.json();

    // Fetch content_url for each service
    const servicesWithImages = await Promise.all(
      services.map(async (service: any) => {
        const imageResponse = await fetch(
          `${process.env.LUNNI_SERVICES}/${service.id}?fields=id&references[files]=service_id&reference_fields[files]=content&url=direct`,
          {
            headers: {
              Authorization: `Bearer ${process.env.LUNNI_API}`,
              "Content-Type": "application/json",
            },
            next: { tags: ["issues"], revalidate: 150 },
          },
        );

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          return {
            ...service,
            content_url: imageData.references?.files?.[0]?.content_url || null,
          };
        }
        // Return service without content_url if fetching fails
        return { ...service, content_url: null };
      }),
    );

    return servicesWithImages;
  } catch (error) {
    console.error("Virhe haettaessa palvelutietoja kuvien kanssa:", error);
    return [];
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
  imageUrl: string | null;
}> {
  const issueFields = [
    "location_id",
    "priority",
    "problem_description",
    "type",
    "instruction",
    "missing_equipments",
    "is_completed",
    "service_contact_name",
    "service_contact_phone",
  ];

  const issueFieldsQuery = issueFields.join(",");

  const issueDataPromise = issueId
    ? fetch(
        `${process.env.LUNNI_SERVICES}/${issueId}?fields=${issueFieldsQuery}&references[files]=service_id&reference_fields[files]=content&url=direct`,
        {
          headers: {
            Authorization: `Bearer ${process.env.LUNNI_API}`,
            "Content-Type": "application/json",
          },
          next: { tags: ["issues"], revalidate: 300 },
        },
      )
        .then((res) => res.json())
        .catch((error) => {
          console.error("Error fetching issue data:", error);
          return null;
        })
    : Promise.resolve(null);

  const deviceDataPromise = deviceId
    ? getDataForDevice(deviceId).catch((error) => {
        console.error("Error fetching device data:", error);
        return null;
      })
    : Promise.resolve(null);

  const [issueData, deviceData] = await Promise.all([
    issueDataPromise,
    deviceDataPromise,
  ]);

  const locationDataPromise = deviceData?.default_location_id
    ? retrieveLocationName(deviceData.default_location_id).catch((error) => {
        console.error("Error fetching location data:", error);
        return null;
      })
    : Promise.resolve(null);

  const furniturePartsPromise = deviceData?.name
    ? retrieveFurnitureParts(deviceData.name).catch((error) => {
        console.error("Error fetching furniture parts:", error);
        return null;
      })
    : Promise.resolve(null);

  const [locationData, partsList] = await Promise.all([
    locationDataPromise,
    furniturePartsPromise,
  ]);

  const imageUrl = issueData?.references?.files?.[0]?.content_url || null;

  return { issueData, deviceData, locationData, partsList, imageUrl };
}

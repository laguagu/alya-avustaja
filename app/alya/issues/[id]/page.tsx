import ClientForm from "@/components/issues/ClientForm";
import { DeviceItemCard, IssueFormValues } from "@/data/types";
import { issuesData, deviceData, locationData } from "@/data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InformationCard from "@/components/issues/information-card";

// Käytetään mockattua dataa
async function fetchLunniFormData(id: string): Promise<IssueFormValues> {
  "use server";
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
}

async function fetchDeviceData(
  device_id: string
): Promise<DeviceItemCard | null> {
  "use server";
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
}

async function fetchLocationData(locationId: number): Promise<string | null> {
  "use server";
  // Mockattu sijainti data. Oikeassa tapauksessa tämä olisi API-kutsu
  // const response = await fetch(`https://apiv3.lunni.io/locations/${locationId}`);
  // const data = await response.json();
  const data = locationData.find((item) => item.id === locationId);

  if (!data) {
    throw new Error("Failed to fetch location data");
  }

  return data.name;
}

export default async function Page({
  params,
  searchParams,
}: {
  params?: { id?: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const data = params?.id ? await fetchLunniFormData(params.id) : null;
  const deviceId = searchParams?.["device_id"];
  const deviceData = deviceId ? await fetchDeviceData(deviceId) : null;
  const locationData = deviceData?.default_location_id
    ? await fetchLocationData(deviceData.default_location_id)
    : null;

  console.log("locationData", locationData);

  return (
    <div>
      <h1 className="text-2xl">Vikailmoitus - {params?.id}</h1>
      <Separator className="md:my-4 my-3 " />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Tiedot</TabsTrigger>
          <TabsTrigger value="edit">Muokkaa</TabsTrigger>
          <TabsTrigger value="chat">Avustaja</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <InformationCard deviceData={deviceData} locationName={locationData}/>
        </TabsContent>
        <TabsContent value="edit">
          <ClientForm data={data} />
        </TabsContent>
        <TabsContent value="chat">Chatti.</TabsContent>
      </Tabs>
    </div>
  );
}

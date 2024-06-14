import ClientForm from "@/components/issues/ClientForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InformationCard from "@/components/issues/information-card";
import {
  fetchLunniFormData,
  fetchDeviceData,
  fetchLocationData,
  fetchPartsList,
} from "@/data/mockDataFetch";

export default async function Page({
  params,
  searchParams,
}: {
  params?: { id?: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const deviceId = searchParams?.["device_id"];
  const issueId = params?.id;

  const issueDataPromise = issueId
    ? fetchLunniFormData(issueId)
    : Promise.resolve(null);

  const deviceDataPromise = deviceId
    ? fetchDeviceData(deviceId)
    : Promise.resolve(null);

  const [issueData, deviceData] = await Promise.all([
    issueDataPromise,
    deviceDataPromise,
  ]);

  const locationDataPromise = deviceData?.default_location_id
    ? fetchLocationData(deviceData.default_location_id)
    : Promise.resolve(null);
  const partsListPromise = deviceData?.name
    ? fetchPartsList(deviceData.name)
    : Promise.resolve(null);

  const [locationData, partsList] = await Promise.all([
    locationDataPromise,
    partsListPromise,
  ]);

  return (
    <div>
      <h1 className="text-2xl">Vikailmoitus - {params?.id}</h1>
      <Separator className="md:my-4 my-3 " />
      <Tabs defaultValue="info">
        <TabsList className="md:mb-2 ">
          <TabsTrigger value="info" className="hover:font-semibold">Tiedot</TabsTrigger>
          <TabsTrigger value="edit" className="hover:font-semibold">Muokkaa</TabsTrigger>
          <TabsTrigger value="chat" className="hover:font-semibold">Huolto-ohjeet</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <InformationCard
            partsList={partsList}
            issueData={issueData}
            deviceData={deviceData}
            locationName={locationData}
          />
        </TabsContent>
        <TabsContent value="edit">
          <ClientForm data={issueData} />
        </TabsContent>
        <TabsContent value="chat">Chatti.</TabsContent>
      </Tabs>
    </div>
  );
}

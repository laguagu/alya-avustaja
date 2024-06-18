import ClientForm from "@/components/issues/ClientForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InformationCard from "@/components/issues/information-card";
import { fetchIssuePageData } from "@/data/mockDataFetch";

export default async function Page({
  params,
  searchParams,
}: {
  params?: { id?: string };
  searchParams: { [key: string]: string | undefined };
}) {
  if (!params || !params.id) {
    return <div>Page ID is missing.</div>;
  }
  const deviceId = searchParams?.["device_id"];
  const issueId = params?.id.toString();

  const { issueData, deviceData, locationData, partsList } =
    await fetchIssuePageData(issueId, deviceId!);

  return (
    <div>
      <h1 className="text-2xl">Vikailmoitus - {params?.id}</h1>
      <Separator className="md:my-4 my-3 " />
      <Tabs defaultValue="info">
        <TabsList className="md:mb-2 ">
          <TabsTrigger value="info" className="hover:font-semibold">
            Tiedot
          </TabsTrigger>
          <TabsTrigger value="edit" className="hover:font-semibold">
            Muokkaa
          </TabsTrigger>
          <TabsTrigger value="chat" className="hover:font-semibold">
            Huolto-ohjeet
          </TabsTrigger>
          <TabsTrigger value="newIssue" className="hover:font-semibold">
            Luo vikailmoitus
          </TabsTrigger>
        </TabsList>

        {/* Inffo */}
        <TabsContent value="info">
          <InformationCard
            partsList={partsList}
            issueData={issueData}
            deviceData={deviceData}
            locationName={locationData}
          />
        </TabsContent>

        {/* Edit */}
        <TabsContent value="edit">
          <ClientForm data={issueData} locationName={locationData} deviceData={deviceData}/>
        </TabsContent>

        {/* Chat */}
        <TabsContent value="chat">Chatti.</TabsContent>

        {/* NewIssue */}
        <TabsContent value="newIssue">New Isssue</TabsContent>
      </Tabs>
    </div>
  );
}

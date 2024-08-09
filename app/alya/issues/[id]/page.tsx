import IssueForm from "@/components/issues/Issueform";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InformationCard from "@/components/issues/information-card";
import { fetchIssuePageData } from "@/lib/dataFetching";
import BackButton from "@/components/issues/back-button";
import { Suspense } from "react";
import ChatBot from "@/components/issues/chat-bot";
import { LoadingIssueSkeleton } from "@/components/skeletons";
import { verifySession } from "@/app/_auth/sessions";
export const fetchCache = "force-no-store";

const AsyncDataComponent = async ({
  issueId,
  deviceId,
}: {
  issueId: string;
  deviceId: string;
}) => {
  const { issueData, deviceData, locationData, partsList, imageUrl } =
    await fetchIssuePageData(issueId, deviceId);

  const furnitureName = deviceData?.name || "";
  const session = await verifySession();
  const sessionUserId = session ? session.userId : null;

  return (
    <Tabs defaultValue="info">
      <TabsList className="mb-2">
        <TabsTrigger value="info" className="hover:font-semibold">
          Tiedot
        </TabsTrigger>
        <TabsTrigger value="edit" className="hover:font-semibold">
          Muokkaa
        </TabsTrigger>
        <TabsTrigger value="chat" className="hover:font-semibold">
          Huolto-ohjeet
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <InformationCard
          partsList={partsList}
          issueData={issueData}
          deviceData={deviceData}
          locationName={locationData}
          IssueimageUrl={imageUrl || ""}
        />
      </TabsContent>

      <TabsContent value="edit">
        <IssueForm
          data={issueData}
          locationName={locationData}
          deviceData={deviceData}
        />
      </TabsContent>

      <TabsContent value="chat">
        <ChatBot furnitureName={furnitureName} sessionUserId={sessionUserId} />
      </TabsContent>
    </Tabs>
  );
};

export default function Page({
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

  if (!deviceId) {
    return <div>Device ID is missing.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl">Vikailmoitus - {params?.id}</h1>
      </div>
      <Separator className="md:my-4 my-3" />
      <Suspense fallback={<LoadingIssueSkeleton />}>
        <AsyncDataComponent issueId={issueId} deviceId={deviceId} />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { NewIssuesButton } from "@/components/issues/newissue-button";
import { Badge } from "@/components/ui/badge";
import { BentoGridDemo } from "@/components/BentoGridDemo";
import { fetchServiceWithImage } from "@/lib/dataFetching";
import { FilteredServiceItem } from "@/data/types";
import { LoadingIssuePageSkeleton } from "@/components/skeletons";

export default async function Page() {
  const issuesData: FilteredServiceItem[] = await fetchServiceWithImage();
  const openIssues = issuesData.filter((issue) => issue.is_completed === 0);
  return (
    <>
      <Suspense fallback={<LoadingIssuePageSkeleton />}>
        <div className="flex flex-col md:flex-row justify-between items-center w-full  shadow-md md:p-8 p-5 rounded-2xl bg-white/50 ">
          <div className="flex flex-col items-center flex-grow md:space-y-2">
            <h1 className="text-3xl lg:text-4xl text-center mb-2 md:my-2 border-b border-gray-500">
              Vikailmoitukset
            </h1>
            <Badge variant="outline" className="mb-4">
              Avoinna {openIssues.length}
            </Badge>
          </div>
          <div className="md:ml-4">
            <NewIssuesButton />
          </div>
        </div>
        <Separator />
        <BentoGridDemo issues={issuesData} />
      </Suspense>
    </>
  );
}

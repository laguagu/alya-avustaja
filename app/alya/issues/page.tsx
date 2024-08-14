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
        <div className="flex flex-col md:flex-row justify-between items-center w-full">
          <div className="flex flex-col items-center flex-grow md:space-y-2">
            <div className="flex flex-col items-center shadow-md p-4 bg-secondary rounded-tl-3xl rounded-br-3xl">
              {/* <h1 className="text-3xl lg:text-4xl text-center mb-2 md:my-2"> */}
              <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
                Vikailmoitukset
              </h1>
              <Badge variant="outline" className="text-sm px-2 mt-1 py-0.5 bg-white">
                Avoinna {openIssues.length}
              </Badge>
            </div>
          </div>
          <div className="md:ml-4 mt-6 md:mt-0">
            <NewIssuesButton />
          </div>
        </div>
        <Separator className="md:my-4 my-2" />
        <BentoGridDemo issues={issuesData} />
      </Suspense>
    </>
  );
}

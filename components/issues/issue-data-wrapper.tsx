import { Badge } from "@/components/ui/badge";
import { BentoGridDemo } from "@/components/BentoGridDemo";
import { fetchServiceWithImage } from "@/lib/dataFetching";
import { FilteredServiceItem } from "@/data/types";

export default async function IssuesDataWrapper() {
  const issuesData: FilteredServiceItem[] = await fetchServiceWithImage();
  const openIssues = issuesData.filter((issue) => issue.is_completed === 0);

  return (
    <>
      <div className="flex justify-center mb-4">
        <Badge variant="outline">Avoinna {openIssues.length}</Badge>
      </div>
      <BentoGridDemo issues={issuesData} />
    </>
  );
}

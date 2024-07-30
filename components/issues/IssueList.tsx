import { BentoGridDemo } from "@/components/BentoGridDemo";
import { fetchIssuesData } from "@/lib/dataFetching";

export default async function IssuesList() {
  const issuesData = await fetchIssuesData();
  return <BentoGridDemo issues={issuesData} />;
}

import { BentoGridDemo } from "@/components/BentoGridDemo";
import { fetchFilteredServiceItems } from "@/lib/dataFetching";

export default async function IssuesList() {
  const issuesData = await fetchFilteredServiceItems();
  return <BentoGridDemo issues={issuesData} />;
}

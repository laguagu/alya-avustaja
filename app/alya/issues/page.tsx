import { FilteredServiceItem, ServiceTask, issuesData } from "@/data/types";
import { BentoGridDemo } from "@/components/BentoGridDemo";
import { Suspense } from "react";
import { fetchIssuesData } from "@/lib/dataFetching";
import { NewIssue } from "@/components/issues/newissue-button";
import { Separator } from "@/components/ui/separator";

const extractFilteredServiceItems = (
  issuesData: ServiceTask[]
): FilteredServiceItem[] => {
  return issuesData.map((item: ServiceTask) => ({
    id: item.id,
    name: item.name,
    device_id: item.device_id,
    device_serial: item.device_serial,
    device_brand: item.device_brand,
    device_model: item.device_model,
    location_id: item.location_id,
    problem_description: item.problem_description,
    priority: item.priority,
    created: item.created,
    updated: item.updated,
    completed: item.completed,
    is_completed: item.is_completed,
    instruction: item.instruction, // AI:lla rikastettu huolto-ohje
    description: item.description, // Työnselostus, mikäli huoltopyyntö on ratkaistu
  }));
};

export default async function Page() {
  // Hae data apista
  const issuesData = await fetchIssuesData();
  // Suodatetaan data
  const filteredData = extractFilteredServiceItems(issuesData);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
        <h1 className="text-3xl text-center md:flex-grow mb-4 md:mb-0 mt-2">Vikailmoitukset</h1>
        <div className="md:ml-4">
          <NewIssue />
        </div>
      </div>
        <Separator />
      {/* Tämä suspense toimii oikein kun annat BentoGrid elementille TimeOut function */}
      <Suspense fallback={<div>Ladataan vikailmoituksia...</div>}>
        <BentoGridDemo issues={filteredData} />
      </Suspense>
    </div>
  );
}

import { IssueItem, DataType, apiData } from "@/data/vikailmoitusMockData";
import { BentoGridDemo } from "@/components/BentoGridDemo";
import { Suspense } from "react";

export default function Page() {
  const filteredData: IssueItem[] = apiData.map((item: DataType) => ({
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
    instruction: item.instruction, // Palautetaan tähän AI:lla rikastettu huolto-ohje
    description: item.description, // Työnselostus mikäli huoltopyyntö on ratkaistu ja työnselostus on kirjattu
  }));

  return (
    <div>
      <h1 className="text-center text-2xl">Issues</h1>
      <Suspense fallback={<div>Loading issues...</div>}>
        <BentoGridDemo issues={filteredData} />
      </Suspense>
    </div>
  );
}

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Suspense } from "react";
import { FurnitureItem } from "@/data/vikailmoitusMockData";

async function getData(): Promise<FurnitureItem[]> {
  const FurnitureItems = await fetch(
    "https://6549f6b1e182221f8d523a44.mockapi.io/api/kalusteet"
    // {cache: "no-store"} // This will disable cache
  );
  const data = await FurnitureItems.json();
  return data;
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Ladataan huonekaluja...</div>} />
        <DataTable columns={columns} data={data} />
      <Suspense />
    </div>
  );
}

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Suspense } from "react";
import { DeviceItemExample } from "@/data/types";
import { fetchAllFurnitures } from "@/lib/dataFetching";

export default async function Page() {
  const data = await fetchAllFurnitures();

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Ladataan huonekaluja...</div>} />
      <DataTable columns={columns} data={data} />
      <Suspense />
    </div>
  );
}

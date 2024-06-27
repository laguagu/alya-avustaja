import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Suspense } from "react";
import { DeviceItemExample } from "@/data/types";
import { fetchAllFurnitures } from "@/lib/dataFetching";

export default async function Page() {
  let data: DeviceItemExample[] | null = null;
  let error: string | null = null;

  try {
    data = await fetchAllFurnitures();
  } catch (err) {
    error = (err as Error).message;
  }

  if (error) {
    return <div className="container mx-auto py-10">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Ladataan huonekaluja...</div>} />
      {data && <DataTable columns={columns} data={data} />}
      <Suspense />
    </div>
  );
}

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Suspense } from "react";
import { DevicesTableColums } from "@/data/types";
import { fetchFurnitures } from "@/lib/dataFetching";

export default async function Page() {
  let data: DevicesTableColums[] = [];
  let error: string | null = null;

  try {
    data = await fetchFurnitures();
  } catch (err) {
    error = (err as Error).message;
  }

  if (error) {
    return <div className="container mx-auto py-10">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
     <p className="text-xs text-gray-500/70 italic md:hidden">Vinkki: Käännä laitteesi vaakatasoon nähdäksesi kaikki kentät kerralla.</p>
      <Suspense
        fallback={
          <div className="font-bold item-center flex justify-center">
            Ladataan huonekaluja...
          </div>
        }
      />
      <DataTable columns={columns} data={data} />
      <Suspense />
    </div>
  );
}

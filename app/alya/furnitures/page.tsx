import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DataTableMock } from "./data-table-mock";
import { Suspense } from "react";
import { DevicesTableColums } from "@/data/types";
import { fetchFurnitures } from "@/lib/dataFetching";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/skeletons";
import { arabiaKaikkiTilaukset } from "@/data/arabiaKaikkiTilaukset";

export default async function Page() {
  // let data: DevicesTableColums[] = [];
  // let error: string | null = null;

  // try {
  //   data = await fetchFurnitures();
  // } catch (err) {
  //   error = (err as Error).message;
  // }
  const data = arabiaKaikkiTilaukset;
  const error = null;

  return (
    <div className="container mx-auto py-10 space-y-6 ">
      <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Huonekalut
      </h1>
      <Separator />

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Virhe</AlertTitle>
          <AlertDescription>
            Huonekalujen lataaminen epäonnistui: {error}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <p className="text-sm text-muted-foreground md:hidden">
            Vinkki: Käännä laitteesi vaakatasoon nähdäksesi kaikki kentät
            kerralla.
          </p>
          <Suspense fallback={<TableSkeleton />}>
            <DataTableMock columns={columns} data={data} />
          </Suspense>
        </>
      )}
    </div>
  );
}

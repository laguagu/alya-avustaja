import SimpleSidenav from "@/components/layout/simple-sidenav";
import SheetNav from "@/components/layout/sheet";
import { getIssuesNumber } from "@/lib/dataFetching";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const issues = await getIssuesNumber(); // Hae API kutsulla issues määrä
  const issues: number = 3; // Mock data

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden">
      <div className="hidden border-r bg-muted/40 md:block">
        <SimpleSidenav issues={issues} />
      </div>
      <div className="flex flex-col overflow-hidden">
        <SheetNav issues={issues} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          <Suspense fallback={<div>Ladataan sisälöä...</div>}>
            {children}
          </Suspense>
        </main>
        <Toaster />
      </div>
    </div>
  );
}

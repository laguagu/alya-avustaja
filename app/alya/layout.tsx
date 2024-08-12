import SimpleSidenav from "@/components/layout/simple-sidenav";
import SheetNav from "@/components/layout/sheet";
import { getIssuesNumber } from "@/lib/dataFetching";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { LoadingLayoutSkeleton } from "@/components/skeletons";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const issues = await getIssuesNumber(); // Hae API kutsulla issues määrä

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden ">
      <div className="hidden border-r bg-muted/40 md:block ">
        <SimpleSidenav issues={issues} />
      </div>
      <div className="flex flex-col overflow-hidden">
        <SheetNav issues={issues} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100/50">
          <Suspense fallback={<LoadingLayoutSkeleton />}>{children}</Suspense>
        </main>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
              padding: "16px",
              borderRadius: "8px",
            },
          }}
        />
      </div>
    </div>
  );
}

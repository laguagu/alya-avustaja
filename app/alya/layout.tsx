import SheetNav from "@/components/layout/sheet";
import SimpleSidenav from "@/components/layout/simple-sidenav";
import { LoadingLayoutSkeleton } from "@/components/skeletons";
import { getIssuesNumber } from "@/lib/dataFetching";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { ViewTransitions } from "next-view-transitions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const issues = await getIssuesNumber(); // Hae API kutsulla issues määrä

  return (
    <ViewTransitions>
      <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden">
        <div className="hidden border-r bg-muted/40 md:block">
          <SimpleSidenav issues={issues} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <SheetNav issues={issues} />
          <main className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50">
            <div className="h-full overflow-y-auto p-4 lg:p-6">
              <Suspense fallback={<LoadingLayoutSkeleton />}>
                {children}
              </Suspense>
            </div>
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
    </ViewTransitions>
  );
}

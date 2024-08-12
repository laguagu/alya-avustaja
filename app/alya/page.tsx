import DashboardCards from "@/components/dashboard-cards";
import { DashboardCardsSkeleton } from "@/components/skeletons";
import { Suspense } from "react";
export default function Page() {
  return (
    <div>
      <Suspense fallback={<DashboardCardsSkeleton />}>
        <DashboardCards />
      </Suspense>
    </div>
  );
}

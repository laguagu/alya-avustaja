import Sidenav from "@/components/layout/sidenav";
import SimpleSidenav from "@/components/layout/simple-sidenav";
import SheetNav from "@/components/layout/sheet";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <SimpleSidenav />
      </div>
      <div className="flex flex-col">
        <SheetNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

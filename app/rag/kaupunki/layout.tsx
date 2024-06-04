import Sidenav from "@/app/ui/sidenav";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex">
      <Sidenav />
      <main className="flex flex-col w-full h-screen max-h-dvh bg-background">
        {children}
      </main>
    </div>
  );
}

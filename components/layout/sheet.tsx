"use client";
import Link from "next/link";
import {
  Home,
  LineChart,
  Package,
  TriangleAlert,
  Users,
  Menu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function SheetNav({ issues }: { issues: number }) {
  const pathName = usePathname();
  const navLinks = [
    { href: "/alya", icon: Home, label: "Hallintapaneli" },
    {
      href: "/alya/issues",
      icon: TriangleAlert,
      label: "Vikalista",
      badge: issues,
    },
    { href: "/alya/furnitures", icon: Package, label: "Huonekalut" },
    { href: "/alya/chat", icon: Users, label: "Chat" },
    { href: "#", icon: LineChart, label: "Analytiikka" },
  ];

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={clsx("navbar-link", {
                  "text-primary bg-muted font-bold": pathName === link.href,
                })}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
                {link.badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
            {/* <Link
              href="/alya"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Älyä-avustaja</span>
            </Link>
            <Link href="/alya" className="sheet-link">
              <Home className="h-5 w-5" />
              Hallintapaneli
            </Link>
            <Link
              href="/alya/issues"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
            >
              <TriangleAlert className="h-5 w-5" />
              Vikalista
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {issues}
              </Badge>
            </Link>
            <Link href="/alya/furnitures" className="sheet-link">
              <Package className="h-5 w-5" />
              Huonekalut
            </Link>
            <Link href="/alya/chat" className="sheet-link">
              <Users className="h-5 w-5" />
              Chat
            </Link>
            <Link href="#" className="sheet-link">
              <LineChart className="h-5 w-5" />
              Analytiikka
            </Link> */}
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

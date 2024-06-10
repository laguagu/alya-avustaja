"use client";
import Link from "next/link";
import {
  Bell,
  Home,
  LineChart,
  Package,
  Bot,
  TriangleAlert,
  Users,
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
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function SimpleSidenav({ issues }: { issues: number }) {
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
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/alya" className="flex items-center gap-2 font-semibold">
          <Bot className="h-6 w-6" />
          <span className="">Älyä-avustaja</span>
        </Link>
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={clsx("navbar-link", {
                "text-primary bg-muted font-bold": pathName === link.href,
              })}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
              {link.badge && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {link.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Card x-chunk="dashboard-02-chunk-0">
          <CardHeader className="p-2 pt-0 md:p-4">
            <CardTitle>Template</CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas repudiandae, incidunt molestiae nisi animi corporis ea impedit qui illum natus in at, cumque veniam, inventore quod commodi neque. Porro, sit!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
            <Button size="sm" className="w-full">
              Upgrade
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

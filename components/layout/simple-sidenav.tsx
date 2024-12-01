"use client";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Bot, Home, Package, TriangleAlert, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./logout-button";

export default function SimpleSidenav({ issues }: { issues: string }) {
  const pathName = usePathname();
  // Tällä tarkistuksella saadaan oikea baseSegment, joka on joko /alya tai /alya/issues esimerkiksi. Tämä on tarpeellista, jotta saadaan korostettua oikea linkki sivupalkissa.
  const pathSegments = pathName.split("/");
  const baseSegment = pathSegments[2]
    ? `/${pathSegments[1]}/${pathSegments[2]}`
    : `/${pathSegments[1]}`;

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
    // { href: "#", icon: LineChart, label: "Analytiikka" },
  ];

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/alya" className="flex items-center gap-2 font-semibold">
          <Bot className="h-6 w-6" />
          <span className="">Älyä-avustaja</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={clsx("navbar-link", {
                "text-primary bg-muted font-bold": baseSegment === link.href,
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
      <div className="mt-auto p-4 border-t">
        <LogoutButton />
      </div>
    </div>
  );
}

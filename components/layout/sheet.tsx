"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import clsx from "clsx";
import { Home, Menu, Package, TriangleAlert, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./logout-button";

export default function SheetNav({ issues }: { issues: string }) {
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
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Access different sections of the application.
          </SheetDescription>
          <nav className="grid gap-2 mt-4 text-lg font-medium">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={clsx("navbar-link", {
                  "text-primary bg-muted font-bold": baseSegment === link.href,
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
          </nav>
          <div className="mt-auto">
            <LogoutButton />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

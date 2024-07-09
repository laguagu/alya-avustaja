import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Bell,
  Home,
  Package,
  ClipboardPlus,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Vikalista</h3>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">
            Tarkastele kaikkia huonekaluihin liittyviä vikailmoituksia.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button asChild className="w-full max-w-xs">
            <Link
              href="alya/issues/"
              className="text-primary hover:underline text-sm text-center"
              prefetch={false}
            >
              Tarkastele vikoja
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Huonekalut</h3>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">
            Tarkastele kaikkia saatavilla olevia huonekaluja.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button asChild className="w-full max-w-xs">
            <Link
              href="/alya/furnitures"
              className="text-primary hover:underline text-sm text-center"
              prefetch={false}
            >
              Katso huonekalut
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Chatbot</h3>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">
            Keskustele chatbotin kanssa ja saa apua huonekalun huoltoon.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button asChild className="w-full max-w-xs">
            <Link
              href="/alya/chat"
              className="text-primary hover:underline text-sm text-center"
              prefetch={false}
            >
              Aloita chat
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardPlus className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Uusi vikailmoitus</h3>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">
            Luo uusi vikailmoitus huonekalulle.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button asChild className="w-full max-w-xs">
            <Link
              href="/alya/issues/new-issue"
              className="text-primary hover:underline text-sm text-center"
              prefetch={false}
            >
              Uusi vikailmoitus
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
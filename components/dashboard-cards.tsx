import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import {
    Home,
  } from "lucide-react";

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Vikalista</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tarkastele kaikkia huonekaluihin liittyviä vikailmoituksia.</p>
        </CardContent>
        <CardFooter>
          <Link href="#" className="text-primary hover:underline" prefetch={false}>
            Näytä tiedot
          </Link>
        </CardFooter>
      </Card>
      <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Huonekalut</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tarkastele kaikkia saatavilla olevia huonekaluja.</p>
        </CardContent>
        <CardFooter>
          <Link href="#" className="text-primary hover:underline" prefetch={false}>
            Näytä tiedot
          </Link>
        </CardFooter>
      </Card>
      <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Chatbot</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Keskustele chatbotin kanssa ja saa apua huonekalun huoltoon.</p>
        </CardContent>
        <CardFooter>
          <Link href="#" className="text-primary hover:underline" prefetch={false}>
            Näytä tiedot
          </Link>
        </CardFooter>
      </Card>
      <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Uusi vikailmoitus</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Luo uusi vikailmoitus huonekalulle.</p>
        </CardContent>
        <CardFooter>
          <Link href="#" className="text-primary hover:underline" prefetch={false}>
            Näytä tiedot
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
import { DeviceItemCard, IssueFormValues } from "@/data/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Suspense } from "react";
import { DialogBasicOne } from "./dialog-popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { formatMessage } from "../chat-message";

interface InformationCardProps {
  deviceData: DeviceItemCard | null;
  issueData: IssueFormValues | null;
  locationName: string | null;
  partsList: string[] | null;
  IssueimageUrl: string;
}

export default function InformationCard({
  deviceData,
  locationName,
  partsList,
  issueData,
  IssueimageUrl,
}: InformationCardProps) {
  if (!deviceData) {
    return (
      <div className="text-center text-gray-500">
        Ei saatavilla olevia huonekalutietoja
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-full">
      <Card className="bg-white shadow-md rounded-lg border-gray-200 border transition-all duration-300 hover:shadow-lg lg:col-span-1">
        <CardHeader className="bg-secondary p-6 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Huonekalun tiedot
          </CardTitle>
          <CardDescription className="text-gray-600">
            Tiedot vikailmoituksen huonekalusta
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <InfoItem label="Nimi" value={deviceData.name} />
            <InfoItem label="Malli" value={deviceData.model} />
            <InfoItem label="Merkki" value={deviceData.brand} />
            <InfoItem label="Sarjanumero" value={deviceData.serial} />
            <InfoItem label="Sijainti" value={locationName} />
          </div>
          {deviceData.image_url && ( // FIXME kuvaa ei haettua API:n kautta vielä palauttaa null siis
            <div className="mt-4">
              <Image
                width={350}
                height={350}
                src={"/chairs/arena022.jpg"}
                alt={deviceData.name}
                priority
                className="rounded-lg object-cover w-full h-auto"
              />
            </div>
          )}
          {partsList && partsList.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Osaluettelo:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {partsList.map((partName, index) => (
                  <li key={index} className="text-gray-700">
                    {partName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {issueData && (
        <Card className="bg-white shadow-md rounded-lg border-gray-200 border transition-all duration-300 hover:shadow-lg lg:col-span-2 mb-4 md:mb-0">
          <CardHeader className="bg-secondary p-6 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Vikailmoituksen tiedot
            </CardTitle>
            <CardDescription className="text-gray-600">
              Tiedot raportoidusta viasta
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label="Huoltoyhteyshenkilö"
                value={issueData.service_contact_name}
              />
              <InfoItem
                label="Yhteyshenkilön puhelin"
                value={issueData.service_contact_phone}
              />
              <InfoItem label="Prioriteetti" value={issueData.priority} />
              <InfoItem label="Tyyppi" value={issueData.type} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label="Vian kuvaus"
                value={issueData.problem_description}
                fullWidth
              />
              <InfoItem
                label="Tekoälyn huolto-ohje"
                value={issueData.instruction}
                fullWidth
              />
              <InfoItem
                label="Tarvittavat varaosat"
                value={issueData.missing_equipments}
                fullWidth
              />
              <Suspense fallback={<div>Ladataan</div>}>
                <DialogBasicOne
                  src={IssueimageUrl || "/vikailmoitus.png"}
                  deviceName={deviceData.name}
                  issueDescription={issueData.problem_description}
                />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string | React.ReactNode;
  fullWidth?: boolean;
}) {
  if (label === "Tekoälyn huolto-ohje" && typeof value === "string") {
    return (
      <div className={fullWidth ? "col-span-full" : ""}>
        <p className="font-semibold text-gray-700">{label}:</p>
        {!value ? (
          <p className="text-gray-600">Ei huolto-ohjeita</p>
        ) : (
          <div className="w-full max-w-2xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ai-instruction">
                <AccordionTrigger className="text-left">
                  Näytä huolto-ohje
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="text-sm leading-relaxed">
                      {formatMessage(value)}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <p className="font-semibold text-gray-700">{label}:</p>
      {typeof value === "string" ? (
        <p className="text-gray-600">{value || "Ei tiedossa"}</p>
      ) : (
        value
      )}
    </div>
  );
}

import { DeviceItemCard, IssueFormValues } from "@/data/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface InformationCardProps {
  deviceData: DeviceItemCard | null;
  issueData: IssueFormValues | null;
  locationName: string | null;
  partsList: string[] | null;
}

export default function InformationCard({
  deviceData,
  locationName,
  partsList,
  issueData,
}: InformationCardProps) {
  
  if (!deviceData) {
    return <div>Ei saatavilla olevia huonekalutietoja</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 max-w-full">
      <Card className="flex-1 min-w-[300px] bg-white shadow-lg rounded-lg border-gray-200 border-4">
        <CardHeader className="bg-gray-50 p-4 rounded-t-lg">
          <CardTitle className="text-2xl font-semibold">
            Huonekalun tiedot
          </CardTitle>
          <CardDescription>Tiedot vikailmoituksen huonekalusta</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Huonekalun tiedot:</h3>
            <p className="font-semibold">
              Nimi: <span className="font-normal">{deviceData.name}</span>
            </p>
            <p className="font-semibold">
              Malli: <span className="font-normal">{deviceData.model}</span>
            </p>
            <p className="font-semibold">
              Merkki: <span className="font-normal">{deviceData.brand}</span>
            </p>
            <p className="font-semibold">
              Sarjanumero:{" "}
              <span className="font-normal">{deviceData.serial}</span>
            </p>
            <p className="font-semibold">
              Sijainti: <span className="font-normal">{locationName}</span>
            </p>
          </div>
          {deviceData.image_url && (
            <div className="mb-4">
              <Image
                width={350}
                height={350}
                src={deviceData.image_url}
                alt={deviceData.name}
                priority
                className="rounded-lg"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          )}
          {partsList && (
            <div>
              <h3 className="text-lg font-medium mt-4">Osaluettelo:</h3>
              <ul className="list-disc pl-5 mt-2">
                {partsList.map((partName, index) => (
                  <li key={index}>{partName}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex flex-col flex-1 min-w-[300px] gap-6">
        {issueData && (
          <Card className="bg-white shadow-lg rounded-lg border-gray-200 border-4">
            <CardHeader className="bg-gray-50 p-4 rounded-t-lg">
              <CardTitle className="text-2xl font-semibold">
                Vikailmoituksen tiedot
              </CardTitle>
              <CardDescription>Tiedot raportoidusta viasta</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Vian tiedot:</h3>
                <p className="font-semibold">
                  Sijainti ID:{" "}
                  <span className="font-normal">{issueData.location_id}</span>
                </p>
                <p className="font-semibold">
                  Prioriteetti:{" "}
                  <span className="font-normal">{issueData.priority}</span>
                </p>
                <p className="font-semibold">
                  Vian kuvaus:{" "}
                  <span className="font-normal">
                    {issueData.problem_description}
                  </span>
                </p>
                <p className="font-semibold">
                  Tyyppi: <span className="font-normal">{issueData.type}</span>
                </p>
                <p className="font-semibold">
                  Ohje:{" "}
                  <span className="font-normal">{issueData.instruction}</span>
                </p>
                <p className="font-semibold">
                  Tarvittavat varaosat:{" "}
                  <span className="font-normal">
                    {issueData.missing_equipments}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uusi kortti lisätään tähän */}
        {/* <Card className="bg-white shadow-lg rounded-lg border-gray-200 border-4">
          <CardHeader className="bg-gray-50 p-4 rounded-t-lg">
            <CardTitle className="text-2xl font-semibold">Uuden kortin otsikko</CardTitle>
            <CardDescription>Tämä on uuden kortin kuvaus</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Sisällön otsikko</h3>
              <p className="font-semibold">Tämä on uuden kortin sisältöä. Voit lisätä tähän mitä tahansa tietoa, jota tarvitset.</p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

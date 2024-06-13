"use client";
import { DeviceItemCard } from "@/data/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useState } from "react";

interface Part {
  id: string;
  name: string;
  quantity: number;
}

interface InformationCardProps {
  deviceData: DeviceItemCard | null;
  locationName: string | null;
  partsList: Part[] | null;
}

export default function InformationCard({
  deviceData,
  locationName,
  partsList,
}: InformationCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showPartsList, setShowPartsList] = useState(false);

  if (!deviceData) {
    return <div>No device data available</div>;
  }

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleShowPartsList = () => {
    setShowPartsList(!showPartsList);
  };

   return (
    <div className="max-w-md  p-4">
      <Card>
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
          <CardDescription>Details of the selected device</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Name: {deviceData.name}</p>
          <p>Model: {deviceData.model}</p>
          <p>Brand: {deviceData.brand}</p>
          <p>Serial: {deviceData.serial}</p>
          <p>Location: {locationName}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleShowDetails}>
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
          <Button onClick={handleShowPartsList}>
            {showPartsList ? "Hide Parts List" : "Show Parts List"}
          </Button>
        </CardFooter>
      </Card>
      {showDetails && (
        <CardContent className="mt-4">
          <h2 className="text-xl font-bold">Additional Device Details</h2>
          <p>More information about the device can be displayed here.</p>
        </CardContent>
      )}
      {showPartsList && partsList && (
        <CardContent className="mt-4">
          <h2 className="text-xl font-bold">Parts List</h2>
          <ul className="list-disc pl-5">
            {partsList.map((part) => (
              <li key={part.id}>
                {part.name} - Quantity: {part.quantity}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </div>
  );
}

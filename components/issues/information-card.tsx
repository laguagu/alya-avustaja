import { DeviceItemCard } from "@/data/types";

interface InformationCardProps {
  deviceData: DeviceItemCard | null;
  locationName: string | null;
}

export default function InformationCard({
  deviceData,
  locationName,
}: InformationCardProps) {
  if (!deviceData) {
    return <div>No device data available</div>;
  }

  return (
    <div>
      <h2>Device Information</h2>
      <p>Name: {deviceData.name}</p>
      <p>Model: {deviceData.model}</p>
      <p>Brand: {deviceData.brand}</p>
      <p>Serial: {deviceData.serial}</p>
      <p>Location: {locationName}</p>
      {/* Other device information */}
    </div>
  );
}

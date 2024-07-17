import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  DevicesTableColums } from "@/data/types";
import { retrieveFurnitureParts } from "@/lib/dataFetching";
import { useState } from "react";

export const PartsDropdown = ({ item }: { item: DevicesTableColums }) => {
  const [parts, setParts] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenChange = async (open: boolean) => {
    if (open && !parts && !isLoading) {
      setIsLoading(true);
      const fetchedParts = await retrieveFurnitureParts(item.name);
      setParts(fetchedParts);
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Osat</DropdownMenuLabel>
        {isLoading && <DropdownMenuItem disabled>Ladataan...</DropdownMenuItem>}
        {!isLoading && parts && parts.length > 0 && (
          parts.map((part, index) => (
            <DropdownMenuItem key={index}>{part}</DropdownMenuItem>
          ))
        )}
        {!isLoading && parts === null && (
          <DropdownMenuItem disabled>Ei osia saatavilla</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
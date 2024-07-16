"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { DeviceItemExample } from "@/data/types";
import { retrieveFurnitureParts } from "@/lib/dataFetching";
import { useState } from "react";

const PartsDropdown = ({ item }: { item: DeviceItemExample }) => {
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
        {!isLoading && parts && parts.length === 0 && (
          <DropdownMenuItem disabled>Ei osia saatavilla</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Use zod schema to define the shape of the data later
export const columns: ColumnDef<DeviceItemExample>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nimi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "serial",
    header: "Sarja numero",
  },
  // {
  //   accessorKey: "issue",
  //   header: "Issue",
  //   cell: ({ row }) => (row.getValue("issue") ? "Yes" : "No"),
  // },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "model",
    header: "Model",
    cell({ row }) {
      return <div>{row.original.model}</div>;
    },
  },
  {
    header: "Osat",
    id: "actions",
    cell: ({ row }) => {
      return <PartsDropdown item={row.original} />;
    }
  },
];

"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DevicesTableColums } from "@/data/types";
import { PartsDropdown } from "@/components/furnitures/parts-dropdown";
import { ImagePreview } from "@/components/furnitures/image-preview";

export type ArabiaTilaus = {
  nimi: string;
  määrä: number;
  toimitus_pvm: string;
  osat: string[];
  kuva?: string;
};

export const columns: ColumnDef<ArabiaTilaus>[] = [
  {
    accessorKey: "kuva",
    header: "Kuva",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <ImagePreview 
          imageSrc={`/furnitures/${data.kuva}`}
          alt={data.nimi}
          nimi={data.nimi}
          määrä={data.määrä}
          toimitus_pvm={data.toimitus_pvm}
        />
      );
    },
  },
  {
    accessorKey: "nimi",
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
    minSize: 150,
    maxSize: 400,
  },
  {
    accessorKey: "määrä",
    header: "Määrä",
    minSize: 50,
    maxSize: 100,
  },
  {
    accessorKey: "toimitus_pvm",
    header: "Toimituspäivämäärä",
    minSize: 100,
    maxSize: 200,
  },
  {
    accessorKey: "osat",
    header: "Osat",
    cell: ({ row }) => {
      return <PartsDropdown item={row.original} />;
    },
    minSize: 100,
    maxSize: 300,
  },
];

// Käytä näitä columnseja kun käytä datana lunnin apista tulevaa dataa
// export const columns: ColumnDef<ArabiaTilaus>[] = [
//   // {
//   //   id: "select",
//   //   header: ({ table }) => (
//   //     <Checkbox
//   //       checked={
//   //         table.getIsAllPageRowsSelected() ||
//   //         (table.getIsSomePageRowsSelected() && "indeterminate")
//   //       }
//   //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//   //       aria-label="Select all"
//   //     />
//   //   ),
//   //   cell: ({ row }) => (
//   //     <Checkbox
//   //       checked={row.getIsSelected()}
//   //       onCheckedChange={(value) => row.toggleSelected(!!value)}
//   //       aria-label="Select row"
//   //     />
//   //   ),
//   //   enableSorting: false,
//   //   enableHiding: false,
//   // },
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Nimi
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: "serial",
//     header: "Sarjanumero",
//   },
//   {
//     accessorKey: "brand",
//     header: "Brändi",
//   },
//   {
//     accessorKey: "model",
//     header: "Malli",
//     cell({ row }) {
//       return <div>{row.original.model}</div>;
//     },
//   },
//   {
//     header: "Osat",
//     id: "Parts",
//     cell: ({ row }) => {
//       return <PartsDropdown item={row.original} />;
//     },
//   },
// ];

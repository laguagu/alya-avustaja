import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArabiaTilaus } from "@/app/alya/furnitures/columns";
import { retrieveFurnitureParts } from "@/lib/dataFetching";
import { useState } from "react";

// Tämä on mockdataa varten
export const PartsDropdown = ({ item }: { item: ArabiaTilaus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Avaa valikko</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Osat</DropdownMenuLabel>
        {item.osat.length > 0 ? (
          item.osat.map((part, index) => (
            <DropdownMenuItem key={index}>{part}</DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>Ei osia saatavilla</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// !!
// HUOM! Käytä tätä komponenttia vain, jos käytät dataa lunnin apista
// !!

// export const PartsDropdown = ({ item }: { item: DevicesTableColums }) => {
//   const [parts, setParts] = useState<string[] | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleOpenChange = async (open: boolean) => {
//     if (open && !parts && !isLoading) {
//       setIsLoading(true);
//       const fetchedParts = await retrieveFurnitureParts(item.name);
//       setParts(fetchedParts);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <DropdownMenu onOpenChange={handleOpenChange}>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <span className="sr-only">Open menu</span>
//           <ChevronDown className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>Osat</DropdownMenuLabel>
//         {isLoading && <DropdownMenuItem disabled>Ladataan...</DropdownMenuItem>}
//         {!isLoading &&
//           parts &&
//           parts.length > 0 &&
//           parts.map((part, index) => (
//             <DropdownMenuItem key={index}>{part}</DropdownMenuItem>
//           ))}
//         {!isLoading && parts === null && (
//           <DropdownMenuItem disabled>Ei osia saatavilla</DropdownMenuItem>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

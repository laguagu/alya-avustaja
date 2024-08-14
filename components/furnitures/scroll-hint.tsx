import { ChevronRightIcon } from "lucide-react";

export const ScrollHint = () => (
  <div className="flex items-center justify-end space-x-2 text-sm text-muted-foreground md:hidden mb-4">
    <span className="tracking-tighter ">
      Voit vierittää oikealla sarakkeita
    </span>
    <ChevronRightIcon size={20} className="animate-pulse" />
  </div>
);

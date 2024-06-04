import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { XIcon, MenuIcon, Home, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function Sidenav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="relative md:w-48 md:border-r">
      <Button
        className="absolute top-0 left-0 mt-4 ml-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      <div
        className={`fixed z-20 inset-0 bg-black opacity-50 transition-opacity md:relative md:bg-transparent md:opacity-100 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`fixed z-30 h-full transition-transform transform bg-slate-50 overflow-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 w-48 md:w-auto`}
      >
        {isOpen && (
          <Button
            className="absolute top-0 right-0 mt-4 mr-4"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="h-6 w-6" />
          </Button>
        )}
        <div className="p-4 mt-10 md:pl-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex flex-row h-9 w-auto items-center justify-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <div className="flex gap-1 font-semibold">
                    <Home className="h-5 w-5" />
                    Koti
                  </div>
                  <span className="sr-only">Koti</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">Chatbot</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex flex-row h-9 w-auto items-center justify-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <div className="flex gap-1 font-semibold">
                    <Mail className="h-5 w-5" />
                    Vikailmoitus
                  </div>
                  <span className="sr-only">Vikailmoitus</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Piiroiselle vikailmoitus
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
    </nav>
  );
}

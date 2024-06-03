import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { XIcon, MenuIcon } from "lucide-react";

export default function Sidenav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="relative md:w-64">
      <Button
        className="absolute top-0 left-0 mt-4 ml-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XIcon className="h-6 w-6" />
        ) : (
          <MenuIcon className="h-6 w-6" />
        )}
      </Button>

      <div
        className={`fixed z-20 inset-0 bg-black opacity-50 transition-opacity md:relative md:bg-transparent md:opacity-100 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`fixed z-30 h-full transition-transform transform bg-white overflow-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 w-64`}
      >
        {isOpen && (
          <Button
            className="absolute top-0 right-0 mt-4 mr-4"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="h-6 w-6" />
          </Button>
        )}
        <div className="p-4 mt-10">
          <p>Item 1</p>
          <p>Item 2</p>
          <p>Item 3</p>
        </div>
      </aside>
    </nav>
  );
}

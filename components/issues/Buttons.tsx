// CustomButton.tsx
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Bot } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateAIinstruction } from "@/lib/langchainActions";
import { FurnitureInfo } from "@/data/types";


interface CustomButtonProps {
  isEditing: boolean;
  instruction: string;
  furnitureInfo?: FurnitureInfo;
  updateInstruction: (instruction: string) => void;
}

export const AiInstructionButton: React.FC<CustomButtonProps> = ({
  isEditing,
  instruction,
  furnitureInfo,
  updateInstruction,
}) => {
  const [open, setOpen] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [instructionInput, setInstructionInput] = useState(instruction);

  const handleInstructionInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInstructionInput(event.target.value);
  };

  const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (instructionInput) {
      updateInstruction(instructionInput);
    }
    setOpen(false);
    setIsGenerated(false);
  };

  // Käsittelijä huolto-ohjeiden generoinnille
  const handleGenerate = async () => {
    const furnitureName = furnitureInfo?.name || "";
    const furnitureProblem = furnitureInfo?.problem_description || "";

    const result = await generateAIinstruction({
      furniture_name: furnitureName,
      furnitureProblem: furnitureProblem,
    });
    setInstructionInput(result);
    console.log("Saatu vastaus",result);
    // Tässä voisi olla logiikka huolto-ohjeiden generoimiseksi
    // Aseta isGenerated true, kun ohjeet on generoitu
    setIsGenerated(true);
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setInstructionInput(instruction);
        setIsGenerated(false);
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="ml-2 flex "
          disabled={!isEditing}
        >
          Avaa <Bot className="ml-2 h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Avustajan huolto-ohje suositus</DialogTitle>
          <DialogDescription>
            Tekoäly analysoi vikailmoituksesi ja tarjoaa parhaan mahdollisen
            suosituksen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instruction" className="text-right">
              Suositus
            </Label>
            <textarea
              placeholder="Paina generoi suositus -nappia saadaksesi huolto-ohjeet."
              id="instructionInput"
              rows={4}
              value={instructionInput}
              onChange={handleInstructionInputChange}
              className="col-span-3 p-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
        </div>
        <DialogFooter>
          <div>
            {isGenerated ? (
              // Näytä nämä napit, kun huolto-ohjeet on generoitu
              <>
                <Button type="button" onClick={handleSave}>
                  Tallenna
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className="ml-2">
                    Hylkää
                  </Button>
                </DialogClose>
              </>
            ) : (
              // Näytä tämä painike, kun huolto-ohjeita ei ole vielä generoitu
              <Button type="button" onClick={handleGenerate}>
                Generoi suositus
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const AiPartsButton: React.FC<CustomButtonProps> = ({ isEditing }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="ml-2 flex "
          disabled={!isEditing}
        >
          Avaa <Bot className="ml-2 h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tarvittavat varaosat</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

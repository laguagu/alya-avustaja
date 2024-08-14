import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogImage,
  DialogSubtitle,
  DialogClose,
  DialogDescription,
  DialogContainer,
} from "@/components/ui/dialog-pop-modal";
import { ZoomInIcon, XIcon } from "lucide-react";
import Image from 'next/image';

type ImagePreviewProps = {
  imageSrc: string;
  alt: string;
  nimi: string;
  määrä: number;
  toimitus_pvm: string;
};

export function ImagePreview({
  imageSrc,
  alt,
  nimi,
  määrä,
  toimitus_pvm,
}: ImagePreviewProps) {
  return (
    <Dialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <DialogTrigger className="cursor-pointer relative w-10 h-10">
        <Image 
          src={imageSrc} 
          alt={alt} 
          fill
          sizes="40px"
          className="rounded-md object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
          <ZoomInIcon size={16} color="white" />
        </div>
      </DialogTrigger>
      <DialogContainer>
        <DialogContent
          style={{
            borderRadius: "24px",
          }}
          className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[500px]"
        >
          <div className="relative w-full pt-[75%]">
            <DialogImage
              src={imageSrc}
              alt={alt}
              className="absolute top-0 left-0 w-full h-full object-contain"
            />
          </div>
          <div className="p-6">
            <DialogTitle className="text-2xl text-zinc-950 dark:text-zinc-50">
              {nimi}
            </DialogTitle>
            <DialogSubtitle className="text-zinc-700 dark:text-zinc-400">
              Tuotetiedot:
            </DialogSubtitle>
            <DialogDescription
              disableLayoutAnimation
              variants={{
                initial: { opacity: 0, scale: 0.8, y: 20 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.8, y: 20 },
              }}
            >
              <p className="mt-2 text-zinc-500 dark:text-zinc-500">
                Määrä: {määrä}<br />
                Toimituspäivämäärä: {toimitus_pvm}
              </p>
            </DialogDescription>
          </div>
          <DialogClose className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm text-zinc-800 hover:bg-white/20 transition-colors duration-200 dark:text-zinc-100 dark:hover:bg-black/20">
            <XIcon size={24} />
          </DialogClose>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}
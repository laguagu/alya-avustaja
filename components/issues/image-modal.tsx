"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type ImageModalProps = {
  imageUrl: string;
  altText: string;
};

const ImageModal = ({ imageUrl, altText }: ImageModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mt-2">
        <Image
          src={imageUrl}
          width={150}
          height={150}
          alt={altText}
          className="rounded-lg cursor-pointer object-cover transition-transform hover:scale-105"
          onClick={() => setIsOpen(true)}
          priority
        />
        <p className="text-sm text-gray-500 mt-1">
          Klikkaa kuvaa suurentaaksesi
        </p>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="bg-white p-2 rounded-lg max-w-3xl max-h-[90vh] w-full h-full relative flex items-center justify-center">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={altText}
                layout="fill"
                objectFit="contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                priority
                className="w-auto h-auto" // Maintain aspect ratio using CSS
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;

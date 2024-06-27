"use client";
import { CircleArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";
import { Button } from "../ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.back()} variant="outline" size="icon">
        <CircleArrowLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}

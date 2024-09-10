"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { revalidateIssues } from "@/lib/actions/actions";

export function RevalideButton() {
  const [isPending, startTransition] = useTransition();

  const handleRevalidate = () => {
    startTransition(async () => {
      await revalidateIssues();
    });
  };

  return (
    <Button variant="outline" onClick={handleRevalidate} disabled={isPending}>
      <RefreshCcw
        className={`w-5 h-5 mr-2 ${isPending ? "animate-spin" : ""}`}
      />
      {isPending ? "Päivitetään..." : "Päivitä lista"}
    </Button>
  );
}

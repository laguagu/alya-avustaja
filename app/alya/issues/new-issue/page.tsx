import NewIssueForm from "@/components/issues/newissue-form";
import { Suspense } from "react";
import BackButton from "@/components/issues/back-button";
import { Separator } from "@/components/ui/separator";
import { TextEffect } from "@/components/ui/text-effect";
import { AlertTriangleIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <BackButton />
          <h1 className="text-2xl">Uusi vikailmoitus</h1>
          <div className="flex sm:gap-3 ">
            <AlertTriangleIcon className="h-6 w-6 text-red-500" />
            <TextEffect per="word" preset="slide" className="text-red-500">
              Mahdollinen ominaisuus jota voi kokeilla. Ei vielä käytössä
            </TextEffect>
          </div>
        </div>
        <Separator className="md:mb-6 mb-4" />
      </div>
      <div className="container my-auto">
        <Suspense fallback={<div>Vikailmoitus sivua ladataaan...</div>}>
          <NewIssueForm />
        </Suspense>
      </div>
    </div>
  );
}

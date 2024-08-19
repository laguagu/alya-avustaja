import NewIssueForm from "@/components/issues/newissue-form";
import { Suspense } from "react";
import BackButton from "@/components/issues/back-button";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <BackButton />
          <h1 className="text-2xl">Uusi vikailmoitus</h1>
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

import NewIssueForm from "@/components/issues/newissue-form";
import { Suspense } from "react";
import BackButton from "@/components/issues/back-button";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl">Uusi vikailmoitus</h1>
      </div>
      <Separator className="md:my-4 my-3" />
      <Suspense fallback={<div>Vikailmoitus sivua ladataaan...</div>}>
        <NewIssueForm />
      </Suspense>
    </div>
  );
}

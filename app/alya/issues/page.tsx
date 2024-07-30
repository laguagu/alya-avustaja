import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import IssuesList from "@/components/issues/IssueList";
import { NewIssue } from "@/components/issues/newissue-button";

export default async function Page() {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
        <h1 className="text-3xl lg:text-4xl text-center md:flex-grow mb-4 md:my-2">
          Vikailmoitukset
        </h1>
        <div className="md:ml-4">
          <NewIssue />
        </div>
      </div>
      <Separator />
      <Suspense fallback={<div>Ladataan vikailmoituksia...</div>}>
        <IssuesList />
      </Suspense>
    </div>
  );
}

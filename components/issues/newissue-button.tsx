import { ClipboardPlus } from "lucide-react";
import { Link } from 'next-view-transitions';
import { Button } from "../ui/button";

export function NewIssuesButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/alya/issues/new-issue" className="flex items-center">
        <ClipboardPlus className="w-5 h-5 mr-2" />
        Uusi vikailmoitus
      </Link>
    </Button>
  );
}

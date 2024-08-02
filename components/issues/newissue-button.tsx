import Link from "next/link";
import { Button } from "../ui/button";
import { ClipboardPlus } from "lucide-react";

export function NewIssue() {
  return (
    <Button asChild className="w-full" variant={"outline"}>
      <Link href="/alya/issues/new-issue">
      <ClipboardPlus className="w-5 h-5 mr-2 text-primary" />
      Uusi vikailmoitus
      </Link>
    </Button>
  );
}

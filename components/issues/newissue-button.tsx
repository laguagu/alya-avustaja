import Link from "next/link";
import { Button } from "../ui/button";

export function NewIssue() {
  return (
    <Button asChild className="w-full" variant={"destructive"}>
      <Link href="/alya/issues/new-issue">Uusi vikailmoitus</Link>
    </Button>
  );
}

"use client";
import { LogOut } from "lucide-react";
import { logout } from "@/app/_auth/auth";
import { Button } from "../ui/button";

export default function LogoutButton() {
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900"
      onClick={async () => {
        await logout();
      }}
    >
      <LogOut className="h-6 w-6 " />
      Kirjaudu ulos
    </Button>
  );
}

"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { login } from "@/app/_auth/auth";
import { LoginButton } from "@/components/Client-Buttons";

function LoginForm() {
  const [state, action] = useFormState(login, undefined);

  return (
    <form action={action}>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Kirjaudu</h1>
            <p className="text-balance text-muted-foreground">
              Syötä sähköpostiosoitteesi ja salasanasi kirjautuaksesi sisään
            </p>
            {state?.message && <p className="text-red-500">{state.message}</p>}
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Sähköposti</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
              {state?.errors?.email && (
                <p className="text-red-500">{state.errors.email.join(", ")}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Salasana</Label>
              </div>
              <Input id="password" type="password" name="password" required />
              {state?.errors?.password && (
                <p className="text-red-500">
                  {state.errors.password.join(", ")}
                </p>
              )}
            </div>
            <LoginButton />
          </div>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;

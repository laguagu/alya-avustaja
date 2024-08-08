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
        <div className="mx-auto w-[350px] bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-[#5046e6] p-4 text-white">
            <h1 className="text-3xl font-bold text-center">Kirjaudu</h1>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-balance text-gray-600 text-center">
              Syötä sähköpostiosoitteesi ja salasanasi kirjautuaksesi sisään
            </p>
            {state?.message && (
              <p className="text-red-500 text-center font-semibold">{state.message}</p>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Sähköposti</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
                {state?.errors?.email && (
                  <p className="text-red-500 text-sm">{state.errors.email.join(", ")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Salasana</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
                {state?.errors?.password && (
                  <p className="text-red-500 text-sm">{state.errors.password.join(", ")}</p>
                )}
              </div>
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;

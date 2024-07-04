import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/app/auth/auth';

function LoginForm() {
  const [state, action] = useFormState(login, undefined);

  return (
    <form>
    <div className="w-full lg:min-h-[600px] xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Kirjaudu</h1>
            <p className="text-balance text-muted-foreground">
              Syötä sähköpostiosoitteesi ja salasanasi kirjautuaksesi sisään
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Sähköposti</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Salasana</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Kirjaudu
            </Button>
          </div>
        </div>
      </div>
    </div>
    </form>
  );
}

export default LoginForm;

import { BoxRevealDemo } from "@/components/BoxRevealDemo";
import LoginForm from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-50 via-green-50 to-blue-100">
      <BoxRevealDemo />
      <LoginForm />
    </div>
  );
}

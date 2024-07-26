import { BoxRevealHome } from "@/components/BoxRevealHome";
import LoginForm from "@/components/login-form";
import ScrollSection from "@/components/scroll-section";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const connectionString = process.env.DATABASE_URL;
  const secretKey = process.env.SECRET;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (!secretKey) {
    throw new Error("SECRET environment variable is not set");
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-50 via-green-50 to-blue-100 mx-auto w-full lg:min-h-[500px] xl:min-h-[600px] overflow-hidden">
      <section className="max-w-[80rem]">
        <BoxRevealHome />
        <Separator className="w-[500px] mt-3" />
        <LoginForm />
      </section>
      <section>
        <ScrollSection />
      </section>
    </div>
  );
}

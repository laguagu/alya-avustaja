import { BoxRevealHome } from "@/components/BoxRevealHome";
import LoginForm from "@/components/login-form";
import ScrollSection from "@/components/scroll-section";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-100/85 to-blue-50/50 mx-auto w-full overflow-auto">
      <section className="max-w-[80rem] w-full">
        <BoxRevealHome />
        <div className="flex justify-center">
          <Separator className="w-[300px] md:w-[400px] lg:w-[500px] mt-3 h-[1.25px]" />
        </div>
        <LoginForm />
      </section>
      <section className="w-full py-20">
        <ScrollSection />
      </section>
    </div>
  );
}

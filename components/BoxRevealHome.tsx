import BoxReveal from "@/components/magicui/box-reveal";
import { Check } from "lucide-react";

const ittems = [
  "Tarkastella huoltokohteen vikailmoituksia",
  "Täydentää vikailmoituksia",
  "Saada tekoälyn avulla huonekalujen huolto-ohjeita",
];

export function BoxRevealHome() {
  return (
    // <div className="p-2 h-full max-w-[20rem] md:max-w-[32rem] items-start justify-start overflow-hidden pt-8 mx-auto">
    <div className="flex flex-col justify-center items-start p-4 py-2 px-4 md:py-8 md:px-20 h-full max-w-[20rem] md:max-w-[32rem] overflow-hidden pt-8 mx-auto">
      <BoxReveal boxColor={"#b6cfff"} duration={0.5}>
        <p className="text-[2.5rem] md:text-[3.5rem] font-semibold">
          Älyavustaja<span className="text-[#5046e6]">.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#b6cfff"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem] md:text-[1.5rem]">
          Huolto- ja hoito-ohjeita tarjoava{" "}
          <span className="text-[#5046e6]">Tekoälysovellus</span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor="#b6cfff" duration={0.5}>
        <div className="mt-6 text-sm md:text-base w-full">
          <p className="font-semibold mb-3">Sovelluksella voit:</p>
          <ul className="space-y-2">
            {ittems.map((item, index) => (
              <ListItem key={index} item={item} />
            ))}
          </ul>
        </div>
      </BoxReveal>
    </div>
  );
}

function ListItem({ item }: { item: string }) {
  return (
    <li className="flex items-center">
      <Check className="h-5 w-5 text-[#5046e6] mr-2" />
      <span>{item}</span>
    </li>
  );
}

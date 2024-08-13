import Marquee from "@/components/magicui/marquee";
import Image from "next/image";

const logos = [
  {
    img: "/logos/eurooppa-logo.png",
    alt: "Eurooppa logo",
  },
  {
    img: "/logos/liitto-logo.png",
    alt: "Liitto logo",
  },
  {
    img: "/logos/kierke-logo.png",
    alt: "Kierke logo",
  },
  {
    img: "/logos/hki-logo.png",
    alt: "Helsinki logo",
  },
  {
    img: "/logos/hh-logo.png",
    alt: "Haaga-Helia logo",
  },
];

const LogoCard = ({ img, alt }: { img: string; alt: string }) => {
  return (
    <div className="relative w-32 h-36 mx-4">
      <Image className="object-contain" fill alt={alt} src={img} />
    </div>
  );
};

export function MarqueeComponent() {
  return (
    <div className="relative flex h-32 w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:30s]">
        {logos.map((logo, index) => (
          <LogoCard key={index} {...logo} />
        ))}
      </Marquee>
    </div>
  );
}

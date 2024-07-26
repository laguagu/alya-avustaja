import Image from "next/image";

const partners = [
  { name: "Helsingin kaupunki", logo: "/hki-logo.png" },
  { name: "Haaga-Helia", logo: "/hh-logo.png" },
  // { name: "Lunni", logo: "/lunni-logo.png" },
  // { name: "Piiroinen", logo: "/piiroinen-logo.png" },
];

function PartnerLogos() {
  return (
    <div className="flex flex-wrap justify-center gap-8 mt-6">
      {partners.map((partner) => (
        <div key={partner.name} className="w-24 h-24 relative">
          <Image
            src={partner.logo}
            alt={`${partner.name} logo`}
            layout="fill"
            objectFit="contain"
          />
        </div>
      ))}
    </div>
  );
}

export default PartnerLogos;

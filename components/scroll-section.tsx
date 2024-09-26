"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import HomeContentSection from "./home-content-sectio";
import { MarqueeComponent } from "./moving.logos";
import PartnerLogos from "./partners-logos";

const LogoContainer = ({
  logos,
}: {
  logos: { src: string; alt: string }[];
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative z-10 w-full overflow-x-auto"
    >
      <div className="flex flex-nowrap justify-center md:justify-center min-w-full">
        {logos.map((logo, index) => (
          <div key={index} className="flex-shrink-0 mx-2">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={80}
              height={80}
              sizes="80px"
              className="transition-all duration-300 filter hover:brightness-110"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const sectionContents = [
  {
    title: "Älykäs vikailmoitusten käsittely",
    content:
      "Sovelluksemme hyödyntää edistynyttä tekoälyä kalusteiden vikailmoitusten käsittelyssä. Tekoäly analysoi vian kuvauksen, täydentää vikailmoituslomakkeen automaattisesti ja tarjoaa räätälöityjä hoito-ohjeita. Tämä nopeuttaa prosessia ja varmistaa tarkat, yksilölliset ratkaisut jokaiseen ongelmaan.",
    images: [
      "/homepage-images/ai-1-min.png",
      "/homepage-images/ai-2-min.png",
      "/homepage-images/ai-3-min.png",
    ],
  },
  {
    title: "Kattava vikailmoitushistoria ja seuranta",
    content:
      "Pidä kalusteidesi kunto optimaalisena helpon seurannan avulla. Sovellus tarjoaa vikailmoitusten tarkastelun ja reaaliaikaisen tilanneseurannan.",
    images: [
      "/homepage-images/vikailmoitus-1-min.png",
      "/homepage-images/vikailmoitus-2-min.png",
      "/homepage-images/vikailmoitus-3-min.png",
    ],
  },
  {
    title: "Yksilöity kalustetieto",
    content:
      "Tutustu kalusteisiin yksityiskohtaisesti sovelluksessamme. Näet jokaisen kalusteen tarkat tiedot ja osaluettelon. Tämä helpottaa huoltoa, varaosien hankintaa ja kalusteiden elinkaaren hallintaa.",
    images: [
      "/homepage-images/huonekalut-1-min.png",
      "/homepage-images/huonekalut-2-min.png",
      "/homepage-images/huonekalut-3-min.png",
    ],
  },
];

const logos = [
  {
    src: "/logos/hh-logo.png",
    alt: "Haaga-Helia logo",
  },
  {
    src: "/logos/hh-logo.png",
    alt: "Haaga-Helia logo",
  },
  {
    src: "/logos/hh-logo.png",
    alt: "Haaga-Helia logo",
  },
  {
    src: "/logos/hh-logo.png",
    alt: "Haaga-Helia logo",
  },
  {
    src: "/logos/hh-logo.png",
    alt: "Haaga-Helia logo",
  },
];

function ScrollSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const y0 = useTransform(scrollYProgress, [0, 0.2], [0, 0]); // FIXME -50 -> -25 tai 0 ?
  const y1 = useTransform(scrollYProgress, [0.1, 0.4], [50, 0]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.6], [50, 0]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.8], [50, 0]);

  // const opacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);
  // Luodaan useTransform hookit tässä
  const imageTransforms = [
    [
      useTransform(scrollYProgress, [0, 1], [0, isMobile ? -25 : -50]),
      useTransform(scrollYProgress, [0, 1], [0, isMobile ? -50 : -100]),
      useTransform(scrollYProgress, [0, 1], [0, isMobile ? -75 : -150]),
    ],
    [
      useTransform(scrollYProgress, [0, 1], [0, isMobile ? -50 : -100]),
      useTransform(scrollYProgress, [0, 1], [0, isMobile ? -100 : -200]),
      useTransform(scrollYProgress, [0, 1], [0, isMobile ? -150 : -300]),
    ],
    [
      useTransform(scrollYProgress, [0, 1], [0, isMobile ? -50 : -100]),
      useTransform(scrollYProgress, [0, 1], [0, isMobile ? -100 : -200]),
      useTransform(scrollYProgress, [0, 1], [0, isMobile ? -150 : -270]),
    ],
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen md:pt-32 pt-20 pb-28"
    >
      <div className="max-w-6xl mx-auto px-4 md:space-y-24 space-y-12">
        <motion.div style={{ y: y0 }} className="rounded-lg p-10  ">
          <div className="flex items-center justify-center flex-col max-w-4xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              // whileHover={{ scale: 1.95 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-16 -left-16 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute -bottom-16 -right-16 w-32 h-32 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
            />
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6 relative z-10">
              Älyä-hanke
            </h2>
            <p className="text-center text-xl text-gray-700 tracking-tight mt-2 mb-4 relative z-10">
              Tämä sovellus on kehitetty osana Älyä-hanketta - älykästä
              teknologiaa kalusteiden elinkaaren pidentämiseen
            </p>
            {/* Yhteistyökumppanit */}
            <MarqueeComponent />
          </div>
        </motion.div>
        {[y1, y2, y3].map((y, index) => (
          <HomeContentSection
            key={index}
            title={sectionContents[index].title}
            content={sectionContents[index].content}
            images={sectionContents[index].images}
            y={y}
            imageTransforms={imageTransforms[index]}
            index={index}
            scrollProgress={scrollYProgress}
          />
        ))}
        <motion.div
          style={{ opacity }}
          className="flex flex-col items-center bg-blue-50/85 backdrop-blur-sm rounded-2xl p-10 space-y-6 "
        >
          <h2 className="text-3xl font-bold text-gray-800 ">
            Yhteistyökumppanit
          </h2>
          <PartnerLogos />
        </motion.div>
      </div>
    </div>
  );
}

export default ScrollSection;

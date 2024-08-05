"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import PartnerLogos from "./partners-logos";
import { useMediaQuery } from "react-responsive";
import HomeContentSection from "./home-content-sectio";

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

function ScrollSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const y0 = useTransform(scrollYProgress, [0, 0.2], [0, 0]); // FIXME -50 -> -25 tai 0 ?
  const y1 = useTransform(scrollYProgress, [0.1, 0.3], [75, 0]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.5], [75, 0]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.7], [75, 0]);

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
      className="relative w-full min-h-screen pt-20 pb-28"
    >
      <div className="max-w-6xl mx-auto px-4 md:space-y-20 space-y-12">
        <motion.div style={{ y: y0 }} className="rounded-lg p-10">
          <div className="flex items-center justify-center flex-col max-w-4xl mx-auto">
            <h2 className="text-center  text-gray-700 tracking-tight">
              Tämä sovellus on kehitetty osana Älyä-hanketta - älykästä
              teknologiaa kalusteiden elinkaaren pidentämiseen
            </h2>
            <Image
              src={"/hh-logo.png"}
              priority
              alt="hh-logo"
              width={125}
              height={125}
              className="mt-4 transition-transform hover:scale-105"
              style={{ width: "auto", height: "auto" }}
            />
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
          />
        ))}
        <motion.div
          style={{ opacity }}
          className="flex flex-col items-center bg-blue-50/85 backdrop-blur-sm rounded-lg p-10 space-y-6 "
        >
          <h2 className="text-3xl font-bold text-gray-800 ">
            Yhteistyökumppanit
          </h2>
          {/* <p className="text-lg text-gray-600 text-center max-w-2xl">
              TÄHÄN JOTAIN TEKSTIÄ
          </p> */}
          <PartnerLogos />
        </motion.div>
      </div>
    </div>
  );
}

export default ScrollSection;

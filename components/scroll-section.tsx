"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import PartnerLogos from "./partners-logos";

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

  const y0 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const y1 = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.5], [100, 0]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.7], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  // Luodaan useTransform hookit tässä
  const imageTransforms = [
    [
      useTransform(scrollYProgress, [0, 1], [0, -50]),
      useTransform(scrollYProgress, [0, 1], [0, -100]),
      useTransform(scrollYProgress, [0, 1], [0, -150]),
    ],
    [
      useTransform(scrollYProgress, [0, 1], [0, -100]),
      useTransform(scrollYProgress, [0, 1], [0, -200]),
      useTransform(scrollYProgress, [0, 1], [0, -300]),
    ],
    [
      useTransform(scrollYProgress, [0, 1], [0, -150]),
      useTransform(scrollYProgress, [0, 1], [0, -300]),
      useTransform(scrollYProgress, [0, 1], [0, -450]),
    ],
  ];

  return (
    <div ref={containerRef} className="w-full py-20">
      <div className="max-w-6xl mx-auto px-4 space-y-0">
        <motion.div style={{ y: y0 }} className="rounded-lg p-10">
          <div className="flex items-center justify-center flex-col max-w-4xl mx-auto">
            <h2 className="text-center font-semibold text-gray-600 tracking-tight">
              Tämä sovellus on kehitetty osana Älyä-hanketta - älykästä
              teknologiaa kalusteiden elinkaaren pidentämiseen
            </h2>
            <Image
              src={"/hh-logo.png"}
              alt="hh-logo"
              width={125}
              height={125}
              className="mt-4"
            />
          </div>
        </motion.div>

        {[y1, y2, y3].map((y, index) => (
          <motion.div
            key={index}
            style={{ y }}
            className="flex flex-col md:flex-row items-center bg-transparent p-10 space-y-6 md:space-y-0 md:space-x-10"
          >
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {sectionContents[index].title}
              </h2>
              <p className="text-lg text-gray-600">
                {sectionContents[index].content}
              </p>
            </div>
            <div className="relative w-[50vh] h-[60vh]">
              {sectionContents[index].images.map((src, imgIndex) => (
                <motion.div
                  key={imgIndex}
                  style={{ y: imageTransforms[index][imgIndex] }}
                  className={`absolute ${
                    imgIndex === 0
                      ? "w-[50vh] h-[60vh] z-10"
                      : imgIndex === 1
                        ? "w-[30vh] h-[40vh] left-[20vh] top-[10vh] z-20"
                        : "w-[20vh] h-[25vh] left-[-5vh] top-[30vh] z-30"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Image ${imgIndex + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg shadow-md"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
        <motion.div
          style={{ opacity }}
          className="flex flex-col items-center bg-white/80 backdrop-blur-sm rounded-lg p-10 space-y-6"
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

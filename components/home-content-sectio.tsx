import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";

interface HomeContentSectionProps {
  title: string;
  content: string;
  images: string[];
  y: any;
  imageTransforms: any[];
  index: number;
  scrollProgress: MotionValue<number>;
}

const HomeContentSection: React.FC<HomeContentSectionProps> = ({
  title,
  content,
  images,
  y,
  imageTransforms,
  index,
  scrollProgress,
}) => {
  // Blob-efekti vain ensimmäiselle osiolle
  const blobOpacity = useTransform(
    scrollProgress,
    index === 0 ? [0, 0.1, 0.3, 0.4] : [0, 0.1, 0.9, 1],
    index === 0 ? [0, 0.2, 0.2, 0] : [0.2, 0.2, 0.2, 0.2],
  );
  console.log(index, y, scrollProgress);
  return (
    <motion.div
      style={{ y }}
      className="flex flex-col md:flex-row items-center p-10 space-y-6 md:space-y-20 md:space-x-10 relative"
    >
      {index === 0 && (
        <motion.div
          className="absolute -z-10 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[100px]"
          style={{
            opacity: blobOpacity,
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)",
            left: "-20%",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      )}
      <div className="flex-1 w-full md:w-auto mb-6 md:mb-0 relative z-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          {title}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">{content}</p>
      </div>

      <div className="relative w-full h-[70vh] md:w-[50vh] md:h-[70vh] z-10">
        {images.map((src, imgIndex) => (
          <motion.div
            key={imgIndex}
            style={{ y: imageTransforms[imgIndex] }}
            className={`absolute ${
              imgIndex === 0
                ? "w-[100%] h-[60vh] md:w-[50vh] z-10"
                : imgIndex === 1
                  ? "w-[60%] h-[60%] left-[20%] top-[20%] z-20"
                  : "w-[40%] h-[40%] left-[10%] top-[30%] z-30"
            }`}
          >
            <Image
              src={src}
              alt={`Kuva ${imgIndex + 1}: ${title}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-lg shadow-md object-cover"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HomeContentSection;

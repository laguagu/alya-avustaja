import { motion } from "framer-motion";
import Image from "next/image";

interface HomeContentSectionProps {
  title: string;
  content: string;
  images: string[];
  y: any;
  imageTransforms: any[];
}

const HomeContentSection: React.FC<HomeContentSectionProps> = ({
  title,
  content,
  images,
  y,
  imageTransforms,
}) => (
  <motion.div
    style={{ y }}
    className="flex flex-col md:flex-row items-center bg-transparent p-10 space-y-6 md:space-y-0 md:space-x-10"
  >
    <div className="flex-1 w-full md:w-auto mb-6 md:mb-0">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
      <p className="text-lg text-gray-600">{content}</p>
    </div>
    <div className="relative w-full h-[70vh] md:w-[50vh] md:h-[70vh]">
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
            alt={`Image ${imgIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg shadow-md object-cover"
          />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default HomeContentSection;

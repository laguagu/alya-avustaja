import { useInView } from "react-intersection-observer";
import BlurIn from "@/components/magicui/blur-in";

export const TextBlurAnimation = ({ word }: { word: string }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return <div ref={ref}>{inView && <BlurIn word={word} />}</div>;
};

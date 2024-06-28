"use client";
import React, { useState } from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconSquareRoundedCheck,
  IconAlertSquare,
} from "@tabler/icons-react";
import { FilteredServiceItem } from "@/data/types";
import Image from "next/image";
import { Button } from "./ui/button";

export function BentoGridDemo({ issues }: { issues: FilteredServiceItem[] }) {
  const [showCompleted, setShowCompleted] = useState(true);

  const toggleShowCompleted = () => setShowCompleted(!showCompleted);

  const filteredIssues = issues.filter(
    (issue) => showCompleted || issue.is_completed !== 1
  );

  const issueItems = filteredIssues.map((issue, i) => ({
    issue_id: issue.id,
    title: issue.name,
    description: issue.problem_description,
    priority: issue.priority,
    device_id: issue.device_id,
    header: <ImageSkeleton src={"/chairs/arena022.jpg"} />,
    icon:
      issue.is_completed === 1 ? (
        <div className="flex items-center">
        <IconSquareRoundedCheck className="h-4 w-4 text-neutral-500 " />
        <span className="ml-2">Valmis</span>
        </div>
      ) : (
        <div className="flex items-center">
        <IconAlertSquare className="h-4 w-4 text-neutral-500" />
        <span className="ml-2">Avoin</span>
      </div>
      ),
    className: i === 3 || i === 6 ? "md:col-span-2" : "",
  }));

  return (
    <div>
      <Button onClick={toggleShowCompleted}
      className="absolute top-0 right-0 mt-2 mr-4"
      variant={"outline"}
      >
        {showCompleted
          ? "Näytä vain avoimet vikailmoitukset"
          : "Näytä kaikki vikailmoitukset"}
      </Button>
      <BentoGrid className="max-w-4xl mx-auto">
        {issueItems.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            issue_id={item.issue_id}
            device_id={item.device_id}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </div>
  );
}

const ImageSkeleton = ({ src }: { src: string }) => (
  <div className="relative flex justify-center items-center w-full  min-h-[6rem] rounded-xl md:h-full h-64">
    <Image
      src={src}
      alt="Vikailmoituksen kuva"
      layout="fill"
      objectFit="cover"
      className="rounded-xl sm:object-cover md:object-contain"
    />
  </div>
);

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const issueItems = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
];

// Esimerkki
const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <Skeleton />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <Skeleton />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Power of Communication",
    description:
      "Understand the impact of effective communication in our lives.",
    header: <Skeleton />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Pursuit of Knowledge",
    description: "Join the quest for understanding and enlightenment.",
    header: <Skeleton />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Joy of Creation",
    description: "Experience the thrill of bringing ideas to life.",
    header: <Skeleton />,
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Spirit of Adventure",
    description: "Embark on exciting journeys and thrilling discoveries.",
    header: <Skeleton />,
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];

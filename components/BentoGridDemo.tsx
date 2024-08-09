"use client";
import React, { useState } from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconClipboardCopy,
  IconSquareRoundedCheck,
  IconAlertSquare,
} from "@tabler/icons-react";
import { FilteredServiceItem } from "@/data/types";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

export function BentoGridDemo({ issues }: { issues: FilteredServiceItem[] }) {
  const [showCompleted, setShowCompleted] = useState(false);

  const toggleShowCompleted = (checked: boolean) =>
    setShowCompleted(!showCompleted);

  const filteredIssues = issues.filter(
    (issue) => showCompleted || issue.is_completed !== 1,
  );

  const issueItems = filteredIssues.map((issue, i) => ({
    issue_id: issue.id,
    title: issue.name,
    description: issue.problem_description,
    priority: issue.priority,
    device_id: issue.device_id,
    header: <ImagePreview src={issue.content_url || "/vikailmoitus.png"} />,
    icon:
      issue.is_completed === 1 ? (
        <div className="flex items-center">
          <IconSquareRoundedCheck className="h-4 w-4 text-neutral-500 " />
          <span className="ml-2 text-green-500">Valmis</span>
        </div>
      ) : (
        <div className="flex items-center">
          <IconAlertSquare className="h-4 w-4 text-neutral-500" />
          <span className="ml-2 text-red-500">Avoin</span>
        </div>
      ),
    className: i === 3 || i === 6 ? "md:col-span-2" : "",
  }));

  return (
    <div>
      <form className="absolute top-2 right-0 mt-2 mr-4 flex items-center">
        <label
          className="text-gray-700 font-medium mr-4"
          htmlFor="show-completed"
        >
          Kaikki vikailmoitukset
        </label>
        <Switch
          className="SwitchRoot"
          id="show-completed"
          checked={showCompleted}
          onCheckedChange={toggleShowCompleted}
        ></Switch>
      </form>
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

const ImagePreview = ({ src }: { src: string }) => (
  <div className="relative flex justify-center items-center w-full  min-h-[6rem] rounded-xl md:h-full h-64">
    <Image
      src={src}
      alt="Vikailmoituksen kuva"
      fill
      priority={true}
      style={{ objectFit: "cover" }}
      className="rounded-xl sm:object-cover md:object-contain"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

// Esimerkki
const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
];

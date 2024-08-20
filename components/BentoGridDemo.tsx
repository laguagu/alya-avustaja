"use client";
import React, { useMemo, useState } from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { IconSquareRoundedCheck, IconAlertSquare } from "@tabler/icons-react";
import { FilteredServiceItem } from "@/data/types";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

export function BentoGridDemo({ issues }: { issues: FilteredServiceItem[] }) {
  const [showCompleted, setShowCompleted] = useState(false);

  const toggleShowCompleted = (checked: boolean) =>
    setShowCompleted(!showCompleted);

  const filteredIssues = useMemo(
    () => issues.filter((issue) => showCompleted || issue.is_completed !== 1),
    [issues, showCompleted],
  );
  const issueItems = useMemo(
    () =>
      filteredIssues.map((issue, i) => ({
        issue_id: issue.id,
        title: issue.name,
        description: issue.problem_description,
        priority: issue.priority,
        device_id: issue.device_id,
        header: (
          <ImagePreview
            src={issue.content_url || "/vikailmoitus.png"}
            index={i}
          />
        ),
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
      })),
    [filteredIssues],
  );

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
      <BentoGrid className="max-w-5xl mx-auto md:mt-10 mt-1">
        {issueItems.map((item, i) => (
          <BentoGridItem
            key={item.issue_id}
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


const ImagePreview = ({ src, index }: { src: string; index: number }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="relative flex justify-center items-center w-full min-h-[6rem] rounded-xl md:h-full h-64">
      <Image
        src={imgSrc}
        alt="Vikailmoituksen kuva"
        fill
        quality={48}
        priority={index < 4} // Priorisoi vain ensimmäiset 4 kuvaa
        style={{ objectFit: "cover" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="rounded-xl sm:object-cover md:object-contain"
        onError={() => {
          setImgSrc("/vikailmoitus.png"); // Fallback-kuva
        }}
      />
    </div>
  );
};

"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Package, ClipboardPlus, TriangleAlert, Users } from "lucide-react";
import { Button } from "./ui/button";

export default function DashboardCards() {
  const cards = [
    {
      title: "Vikalista",
      description:
        "Tarkastele kaikkia huonekaluihin liittyviä vikailmoituksia.",
      icon: TriangleAlert,
      link: "/alya/issues/",
      linkText: "Tarkastele vikoja",
    },
    {
      title: "Huonekalut",
      description: "Tarkastele kaikkia saatavilla olevia huonekaluja.",
      icon: Package,
      link: "/alya/furnitures",
      linkText: "Katso huonekalut",
    },
    {
      title: "Chatbot",
      description:
        "Keskustele chatbotin kanssa ja saa apua huonekalun huoltoon.",
      icon: Users,
      link: "/alya/chat",
      linkText: "Aloita chat",
    },
    {
      title: "Uusi vikailmoitus",
      description: "Luo uusi vikailmoitus huonekalulle.",
      icon: ClipboardPlus,
      link: "/alya/issues/new-issue",
      linkText: "Uusi vikailmoitus",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        easeOut: [0.48, 0.15, 0.25, 0.96], // Pehmeä ease-out
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <motion.div key={index} variants={item} viewport={{ once: true }}>
          <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <card.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{card.title}</h3>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">
                {card.description}
              </p>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                asChild
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
              >
                <Link href={card.link} prefetch={false}>
                  {card.linkText}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

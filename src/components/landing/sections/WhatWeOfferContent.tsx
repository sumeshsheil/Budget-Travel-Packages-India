"use client";

import React from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  NotebookPen,
  Plane,
  Ticket,
  Stamp,
  Hotel,
  ThumbsUp,
} from "lucide-react";

interface ServiceItem {
  icon: React.ElementType;
  title: string;
}

const services: ServiceItem[] = [
  {
    icon: NotebookPen,
    title: "Custom-made itineraries",
  },
  {
    icon: Plane, // Using Plane as closest match for transfers/sightseeing in this context if specific icon unavailable
    title: "Transfers, Sightseeing & Activities",
  },
  {
    icon: Ticket,
    title: "Flight & Train Tickets",
  },
  {
    icon: Stamp, // Using Stamp for Visa/Passport support
    title: "Visa & travel insurance support",
  },
  {
    icon: Hotel,
    title: "Hotel & Cruise Bookings",
  },
  {
    icon: ThumbsUp,
    title: "Special Request Accepted",
  },
];

const WhatWeOfferContent: React.FC = () => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto"
    >
      {services.map((service, index) => (
        <motion.div
          key={index}
          variants={staggerItem}
          className="bg-secondary rounded-xl p-4 flex items-center gap-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="shrink-0">
            <service.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
          <p className="text-white font-open-sans font-semibold text-base md:text-lg">
            {service.title}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default WhatWeOfferContent;

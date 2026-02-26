"use client";
import YellowStar from "@/components/icons/YellowStar";
import React from "react";
import { motion } from "motion/react";
const Marquee: React.FC = () => {
  const titles = [
    {
      title: "Pre-Book Domestic Packages @ ₹666",
      icon: YellowStar,
    },
    {
      title: "Pre-Book International Packages @ ₹999",
      icon: YellowStar,
    },
    {
      title: "Pre-Book Devotional Packages @ ₹333",
      icon: YellowStar,
    },
    {
      title: "Pre-Book Domestic Packages @ ₹666",
      icon: YellowStar,
    },
    {
      title: "Pre-Book International Packages @ ₹999",
      icon: YellowStar,
    },
    {
      title: "Pre-Book Devotional Packages @ ₹333",
      icon: YellowStar,
    },
    {
      title: "Pre-Book Domestic Packages @ ₹666",
      icon: YellowStar,
    },
    {
      title: "Pre-Book International Packages @ ₹999",
      icon: YellowStar,
    },
    {
      title: "Pre-Book Devotional Packages @ ₹333",
      icon: YellowStar,
    },
  ];
  return (
    <div
      className="bg-secondary w-full py-2"
      role="region"
      aria-label="Our services marquee"
    >
      <div className="overflow-hidden group">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex shrink-0 items-center group-hover:pause"
          >
            {titles.map((title, index) => (
              <div key={`original-${index}`} className="flex items-center pr-8">
                <h6 className="font-open-sans font-bold pr-10 text-white whitespace-nowrap text-lg md:text-xl lg:text-[20px]">
                  {title.title}
                </h6>
                {title.icon && <title.icon />}
              </div>
            ))}
          </motion.div>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex shrink-0 items-center group-hover:[animation-play-state:paused]"
            aria-hidden="true"
          >
            {titles.map((title, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex items-center pr-8"
              >
                <h6 className="font-open-sans font-bold pr-10 text-white whitespace-nowrap text-lg md:text-xl lg:text-[20px]">
                  {title.title}
                </h6>
                {title.icon && <title.icon />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;

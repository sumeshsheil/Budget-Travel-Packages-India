"use client";

import React from "react";
import { motion } from "motion/react";

const HeroContent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <h1 className="text-white max-w-5xl xl:max-w-6xl font-inter font-extrabold text-4xl md:text-6xl  leading-tight tracking-tight drop-shadow-lg">
        Customized Domestic & International Tour Plan with{" "}
        <span className="text-primary">Budget Travel Packages</span>
      </h1>

      <p className="font-open-sans font-semibold text-lg md:text-2xl lg:text-[40px]  mt-6 mb-8 max-w-4xl text-white/90 px-4 leading-relaxed drop-shadow-md">
        Book customized domestic & international vacation plan from India.
      </p>

      <div className="inline-block px-6 py-2">
        <p className="font-open-sans font-bold text-accent text-lg md:text-2xl lg:text-[48px] tracking-wide drop-shadow-sm">
          Explore More, Spend Less!
        </p>
      </div>
    </motion.div>
  );
};

export default HeroContent;

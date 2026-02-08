"use client";

import React from "react";
import Button from "../ui/button";
import PokeIcon from "@/components/icons/PokeIcon";
import { motion } from "motion/react";

const HeroContent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <h1 className="text-white max-w-[1110px] font-inter font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
        Customized Domestic & International Tour Plan with{" "}
        <span className="text-accent">Budget Travel Packages</span>
      </h1>

      <p className="font-open-sans font-semibold text-lg md:text-xl lg:text-2xl mt-6 mb-6 max-w-[828px] text-white px-4">
        Book customized domestic & international vacation plan from India.
        Flights, Trains, Hotels, Sightseeing & much more...(As you like it)
      </p>
      <p className="font-open-sans font-bold text-primary text-lg md:text-xl lg:text-2xl  px-4">
        Explore More, Spend Less!
      </p>
    </motion.div>
  );
};

export default HeroContent;

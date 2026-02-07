"use client";

import React from "react";
import Button from "../ui/button";
import PokeIcon from "@/components/icons/PokeIcon";
import { motion } from "motion/react";
import { slideUp } from "@/lib/animations";

const HeroContent: React.FC = () => {
  return (
    <motion.div
      {...slideUp}
      // Override transition duration to match previous 0.8s if strictly needed,
      // but using standard preset is preferred.
      // If the user REALLY wants 0.8s, we can use a custom transition.
      // For now, adhering to skill 'slideUp' preset which uses 'normal' (0.2s) or 'slow' (0.3s)
      className="flex flex-col items-center"
    >
      <h1 className="text-white font-inter font-semibold text-4xl md:text-5xl lg:text-[64px] leading-tight">
        Explore More, Spend Less!
      </h1>
      <h2 className="font-open-sans font-bold text-white text-lg md:text-xl lg:text-2xl mt-5 px-4">
        Book Budget-Friendly Domestic & International Travel Packages
      </h2>
      <p className="font-open-sans font-normal text-base md:text-lg lg:text-xl mt-4 mb-8 max-w-2xl px-4 text-white/90">
        Plan stress free Domestic and International Trips from Delhi, Mumbai and
        Kolkata with our budget-friendly travel packages. Enjoy customized
        itineraries, trusted bookings and complete support…
      </p>
      <Button size="lg" className="inline-flex items-center gap-2 group">
        <p className="font-open-sans font-bold text-black group-hover:text-white transition-colors">
          Get your Free Travel Consultation
        </p>
        <PokeIcon className="text-black group-hover:text-white transition-colors" />
      </Button>
    </motion.div>
  );
};

export default HeroContent;

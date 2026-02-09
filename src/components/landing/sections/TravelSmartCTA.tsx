"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Button from "../ui/button";

import arrowLine from "@/../public/images/shapes/curve-line.svg";
import cityPlane from "@/../public/images/shapes/city-plane.svg";

const TravelSmartCTA: React.FC = () => {
  return (
    <section
      className="pt-20 relative overflow-hidden bg-white"
      aria-labelledby="cta-heading"
    >
      {/* Background Arrow Line Pattern */}
      <div className="absolute top-0 left-0 h-full w-1/2 z-0 pointer-events-none">
        <Image
          src={arrowLine}
          alt=""
          className="w-full h-auto object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="container-box px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-between ">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h2
              id="cta-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-inter font-semibold text-black"
            >
              Travel Smart.
              <br />
              <span className="text-primary">Explore More, Spend Less!</span>
            </h2>

            <p className="mt-4 md:mt-6 text-base md:text-lg text-black max-w-[700px] mx-auto lg:mx-0 leading-relaxed">
              Let our travel experts create a memorable journey with the best
              deals, customized itineraries and budget friendly travel packages.
            </p>

            <div className="mt-6 md:mt-8 lg:mb-20">
              <Button
                variant="secondary"
                size="lg"
                aria-label="Start customizing your trip"
                className="px-20 py-4.5 font-open-sans font-bold text-base md:text-xl"
              >
                Customize My Trip
              </Button>
            </div>
          </motion.div>

          {/* Right Content - City Plane Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full">
              <Image
                src={cityPlane}
                alt="Illustration of famous landmarks and travel destinations"
                fill
                className="w-full h-auto absolute bottom-0"
                priority={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TravelSmartCTA;

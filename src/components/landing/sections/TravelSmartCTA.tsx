"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Lottie from "lottie-react";
import Link from "next/link";

import arrowLine from "@/../public/images/shapes/curve-line.svg";

const TravelSmartCTA: React.FC = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/lottie/travel-smart.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Lottie animation:", err));
  }, []);

  return (
    <section
      className="pt-20 relative overflow-hidden bg-white"
      aria-labelledby="cta-heading"
    >
      

      <div className="container-box px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-between items-center gap-8">
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
              <Link
                className="bg-secondary text-white px-16 py-2.5 font-open-sans font-bold text-base md:text-xl rounded-full"
                href="tel:+919242868839"
              >
                +91 92428 68839
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[600px]">
              {animationData && (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  className="w-full h-auto"
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TravelSmartCTA;

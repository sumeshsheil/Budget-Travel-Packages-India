"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import Lottie from "lottie-react";
import Link from "next/link";
import { PhoneCall, Mail } from "lucide-react";

const TravelSmartCTA: React.FC = () => {
  const [animationData, setAnimationData] = useState<object | null>(null);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-between items-end gap-8">
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

            <div className="mt-6 md:mt-8 lg:mb-20 flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
              <Link
                className="group flex items-center gap-3 bg-primary text-secondary-text w-full sm:w-auto px-6 py-3 rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                href="tel:+919242868839"
              >
                <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">
                    Call Us Now
                  </span>
                  <span className="font-bold whitespace-nowrap text-lg leading-tight">
                    +91 92428 68839
                  </span>
                </div>
              </Link>

              <Link
                className="group flex items-center gap-3 bg-new-blue text-white w-full sm:w-auto px-6 py-3 rounded-full hover:bg-new-blue/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                href="mailto:hello@budgettravelpackages.in"
              >
                <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">
                    Send Email
                  </span>
                  <span className="font-bold text-base lg:text-lg leading-tight">
                    hello@budgettravelpackages.in
                  </span>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-end items-end"
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

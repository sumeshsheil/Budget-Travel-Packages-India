"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

import icon1 from "@/../public/images/service-we-offer/icons/icon1.svg";
import icon2 from "@/../public/images/service-we-offer/icons/icon2.svg";
import icon3 from "@/../public/images/service-we-offer/icons/icon3.svg";
import icon4 from "@/../public/images/service-we-offer/icons/icon4.svg";
import icon5 from "@/../public/images/service-we-offer/icons/icon5.svg";
import icon6 from "@/../public/images/service-we-offer/icons/icon6.svg";

import bgParachute from "@/../public/images/service-we-offer/background.png";
import mapShape from "@/../public/images/shapes/map.svg";

const services = [
  {
    id: 1,
    title: "Domestic and International Tours",
    icon: icon1,
  },
  {
    id: 2,
    title: "Transfers, Sightseeing & Activities",
    icon: icon2,
  },
  {
    id: 3,
    title: "Flight & Train Tickets",
    icon: icon3,
  },
  {
    id: 4,
    title: "Visa & travel insurance support",
    icon: icon4,
  },
  {
    id: 5,
    title: "Hotels, Resorts & Cruise Bookings",
    icon: icon5,
  },
  {
    id: 6,
    title: "Special Request Accepted",
    icon: icon6,
  },
];

import LottieAnimation from "../../ui/LottieAnimation";

const ServicesWeOffer: React.FC = () => {
  return (
    <section
      id="services"
      className="pb-10 lg:py-25 relative bg-white scroll-mt-24"
    >
      {/* Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  pointer-events-none z-0"
      >
        <Image src={bgParachute} alt="" className="w-auto h-auto" />
      </motion.div>
      <div className="md:absolute mx-auto md:-top-15 md:right-10 xl:-top-15 xl:right-20 w-48 md:w-50 lg:w-60 xl:w-80 -mt-4">
        <LottieAnimation
          src="/animations/travel-map.json"
          width="100%"
          height="auto"
          className="w-full h-auto"
          loop={true}
          autoplay={true}
        />
      </div>

      <div className="container-box relative z-10 px-4">
        {/* Header */}
        <div className="items-center gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-inter font-bold text-secondary-text">
            Services We Offer:
          </h2>
        </div>

        {/* Services Grid */}
        {/* Services Grid Split for Mobile Ordering */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Column (Indices 0, 2, 4...) */}
          <div className="flex-1 flex flex-col gap-6">
            {services
              .filter((_, i) => i % 2 === 0)
              .map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border-2 border-secondary text-black rounded-xl pl-3 py-3 pr-1 sm:py-4 sm:pr-2 sm:pl-4 md:py-6 md:pr-4 md:pl-6 flex items-center cursor-default group"
                >
                  <div className="bg-transparent p-2 mr-4">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 md:w-12 md:h-12"
                    />
                  </div>
                  <h3 className="font-bold text-base md:text-xl font-inter">
                    {service.title}
                  </h3>
                </motion.div>
              ))}
          </div>

          {/* Right Column (Indices 1, 3, 5...) */}
          <div className="flex-1 flex flex-col gap-6">
            {services
              .filter((_, i) => i % 2 !== 0)
              .map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border-2 border-secondary text-black rounded-xl pl-3 py-3 pr-1 sm:py-4 sm:pr-2 sm:pl-4 md:py-6 md:pr-4 md:pl-6 flex items-center cursor-default group"
                >
                  <div className="bg-transparent p-2 mr-4">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 md:w-12 md:h-12"
                    />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl font-inter">
                    {service.title}
                  </h3>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesWeOffer;

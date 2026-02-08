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
    title: "Custom-made itineraries",
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
    title: "Hotel & Cruise Bookings",
    icon: icon5,
  },
  {
    id: 6,
    title: "Special Request Accepted",
    icon: icon6,
  },
];

const ServicesWeOffer: React.FC = () => {
  return (
    <section className="py-28 lg:py-35 relative bg-white">
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

      <div className="container-box relative z-10 px-4">
        {/* Header */}
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-inter font-bold text-secondary-text">
            Services We Offer:
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white border-2 border-secondary text-black rounded-xl pl-3 py-3 pr-1 sm:py-4 sm:pr-2 sm:pl-4 md:py-6 md:pr-4 md:pl-6 flex items-center  cursor-default group"
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
      {/* Map Decoration */}
      <div className="absolute bottom-0 right-0 w-54 md:w-64 pointer-events-none">
        <Image src={mapShape} alt="" className="w-full h-auto" />
      </div>
    </section>
  );
};

export default ServicesWeOffer;

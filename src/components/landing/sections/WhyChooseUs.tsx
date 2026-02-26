"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Button from "../ui/button";

import icon1 from "@/../public/images/why-choose-us/icon1.svg";
import icon2 from "@/../public/images/why-choose-us/icon2.svg";
import icon3 from "@/../public/images/why-choose-us/icon3.svg";
import icon4 from "@/../public/images/why-choose-us/icon4.svg";
import icon5 from "@/../public/images/why-choose-us/icon5.svg";
import icon6 from "@/../public/images/why-choose-us/icon6.svg";
import bgPattern from "@/../public/images/why-choose-us/background.svg";

const features = [
  {
    id: 1,
    title: "Transparent Pricing",
    description: "No hidden charges, no last-minute surprises",
    icon: icon1,
  },
  {
    id: 2,
    title: "Personalized Travel Planning",
    description: "Trips customized to your budget & preferences",
    icon: icon2,
  },
  {
    id: 3,
    title: "End-to-End Support",
    description: "Assistance from planning to return journey",
    icon: icon3,
  },
  {
    id: 4,
    title: "Best Value for Money",
    description: "Smart planning to maximize your travel experience",
    icon: icon4,
  },
  {
    id: 5,
    title: "Trusted by travelers across India",
    description: "Serving Delhi, Mumbai & Kolkata",
    icon: icon5,
  },
  {
    id: 6,
    title: "Hassle-Free Bookings",
    description: "We handle everything for you",
    icon: icon6,
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section
      id="about"
      className="py-20 relative bg-white overflow-hidden scroll-mt-24"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={bgPattern}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="container-box relative z-10 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-black">
            Why Choose Us
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className=" border border-secondary rounded-[10px] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-lg md:text-xl text-black mb-3 font-inter">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-[250px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              document
                .getElementById("start-planning")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-new-blue text-white font-bold py-3 px-10 rounded-full hover:shadow-lg transition-shadow text-base md:text-lg"
          >
            Customize My Trip
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

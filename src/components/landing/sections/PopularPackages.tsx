"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

import familyImg from "@/../public/images/banner/family.jpeg";
import honeymoonImg from "@/../public/images/banner/honeymoon.jpeg";
import adventureImg from "@/../public/images/banner/adventure.jpeg";

const packages = [
  {
    id: 1,
    title: "Family",
    image: familyImg,
    alt: "family packages",
    description: "Create lasting memories with our family-friendly tours.",
  },
  {
    id: 2,
    title: "Honeymoon",
    image: honeymoonImg,
    alt: "honeymoon packages",
    description: "Experience the perfect romantic getaway.",
  },
  {
    id: 3,
    title: "Adventure",
    image: adventureImg,
    alt: "adventure packages",
    description: "Thrilling adventures for the wild at heart.",
  },
];

const PopularPackages: React.FC = () => {
  return (
    <section
      id="travel-purpose"
      className="py-16 md:py-24 bg-[#FAFAFA] scroll-mt-24"
      aria-labelledby="popular-packages-heading"
    >
      <div className="container-box px-4">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <h2
            id="popular-packages-heading"
            className="text-3xl md:text-4xl lg:text-[40px] font-inter font-bold text-black mb-4 leading-tight"
          >
            Popular Travel Packages For
            <br className="hidden md:block" /> Every{" "}
            <span className="text-secondary">Purpose & Budget</span>
          </h2>
        </header>

        {/* Packages Grid */}
        <div
          className="grid grid-cols-1  lg:grid-cols-3 gap-6 md:gap-8"
          role="list"
        >
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              role="listitem"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all max-w-[600px] mx-auto duration-300 w-full aspect-4/4"
            >
              <article className="h-full w-full relative">
                {/* Image */}
                <Image
                  src={pkg.image}
                  alt={pkg.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  placeholder="blur"
                />
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;

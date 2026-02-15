"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

import dailyhunt from "@/../public/images/brands/dailyhunt.svg";
import enterpreneur from "@/../public/images/brands/enterpreneur.svg";
import hindustan from "@/../public/images/brands/hindustan.svg";
// import trind from "@/../public/images/brands/trind.svg";
import googleNews from "@/../public/images/brands/google-news.png";
import cityCarnival from "@/../public/images/brands/citycarnival.png";
import indianPublisher from "@/../public/images/brands/indian-publisher.png";
import indiaVoice from "@/../public/images/brands/india-voice.png";
import foxStory from "@/../public/images/brands/fox-story.png";
import hindustanTimes from "@/../public/images/brands/hindustan-time.png";
import businessUpdate from "@/../public/images/brands/business-update.png";
const brands = [
  { name: "Dailyhunt", logo: dailyhunt },
  { name: "Entrepreneur Street", logo: enterpreneur },
  { name: "Medium", logo: hindustan },
  { name: "Google News", logo: googleNews },
  { name: "City Carnival", logo: cityCarnival },
  { name: "Indian Publisher", logo: indianPublisher },
  // { name: "India Voice", logo: indiaVoice },
  { name: "Fox story", logo: foxStory },
  { name: "Hindustan Times", logo: hindustanTimes },
  { name: "Business Update", logo: businessUpdate },
  // { name: "Hindustan Times", logo: trind },
];

const FeaturedIn: React.FC = () => {
  return (
    <section className="py-12 bg-white" aria-labelledby="featured-in-heading">
      <div className="container-box px-4">
        {/* Header */}
        <header className="text-center mb-10">
          <h2
            id="featured-in-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-inter font-bold text-black"
          >
            Featured In Leading{" "}
            <span className="text-primary">Media Sites</span>
          </h2>
        </header>

        {/* Brand Carousel */}
        <div
          className="overflow-hidden group"
          role="region"
          aria-label="Featured media partners carousel"
        >
          <div className="flex items-center">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex shrink-0 items-center group-hover:paused"
              style={{ willChange: "transform" }}
            >
              {brands.map((brand, index) => (
                <div
                  key={`brand-${index}`}
                  className="flex items-center justify-center overflow-hidden h-[100px] ml-8 md:ml-16 px-6 py-4 w-[277px] rounded-[5px] bg-[#f5f5f5]"
                >
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={150}
                    height={50}
                    className="h-auto w-auto object-cover object-center"
                  />
                </div>
              ))}
            </motion.div>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex shrink-0 items-center  group-hover:paused"
              style={{ willChange: "transform" }}
              aria-hidden="true"
            >
              {brands.map((brand, index) => (
                <div
                  key={`brand-dup-${index}`}
                  className="flex items-center justify-center overflow-hidden h-[100px] ml-8 md:ml-16 px-6 py-4 w-[277px] rounded-[5px] bg-[#f5f5f5]"
                >
                  <Image
                    src={brand.logo}
                    alt=""
                    width={150}
                    height={50}
                    className="h-auto w-auto object-cover object-center"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Spotlight Badge */}
        <div className="flex justify-center mt-10">
          <span className="inline-flex items-center px-6 py-2 bg-primary/16 text-black font-open-sans font-bold text-sm md:text-base lg:text-xl rounded-full">
            Our Brand In The Spotlight
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;

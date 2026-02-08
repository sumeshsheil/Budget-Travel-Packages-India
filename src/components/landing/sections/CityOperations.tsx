"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Button from "../ui/button";

import kolkataImg from "@/../public/images/city/kolkata.png";
import delhiImg from "@/../public/images/city/delhi.png";
import mumbaiImg from "@/../public/images/city/mumbai.png";
import planeShape from "@/../public/images/shapes/plane.svg";
import arrowLineShape from "@/../public/images/shapes/arrow-line.svg";

const cityData = [
  {
    id: "kolkata",
    title: "Budget Travel Packages In Kolkata",
    highlight: "In Kolkata",
    highlightColor: "text-[#C90000]", // Red
    description:
      "Looking for affordable travel options from Kolkata? We specialize in customized domestic and international tour packages with smooth departures from Netaji Subhas Chandra Bose International Airport (CCU) and major railway stations like Howrah Junction (HWH), Sealdah (SDAH), Kolkata (KOAA), Shalimar (SHM) or Santragachi (SRC).",
    image: kolkataImg,
    alt: "Kolkata City Landmark - Howrah Bridge",
    imgPos: "left",
  },
  {
    id: "delhi",
    title: "Budget Travel Packages In Delhi",
    highlight: "In Delhi",
    highlightColor: "text-[#FFD700]", // Yellow/Gold
    description:
      "Traveling from Delhi? Budget Travel Packages offers fully customized domestic and international tour packages with departures from Indira Gandhi International Airport (DEL) and major railway stations like New Delhi Railway Station (NDLS), Old Delhi (DLI), Hazrat Nizamuddin (NZM), Anand Vihar Terminal (ANVT) or Delhi Sarai Rohilla (DEE).",
    image: delhiImg,
    alt: "Delhi City Landmark - India Gate",
    imgPos: "right",
  },
  {
    id: "mumbai",
    title: "Budget Travel Packages In Mumbai",
    highlight: "In Mumbai",
    highlightColor: "text-primary", // Green
    description:
      "Mumbai travelers can book budget friendly customized tour packages designed around flexible schedules and competitive flight options from Chhatrapati Shivaji Maharaj International Airport (BOM) and major railway stations like Chhatrapati Shivaji Maharaj Terminus (CSMT), Mumbai Central (MMCT) or Lokmanya Tilak Terminus (LTT).",
    image: mumbaiImg,
    alt: "Mumbai City Landmark - Gateway of India",
    imgPos: "left",
  },
];

const CityOperations: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-white">
      {/* Decorative Shapes */}
      <div className="absolute top-10 left-4 md:left-10 w-[145px] opacity-20 md:opacity-100 pointer-events-none">
        <Image
          src={arrowLineShape}
          alt=""
          width={145}
          height={246}
          className="w-full h-auto"
        />
      </div>
      <div className="absolute top-20 right-4 md:right-10 w-32 md:w-48 opacity-20 md:opacity-100 pointer-events-none">
        <Image src={planeShape} alt="" width={200} height={150} />
      </div>

      <div className="relative z-10 mb-16 md:mb-24 px-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-inter font-bold text-black leading-tight mb-6">
            Why Budget Travel Packages Is One Of
            <br className="hidden md:block" /> The{" "}
            <span className="text-primary">
              Best Travel Companies In India?
            </span>
          </h2>
          <div className="inline-block bg-primary px-6 py-2 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300">
            <p className="font-bold text-black text-sm md:text-base">
              Multi City Operations - #Kolkata | #Delhi | #Mumbai
            </p>
          </div>
        </div>
      </div>

      {/* City Content Blocks */}
      <div className="space-y-0">
        {cityData.map((city) => (
          <div key={city.id} className="relative w-full py-16 md:py-24">
            <div className="absolute bottom-0 left-0 w-full border-b-2 border-dashed border-secondary/50 z-20" />

            <div
              className={`absolute top-0 bottom-0 w-full h-full flex items-center ${
                city.imgPos === "left" ? "justify-start" : "justify-end"
              } pointer-events-none`}
            >
              <div className="relative h-full w-auto max-w-[50%]">
                <Image
                  src={city.image}
                  alt={city.alt}
                  className="h-full w-auto object-contain object-bottom"
                />
              </div>
            </div>

            <div className="container-box relative z-10">
              <div
                className={`flex flex-col lg:flex-row items-center justify-center`}
              >
                <div className="w-full max-w-[800px] flex flex-col items-center justify-center text-center px-4">
                  <h3 className="text-2xl md:text-3xl lg:text-[40px] font-inter font-bold text-black mb-4 lg:mb-4.5">
                    {city.title.replace(city.highlight, "")}
                    <span className={city.highlightColor}>
                      {" "}
                      {city.highlight}
                    </span>
                  </h3>
                  <p className="font-open-sans text-black text-sm md:text-base leading-relaxed mb-9">
                    {city.description}
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white border border-primary text-black  text-sm md:text-base px-8 py-2 rounded-full transition-all"
                  >
                    Customize My Trip <span className="ml-2">👉</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CityOperations;

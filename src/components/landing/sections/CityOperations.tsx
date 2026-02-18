"use client";

import React from "react";
import Image from "next/image";
import Button from "../ui/button";
import LottieAnimation from "../../ui/LottieAnimation";
import kolkataImg from "@/../public/images/city/kolkata.png";
import delhiImg from "@/../public/images/city/delhi.png";
import mumbaiImg from "@/../public/images/city/mumbai.png";

const cityData = [
  {
    id: "kolkata",
    title: "Budget Travel Packages In Kolkata",
    highlight: "In Kolkata",
    highlightColor: "text-[#C90000]",
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
    highlightColor: "text-[#FFD700]",
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
    highlightColor: "text-primary",
    description:
      "Mumbai travelers can book budget friendly customized tour packages designed around flexible schedules and competitive flight options from Chhatrapati Shivaji Maharaj International Airport (BOM) and major railway stations like Chhatrapati Shivaji Maharaj Terminus (CSMT), Mumbai Central (MMCT) or Lokmanya Tilak Terminus (LTT).",
    image: mumbaiImg,
    alt: "Mumbai City Landmark - Gateway of India",
    imgPos: "left",
  },
];

const CityOperations: React.FC = () => {
  return (
    <section className="xl:pt-20 md:pt-10 pb-10 relative overflow-hidden bg-white">
      <div className="relative z-10 mb-0 md:mb-16 px-4 flex flex-col md:flex-row md:flex-wrap md:justify-center md:gap-x-10 xl:block">
        {/* Plane Animation */}
        <div className="order-1 md:order-1 relative md:static xl:absolute xl:top-2 xl:left-0 2xl:left-10 w-48 md:w-72 xl:mx-0 pointer-events-none mt-0 md:mt-0 -scale-x-100">
          <LottieAnimation
            src="/animations/plane.json"
            width="100%"
            height="auto"
            className="w-full h-auto opacity-65"
          />
        </div>
        {/* Header */}
        <div className="text-center order-2 md:order-2 md:w-full xl:w-auto">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] xl:text-[48px] font-inter font-semibold text-black leading-tight mb-6">
            Why Budget Travel Packages Is One Of
            <br className="hidden md:block" /> The{" "}
            <span className="text-primary">
              Best Travel Companies In India?
            </span>
          </h2>
          <div className="inline-block bg-new-blue  px-6 py-2.5 mb-4 rounded-full">
            <p className="font-semibold font-inter text-white text-lg md:text-xl lg:text-2xl">
              Pan-India Multi-City Services
            </p>
          </div>
          <p className="text-base md:text-lg max-w-[800px] mx-auto font-inter font-semibold text-gray-600">
            We proudly serve travelers across 75+ cities in India, with the
            highest number of satisfied customers from Kolkata, Delhi, and
            Mumbai.
          </p>
        </div>
        {/* Train Animation */}
        <div className="order-3 md:order-3 relative md:static xl:absolute xl:top-4 xl:right-0 2xl:right-10 w-[170px]  md:w-[250px] ml-auto xl:mx-0 pointer-events-none mb-2 md:mb-8 xl:mb-0 -scale-x-100">
          <LottieAnimation
            src="/animations/train.json"
            width="100%"
            height="auto"
            className="w-full h-auto opacity-65"
          />
        </div>
      </div>

      {/* City Content Blocks */}
      <div className="space-y-0">
        {cityData.map((city) => (
          <div key={city.id} className="relative w-full py-16 md:py-24">
            {city.id === "kolkata" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 container-box  w-full border-b-2 border-dashed border-secondary/50 z-20" />
            )}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 container-box  w-full border-b-2 border-dashed border-secondary/50 z-20" />

            <div
              className={`absolute top-0 bottom-0 w-full h-full flex items-center ${
                city.imgPos === "left" ? "justify-start" : "justify-end"
              } pointer-events-none`}
            >
              <div className="relative h-full w-auto max-w-[50%]">
                <Image
                  src={city.image}
                  alt={city.alt}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  className={`h-full w-auto object-contain object-bottom ${city.id === "delhi" ? "opacity-50" : ""}`}

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
                    variant="primary"
                    className="bg-new-blue text-white  text-sm md:text-base px-8 lg:px-16 py-2 rounded-full transition-all"
                    onClick={() => {
                      document
                        .getElementById("start-planning")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Customize My Trip
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

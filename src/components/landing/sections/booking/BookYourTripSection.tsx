"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { BookingFormCard } from "./components/BookingFormCard";

import arrowLineShape from "@/../public/images/shapes/arrow-line.svg";

// Lazy-load Lottie to avoid SSR issues and reduce initial bundle
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Import Lottie JSON data
import parachuteAnimation from "@/../public/animations/parachute.json";
import boatAnimation from "@/../public/animations/boat.json";

/**
 * BookYourTrip Section
 *
 * A multi-step booking form for travel packages.
 * - Step 1: Trip details (type, cities, date, duration, guests, budget)
 * - Step 2: Special requests and traveler information
 *
 * State is managed via Redux Toolkit (bookingSlice).
 * Validation is handled by Zod schemas.
 *
 * Decorative elements use Lottie animations (parachute + boat).
 * Replace the JSON files in /public/animations/ with real animations.
 */
const BookYourTripSection: React.FC = () => {
  return (
    <section
      id="start-planning"
      className="pb-20 pt-50 relative bg-white"
    >
      {/* Decorative Parachute Lottie (Left Top) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 2xl:left-10 w-64 2xl:w-100 opacity-80 pointer-events-none z-0">
        <Lottie
          animationData={parachuteAnimation}
          loop
          autoplay
          className="w-full h-auto"
          aria-hidden="true"
        />
      </div>

      <div className="container-box relative z-10 px-4">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-inter font-bold text-black">
            Start Planning <span className="text-primary">Your Trip</span>
          </h2>
        </div>

        <BookingFormCard />
        <div className="flex justify-center items-center my-6">
          <span className="text-2xl">🔒</span>{" "}
          <span className="text-sm font-bold ml-2">
            100% Best Deal with satisfaction Guaranteed
          </span>
        </div>
      </div>

      {/* Decorative Boat Lottie (Right Bottom) */}
      <div className="absolute -bottom-16 right-10 2xl:right-10 w-60 2xl:w-100 opacity-80 pointer-events-none z-20">
        <Lottie
          animationData={boatAnimation}
          loop
          autoplay
          className="w-full h-auto"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

export default BookYourTripSection;

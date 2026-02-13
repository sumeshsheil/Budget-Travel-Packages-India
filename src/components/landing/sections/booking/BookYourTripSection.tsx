"use client";

import React from "react";
import Image from "next/image";
import { BookingFormCard } from "./components/BookingFormCard";

import parachuteShape from "@/../public/images/shapes/parasute.svg";
import boatShape from "@/../public/images/shapes/boat.svg";
import arrowLineShape from "@/../public/images/shapes/arrow-line.svg";

/**
 * BookYourTrip Section
 *
 * A multi-step booking form for travel packages.
 * - Step 1: Trip details (type, cities, date, duration, guests, budget)
 * - Step 2: Special requests and traveler information
 *
 * State is managed via Redux Toolkit (bookingSlice).
 * Validation is handled by Zod schemas.
 */
const BookYourTripSection: React.FC = () => {
  return (
    <section
      id="start-planning"
      className="py-20 relative bg-white overflow-hidden"
    >
      {/* Decorative Parachute (Left Top) */}
      <div className="absolute top-10 -left-10 md:left-10 w-32 md:w-48 opacity-80 pointer-events-none z-0">
        <Image src={parachuteShape} alt="" className="w-full h-auto" />
      </div>
      {/* Decorative Arrow (Left) */}
      <div className="absolute top-40 left-10 md:left-20 w-24 opacity-40 pointer-events-none hidden md:block">
        <Image
          src={arrowLineShape}
          alt=""
          className="w-full h-auto rotate-90"
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

      {/* Decorative Boat (Right Bottom) */}
      <div className="absolute bottom-20 -right-10 md:right-10 w-48 md:w-64 opacity-80 pointer-events-none z-20">
        <Image src={boatShape} alt="" className="w-full h-auto" />
      </div>
    </section>
  );
};

export default BookYourTripSection;

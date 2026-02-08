"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { setTripType } from "@/lib/redux/features/bookingSlice";

export const TripTypeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const tripType = useAppSelector((state) => state.booking.step1.tripType);

  const buttonBaseClass = "py-3 rounded-lg font-bold border transition-all";
  const activeClass = "bg-primary border-primary text-black";
  const inactiveClass =
    "bg-white border-gray-200 text-gray-500 hover:border-gray-300";

  return (
    <div className="space-y-2">
      <label className="text-sm md:text-lg font-semibold font-open-sans text-black">
        Trip Type
      </label>
      <div className="grid grid-cols-2 pt-3 gap-4">
        <button
          type="button"
          onClick={() => dispatch(setTripType("domestic"))}
          className={`${buttonBaseClass} ${
            tripType === "domestic" ? activeClass : inactiveClass
          }`}
        >
          Domestic ₹ 599
        </button>
        <button
          type="button"
          onClick={() => dispatch(setTripType("international"))}
          className={`${buttonBaseClass} ${
            tripType === "international" ? activeClass : inactiveClass
          }`}
        >
          International ₹999
        </button>
      </div>
    </div>
  );
};

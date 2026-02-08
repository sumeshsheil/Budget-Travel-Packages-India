"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setDuration,
  toggleDurationDropdown,
  closeDurationDropdown,
} from "@/lib/redux/features/bookingSlice";
import { labelClass, errorTextClass } from "../styles";

export const DurationDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const duration = useAppSelector((state) => state.booking.step1.duration);
  const isDurationOpen = useAppSelector(
    (state) => state.booking.ui.isDurationOpen,
  );
  const error = useAppSelector(
    (state) => state.booking.validation.step1Errors.duration,
  );

  const handleSelect = (value: string) => {
    dispatch(setDuration(value));
    dispatch(closeDurationDropdown());
  };

  const buttonClass = `w-full border rounded-lg px-4 py-3 bg-[#F0FFF4] bg-opacity-30 flex items-center justify-between text-left focus:outline-none focus:ring-2 text-gray-700 font-medium ${
    error
      ? "border-red-500 focus:ring-red-500/50"
      : "border-primary focus:ring-primary/50"
  }`;

  return (
    <div className="space-y-2">
      <label className={labelClass}>Trip Duration *</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => dispatch(toggleDurationDropdown())}
          className={buttonClass}
        >
          <span className={duration ? "text-black" : "text-gray-500"}>
            {duration || "Day / Night"}
          </span>
          <svg
            className={`w-4 h-4 text-primary transition-transform ${
              isDurationOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        {isDurationOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((day) => {
              const value = `${day} Day${day > 1 ? "s" : ""}`;
              return (
                <div
                  key={day}
                  onClick={() => handleSelect(value)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 font-medium"
                >
                  {value}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
};

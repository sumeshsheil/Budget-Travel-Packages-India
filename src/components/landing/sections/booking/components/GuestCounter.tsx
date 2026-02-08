"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  incrementGuests,
  decrementGuests,
} from "@/lib/redux/features/bookingSlice";
import { labelClass } from "../styles";

export const GuestCounter: React.FC = () => {
  const dispatch = useAppDispatch();
  const guests = useAppSelector((state) => state.booking.step1.guests);

  return (
    <div className="space-y-2">
      <label className={labelClass}>Total Person</label>
      <div className="flex items-center justify-between gap-4 border border-primary rounded-lg px-2 py-2 bg-[#F0FFF4] bg-opacity-30">
        <button
          type="button"
          onClick={() => dispatch(decrementGuests())}
          className="w-8 h-8 flex items-center justify-center text-primary bg-[#f5f5f5] rounded hover:bg-gray-200 transition-colors font-bold text-xl"
        >
          -
        </button>
        <span className="text-center font-bold px-2 w-8">
          {guests.toString().padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => dispatch(incrementGuests())}
          className="w-8 h-8 bg-[#f5f5f5] flex items-center justify-center text-primary rounded hover:bg-gray-200 transition-colors font-bold text-xl"
        >
          +
        </button>
      </div>
    </div>
  );
};

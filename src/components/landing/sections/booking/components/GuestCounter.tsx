"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  incrementGuests,
  decrementGuests,
  setGuests,
  setStep1Errors,
} from "@/lib/redux/features/bookingSlice";
import { labelClass, errorTextClass } from "../styles";

export const GuestCounter: React.FC = () => {
  const dispatch = useAppDispatch();
  const guests = useAppSelector((state) => state.booking.step1.guests);
  const error = useAppSelector(
    (state) => state.booking.validation.step1Errors.guests,
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string to let user delete current value
    if (val === "") {
      dispatch(setGuests(0)); // Or handle as empty
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num > 30) {
        dispatch(setStep1Errors({ guests: "Maximum 30 persons allowed" }));
      } else {
        if (num < 0) return;
        dispatch(setGuests(num));
      }
    }
  };

  const handleBlur = () => {
    if (guests === 0) {
      dispatch(setGuests(1));
    }
  };

  return (
    <div className="space-y-2">
      <label className={labelClass}>Total Person</label>
      <div
        className={`flex items-center justify-between gap-4 border rounded-lg px-2 py-2 bg-[#FFFFF0] bg-opacity-80 ${error ? "border-red-500" : "border-primary"}`}
      >
        <button
          type="button"
          onClick={() => dispatch(decrementGuests())}
          className="w-8 h-8 flex items-center justify-center text-primary bg-[#f5f5f5] rounded hover:bg-gray-200 transition-colors font-bold text-xl"
        >
          -
        </button>
        <input
          type="number"
          value={guests === 0 ? "" : guests.toString()}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-16 text-center font-bold bg-transparent outline-none focus:ring-0 appearance-none m-0"
          style={{ appearance: "textfield", MozAppearance: "textfield" }}
        />
        <button
          type="button"
          onClick={() => dispatch(incrementGuests())}
          className="w-8 h-8 bg-[#f5f5f5] flex items-center justify-center text-primary rounded hover:bg-gray-200 transition-colors font-bold text-xl"
        >
          +
        </button>
      </div>
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
};

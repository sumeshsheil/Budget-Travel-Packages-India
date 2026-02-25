"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  incrementGuests,
  decrementGuests,
  setGuests,
  setStep1Errors,
} from "@/lib/redux/features/bookingSlice";
import { GuestCounter as SharedGuestCounter } from "@/components/shared/GuestCounter";
import { labelClass, errorTextClass } from "../styles";

export const GuestCounter: React.FC = () => {
  const dispatch = useAppDispatch();
  const guests = useAppSelector((state) => state.booking.step1.guests);
  const error = useAppSelector(
    (state) => state.booking.validation.step1Errors.guests,
  );

  const handleBlur = () => {
    if (guests === 0) {
      dispatch(setGuests(1));
    }
  };

  return (
    <div className="space-y-2">
      <label className={labelClass}>Total Person*</label>
      <SharedGuestCounter
        value={guests === 0 ? "" : guests.toString()}
        onChange={(val) => {
          const num = parseInt(val, 10);
          if (val === "") dispatch(setGuests(0));
          else if (!isNaN(num)) {
            if (num > 30) {
              dispatch(
                setStep1Errors({ guests: "Maximum 30 persons allowed" }),
              );
            } else {
              dispatch(setGuests(num));
            }
          }
        }}
        onBlur={handleBlur}
        error={error}
        className="bg-[#FFFFF0] bg-opacity-80 border-primary focus-within:ring-primary/20 h-12"
      />
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
};

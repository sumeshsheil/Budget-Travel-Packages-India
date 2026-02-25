"use client";

import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setDuration,
  toggleDurationDropdown,
  closeDurationDropdown,
} from "@/lib/redux/features/bookingSlice";
import { DurationSelect } from "@/components/shared/DurationSelect";
import { labelClass, errorTextClass } from "../styles";

export const DurationDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const duration = useAppSelector((state) => state.booking.step1.duration);
  const error = useAppSelector(
    (state) => state.booking.validation.step1Errors.duration,
  );

  return (
    <div className="space-y-2">
      <label className={labelClass}>Trip Duration *</label>
      <DurationSelect
        value={duration}
        onChange={(val) => dispatch(setDuration(val))}
        error={error}
        className="bg-[#FFFFF0] bg-opacity-80 py-6 border-primary focus:ring-primary/50 text-gray-700 font-medium h-12"
        placeholder="Day / Night"
      />
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
};

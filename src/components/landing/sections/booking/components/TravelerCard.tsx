"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  updateTraveler,
  removeTraveler,
} from "@/lib/redux/features/bookingSlice";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import type { Traveler } from "../types";

interface TravelerCardProps {
  index: number;
  canRemove: boolean;
}

export const TravelerCard: React.FC<TravelerCardProps> = ({
  index,
  canRemove,
}) => {
  const dispatch = useAppDispatch();
  const traveler = useAppSelector(
    (state) => state.booking.step2.travelers[index],
  );
  const errors = useAppSelector(
    (state) => state.booking.validation.travelerErrors[index] || {},
  );

  const handleChange = (field: keyof Traveler, value: string | number) => {
    dispatch(updateTraveler({ index, field, value }));
  };

  const genderOptions = [
    { value: "", label: "Gender", disabled: true },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="border border-primary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-700">
          Traveler {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => dispatch(removeTraveler(index))}
            className="text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <FormInput
          type="text"
          value={traveler.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Name"
          error={errors.name}
        />

        {/* Age */}
        <FormInput
          type="number"
          value={traveler.age || ""}
          onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
          placeholder="Age"
          min="1"
          max="120"
          error={errors.age}
        />

        {/* Gender */}
        <FormSelect
          value={traveler.gender}
          onChange={(e) =>
            handleChange(
              "gender",
              e.target.value as "male" | "female" | "other",
            )
          }
          options={genderOptions}
          error={errors.gender}
        />

        {/* Email */}
        <FormInput
          type="email"
          value={traveler.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Email"
          error={errors.email}
        />

        {/* Phone */}
        <div className="md:col-span-2">
          <FormInput
            type="tel"
            value={traveler.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone No."
            error={errors.phone}
          />
        </div>
      </div>
    </div>
  );
};

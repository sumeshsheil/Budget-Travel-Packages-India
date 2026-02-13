"use client";

import React from "react";
import { useAppSelector } from "@/lib/redux/store";
import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";

export const BookingFormCard: React.FC = () => {
  const currentStep = useAppSelector((state) => state.booking.currentStep);

  return (
    <div className="bg-white rounded-[10px] border border-secondary p-6 md:p-10 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-4xl font-semibold font-inter text-secondary-text mb-1.5">
          Book Your Trip Now
        </h3>
        <p className="text-secondary-text font-normal font-open-sans text-sm md:text-lg max-w-[380px] mx-auto">
          {currentStep === 1
            ? "Fill in your details and our travel experts will get in touch with you shortly."
            : "Add special requests and traveler details to complete your booking."}
        </p>
      </div>

      {currentStep === 1 && <Step1Form />}
      {currentStep === 2 && <Step2Form />}
    </div>
  );
};

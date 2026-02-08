"use client";

import React from "react";

interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          currentStep === 1
            ? "bg-primary text-black"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        1
      </div>
      <div className="w-8 h-0.5 bg-gray-200" />
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          currentStep === 2
            ? "bg-primary text-black"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        2
      </div>
    </div>
  );
};

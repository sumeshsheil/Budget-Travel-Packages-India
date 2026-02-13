"use client";

import React from "react";
import { labelClass, errorTextSmClass } from "../styles";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  options,
  className = "",
  value,
  ...props
}) => {
  const borderClass = error
    ? "border-red-500 focus:ring-red-500/50"
    : "border-primary focus:ring-primary/50";

  const textClass = value ? "text-black" : "text-gray-400";

  return (
    <div className="space-y-1">
      {label && <label className={labelClass}>{label}</label>}
      <div className="relative">
        <select
          value={value}
          className={`w-full border rounded-lg pl-4 pr-10 py-3 bg-[#FFFFF0] bg-opacity-80 focus:outline-none focus:ring-2 placeholder-gray-400 appearance-none ${borderClass} ${textClass} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="text-black"
            >
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow — matches the green theme */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && <p className={errorTextSmClass}>{error}</p>}
    </div>
  );
};

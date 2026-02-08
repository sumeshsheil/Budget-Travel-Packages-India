"use client";

import React from "react";
import { getInputClass, labelClass, errorTextSmClass } from "../styles";

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
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && <label className={labelClass}>{label}</label>}
      <select className={`${getInputClass(!!error)} ${className}`} {...props}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={errorTextSmClass}>{error}</p>}
    </div>
  );
};

"use client";

import React from "react";
import { inputNormalClass, labelClass } from "../styles";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  showCharCount?: boolean;
  currentLength?: number;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  showCharCount = false,
  currentLength = 0,
  maxLength,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && <label className={labelClass}>{label}</label>}
      <textarea
        className={`${inputNormalClass} resize-none ${className}`}
        maxLength={maxLength}
        {...props}
      />
      {showCharCount && maxLength && (
        <p className="text-gray-400 text-xs text-right">
          {currentLength}/{maxLength} characters
        </p>
      )}
    </div>
  );
};

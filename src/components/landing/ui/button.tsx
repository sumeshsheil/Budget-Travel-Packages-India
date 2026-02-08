"use client";
import React, { ComponentProps, forwardRef } from "react";
import { motion } from "motion/react";

// Define the variant types logic manually since we don't have cva/clsx
type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";
type ButtonRounded = "default" | "full";

interface ButtonProps extends ComponentProps<typeof motion.button> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      rounded = "full",
      children,
      ...props
    },
    ref,
  ) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ";

    // Variant styles
    const variants = {
      primary:
        "bg-[var(--color-primary)] text-[var(--color-secondary-text)] hover:shadow-lg hover:brightness-105",
      secondary:
        "bg-[var(--color-secondary)] text-white hover:bg-opacity-90 hover:shadow-lg",
      outline:
        "bg-transparent border border-gray-200 text-black hover:bg-gray-50 hover:shadow-md",
    };

    // Size styles
    const sizes = {
      sm: "text-sm py-2 px-4",
      md: "text-base py-3 px-6",
      lg: "text-lg py-5 px-8",
    };

    // Rounded styles
    const roundness = {
      default: "rounded-lg",
      full: "rounded-full",
    };

    // Construct the class string
    const combinedClassName = [
      baseStyles,
      variants[variant],
      sizes[size],
      roundness[rounded],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;

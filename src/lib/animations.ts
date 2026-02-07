import { Variants } from "motion/react";

// =========================================
// Transition Defaults
// =========================================

export const transitions = {
  fast: { duration: 0.15, ease: "easeOut" },
  normal: { duration: 0.2, ease: "easeOut" },
  slow: { duration: 0.8, ease: "easeInOut" },
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 25,
  },
  gentleSpring: {
    type: "spring",
    stiffness: 200,
    damping: 20,
  },
} as const;

// =========================================
// Basic Animations
// =========================================

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.normal },
  exit: { opacity: 0, transition: transitions.fast },
};

export const fadeScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: transitions.normal },
  exit: { opacity: 0, scale: 0.95, transition: transitions.fast },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.8, transition: transitions.fast },
};

// =========================================
// Slide Animations (RTL-Aware)
// =========================================

export const slideInRight: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: transitions.normal },
  exit: { x: 20, opacity: 0, transition: transitions.fast },
};

export const slideInLeft: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: transitions.normal },
  exit: { x: -20, opacity: 0, transition: transitions.fast },
};

export const slideUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: transitions.normal },
  exit: { y: 20, opacity: 0, transition: transitions.fast },
};

export const slideDown: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: transitions.normal },
  exit: { y: -20, opacity: 0, transition: transitions.fast },
};

// =========================================
// Stagger Animations
// =========================================

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: transitions.normal },
  exit: { y: 10, opacity: 0, transition: transitions.fast },
};

export const staggerItemRight: Variants = {
  initial: { x: 10, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: transitions.normal },
  exit: { x: 10, opacity: 0, transition: transitions.fast },
};

// =========================================
// Modal / Dialog Animations
// =========================================

export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.normal },
  exit: { opacity: 0, transition: transitions.fast },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.gentleSpring,
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: transitions.fast },
};

export const sheetContent: Variants = {
  initial: { y: "100%" },
  animate: { y: 0, transition: transitions.gentleSpring },
  exit: { y: "100%", transition: transitions.fast },
};

// =========================================
// Dropdown Animations
// =========================================

export const dropdownDown: Variants = {
  initial: { opacity: 0, scale: 0.95, y: -10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: transitions.fast },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: transitions.fast },
};

export const dropdownUp: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: transitions.fast },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: transitions.fast },
};

// =========================================
// Page Transitions
// =========================================

export const pageFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.slow },
  exit: { opacity: 0, transition: transitions.normal },
};

export const pageSlide: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: transitions.slow },
  exit: { x: 20, opacity: 0, transition: transitions.normal },
};

// =========================================
// Micro-Interactions
// =========================================

export const tapScale: Variants = {
  whileTap: { scale: 0.97, transition: transitions.fast },
};

export const hoverLift: Variants = {
  whileHover: { y: -2, transition: transitions.fast },
};

export const buttonPress: Variants = {
  whileHover: { scale: 1.02, transition: transitions.fast },
  whileTap: { scale: 0.98, transition: transitions.fast },
};

export const cardHover: Variants = {
  whileHover: {
    y: -4,
    transition: transitions.normal,
    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
  },
};

// =========================================
// Loading States
// =========================================

export const pulse: Variants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const shimmer: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// =========================================
// Toasts
// =========================================

export const toastSlideIn: Variants = {
  initial: { x: 100, opacity: 0, scale: 0.9 },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.fast,
  },
};

// =========================================
// Collapse / Expand
// =========================================

export const collapse: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: "auto",
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: transitions.fast,
  },
};

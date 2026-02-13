// ============ INPUT STYLES ============

export const inputBaseClass =
  "w-full border rounded-lg px-4 py-3 bg-[#FFFFF0] bg-opacity-80 focus:outline-none focus:ring-2 placeholder-gray-400";

export const inputNormalClass = `${inputBaseClass} border-primary focus:ring-primary/50`;

export const inputErrorClass = `${inputBaseClass} border-red-500 focus:ring-red-500/50`;

export const getInputClass = (hasError: boolean) =>
  hasError ? inputErrorClass : inputNormalClass;

// ============ LABEL STYLES ============

export const labelClass = "text-sm font-bold text-black";

// ============ ERROR STYLES ============

export const errorTextClass = "text-red-500 text-sm";
export const errorTextSmClass = "text-red-500 text-xs";

// Barrel export for booking module
// Re-export main component for backward compatibility

export { default as BookYourTrip } from "./BookYourTripSection";
export { default } from "./BookYourTripSection";

// Component exports
export * from "./components/BookingFormCard";
export * from "./components/Step1Form";
export * from "./components/Step2Form";
export * from "./components/StepIndicator";
export * from "./components/TripTypeSelector";
export * from "./components/DurationDropdown";
export * from "./components/GuestCounter";
export * from "./components/TravelerCard";
export * from "./components/DepartureCityCombobox";
export * from "./components/TravelDatePicker";
export * from "./components/FormInput";
export * from "./components/FormSelect";
export * from "./components/FormTextarea";

// Hook exports
export * from "./hooks/useBookingValidation";
export * from "./hooks/useMinBudget";

// Type exports
export * from "./types";

// Schema exports (for external validation if needed)
export * from "./schemas";

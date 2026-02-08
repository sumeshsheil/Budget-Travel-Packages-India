// ============ TRAVELER TYPES ============

export interface Traveler {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
}

// ============ STEP DATA TYPES ============

export interface Step1Data {
  tripType: "domestic" | "international";
  departureCity: string;
  destination: string;
  travelDate: string;
  duration: string;
  guests: number;
  budget: number;
}

export interface Step2Data {
  specialRequests: string;
  travelers: Traveler[];
}

// ============ ERROR TYPES ============

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
export type TravelerErrors = Partial<Record<keyof Traveler, string>>;

// ============ FORM DATA ============

export interface BookingFormData {
  step1: Step1Data;
  step2: Step2Data;
}

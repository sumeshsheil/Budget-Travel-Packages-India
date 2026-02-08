import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Traveler } from "@/components/landing/sections/booking/types";

// ============ STATE TYPES ============

interface Step1State {
  tripType: "domestic" | "international";
  departureCity: string;
  destination: string;
  travelDate: string;
  duration: string;
  guests: number;
  budget: string;
}

interface Step2State {
  specialRequests: string;
  travelers: Traveler[];
}

interface UIState {
  isDurationOpen: boolean;
}

interface ValidationState {
  step1Errors: Record<string, string>;
  step2Errors: Record<string, string>;
  travelerErrors: Record<string, string>[];
  budgetError: string;
}

interface BookingState {
  currentStep: 1 | 2;
  step1: Step1State;
  step2: Step2State;
  ui: UIState;
  validation: ValidationState;
}

// ============ INITIAL STATE ============

const initialTraveler: Traveler = {
  name: "",
  age: 0,
  gender: "male",
  email: "",
  phone: "",
};

const initialState: BookingState = {
  currentStep: 1,
  step1: {
    tripType: "domestic",
    departureCity: "",
    destination: "",
    travelDate: "",
    duration: "",
    guests: 1,
    budget: "",
  },
  step2: {
    specialRequests: "",
    travelers: [{ ...initialTraveler }],
  },
  ui: {
    isDurationOpen: false,
  },
  validation: {
    step1Errors: {},
    step2Errors: {},
    travelerErrors: [{}],
    budgetError: "",
  },
};

// ============ SLICE ============

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Step Navigation
    setCurrentStep: (state, action: PayloadAction<1 | 2>) => {
      state.currentStep = action.payload;
    },

    // Step 1 Actions
    setTripType: (
      state,
      action: PayloadAction<"domestic" | "international">,
    ) => {
      state.step1.tripType = action.payload;
    },
    setDepartureCity: (state, action: PayloadAction<string>) => {
      state.step1.departureCity = action.payload;
      delete state.validation.step1Errors.departureCity;
    },
    setDestination: (state, action: PayloadAction<string>) => {
      state.step1.destination = action.payload;
      delete state.validation.step1Errors.destination;
    },
    setTravelDate: (state, action: PayloadAction<string>) => {
      state.step1.travelDate = action.payload;
      delete state.validation.step1Errors.travelDate;
    },
    setDuration: (state, action: PayloadAction<string>) => {
      state.step1.duration = action.payload;
      delete state.validation.step1Errors.duration;
    },
    incrementGuests: (state) => {
      if (state.step1.guests < 50) {
        state.step1.guests += 1;
      }
    },
    decrementGuests: (state) => {
      if (state.step1.guests > 1) {
        state.step1.guests -= 1;
      }
    },
    setBudget: (state, action: PayloadAction<string>) => {
      state.step1.budget = action.payload;
      delete state.validation.step1Errors.budget;
    },

    // Step 2 Actions
    setSpecialRequests: (state, action: PayloadAction<string>) => {
      state.step2.specialRequests = action.payload;
    },
    addTraveler: (state) => {
      if (state.step2.travelers.length < state.step1.guests) {
        state.step2.travelers.push({ ...initialTraveler });
        state.validation.travelerErrors.push({});
      }
    },
    removeTraveler: (state, action: PayloadAction<number>) => {
      if (state.step2.travelers.length > 1) {
        state.step2.travelers.splice(action.payload, 1);
        state.validation.travelerErrors.splice(action.payload, 1);
      }
    },
    updateTraveler: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof Traveler;
        value: string | number;
      }>,
    ) => {
      const { index, field, value } = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state.step2.travelers[index] as any)[field] = value;
      // Clear error for this field
      if (state.validation.travelerErrors[index]) {
        delete state.validation.travelerErrors[index][field];
      }
    },

    // UI Actions
    toggleDurationDropdown: (state) => {
      state.ui.isDurationOpen = !state.ui.isDurationOpen;
    },
    closeDurationDropdown: (state) => {
      state.ui.isDurationOpen = false;
    },

    // Validation Actions
    setStep1Errors: (state, action: PayloadAction<Record<string, string>>) => {
      state.validation.step1Errors = action.payload;
    },
    setStep2Errors: (state, action: PayloadAction<Record<string, string>>) => {
      state.validation.step2Errors = action.payload;
    },
    setTravelerErrors: (
      state,
      action: PayloadAction<Record<string, string>[]>,
    ) => {
      state.validation.travelerErrors = action.payload;
    },
    setBudgetError: (state, action: PayloadAction<string>) => {
      state.validation.budgetError = action.payload;
    },
    clearStep1Error: (state, action: PayloadAction<string>) => {
      delete state.validation.step1Errors[action.payload];
    },

    // Reset
    resetForm: () => initialState,
  },
});

export const {
  setCurrentStep,
  setTripType,
  setDepartureCity,
  setDestination,
  setTravelDate,
  setDuration,
  incrementGuests,
  decrementGuests,
  setBudget,
  setSpecialRequests,
  addTraveler,
  removeTraveler,
  updateTraveler,
  toggleDurationDropdown,
  closeDurationDropdown,
  setStep1Errors,
  setStep2Errors,
  setTravelerErrors,
  setBudgetError,
  clearStep1Error,
  resetForm,
} = bookingSlice.actions;

export default bookingSlice.reducer;

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setStep1Errors,
  setStep2Errors,
  setTravelerErrors,
  setBudgetError,
} from "@/lib/redux/features/bookingSlice";
import { step1Schema, step2Schema, travelerSchema } from "../schemas";
import type {
  Step1Data,
  Step2Data,
  FieldErrors,
  TravelerErrors,
} from "../types";
import { useMinBudget } from "./useMinBudget";

/**
 * Custom hook for form validation using Zod schemas
 */
export const useBookingValidation = () => {
  const dispatch = useAppDispatch();
  const step1 = useAppSelector((state) => state.booking.step1);
  const step2 = useAppSelector((state) => state.booking.step2);
  const { days, minBudget } = useMinBudget();

  const validateStep1 = useCallback((): boolean => {
    const budgetNum = parseFloat(step1.budget) || 0;

    const result = step1Schema.safeParse({
      tripType: step1.tripType,
      departureCity: step1.departureCity.trim(),
      destination: step1.destination.trim(),
      travelDate: step1.travelDate.trim(),
      duration: step1.duration,
      guests: step1.guests,
      budget: budgetNum,
    });

    if (!result.success) {
      const errors: FieldErrors<Step1Data> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof Step1Data;
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      dispatch(setStep1Errors(errors as Record<string, string>));
      return false;
    }

    // Additional budget validation
    if (days > 0 && budgetNum < minBudget) {
      dispatch(setStep1Errors({}));
      dispatch(
        setBudgetError(
          `Minimum budget for ${step1.guests} person(s) and ${days} day(s) (${step1.tripType}) is ₹${minBudget.toLocaleString("en-IN")}`,
        ),
      );
      return false;
    }

    dispatch(setStep1Errors({}));
    dispatch(setBudgetError(""));
    return true;
  }, [dispatch, step1, days, minBudget]);

  const validateStep2 = useCallback((): boolean => {
    // Validate each traveler
    const newTravelerErrors: TravelerErrors[] = step2.travelers.map(
      (traveler) => {
        const result = travelerSchema.safeParse({
          ...traveler,
          age: traveler.age || 0,
        });

        if (!result.success) {
          const errors: TravelerErrors = {};
          result.error.issues.forEach((err) => {
            const field = err.path[0] as keyof TravelerErrors;
            if (!errors[field]) {
              errors[field] = err.message;
            }
          });
          return errors;
        }
        return {};
      },
    );

    dispatch(setTravelerErrors(newTravelerErrors as Record<string, string>[]));

    // Check if any traveler has errors
    const hasErrors = newTravelerErrors.some(
      (errors) => Object.keys(errors).length > 0,
    );

    if (hasErrors) {
      return false;
    }

    // Validate step 2 overall
    const result = step2Schema.safeParse({
      specialRequests: step2.specialRequests.trim(),
      travelers: step2.travelers,
    });

    if (!result.success) {
      const errors: FieldErrors<Step2Data> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof Step2Data;
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      dispatch(setStep2Errors(errors as Record<string, string>));
      return false;
    }

    dispatch(setStep2Errors({}));
    return true;
  }, [dispatch, step2]);

  return { validateStep1, validateStep2 };
};

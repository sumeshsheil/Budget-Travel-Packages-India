import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setStep1Errors,
  setStep2Errors,
  setContactErrors,
  setBudgetError,
} from "@/lib/redux/features/bookingSlice";
import { step1Schema, primaryContactSchema } from "../schemas";
import type { Step1Data, FieldErrors, TravelerErrors } from "../types";
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
    const contact = step2.primaryContact;

    const result = primaryContactSchema.safeParse({
      ...contact,
      age: contact.age || 0,
    });

    if (!result.success) {
      const errors: TravelerErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof TravelerErrors;
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      dispatch(setContactErrors(errors as Record<string, string>));
      return false;
    }

    dispatch(setContactErrors({}));
    dispatch(setStep2Errors({}));
    return true;
  }, [dispatch, step2]);

  return { validateStep1, validateStep2 };
};

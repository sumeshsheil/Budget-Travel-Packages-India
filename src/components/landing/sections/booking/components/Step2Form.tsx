"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setSpecialRequests,
  addTraveler,
  setCurrentStep,
  resetForm,
} from "@/lib/redux/features/bookingSlice";
import { FormTextarea } from "./FormTextarea";
import { TravelerCard } from "./TravelerCard";
import { useBookingValidation } from "../hooks/useBookingValidation";
import Button from "@/components/landing/ui/button";
import { labelClass, errorTextClass } from "../styles";
import { toast } from "sonner";

export const Step2Form: React.FC = () => {
  const dispatch = useAppDispatch();
  const step1 = useAppSelector((state) => state.booking.step1);
  const { specialRequests, travelers } = useAppSelector(
    (state) => state.booking.step2,
  );
  const guests = useAppSelector((state) => state.booking.step1.guests);
  const step2Errors = useAppSelector(
    (state) => state.booking.validation.step2Errors,
  );
  const { validateStep2 } = useBookingValidation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const handleBack = () => {
    dispatch(setCurrentStep(1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...step1,
        guests: Number(step1.guests),
        budget: Number(step1.budget),
        specialRequests,
        travelers,
      };

      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit booking");
      }

      toast.success("Booking submitted successfully! Redirecting...");
      dispatch(resetForm()); // Reset form in Redux

      // Redirect to thank you page
      router.push("/thank-you");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Special Requests */}
      <FormTextarea
        label="Special Requests"
        value={specialRequests}
        onChange={(e) => dispatch(setSpecialRequests(e.target.value))}
        placeholder="Any special requests or preferences..."
        rows={4}
        maxLength={500}
        showCharCount
        currentLength={specialRequests.length}
      />

      {/* Traveler Details */}
      <div className="space-y-4">
        <label className={labelClass}>Traveler Details</label>

        {travelers.map((_, index) => (
          <TravelerCard
            key={index}
            index={index}
            canRemove={travelers.length > 1}
          />
        ))}

        {/* Add More Button */}
        {travelers.length < guests && (
          <button
            type="button"
            onClick={() => dispatch(addTraveler())}
            className="flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <span className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center text-lg leading-none">
              +
            </span>
            Add More
          </button>
        )}

        {step2Errors.travelers && (
          <p className={errorTextClass}>{step2Errors.travelers}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex-1 border border-primary text-black font-bold py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg disabled:opacity-50"
        >
          Back
        </button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-black font-bold py-4 rounded-lg hover:shadow-lg transition-shadow text-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Booking"
          )}
        </Button>
      </div>
    </form>
  );
};

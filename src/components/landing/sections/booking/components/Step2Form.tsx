"use client";

// OTP length from MessageCentral Verify Now API (default is 4).
const OTP_LENGTH = 4;

// Supported country codes (India Only)
const INDIA_PHONE_REGEX = /^[6-9]\d{9}$/;

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setSpecialRequests,
  updatePrimaryContact,
  setPhoneVerified,
  setCurrentStep,
  resetForm,
} from "@/lib/redux/features/bookingSlice";
import { FormTextarea } from "./FormTextarea";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { OtpInput } from "./OtpInput";
import { useBookingValidation } from "../hooks/useBookingValidation";
import Button from "@/components/landing/ui/button";
import { labelClass, getInputClass } from "../styles";
import { toast } from "sonner";
import type { Traveler } from "../types";
import Image from "next/image";

export const Step2Form: React.FC = () => {
  const dispatch = useAppDispatch();
  const step1 = useAppSelector((state) => state.booking.step1);
  const { specialRequests, primaryContact, phoneVerified } = useAppSelector(
    (state) => state.booking.step2,
  );
  const contactErrors = useAppSelector(
    (state) => state.booking.validation.contactErrors,
  );
  const { validateStep2 } = useBookingValidation();

  // Local state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Refs
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Load draft from local storage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("booking_step2_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Restore special requests
        if (parsed.specialRequests) {
          dispatch(setSpecialRequests(parsed.specialRequests));
        }
        // Restore contact details
        if (parsed.primaryContact) {
          Object.entries(parsed.primaryContact).forEach(([key, value]) => {
            dispatch(
              updatePrimaryContact({
                field: key as keyof Traveler,
                value: value as string | number,
              }),
            );
          });
        }
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [dispatch]);

  // Save to local storage on change
  useEffect(() => {
    const draft = { specialRequests, primaryContact };
    localStorage.setItem("booking_step2_draft", JSON.stringify(draft));
  }, [specialRequests, primaryContact]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (field: keyof Traveler, value: string | number) => {
    dispatch(updatePrimaryContact({ field, value }));
    // Phone change logic handled via explicit Change button now
  };

  const handleSendOtp = async () => {
    // Validate phone number for India
    if (!INDIA_PHONE_REGEX.test(primaryContact.phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: primaryContact.phone,
          countryCode: "91",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setVerificationId(data.verificationId);
      setOtpSent(true);
      setCooldown(30);
      toast.success(`OTP sent to +91 ${primaryContact.phone}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send OTP.";
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async (otpValue?: string) => {
    const currentOtp = typeof otpValue === "string" ? otpValue : otp;

    if (currentOtp.length !== OTP_LENGTH) {
      setOtpError("Please enter the complete OTP");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId,
          otp: currentOtp,
          phone: primaryContact.phone,
          countryCode: "91",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      dispatch(setPhoneVerified(true));
      setOtpSent(false); // Hide OTP box
      setOtpError("");
      setOtp(""); // Clear OTP input
      toast.success("Phone verified successfully!");

      // Auto-focus submit button
      setTimeout(() => submitBtnRef.current?.focus(), 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid OTP.";
      setOtpError(message);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    dispatch(setPhoneVerified(false));
    setOtp("");
    setOtpError("");
    setVerificationId("");
    setCooldown(0);
  };

  const handleBack = () => {
    dispatch(setCurrentStep(1));
  };

  const isReadyToVerify = React.useMemo(() => {
    const { firstName, lastName, gender, age, email, phone } = primaryContact;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      firstName.trim().length >= 2 &&
      lastName.trim().length >= 1 &&
      gender !== "" &&
      age > 0 &&
      age <= 120 &&
      emailRegex.test(email) &&
      INDIA_PHONE_REGEX.test(phone)
    );
  }, [primaryContact]);

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
        primaryContact,
      };

      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to submit booking");

      toast.success("Booking submitted successfully! Redirecting...");
      localStorage.removeItem("booking_step2_draft"); // Clear draft
      dispatch(resetForm());
      // Explicitly clear query params or just push to thank you
      router.push("/thank-you");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: "", label: "Gender", disabled: true },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>

      {/* Trip Summary (Collapsible) */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl overflow-hidden transition-all duration-300">
        <button
          type="button"
          onClick={() => setShowSummary(!showSummary)}
          className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors text-left cursor-pointer"
        >
          <span className="font-bold text-primary text-sm flex items-center gap-2">
            <span className="text-lg">📋</span> Trip Summary
          </span>
          <span className="text-primary/60 text-xs font-medium">
            {showSummary ? "Hide Details ▲" : "Show Details ▼"}
          </span>
        </button>

        {showSummary && (
          <div className="p-4 grid grid-cols-2 gap-4 text-xs sm:text-sm border-t border-primary/10 bg-white/50 animate-in slide-in-from-top-2">
            <div>
              <span className="block text-gray-500 text-[10px] uppercase tracking-wider">
                Destination
              </span>
              <span className="font-semibold text-gray-800">
                {step1.destination}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 text-[10px] uppercase tracking-wider">
                Dates
              </span>
              <span className="font-semibold text-gray-800">
                {step1.travelDate} ({step1.duration})
              </span>
            </div>
            <div>
              <span className="block text-gray-500 text-[10px] uppercase tracking-wider">
                Guests
              </span>
              <span className="font-semibold text-gray-800">
                {step1.guests} People
              </span>
            </div>
            <div>
              <span className="block text-gray-500 text-[10px] uppercase tracking-wider">
                Budget
              </span>
              <span className="font-semibold text-gray-800">
                ₹{step1.budget}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Special Requests */}
      <FormTextarea
        label="Special Requests"
        value={specialRequests}
        onChange={(e) => dispatch(setSpecialRequests(e.target.value))}
        placeholder="Any special requests or preferences..."
        rows={3}
        maxLength={500}
        showCharCount
        currentLength={specialRequests.length}
      />

      {/* Primary Contact Details */}
      <div className="space-y-4">
        <label className={labelClass}>Primary Contact Details *</label>

        <div className="border border-primary rounded-lg p-4 md:p-6 space-y-4 bg-white shadow-sm">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              type="text"
              value={primaryContact.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="First Name"
              error={contactErrors.firstName}
            />
            <FormInput
              type="text"
              value={primaryContact.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Last Name"
              error={contactErrors.lastName}
            />
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              value={primaryContact.gender}
              onChange={(e) => handleChange("gender", e.target.value as any)}
              options={genderOptions}
              error={contactErrors.gender}
            />
            <FormInput
              type="number"
              value={primaryContact.age || ""}
              onChange={(e) =>
                handleChange("age", parseInt(e.target.value) || 0)
              }
              placeholder="Age"
              min="1"
              max="120"
              error={contactErrors.age}
            />
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              type="email"
              value={primaryContact.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email"
              error={contactErrors.email}
            />

            <div className="space-y-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 font-medium text-gray-500 flex items-center gap-1.5 select-none pointer-events-none border-r border-gray-300 pr-2 h-5">
                  <Image
                    src="/images/flag/india.jpg"
                    alt="India"
                    width={20}
                    height={14}
                    className="rounded-sm object-cover"
                  />
                  <span className="text-sm">+91</span>
                </div>
                <input
                  type="tel"
                  value={primaryContact.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Phone Number"
                  maxLength={10}
                  disabled={otpSent || phoneVerified}
                  className={`${getInputClass(!!contactErrors.phone)} pl-22 pr-24 h-12 transition-all ${
                    otpSent || phoneVerified
                      ? "bg-gray-50 text-gray-500 font-medium"
                      : "bg-white"
                  }`}
                />

                <div className="absolute right-1 top-1 bottom-1 flex items-center">
                  {otpSent || phoneVerified ? (
                    <button
                      type="button"
                      onClick={handleChangeNumber}
                      disabled={phoneVerified && isSubmitting}
                      className="h-full px-4 text-xs font-bold text-primary hover:bg-primary/5 rounded-md transition-all border border-transparent hover:border-primary/10 cursor-pointer"
                    >
                      Change
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={isVerifying || !isReadyToVerify}
                      className="h-full px-5 rounded-md bg-primary text-black font-bold text-xs hover:shadow-md hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {isVerifying ? "Sending..." : "Verify"}
                    </button>
                  )}
                </div>
              </div>
              {contactErrors.phone && (
                <p className="text-red-500 text-xs pl-1" role="alert">
                  {contactErrors.phone}
                </p>
              )}
            </div>
          </div>

          {/* OTP Section or Success Status */}
          {phoneVerified ? (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="w-10 h-10 min-w-[40px] rounded-full bg-primary flex items-center justify-center text-black font-bold text-xl shadow-sm">
                ✓
              </div>
              <div>
                <p className="text-black font-bold text-base">
                  Verified Successfully
                </p>
                <p className="text-black/60 text-xs">
                  Your contact number is confirmed.
                </p>
              </div>
            </div>
          ) : (
            otpSent && (
              <div className={`pt-2 ${isShaking ? "animate-shake" : ""}`}>
                <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600" role="status">
                      Enter OTP sent to{" "}
                      <span className="font-bold text-black">
                        +91 {primaryContact.phone}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <OtpInput
                      value={otp}
                      onChange={(val) => {
                        setOtp(val);
                        setOtpError("");
                        if (val.length === OTP_LENGTH) handleVerifyOtp(val);
                      }}
                      length={OTP_LENGTH}
                      error={otpError}
                      disabled={isVerifying}
                    />
                  </div>

                  <div className="flex items-center justify-between px-2 pt-1">
                    <div className="flex-1">
                      {/* Empty or auxiliary content */}
                    </div>
                    <div className="flex-1 text-right">
                      {cooldown > 0 ? (
                        <span
                          className="text-xs text-gray-400 font-medium tabular-nums"
                          role="timer"
                        >
                          Resend in {cooldown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          disabled={isVerifying}
                          className="text-xs text-primary font-bold hover:underline disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex-1 border border-primary text-black font-bold py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg disabled:opacity-50 cursor-pointer"
        >
          Back
        </button>
        <Button
          ref={submitBtnRef}
          type="submit"
          disabled={isSubmitting || !phoneVerified}
          className="flex-1 bg-primary text-black font-bold py-4 rounded-lg hover:shadow-lg transition-shadow text-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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

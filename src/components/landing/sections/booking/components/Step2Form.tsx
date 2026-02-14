"use client";

// OTP length from MessageCentral Verify Now API (default is 4).
const OTP_LENGTH = 4;

// Supported country codes (India Only)
const INDIA_PHONE_REGEX = /^[6-9]\d{9}$/;

import React, { useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();

  // Cooldown timer for resend
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (field: keyof Traveler, value: string | number) => {
    dispatch(updatePrimaryContact({ field, value }));
    // Phone change resets verified state in Redux (handled by the slice)
    if (field === "phone") {
      setOtpSent(false);
      setOtp("");
      setOtpError("");
      setVerificationId("");
      setCooldown(0);
    }
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

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setVerificationId(data.verificationId);
      setOtpSent(true);
      setCooldown(30);
      toast.success(`OTP sent to +91 ${primaryContact.phone}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send OTP. Please try again.";
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== OTP_LENGTH) {
      setOtpError("Please enter the complete OTP");
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
          otp,
          phone: primaryContact.phone,
          countryCode: "91",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      dispatch(setPhoneVerified(true));
      setOtpSent(false);
      setOtpError("");
      toast.success("Phone number verified!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setOtpError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep(1));
  };

  // Check if all contact fields are valid before enabling Verify button
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

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit booking");
      }

      toast.success("Booking submitted successfully! Redirecting...");
      dispatch(resetForm());

      router.push("/thank-you");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(message);
      console.error("Submission error:", error);
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

        <div className="border border-primary rounded-lg p-4 md:p-6 space-y-4">
          {/* Row 1: First Name + Last Name */}
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

          {/* Row 2: Gender + Age */}
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              value={primaryContact.gender}
              onChange={(e) =>
                handleChange(
                  "gender",
                  e.target.value as "" | "male" | "female" | "other",
                )
              }
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

          {/* Row 3: Email + Phone with Verify */}
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
                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 font-medium text-gray-500 flex items-center gap-1 select-none pointer-events-none">
                  <Image
                    src="/images/flag/india.jpg"
                    alt="India"
                    width={20}
                    height={20}
                  />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  value={primaryContact.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Phone"
                  maxLength={10}
                  className={`${getInputClass(!!contactErrors.phone)} pl-16 pr-24`} // padding for prefix & Verify button
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-1">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isVerifying || phoneVerified || !isReadyToVerify}
                    className={`px-4 py-2 rounded-md font-bold text-xs transition-all whitespace-nowrap ${
                      phoneVerified
                        ? "bg-green-500 text-white cursor-default"
                        : "bg-primary text-black hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {phoneVerified
                      ? "✓ Verified"
                      : isVerifying
                        ? "Sending..."
                        : "Verify"}
                  </button>
                </div>
              </div>
              {contactErrors.phone && (
                <p className="text-red-500 text-xs">{contactErrors.phone}</p>
              )}
            </div>
          </div>

          {/* OTP Box Input */}
          {otpSent && !phoneVerified && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300 pt-2">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Enter the {OTP_LENGTH}-digit OTP sent to{" "}
                  <span className="font-semibold text-black">
                    +91 {primaryContact.phone}
                  </span>
                </p>
              </div>

              <OtpInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  setOtpError("");
                }}
                length={OTP_LENGTH}
                error={otpError}
                disabled={isVerifying}
              />

              <div className="flex items-center justify-between">
                <div>
                  {cooldown > 0 ? (
                    <span className="text-xs text-gray-400">
                      Resend OTP in {cooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isVerifying}
                      className="text-xs text-primary font-semibold hover:underline disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otp.length < OTP_LENGTH}
                  className="px-6 py-2.5 rounded-lg font-bold text-sm bg-primary text-black hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Submit OTP"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
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

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setSpecialRequests,
  updatePrimaryContact,
  setCurrentStep,
  resetForm,
} from "@/lib/redux/features/bookingSlice";
import { FormTextarea } from "./FormTextarea";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { useBookingValidation } from "../hooks/useBookingValidation";
import Button from "@/components/landing/ui/button";
import { labelClass, errorTextClass, errorTextSmClass } from "../styles";
import { toast } from "sonner";
import type { Traveler } from "../types";

export const Step2Form: React.FC = () => {
  const dispatch = useAppDispatch();
  const step1 = useAppSelector((state) => state.booking.step1);
  const { specialRequests, primaryContact } = useAppSelector(
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
  const [phoneVerified, setPhoneVerified] = useState(false);
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
    // Reset phone verification if phone changes
    if (field === "phone") {
      setPhoneVerified(false);
      setOtpSent(false);
      setOtp("");
      setOtpError("");
      setVerificationId("");
      setCooldown(0);
    }
  };

  const handleSendOtp = async () => {
    // Validate phone number first
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(primaryContact.phone)) {
      dispatch(
        updatePrimaryContact({ field: "phone", value: primaryContact.phone }),
      );
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: primaryContact.phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setVerificationId(data.verificationId);
      setOtpSent(true);
      setCooldown(30); // 30 second cooldown before resend
      toast.success("OTP sent to +91 " + primaryContact.phone);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4 || otp.length > 6) {
      setOtpError("Please enter a valid OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      setPhoneVerified(true);
      setOtpSent(false);
      setOtpError("");
      toast.success("Phone number verified!");
    } catch (err: any) {
      setOtpError(err.message || "Invalid OTP. Please try again.");
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
    const phoneRegex = /^[6-9]\d{9}$/;

    return (
      firstName.trim().length >= 2 &&
      lastName.trim().length >= 1 &&
      gender !== "" &&
      age > 0 &&
      age <= 120 &&
      emailRegex.test(email) &&
      phoneRegex.test(phone)
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
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
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

          {/* Row 2: Gender + Age (half) | Email (half) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <FormInput
              type="email"
              value={primaryContact.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email"
              error={contactErrors.email}
            />
          </div>

          {/* Row 3: Phone + Verify Button */}
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <FormInput
                  type="tel"
                  value={primaryContact.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Phone No. (10 digits)"
                  maxLength={10}
                  error={contactErrors.phone}
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isVerifying || phoneVerified || !isReadyToVerify}
                className={`mt-0.5 px-5 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
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

            {/* OTP Input */}
            {otpSent && !phoneVerified && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setOtp(val);
                        setOtpError("");
                      }}
                      placeholder="Enter OTP"
                      maxLength={6}
                      className="w-full border border-primary rounded-lg px-4 py-3 bg-[#FFFFF0] bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-gray-400 tracking-widest text-center font-bold text-lg"
                    />
                    {otpError && <p className={errorTextSmClass}>{otpError}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || otp.length < 4}
                    className="px-5 py-3 rounded-lg font-bold text-sm bg-new-blue text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isVerifying ? "Verifying..." : "Submit OTP"}
                  </button>
                </div>
                <div className="text-right">
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
              </div>
            )}
          </div>
        </div>

        {contactErrors.phone && !otpSent && (
          <p className={errorTextClass}>{contactErrors.phone}</p>
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

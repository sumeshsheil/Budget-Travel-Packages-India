import { z } from "zod";

// ============ STEP 1 SCHEMA ============

export const step1Schema = z.object({
  tripType: z.enum(["domestic", "international"]),
  departureCity: z
    .string()
    .min(2, "Departure city must be at least 2 characters")
    .max(100, "Departure city is too long"),
  destination: z
    .string()
    .min(2, "Destination must be at least 2 characters")
    .max(100, "Destination is too long"),
  travelDate: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Please enter a valid date in DD/MM/YYYY format",
    ),
  duration: z.string().min(1, "Please select trip duration"),
  guests: z
    .number()
    .min(1, "At least 1 person is required")
    .max(50, "Maximum 50 persons allowed"),
  budget: z.number().min(1, "Budget is required"),
});

// ============ TRAVELER SCHEMA ============

export const travelerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  age: z
    .number({ error: "Age must be a number" })
    .min(1, "Age must be at least 1")
    .max(120, "Please enter a valid age"),
  gender: z.enum(["male", "female", "other"], {
    error: "Please select a gender",
  }),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
});

// ============ STEP 2 SCHEMA ============

export const step2Schema = z.object({
  specialRequests: z
    .string()
    .max(500, "Special requests cannot exceed 500 characters")
    .optional(),
  travelers: z
    .array(travelerSchema)
    .min(1, "At least one traveler is required"),
});

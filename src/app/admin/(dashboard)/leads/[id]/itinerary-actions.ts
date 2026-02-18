"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import { auth } from "@/lib/auth";
import { z } from "zod";

// ============ AUTH HELPER ============

async function verifyAdminSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

// ============ ITINERARY ACTIONS ============

const itineraryDaySchema = z.object({
  day: z.coerce.number().min(1, "Day must be at least 1"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  meals: z.string().max(200).optional().default(""),
  hotel: z.string().max(200).optional().default(""),
  transport: z.string().max(200).optional().default(""),
});

export async function addItineraryDay(leadId: string, formData: FormData) {
  await verifyAdminSession();
  await connectDB();

  const parsed = itineraryDaySchema.safeParse({
    day: formData.get("day"),
    title: formData.get("title"),
    description: formData.get("description"),
    meals: formData.get("meals") || "",
    hotel: formData.get("hotel") || "",
    transport: formData.get("transport") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const lead = await Lead.findById(leadId);
  if (!lead) return { error: "Lead not found" };

  lead.itinerary = lead.itinerary || [];
  lead.itinerary.push(parsed.data);

  // Sort by day number
  lead.itinerary.sort(
    (a: { day: number }, b: { day: number }) => a.day - b.day,
  );

  await lead.save();
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath(`/dashboard/bookings/${leadId}`);
  return { success: true };
}

export async function removeItineraryDay(
  leadId: string,
  itineraryIndex: number,
) {
  await verifyAdminSession();
  await connectDB();

  const lead = await Lead.findById(leadId);
  if (!lead) return { error: "Lead not found" };

  if (!lead.itinerary || itineraryIndex >= lead.itinerary.length) {
    return { error: "Itinerary day not found" };
  }

  lead.itinerary.splice(itineraryIndex, 1);
  await lead.save();

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath(`/dashboard/bookings/${leadId}`);
  return { success: true };
}

export async function updateTripDetails(leadId: string, formData: FormData) {
  await verifyAdminSession();
  await connectDB();

  const lead = await Lead.findById(leadId);
  if (!lead) return { error: "Lead not found" };

  const inclusionsStr = (formData.get("inclusions") as string) || "";
  const exclusionsStr = (formData.get("exclusions") as string) || "";

  lead.inclusions = inclusionsStr
    .split("\n")
    .map((s: string) => s.trim())
    .filter(Boolean);
  lead.exclusions = exclusionsStr
    .split("\n")
    .map((s: string) => s.trim())
    .filter(Boolean);
  lead.hotelName = (formData.get("hotelName") as string) || undefined;

  const rating = formData.get("hotelRating");
  lead.hotelRating = rating ? Number(rating) : undefined;

  await lead.save();
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath(`/dashboard/bookings/${leadId}`);
  return { success: true };
}

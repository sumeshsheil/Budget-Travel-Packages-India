"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";
import { z } from "zod";
import { logLeadActivity } from "@/lib/lead-activity";
import { createNotification } from "@/lib/notifications";

// ============ AUTH HELPER ============

async function verifySession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ============ VALIDATION SCHEMAS ============

const createLeadSchema = z.object({
  tripType: z.enum(["domestic", "international"], "Trip type is required"),
  departureCity: z
    .string()
    .min(2, "Departure city must be at least 2 characters")
    .max(100),
  destination: z
    .string()
    .min(2, "Destination must be at least 2 characters")
    .max(100),
  travelDate: z.string().min(1, "Travel date is required"),
  duration: z.string().min(1, "Duration is required"),
  guests: z.coerce
    .number()
    .int()
    .min(1, "At least 1 guest required")
    .max(50, "Maximum 50 guests"),
  budget: z.coerce.number().min(1, "Budget must be at least 1"),
  specialRequests: z.string().max(500).optional().default(""),
  primaryTravelerName: z
    .string()
    .min(2, "Traveler name must be at least 2 characters")
    .max(100),
  primaryTravelerEmail: z.string().email("Invalid email address"),
  primaryTravelerPhone: z.string().min(10, "Phone must be at least 10 digits"),
  primaryTravelerAge: z.coerce
    .number()
    .int()
    .min(1, "Age must be at least 1")
    .max(120, "Age must be 120 or less")
    .optional()
    .default(30),
  primaryTravelerGender: z
    .enum(["male", "female", "other"])
    .optional()
    .default("other"),
});

// ============ SERVER ACTIONS ============

export async function createLead(prevState: unknown, formData: FormData) {
  try {
    const session = await verifySession();
    await connectDB();

    // Extract raw form data
    const rawData = {
      tripType: formData.get("tripType"),
      departureCity: formData.get("departureCity"),
      destination: formData.get("destination"),
      travelDate: formData.get("travelDate"),
      duration: formData.get("duration"),
      guests: formData.get("guests"),
      budget: formData.get("budget"),
      specialRequests: formData.get("specialRequests") || "",
      primaryTravelerName: formData.get("primaryTravelerName"),
      primaryTravelerEmail: formData.get("primaryTravelerEmail"),
      primaryTravelerPhone: formData.get("primaryTravelerPhone"),
      primaryTravelerAge: formData.get("primaryTravelerAge") || 30,
      primaryTravelerGender: formData.get("primaryTravelerGender") || "other",
    };

    // Validate with Zod
    const validation = createLeadSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      // Return the first error message for user-facing feedback
      const firstError = Object.values(fieldErrors).flat()[0];
      return {
        success: false,
        error: firstError || "Validation failed. Please check your inputs.",
        fieldErrors,
      };
    }

    const validated = validation.data;

    // Build lead document
    const leadData = {
      tripType: validated.tripType,
      departureCity: validated.departureCity,
      destination: validated.destination,
      travelDate: validated.travelDate,
      duration: validated.duration,
      guests: validated.guests,
      budget: validated.budget,
      specialRequests: validated.specialRequests,
      travelers: [
        {
          name: validated.primaryTravelerName,
          email: validated.primaryTravelerEmail,
          phone: validated.primaryTravelerPhone,
          age: validated.primaryTravelerAge,
          gender: validated.primaryTravelerGender,
        },
      ],
      source: "manual" as const,
      agentId: session.user.role === "agent" ? session.user.id : undefined,
      lastActivityAt: new Date(),
    };

    const newLead = await Lead.create(leadData);

    // Log activity
    await logLeadActivity({
      leadId: newLead._id.toString(),
      userId: session.user.id,
      action: "created",
      details: `Lead created manually for ${validated.primaryTravelerName}`,
    });

    revalidatePath("/admin/leads");
    return {
      success: true,
      message: "Lead created successfully",
      leadId: newLead._id.toString(),
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create lead";
    console.error("Create lead error:", message);
    return { success: false, error: message };
  }
}

export async function updateLeadStage(leadId: string, newStage: string) {
  try {
    await verifySession();
    await connectDB();

    // Validate leadId format
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid lead ID" };
    }

    // Validate stage value
    const validStages = [
      "new",
      "contacted",
      "qualified",
      "proposal_sent",
      "negotiation",
      "won",
      "lost",
      "stale",
    ];
    if (!validStages.includes(newStage)) {
      return { success: false, error: "Invalid stage value" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    const previousStage = lead.stage;
    lead.previousStage = lead.stage;
    lead.stage = newStage as typeof lead.stage;
    lead.lastActivityAt = new Date();
    await lead.save();

    // Log activity
    const session = await auth();
    await logLeadActivity({
      leadId,
      userId: session?.user?.id,
      action: newStage === "stale" ? "auto_stale" : "stage_changed",
      fromStage: previousStage,
      toStage: newStage,
      details: `Stage changed from ${previousStage} to ${newStage}`,
    });

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);

    return { success: true, message: `Stage updated to ${newStage}` };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update stage";
    return { success: false, error: message };
  }
}

export async function assignAgent(leadId: string, agentId: string) {
  try {
    const session = await verifySession();
    if (session.user.role !== "admin") {
      return { success: false, error: "Only admins can assign agents" };
    }

    await connectDB();

    // Validate leadId
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid lead ID" };
    }

    // Handle unassigning: if agentId is empty/unassigned, set to null
    const isUnassigning =
      !agentId || agentId === "unassigned" || agentId === "";

    if (!isUnassigning && !mongoose.Types.ObjectId.isValid(agentId)) {
      return { success: false, error: "Invalid agent ID" };
    }

    await Lead.findByIdAndUpdate(leadId, {
      agentId: isUnassigning ? null : new mongoose.Types.ObjectId(agentId),
      lastActivityAt: new Date(),
    });

    // Log activity
    await logLeadActivity({
      leadId,
      userId: session.user.id,
      action: isUnassigning ? "agent_unassigned" : "agent_assigned",
      details: isUnassigning
        ? "Agent unassigned from lead"
        : `Agent ${agentId} assigned to lead`,
    });

    // Notify agent if assigned
    if (!isUnassigning) {
      await createNotification({
        userId: agentId,
        title: "New Lead Assigned",
        message: "You have been assigned a new lead.",
        type: "info",
        link: `/admin/leads/${leadId}`,
      });
    }

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);

    return {
      success: true,
      message: isUnassigning
        ? "Agent unassigned successfully"
        : "Agent assigned successfully",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to assign agent";
    return { success: false, error: message };
  }
}

export async function deleteLead(leadId: string) {
  try {
    const session = await verifySession();
    if (session.user.role !== "admin") {
      return { success: false, error: "Only admins can delete leads" };
    }

    await connectDB();

    // Validate leadId
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid lead ID" };
    }

    const lead = await Lead.findByIdAndDelete(leadId);
    if (!lead) {
      return { success: false, error: "Lead not found" };
    }

    revalidatePath("/admin/leads");
    return { success: true, message: "Lead deleted successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete lead";
    return { success: false, error: message };
  }
}

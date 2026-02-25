"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import User from "@/lib/db/models/User";
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
  // Support for multiple travelers via JSON string
  travelersJSON: z.string().min(1, "Traveler data is required"),
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
      travelersJSON: formData.get("travelers"), // JSON string from client
    };

    // Validate with Zod
    const validation = createLeadSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0];
      return {
        success: false,
        error: firstError || "Validation failed. Please check your inputs.",
        fieldErrors,
      };
    }

    const validated = validation.data;
    let travelers = [];
    try {
      travelers = JSON.parse(validated.travelersJSON);
      if (!Array.isArray(travelers) || travelers.length === 0) {
        throw new Error("At least one traveler is required");
      }
    } catch (e) {
      return { success: false, error: "Invalid traveler data format" };
    }

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
      travelers: travelers.map((t: any) => ({
        name: t.name,
        email: t.email || undefined,
        phone: t.phone || undefined,
        age: Number(t.age) || 30,
        gender: t.gender || "other",
        aadhaarNumber: t.aadhaarNumber || undefined,
        panNumber: t.panNumber || undefined,
        documents: {
          aadharCard: Array.isArray(t.aadharCard) ? t.aadharCard : [],
          panCard: Array.isArray(t.panCard) ? t.panCard : [],
          passport: Array.isArray(t.passport) ? t.passport : [],
        },
      })),
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
      details: `Manual lead created for ${travelers[0].name} + ${travelers.length - 1} others`,
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

    // === BUSINESS LOGIC CONSTRAINTS FOR 'WON' STAGE ===
    if (newStage === "won") {
      // 1. Check Trip Cost
      if (!lead.tripCost || lead.tripCost <= 0) {
        return {
          success: false,
          error: "Trip Cost must be set before marking as Won.",
        };
      }

      // 2. Check Itinerary (either PDF or list)
      const hasItinerary =
        (lead.itinerary && lead.itinerary.length > 0) || lead.itineraryPdfUrl;
      if (!hasItinerary) {
        return {
          success: false,
          error: "Trip Itinerary must be uploaded before marking as Won.",
        };
      }

      // 3. Check Travel Documents (either PDF or list)
      const hasDocuments =
        (lead.documents && lead.documents.length > 0) ||
        lead.travelDocumentsPdfUrl;
      if (!hasDocuments) {
        return {
          success: false,
          error:
            "Travel Documents/Tickets must be uploaded before marking as Won.",
        };
      }
    }

    const previousStage = lead.stage;
    lead.previousStage = lead.stage;
    lead.stage = newStage as typeof lead.stage;
    lead.lastActivityAt = new Date();
    lead.stageUpdatedAt = new Date();
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

    if (!isUnassigning) {
      if (!mongoose.Types.ObjectId.isValid(agentId)) {
        return { success: false, error: "Invalid agent ID" };
      }

      // Ensure the agent is verified
      const agent = await User.findById(agentId);
      if (!agent || agent.role !== "agent") {
        return { success: false, error: "Target user is not an agent" };
      }

      if (!agent.isVerified) {
        return {
          success: false,
          error: "Only verified agents can be assigned to leads.",
        };
      }
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

export async function bulkAssignAgents(leadIds: string[], agentId: string) {
  try {
    const session = await verifySession();
    if (session.user.role !== "admin") {
      return { success: false, error: "Only admins can perform bulk actions" };
    }

    if (!leadIds || leadIds.length === 0) {
      return { success: false, error: "No leads selected" };
    }

    await connectDB();

    const isUnassigning =
      !agentId || agentId === "unassigned" || agentId === "";

    if (!isUnassigning) {
      if (!mongoose.Types.ObjectId.isValid(agentId)) {
        return { success: false, error: "Invalid agent ID" };
      }

      const agent = await User.findById(agentId);
      if (!agent || agent.role !== "agent") {
        return { success: false, error: "Target user is not an agent" };
      }

      if (!agent.isVerified) {
        return {
          success: false,
          error: "Only verified agents can be assigned to leads.",
        };
      }
    }

    const objectLeadIds = leadIds.map((id) => new mongoose.Types.ObjectId(id));

    await Lead.updateMany(
      { _id: { $in: objectLeadIds } },
      {
        agentId: isUnassigning ? null : new mongoose.Types.ObjectId(agentId),
        lastActivityAt: new Date(),
      },
    );

    // Log activity for each lead
    for (const leadId of leadIds) {
      await logLeadActivity({
        leadId,
        userId: session.user.id,
        action: isUnassigning ? "agent_unassigned" : "agent_assigned",
        details: isUnassigning
          ? "Agent unassigned from lead (Bulk Action)"
          : `Agent ${agentId} assigned to lead (Bulk Action)`,
      });
    }

    // Notify agent once if assigned
    if (!isUnassigning) {
      await createNotification({
        userId: agentId,
        title: "Bulk Leads Assigned",
        message: `You have been assigned ${leadIds.length} new leads.`,
        type: "info",
        link: `/admin/leads`,
      });
    }

    revalidatePath("/admin/leads");
    return {
      success: true,
      message: `${leadIds.length} leads ${isUnassigning ? "unassigned" : "assigned"} successfully`,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to perform bulk assignment";
    return { success: false, error: message };
  }
}

export async function refreshLeadTimer(leadId: string) {
  try {
    await verifySession();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid lead ID" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    lead.stageUpdatedAt = new Date();
    lead.lastActivityAt = new Date();
    await lead.save();

    const session = await auth();
    await logLeadActivity({
      leadId,
      userId: session?.user?.id,
      action: "details_updated",
      details:
        "Lead timer refreshed. The 7-day auto-abandon limit has been reset.",
    });

    revalidatePath(`/admin/leads/${leadId}`);

    return { success: true, message: "Lead timer refreshed." };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to refresh timer";
    return { success: false, error: message };
  }
}

export async function addLeadComment(leadId: string, text: string) {
  try {
    const session = await verifySession();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid lead ID" };
    }

    if (!text || text.trim().length === 0) {
      return { success: false, error: "Comment text cannot be empty" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    // Prevent previous agents from commenting if reassigned
    if (
      session.user.role === "agent" &&
      lead.agentId &&
      lead.agentId.toString() !== session.user.id
    ) {
      return {
        success: false,
        error: "You are no longer assigned to this lead.",
      };
    }

    lead.comments = lead.comments || [];
    lead.comments.push({
      text: text.trim(),
      agentName: session.user.name || "Unknown Agent",
      agentId: new mongoose.Types.ObjectId(session.user.id),
      createdAt: new Date(),
    });

    lead.lastActivityAt = new Date();
    await lead.save();

    await logLeadActivity({
      leadId,
      userId: session.user.id,
      action: "note_added",
      details: "Added a new comment.",
    });

    revalidatePath(`/admin/leads/${leadId}`);

    return { success: true, message: "Comment added successfully." };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to add comment";
    return { success: false, error: message };
  }
}

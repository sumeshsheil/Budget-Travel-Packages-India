"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import { auth } from "@/lib/auth";
import { z } from "zod";

// ============ AUTH HELPER ============

async function verifyAgentOrAdminSession() {
  const session = await auth();
  if (
    !session?.user?.id ||
    (session.user.role !== "admin" && session.user.role !== "agent")
  ) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ============ DOCUMENT ACTIONS ============

export async function updateLeadTravelDocumentsPdf(
  leadId: string,
  travelDocumentsPdfUrl: string,
) {
  try {
    await verifyAgentOrAdminSession();
    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) return { error: "Lead not found" };

    lead.travelDocumentsPdfUrl = travelDocumentsPdfUrl;
    lead.lastActivityAt = new Date();

    await lead.save();
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath(`/dashboard/bookings/${leadId}`);

    return {
      success: true,
      message: "Travel documents PDF updated successfully",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update travel documents PDF";
    return { error: message };
  }
}

export async function addDocument(leadId: string, formData: FormData) {
  // Skeleton implementation to fix build error
  return { error: "Not implemented yet." };
}

export async function removeDocument(leadId: string, index: number) {
  // Skeleton implementation to fix build error
  return { error: "Not implemented yet." };
}

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

// ============ DOCUMENT ACTIONS ============

const addDocumentSchema = z.object({
  name: z.string().min(1, "Document name is required").max(200),
  url: z.string().url("Must be a valid URL"),
  type: z.enum([
    "ticket",
    "voucher",
    "visa",
    "itinerary_pdf",
    "invoice",
    "other",
  ]),
});

export async function addDocument(leadId: string, formData: FormData) {
  await verifyAdminSession();
  await connectDB();

  const parsed = addDocumentSchema.safeParse({
    name: formData.get("name"),
    url: formData.get("url"),
    type: formData.get("type"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const lead = await Lead.findById(leadId);
  if (!lead) return { error: "Lead not found" };

  lead.documents = lead.documents || [];
  lead.documents.push({
    ...parsed.data,
    uploadedAt: new Date(),
  });

  await lead.save();
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath(`/dashboard/bookings/${leadId}`);
  return { success: true };
}

export async function removeDocument(leadId: string, documentIndex: number) {
  await verifyAdminSession();
  await connectDB();

  const lead = await Lead.findById(leadId);
  if (!lead) return { error: "Lead not found" };

  if (!lead.documents || documentIndex >= lead.documents.length) {
    return { error: "Document not found" };
  }

  lead.documents.splice(documentIndex, 1);
  await lead.save();

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath(`/dashboard/bookings/${leadId}`);
  return { success: true };
}

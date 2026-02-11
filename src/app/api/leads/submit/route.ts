import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import { checkRateLimit } from "@/lib/rate-limit";
import { logLeadActivity } from "@/lib/lead-activity";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation Schema matching the form
const leadSchema = z.object({
  tripType: z.enum(["domestic", "international"]),
  departureCity: z.string().min(2),
  destination: z.string().min(2),
  travelDate: z.string(),
  duration: z.string(),
  guests: z.number().min(1),
  budget: z.number().min(1),
  specialRequests: z.string().optional(),
  travelers: z
    .array(
      z.object({
        name: z.string().min(2),
        age: z.number().min(1),
        gender: z.enum(["male", "female", "other"]),
        email: z.string().email(),
        phone: z.string().min(10), // Basic check, better regex later
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate Input
    const validation = leadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const validatedData = validation.data;

    // 2. Get IP Address
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";

    await connectDB();

    // 3. Check Rate Limit
    const { allowed, remaining } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    // 4. Create Lead
    const lead = await Lead.create({
      ...validatedData,
      source: "website",
      ipAddress: ip,
    });

    // Log activity
    await logLeadActivity({
      leadId: lead._id.toString(),
      action: "created",
      details: "Lead submitted via website form",
    });

    // Revalidate admin leads page so new lead shows up immediately
    revalidatePath("/admin/leads");

    return NextResponse.json({
      success: true,
      message:
        "Your inquiry has been submitted successfully! Our travel experts will contact you soon.",
    });
  } catch (error: unknown) {
    console.error(
      "Lead submission error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 },
    );
  }
}

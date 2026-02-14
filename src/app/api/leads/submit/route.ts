import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import { checkRateLimit } from "@/lib/rate-limit";
import { logLeadActivity } from "@/lib/lead-activity";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  sendLeadConfirmationEmail,
  sendLeadNotificationEmail,
} from "@/lib/email";

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
  primaryContact: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(1),
    age: z.number().min(1),
    gender: z.enum(["male", "female", "other"]),
    email: z.string().email(),
    phone: z.string().min(10),
  }),
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

    // 4. Transform primaryContact into travelers array for DB compatibility
    const { primaryContact, ...rest } = validatedData;
    const lead = await Lead.create({
      ...rest,
      travelers: [
        {
          name: `${primaryContact.firstName} ${primaryContact.lastName}`.trim(),
          age: primaryContact.age,
          gender: primaryContact.gender,
          email: primaryContact.email,
          phone: primaryContact.phone,
        },
      ],
      source: "website",
      ipAddress: ip,
    });

    // Log activity
    await logLeadActivity({
      leadId: lead._id.toString(),
      action: "created",
      details: "Lead submitted via website form",
    });

    // Send emails (confirmation to user, notification to admin)
    const fullName =
      `${primaryContact.firstName} ${primaryContact.lastName}`.trim();

    // We don't await these strictly to block the response, but in serverless
    // valid execution requires awaiting. We use Promise.allSettled to not fail the request if email fails.
    await Promise.allSettled([
      sendLeadConfirmationEmail({
        name: fullName,
        email: primaryContact.email,
        phone: primaryContact.phone,
        destination: validatedData.destination,
        budget: validatedData.budget,
        guests: validatedData.guests,
      }),
      sendLeadNotificationEmail({
        name: fullName,
        email: primaryContact.email,
        phone: primaryContact.phone,
        destination: validatedData.destination,
        budget: validatedData.budget,
        guests: validatedData.guests,
      }),
    ]);

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

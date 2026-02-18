import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import User from "@/lib/db/models/User";
import { checkRateLimit } from "@/lib/rate-limit";
import { logLeadActivity } from "@/lib/lead-activity";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import {
  sendLeadConfirmationEmail,
  sendLeadNotificationEmail,
  sendWelcomeEmail,
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
    const { allowed } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    // 4. Find or create customer account
    const { primaryContact, ...rest } = validatedData;
    const customerEmail = primaryContact.email.toLowerCase();

    console.log(`[Lead Submit] Processing lead for email: ${customerEmail}`);

    let customer = await User.findOne({
      email: customerEmail,
      role: "customer",
    });
    let setPasswordUrl: string | undefined;

    if (customer) {
      console.log(`[Lead Submit] Found existing customer: ${customer._id}`);
    }

    if (!customer) {
      console.log(`[Lead Submit] Creating new customer account...`);
      // Generate a secure set-password token
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      // Create customer with a placeholder password (will be replaced when they set their own)
      const placeholderPassword = await bcryptjs.hash(
        crypto.randomBytes(16).toString("hex"),
        12,
      );

      try {
        customer = await User.create({
          email: customerEmail,
          password: placeholderPassword,
          name: `${primaryContact.firstName} ${primaryContact.lastName}`.trim(),
          role: "customer",
          phone: primaryContact.phone,
          isActivated: false,
          setPasswordToken: hashedToken,
          setPasswordExpires: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
        });

        console.log(`[Lead Submit] Created new customer: ${customer._id}`);
        setPasswordUrl = `${process.env.NEXTAUTH_URL}/dashboard/set-password?token=${rawToken}`;
      } catch (createError: unknown) {
        // Handle duplicate email (user may exist with different role)
        if (
          createError instanceof Error &&
          "code" in createError &&
          (createError as { code: number }).code === 11000
        ) {
          console.log(
            `[Lead Submit] Duplicate email, finding existing user...`,
          );
          customer = await User.findOne({ email: customerEmail });
        } else {
          throw createError;
        }
      }
    }

    if (!customer) {
      console.error(
        `[Lead Submit] Failed to find or create customer for ${customerEmail}`,
      );
      return NextResponse.json(
        { error: "Failed to process your account. Please try again." },
        { status: 500 },
      );
    }

    // 5. Create lead linked to customer
    const customerId = customer._id;
    console.log(`[Lead Submit] Creating lead with customerId: ${customerId}`);

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
      customerId: customerId,
    });

    // Verify customerId was saved correctly
    if (!lead.customerId) {
      console.error(
        `[Lead Submit] WARNING: customerId not saved on lead ${lead._id}! Updating directly...`,
      );
      await Lead.updateOne(
        { _id: lead._id },
        { $set: { customerId: customerId } },
      );
    }

    console.log(
      `[Lead Submit] Lead ${lead._id} created with customerId: ${lead.customerId}`,
    );

    // Log activity
    await logLeadActivity({
      leadId: lead._id.toString(),
      action: "created",
      details: "Lead submitted via website form",
    });

    // Send emails (Welcome + Confirmation to user, Notification to admin)
    const fullName =
      `${primaryContact.firstName} ${primaryContact.lastName}`.trim();

    await Promise.allSettled([
      sendWelcomeEmail({
        name: primaryContact.firstName,
        to: primaryContact.email,
        setPasswordUrl,
      }),
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

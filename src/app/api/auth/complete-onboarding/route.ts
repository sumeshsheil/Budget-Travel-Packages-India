import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { z } from "zod";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { sendAgentVerificationNotification } from "@/lib/email";

const onboardingSchema = z.object({
  token: z.string().min(1, "Token is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female", "other"]),
  age: z.number().min(18, "Must be at least 18").max(120),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  aadhaarNumber: z.string().min(12, "Valid Aadhaar number required"),
  panNumber: z.string().min(10, "Valid PAN number required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // Image URLs (already uploaded to ImageKit)
  aadhaarImage: z.string().url("Aadhaar image URL required"),
  panImage: z.string().url("PAN image URL required"),
  faceImage: z.string().url("Face image URL required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = onboardingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = validation.data;

    // Hash the token to match stored version
    const hashedToken = crypto
      .createHash("sha256")
      .update(data.token)
      .digest("hex");

    await connectDB();

    const user = await User.findOne({
      setPasswordToken: hashedToken,
      setPasswordExpires: { $gt: new Date() },
      role: "agent",
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired onboarding link. Please register again." },
        { status: 400 },
      );
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(data.password, 12);

    // Update agent profile
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.name = `${data.firstName} ${data.lastName}`;
    user.gender = data.gender;
    user.age = data.age;
    user.phone = data.phone;
    user.address = data.address;
    user.aadhaarNumber = data.aadhaarNumber;
    user.panNumber = data.panNumber;
    user.password = hashedPassword;
    user.image = data.faceImage;
    user.documents = {
      aadharCard: [data.aadhaarImage],
      panCard: [data.panImage],
      passport: [],
    };
    user.verificationStatus = "pending";
    user.isActivated = false; // Still not active until admin verifies
    user.setPasswordToken = undefined;
    user.setPasswordExpires = undefined;

    await user.save();

    // Notify admin
    await sendAgentVerificationNotification({
      agentName: user.name,
      agentEmail: user.email,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Onboarding complete! Your account is pending admin verification.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

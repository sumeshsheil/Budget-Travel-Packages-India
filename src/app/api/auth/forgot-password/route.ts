import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import crypto from "crypto";
import { z } from "zod";
import { sendOtpEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const { email } = validation.data;

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Explicit error as requested by user
      return NextResponse.json(
        { error: "User not found with this email access" },
        { status: 404 },
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in setPasswordToken (reusing field) and expiry
    user.setPasswordToken = otp;
    user.setPasswordExpires = otpExpires;

    await user.save();

    // Send OTP via Email
    await sendOtpEmail({ email, otp });
    console.log(`Password reset OTP for ${email}: ${otp}`); // Keep log for dev backup

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email address.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

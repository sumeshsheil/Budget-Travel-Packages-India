import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { z } from "zod";

// GET — return customer profile
export async function GET() {
  try {
    const session = await auth();
    const isAuthorized =
      session &&
      (session.user.role === "customer" ||
        session.user.role === "agent" ||
        session.user.role === "admin");

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id)
      .select("-password -setPasswordToken -setPasswordExpires")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH — update allowed fields
// PATCH — update profile
const updateSchema = z.object({
  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  name: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  altPhone: z.string().optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  documents: z
    .object({
      aadharCard: z.array(z.string().url()).optional(),
      passport: z.array(z.string().url()).optional(),
    })
    .optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const isAuthorized =
      session &&
      (session.user.role === "customer" ||
        session.user.role === "agent" ||
        session.user.role === "admin");

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const updates = validation.data;
    await connectDB();

    // Fetch current user to merge and verify
    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Auto-update full name if first/last provided
    if (updates.firstName && updates.lastName) {
      updates.name = `${updates.firstName} ${updates.lastName}`;
    } else if (updates.firstName) {
      updates.name =
        `${updates.firstName} ${currentUser.lastName || ""}`.trim();
    } else if (updates.lastName) {
      updates.name =
        `${currentUser.firstName || ""} ${updates.lastName}`.trim();
    }

    // Prevent changing existing email and main phone
    if (
      currentUser.email &&
      updates.email &&
      updates.email !== currentUser.email
    ) {
      delete updates.email;
    }
    if (
      currentUser.phone &&
      updates.phone &&
      updates.phone !== currentUser.phone
    ) {
      delete updates.phone;
    }

    if (updates.gender === "") {
      delete updates.gender;
    }

    // Replacement logic: If old Aadhar exists and new one is empty, keep the old one (Update Only, No Delete)
    const finalAadhar =
      (updates.documents?.aadharCard?.length ?? 0) > 0
        ? updates.documents!.aadharCard!
        : (currentUser.documents?.aadharCard ?? []);

    // Merge documents
    const mergedDocuments = {
      aadharCard: finalAadhar,
      passport:
        updates.documents?.passport ?? currentUser.documents?.passport ?? [],
    };

    // User is verified if they have provided an Aadhar card
    let isVerified = mergedDocuments.aadharCard.length > 0;

    // Apply updates
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          ...updates,
          documents: mergedDocuments, // Ensure merged docs are saved
          isVerified,
        },
      },
      { new: true, runValidators: true },
    )
      .select("-password -setPasswordToken -setPasswordExpires")
      .lean();

    return NextResponse.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

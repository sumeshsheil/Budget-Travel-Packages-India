"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { verifyAdmin } from "@/lib/auth-check";
import { generatePassword } from "@/lib/password";
import { sendAgentWelcomeEmail } from "@/lib/email";

const createAgentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export async function createAgent(prevState: unknown, formData: FormData) {
  try {
    await verifyAdmin(); // Ensure only admins can create agents
    await connectDB();

    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    const validatedFields = createAgentSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Validation failed. Please check your inputs.",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, phone } = validatedFields.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists.",
      };
    }

    // Generate random password
    const tempPassword = generatePassword();
    const hashedPassword = await bcryptjs.hash(tempPassword, 12);

    // Create user
    // Create user
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "agent",
      status: "active",
      phone,
      mustChangePassword: true,
    });

    // Send welcome email with temp password
    const emailRes = await sendAgentWelcomeEmail({
      name,
      email: email.toLowerCase(),
      password: tempPassword,
      to: email.toLowerCase(),
    });

    if (!emailRes.success) {
      console.error("Failed to send welcome email:", emailRes.error);
      // We don't rollback user creation, but we should inform the admin
      return {
        success: true,
        message: "Agent created, but failed to send welcome email. Check logs.",
        tempPassword, // Return password to admin so they can manually share
      };
    }

    revalidatePath("/admin/agents");

    return {
      success: true,
      message: "Agent created successfully. Welcome email sent.",
    };
  } catch (error: unknown) {
    console.error(
      "Create agent error:",
      error instanceof Error ? error.message : error,
    );
    return {
      success: false,
      error: "Failed to create agent. Please try again.",
    };
  }
}

export async function toggleAgentStatus(agentId: string) {
  try {
    await verifyAdmin();
    await connectDB();

    const agent = await User.findById(agentId);
    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    if (agent.role === "admin") {
      return { success: false, error: "Cannot modify admin status" };
    }

    const newStatus = agent.status === "active" ? "inactive" : "active";
    agent.status = newStatus;
    await agent.save();

    revalidatePath("/admin/agents");
    return { success: true, message: `Agent status updated to ${newStatus}` };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update status";
    return { success: false, error: message };
  }
}

export async function deleteAgent(agentId: string) {
  try {
    await verifyAdmin();
    await connectDB();

    const agent = await User.findById(agentId);
    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    if (agent.role === "admin") {
      return { success: false, error: "Cannot delete admin accounts" };
    }

    // Optional: Check if agent has leads assigned before deleting
    // const hasLeads = await Lead.exists({ agentId });
    // if (hasLeads) return { success: false, error: "Reassign leads before deleting" };

    await User.findByIdAndDelete(agentId);

    revalidatePath("/admin/agents");
    return { success: true, message: "Agent deleted successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete agent";
    return { success: false, error: message };
  }
}

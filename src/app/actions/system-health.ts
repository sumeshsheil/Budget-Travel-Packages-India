"use server";

import { connectDB } from "@/lib/db/mongoose";

interface HealthCheckResult {
  status: "success" | "error" | "warning";
  message: string;
  envCheck: {
    MONGODB_URI: boolean;
    NEXTAUTH_SECRET: boolean;
    NEXTAUTH_URL: boolean;
    RESEND_API_KEY: boolean;
    IMAGEKIT_PRIVATE_KEY: boolean;
  };
  error?: string;
  timestamp: string;
}

export async function checkSystemHealth(): Promise<HealthCheckResult> {
  const envVars = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    IMAGEKIT_PRIVATE_KEY: !!process.env.IMAGEKIT_PRIVATE_KEY,
  };

  const timestamp = new Date().toISOString();

  // Basic validation
  if (!envVars.MONGODB_URI) {
    return {
      status: "error",
      message: "CRITICAL: MONGODB_URI is missing!",
      envCheck: envVars,
      timestamp,
    };
  }

  try {
    // Attempt DB connection
    await connectDB();

    // Check if other critical vars are missing but DB is fine
    const missingVars = Object.entries(envVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      return {
        status: "warning",
        message: `Database connected, but some env vars are missing: ${missingVars.join(", ")}`,
        envCheck: envVars,
        timestamp,
      };
    }

    return {
      status: "success",
      message:
        "System health check passed. Database connected and critical env vars are present.",
      envCheck: envVars,
      timestamp,
    };
  } catch (error) {
    console.error("Health Check Error:", error);
    return {
      status: "error",
      message:
        "Database connection failed! Check your MONGODB_URI and firewall settings.",
      envCheck: envVars,
      error:
        error instanceof Error ? error.stack || error.message : String(error),
      timestamp,
    };
  }
}

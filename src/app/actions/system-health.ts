"use server";

import { connectDB } from "@/lib/db/mongoose";

interface HealthCheckResult {
  status: "success" | "error";
  message: string;
  envCheck: {
    MONGODB_URI: boolean;
  };
  error?: string;
}

export async function checkSystemHealth(): Promise<HealthCheckResult> {
  const mongoUri = process.env.MONGODB_URI;
  const envCheck = {
    MONGODB_URI: !!mongoUri,
  };

  if (!mongoUri) {
    return {
      status: "error",
      message: "MONGODB_URI is not defined in environment variables.",
      envCheck,
    };
  }

  try {
    await connectDB();
    return {
      status: "success",
      message: "Database connection successful.",
      envCheck,
    };
  } catch (error) {
    console.error("Database connection failed:", error);
    return {
      status: "error",
      message: "Database connection failed.",
      envCheck,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";

/**
 * GET /api/health
 *
 * A lightweight diagnostic endpoint that checks environment variables
 * and database connectivity. Use this instead of Server Actions
 * when deploying to environments like Hostinger shared hosting
 * where Server Action IDs can become stale.
 */
export async function GET(request: Request) {
  const envCheck = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "(not set)",
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    IMAGEKIT_PRIVATE_KEY: !!process.env.IMAGEKIT_PRIVATE_KEY,
    NODE_ENV: process.env.NODE_ENV || "(not set)",
  };

  const requestInfo = {
    host: request.headers.get("host"),
    forwardedHost: request.headers.get("x-forwarded-host"),
    url: request.url,
  };

  const timestamp = new Date().toISOString();

  // Check MongoDB connection
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        status: "error",
        message: "CRITICAL: MONGODB_URI is missing!",
        envCheck,
        requestInfo,
        timestamp,
      },
      { status: 500 },
    );
  }

  try {
    await connectDB();

    const missingVars = Object.entries(envCheck)
      .filter(
        ([key, value]) =>
          key !== "NODE_ENV" && key !== "NEXTAUTH_URL" && value === false,
      )
      .map(([key]) => key);

    return NextResponse.json({
      status: missingVars.length > 0 ? "warning" : "success",
      message:
        missingVars.length > 0
          ? `DB connected, but missing: ${missingVars.join(", ")}`
          : "All systems operational.",
      envCheck,
      requestInfo,
      timestamp,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed!",
        envCheck,
        requestInfo,
        error: error instanceof Error ? error.message : String(error),
        timestamp,
      },
      { status: 500 },
    );
  }
}

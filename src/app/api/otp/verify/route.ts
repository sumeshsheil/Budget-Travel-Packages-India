import { NextResponse } from "next/server";
import {
  isTestVerification,
  getTestVerifyResponse,
  getAuthToken,
  MC_ERROR_MESSAGES,
  getMCErrorStatus,
} from "@/lib/sms";

const MC_BASE_URL = "https://cpaas.messagecentral.com";

/**
 * POST /api/otp/verify
 * Verifies an OTP using the verificationId from the send step
 *
 * Body: { verificationId: string, otp: string }
 * Returns: { success: true, verified: true }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { verificationId, otp } = body;

    // --- TEST MODE BYPASS ---
    if (isTestVerification(verificationId, otp)) {
      return NextResponse.json(getTestVerifyResponse());
    }

    // Validate inputs
    if (!verificationId || typeof verificationId !== "string") {
      return NextResponse.json(
        { error: "Invalid verification session" },
        { status: 400 },
      );
    }

    if (!otp || !/^\d{4,6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Please enter a valid OTP" },
        { status: 400 },
      );
    }

    // 1. Get cached auth token
    const authToken = await getAuthToken();

    // 2. Validate OTP via MessageCentral
    const validateUrl = `${MC_BASE_URL}/verification/v3/validateOtp?verificationId=${encodeURIComponent(verificationId)}&code=${encodeURIComponent(otp)}`;

    const validateRes = await fetch(validateUrl, {
      method: "GET",
      headers: {
        authToken,
        accept: "*/*",
      },
    });

    const validateJson = await validateRes.json();

    // Handle specific response codes
    if (validateJson.responseCode === 200) {
      return NextResponse.json({
        success: true,
        verified: true,
      });
    }

    // Error handling based on MessageCentral response codes
    const errorMessage =
      MC_ERROR_MESSAGES[validateJson.responseCode] ||
      validateJson.data?.errorMessage ||
      "OTP verification failed";

    return NextResponse.json(
      {
        error: errorMessage,
        code: validateJson.responseCode,
      },
      { status: getMCErrorStatus(validateJson.responseCode) },
    );
  } catch (error: unknown) {
    console.error(
      "OTP verify error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

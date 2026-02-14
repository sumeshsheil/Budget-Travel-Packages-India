import { NextResponse } from "next/server";
import {
  isTestVerification,
  getTestVerifyResponse,
  getAuthToken,
  MC_ERROR_MESSAGES,
  getMCErrorStatus,
} from "@/lib/sms";

const MC_BASE_URL = "https://cpaas.messagecentral.com";
const MC_CUSTOMER_ID = process.env.MC_CUSTOMER_ID!;

/**
 * POST /api/otp/verify
 * Validates an OTP using MessageCentral Verify Now (validateOtp endpoint)
 *
 * Body: { verificationId: string, otp: string, phone: string, countryCode?: string }
 * Returns: { success: true, verified: true }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { verificationId, otp, phone, countryCode = "91" } = body;

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

    if (!otp || !/^\d{4,8}$/.test(otp)) {
      return NextResponse.json(
        { error: "Please enter a valid OTP" },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required for verification" },
        { status: 400 },
      );
    }

    // 1. Get cached auth token
    const authToken = await getAuthToken();

    // 2. Validate OTP via MessageCentral (GET /validateOtp)
    //    Matches the exact MC dashboard code format
    const validateUrl = `${MC_BASE_URL}/verification/v3/validateOtp?countryCode=${countryCode}&mobileNumber=${phone}&verificationId=${encodeURIComponent(verificationId)}&customerId=${encodeURIComponent(MC_CUSTOMER_ID)}&code=${encodeURIComponent(otp)}`;

    console.log(
      "MC Validate OTP:",
      validateUrl.replace(/code=\d+/, "code=****"),
    );

    const validateRes = await fetch(validateUrl, {
      method: "GET",
      headers: { authToken },
    });

    const validateJson = await validateRes.json();

    // Handle specific response codes
    if (
      validateJson.responseCode === 200 &&
      validateJson.data?.verificationStatus === "VERIFICATION_COMPLETED"
    ) {
      return NextResponse.json({
        success: true,
        verified: true,
      });
    }

    // Also accept plain 200 without status field
    if (validateJson.responseCode === 200) {
      return NextResponse.json({
        success: true,
        verified: true,
      });
    }

    // Error handling based on MessageCentral response codes
    const errorMessage =
      MC_ERROR_MESSAGES[validateJson.responseCode] ||
      validateJson.message ||
      validateJson.data?.errorMessage ||
      "OTP verification failed";

    console.error(
      `MC OTP validation failed [${validateJson.responseCode}]: ${errorMessage}`,
    );

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

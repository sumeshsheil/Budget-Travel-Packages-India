import { NextResponse } from "next/server";
import {
  isTestPhone,
  getTestSendResponse,
  getAuthToken,
  checkPhoneRateLimit,
} from "@/lib/sms";

const MC_BASE_URL = "https://cpaas.messagecentral.com";

/**
 * POST /api/otp/send
 * Sends an OTP to the given phone number via MessageCentral
 *
 * Body: { phone: string }
 * Returns: { success: true, verificationId: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    // --- TEST MODE BYPASS ---
    if (isTestPhone(phone)) {
      return NextResponse.json(getTestSendResponse());
    }

    // Validate phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit Indian phone number" },
        { status: 400 },
      );
    }

    // Per-phone rate limit
    const { allowed } = checkPhoneRateLimit(phone);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "Too many OTP requests for this number. Please try again later.",
        },
        { status: 429 },
      );
    }

    // 1. Get cached auth token
    const authToken = await getAuthToken();

    // 2. Send OTP via MessageCentral
    const sendUrl = `${MC_BASE_URL}/verification/v3/send?countryCode=91&flowType=SMS&mobileNumber=${phone}&type=SMS`;

    const sendRes = await fetch(sendUrl, {
      method: "POST",
      headers: {
        authToken,
        accept: "*/*",
      },
    });

    if (!sendRes.ok) {
      const text = await sendRes.text();
      console.error("MessageCentral send OTP failed:", sendRes.status, text);
      return NextResponse.json(
        { error: "Failed to send OTP. Please try again." },
        { status: 500 },
      );
    }

    const sendJson = await sendRes.json();

    if (sendJson.responseCode !== 200 || !sendJson.data?.verificationId) {
      console.error("MessageCentral send OTP response:", sendJson);

      if (sendJson.responseCode === 800) {
        return NextResponse.json(
          { error: "Maximum OTP limit reached. Please try again later." },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { error: sendJson.data?.errorMessage || "Failed to send OTP" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      verificationId: sendJson.data.verificationId,
    });
  } catch (error: unknown) {
    console.error(
      "OTP send error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

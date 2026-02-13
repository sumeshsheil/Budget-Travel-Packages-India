import { NextResponse } from "next/server";

const MC_BASE_URL = "https://cpaas.messagecentral.com";
const MC_CUSTOMER_ID = process.env.MC_CUSTOMER_ID!;
const MC_API_KEY = process.env.MC_API_KEY!; // Base64 encoded password
const MC_SENDER_ID = process.env.MC_SENDER_ID || "UTOMOB";

/**
 * Helper: Fetches a fresh auth token from MessageCentral
 */
async function getAuthToken(): Promise<string> {
  const url = `${MC_BASE_URL}/auth/v1/authentication/token?customerId=${encodeURIComponent(MC_CUSTOMER_ID)}&key=${encodeURIComponent(MC_API_KEY)}&scope=NEW&country=91`;

  const res = await fetch(url, {
    method: "GET",
    headers: { accept: "*/*" },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("MessageCentral auth failed:", res.status, text);
    throw new Error("Failed to authenticate with SMS provider");
  }

  const json = await res.json();

  if (json.responseCode !== 200 || !json.data?.token) {
    console.error("MessageCentral auth response:", json);
    throw new Error("SMS provider authentication error");
  }

  return json.data.token;
}

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

    // Validate phone
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit Indian phone number" },
        { status: 400 },
      );
    }

    // 1. Get auth token
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

      // Handle specific error codes
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

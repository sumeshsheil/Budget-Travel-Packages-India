import { NextResponse } from "next/server";

const MC_BASE_URL = "https://cpaas.messagecentral.com";
const MC_CUSTOMER_ID = process.env.MC_CUSTOMER_ID!;
const MC_API_KEY = process.env.MC_API_KEY!; // Base64 encoded password

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
    throw new Error("Failed to authenticate with SMS provider");
  }

  const json = await res.json();

  if (json.responseCode !== 200 || !json.data?.token) {
    throw new Error("SMS provider authentication error");
  }

  return json.data.token;
}

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

    // 1. Get auth token
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
    const errorMessages: Record<number, string> = {
      700: "Verification failed. Please request a new OTP.",
      702: "Wrong OTP entered. Please try again.",
      703: "This number has already been verified.",
      705: "OTP has expired. Please request a new one.",
      800: "Maximum attempts reached. Please try again later.",
    };

    const errorMessage =
      errorMessages[validateJson.responseCode] ||
      validateJson.data?.errorMessage ||
      "OTP verification failed";

    return NextResponse.json(
      {
        error: errorMessage,
        code: validateJson.responseCode,
      },
      {
        status:
          validateJson.responseCode === 702
            ? 400
            : validateJson.responseCode === 705
              ? 410
              : validateJson.responseCode === 800
                ? 429
                : 400,
      },
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

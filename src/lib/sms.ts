/**
 * MessageCentral SMS OTP — Shared Utilities
 *
 * Single source of truth for:
 *  • Authentication (with in-memory token caching)
 *  • Sending OTP
 *  • Verifying OTP
 *  • Per-phone rate limiting (in-memory, simple but effective)
 *  • Test-mode bypass for development
 */

// ============ CONFIG ============

const MC_BASE_URL = "https://cpaas.messagecentral.com";
const MC_CUSTOMER_ID = process.env.MC_CUSTOMER_ID!;
const MC_API_KEY = process.env.MC_API_KEY!;

// ============ TEST MODE ============

const TEST_PHONE = "9999999999";
const TEST_OTP = "1234";
const TEST_VERIFICATION_ID = "mock-verification-id-TEST";

export function isTestPhone(phone: string): boolean {
  return phone === TEST_PHONE;
}

export function getTestSendResponse() {
  return { success: true, verificationId: TEST_VERIFICATION_ID };
}

export function isTestVerification(verificationId: string, otp: string) {
  return verificationId === TEST_VERIFICATION_ID && otp === TEST_OTP;
}

export function getTestVerifyResponse() {
  return { success: true, verified: true };
}

// ============ AUTH TOKEN CACHE ============

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

// Cache tokens for 50 minutes (MC tokens typically last ~1 hour)
const TOKEN_TTL_MS = 50 * 60 * 1000;

/**
 * Returns a cached auth token from MessageCentral.
 * Only fetches a new one when the cached token has expired.
 */
export async function getAuthToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

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

  // MC auth response format: { status: 200, token: "..." }
  const token: string | undefined = json.token || json.data?.token;

  if (!token) {
    console.error(
      "MessageCentral auth response (no token found):",
      JSON.stringify(json),
    );
    throw new Error("SMS provider authentication error");
  }

  cachedToken = token;
  tokenExpiresAt = now + TOKEN_TTL_MS;

  return cachedToken;
}

// ============ PER-PHONE RATE LIMITER ============

interface PhoneRateEntry {
  count: number;
  windowStart: number;
  lastSentAt: number;
}

const phoneRateLimits = new Map<string, PhoneRateEntry>();

const MAX_OTP_PER_PHONE = 3; // max OTPs per phone in the window
const PHONE_WINDOW_MS = 60 * 60 * 1000; // 1-hour window
const MIN_GAP_MS = 60 * 1000; // minimum 60s between sends (server-side enforcement)

/**
 * In-memory per-phone rate limiter.
 * Prevents SMS bombing by limiting OTP sends per phone number.
 * Returns { allowed, remaining }.
 */
export function checkPhoneRateLimit(phone: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = phoneRateLimits.get(phone);

  // No previous record or window expired → allow
  if (!entry || now - entry.windowStart > PHONE_WINDOW_MS) {
    phoneRateLimits.set(phone, { count: 1, windowStart: now, lastSentAt: now });
    return { allowed: true, remaining: MAX_OTP_PER_PHONE - 1 };
  }

  // Minimum gap between sends (server-side 30s cooldown)
  const elapsed = now - entry.lastSentAt;
  if (elapsed < MIN_GAP_MS) {
    const waitSeconds = Math.ceil((MIN_GAP_MS - elapsed) / 1000);
    return {
      allowed: false,
      remaining: MAX_OTP_PER_PHONE - entry.count,
      retryAfterSeconds: waitSeconds,
    };
  }

  // Within window — check hourly limit
  if (entry.count >= MAX_OTP_PER_PHONE) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  entry.lastSentAt = now;
  return { allowed: true, remaining: MAX_OTP_PER_PHONE - entry.count };
}

// Periodic cleanup to avoid memory leaks (every 10 minutes)
setInterval(
  () => {
    const now = Date.now();
    for (const [phone, entry] of phoneRateLimits) {
      if (now - entry.windowStart > PHONE_WINDOW_MS) {
        phoneRateLimits.delete(phone);
      }
    }
  },
  10 * 60 * 1000,
);

// ============ MC ERROR CODES ============

export const MC_ERROR_MESSAGES: Record<number, string> = {
  700: "Verification failed. Please request a new OTP.",
  702: "Wrong OTP entered. Please try again.",
  703: "This number has already been verified.",
  705: "OTP has expired. Please request a new one.",
  800: "Maximum attempts reached. Please try again later.",
};

export function getMCErrorStatus(responseCode: number): number {
  switch (responseCode) {
    case 702:
      return 400;
    case 705:
      return 410;
    case 800:
      return 429;
    default:
      return 400;
  }
}

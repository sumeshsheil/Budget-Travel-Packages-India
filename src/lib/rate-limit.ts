import IPRateLimit from "@/lib/db/models/IPRateLimit";

const MAX_LEADS_PER_HOUR = 3;
const BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour
const WINDOW_DURATION_MS = 60 * 60 * 1000; // 1 hour

export async function checkRateLimit(
  ipAddress: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - WINDOW_DURATION_MS);

  // Check if currently blocked (read-only, no race condition risk)
  const blocked = await IPRateLimit.findOne({
    ipAddress,
    blockedUntil: { $gt: now },
  }).lean();

  if (blocked) {
    return { allowed: false, remaining: 0 };
  }

  // Atomic increment: reset window if expired, otherwise increment count
  // Uses findOneAndUpdate to avoid read-then-write race condition
  const result = await IPRateLimit.findOneAndUpdate(
    {
      ipAddress,
      windowStart: { $gte: oneHourAgo }, // Window still active
      leadCount: { $lt: MAX_LEADS_PER_HOUR }, // Still under limit
    },
    {
      $inc: { leadCount: 1 },
    },
    { new: true },
  );

  // Case 1: Existing window found and incremented successfully
  if (result) {
    return {
      allowed: true,
      remaining: MAX_LEADS_PER_HOUR - result.leadCount,
    };
  }

  // Case 2: No matching doc — either new IP, expired window, or at limit
  const existing = await IPRateLimit.findOne({ ipAddress }).lean();

  // 2a: At limit within current window → block IP
  if (
    existing &&
    existing.windowStart >= oneHourAgo &&
    existing.leadCount >= MAX_LEADS_PER_HOUR
  ) {
    await IPRateLimit.findOneAndUpdate(
      { ipAddress },
      { blockedUntil: new Date(now.getTime() + BLOCK_DURATION_MS) },
    );
    return { allowed: false, remaining: 0 };
  }

  // 2b: New IP or expired window → reset and start fresh (atomic upsert)
  await IPRateLimit.findOneAndUpdate(
    { ipAddress },
    {
      $set: {
        leadCount: 1,
        windowStart: now,
        blockedUntil: null,
      },
    },
    { upsert: true, new: true },
  );

  return { allowed: true, remaining: MAX_LEADS_PER_HOUR - 1 };
}

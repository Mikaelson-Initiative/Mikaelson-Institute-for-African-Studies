import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Accepts either raw Upstash env var names, or the KV_REST_API_* names
// Vercel's KV/Upstash Marketplace integration auto-provisions (same REST
// API, different naming). Without either pair configured (e.g. local dev),
// rate limiting fails open — routes still work, just unthrottled.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

function limiterFor(prefix: string, limit: number, window: `${number} ${"s" | "m" | "h"}`) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `ratelimit:${prefix}`,
  });
}

// Failed OTP verification attempts, per email — bounds brute-forcing a live
// 6-digit code within its 10-minute lifetime (see src/lib/otp.ts).
export const otpVerifyLimiter = limiterFor("otp-verify", 8, "10 m");

// OTP-send requests, per IP — the per-email cooldown in otp.ts already
// stops spamming one address; this stops one requester fanning out across
// many different target addresses.
export const otpSendIpLimiter = limiterFor("otp-send-ip", 5, "10 m");

// General public form submissions (contact, submissions, team-application,
// library-support), per IP.
export const formIpLimiter = limiterFor("form-ip", 10, "10 m");

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Returns a 429 response if the identifier is over the limit, otherwise null. */
export async function rateLimitOrResponse(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<NextResponse | null> {
  if (!limiter) return null;
  const { success } = await limiter.limit(identifier);
  if (!success) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many requests. Try again in a few minutes." },
      { status: 429 },
    );
  }
  return null;
}

import "server-only";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RATE_LIMIT_STORE = globalThis.__dakerRateLimitStore ?? new Map();

if (!globalThis.__dakerRateLimitStore) {
  globalThis.__dakerRateLimitStore = RATE_LIMIT_STORE;
}

function cleanupExpiredEntries(now) {
  for (const [key, entry] of RATE_LIMIT_STORE.entries()) {
    if (!entry || entry.resetAt <= now) {
      RATE_LIMIT_STORE.delete(key);
    }
  }
}

export function getClientAddress(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const address = forwardedFor
      .split(",")
      .map((value) => value.trim())
      .find(Boolean);
    if (address) return address;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "anonymous";
}

export function consumeRateLimit({ request, bucket, limit, windowMs, subject = "" }) {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const actor = subject || getClientAddress(request);
  const key = `${bucket}:${actor}`;
  const current = RATE_LIMIT_STORE.get(key);
  const activeEntry = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };

  activeEntry.count += 1;
  RATE_LIMIT_STORE.set(key, activeEntry);

  const retryAfter = Math.max(1, Math.ceil((activeEntry.resetAt - now) / 1000));

  return {
    ok: activeEntry.count <= limit,
    retryAfter,
    remaining: Math.max(0, limit - activeEntry.count),
    limit,
    resetAt: activeEntry.resetAt
  };
}

export function buildRateLimitHeaders(result) {
  return {
    "Retry-After": String(result.retryAfter),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetAt)
  };
}

export function isTurnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
}

export async function assertTurnstileToken({ request, token }) {
  if (!isTurnstileConfigured()) {
    return;
  }

  const normalizedToken = String(token ?? "").trim();
  if (!normalizedToken) {
    throw new Error("보안 확인이 필요합니다. 잠시 후 다시 시도해 주세요.");
  }

  const body = new URLSearchParams({
    secret: String(process.env.TURNSTILE_SECRET_KEY ?? ""),
    response: normalizedToken
  });

  const clientAddress = getClientAddress(request);
  if (clientAddress && clientAddress !== "anonymous") {
    body.set("remoteip", clientAddress);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("보안 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }

  const result = await response.json();
  if (!result?.success) {
    throw new Error("보안 확인이 만료되었거나 유효하지 않습니다. 다시 시도해 주세요.");
  }
}

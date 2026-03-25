import { NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE } from "@/lib/auth";
import { AUTH_INPUT_LIMITS, assertMaxLength } from "@/lib/content-limits";
import { assertTurnstileToken, buildRateLimitHeaders, consumeRateLimit } from "@/lib/request-protection";
import { authenticateAccount, createAuthSession } from "@/lib/store";

export const runtime = "nodejs";

const AUTH_RATE_LIMIT = {
  limit: 8,
  windowMs: 1000 * 60 * 10
};

function buildCookieOptions(expiresAt) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt)
  };
}

export async function POST(request) {
  const rateLimit = consumeRateLimit({
    request,
    bucket: "auth-login",
    limit: AUTH_RATE_LIMIT.limit,
    windowMs: AUTH_RATE_LIMIT.windowMs
  });
  if (!rateLimit.ok) {
    return NextResponse.json({ error: "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429, headers: buildRateLimitHeaders(rateLimit) });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const email = String(payload.email ?? "").trim();
  const password = String(payload.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "이메일과 비밀번호를 입력해 주세요." }, { status: 400 });
  }
  try {
    assertMaxLength("이메일", email, AUTH_INPUT_LIMITS.email);
    assertMaxLength("비밀번호", password, AUTH_INPUT_LIMITS.password);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "입력값을 다시 확인해 주세요." }, { status: 400 });
  }

  try {
    await assertTurnstileToken({ request, token: payload.turnstileToken });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "보안 확인에 실패했습니다." }, { status: 400 });
  }

  try {
    const account = await authenticateAccount({ email, password });
    const authSession = await createAuthSession({ userId: account.userId });

    const response = NextResponse.json({
      ok: true,
      profile: {
        userId: account.userId,
        email: account.email,
        displayName: account.displayName,
        isProfilePublic: account.isProfilePublic
      }
    });
    response.cookies.set(AUTH_SESSION_COOKIE, authSession.token, buildCookieOptions(authSession.expiresAt));
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "로그인에 실패했습니다." }, { status: 400 });
  }
}

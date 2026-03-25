import { NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE } from "@/lib/auth";
import { AUTH_INPUT_LIMITS, assertMaxLength } from "@/lib/content-limits";
import { assertTurnstileToken, buildRateLimitHeaders, consumeRateLimit } from "@/lib/request-protection";
import { createAccount, createAuthSession } from "@/lib/store";
import { sanitizeDisplayName } from "@/lib/visitor";

export const runtime = "nodejs";

const SIGNUP_RATE_LIMIT = {
  limit: 5,
  windowMs: 1000 * 60 * 10
};

const GENERIC_SIGNUP_ERROR = "회원가입 요청을 처리하지 못했습니다. 입력 정보를 확인하거나 잠시 후 다시 시도해 주세요.";

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
    bucket: "auth-signup",
    limit: SIGNUP_RATE_LIMIT.limit,
    windowMs: SIGNUP_RATE_LIMIT.windowMs
  });
  if (!rateLimit.ok) {
    return NextResponse.json({ error: "회원가입 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429, headers: buildRateLimitHeaders(rateLimit) });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const email = String(payload.email ?? "").trim();
  const password = String(payload.password ?? "");
  const displayName = sanitizeDisplayName(payload.displayName, "사용자");

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "이메일과 8자 이상 비밀번호가 필요합니다." }, { status: 400 });
  }
  try {
    assertMaxLength("닉네임", displayName, AUTH_INPUT_LIMITS.displayName);
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
    const account = await createAccount({
      email,
      password,
      displayName
    });
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
  } catch {
    return NextResponse.json({ error: GENERIC_SIGNUP_ERROR }, { status: 400 });
  }
}

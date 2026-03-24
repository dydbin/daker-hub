import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE } from "@/lib/auth";
import { createAccount, createAuthSession } from "@/lib/store";
import { sanitizeDisplayName } from "@/lib/visitor";

export const runtime = "nodejs";

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
  const payload = await request.json();
  const email = String(payload.email ?? "").trim();
  const password = String(payload.password ?? "");
  const displayName = sanitizeDisplayName(payload.displayName, "사용자");

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "이메일과 8자 이상 비밀번호가 필요합니다." }, { status: 400 });
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
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "회원가입에 실패했습니다." }, { status: 400 });
  }
}

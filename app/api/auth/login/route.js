import { NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE } from "@/lib/auth";
import { authenticateAccount, createAuthSession } from "@/lib/store";

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

  if (!email || !password) {
    return NextResponse.json({ error: "이메일과 비밀번호를 입력해 주세요." }, { status: 400 });
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

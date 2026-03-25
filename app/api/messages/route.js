import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { MESSAGE_INPUT_LIMITS, assertMaxLength } from "@/lib/content-limits";
import { assertTurnstileToken, buildRateLimitHeaders, consumeRateLimit } from "@/lib/request-protection";
import { addMessage, getTeamById } from "@/lib/store";
import { isUuid } from "@/lib/uuid";
import { getViewerSession } from "@/lib/visitor";

export const runtime = "nodejs";

const MESSAGE_RATE_LIMIT = {
  limit: 6,
  windowMs: 1000 * 60 * 5
};

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "문의는 로그인 후 남길 수 있습니다." }, { status: 401 });
  }

  const rateLimit = consumeRateLimit({
    request,
    bucket: "messages",
    limit: MESSAGE_RATE_LIMIT.limit,
    windowMs: MESSAGE_RATE_LIMIT.windowMs,
    subject: session.userId
  });
  if (!rateLimit.ok) {
    return NextResponse.json({ error: "문의 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429, headers: buildRateLimitHeaders(rateLimit) });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  if (!payload.teamId || !String(payload.body ?? "").trim()) {
    return NextResponse.json({ error: "teamId와 body가 필요합니다." }, { status: 400 });
  }
  if (!isUuid(payload.teamId)) {
    return NextResponse.json({ error: "문의는 공유 모집글에만 남길 수 있습니다." }, { status: 400 });
  }
  try {
    assertMaxLength("문의 내용", payload.body, MESSAGE_INPUT_LIMITS.body);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "입력값을 다시 확인해 주세요." }, { status: 400 });
  }

  try {
    await assertTurnstileToken({ request, token: payload.turnstileToken });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "보안 확인에 실패했습니다." }, { status: 400 });
  }

  try {
    const team = await getTeamById(payload.teamId);
    if (!team) {
      return NextResponse.json({ error: "문의할 팀을 찾을 수 없습니다." }, { status: 404 });
    }
    if (team.owner_id === session.userId) {
      return NextResponse.json({ error: "내가 만든 팀 글에는 문의를 남길 수 없습니다." }, { status: 400 });
    }

    const message = await addMessage({
      teamId: payload.teamId,
      visitorId: session.userId,
      displayName: session.displayName,
      body: String(payload.body).trim()
    });

    return NextResponse.json({ ok: true, message });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "문의 전송에 실패했습니다." }, { status: 400 });
  }
}

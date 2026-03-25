import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { TEAM_INPUT_LIMITS, assertMaxLength, assertOptionalMaxLength } from "@/lib/content-limits";
import { buildRateLimitHeaders, consumeRateLimit } from "@/lib/request-protection";
import { createTeam, updateTeam } from "@/lib/store";
import { getViewerSession } from "@/lib/visitor";

export const runtime = "nodejs";

const TEAM_RATE_LIMIT = {
  limit: 10,
  windowMs: 1000 * 60 * 10
};

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "팀 모집글 작성은 로그인 후 사용할 수 있습니다." }, { status: 401 });
  }

  const rateLimit = consumeRateLimit({
    request,
    bucket: "teams-write",
    limit: TEAM_RATE_LIMIT.limit,
    windowMs: TEAM_RATE_LIMIT.windowMs,
    subject: session.userId
  });
  if (!rateLimit.ok) {
    return NextResponse.json({ error: "팀 모집 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429, headers: buildRateLimitHeaders(rateLimit) });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }
  const participationMode = payload.participationMode === "solo" ? "solo" : "team";
  const targetMemberCount = Number(payload.targetMemberCount ?? 4);
  const normalizedTargetMemberCount = Number.isFinite(targetMemberCount) ? Math.min(20, Math.max(2, Math.round(targetMemberCount))) : 4;

  if (!payload.name?.trim() || !payload.intro?.trim()) {
    return NextResponse.json({ error: "이름과 소개는 필수입니다." }, { status: 400 });
  }
  try {
    assertMaxLength("팀명", payload.name, TEAM_INPUT_LIMITS.name);
    assertMaxLength("팀 소개", payload.intro, TEAM_INPUT_LIMITS.intro);
    assertOptionalMaxLength("모집 포지션", payload.lookingFor, TEAM_INPUT_LIMITS.lookingFor);
    assertOptionalMaxLength("외부 연락 링크", payload.contactUrl, TEAM_INPUT_LIMITS.contactUrl);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "입력값을 다시 확인해 주세요." }, { status: 400 });
  }

  try {
    const team = await createTeam({
      visitorId: session.userId,
      displayName: session.displayName,
      hackathonSlug: payload.hackathonSlug,
      name: payload.name.trim(),
      intro: payload.intro.trim(),
      participationMode,
      lookingFor: String(payload.lookingFor ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      targetMemberCount: normalizedTargetMemberCount,
      recruitmentDeadlineAt: String(payload.recruitmentDeadlineAt ?? "").trim(),
      contactUrl: String(payload.contactUrl ?? "").trim(),
      isOpen: Boolean(payload.isOpen)
    });

    return NextResponse.json({ ok: true, team });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "팀 모집글 작성에 실패했습니다." }, { status: 400 });
  }
}

export async function PATCH(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "팀 모집글 수정은 로그인 후 사용할 수 있습니다." }, { status: 401 });
  }

  const rateLimit = consumeRateLimit({
    request,
    bucket: "teams-write",
    limit: TEAM_RATE_LIMIT.limit,
    windowMs: TEAM_RATE_LIMIT.windowMs,
    subject: session.userId
  });
  if (!rateLimit.ok) {
    return NextResponse.json({ error: "팀 모집 수정 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429, headers: buildRateLimitHeaders(rateLimit) });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }
  const targetMemberCount = Number(payload.targetMemberCount ?? 4);
  const normalizedTargetMemberCount = Number.isFinite(targetMemberCount) ? Math.min(20, Math.max(2, Math.round(targetMemberCount))) : 4;

  if (!payload.teamId || !payload.name?.trim() || !payload.intro?.trim()) {
    return NextResponse.json({ error: "teamId, 이름, 소개는 필수입니다." }, { status: 400 });
  }
  try {
    assertMaxLength("팀명", payload.name, TEAM_INPUT_LIMITS.name);
    assertMaxLength("팀 소개", payload.intro, TEAM_INPUT_LIMITS.intro);
    assertOptionalMaxLength("모집 포지션", payload.lookingFor, TEAM_INPUT_LIMITS.lookingFor);
    assertOptionalMaxLength("외부 연락 링크", payload.contactUrl, TEAM_INPUT_LIMITS.contactUrl);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "입력값을 다시 확인해 주세요." }, { status: 400 });
  }

  try {
    const team = await updateTeam({
      teamId: String(payload.teamId),
      visitorId: session.userId,
      hackathonSlug: String(payload.hackathonSlug ?? "").trim(),
      name: payload.name.trim(),
      intro: payload.intro.trim(),
      lookingFor: String(payload.lookingFor ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      targetMemberCount: normalizedTargetMemberCount,
      recruitmentDeadlineAt: String(payload.recruitmentDeadlineAt ?? "").trim(),
      contactUrl: String(payload.contactUrl ?? "").trim(),
      isOpen: Boolean(payload.isOpen)
    });

    return NextResponse.json({ ok: true, team });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "팀 모집글 수정에 실패했습니다." }, { status: 400 });
  }
}

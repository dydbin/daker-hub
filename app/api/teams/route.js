import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createTeam, updateTeam } from "@/lib/store";
import { getViewerSession } from "@/lib/visitor";

export const runtime = "nodejs";

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "팀 모집글 작성은 로그인 후 사용할 수 있습니다." }, { status: 401 });
  }

  const payload = await request.json();
  const participationMode = payload.participationMode === "solo" ? "solo" : "team";
  const targetMemberCount = Number(payload.targetMemberCount ?? 4);
  const normalizedTargetMemberCount = Number.isFinite(targetMemberCount) ? Math.min(20, Math.max(2, Math.round(targetMemberCount))) : 4;

  if (!payload.name?.trim() || !payload.intro?.trim()) {
    return NextResponse.json({ error: "이름과 소개는 필수입니다." }, { status: 400 });
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

  const payload = await request.json();
  const targetMemberCount = Number(payload.targetMemberCount ?? 4);
  const normalizedTargetMemberCount = Number.isFinite(targetMemberCount) ? Math.min(20, Math.max(2, Math.round(targetMemberCount))) : 4;

  if (!payload.teamId || !payload.name?.trim() || !payload.intro?.trim()) {
    return NextResponse.json({ error: "teamId, 이름, 소개는 필수입니다." }, { status: 400 });
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

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { addMessage, getTeamById } from "@/lib/store";
import { isUuid } from "@/lib/uuid";
import { getViewerSession } from "@/lib/visitor";

export const runtime = "nodejs";

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "문의는 로그인 후 남길 수 있습니다." }, { status: 401 });
  }

  const payload = await request.json();

  if (!payload.teamId || !String(payload.body ?? "").trim()) {
    return NextResponse.json({ error: "teamId와 body가 필요합니다." }, { status: 400 });
  }
  if (!isUuid(payload.teamId)) {
    return NextResponse.json({ error: "문의는 공유 모집글에만 남길 수 있습니다." }, { status: 400 });
  }

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
}

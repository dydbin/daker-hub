import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createTeam, listTeams, requestTeamJoin } from "@/lib/store";
import { isUuid } from "@/lib/uuid";
import { getViewerSession } from "@/lib/visitor";

export const runtime = "nodejs";

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "참가 신청은 로그인 후 사용할 수 있습니다." }, { status: 401 });
  }

  const payload = await request.json();
  const mode = payload.mode === "join" ? "join" : "solo";

  const teamId = String(payload.teamId ?? "").trim();

  try {
    if (mode === "solo") {
      const hackathonSlug = String(payload.hackathonSlug ?? "").trim();
      if (!hackathonSlug) {
        return NextResponse.json({ error: "해커톤 정보가 필요합니다." }, { status: 400 });
      }

      const existing = (await listTeams({ hackathonSlug })).find((item) => item.owner_id === session.userId);
      if (existing) {
        return NextResponse.json({ error: "이미 이 해커톤에 등록한 참가 글이 있습니다." }, { status: 409 });
      }

      const team = await createTeam({
        visitorId: session.userId,
        displayName: session.displayName,
        hackathonSlug,
        participationMode: "solo",
        name: `${session.displayName} 개인 참가`,
        intro: `${session.displayName}님이 이 해커톤에 개인 참가로 등록했습니다.`,
        lookingFor: [],
        contactUrl: "",
        isOpen: false
      });

      return NextResponse.json({ ok: true, mode, team });
    }

    if (!isUuid(teamId)) {
      return NextResponse.json({ error: "합류 신청은 공유 팀에만 보낼 수 있습니다." }, { status: 400 });
    }

    const result = await requestTeamJoin({
      teamId,
      visitorId: session.userId,
      displayName: session.displayName
    });
    return NextResponse.json({ ok: true, mode, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "합류 신청에 실패했습니다." }, { status: 400 });
  }
}

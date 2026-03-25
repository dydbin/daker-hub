import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { toggleFavorite } from "@/lib/store";
import { getViewerSession } from "@/lib/visitor";

export const runtime = "nodejs";

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  const payload = await request.json();

  if (!payload.hackathonSlug) {
    return NextResponse.json({ error: "hackathonSlug is required" }, { status: 400 });
  }

  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "찜 기능은 로그인 후 사용할 수 있습니다." }, { status: 401 });
  }

  const result = await toggleFavorite({ visitorId: session.userId, hackathonSlug: payload.hackathonSlug });

  return NextResponse.json({ ok: true, ...result });
}

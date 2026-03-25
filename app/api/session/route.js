import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { updateAccountProfile } from "@/lib/store";
import { getViewerSession, sanitizeDisplayName } from "@/lib/visitor";

export const runtime = "nodejs";

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "프로필 설정은 로그인 후 수정할 수 있습니다." }, { status: 401 });
  }

  const payload = await request.json();
  const displayName = sanitizeDisplayName(payload.displayName, session.displayName);
  const result = await updateAccountProfile({
    userId: session.userId,
    email: String(payload.email ?? session.email),
    displayName,
    publicContactEmail: String(payload.publicContactEmail ?? session.publicContactEmail ?? ""),
    isContactEmailPublic: payload.isContactEmailPublic === true
  });

  return NextResponse.json({
    ok: true,
    profile: {
      userId: session.userId,
      email: result.email,
      displayName: result.profile.display_name,
      publicContactEmail: result.profile.public_contact_email ?? "",
      isContactEmailPublic: result.profile.is_contact_email_public === true
    }
  });
}

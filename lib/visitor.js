import "server-only";

import { AUTH_SESSION_COOKIE } from "@/lib/auth";
import { getAuthSessionByToken } from "@/lib/store";

export function sanitizeDisplayName(value, fallback = "사용자") {
  const normalized = String(value ?? "").trim().replace(/\s+/g, " ").slice(0, 24);
  return normalized || fallback;
}

export async function getViewerSession(cookieStore) {
  const sessionToken = cookieStore.get(AUTH_SESSION_COOKIE)?.value ?? "";
  const authSession = await getAuthSessionByToken(sessionToken);

  if (!authSession) {
    return {
      userId: null,
      visitorId: null,
      displayName: "게스트",
      email: "",
      isAuthenticated: false,
      isProfilePublic: false,
      publicContactEmail: "",
      isContactEmailPublic: false
    };
  }

  return {
    userId: authSession.userId,
    visitorId: authSession.userId,
    displayName: sanitizeDisplayName(authSession.displayName, "사용자"),
    email: authSession.email,
    isAuthenticated: true,
    isProfilePublic: authSession.isProfilePublic !== false,
    publicContactEmail: authSession.publicContactEmail ?? "",
    isContactEmailPublic: authSession.isContactEmailPublic === true
  };
}

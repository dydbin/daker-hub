import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AuthPanel } from "@/components/AuthPanel";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const returnTo = typeof params.returnTo === "string" && params.returnTo.startsWith("/") ? params.returnTo : "/mypage";
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY ?? "";

  if (session.isAuthenticated) {
    redirect(returnTo);
  }

  return <AuthPanel mode="login" returnTo={returnTo} turnstileSiteKey={turnstileSiteKey} />;
}

import Link from "next/link";
import { cookies } from "next/headers";

import { getViewerSession } from "@/lib/visitor";

export async function SiteHeader() {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);

  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link href="/" className="brand-mark">
          <span className="brand-mark__eyebrow">Daker Hub</span>
          <strong>공개형 해커톤 포털</strong>
        </Link>
        <div className="site-header__nav-wrap">
          <nav className="site-nav" aria-label="주요 이동">
            <Link href="/">Main</Link>
            <Link href="/hackathons">Hackathons</Link>
            <Link href="/camp">Camp</Link>
            <Link href="/rankings">Ranking</Link>
            <Link href="/mypage">MyPage</Link>
          </nav>
          <div className="site-header__actions">
            <Link className="pill" href="/hackathons?status=ongoing">
              진행중 대회
            </Link>
            <Link className="pill pill--accent" href={session.isAuthenticated ? "/mypage" : "/login"}>
              {session.isAuthenticated ? session.displayName : "Login"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

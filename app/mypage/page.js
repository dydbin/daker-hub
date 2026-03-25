import Link from "next/link";
import { cookies } from "next/headers";

import { ProfileCard } from "@/components/ProfileCard";
import { formatDateTime, statusLabel } from "@/lib/format";
import { loadPortalData } from "@/lib/portal-data";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);

  if (!session.isAuthenticated) {
    return (
      <>
        <section className="page-head">
          <span className="eyebrow">MyPage</span>
          <h1>내 페이지</h1>
          <p>내 활동과 비공개 설정은 로그인 후 관리할 수 있습니다.</p>
        </section>

        <section className="card empty-card auth-entry-card">
          <h2>로그인이 필요합니다.</h2>
          <p>찜한 해커톤, 내 그룹, 제출 저장본과 프로필 공개 범위는 전용 로그인 화면에서 계정에 들어간 뒤 확인할 수 있습니다.</p>
          <div className="button-row auth-entry-card__actions">
            <Link className="button" href="/login?returnTo=/mypage">
              로그인
            </Link>
            <Link className="button button--ghost" href="/signup?returnTo=/mypage">
              회원가입
            </Link>
          </div>
        </section>
      </>
    );
  }

  const portal = await loadPortalData(session.userId);
  const favoriteHackathons = portal.hackathons.filter((item) => portal.favoriteSlugs.has(item.slug));
  const myTeams = portal.sharedTeams.filter((item) => item.owner_id === session.userId);
  const mySubmissions = portal.sharedSubmissions.filter((item) => item.visitor_id === session.userId);

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">MyPage</span>
        <h1>내 페이지</h1>
        <p>내 프로필을 기준으로 찜한 해커톤, 내가 만든 개인/팀 그룹, 저장한 제출 개요를 한 번에 관리합니다.</p>
      </section>

      <section className="grid-layout grid-layout--mypage">
        <ProfileCard session={session} />

        <section className="card section-card">
          <div className="section-head">
            <span className="eyebrow">Summary</span>
            <h2>내 활동 요약</h2>
          </div>
          <div className="meta-grid">
            <div className="meta-chip">
              <span>찜한 해커톤</span>
              <strong>{favoriteHackathons.length}개</strong>
            </div>
            <div className="meta-chip">
              <span>내 그룹</span>
              <strong>{myTeams.length}개</strong>
            </div>
            <div className="meta-chip">
              <span>내 제출 개요</span>
              <strong>{mySubmissions.length}개</strong>
            </div>
            <div className="meta-chip">
              <span>공개 연락 이메일</span>
              <strong>{session.publicContactEmail ? (session.isContactEmailPublic ? "공개중" : "비공개") : "미설정"}</strong>
            </div>
          </div>
        </section>
      </section>

      <section className="grid-layout grid-layout--mypage-panels">
        <section className="card">
          <div className="section-head">
            <span className="eyebrow">Favorites</span>
            <h2>찜한 해커톤</h2>
          </div>
          <div className="stack-list">
            {favoriteHackathons.length ? (
              favoriteHackathons.map((hackathon) => (
                <article className="list-row" key={hackathon.slug}>
                  <div>
                    <strong>{hackathon.title}</strong>
                    <p>{statusLabel(hackathon.status)} · {(hackathon.tags ?? []).join(" · ")}</p>
                  </div>
                  <Link className="button button--ghost" href={`/hackathons/${hackathon.slug}`}>
                    상세 보기
                  </Link>
                </article>
              ))
            ) : (
              <article className="empty-card">
                <h3>찜한 해커톤이 없습니다.</h3>
                <p>해커톤 상세나 목록에서 찜하기를 누르면 여기에 모입니다.</p>
              </article>
            )}
          </div>
        </section>

        <section className="card">
          <div className="section-head">
            <span className="eyebrow">Teams</span>
            <h2>내 그룹</h2>
          </div>
          <div className="stack-list">
            {myTeams.length ? (
              myTeams.map((team) => (
                <article className="list-row" key={team.id}>
                  <div>
                    <strong>{team.name}</strong>
                    <p>
                      {(team.hackathon_slug && portal.hackathons.find((item) => item.slug === team.hackathon_slug)?.title) || "연결 해커톤 없음"} ·{" "}
                      {Number(team.member_count ?? 1) === 0 ? "개인 그룹" : team.is_open ? "팀 그룹 · 모집중" : "팀 그룹 · 마감"}
                    </p>
                  </div>
                  <Link className="button button--ghost" href={`/camp/board/${team.id}${Number(team.member_count ?? 1) === 0 ? "?edit=1" : ""}`}>
                    {Number(team.member_count ?? 1) === 0 ? "팀원 모집" : "팀 보드"}
                  </Link>
                </article>
              ))
            ) : (
              <article className="empty-card">
                <h3>내 그룹이 없습니다.</h3>
                <p>해커톤 상세에서 개인 그룹으로 시작하거나 팀 만들기로 그룹을 만들면 이 페이지에 정리됩니다.</p>
              </article>
            )}
          </div>
        </section>

        <section className="card">
          <div className="section-head">
            <span className="eyebrow">Submissions</span>
            <h2>내 제출 개요</h2>
          </div>
          <div className="stack-list">
            {mySubmissions.length ? (
              mySubmissions.map((item) => (
                <article className="list-row" key={item.id}>
                  <div>
                    <strong>{item.project_title}</strong>
                    <p>
                      {item.team_participants} · {formatDateTime(item.created_at)}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <article className="empty-card">
                <h3>내 제출 개요가 없습니다.</h3>
                <p>해커톤 상세의 제출 섹션에서 저장한 내용이 여기에 누적됩니다.</p>
              </article>
            )}
          </div>
        </section>
      </section>
    </>
  );
}

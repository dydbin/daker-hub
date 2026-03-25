import Link from "next/link";
import { cookies } from "next/headers";

import { ClickableCard } from "@/components/ClickableCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { formatDate, formatDateTime, formatMoney, statusLabel } from "@/lib/format";
import { loadPortalData } from "@/lib/portal-data";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

function getUpcomingMilestone(hackathons) {
  const now = Date.now();
  return hackathons
    .flatMap((hackathon) =>
      (hackathon.detail?.sections?.schedule?.milestones ?? []).map((milestone) => ({
        ...milestone,
        hackathonSlug: hackathon.slug,
        hackathonTitle: hackathon.title
      }))
    )
    .filter((item) => new Date(item.at).getTime() >= now)
    .sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime())[0];
}

function getFavoriteStatusSummary(hackathons, favoriteSlugs) {
  const favorites = hackathons.filter((item) => favoriteSlugs.has(item.slug));
  if (!favorites.length) return "찜한 해커톤이 아직 없습니다.";

  const counts = favorites.reduce(
    (bucket, item) => {
      bucket[item.status] = (bucket[item.status] ?? 0) + 1;
      return bucket;
    },
    { ongoing: 0, upcoming: 0, ended: 0 }
  );

  return [
    counts.ongoing ? `진행중 ${counts.ongoing}개` : "",
    counts.upcoming ? `예정 ${counts.upcoming}개` : "",
    counts.ended ? `종료 ${counts.ended}개` : ""
  ]
    .filter(Boolean)
    .join(" · ");
}

function getLeaderboardRows(hackathons) {
  return hackathons.flatMap((hackathon) =>
    (hackathon.leaderboard?.entries ?? []).map((entry) => ({
      ...entry,
      hackathonTitle: hackathon.title
    }))
  );
}

function getLeaderboardCutoff(rows, days) {
  const latest = rows.reduce((max, row) => Math.max(max, new Date(row.submittedAt).getTime()), 0);
  const reference = latest || Date.now();
  return reference - days * 24 * 60 * 60 * 1000;
}

function filterLeaderboardRows(rows, days) {
  const cutoff = getLeaderboardCutoff(rows, days);
  return rows.filter((row) => new Date(row.submittedAt).getTime() >= cutoff);
}

function getStartDate(hackathon) {
  if (hackathon.period?.startAt) return hackathon.period.startAt;

  const milestones = hackathon.detail?.sections?.schedule?.milestones ?? [];
  if (!milestones.length) return null;

  return [...milestones]
    .map((item) => item.at)
    .filter(Boolean)
    .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())[0] ?? null;
}

function getPrizeTotal(hackathon) {
  const items = hackathon.detail?.sections?.prize?.items ?? [];
  if (!items.length) return null;
  return items.reduce((sum, item) => sum + Number(item.amountKRW ?? 0), 0);
}

function getParticipantTeamCount(hackathon, portal) {
  const leaderboardCount = hackathon.leaderboard?.entries?.length ?? 0;
  if (leaderboardCount) return leaderboardCount;

  return (hackathon.officialTeams?.length ?? 0) + (portal.teamsBySlug[hackathon.slug]?.length ?? 0);
}

function getStatusPriority(status) {
  const order = { ongoing: 0, upcoming: 1, ended: 2 };
  return order[status] ?? 3;
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);

  const portal = await loadPortalData(session.userId);
  const hackathons = portal.hackathons;
  const ongoingHackathons = hackathons.filter((item) => item.status === "ongoing");
  const upcomingHackathons = hackathons.filter((item) => item.status === "upcoming");
  const mySubmissions = portal.sharedSubmissions.filter((item) => item.visitor_id === session.userId);
  const myTeams = portal.sharedTeams.filter((item) => item.owner_id === session.userId);
  const openTeams = portal.sharedTeams.filter((item) => item.is_open);
  const openHackathonCount = new Set(openTeams.map((item) => item.hackathon_slug).filter(Boolean)).size;
  const leaderboardRows = getLeaderboardRows(hackathons);
  const topRank = [...leaderboardRows].sort((left, right) => Number(right.score ?? 0) - Number(left.score ?? 0))[0];
  const monthRows = filterLeaderboardRows(leaderboardRows, 30);
  const weekRows = filterLeaderboardRows(leaderboardRows, 7);
  const monthTopRank = [...monthRows].sort((left, right) => Number(right.score ?? 0) - Number(left.score ?? 0))[0];
  const weekTopRank = [...weekRows].sort((left, right) => Number(right.score ?? 0) - Number(left.score ?? 0))[0];
  const upcomingMilestone = getUpcomingMilestone(hackathons);
  const favoriteList = hackathons.filter((item) => portal.favoriteSlugs.has(item.slug));
  const favoriteNames = favoriteList.map((item) => item.title).slice(0, 2).join(" · ");
  const favoriteSummary = getFavoriteStatusSummary(hackathons, portal.favoriteSlugs);
  const featuredHackathons = [...hackathons]
    .sort((left, right) => {
      const statusDiff = getStatusPriority(left.status) - getStatusPriority(right.status);
      if (statusDiff) return statusDiff;
      return new Date(getStartDate(left) ?? left.period?.submissionDeadlineAt ?? 0).getTime() - new Date(getStartDate(right) ?? right.period?.submissionDeadlineAt ?? 0).getTime();
    })
    .slice(0, 3);

  return (
    <>
      <section className="portal-hero card">
        <div className="portal-hero__content">
          <span className="eyebrow">Public Hackathon Portal</span>
          <h1>해커톤 탐색부터 팀업, 제출 점검까지 한 번에!</h1>
          <p>
            공개 해커톤 정보를 빠르게 훑고, 팀 모집 보드와 랭킹 흐름을 이어서 확인할 수 있는 보드형 포털입니다.
          </p>
          <div className="button-row portal-hero__actions">
            <Link className="button" href="/hackathons">
              대회 둘러보기
            </Link>
            <Link className="button button--ghost" href="/camp">
              팀 찾기
            </Link>
            <Link className="button button--ghost" href={session.isAuthenticated ? "/mypage" : "/login?returnTo=/mypage"}>
              {session.isAuthenticated ? "내 프로필" : "로그인"}
            </Link>
          </div>
          <div className="portal-chip-row">
            <Link className="tag" href={upcomingMilestone ? `/hackathons/${upcomingMilestone.hackathonSlug}#schedule` : "/hackathons"}>
              다음 일정 확인
            </Link>
            <Link className="tag" href="/camp?status=open">
              모집중 팀 보기
            </Link>
            <Link className="tag" href="/rankings">
              랭킹 보드
            </Link>
            <Link className="tag" href={session.isAuthenticated ? "/mypage" : "/login?returnTo=/mypage"}>
              {session.isAuthenticated ? "내 프로필 관리" : "로그인 후 프로필"}
            </Link>
          </div>
        </div>

        <div className="portal-hero__side">
          <div className="portal-kpi-grid">
            <article className="portal-kpi-card">
              <span>공개 해커톤</span>
              <strong>{hackathons.length}</strong>
              <small>진행중 {ongoingHackathons.length} · 예정 {upcomingHackathons.length}</small>
            </article>
            <article className="portal-kpi-card">
              <span>모집중 참가 글</span>
              <strong>{openTeams.length}</strong>
              <small>{openHackathonCount}개 해커톤에서 팀을 찾는 중</small>
            </article>
            <article className="portal-kpi-card">
              <span>공개 리더보드</span>
              <strong>{leaderboardRows.length}</strong>
              <small>{topRank ? `현재 최고 점수 ${topRank.teamName}` : "아직 공개 랭킹이 없습니다."}</small>
            </article>
            <article className="portal-kpi-card">
              <span>내 저장 흐름</span>
              <strong>{mySubmissions.length + myTeams.length}</strong>
              <small>{session.isAuthenticated ? "내 제출/팀 모집 활동 요약" : "로그인 후 개인 흐름을 저장합니다."}</small>
            </article>
          </div>

          <article className="portal-insight-card">
            <span className="eyebrow">Next Action</span>
            <strong>{upcomingMilestone ? upcomingMilestone.name : "예정된 일정이 없습니다."}</strong>
            <p>
              {upcomingMilestone
                ? `${upcomingMilestone.hackathonTitle} · ${formatDateTime(upcomingMilestone.at)}`
                : "현재 등록된 일정 중 가까운 다음 마일스톤이 없습니다."}
            </p>
            <div className="portal-insight-card__meta">
              <div>
                <span>찜한 해커톤</span>
                <strong>{favoriteList.length}개</strong>
              </div>
              <div>
                <span>요약</span>
                <strong>{favoriteSummary || "저장된 해커톤 없음"}</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-head section-head--tight page-head page-head--home">
        <div>
          <span className="eyebrow">Entry Boards</span>
          <h2>Daker Hub 핵심 탐색</h2>
          <p>대회 탐색, 팀업, 랭킹, 개인화 기능을 목적별 보드로 나눠 빠르게 이동할 수 있게 정리했습니다.</p>
        </div>
      </section>

      <ClickableCard
        className="card portal-entry-card portal-entry-card--primary portal-entry-card--clickable"
        href="/hackathons"
        label="전체 해커톤 목록 보기"
      >
        <div className="portal-entry-card__head">
          <span className="eyebrow">Browse</span>
          <h2>해커톤 보기</h2>
          <p>상태, 태그, 찜, 모집중 참가 글 기준으로 대회를 빠르게 훑습니다.</p>
        </div>
        <div className="portal-entry-card__summary">
          <Link className="portal-entry-card__stat portal-entry-card__stat-link" href="/hackathons?scope=favorites">
            <span>찜한 해커톤</span>
            <strong>{favoriteList.length}개</strong>
            <small>{favoriteList.length ? favoriteNames || favoriteSummary : "찜한 해커톤이 아직 없습니다."}</small>
          </Link>
          <Link
            className="portal-entry-card__stat portal-entry-card__stat-link"
            href={upcomingMilestone ? `/hackathons/${upcomingMilestone.hackathonSlug}#schedule` : "/hackathons"}
          >
            <span>다음 예정된 할 일</span>
            <strong>{upcomingMilestone ? `${upcomingMilestone.name} · ${formatDateTime(upcomingMilestone.at)}` : "일정 정보 없음"}</strong>
            <small>{upcomingMilestone ? upcomingMilestone.hackathonTitle : "확인할 일정이 없으면 전체 해커톤 목록으로 이동합니다."}</small>
          </Link>
        </div>
        <div className="portal-subcards">
          <Link className="portal-subcard" href="/hackathons?scope=favorites">
            <strong>찜한 해커톤</strong>
            <span>{favoriteList.length}개</span>
            <small>{favoriteSummary || "아직 저장된 해커톤이 없습니다."}</small>
          </Link>
          <Link className="portal-subcard" href="/hackathons?status=ongoing">
            <strong>진행중인 해커톤</strong>
            <span>{ongoingHackathons.length}개</span>
            <small>{ongoingHackathons.length ? ongoingHackathons.map((item) => item.title).slice(0, 2).join(" · ") : "현재 진행중인 해커톤이 없습니다."}</small>
          </Link>
          <Link className="portal-subcard" href="/hackathons?status=upcoming">
            <strong>예정된 해커톤</strong>
            <span>{upcomingHackathons.length}개</span>
            <small>{upcomingHackathons.length ? upcomingHackathons.map((item) => item.title).slice(0, 2).join(" · ") : "예정된 해커톤이 없습니다."}</small>
          </Link>
        </div>
      </ClickableCard>

      <section className="grid-layout home-entry-grid">
        <ClickableCard className="card portal-entry-card" href="/camp" label="공유 참가 보드 보기">
        <div className="portal-entry-card__head">
            <span className="eyebrow">Camp</span>
            <h2>참가 보드</h2>
            <p>모집중 팀 글, 내가 만든 글, 연결된 해커톤 수를 확인하세요!</p>
          </div>
          <div className="portal-entry-card__stats">
            <Link className="portal-entry-card__stat portal-entry-card__stat-link" href="/camp?status=open">
              <span>모집중 참가 글</span>
              <strong>{openTeams.length}개</strong>
            </Link>
            <Link className="portal-entry-card__stat portal-entry-card__stat-link" href="/hackathons?scope=recruiting">
              <span>모집중 참가 글 있는 해커톤</span>
              <strong>{openHackathonCount}개</strong>
            </Link>
            <Link className="portal-entry-card__stat portal-entry-card__stat-link" href="/camp?owner=me">
              <span>내가 만든 참가 글</span>
              <strong>{myTeams.length}개</strong>
            </Link>
            <Link className="portal-entry-card__stat portal-entry-card__stat-link" href="/hackathons?scope=favorites">
              <span>찜한 해커톤 상태</span>
              <strong>{favoriteList.length}개 저장</strong>
              <small>{favoriteSummary}</small>
            </Link>
          </div>
        </ClickableCard>

        <ClickableCard className="card portal-entry-card" href="/rankings" label="전체 해커톤 순위 보기">
          <div className="portal-entry-card__head">
            <span className="eyebrow">Ranking</span>
            <h2>랭킹 보기</h2>
            <p>전체 리더보드와 최근 기간 랭킹, 내 순위를 확인하세요!</p>
          </div>
          <div className="portal-entry-card__stats">
            <Link className="portal-entry-card__stat portal-entry-card__stat-link" href="/rankings">
              <span>전체 해커톤 순위</span>
              <strong>{leaderboardRows.length}명</strong>
              <small>{topRank ? `현재 1위 ${topRank.teamName} · ${topRank.score}` : "공개 글로벌 랭킹 데이터가 없습니다."}</small>
            </Link>
            <Link className="portal-entry-card__stat portal-entry-card__stat-link" href="/rankings?period=30">
              <span>최근 30일 순위</span>
              <strong>{monthRows.length}명</strong>
              <small>{monthTopRank ? `30일 기준 선두 ${monthTopRank.teamName} · ${monthTopRank.score}` : "최근 30일 순위 데이터가 없습니다."}</small>
            </Link>
            <Link className="portal-entry-card__stat portal-entry-card__stat-link" href="/rankings?period=7">
              <span>최근 7일 순위</span>
              <strong>{weekRows.length}명</strong>
              <small>{weekTopRank ? `7일 기준 선두 ${weekTopRank.teamName} · ${weekTopRank.score}` : "최근 7일 순위 데이터가 없습니다."}</small>
            </Link>
            <Link className="portal-entry-card__stat portal-entry-card__stat-link" href="/rankings/mine">
              <span>내 리더보드</span>
              <strong>{mySubmissions.length}개</strong>
              <small>{mySubmissions.length ? "내가 저장한 제출 흐름만 따로 확인합니다." : "아직 저장된 제출 개요가 없습니다."}</small>
            </Link>
          </div>
        </ClickableCard>
      </section>

      <section className="section-head section-head--tight">
        <div>
          <span className="eyebrow">Featured Competitions</span>
          <h2>지금 바로 확인할 대회</h2>
          <p>진행 상태와 일정 기준을 확인하세요!</p>
        </div>
        <Link className="button button--ghost" href="/hackathons">
          전체 해커톤 보기
        </Link>
      </section>

      <section className="grid-layout grid-layout--cards home-feature-grid">
        {featuredHackathons.map((hackathon) => (
          <article className="card hackathon-card hackathon-card--board home-hackathon-card" key={hackathon.slug}>
            <div className={`hackathon-card__visual hackathon-card__visual--${hackathon.status}`}>
              <div className="hackathon-card__visual-top">
                <span className="hackathon-card__visual-badge">{statusLabel(hackathon.status)}</span>
                <FavoriteButton hackathonSlug={hackathon.slug} active={portal.favoriteSlugs.has(hackathon.slug)} variant="soft" />
              </div>
              <div className="hackathon-card__visual-copy">
                <span className="hackathon-card__org hackathon-card__org--inverse">{hackathon.slug === "daker-handover-2026-03" ? "Daker" : "Hackathon"}</span>
                <h2>{hackathon.title}</h2>
                <p>
                  시작 {formatDate(getStartDate(hackathon))} · 마감 {formatDate(hackathon.period?.submissionDeadlineAt)}
                </p>
              </div>
            </div>
            <div className="hackathon-card__body">
              <div className="hackathon-card__prize">
                <span>총 상금</span>
                <strong>{formatMoney(getPrizeTotal(hackathon))}</strong>
              </div>
              <div className="hackathon-card__stats">
                <span>{getParticipantTeamCount(hackathon, portal)}팀 참가</span>
                <span>공유 참가 글 {portal.teamsBySlug[hackathon.slug]?.length ?? 0}</span>
              </div>
              <div className="tag-row">
                {(hackathon.tags ?? []).map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="button-row hackathon-card__actions">
              <Link className="button" href={`/hackathons/${hackathon.slug}`}>
                상세 보기
              </Link>
              <Link className="button button--ghost" href={`/camp?hackathon=${hackathon.slug}`}>
                참가 글
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

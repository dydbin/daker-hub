import Link from "next/link";
import { cookies } from "next/headers";

import { HackathonFilters } from "@/components/HackathonFilters";
import { FavoriteButton } from "@/components/FavoriteButton";
import { formatDate, formatMoney, statusLabel } from "@/lib/format";
import { loadPortalData } from "@/lib/portal-data";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

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

function getCountdownLabel(deadlineAt, status) {
  if (!deadlineAt) return status === "ended" ? "종료됨" : "일정 미정";
  if (status === "ended") return "종료됨";

  const diff = new Date(deadlineAt).getTime() - Date.now();
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  if (days > 0) return `D-${days}`;
  if (days === 0) return "D-Day";
  return "마감 지남";
}

export default async function HackathonsPage({ searchParams }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  const portal = await loadPortalData(session.userId);

  const status = ["all", "ongoing", "upcoming", "ended"].includes(params.status) ? params.status : "all";
  const tag = params.tag ?? "all";
  const scope = ["all", "favorites", "recruiting"].includes(params.scope) ? params.scope : "all";
  const featuredTags = portal.tags.slice(0, 8);

  const filtered = portal.hackathons.filter((item) => {
    const statusMatch = status === "all" || item.status === status;
    const tagMatch = tag === "all" || (item.tags ?? []).includes(tag);
    const scopeMatch =
      scope === "all" ||
      (scope === "favorites" && portal.favoriteSlugs.has(item.slug)) ||
      (scope === "recruiting" && (portal.teamsBySlug[item.slug] ?? []).some((team) => team.is_open));
    return statusMatch && tagMatch && scopeMatch;
  });
  const scopeTitle = scope === "favorites" ? "찜한 해커톤 보드" : scope === "recruiting" ? "모집중 참가 글 있는 해커톤" : "해커톤 보드";
  const statusLabelMap = {
    ongoing: "진행중인",
    upcoming: "예정된",
    ended: "종료된"
  };
  const pageTitle = statusLabelMap[status] ? `${statusLabelMap[status]} ${scopeTitle}` : scopeTitle;
  const pageDescription =
    scope === "favorites"
      ? "하트로 저장한 해커톤만 따로 모아 봅니다."
      : scope === "recruiting"
        ? "현재 공유 참가 글이 열려 있는 해커톤만 따로 모아 봅니다."
        : statusLabelMap[status]
          ? `${statusLabelMap[status]} 해커톤만 따로 모아 봅니다.`
          : "공개 대회 정보는 서버에서 읽고, 찜/팀/제출 상태는 공유 저장소에서 덧씌워 렌더링합니다.";
  const filteredOpenTeams = filtered.reduce((sum, hackathon) => sum + (portal.teamsBySlug[hackathon.slug]?.filter((team) => team.is_open).length ?? 0), 0);

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Hackathons</span>
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </section>

      <section className="board-summary-grid">
        <article className="stat-card board-summary-card">
          <span>현재 결과</span>
          <strong>{filtered.length}개</strong>
          <small>{status === "all" ? "조건에 맞는 전체 해커톤" : `${statusLabelMap[status]} 해커톤`}</small>
        </article>
        <article className="stat-card board-summary-card">
          <span>모집중 참가 글</span>
          <strong>{filteredOpenTeams}개</strong>
          <small>현재 필터 안에서 바로 팀업 가능한 글 수</small>
        </article>
        <article className="stat-card board-summary-card">
          <span>찜한 해커톤</span>
          <strong>{filtered.filter((item) => portal.favoriteSlugs.has(item.slug)).length}개</strong>
          <small>지금 보고 있는 필터 안에서 저장된 대회 수</small>
        </article>
        <article className="stat-card board-summary-card">
          <span>태그 범위</span>
          <strong>{tag === "all" ? featuredTags.length : 1}</strong>
          <small>{tag === "all" ? "상단 주요 태그 기준" : `${tag} 태그 필터 적용중`}</small>
        </article>
      </section>

      <HackathonFilters featuredTags={featuredTags} scope={scope} status={status} tag={tag} tags={portal.tags} />

      {filtered.length ? (
        <section className="grid-layout grid-layout--cards">
          {filtered.map((hackathon) => (
            <article className="card hackathon-card hackathon-card--board" key={hackathon.slug}>
              <div className={`hackathon-card__visual hackathon-card__visual--${hackathon.status}`}>
                <div className="hackathon-card__visual-top">
                  <span className="hackathon-card__visual-badge">{statusLabel(hackathon.status)}</span>
                  <span className="hackathon-card__visual-deadline">{getCountdownLabel(hackathon.period?.submissionDeadlineAt, hackathon.status)}</span>
                </div>
                <div className="hackathon-card__visual-copy">
                  <span className="hackathon-card__org hackathon-card__org--inverse">{hackathon.slug === "daker-handover-2026-03" ? "Daker" : "Hackathon"}</span>
                  <h2>{hackathon.title}</h2>
                  <p>
                    시작 {formatDate(getStartDate(hackathon))} · 마감 {formatDate(hackathon.period?.submissionDeadlineAt)}
                  </p>
                </div>
                <FavoriteButton hackathonSlug={hackathon.slug} active={portal.favoriteSlugs.has(hackathon.slug)} variant="soft" />
              </div>
              <div className="hackathon-card__body">
                <div className="hackathon-card__prize">
                  <span>총 상금</span>
                  <strong>{formatMoney(getPrizeTotal(hackathon))}</strong>
                </div>
              </div>
              <div className="hackathon-card__date-grid">
                <div className="meta-chip">
                  <span>시작일</span>
                  <strong>{formatDate(getStartDate(hackathon))}</strong>
                </div>
                <div className="meta-chip">
                  <span>마감일</span>
                  <strong>{formatDate(hackathon.period?.submissionDeadlineAt)}</strong>
                </div>
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
      ) : (
        <article className="empty-card">
          <h2>조건에 맞는 해커톤이 없습니다.</h2>
          <p>필터를 하나씩 해제하거나 다른 태그/상태 조합으로 다시 확인해 보세요.</p>
        </article>
      )}
    </>
  );
}

import { cookies } from "next/headers";
import Link from "next/link";

import { CampCreatePanel, MessageForm, TeamEditForm } from "@/components/InteractiveForms";
import { formatDateTime } from "@/lib/format";
import { getParticipationEyebrow, getParticipationLabel, getParticipationNeedLabel, isSoloEntry } from "@/lib/participation";
import { loadPortalData } from "@/lib/portal-data";
import { listMessagesByTeamIds } from "@/lib/store";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

function buildCampHref({ hackathonSlug = "", status = "all", owner = "all" }) {
  const params = new URLSearchParams();
  if (hackathonSlug) params.set("hackathon", hackathonSlug);
  if (status !== "all") params.set("status", status);
  if (owner !== "all") params.set("owner", owner);
  const query = params.toString();
  return query ? `/camp?${query}` : "/camp";
}

function getHackathonTitle(portal, slug) {
  if (!slug) return "연결된 해커톤 없음";
  return portal.hackathons.find((item) => item.slug === slug)?.title ?? slug;
}

function getRecruitmentWindow(team) {
  const deadline = team.recruitment_deadline_at ?? team.recruitmentDeadlineAt ?? null;
  if (!deadline) return "상시 모집";
  return `~ ${formatDateTime(deadline)}`;
}

function getMemberProgress(team) {
  const currentCount = Number(team.member_count ?? team.memberCount ?? 1) || 1;
  const targetCount = Number(team.target_member_count ?? team.targetMemberCount ?? 4) || 4;
  return `${currentCount}/${targetCount}명`;
}

export default async function CampPage({ searchParams }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY ?? "";
  const portal = await loadPortalData(session.userId);
  const hackathonSlug = params.hackathon ?? params.hackathons ?? "";
  const mode = params.mode === "create" ? "create" : "browse";
  const status = ["open", "closed"].includes(params.status) ? params.status : "all";
  const owner = params.owner === "me" ? "me" : "all";
  const linkedHackathon = portal.hackathons.find((item) => item.slug === hackathonSlug) ?? null;
  const teams = portal.sharedTeams.filter((team) => {
    const soloEntry = isSoloEntry(team);
    if (soloEntry && owner !== "me") return false;
    const hackathonMatch = !hackathonSlug || team.hackathon_slug === hackathonSlug;
    const statusMatch = soloEntry ? status === "all" : status === "all" || team.is_open === (status === "open");
    const ownerMatch = owner !== "me" || team.owner_id === session.userId;
    return hackathonMatch && statusMatch && ownerMatch;
  });
  const pageTitle = linkedHackathon
    ? owner === "me"
      ? `${linkedHackathon.title} · 내 그룹`
      : status === "open"
        ? `${linkedHackathon.title} · 모집중 팀`
        : status === "closed"
          ? `${linkedHackathon.title} · 모집 마감 팀`
          : `${linkedHackathon.title} 팀 모집 보드`
    : owner === "me"
      ? "내 그룹"
      : status === "open"
        ? "전체 모집중 팀"
        : status === "closed"
          ? "전체 모집 마감 팀"
          : "전체 모집 보드";
  const pageDescription = owner === "me"
    ? linkedHackathon
      ? "이 해커톤 안에서 개인으로 시작한 그룹과 팀 모집으로 전환한 그룹을 함께 관리하는 화면입니다."
      : "개인으로 시작한 그룹과 팀 모집으로 전환한 그룹을 해커톤별로 관리하는 화면입니다."
    : linkedHackathon
      ? status === "open"
        ? "이 해커톤에서 현재 모집 중인 팀만 따로 모아 보는 보드입니다."
        : status === "closed"
          ? "이 해커톤에서 모집이 마감된 팀만 따로 모아 보는 보드입니다."
          : "이 해커톤에 연결된 팀 모집글만 한 곳에서 보는 보드입니다."
      : status === "open"
      ? "여러 해커톤의 모집중 팀만 따로 모아 보는 필터입니다."
      : status === "closed"
        ? "여러 해커톤의 모집 마감 팀만 따로 모아 보는 필터입니다."
        : "여러 해커톤의 팀 모집글을 한 곳에서 보는 전체 모집 보드입니다.";
  const emptyTitle = owner === "me" && !session.isAuthenticated ? "로그인 후 내 그룹을 확인할 수 있습니다." : owner === "me" ? "아직 내가 만든 그룹이 없습니다." : "아직 공유된 팀 모집글이 없습니다.";
  const emptyDescription = owner === "me"
    ? session.isAuthenticated
      ? "개인 참가를 먼저 시작하거나 팀 모집하기로 그룹을 만들면 이 화면에서 바로 확인할 수 있습니다."
      : "내 글 필터와 문의 inbox는 로그인한 사용자만 확인할 수 있습니다."
    : status === "open"
      ? "현재 열려 있는 모집 글이 없으면 전체 보드에서 다른 상태를 확인해 보세요."
      : status === "closed"
        ? "아직 마감 상태의 모집 글이 없습니다."
        : "아직 등록된 팀 모집글이 없습니다. 첫 모집 글을 작성해 보세요.";
  const ownedTeamIds = teams.filter((team) => team.owner_id === session.userId).map((team) => team.id).filter(Boolean);
  const inboxByTeam = await listMessagesByTeamIds(ownedTeamIds);

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Camp</span>
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </section>

      <section className="card filter-card">
        <div className="filter-links">
          <Link className={`pill ${status === "all" && owner === "all" ? "is-active" : ""}`} href={buildCampHref({ hackathonSlug })}>
            전체
          </Link>
          <Link className={`pill ${status === "open" ? "is-active" : ""}`} href={buildCampHref({ hackathonSlug, status: "open", owner: "all" })}>
            모집중 글
          </Link>
          <Link className={`pill ${status === "closed" ? "is-active" : ""}`} href={buildCampHref({ hackathonSlug, status: "closed", owner: "all" })}>
            모집 마감 글
          </Link>
          <Link className={`pill ${owner === "me" ? "is-active" : ""}`} href={buildCampHref({ hackathonSlug, owner: "me" })}>
            내 그룹
          </Link>
        </div>
      </section>

      <section className="camp-board-actions">
        <Link className="button button--ghost" href={buildCampHref({ hackathonSlug, owner: "me" })}>
          내 그룹 보기
        </Link>
        <Link className="button" href={buildCampHref({ hackathonSlug, status, owner }) + `${buildCampHref({ hackathonSlug, status, owner }).includes("?") ? "&" : "?"}mode=create#create`}>
          팀 만들기
        </Link>
      </section>

      <section className="grid-layout grid-layout--camp">
        <CampCreatePanel
          defaultHackathonSlug={hackathonSlug}
          hackathonOptions={portal.hackathons}
          initialOpen={mode === "create"}
          sectionId="create"
        />

        {teams.length || mode !== "create" ? (
          <section className="stack-list">
            {teams.length ? (
              teams.map((team) => {
                const isOwner = team.owner_id === session.userId;
                const soloEntry = isSoloEntry(team);
                const statusClassName = `status-badge ${soloEntry ? "status-badge--ended" : team.is_open ? "status-badge--ongoing" : "status-badge--ended"}`;
                const statusLabel = soloEntry ? "개인 참가" : team.is_open ? "모집" : "마감";
                const ownerTypeLabel = soloEntry ? "개인 그룹" : "팀 그룹";
                const ownerSummaryLabel = soloEntry ? "진행 방식" : "모집 인원";

                return (
                  <article className="card team-card" key={team.id}>
                    <div className="team-card__head">
                      <div>
                        <span className="eyebrow">{getParticipationEyebrow(team)}</span>
                        <h2>{team.name}</h2>
                        <p className="team-card__subtitle">{getHackathonTitle(portal, team.hackathon_slug)}</p>
                      </div>
                      <div className="team-card__head-actions">
                        {isOwner ? (
                          <TeamEditForm
                            hackathonOptions={portal.hackathons}
                            statusClassName={statusClassName}
                            statusLabel={statusLabel}
                            team={team}
                            triggerClassName="button team-card__edit-button"
                            triggerLabel={soloEntry ? "팀원 모집" : "보드 설정"}
                          />
                        ) : (
                          <span className={statusClassName}>{statusLabel}</span>
                        )}
                      </div>
                    </div>
                    <p>{team.intro}</p>
                    <div className="team-card__summary-grid">
                      <div className="meta-chip">
                        <span>{ownerSummaryLabel}</span>
                        <strong>{soloEntry ? "개인" : getMemberProgress(team)}</strong>
                      </div>
                      <div className="meta-chip">
                        <span>작성자</span>
                        <strong>{team.owner_public_name ?? team.owner_name ?? "공개 팀"}</strong>
                      </div>
                      <div className="meta-chip">
                        <span>모집 기간</span>
                        <strong>{getRecruitmentWindow(team)}</strong>
                      </div>
                      <div className="meta-chip">
                        <span>{getParticipationNeedLabel(team)}</span>
                        <strong>{(team.looking_for ?? team.lookingFor ?? []).join(", ") || "-"}</strong>
                      </div>
                      <div className="meta-chip">
                        <span>작성 시각</span>
                        <strong>{formatDateTime(team.created_at ?? team.createdAt)}</strong>
                      </div>
                      <div className="meta-chip">
                        <span>유형</span>
                        <strong>{owner === "me" ? ownerTypeLabel : getParticipationLabel(team)}</strong>
                      </div>
                      {team.contact_url ?? team.contact?.url ? (
                        <div className="meta-chip">
                          <span>외부 연락 링크</span>
                          <a className="text-link" href={team.contact_url ?? team.contact?.url} rel="noreferrer" target="_blank">
                            {team.contact_url ?? team.contact?.url}
                          </a>
                        </div>
                      ) : null}
                      {team.owner_public_contact_email ? (
                        <div className="meta-chip">
                          <span>공개 연락 이메일</span>
                          <a className="text-link" href={`mailto:${team.owner_public_contact_email}`}>
                            {team.owner_public_contact_email}
                          </a>
                        </div>
                      ) : null}
                    </div>
                    <div className="team-card__cta-row">
                      {isOwner ? (
                        <Link className="button" href={`/camp/board/${team.id}`}>
                          팀 보드 열기
                        </Link>
                      ) : null}
                      <Link className="button button--ghost" href={buildCampHref({ hackathonSlug: team.hackathon_slug, owner: isOwner ? "me" : "all" })}>
                        {isOwner ? "해당 모집 보드" : "해당 보드 보기"}
                      </Link>
                      {team.hackathon_slug ? (
                        <Link className="button button--ghost" href={`/hackathons/${team.hackathon_slug}`}>
                          해커톤 보기
                        </Link>
                      ) : null}
                    </div>
                    {isOwner ? (
                      <div className="stack-list stack-list--tight">
                        <p className="small-note">
                          {soloEntry
                            ? "팀원 모집을 시작하려면 `팀원 모집`에서 상태를 `모집중`으로 바꾸세요. 자세한 운영은 팀 보드에서 계속할 수 있습니다."
                            : "도착한 문의와 합류 신청을 미리 확인하고, 자세한 운영은 팀 보드에서 계속할 수 있습니다."}
                        </p>
                        <div className="stack-list stack-list--messages">
                          {(inboxByTeam[team.id] ?? []).length ? (
                            (inboxByTeam[team.id] ?? []).map((message) => (
                              <article className="message-card" key={message.id}>
                                <strong>{message.visitor_name}</strong>
                                <p>{message.body}</p>
                              </article>
                            ))
                          ) : (
                            <p className="small-note">아직 이 그룹에 도착한 문의가 없습니다.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <MessageForm teamId={team.id} turnstileSiteKey={turnstileSiteKey} />
                    )}
                  </article>
                );
              })
            ) : (
              <article className="card empty-card">
                <h2>{emptyTitle}</h2>
                <p>{emptyDescription}</p>
              </article>
            )}
          </section>
        ) : null}
      </section>
    </>
  );
}

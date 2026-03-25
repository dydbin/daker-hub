import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { TeamEditForm } from "@/components/InteractiveForms";
import { formatDateTime } from "@/lib/format";
import { getParticipationNeedLabel, isSoloEntry } from "@/lib/participation";
import { loadPortalData } from "@/lib/portal-data";
import { listMessagesByTeamIds } from "@/lib/store";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

function getRecruitmentWindow(team) {
  const deadline = team.recruitment_deadline_at ?? team.recruitmentDeadlineAt ?? null;
  if (!deadline) return "상시 모집";
  return `~ ${formatDateTime(deadline)}`;
}

function getHackathonTitle(portal, slug) {
  if (!slug) return "연결된 해커톤 없음";
  return portal.hackathons.find((item) => item.slug === slug)?.title ?? slug;
}

function getMemberProgress(team) {
  const currentCount = Number(team.member_count ?? team.memberCount ?? 1) || 1;
  const targetCount = Number(team.target_member_count ?? team.targetMemberCount ?? 4) || 4;
  return `${currentCount}/${targetCount}명`;
}

export default async function CampTeamBoardPage({ params, searchParams }) {
  const routeParams = await params;
  const query = await searchParams;
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);

  if (!session.isAuthenticated) {
    return (
      <>
        <section className="page-head">
          <span className="eyebrow">Camp</span>
          <h1>팀 보드</h1>
          <p>내 팀 보드는 로그인 후 사용할 수 있습니다.</p>
        </section>

        <section className="card empty-card auth-entry-card">
          <h2>로그인이 필요합니다.</h2>
          <p>팀 보드에서는 내가 만든 그룹의 상태를 조정하고, 도착한 문의와 합류 신청을 확인할 수 있습니다.</p>
          <div className="button-row auth-entry-card__actions">
            <Link className="button" href={`/login?returnTo=/camp/board/${routeParams.teamId}`}>
              로그인
            </Link>
            <Link className="button button--ghost" href={`/signup?returnTo=/camp/board/${routeParams.teamId}`}>
              회원가입
            </Link>
          </div>
        </section>
      </>
    );
  }

  const portal = await loadPortalData(session.userId);
  const team = portal.sharedTeams.find((item) => item.id === routeParams.teamId) ?? null;

  if (!team || team.owner_id !== session.userId) {
    notFound();
  }

  const messagesByTeam = await listMessagesByTeamIds([team.id]);
  const inbox = messagesByTeam[team.id] ?? [];
  const soloEntry = isSoloEntry(team);
  const statusLabel = soloEntry ? "개인 그룹" : team.is_open ? "모집중 팀" : "모집 마감 팀";
  const statusClassName = `status-badge ${soloEntry ? "status-badge--ended" : team.is_open ? "status-badge--ongoing" : "status-badge--ended"}`;
  const openEditor = query.edit === "1";

  return (
    <>
      <section className="page-head">
        <span className="eyebrow">Camp</span>
        <h1>{team.name} 팀 보드</h1>
        <p>이 그룹의 모집 상태, 해커톤 연결, 외부 연락 링크, 그리고 도착한 문의 흐름을 한 곳에서 관리합니다.</p>
      </section>

      <section className="camp-board-actions">
        <Link className="button button--ghost" href={team.hackathon_slug ? `/camp?hackathon=${team.hackathon_slug}&owner=me` : "/camp?owner=me"}>
          내 그룹 목록
        </Link>
        {team.hackathon_slug ? (
          <Link className="button button--ghost" href={`/camp?hackathon=${team.hackathon_slug}`}>
            해당 해커톤 모집 보드
          </Link>
        ) : (
          <Link className="button button--ghost" href="/camp">
            전체 모집 보드
          </Link>
        )}
        {team.hackathon_slug ? (
          <Link className="button button--ghost" href={`/hackathons/${team.hackathon_slug}`}>
            해커톤 상세
          </Link>
        ) : null}
      </section>

      <section className="grid-layout grid-layout--camp">
        <section className="stack-list">
          <article className="card team-card">
            <div className="team-card__head">
              <div>
                <span className="eyebrow">Workspace</span>
                <h2>{team.name}</h2>
                <p className="team-card__subtitle">{getHackathonTitle(portal, team.hackathon_slug)}</p>
              </div>
              <div className="team-card__head-actions">
                <TeamEditForm
                  hackathonOptions={portal.hackathons}
                  initialOpen={openEditor}
                  statusClassName={statusClassName}
                  statusLabel={statusLabel}
                  team={team}
                  triggerClassName="button team-card__edit-button"
                  triggerLabel={soloEntry ? "팀원 모집" : "보드 설정"}
                />
              </div>
            </div>
            <p>{team.intro}</p>
            <div className="team-card__summary-grid">
              <div className="meta-chip">
                <span>현재 상태</span>
                <strong>{statusLabel}</strong>
              </div>
              <div className="meta-chip">
                <span>모집 인원</span>
                <strong>{soloEntry ? "개인 시작" : getMemberProgress(team)}</strong>
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
                <span>공개 이름</span>
                <strong>{team.owner_public_name ?? team.owner_name ?? "공개 팀"}</strong>
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
            <p className="small-note">
              {soloEntry
                ? "지금은 개인 그룹 상태입니다. `팀원 모집`에서 상태를 `모집중`으로 바꾸면 해당 해커톤 모집 보드에 공개 팀으로 노출됩니다."
                : "이 팀 보드에서 모집 상태와 링크를 조정하고, 도착한 문의와 합류 신청을 확인할 수 있습니다."}
            </p>
          </article>
        </section>

        <section className="stack-list">
          <article className="card">
            <div className="section-head">
              <span className="eyebrow">Inbox</span>
              <h2>문의 / 합류 신청</h2>
              <p>공개 모집 보드에서 이 그룹으로 들어온 메시지를 시간순으로 확인합니다.</p>
            </div>
            <div className="stack-list stack-list--messages">
              {inbox.length ? (
                inbox.map((message) => (
                  <article className="message-card" key={message.id}>
                    <strong>{message.visitor_name}</strong>
                    <p>{message.body}</p>
                  </article>
                ))
              ) : (
                <p className="small-note">아직 이 팀 보드에 도착한 문의나 합류 신청이 없습니다.</p>
              )}
            </div>
          </article>
        </section>
      </section>
    </>
  );
}

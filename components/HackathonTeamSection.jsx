"use client";

import Link from "next/link";
import { useState } from "react";

import { JoinTeamButton, MessageForm, SoloApplyButton } from "@/components/InteractiveForms";
import { formatDateTime } from "@/lib/format";
import { getParticipationNeedLabel, isJoinableTeam, isSharedEntry, isSoloEntry } from "@/lib/participation";
import { isUuid } from "@/lib/uuid";

function sortTeams(left, right) {
  if (Boolean(left.is_open) !== Boolean(right.is_open)) {
    return left.is_open ? -1 : 1;
  }

  return new Date(right.created_at ?? 0).getTime() - new Date(left.created_at ?? 0).getTime();
}

function getMemberProgress(team) {
  const currentCount = Number(team.member_count ?? team.memberCount ?? 1) || 1;
  const targetCount = Number(team.target_member_count ?? team.targetMemberCount ?? 4) || 4;
  return `${currentCount}/${targetCount}명`;
}

function getRecruitmentWindow(team) {
  const deadline = team.recruitment_deadline_at ?? team.recruitmentDeadlineAt ?? null;
  if (!deadline) return "상시 모집";
  return `~ ${formatDateTime(deadline)}`;
}

export function HackathonTeamSection({
  allowSolo,
  hackathonSlug,
  myParticipation,
  teams,
  visitorId,
  turnstileSiteKey = ""
}) {
  const [showTeams, setShowTeams] = useState(false);
  const hasMyParticipation = Boolean(myParticipation);
  const myParticipationIsSolo = isSoloEntry(myParticipation);
  const myBoardHref = myParticipation?.id
    ? `/camp/board/${myParticipation.id}${myParticipationIsSolo ? "?edit=1" : ""}`
    : `/camp?hackathon=${hackathonSlug}&owner=me`;

  const teamPosts = teams
    .filter((team) => isSharedEntry(team) && !isSoloEntry(team))
    .sort(sortTeams);

  return (
    <div className="stack-list">
      <article className="detail-subpanel team-entry-panel">
        <div className="team-entry-panel__head">
          <div>
            <span className="eyebrow">Next Step</span>
            <h3>다음 단계: 팀 구성하기</h3>
            <p>이 해커톤 안에서 새 팀을 만들거나, 내 그룹을 팀 모집으로 전환하거나, 이미 모집 중인 팀에 합류하세요.</p>
          </div>
          <div className="button-row">
            <Link className="button button--ghost" href={hasMyParticipation ? myBoardHref : `/camp?hackathon=${hackathonSlug}&mode=create#create`}>
              {hasMyParticipation ? (myParticipationIsSolo ? "팀원 모집" : "내 팀 보드") : "팀 만들기"}
            </Link>
            <button className="button" onClick={() => setShowTeams((current) => !current)} type="button">
              {showTeams ? "팀 목록 닫기" : "팀 찾기"}
            </button>
          </div>
        </div>
        <div className="team-entry-panel__notes">
          <div className="meta-chip">
            <span>팀 만들기</span>
            <strong>해당 해커톤 보드에 새 팀 모집글 작성</strong>
          </div>
          <div className="meta-chip">
            <span>내 팀 보드</span>
            <strong>개인으로 시작했다면 팀원 모집으로 전환</strong>
          </div>
        </div>
      </article>

      {allowSolo ? (
        <article className="detail-subpanel team-entry-panel">
          <div className="section-head">
            <span className="eyebrow">Solo</span>
            <h3>개인 참가하기</h3>
            <p>팀이 없어도 먼저 개인 그룹으로 시작할 수 있고, 필요하면 나중에 팀 그룹으로 전환할 수 있습니다.</p>
          </div>
          {hasMyParticipation ? (
            <div className="stack-list stack-list--tight">
              <p className="inline-message">이미 개인 그룹이 생성되어 있습니다. 혼자 진행하거나 팀 보드에서 바로 팀원 모집으로 전환할 수 있습니다.</p>
              <div className="button-row">
                <Link className="button button--ghost" href={myBoardHref}>
                  {myParticipationIsSolo ? "팀원 모집" : "내 팀 보드"}
                </Link>
              </div>
            </div>
          ) : (
            <SoloApplyButton hackathonSlug={hackathonSlug} />
          )}
        </article>
      ) : null}

      {showTeams ? (
        teamPosts.length ? (
          <div className="stack-list">
            {teamPosts.map((team) => {
              const teamId = team.id ?? "";
              const joinableTeam = isUuid(teamId) && isJoinableTeam(team) && team.owner_id !== visitorId;

              return (
                <article className="card nested-card" key={team.id}>
                  <div className="team-card__head">
                    <div>
                      <span className="eyebrow">{team.is_open ? "모집중 팀" : "마감된 팀"}</span>
                      <h3>{team.name}</h3>
                    </div>
                    <span className={`status-badge ${team.is_open ? "status-badge--ongoing" : "status-badge--ended"}`}>
                      {team.is_open ? "모집" : "마감"}
                    </span>
                  </div>
                  <p>{team.intro}</p>
                  <div className="meta-grid">
                    <div className="meta-chip">
                      <span>팀장</span>
                      <strong>{team.owner_public_name ?? team.owner_name ?? "공개 팀"}</strong>
                    </div>
                    <div className="meta-chip">
                      <span>모집 인원</span>
                      <strong>{getMemberProgress(team)}</strong>
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
                    {team.owner_public_contact_email ? (
                      <div className="meta-chip">
                        <span>공개 연락 이메일</span>
                        <a className="text-link" href={`mailto:${team.owner_public_contact_email}`}>
                          {team.owner_public_contact_email}
                        </a>
                      </div>
                    ) : null}
                    {team.contact_url ?? team.contact?.url ? (
                      <div className="meta-chip">
                        <span>외부 연락 링크</span>
                        <a className="text-link" href={team.contact_url ?? team.contact?.url} rel="noreferrer" target="_blank">
                          {team.contact_url ?? team.contact?.url}
                        </a>
                      </div>
                    ) : null}
                  </div>
                  <div className="button-row">
                    {joinableTeam ? <JoinTeamButton teamId={teamId} /> : null}
                    {team.owner_id === visitorId ? <p className="inline-message">내가 만든 팀 글입니다.</p> : null}
                  </div>
                  {team.owner_id !== visitorId ? <MessageForm teamId={teamId} turnstileSiteKey={turnstileSiteKey} /> : null}
                </article>
              );
            })}
          </div>
        ) : (
          <article className="empty-card">
            <h3>지금 바로 찾을 수 있는 팀이 없습니다.</h3>
            <p>아직 공개된 팀 찾기 글이 없으면 이 해커톤 보드에서 첫 팀 모집글을 만들 수 있습니다.</p>
          </article>
        )
      ) : null}
    </div>
  );
}

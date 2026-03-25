import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { DetailSidebar } from "@/components/DetailSidebar";
import { FavoriteButton } from "@/components/FavoriteButton";
import { SubmissionForm } from "@/components/InteractiveForms";
import { HackathonTeamSection } from "@/components/HackathonTeamSection";
import { formatDateTime, formatMoney, statusLabel } from "@/lib/format";
import { buildJudgePreviewReport, extractJudgePreviewDraft } from "@/lib/judge-preview";
import { loadHackathonPageData } from "@/lib/portal-data";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

const STRUCTURED_OVERVIEWS = {
  "daker-handover-2026-03": {
    intro: [
      "웹페이지 형태의 서비스를 개발해야 합니다.",
      "하지만, 기능은 아직 미완성이고 초보 개발자는 어디서부터 구현해야 할지 막막한 상황입니다.",
      "이번 해커톤에서는 바이브 코딩을 활용해 제공된 자료를 기반으로 웹페이지를 완성하고 팀만의 아이디어로 확장해 더 좋은 서비스 경험을 제안해 주세요."
    ],
    goals: [
      "제공된 자료를 기반으로 웹페이지를 완성",
      "자료를 바탕으로 팀의 아이디어로 확장 기능/UX 개선을 목표로 함"
    ],
    tech: [
      "개발 도구: 기술 제한 없이 바이브 코딩 툴을 활용하여 개발",
      "배포: Vercel 배포 필수"
    ]
  }
};

function findMilestone(detail, keyword) {
  return (detail?.sections?.schedule?.milestones ?? []).find((item) => item.name.includes(keyword))?.at ?? null;
}

function getStructuredOverview(hackathon) {
  return (
    STRUCTURED_OVERVIEWS[hackathon.slug] ?? {
      intro: [hackathon.detail?.sections?.overview?.summary ?? "대회 소개 정보가 아직 없습니다."],
      goals: ["제공된 자료 기준으로 핵심 기능을 완성합니다."],
      tech: ["배포 및 개발 환경 정보는 공지 링크를 함께 확인하세요."]
    }
  );
}

function isPublicReferenceLink(value) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname !== "example.com";
  } catch {
    return false;
  }
}

function getStageStatus(startAt, endAt) {
  const now = Date.now();
  const start = startAt ? new Date(startAt).getTime() : null;
  const end = endAt ? new Date(endAt).getTime() : null;

  if (start != null && now < start) return "upcoming";
  if (end != null && now > end) return "ended";
  return "ongoing";
}

function getStageStatusLabel(status) {
  switch (status) {
    case "upcoming":
      return "예정";
    case "ended":
      return "완료";
    default:
      return "진행중";
  }
}

function getMilestoneMap(detail) {
  return Object.fromEntries((detail?.sections?.schedule?.milestones ?? []).map((item) => [item.name, item.at]));
}

function buildScheduleStages(hackathon) {
  const milestones = hackathon.detail?.sections?.schedule?.milestones ?? [];
  if (!milestones.length) return [];

  if (hackathon.slug === "daker-handover-2026-03") {
    const milestoneMap = getMilestoneMap(hackathon.detail);
    const planStart = milestoneMap["접수/기획서 제출 기간"] ?? null;
    const planDeadline = milestoneMap["접수/기획서 제출 마감"] ?? null;
    const webDeadline = milestoneMap["최종 웹링크 제출 마감"] ?? null;
    const pdfDeadline = milestoneMap["최종 솔루션 PDF 제출 마감"] ?? null;
    const voteStart = milestoneMap["1차 투표평가 시작"] ?? null;
    const voteEnd = milestoneMap["1차 투표평가 마감"] ?? null;
    const finalEvalEnd = milestoneMap["2차 내부평가 종료"] ?? null;
    const resultAt = milestoneMap["최종 결과 발표"] ?? null;

    return [
      {
        title: "접수",
        category: "기타",
        startAt: planStart,
        endAt: planDeadline,
        highlight: "접수 및 참가 등록",
        note: "참가 등록과 초기 준비를 시작하는 단계입니다."
      },
      {
        title: "기획서 제출",
        category: "제출",
        startAt: planStart,
        endAt: planDeadline,
        highlight: `제출 마감 ${formatDateTime(planDeadline)}`,
        note: "기획서 1차 제출을 마쳐야 다음 제출 단계로 넘어갈 수 있습니다."
      },
      {
        title: "최종 웹링크 제출",
        category: "제출",
        startAt: planDeadline,
        endAt: webDeadline,
        highlight: `웹링크 마감 ${formatDateTime(webDeadline)}`,
        note: "배포 URL은 외부 접속 가능 상태여야 합니다."
      },
      {
        title: "최종 솔루션 PDF 제출",
        category: "제출",
        startAt: webDeadline,
        endAt: pdfDeadline,
        highlight: `PDF 마감 ${formatDateTime(pdfDeadline)}`,
        note: "발표 자료는 PDF로 변환해 제출합니다."
      },
      {
        title: "1차 투표평가",
        category: "평가",
        startAt: voteStart,
        endAt: voteEnd,
        highlight: `투표 마감 ${formatDateTime(voteEnd)}`,
        note: "참가팀 30%, 심사위원 70% 가중치로 1차 평가가 진행됩니다."
      },
      {
        title: "2차 내부평가",
        category: "평가",
        startAt: voteEnd,
        endAt: finalEvalEnd,
        highlight: `내부평가 종료 ${formatDateTime(finalEvalEnd)}`,
        note: "1차 상위 팀을 대상으로 내부 심사위원 정성평가가 이어집니다."
      },
      {
        title: "최종 결과 발표",
        category: "결과",
        startAt: resultAt,
        endAt: resultAt,
        highlight: `결과 발표 ${formatDateTime(resultAt)}`,
        note: "최종 순위와 결과 발표가 공개됩니다."
      }
    ].filter((item) => item.startAt || item.endAt);
  }

  return milestones
    .slice()
    .sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime())
    .map((item, index, list) => ({
      title: item.name,
      category: item.name.includes("제출") ? "제출" : item.name.includes("평가") || item.name.includes("투표") ? "평가" : "기타",
      startAt: item.at,
      endAt: list[index + 1]?.at ?? item.at,
      highlight: `기준 시각 ${formatDateTime(item.at)}`,
      note: "원본 마일스톤 기준으로 표시합니다."
    }));
}

function formatStageRange(stage) {
  if (stage.startAt && stage.endAt && stage.startAt !== stage.endAt) {
    return `${formatDateTime(stage.startAt)} - ${formatDateTime(stage.endAt)}`;
  }
  return formatDateTime(stage.endAt ?? stage.startAt);
}

function buildLinkedSubmissionTeam(team) {
  if (!team?.id) return null;

  const memberCount = Number(team.member_count ?? team.memberCount ?? 1);
  const targetCount = Number(team.target_member_count ?? team.targetMemberCount ?? 4) || 4;
  const isSolo = memberCount === 0;
  const progressLabel = isSolo ? "개인 그룹" : `${memberCount} / ${targetCount}명`;

  return {
    label: `${team.name} · ${progressLabel}`,
    href: `/camp/board/${team.id}${isSolo ? "?edit=1" : ""}`,
    ctaLabel: isSolo ? "팀원 모집" : "내 팀 보드"
  };
}

export default async function HackathonDetailPage({ params }) {
  const routeParams = await params;
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY ?? "";
  const pageData = await loadHackathonPageData(session.userId, routeParams.slug);

  if (!pageData) notFound();

  const { hackathon, teams, submissions, favoriteSlugs } = pageData;
  const detail = hackathon.detail;
  const sections = detail?.sections ?? {};
  const allowSolo = sections.overview?.teamPolicy?.allowSolo !== false;
  const structuredOverview = getStructuredOverview(hackathon);
  const myParticipation = teams.find((team) => team.owner_id === session.userId) ?? null;
  const linkedSubmissionTeam = buildLinkedSubmissionTeam(myParticipation);
  const scheduleStages = buildScheduleStages(hackathon);
  const sidebarGroups = [
    {
      id: "guide",
      label: "대회안내",
      defaultOpen: true,
      items: [
        { id: "overview", label: "개요" },
        { id: "eval", label: "평가" },
        { id: "schedule", label: "일정" },
        { id: "prize", label: "상금" },
        { id: "teams", label: "팀/개인" }
      ]
    },
    {
      id: "submit-group",
      label: "제출",
      badge: sections.submit?.submissionItems?.length ?? null,
      defaultOpen: false,
      items: [{ id: "submit", label: "제출" }]
    },
    {
      id: "leaderboard-group",
      label: "리더보드",
      badge: hackathon.leaderboard?.entries?.length ?? null,
      defaultOpen: false,
      items: [{ id: "leaderboard", label: "리더보드" }]
    }
  ];
  const submissionMilestones = {
    plan: findMilestone(detail, "기획"),
    web: findMilestone(detail, "웹"),
    pdf: findMilestone(detail, "PDF"),
    vote: findMilestone(detail, "투표")
  };
  const mySubmissionRows = submissions
    .filter((entry) => entry.visitor_id === session.userId)
    .map((entry) => ({
      ...entry,
      previewScore: buildJudgePreviewReport(entry, hackathon).total
    }));
  const mySubmissionDrafts = mySubmissionRows.map((entry) => {
    const draft = extractJudgePreviewDraft(entry);

    return {
      id: entry.id,
      label: `${entry.project_title} · ${formatDateTime(entry.created_at)}`,
      ...draft
    };
  });
  const externalReferenceLinks = [
    isPublicReferenceLink(sections.info?.links?.rules)
      ? { href: sections.info.links.rules, label: "Rules" }
      : null,
    isPublicReferenceLink(sections.info?.links?.faq)
      ? { href: sections.info.links.faq, label: "FAQ" }
      : null
  ].filter(Boolean);

  return (
    <section className="detail-layout">
      <DetailSidebar groups={sidebarGroups} />

      <div className="detail-main">
        <section className="detail-hero card">
          <div className="detail-hero__main">
            <span className="eyebrow">Hackathon Detail</span>
            <h1>{hackathon.title}</h1>
            <div className="tag-row">
              <span className="tag">{statusLabel(hackathon.status)}</span>
              {(hackathon.tags ?? []).map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="detail-action-grid">
              <Link className="button detail-action detail-action--primary" href="#submit">
                제출 패키지 작성
              </Link>
              <FavoriteButton hackathonSlug={hackathon.slug} active={favoriteSlugs.has(hackathon.slug)} variant="soft" />
              <Link className="button button--ghost detail-action" href="#teams">
                대회 신청
              </Link>
              <Link className="button button--ghost detail-action" href={`/camp?hackathon=${hackathon.slug}`}>
                참가 글 보기
              </Link>
              <Link className="button button--ghost detail-action" href="#leaderboard">
                리더보드로
              </Link>
            </div>
          </div>
          <div className="detail-hero__side">
            <div className="fact-row">
              <span>상태</span>
              <strong>{statusLabel(hackathon.status)}</strong>
            </div>
            <div className="fact-row">
              <span>기획서 마감</span>
              <strong>{formatDateTime(submissionMilestones.plan)}</strong>
            </div>
            <div className="fact-row">
              <span>웹링크 마감</span>
              <strong>{formatDateTime(submissionMilestones.web)}</strong>
            </div>
            <div className="fact-row">
              <span>PDF 마감 / 투표 시작</span>
              <strong>
                {formatDateTime(submissionMilestones.pdf)} / {formatDateTime(submissionMilestones.vote)}
              </strong>
            </div>
            <div className="fact-row">
              <span>팀 수</span>
              <strong>{teams.length}개</strong>
            </div>
            <div className="fact-row">
              <span>내 저장본 수</span>
              <strong>{session.isAuthenticated ? `${mySubmissionRows.length}개` : "로그인 후 확인"}</strong>
            </div>
          </div>
        </section>

        <section className="card detail-section-card" id="overview">
          <div className="section-head">
            <span className="eyebrow">Overview</span>
            <h2>개요</h2>
            <p>대회소개, 목표, 기술·환경을 문서형 섹션으로 정리해 읽히도록 구성합니다.</p>
          </div>
          <div className="overview-doc">
            <section className="overview-doc__block">
              <div className="overview-doc__heading">
                <span>대회 개요</span>
                <h3>대회소개</h3>
              </div>
              <ul className="plain-list plain-list--spacious">
                {structuredOverview.intro.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="overview-doc__block">
              <div className="overview-doc__heading">
                <span>목표</span>
                <h3>이번 라운드에서 보여줘야 하는 것</h3>
              </div>
              <ul className="plain-list plain-list--spacious">
                {structuredOverview.goals.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="overview-doc__block">
              <div className="overview-doc__heading">
                <span>기술 / 환경</span>
                <h3>개발과 배포 조건</h3>
              </div>
              <ul className="plain-list plain-list--spacious">
                {structuredOverview.tech.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="overview-doc__meta">
                <div className="fact-row">
                  <span>개인 참가</span>
                  <strong>{sections.overview?.teamPolicy?.allowSolo ? "가능" : "불가"}</strong>
                </div>
                <div className="fact-row">
                  <span>최대 팀 인원</span>
                  <strong>{sections.overview?.teamPolicy?.maxTeamSize ?? "-"}명</strong>
                </div>
              </div>
              {externalReferenceLinks.length ? (
                <div className="button-row">
                  {externalReferenceLinks.map((item) => (
                    <a className="button button--ghost" href={item.href} key={item.label} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </section>
          </div>
        </section>

        <section className="card detail-section-card" id="eval">
          <div className="section-head">
            <span className="eyebrow">Evaluation Criteria</span>
            <h2>평가 기준</h2>
            <p>평가 구조와 메트릭, 제출 제한을 한 번에 확인합니다.</p>
          </div>
          <div className="detail-subgrid">
            <section className="detail-subpanel">
              <h3>핵심 메트릭</h3>
              <div className="fact-stack">
                <div className="fact-row">
                  <span>지표</span>
                  <strong>{sections.eval?.metricName ?? "-"}</strong>
                </div>
                <div className="fact-row">
                  <span>최대 실행 시간</span>
                  <strong>{sections.eval?.limits?.maxRuntimeSec ?? "-"}초</strong>
                </div>
                <div className="fact-row">
                  <span>일일 제출 제한</span>
                  <strong>{sections.eval?.limits?.maxSubmissionsPerDay ?? "-"}회</strong>
                </div>
              </div>
            </section>
            <section className="detail-subpanel">
              <h3>설명</h3>
              <p>{sections.eval?.description ?? "평가 설명이 아직 없습니다."}</p>
            </section>
          </div>
        </section>

        <section className="card detail-section-card" id="schedule">
          <div className="section-head">
            <span className="eyebrow">Schedule</span>
            <h2>일정</h2>
            <p>단계별 진행 상태와 제출 마감 시점을 한눈에 확인할 수 있도록 정리했습니다.</p>
          </div>
          <div className="schedule-stage-list">
            {scheduleStages.map((stage, index) => {
              const stageStatus = getStageStatus(stage.startAt, stage.endAt);
              return (
                <article className={`schedule-stage-card schedule-stage-card--${stageStatus}`} key={`${stage.title}-${stage.startAt}-${stage.endAt}`}>
                  <div className={`schedule-stage-card__index schedule-stage-card__index--${stageStatus}`}>{index + 1}</div>
                  <div className="schedule-stage-card__body">
                    <div className="schedule-stage-card__head">
                      <div className="schedule-stage-card__title">
                        <strong>{stage.title}</strong>
                        <div className="tag-row">
                          <span className={`status-badge status-badge--${stageStatus}`}>{getStageStatusLabel(stageStatus)}</span>
                          <span className="tag">{stage.category}</span>
                        </div>
                      </div>
                      <strong className="schedule-stage-card__range">{formatStageRange(stage)}</strong>
                    </div>
                    <p className="schedule-stage-card__highlight">{stage.highlight}</p>
                    <p>{stage.note}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="card detail-section-card" id="prize">
          <div className="section-head">
            <span className="eyebrow">Prize</span>
            <h2>상금</h2>
          </div>
          <div className="meta-grid meta-grid--triple">
            {(sections.prize?.items ?? []).map((item) => (
              <div className="meta-chip" key={`${item.place}-${item.amountKRW}`}>
                <span>{item.place}</span>
                <strong>{formatMoney(item.amountKRW)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="card detail-section-card" id="teams">
          <div className="section-head">
            <span className="eyebrow">Teams</span>
            <h2>팀 / 개인</h2>
            <p>팀 만들기, 팀 찾기, 개인 참가하기를 여기서 바로 진행합니다.</p>
          </div>
          <HackathonTeamSection
            allowSolo={allowSolo}
            hackathonSlug={hackathon.slug}
            myParticipation={myParticipation}
            teams={teams}
            visitorId={session.userId}
            turnstileSiteKey={turnstileSiteKey}
          />
        </section>

        <section className="card detail-section-card" id="submit">
          <div className="section-head section-head--tight">
            <div>
              <span className="eyebrow">Submit</span>
              <h2>제출</h2>
              <p>기획서/웹링크/PDF 제출 전에 문서형 개요를 저장합니다.</p>
            </div>
            <div className="button-row button-row--end">
              <Link className="button button--ghost" href={`/hackathons/${hackathon.slug}/judge-preview`}>
                Judge Preview 테스트
              </Link>
            </div>
          </div>
          <SubmissionForm hackathonSlug={hackathon.slug} linkedTeam={linkedSubmissionTeam} savedSubmissions={mySubmissionDrafts} />
        </section>

        <section className="card detail-section-card leaderboard-card" id="leaderboard">
          <div className="leaderboard-card__head">
            <div>
              <h2>리더보드 (Leaderboard)</h2>
              <p>{hackathon.title}의 공개 순위와 내 저장본 상태를 한 카드에서 확인합니다.</p>
            </div>
            <div className="leaderboard-card__meta">
              <span className="tag">공개 순위 {(hackathon.leaderboard?.entries ?? []).length}팀</span>
              <span className="tag">{session.isAuthenticated ? `내 저장본 ${mySubmissionRows.length}개` : "로그인 후 저장본 확인"}</span>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>이름</th>
                  <th>점수/상태</th>
                  <th>최근 제출 날짜</th>
                </tr>
              </thead>
              <tbody>
                {(hackathon.leaderboard?.entries ?? []).map((entry) => (
                  <tr key={`${entry.teamName}-${entry.submittedAt}`}>
                    <td>공개</td>
                    <td>{entry.teamName}</td>
                    <td>{entry.score}</td>
                    <td>{formatDateTime(entry.submittedAt)}</td>
                  </tr>
                ))}
                {mySubmissionRows.map((entry) => (
                  <tr key={entry.id}>
                    <td>내 저장본</td>
                    <td>
                      <strong>{entry.project_title}</strong>
                      <div className="small-note">참여: {entry.team_participants}</div>
                    </td>
                    <td>{`예상 ${entry.previewScore.toFixed(1)}점`}</td>
                    <td>{formatDateTime(entry.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}

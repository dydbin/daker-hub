import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { formatDateTime, statusLabel } from "@/lib/format";
import { buildJudgePreviewReport } from "@/lib/judge-preview";
import { loadHackathonPageData } from "@/lib/portal-data";
import { getViewerSession } from "@/lib/visitor";

export const dynamic = "force-dynamic";

export default async function JudgePreviewPage({ params }) {
  const routeParams = await params;
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  const pageData = await loadHackathonPageData(session.userId, routeParams.slug);

  if (!pageData) notFound();

  const { hackathon, submissions } = pageData;
  const myLatestSubmission = submissions.find((item) => item.visitor_id === session.userId) ?? null;

  if (!myLatestSubmission) {
    return (
      <section className="judge-preview-layout">
        <section className="card empty-card">
          <span className="eyebrow">Judge Preview</span>
          <h1>{session.isAuthenticated ? "아직 분석할 저장본이 없습니다." : "로그인 후 저장본 분석을 사용할 수 있습니다."}</h1>
          <p>
            {session.isAuthenticated
              ? "먼저 제출 섹션에서 프로젝트 개요를 저장하면, 그 최신 저장본을 기준으로 예상 점수를 계산합니다."
              : "Judge Preview는 내 제출 저장본을 기준으로 동작하므로, 먼저 로그인한 뒤 제출 섹션에서 저장해 주세요."}
          </p>
          <div className="button-row button-row--end">
            <Link className="button" href={`/hackathons/${hackathon.slug}#submit`}>
              제출 섹션으로 돌아가기
            </Link>
            <Link className="button button--ghost" href={`/hackathons/${hackathon.slug}`}>
              상세로 돌아가기
            </Link>
          </div>
        </section>
      </section>
    );
  }

  const report = buildJudgePreviewReport(myLatestSubmission, hackathon);

  return (
    <section className="judge-preview-layout">
      <section className="card judge-preview-hero">
        <div className="section-head">
          <span className="eyebrow">Judge Preview</span>
          <h1>{hackathon.title} 예상 점수 테스트</h1>
          <p>최근 저장한 제출 개요를 기준으로 내부 심사 항목별 예상 점수와 보완 포인트를 보여줍니다.</p>
        </div>
        <p className="small-note">{report.judgeModelNote}</p>
        <div className="judge-preview-hero__meta">
          <div className="fact-row">
            <span>해커톤 상태</span>
            <strong>{statusLabel(hackathon.status)}</strong>
          </div>
          <div className="fact-row">
            <span>최근 저장본</span>
            <strong>{formatDateTime(myLatestSubmission.created_at)}</strong>
          </div>
          <div className="fact-row">
            <span>프로젝트</span>
            <strong>{myLatestSubmission.project_title}</strong>
          </div>
          <div className="fact-row">
            <span>팀/참여자</span>
            <strong>{myLatestSubmission.team_participants}</strong>
          </div>
        </div>
        <div className="button-row button-row--end">
          <Link className="button" href={`/hackathons/${hackathon.slug}#submit`}>
            제출 수정하기
          </Link>
          <Link className="button button--ghost" href={`/hackathons/${hackathon.slug}`}>
            상세로 돌아가기
          </Link>
        </div>
      </section>

      <section className="judge-preview-summary-grid">
        <article className="card judge-preview-score-card">
          <span className="eyebrow">Total Score</span>
          <strong className="judge-preview-score-card__value">{report.total}점</strong>
          <p>기본 구현 30, 확장 30, 완성도 25, 문서/설명 15 배점을 기준으로 추정했습니다.</p>
        </article>
        <article className="card judge-preview-score-card">
          <span className="eyebrow">Readiness</span>
          <strong className="judge-preview-score-card__value">
            {report.meta.completedChecks}/{report.meta.totalChecks}
          </strong>
          <p>문서형 필수 입력과 구현 self-check를 합친 준비도입니다. 체크가 비어 있으면 해당 평가 항목 점수도 같이 빠집니다.</p>
        </article>
      </section>

      <section className="card detail-section-card">
        <div className="section-head">
          <span className="eyebrow">Category Scores</span>
          <h2>평가 항목별 예상 점수</h2>
        </div>
        <div className="judge-preview-category-grid">
          {report.categories.map((item) => (
            <article className="detail-subpanel" key={item.id}>
              <div className="judge-preview-category-head">
                <h3>{item.label}</h3>
                <strong>
                  {item.score} / {item.max}
                </strong>
              </div>
              <p>{item.reason}</p>
              <ul className="plain-list judge-preview-breakdown-list">
                {item.breakdown.map((detail) => (
                  <li key={`${item.id}-${detail.label}`}>
                    <strong>{detail.label}</strong> {detail.score}/{detail.max}
                    <div className="small-note">{detail.note}</div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="judge-preview-detail-grid">
        <article className="card detail-section-card">
          <div className="section-head">
            <span className="eyebrow">Quick Checks</span>
            <h2>빠른 체크</h2>
          </div>
          <div className="stack-list">
            {report.checks.map((item) => (
              <article className="list-row" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                </div>
                <span className={`status-badge ${item.ok ? "status-badge--ongoing" : "status-badge--ended"}`}>
                  {item.ok ? "OK" : "BAD"}
                </span>
              </article>
            ))}
          </div>
        </article>

        <article className="card detail-section-card">
          <div className="section-head">
            <span className="eyebrow">Strengths</span>
            <h2>강점</h2>
          </div>
          <ul className="plain-list plain-list--spacious">
            {report.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card detail-section-card">
          <div className="section-head">
            <span className="eyebrow">Improvements</span>
            <h2>보완 포인트</h2>
          </div>
          <ul className="plain-list plain-list--spacious">
            {report.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </section>
  );
}

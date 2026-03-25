import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SUBMISSION_INPUT_LIMITS, assertMaxLength, assertOptionalMaxLength } from "@/lib/content-limits";
import { buildRateLimitHeaders, consumeRateLimit } from "@/lib/request-protection";
import { packJudgePreviewMeta } from "@/lib/judge-preview";
import { createSubmission } from "@/lib/store";
import { getViewerSession } from "@/lib/visitor";

export const runtime = "nodejs";

const SUBMISSION_RATE_LIMIT = {
  limit: 8,
  windowMs: 1000 * 60 * 10
};

function toBoolean(value) {
  return value === true || value === "true";
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "제출 저장은 로그인 후 사용할 수 있습니다." }, { status: 401 });
  }

  const rateLimit = consumeRateLimit({
    request,
    bucket: "submissions-write",
    limit: SUBMISSION_RATE_LIMIT.limit,
    windowMs: SUBMISSION_RATE_LIMIT.windowMs,
    subject: session.userId
  });
  if (!rateLimit.ok) {
    return NextResponse.json({ error: "제출 저장 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429, headers: buildRateLimitHeaders(rateLimit) });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  if (!payload.hackathonSlug || !String(payload.projectTitle ?? "").trim() || !String(payload.teamParticipants ?? "").trim()) {
    return NextResponse.json({ error: "해커톤, 프로젝트 제목, 팀/참여자는 필수입니다." }, { status: 400 });
  }
  try {
    assertMaxLength("프로젝트 제목", payload.projectTitle, SUBMISSION_INPUT_LIMITS.projectTitle);
    assertMaxLength("팀/참여자", payload.teamParticipants, SUBMISSION_INPUT_LIMITS.teamParticipants);
    assertOptionalMaxLength("서비스 개요", payload.serviceOverview, SUBMISSION_INPUT_LIMITS.serviceOverview);
    assertOptionalMaxLength("페이지 구성", payload.pageComposition, SUBMISSION_INPUT_LIMITS.pageComposition);
    assertOptionalMaxLength("시스템 구성", payload.systemComposition, SUBMISSION_INPUT_LIMITS.systemComposition);
    assertOptionalMaxLength("핵심 기능 명세", payload.coreFunctionSpec, SUBMISSION_INPUT_LIMITS.coreFunctionSpec);
    assertOptionalMaxLength("유저 플로우", payload.userFlow, SUBMISSION_INPUT_LIMITS.userFlow);
    assertOptionalMaxLength("개발 및 개선 계획", payload.developmentPlan, SUBMISSION_INPUT_LIMITS.developmentPlan);
    assertOptionalMaxLength("팀 고유 확장 기능 / UX 개선", payload.extensionIdea, SUBMISSION_INPUT_LIMITS.extensionIdea);
    assertOptionalMaxLength("실행 / 검증 방법", payload.verificationPlan, SUBMISSION_INPUT_LIMITS.verificationPlan);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "입력값을 다시 확인해 주세요." }, { status: 400 });
  }

  try {
    const submission = await createSubmission({
      visitorId: session.userId,
      displayName: session.displayName,
      hackathonSlug: payload.hackathonSlug,
      projectTitle: String(payload.projectTitle).trim(),
      teamParticipants: String(payload.teamParticipants).trim(),
      serviceOverview: String(payload.serviceOverview ?? "").trim(),
      pageComposition: String(payload.pageComposition ?? "").trim(),
      systemComposition: String(payload.systemComposition ?? "").trim(),
      coreFunctionSpec: String(payload.coreFunctionSpec ?? "").trim(),
      userFlow: String(payload.userFlow ?? "").trim(),
      developmentPlan: packJudgePreviewMeta({
        developmentPlan: String(payload.developmentPlan ?? "").trim(),
        extensionIdea: String(payload.extensionIdea ?? "").trim(),
        verificationPlan: String(payload.verificationPlan ?? "").trim(),
        checklist: {
          dataDrivenRendering: toBoolean(payload.dataDrivenRendering),
          filterSortWorking: toBoolean(payload.filterSortWorking),
          emptyStateReady: toBoolean(payload.emptyStateReady),
          responsiveReady: toBoolean(payload.responsiveReady),
          errorHandlingReady: toBoolean(payload.errorHandlingReady),
          loadingReady: toBoolean(payload.loadingReady),
          accessibilityReady: toBoolean(payload.accessibilityReady),
          reviewerAccessReady: toBoolean(payload.reviewerAccessReady),
          noSecretExposure: toBoolean(payload.noSecretExposure),
          publicUrlReady: toBoolean(payload.publicUrlReady),
          pdfReady: toBoolean(payload.pdfReady)
        }
      })
    });

    return NextResponse.json({ ok: true, submission });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "제출 저장에 실패했습니다." }, { status: 400 });
  }
}

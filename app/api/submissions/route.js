import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { packJudgePreviewMeta } from "@/lib/judge-preview";
import { createSubmission } from "@/lib/store";
import { getViewerSession } from "@/lib/visitor";

export const runtime = "nodejs";

function toBoolean(value) {
  return value === true || value === "true";
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getViewerSession(cookieStore);
  if (!session.isAuthenticated || !session.userId) {
    return NextResponse.json({ error: "제출 저장은 로그인 후 사용할 수 있습니다." }, { status: 401 });
  }

  const payload = await request.json();

  if (!payload.hackathonSlug || !String(payload.projectTitle ?? "").trim() || !String(payload.teamParticipants ?? "").trim()) {
    return NextResponse.json({ error: "해커톤, 프로젝트 제목, 팀/참여자는 필수입니다." }, { status: 400 });
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

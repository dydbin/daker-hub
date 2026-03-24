const META_MARKER = "[JUDGE_PREVIEW_META]";

export const DEFAULT_JUDGE_PREVIEW_CHECKLIST = {
  dataDrivenRendering: false,
  filterSortWorking: false,
  emptyStateReady: false,
  responsiveReady: false,
  errorHandlingReady: false,
  loadingReady: false,
  accessibilityReady: false,
  reviewerAccessReady: false,
  noSecretExposure: false,
  publicUrlReady: false,
  pdfReady: false
};

function normalize(value) {
  return String(value ?? "").trim();
}

function normalizeChecklist(raw = {}) {
  return Object.keys(DEFAULT_JUDGE_PREVIEW_CHECKLIST).reduce((bucket, key) => {
    bucket[key] = raw[key] === true;
    return bucket;
  }, {});
}

function encodeMeta(meta) {
  return Buffer.from(JSON.stringify(meta), "utf8").toString("base64url");
}

function decodeMeta(value) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function getPackedDevelopmentPlan(rawValue) {
  const value = normalize(rawValue);
  const markerIndex = value.lastIndexOf(META_MARKER);
  if (markerIndex < 0) {
    return {
      baseValue: value,
      meta: {
        extensionIdea: "",
        verificationPlan: "",
        checklist: { ...DEFAULT_JUDGE_PREVIEW_CHECKLIST }
      }
    };
  }

  const baseValue = value.slice(0, markerIndex).trimEnd();
  const encoded = value.slice(markerIndex + META_MARKER.length).trim();
  const decoded = decodeMeta(encoded);

  if (!decoded) {
    return {
      baseValue: value,
      meta: {
        extensionIdea: "",
        verificationPlan: "",
        checklist: { ...DEFAULT_JUDGE_PREVIEW_CHECKLIST }
      }
    };
  }

  return {
    baseValue,
    meta: {
      extensionIdea: normalize(decoded.extensionIdea),
      verificationPlan: normalize(decoded.verificationPlan),
      checklist: normalizeChecklist(decoded.checklist)
    }
  };
}

export function packJudgePreviewMeta({ developmentPlan, extensionIdea, verificationPlan, checklist }) {
  const baseValue = normalize(developmentPlan);
  const normalizedMeta = {
    extensionIdea: normalize(extensionIdea),
    verificationPlan: normalize(verificationPlan),
    checklist: normalizeChecklist(checklist)
  };

  const hasMeta =
    Boolean(normalizedMeta.extensionIdea) ||
    Boolean(normalizedMeta.verificationPlan) ||
    Object.values(normalizedMeta.checklist).some(Boolean);

  if (!hasMeta) {
    return baseValue;
  }

  return `${baseValue}${baseValue ? "\n\n" : ""}${META_MARKER}${encodeMeta(normalizedMeta)}`;
}

export function extractJudgePreviewMeta(submission) {
  const packed = getPackedDevelopmentPlan(submission?.development_plan ?? submission?.developmentPlan);
  return {
    extensionIdea: packed.meta.extensionIdea,
    verificationPlan: packed.meta.verificationPlan,
    checklist: packed.meta.checklist
  };
}

function getSubmissionSnapshot(submission) {
  const packed = getPackedDevelopmentPlan(submission?.development_plan ?? submission?.developmentPlan);
  return {
    projectTitle: normalize(submission?.project_title ?? submission?.projectTitle),
    teamParticipants: normalize(submission?.team_participants ?? submission?.teamParticipants),
    serviceOverview: normalize(submission?.service_overview ?? submission?.serviceOverview),
    pageComposition: normalize(submission?.page_composition ?? submission?.pageComposition),
    systemComposition: normalize(submission?.system_composition ?? submission?.systemComposition),
    coreFunctionSpec: normalize(submission?.core_function_spec ?? submission?.coreFunctionSpec),
    userFlow: normalize(submission?.user_flow ?? submission?.userFlow),
    developmentPlan: packed.baseValue,
    extensionIdea: packed.meta.extensionIdea,
    verificationPlan: packed.meta.verificationPlan,
    checklist: packed.meta.checklist
  };
}

export function extractJudgePreviewDraft(submission) {
  const snapshot = getSubmissionSnapshot(submission);

  return {
    projectTitle: snapshot.projectTitle,
    teamParticipants: snapshot.teamParticipants,
    serviceOverview: snapshot.serviceOverview,
    pageComposition: snapshot.pageComposition,
    systemComposition: snapshot.systemComposition,
    coreFunctionSpec: snapshot.coreFunctionSpec,
    userFlow: snapshot.userFlow,
    developmentPlan: snapshot.developmentPlan,
    extensionIdea: snapshot.extensionIdea,
    verificationPlan: snapshot.verificationPlan,
    dataDrivenRendering: snapshot.checklist.dataDrivenRendering,
    filterSortWorking: snapshot.checklist.filterSortWorking,
    emptyStateReady: snapshot.checklist.emptyStateReady,
    responsiveReady: snapshot.checklist.responsiveReady,
    errorHandlingReady: snapshot.checklist.errorHandlingReady,
    loadingReady: snapshot.checklist.loadingReady,
    accessibilityReady: snapshot.checklist.accessibilityReady,
    reviewerAccessReady: snapshot.checklist.reviewerAccessReady,
    noSecretExposure: snapshot.checklist.noSecretExposure,
    publicUrlReady: snapshot.checklist.publicUrlReady,
    pdfReady: snapshot.checklist.pdfReady
  };
}

function buildThresholdScore(value, stages = []) {
  const length = normalize(value).length;
  return stages.reduce((score, stage) => (length >= stage.min ? stage.score : score), 0);
}

function sumScores(items = []) {
  return items.reduce((sum, item) => sum + item.score, 0);
}

function makeItem(label, score, max, note) {
  return {
    label,
    score,
    max,
    note
  };
}

function buildRequiredFieldChecks(snapshot) {
  return [
    { label: "프로젝트 제목", ok: Boolean(snapshot.projectTitle) },
    { label: "팀/참여자 정보", ok: Boolean(snapshot.teamParticipants) },
    { label: "서비스 개요", ok: snapshot.serviceOverview.length >= 40 },
    { label: "페이지 구성", ok: snapshot.pageComposition.length >= 60 },
    { label: "시스템 구성", ok: snapshot.systemComposition.length >= 60 },
    { label: "핵심 기능 명세", ok: snapshot.coreFunctionSpec.length >= 80 },
    { label: "유저 플로우", ok: snapshot.userFlow.length >= 50 },
    { label: "개발 및 개선 계획", ok: snapshot.developmentPlan.length >= 50 },
    { label: "팀 고유 확장 기능", ok: snapshot.extensionIdea.length >= 50 },
    { label: "실행/검증 방법", ok: snapshot.verificationPlan.length >= 50 }
  ];
}

function buildChecklistChecks(checklist) {
  return [
    { label: "데이터 기반 렌더링 점검", ok: checklist.dataDrivenRendering },
    { label: "필터/정렬 동작 점검", ok: checklist.filterSortWorking },
    { label: "빈 상태 UI 점검", ok: checklist.emptyStateReady },
    { label: "반응형 점검", ok: checklist.responsiveReady },
    { label: "오류/예외 처리 점검", ok: checklist.errorHandlingReady },
    { label: "로딩/반응성 점검", ok: checklist.loadingReady },
    { label: "접근성 점검", ok: checklist.accessibilityReady },
    { label: "심사자 키 없는 접근 확인", ok: checklist.reviewerAccessReady },
    { label: "비밀값 비노출 확인", ok: checklist.noSecretExposure },
    { label: "공개 배포 URL 준비", ok: checklist.publicUrlReady },
    { label: "PDF 제출물 준비", ok: checklist.pdfReady }
  ];
}

function getRubric(hackathon) {
  const title = normalize(hackathon?.title);
  const slug = normalize(hackathon?.slug);
  const submitItems = hackathon?.detail?.sections?.submit?.submissionItems ?? [];

  return {
    basicImplementation: {
      id: "implementation",
      label: "기본 구현",
      max: 30,
      reason: "웹 페이지 구현도, 데이터 기반 렌더링, 필터/정렬 동작, 빈 상태 UI 기준으로 계산했습니다."
    },
    extensionIdea: {
      id: "idea",
      label: "확장(아이디어)",
      max: 30,
      reason: "팀 고유 기능/UX 개선의 참신함·실용성, 서비스 가치, 일관된 흐름을 기준으로 계산했습니다."
    },
    productQuality: {
      id: "quality",
      label: "완성도",
      max: 25,
      reason: "사용성, 오류/예외 처리, 성능/반응성, 접근성/반응형 self-audit을 기준으로 계산했습니다."
    },
    documentation: {
      id: "docs",
      label: "문서/설명",
      max: 15,
      reason: "기획 문서 충실도, 실행/검증 방법, 심사자 재현성, 제출 패키지 준비 상태를 기준으로 계산했습니다."
    },
    judgeModelNote:
      slug === "daker-handover-2026-03" || title.includes("인수인계")
        ? "이 Judge Preview는 내부 심사위원 평가기준(기본 구현 30 / 확장 30 / 완성도 25 / 문서 15)을 기준으로 동작합니다."
        : "이 Judge Preview는 공통 내부 심사 기준(기본 구현 / 확장 / 완성도 / 문서)을 기준으로 동작합니다.",
    requiresPublicUrl: submitItems.some((item) => item.key === "web"),
    requiresPdf: submitItems.some((item) => item.key === "pdf")
  };
}

export function buildJudgePreviewReport(submission, hackathon = null) {
  const snapshot = getSubmissionSnapshot(submission);
  const rubric = getRubric(hackathon);
  const fieldChecks = buildRequiredFieldChecks(snapshot);
  const checklistChecks = buildChecklistChecks(snapshot.checklist);
  const allChecks = [...fieldChecks, ...checklistChecks];
  const completedChecks = allChecks.filter((item) => item.ok).length;

  const implementationBreakdown = [
    makeItem(
      "페이지 구성 설명",
      buildThresholdScore(snapshot.pageComposition, [
        { min: 40, score: 2 },
        { min: 90, score: 4 },
        { min: 150, score: 6 }
      ]),
      6,
      "주요 화면과 역할이 얼마나 구체적으로 적혀 있는지 봅니다."
    ),
    makeItem(
      "시스템 구성 설명",
      buildThresholdScore(snapshot.systemComposition, [
        { min: 40, score: 2 },
        { min: 90, score: 4 },
        { min: 150, score: 6 }
      ]),
      6,
      "저장/서버/API/배포 구조를 설명할 수 있는지 봅니다."
    ),
    makeItem(
      "핵심 기능 명세",
      buildThresholdScore(snapshot.coreFunctionSpec, [
        { min: 50, score: 2 },
        { min: 110, score: 4 },
        { min: 180, score: 6 }
      ]),
      6,
      "구현 범위와 동작 설명이 충분한지 봅니다."
    ),
    makeItem("데이터 기반 렌더링", snapshot.checklist.dataDrivenRendering ? 4 : 0, 4, "실제 데이터 또는 더미 데이터 기준 렌더링 여부입니다."),
    makeItem("필터/정렬 동작", snapshot.checklist.filterSortWorking ? 4 : 0, 4, "목록/보드 필터와 정렬 기능이 실제로 동작하는지 봅니다."),
    makeItem("빈 상태 UI", snapshot.checklist.emptyStateReady ? 4 : 0, 4, "결과 없음/저장본 없음 등 빈 상태 대응 여부입니다.")
  ];

  const extensionBreakdown = [
    makeItem(
      "서비스 가치 설명",
      buildThresholdScore(snapshot.serviceOverview, [
        { min: 40, score: 3 },
        { min: 90, score: 6 },
        { min: 160, score: 8 }
      ]),
      8,
      "서비스로서 왜 의미가 있는지 설명하는 정도입니다."
    ),
    makeItem(
      "팀 고유 확장 기능",
      buildThresholdScore(snapshot.extensionIdea, [
        { min: 40, score: 4 },
        { min: 100, score: 7 },
        { min: 180, score: 10 }
      ]),
      10,
      "팀만의 확장 포인트와 실용성을 설명하는 정도입니다."
    ),
    makeItem(
      "유저 플로우 일관성",
      buildThresholdScore(snapshot.userFlow, [
        { min: 40, score: 2 },
        { min: 90, score: 4 },
        { min: 150, score: 6 }
      ]),
      6,
      "확장 기능이 전체 사용 흐름 안에서 자연스럽게 연결되는지 봅니다."
    ),
    makeItem(
      "개선 계획 구체성",
      buildThresholdScore(snapshot.developmentPlan, [
        { min: 40, score: 2 },
        { min: 90, score: 4 },
        { min: 150, score: 6 }
      ]),
      6,
      "확장 이후 로드맵과 실행 계획이 구체적인지 봅니다."
    )
  ];

  const qualityBreakdown = [
    makeItem(
      "사용성/가독성",
      buildThresholdScore(snapshot.userFlow, [
        { min: 40, score: 2 },
        { min: 90, score: 5 },
        { min: 150, score: 7 }
      ]),
      7,
      "사용자 동선과 화면 읽힘을 설명하는 정도입니다."
    ),
    makeItem("오류/예외 처리", snapshot.checklist.errorHandlingReady ? 6 : 0, 6, "권한/중복/저장 실패 등 예외 처리를 점검했는지 봅니다."),
    makeItem("반응형", snapshot.checklist.responsiveReady ? 5 : 0, 5, "모바일과 데스크톱에서 사용 가능한지 점검했는지 봅니다."),
    makeItem("로딩/반응성", snapshot.checklist.loadingReady ? 4 : 0, 4, "로딩 흐름과 상호작용 반응성을 확인했는지 봅니다."),
    makeItem("접근성", snapshot.checklist.accessibilityReady ? 3 : 0, 3, "기본 접근성/가독성 점검 여부입니다.")
  ];

  const completionRatio = fieldChecks.filter((item) => item.ok).length / fieldChecks.length;
  const docsBreakdown = [
    makeItem("문서 필수 항목 충족", completionRatio >= 1 ? 4 : completionRatio >= 0.8 ? 3 : completionRatio >= 0.6 ? 2 : completionRatio > 0 ? 1 : 0, 4, "기획 문서형 제출 필드가 얼마나 채워졌는지 봅니다."),
    makeItem(
      "실행/검증 방법",
      buildThresholdScore(snapshot.verificationPlan, [
        { min: 40, score: 2 },
        { min: 90, score: 4 },
        { min: 150, score: 5 }
      ]),
      5,
      "심사자가 어떻게 실행하고 검증할지 설명하는 정도입니다."
    ),
    makeItem("심사자 키 없는 접근", snapshot.checklist.reviewerAccessReady ? 2 : 0, 2, "심사자가 별도 키 없이 확인 가능한지 점검했는지 봅니다."),
    makeItem("공개 배포 URL 준비", rubric.requiresPublicUrl ? (snapshot.checklist.publicUrlReady ? 2 : 0) : 2, 2, "외부 접속 가능한 URL 준비 여부입니다."),
    makeItem("PDF 제출 준비", rubric.requiresPdf ? (snapshot.checklist.pdfReady ? 1 : 0) : 1, 1, "최종 PDF 제출물 준비 여부입니다."),
    makeItem("비밀값 비노출", snapshot.checklist.noSecretExposure ? 1 : 0, 1, "서비스 키/비밀값 노출이 없는지 점검했는지 봅니다.")
  ];

  const categories = [
    {
      id: rubric.basicImplementation.id,
      label: rubric.basicImplementation.label,
      max: rubric.basicImplementation.max,
      score: sumScores(implementationBreakdown),
      reason: rubric.basicImplementation.reason,
      breakdown: implementationBreakdown
    },
    {
      id: rubric.extensionIdea.id,
      label: rubric.extensionIdea.label,
      max: rubric.extensionIdea.max,
      score: sumScores(extensionBreakdown),
      reason: rubric.extensionIdea.reason,
      breakdown: extensionBreakdown
    },
    {
      id: rubric.productQuality.id,
      label: rubric.productQuality.label,
      max: rubric.productQuality.max,
      score: sumScores(qualityBreakdown),
      reason: rubric.productQuality.reason,
      breakdown: qualityBreakdown
    },
    {
      id: rubric.documentation.id,
      label: rubric.documentation.label,
      max: rubric.documentation.max,
      score: sumScores(docsBreakdown),
      reason: rubric.documentation.reason,
      breakdown: docsBreakdown
    }
  ];

  const total = categories.reduce((sum, item) => sum + item.score, 0);

  const strengths = [];
  if (sumScores(implementationBreakdown) >= 24) strengths.push("기본 구현 근거가 비교적 탄탄해 데이터 렌더링과 화면 구조를 설명하기 좋습니다.");
  if (sumScores(extensionBreakdown) >= 22) strengths.push("팀 고유 확장 기능과 서비스 가치가 비교적 명확해 아이디어 점수 방어에 유리합니다.");
  if (sumScores(qualityBreakdown) >= 18) strengths.push("완성도 self-check가 충분해 반응형/오류 대응 관점의 설명력이 좋습니다.");
  if (sumScores(docsBreakdown) >= 12) strengths.push("문서와 재현성 근거가 잘 갖춰져 있어 심사자가 확인하기 편한 상태입니다.");

  const improvements = [];
  if (!snapshot.checklist.dataDrivenRendering) improvements.push("기본 구현 점수를 위해 데이터 기반 렌더링 여부를 직접 점검하고 체크해야 합니다.");
  if (!snapshot.checklist.filterSortWorking) improvements.push("필터/정렬 동작은 평가 포인트에 직접 들어가므로 실제 동작 확인 후 반영해야 합니다.");
  if (!snapshot.checklist.emptyStateReady) improvements.push("빈 상태 UI가 빠지면 기본 구현 점수와 사용성 설명이 함께 약해집니다.");
  if (snapshot.extensionIdea.length < 50) improvements.push("팀 고유 확장 기능 설명을 더 구체적으로 적어 아이디어 점수 근거를 보강해야 합니다.");
  if (!snapshot.checklist.errorHandlingReady) improvements.push("오류/예외 처리 점검이 빠져 있어 완성도 점수를 잃고 있습니다.");
  if (!snapshot.checklist.responsiveReady) improvements.push("반응형 확인이 빠져 있어 완성도 평가 포인트를 놓치고 있습니다.");
  if (!snapshot.checklist.reviewerAccessReady) improvements.push("심사자 키 없는 접근 가능 여부를 점검해야 문서/설명 점수와 규정 적합성을 동시에 방어할 수 있습니다.");
  if (!snapshot.checklist.noSecretExposure) improvements.push("비밀값 비노출 확인이 필요합니다. 공개 자료와 환경 변수 노출 여부를 다시 점검하세요.");
  if (!snapshot.checklist.publicUrlReady && rubric.requiresPublicUrl) improvements.push("공개 배포 URL 준비 여부를 체크해야 최종 제출 패키지 재현성이 확보됩니다.");
  if (!snapshot.checklist.pdfReady && rubric.requiresPdf) improvements.push("PDF 제출 준비 여부를 체크해야 최종 산출물 패키지가 완성됩니다.");
  if (snapshot.verificationPlan.length < 50) improvements.push("실행/검증 방법을 더 구체적으로 적어 심사자가 어떻게 확인할지 바로 이해할 수 있게 해야 합니다.");

  return {
    total,
    categories,
    checks: allChecks,
    strengths: strengths.length ? strengths : ["문서 기본 구조는 잡혔지만, 평가표 기준 강점 근거를 더 명확히 적어야 합니다."],
    improvements: improvements.length ? improvements : ["평가표 기준 큰 누락은 적습니다. 실제 배포 URL, PDF, 비밀값 비노출 상태만 마지막으로 확인하세요."],
    judgeModelNote: rubric.judgeModelNote,
    meta: {
      extensionIdea: snapshot.extensionIdea,
      verificationPlan: snapshot.verificationPlan,
      checklist: snapshot.checklist,
      completedChecks,
      totalChecks: allChecks.length
    }
  };
}

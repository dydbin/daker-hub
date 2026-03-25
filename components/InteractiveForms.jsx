"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { TurnstileWidget } from "@/components/TurnstileWidget";
import { MESSAGE_INPUT_LIMITS, SUBMISSION_INPUT_LIMITS, TEAM_INPUT_LIMITS } from "@/lib/content-limits";

const BLANK_SUBMISSION_FORM = {
  projectTitle: "",
  teamParticipants: "",
  serviceOverview: "",
  pageComposition: "",
  systemComposition: "",
  coreFunctionSpec: "",
  userFlow: "",
  developmentPlan: "",
  extensionIdea: "",
  verificationPlan: "",
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

function buildSubmissionFormValue(draft, linkedTeam = null) {
  if (!draft) {
    return {
      ...BLANK_SUBMISSION_FORM,
      teamParticipants: linkedTeam?.label ?? ""
    };
  }

  return {
    projectTitle: draft.projectTitle ?? "",
    teamParticipants: linkedTeam?.label ?? draft.teamParticipants ?? "",
    serviceOverview: draft.serviceOverview ?? "",
    pageComposition: draft.pageComposition ?? "",
    systemComposition: draft.systemComposition ?? "",
    coreFunctionSpec: draft.coreFunctionSpec ?? "",
    userFlow: draft.userFlow ?? "",
    developmentPlan: draft.developmentPlan ?? "",
    extensionIdea: draft.extensionIdea ?? "",
    verificationPlan: draft.verificationPlan ?? "",
    dataDrivenRendering: draft.dataDrivenRendering === true,
    filterSortWorking: draft.filterSortWorking === true,
    emptyStateReady: draft.emptyStateReady === true,
    responsiveReady: draft.responsiveReady === true,
    errorHandlingReady: draft.errorHandlingReady === true,
    loadingReady: draft.loadingReady === true,
    accessibilityReady: draft.accessibilityReady === true,
    reviewerAccessReady: draft.reviewerAccessReady === true,
    noSecretExposure: draft.noSecretExposure === true,
    publicUrlReady: draft.publicUrlReady === true,
    pdfReady: draft.pdfReady === true
  };
}

function submitJson(url, body) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

export function SoloApplyButton({ hackathonSlug, disabled = false }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function onApply() {
    setMessage("");

    startTransition(async () => {
      const response = await submitJson("/api/apply", {
        mode: "solo",
        hackathonSlug
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error ?? "개인 참가 신청에 실패했습니다.");
        return;
      }

      setMessage("개인 참가 신청이 등록되었습니다.");
      router.refresh();
    });
  }

  return (
    <div className="stack-list stack-list--tight">
      <button className="button" disabled={disabled || isPending} onClick={onApply} type="button">
        {isPending ? "신청 중..." : "개인으로 바로 신청"}
      </button>
      {message ? <p className="inline-message">{message}</p> : null}
    </div>
  );
}

export function JoinTeamButton({ teamId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function onApply() {
    setMessage("");

    startTransition(async () => {
      const response = await submitJson("/api/apply", {
        mode: "join",
        teamId
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error ?? "합류 신청에 실패했습니다.");
        return;
      }

      setMessage(payload.alreadyRequested ? "이미 이 팀에 합류 신청을 남겼습니다." : "팀 합류 신청을 남겼습니다.");
      router.refresh();
    });
  }

  return (
    <div className="stack-list stack-list--tight">
      <button className="button button--ghost" disabled={isPending} onClick={onApply} type="button">
        {isPending ? "신청 중..." : "합류 신청"}
      </button>
      {message ? <p className="inline-message">{message}</p> : null}
    </div>
  );
}

export function TeamCreateForm({ defaultHackathonSlug = "", hackathonOptions = [], sectionId = "" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    hackathonSlug: defaultHackathonSlug,
    name: "",
    intro: "",
    lookingFor: "",
    targetMemberCount: "4",
    recruitmentDeadlineAt: "",
    contactUrl: "",
    isOpen: true
  });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      const response = await submitJson("/api/teams", {
        ...form,
        participationMode: "team"
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error ?? "팀 생성에 실패했습니다.");
        return;
      }

      setForm({
        hackathonSlug: defaultHackathonSlug,
        name: "",
        intro: "",
        lookingFor: "",
        targetMemberCount: "4",
        recruitmentDeadlineAt: "",
        contactUrl: "",
        isOpen: true
      });
      setMessage("팀 모집글을 저장했습니다.");
      router.refresh();
    });
  }

  return (
    <section className="card" id={sectionId || undefined}>
      <div className="section-head">
        <span className="eyebrow">Create</span>
        <h2>모집 글 쓰기</h2>
      </div>
      <form className="stack-form" onSubmit={onSubmit}>
        <label>
          <span>해커톤 선택</span>
          <select value={form.hackathonSlug} onChange={(event) => update("hackathonSlug", event.target.value)}>
            <option value="">연결 안 함</option>
            {hackathonOptions.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>팀명</span>
          <input value={form.name} onChange={(event) => update("name", event.target.value)} maxLength={TEAM_INPUT_LIMITS.name} required />
        </label>
        <label>
          <span>팀 소개</span>
          <textarea value={form.intro} onChange={(event) => update("intro", event.target.value)} rows={4} maxLength={TEAM_INPUT_LIMITS.intro} required />
        </label>
        <label>
          <span>모집 포지션</span>
          <input
            value={form.lookingFor}
            onChange={(event) => update("lookingFor", event.target.value)}
            maxLength={TEAM_INPUT_LIMITS.lookingFor}
            placeholder="Frontend, Designer"
          />
        </label>
        <label>
          <span>목표 팀원 수</span>
          <input
            value={form.targetMemberCount}
            onChange={(event) => update("targetMemberCount", event.target.value)}
            min="2"
            max="20"
            type="number"
          />
        </label>
        <label>
          <span>모집 마감일</span>
          <input value={form.recruitmentDeadlineAt} onChange={(event) => update("recruitmentDeadlineAt", event.target.value)} type="datetime-local" />
        </label>
        <label>
          <span>외부 연락 링크</span>
          <input
            value={form.contactUrl}
            onChange={(event) => update("contactUrl", event.target.value)}
            maxLength={TEAM_INPUT_LIMITS.contactUrl}
            placeholder="https://open.kakao.com/..."
          />
        </label>
        <button className="button" disabled={isPending} type="submit">
          {isPending ? "저장 중..." : "팀 모집글 저장"}
        </button>
      </form>
      {message ? <p className="inline-message">{message}</p> : null}
    </section>
  );
}

export function TeamEditForm({
  team,
  hackathonOptions = [],
  initialOpen = false,
  statusLabel = "",
  statusClassName = "",
  triggerClassName = "button button--ghost",
  triggerLabel = "모집 수정"
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [form, setForm] = useState({
    hackathonSlug: team.hackathon_slug ?? "",
    name: team.name ?? "",
    intro: team.intro ?? "",
    lookingFor: (team.looking_for ?? team.lookingFor ?? []).join(", "),
    targetMemberCount: String(team.target_member_count ?? team.targetMemberCount ?? 4),
    recruitmentDeadlineAt: (team.recruitment_deadline_at ?? team.recruitmentDeadlineAt ?? "").slice(0, 16),
    contactUrl: team.contact_url ?? team.contact?.url ?? "",
    isOpen: Boolean(team.is_open ?? team.isOpen)
  });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      const response = await fetch("/api/teams", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          teamId: team.id,
          ...form
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error ?? "그룹 수정에 실패했습니다.");
        return;
      }

      setMessage("그룹 정보를 수정했습니다.");
      setIsOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="team-edit-form">
      <div className="team-card__head-actions-row">
        {statusLabel ? <span className={statusClassName}>{statusLabel}</span> : null}
        <button className={triggerClassName} onClick={() => setIsOpen((current) => !current)} type="button">
          {isOpen ? "수정 닫기" : triggerLabel}
        </button>
      </div>
      {isOpen ? (
        <div className="team-edit-form__panel">
          <form className="stack-form" onSubmit={onSubmit}>
            <label>
              <span>해커톤 선택</span>
              <select value={form.hackathonSlug} onChange={(event) => update("hackathonSlug", event.target.value)}>
                <option value="">연결 안 함</option>
                {hackathonOptions.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>팀명</span>
              <input value={form.name} onChange={(event) => update("name", event.target.value)} maxLength={TEAM_INPUT_LIMITS.name} required />
            </label>
            <label>
              <span>팀 소개</span>
              <textarea value={form.intro} onChange={(event) => update("intro", event.target.value)} rows={4} maxLength={TEAM_INPUT_LIMITS.intro} required />
            </label>
            <label>
              <span>모집 포지션</span>
              <input value={form.lookingFor} onChange={(event) => update("lookingFor", event.target.value)} maxLength={TEAM_INPUT_LIMITS.lookingFor} />
            </label>
            <label>
              <span>목표 팀원 수</span>
              <input value={form.targetMemberCount} min="2" max="20" onChange={(event) => update("targetMemberCount", event.target.value)} type="number" />
            </label>
            <label>
              <span>모집 마감일</span>
              <input value={form.recruitmentDeadlineAt} onChange={(event) => update("recruitmentDeadlineAt", event.target.value)} type="datetime-local" />
            </label>
            <label>
              <span>외부 연락 링크</span>
              <input
                value={form.contactUrl}
                onChange={(event) => update("contactUrl", event.target.value)}
                maxLength={TEAM_INPUT_LIMITS.contactUrl}
                placeholder="https://open.kakao.com/..."
              />
            </label>
            <label>
              <span>모집 상태</span>
              <select value={String(form.isOpen)} onChange={(event) => update("isOpen", event.target.value === "true")}>
                <option value="true">모집중</option>
                <option value="false">마감</option>
              </select>
            </label>
            {Number(team.member_count ?? team.memberCount ?? 1) === 0 ? (
              <p className="small-note">개인 그룹도 모집 상태를 `모집중`으로 바꾸면 공개 팀 모집 보드에 노출됩니다.</p>
            ) : null}
            <button className="button" disabled={isPending} type="submit">
              {isPending ? "저장 중..." : "수정 저장"}
            </button>
          </form>
        </div>
      ) : null}
      {message ? <p className="inline-message">{message}</p> : null}
    </div>
  );
}

export function CampCreatePanel({ defaultHackathonSlug = "", hackathonOptions = [], initialOpen = false, sectionId = "" }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const selectedHackathon = hackathonOptions.find((option) => option.slug === defaultHackathonSlug) ?? null;

  if (isOpen) {
    return <TeamCreateForm defaultHackathonSlug={defaultHackathonSlug} hackathonOptions={hackathonOptions} sectionId={sectionId} />;
  }

  return (
    <section className="card" id={sectionId || undefined}>
      <div className="section-head">
        <span className="eyebrow">Create</span>
        <h2>팀 모집하기</h2>
        <p>
          {selectedHackathon
            ? `${selectedHackathon.title}을 기본 선택한 상태로 팀 모집글을 작성할 수 있습니다.`
            : "원하는 해커톤을 선택하거나 연결 없이 팀 모집글을 작성할 수 있습니다."}
        </p>
      </div>
      <div className="stack-list stack-list--tight">
        <button className="button" onClick={() => setIsOpen(true)} type="button">
          팀 만들기
        </button>
        {!selectedHackathon ? (
          <p className="small-note">해커톤을 선택하지 않아도 팀 모집글 생성은 가능합니다.</p>
        ) : null}
        <Link className="button button--ghost" href="/hackathons">
          해커톤 먼저 보기
        </Link>
      </div>
    </section>
  );
}

export function MessageForm({ teamId, turnstileSiteKey = "" }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const turnstileEnabled = Boolean(turnstileSiteKey);

  function onSubmit(event) {
    event.preventDefault();
    if (!body.trim()) return;
    setMessage("");

    if (turnstileEnabled && !turnstileToken) {
      setMessage("보안 확인이 끝나면 다시 시도해 주세요.");
      return;
    }

    startTransition(async () => {
      const response = await submitJson("/api/messages", {
        teamId,
        body,
        turnstileToken
      });
      const payload = await response.json();
      if (turnstileEnabled) {
        setTurnstileResetKey((current) => current + 1);
      }
      if (!response.ok) {
        setMessage(payload.error ?? "문의 전송에 실패했습니다.");
        return;
      }

      setBody("");
      setMessage("문의가 전송되었습니다.");
      router.refresh();
    });
  }

  return (
    <form className="inline-form" onSubmit={onSubmit}>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        maxLength={MESSAGE_INPUT_LIMITS.body}
        placeholder="팀에 남길 문의 내용을 적으세요."
      />
      <TurnstileWidget onTokenChange={setTurnstileToken} resetKey={turnstileResetKey} siteKey={turnstileSiteKey} />
      <button className="button button--ghost" disabled={isPending} type="submit">
        {isPending ? "전송 중..." : "문의 남기기"}
      </button>
      {message ? <p className="inline-message">{message}</p> : null}
    </form>
  );
}

export function SubmissionForm({ hackathonSlug, savedSubmissions = [], linkedTeam = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [selectedDraftId, setSelectedDraftId] = useState("");
  const [form, setForm] = useState(() => buildSubmissionFormValue(null, linkedTeam));

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function onSelectDraft(event) {
    const nextId = event.target.value;
    setSelectedDraftId(nextId);
    setMessage("");

    if (!nextId) {
      setForm(buildSubmissionFormValue(null, linkedTeam));
      return;
    }

    const draft = savedSubmissions.find((item) => item.id === nextId) ?? null;
    setForm(buildSubmissionFormValue(draft, linkedTeam));
    if (draft) {
      setMessage("저장본을 폼에 불러왔습니다.");
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      const response = await submitJson("/api/submissions", {
        hackathonSlug,
        ...form
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error ?? "제출 요약 저장에 실패했습니다.");
        return;
      }

      setSelectedDraftId("");
      setForm(buildSubmissionFormValue(null, linkedTeam));
      setMessage("제출 개요를 저장했습니다.");
      router.refresh();
    });
  }

  return (
    <form className="stack-form" onSubmit={onSubmit}>
      {savedSubmissions.length ? (
        <label>
          <span>내 저장본 불러오기</span>
          <select value={selectedDraftId} onChange={onSelectDraft}>
            <option value="">새 제출 작성</option>
            {savedSubmissions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <small className="small-note">로그인한 사용자가 이 해커톤에 저장한 제출 개요만 표시됩니다.</small>
        </label>
      ) : null}
      <label>
        <span>프로젝트 제목</span>
        <input value={form.projectTitle} onChange={(event) => update("projectTitle", event.target.value)} maxLength={SUBMISSION_INPUT_LIMITS.projectTitle} required />
      </label>
      {linkedTeam ? (
        <label>
          <span>팀/참여자</span>
          <input readOnly value={form.teamParticipants} />
          <small className="small-note">
            이 제출은 현재 로그인한 내 팀과 연결됩니다.{" "}
            <Link className="text-link" href={linkedTeam.href}>
              {linkedTeam.ctaLabel}
            </Link>
          </small>
        </label>
      ) : (
        <label>
          <span>팀/참여자</span>
          <input value={form.teamParticipants} onChange={(event) => update("teamParticipants", event.target.value)} maxLength={SUBMISSION_INPUT_LIMITS.teamParticipants} required />
        </label>
      )}
      <label>
        <span>서비스 개요</span>
        <textarea value={form.serviceOverview} onChange={(event) => update("serviceOverview", event.target.value)} rows={3} maxLength={SUBMISSION_INPUT_LIMITS.serviceOverview} />
      </label>
      <label>
        <span>페이지 구성</span>
        <textarea value={form.pageComposition} onChange={(event) => update("pageComposition", event.target.value)} rows={3} maxLength={SUBMISSION_INPUT_LIMITS.pageComposition} />
      </label>
      <label>
        <span>시스템 구성</span>
        <textarea value={form.systemComposition} onChange={(event) => update("systemComposition", event.target.value)} rows={3} maxLength={SUBMISSION_INPUT_LIMITS.systemComposition} />
      </label>
      <label>
        <span>핵심 기능 명세</span>
        <textarea value={form.coreFunctionSpec} onChange={(event) => update("coreFunctionSpec", event.target.value)} rows={4} maxLength={SUBMISSION_INPUT_LIMITS.coreFunctionSpec} />
      </label>
      <label>
        <span>유저 플로우</span>
        <textarea value={form.userFlow} onChange={(event) => update("userFlow", event.target.value)} rows={3} maxLength={SUBMISSION_INPUT_LIMITS.userFlow} />
      </label>
      <label>
        <span>개발 및 개선 계획</span>
        <textarea value={form.developmentPlan} onChange={(event) => update("developmentPlan", event.target.value)} rows={3} maxLength={SUBMISSION_INPUT_LIMITS.developmentPlan} />
      </label>
      <label>
        <span>팀 고유 확장 기능 / UX 개선</span>
        <textarea
          value={form.extensionIdea}
          onChange={(event) => update("extensionIdea", event.target.value)}
          rows={3}
          maxLength={SUBMISSION_INPUT_LIMITS.extensionIdea}
          placeholder="Judge Preview처럼 우리 팀만의 확장 기능과 실용성을 구체적으로 적으세요."
        />
      </label>
      <label>
        <span>실행 / 검증 방법</span>
        <textarea
          value={form.verificationPlan}
          onChange={(event) => update("verificationPlan", event.target.value)}
          rows={3}
          maxLength={SUBMISSION_INPUT_LIMITS.verificationPlan}
          placeholder="심사자가 어떤 순서로 URL, 주요 화면, 제출물, 검증 포인트를 확인하면 되는지 적으세요."
        />
      </label>
      <section className="card section-card">
        <div className="section-head">
          <span className="eyebrow">Judge Preview</span>
          <h3>평가 기준 self-check</h3>
          <p>실제 평가표 기준으로 구현/완성도/재현성 항목을 체크하면 Judge Preview가 더 정확해집니다.</p>
        </div>
        <div className="stack-list stack-list--tight">
          <label className="checkbox-field">
            <input checked={form.dataDrivenRendering} onChange={(event) => update("dataDrivenRendering", event.target.checked)} type="checkbox" />
            <span>더미 데이터 또는 실제 데이터 기준의 데이터 기반 렌더링을 확인했다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.filterSortWorking} onChange={(event) => update("filterSortWorking", event.target.checked)} type="checkbox" />
            <span>필터/정렬 동작을 실제로 확인했다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.emptyStateReady} onChange={(event) => update("emptyStateReady", event.target.checked)} type="checkbox" />
            <span>빈 상태 UI를 주요 화면에서 확인했다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.responsiveReady} onChange={(event) => update("responsiveReady", event.target.checked)} type="checkbox" />
            <span>모바일/데스크톱 반응형을 확인했다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.errorHandlingReady} onChange={(event) => update("errorHandlingReady", event.target.checked)} type="checkbox" />
            <span>오류/예외 처리 메시지와 실패 흐름을 확인했다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.loadingReady} onChange={(event) => update("loadingReady", event.target.checked)} type="checkbox" />
            <span>로딩/반응성 문제 없이 주요 흐름이 동작하는지 확인했다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.accessibilityReady} onChange={(event) => update("accessibilityReady", event.target.checked)} type="checkbox" />
            <span>기본 접근성/가독성을 점검했다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.reviewerAccessReady} onChange={(event) => update("reviewerAccessReady", event.target.checked)} type="checkbox" />
            <span>심사자가 별도 키 없이 공개 URL로 확인 가능하다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.noSecretExposure} onChange={(event) => update("noSecretExposure", event.target.checked)} type="checkbox" />
            <span>비밀값과 서비스 키를 소스/문서에 노출하지 않았다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.publicUrlReady} onChange={(event) => update("publicUrlReady", event.target.checked)} type="checkbox" />
            <span>외부에서 접속 가능한 배포 URL 준비가 끝났다</span>
          </label>
          <label className="checkbox-field">
            <input checked={form.pdfReady} onChange={(event) => update("pdfReady", event.target.checked)} type="checkbox" />
            <span>최종 솔루션 PDF 준비가 끝났다</span>
          </label>
        </div>
      </section>
      <button className="button" disabled={isPending} type="submit">
        {isPending ? "저장 중..." : "제출 개요 저장"}
      </button>
      {message ? <p className="inline-message">{message}</p> : null}
    </form>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { TurnstileWidget } from "@/components/TurnstileWidget";
import { AUTH_INPUT_LIMITS } from "@/lib/content-limits";

function submitJson(url, body) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

export function AuthPanel({ mode = "login", returnTo = "/mypage", turnstileSiteKey = "" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: ""
  });

  const isLogin = mode === "login";
  const submitUrl = isLogin ? "/api/auth/login" : "/api/auth/signup";
  const submitLabel = isLogin ? "로그인" : "회원가입";
  const altHref = isLogin ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : `/login?returnTo=${encodeURIComponent(returnTo)}`;
  const altLabel = isLogin ? "회원가입" : "로그인";
  const helperText = isLogin
    ? "로그인 후 팀 모집, 문의, 제출 저장 같은 작성 기능을 사용할 수 있습니다."
    : "계정을 만들면 바로 로그인되고, 내 프로필과 비공개 설정을 이어서 관리할 수 있습니다.";
  const headline = isLogin ? "대회 참여 전용 계정으로 바로 이어서 작업합니다." : "해커톤 활동을 저장하고 팀 단위로 안전하게 관리합니다.";
  const turnstileEnabled = Boolean(turnstileSiteKey);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (turnstileEnabled && !turnstileToken) {
      setMessage("보안 확인이 끝나면 다시 시도해 주세요.");
      return;
    }

    startTransition(async () => {
      const payload = isLogin
        ? {
            email: form.email,
            password: form.password,
            turnstileToken
          }
        : {
            displayName: form.displayName,
            email: form.email,
            password: form.password,
            turnstileToken
          };

      const response = await submitJson(submitUrl, payload);
      const result = await response.json();
      if (turnstileEnabled) {
        setTurnstileResetKey((current) => current + 1);
      }
      if (!response.ok) {
        setMessage(result.error ?? `${submitLabel}에 실패했습니다.`);
        return;
      }

      router.push(returnTo || "/mypage");
      router.refresh();
    });
  }

  const title = isLogin ? "로그인" : "회원가입";

  return (
    <section className="auth-shell">
      <article className="auth-panel">
        <div className="auth-panel__hero">
          <span className="eyebrow">Daker Hub Account</span>
          <h2>{headline}</h2>
          <p>공개 탐색은 누구나 가능하고, 찜하기·팀 모집·문의 inbox·내 제출 저장은 로그인 후에만 이어집니다.</p>
          <div className="auth-panel__hero-grid">
            <article className="auth-panel__hero-card">
              <strong>개인화</strong>
              <span>찜한 대회, 내 제출, 다음 일정까지 한 화면으로 묶습니다.</span>
            </article>
            <article className="auth-panel__hero-card">
              <strong>프라이버시</strong>
              <span>프로필 비공개와 팀별 내부 문의 분리로 공개 범위를 제어합니다.</span>
            </article>
            <article className="auth-panel__hero-card">
              <strong>멀티 유저</strong>
              <span>계정 세션 기준으로 작성 권한과 소유 데이터를 안정적으로 구분합니다.</span>
            </article>
          </div>
          <div className="auth-panel__hero-tags">
            <span className="tag">Favorites</span>
            <span className="tag">Camp Inbox</span>
            <span className="tag">Private Profile</span>
          </div>
        </div>

        <div className="auth-panel__card">
          <div className="auth-panel__tabs">
            <Link className={`auth-panel__tab ${isLogin ? "is-active" : ""}`} href={`/login?returnTo=${encodeURIComponent(returnTo)}`}>
              로그인
            </Link>
            <Link className={`auth-panel__tab ${!isLogin ? "is-active" : ""}`} href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}>
              회원가입
            </Link>
          </div>

          <div className="auth-panel__body">
            <div className="section-head section-head--compact">
              <span className="eyebrow">Account</span>
              <h1>{title}</h1>
              <p>{helperText}</p>
            </div>

            <form className="stack-form auth-form" onSubmit={onSubmit}>
              {!isLogin ? (
                <label>
                  <span>닉네임</span>
                  <input
                    value={form.displayName}
                    onChange={(event) => update("displayName", event.target.value)}
                    maxLength={AUTH_INPUT_LIMITS.displayName}
                    required
                  />
                </label>
              ) : null}
              <label>
                <span>계정 이메일</span>
                <input
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  type="email"
                  maxLength={AUTH_INPUT_LIMITS.email}
                  required
                />
              </label>
              <label>
                <span>비밀번호</span>
                <input
                  value={form.password}
                  onChange={(event) => update("password", event.target.value)}
                  minLength={8}
                  maxLength={AUTH_INPUT_LIMITS.password}
                  type="password"
                  required
                />
              </label>
              <TurnstileWidget onTokenChange={setTurnstileToken} resetKey={turnstileResetKey} siteKey={turnstileSiteKey} />
              <button className="button auth-form__submit" disabled={isPending} type="submit">
                {isPending ? "처리 중..." : submitLabel}
              </button>
            </form>

            <div className="auth-panel__links">
              <span>{isLogin ? "계정이 아직 없나요?" : "이미 계정이 있나요?"}</span>
              <Link href={altHref}>{altLabel}</Link>
            </div>

            <div className="auth-panel__notes">
              <p className="small-note">지금은 계정 이메일/비밀번호 기반 로그인만 지원합니다.</p>
              <p className="small-note">공용 연락은 로그인 이메일과 분리해서 `MyPage`에서 따로 설정할 수 있습니다.</p>
            </div>

            {message ? <p className="inline-message">{message}</p> : null}
          </div>
        </div>
      </article>
    </section>
  );
}

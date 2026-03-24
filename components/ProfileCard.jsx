"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function submitJson(url, body) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

function maskEmail(value) {
  const email = String(value ?? "").trim();
  const [localPart, domain = ""] = email.split("@");
  if (!localPart || !domain) return email;

  if (localPart.length <= 2) {
    return `${localPart.slice(0, 1)}*@${domain}`;
  }

  return `${localPart.slice(0, 2)}${"*".repeat(Math.max(2, localPart.length - 2))}@${domain}`;
}

export function ProfileCard({ session }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    email: session.email,
    displayName: session.displayName,
    publicContactEmail: session.publicContactEmail ?? "",
    isContactEmailPublic: session.isContactEmailPublic === true
  });
  const [editing, setEditing] = useState({
    email: false,
    displayName: false,
    publicContactEmail: false
  });
  const hasChanges =
    settingsForm.email !== session.email ||
    settingsForm.displayName !== session.displayName ||
    settingsForm.publicContactEmail !== (session.publicContactEmail ?? "") ||
    settingsForm.isContactEmailPublic !== (session.isContactEmailPublic === true);

  function submitSettings(event) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      const response = await submitJson("/api/session", settingsForm);
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error ?? "프로필 저장에 실패했습니다.");
        return;
      }

      setSettingsForm({
        email: payload.profile.email,
        displayName: payload.profile.displayName,
        publicContactEmail: payload.profile.publicContactEmail ?? "",
        isContactEmailPublic: payload.profile.isContactEmailPublic === true
      });
      setEditing({
        email: false,
        displayName: false,
        publicContactEmail: false
      });
      setMessage("프로필 설정을 저장했습니다.");
      router.refresh();
    });
  }

  function logout() {
    setMessage("");

    startTransition(async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST"
      });
      if (!response.ok) {
        setMessage("로그아웃에 실패했습니다.");
        return;
      }

      router.push("/login");
      router.refresh();
    });
  }

  function toggleEditing(field) {
    setEditing((current) => ({ ...current, [field]: !current[field] }));
  }

  return (
    <section className="card profile-card">
      <div className="section-head">
        <span className="eyebrow">Profile</span>
        <h2>내 프로필</h2>
        <p>닉네임은 공용 화면의 표시 이름으로 쓰고, 로그인 이메일은 계정 정보로만 관리합니다. 공개 연락은 별도 이메일로 분리했습니다.</p>
      </div>
      <form className="stack-form" onSubmit={submitSettings}>
        <div className="profile-field-row">
          <div className="profile-field-row__head">
            <span>닉네임</span>
            <button className="button button--ghost profile-field-row__button" disabled={isPending} onClick={() => toggleEditing("displayName")} type="button">
              {editing.displayName ? "수정 닫기" : "변경"}
            </button>
          </div>
          <input
            value={settingsForm.displayName}
            onChange={(event) => setSettingsForm((current) => ({ ...current, displayName: event.target.value }))}
            maxLength={24}
            readOnly={!editing.displayName}
            className={!editing.displayName ? "is-locked" : ""}
          />
          <p className="small-note">공용 팀 카드와 모집 보드에는 이 닉네임이 표시됩니다.</p>
        </div>

        <div className="profile-field-row">
          <div className="profile-field-row__head">
            <span>로그인 이메일</span>
            <button className="button button--ghost profile-field-row__button" disabled={isPending} onClick={() => toggleEditing("email")} type="button">
              {editing.email ? "수정 닫기" : "변경"}
            </button>
          </div>
          <input
            value={editing.email ? settingsForm.email : maskEmail(settingsForm.email)}
            onChange={(event) => setSettingsForm((current) => ({ ...current, email: event.target.value }))}
            readOnly={!editing.email}
            className={!editing.email ? "is-locked" : ""}
            type={editing.email ? "email" : "text"}
          />
          <p className="small-note">로그인과 계정 복구에만 사용합니다. 공용 화면에는 노출하지 않습니다.</p>
        </div>

        <div className="profile-field-row">
          <div className="profile-field-row__head">
            <span>공개 연락 이메일</span>
            <button className="button button--ghost profile-field-row__button" disabled={isPending} onClick={() => toggleEditing("publicContactEmail")} type="button">
              {editing.publicContactEmail ? "수정 닫기" : "변경"}
            </button>
          </div>
          <input
            value={settingsForm.publicContactEmail}
            onChange={(event) => setSettingsForm((current) => ({ ...current, publicContactEmail: event.target.value }))}
            placeholder="연락용 이메일을 입력하세요"
            readOnly={!editing.publicContactEmail}
            className={!editing.publicContactEmail ? "is-locked" : ""}
            type="email"
          />
          <p className="small-note">공용 보드에 보여줄 연락용 이메일입니다. 로그인 이메일과 다르게 써도 됩니다.</p>
        </div>

        <label className="stack-form__checkbox">
          <input
            checked={settingsForm.isContactEmailPublic}
            disabled={!settingsForm.publicContactEmail}
            onChange={(event) => setSettingsForm((current) => ({ ...current, isContactEmailPublic: event.target.checked }))}
            type="checkbox"
          />
          <span>공용 화면에 공개 연락 이메일 표시</span>
        </label>
        {!settingsForm.publicContactEmail ? <p className="small-note">공개 연락 이메일을 입력하면 공개 여부를 켤 수 있습니다.</p> : null}
        <div className="button-row profile-card__actions">
          <button className="button button--ghost" disabled={isPending} onClick={logout} type="button">
            로그아웃
          </button>
          <button className="button" disabled={isPending || !hasChanges} type="submit">
            {isPending ? "저장 중..." : "변경 저장"}
          </button>
        </div>
      </form>
      {message ? <p className="inline-message">{message}</p> : null}
    </section>
  );
}

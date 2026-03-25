"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function getTurnstileApi() {
  if (typeof window === "undefined") return null;
  return window.turnstile ?? null;
}

export function TurnstileWidget({ onTokenChange, resetKey = 0, siteKey = "" }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!siteKey) {
      onTokenChange("");
    }
  }, [onTokenChange, siteKey]);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current) {
      return undefined;
    }

    const turnstile = getTurnstileApi();
    if (!turnstile || widgetIdRef.current !== null) {
      return undefined;
    }

    widgetIdRef.current = turnstile.render(containerRef.current, {
      sitekey: siteKey,
      appearance: "interaction-only",
      size: "flexible",
      theme: "light",
      callback(token) {
        setError("");
        onTokenChange(token);
      },
      "expired-callback"() {
        onTokenChange("");
      },
      "error-callback"() {
        onTokenChange("");
        setError("보안 확인을 다시 시도해 주세요.");
      }
    });

    return () => {
      if (widgetIdRef.current === null) return;
      try {
        turnstile.remove(widgetIdRef.current);
      } catch {
        // Ignore widget cleanup failures; a fresh render on the next mount is enough.
      }
      widgetIdRef.current = null;
    };
  }, [onTokenChange, scriptReady, siteKey]);

  useEffect(() => {
    if (!siteKey) return;

    const turnstile = getTurnstileApi();
    if (!turnstile || widgetIdRef.current === null) return;

    setError("");
    onTokenChange("");
    turnstile.reset(widgetIdRef.current);
  }, [onTokenChange, resetKey, siteKey]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="turnstile-field">
      <Script onReady={() => setScriptReady(true)} src={TURNSTILE_SCRIPT_SRC} strategy="afterInteractive" />
      <div ref={containerRef} />
      <p className="small-note">보안 확인이 끝나면 제출할 수 있습니다.</p>
      {error ? <p className="inline-message">{error}</p> : null}
    </div>
  );
}

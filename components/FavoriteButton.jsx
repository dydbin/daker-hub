"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function FavoriteButton({ hackathonSlug, active, variant = "ghost" }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(active);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggleFavorite() {
    const nextActive = !isActive;
    setMessage("");
    setIsActive(nextActive);

    startTransition(async () => {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ hackathonSlug })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setIsActive(!nextActive);
        setMessage(payload.error ?? "찜 저장에 실패했습니다.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="stack-list stack-list--tight">
      <button
        className={`button favorite-button ${variant === "ghost" ? "button--ghost" : ""} ${variant === "soft" ? "button--soft" : ""} ${isActive ? "is-active" : ""}`}
        type="button"
        onClick={toggleFavorite}
        disabled={isPending}
      >
        {isActive ? "♥ 찜됨" : "♡ 찜하기"}
      </button>
      {message ? <p className="inline-message">{message}</p> : null}
    </div>
  );
}

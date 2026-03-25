"use client";

import { useRouter } from "next/navigation";

export function ClickableCard({ href, className = "", children, label }) {
  const router = useRouter();

  function navigate(event) {
    if (event.target.closest("a, button, input, textarea, select, label")) return;
    router.push(href);
  }

  function onKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    router.push(href);
  }

  return (
    <article className={className} onClick={navigate} onKeyDown={onKeyDown} role="link" tabIndex={0} aria-label={label}>
      {children}
    </article>
  );
}

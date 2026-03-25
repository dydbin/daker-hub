"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

function buildHackathonsHref({ status = "all", tag = "all", scope = "all" }) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (tag !== "all") params.set("tag", tag);
  if (scope !== "all") params.set("scope", scope);
  const query = params.toString();
  return query ? `/hackathons?${query}` : "/hackathons";
}

const scopeOptions = [
  { value: "all", label: "전체" },
  { value: "favorites", label: "찜한 해커톤" },
  { value: "recruiting", label: "모집중 참가 글 있는 해커톤" }
];

const statusOptions = [
  { value: "all", label: "전체" },
  { value: "ongoing", label: "진행중" },
  { value: "upcoming", label: "예정" },
  { value: "ended", label: "종료" }
];

export function HackathonFilters({ status, tag, scope, tags, featuredTags }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tagQuery, setTagQuery] = useState(tag === "all" ? "" : tag);
  const deferredTagQuery = useDeferredValue(tagQuery);
  const normalizedQuery = deferredTagQuery.trim().toLowerCase();

  const visibleFeaturedTags = featuredTags.filter((item) => item !== tag);
  const matchingTags = normalizedQuery
    ? tags.filter((item) => item.toLowerCase().includes(normalizedQuery))
    : visibleFeaturedTags;

  function navigate(next) {
    startTransition(() => {
      router.push(buildHackathonsHref({ status, tag, scope, ...next }));
    });
  }

  return (
    <section className="card filter-card filter-card--hackathons">
      <section className="hackathon-filter-panel hackathon-filter-panel--wide">
        <div className="hackathon-filter-panel__head">
          <span className="eyebrow">Status</span>
          <h2>진행 상태</h2>
        </div>
        <div className="filter-links">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`pill ${status === option.value ? "is-active" : ""}`}
              disabled={isPending && status === option.value}
              onClick={() => navigate({ status: option.value })}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="small-note">현재 범위를 유지한 채 예정, 진행중, 종료 상태만 빠르게 좁힙니다.</p>
      </section>

      <section className="hackathon-filter-tag-panel">
        <div className="hackathon-filter-panel__head">
          <span className="eyebrow">Tags</span>
          <h2>태그 검색</h2>
        </div>
        <div className="hackathon-filter-search-row">
          <label className="filter-field">
            <span>보는 범위</span>
            <select disabled={isPending} onChange={(event) => navigate({ scope: event.target.value })} value={scope}>
              {scopeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-field filter-field--search">
            <span>검색어로 태그 찾기</span>
            <input
              onChange={(event) => setTagQuery(event.target.value)}
              placeholder="예: Vercel, Web, Handover"
              type="search"
              value={tagQuery}
            />
          </label>
        </div>

        <div className="stack-list">
          <div className="hackathon-filter-tag-group">
            <div className="hackathon-filter-tag-group__head">
              <strong>현재 선택</strong>
            </div>
            <div className="filter-links">
              <button className={`pill ${tag === "all" ? "is-active" : ""}`} onClick={() => navigate({ tag: "all" })} type="button">
                전체 태그
              </button>
              {tag !== "all" ? (
                <button className="pill is-active" onClick={() => navigate({ tag })} type="button">
                  {tag}
                </button>
              ) : null}
            </div>
          </div>

          <div className="hackathon-filter-tag-group">
            <div className="hackathon-filter-tag-group__head">
              <strong>{normalizedQuery ? "검색 결과" : "주요 태그"}</strong>
              <span>{normalizedQuery ? `${matchingTags.length}개 일치` : `${visibleFeaturedTags.length}개 빠른 선택`}</span>
            </div>
            <div className="filter-links">
              {matchingTags.length ? (
                matchingTags.map((item) => (
                  <button
                    key={item}
                    className={`pill ${tag === item ? "is-active" : ""}`}
                    onClick={() => navigate({ tag: item })}
                    type="button"
                  >
                    {item}
                  </button>
                ))
              ) : (
                <span className="small-note">검색어와 맞는 태그가 없습니다.</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

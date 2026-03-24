"use client";

import { useEffect, useRef, useState } from "react";

function flattenGroups(groups) {
  return groups.flatMap((group) => group.items ?? []);
}

function findGroupForSection(groups, sectionId) {
  return groups.find((group) => (group.items ?? []).some((item) => item.id === sectionId))?.id ?? null;
}

export function DetailSidebar({ groups }) {
  const sections = flattenGroups(groups);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [openGroupIds, setOpenGroupIds] = useState(() => groups.filter((group) => group.defaultOpen !== false).map((group) => group.id));
  const panelRef = useRef(null);
  const linkRefs = useRef({});

  useEffect(() => {
    const targets = sections
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    if (!targets.length) return undefined;

    let frame = 0;
    const sync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        let nextId = targets[0].id;
        targets.forEach((node) => {
          if (node.getBoundingClientRect().top <= 180) {
            nextId = node.id;
          }
        });
        setActiveId(nextId);
      });
    };

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sections]);

  useEffect(() => {
    const activeGroupId = findGroupForSection(groups, activeId);
    if (!activeGroupId) return;

    setOpenGroupIds((current) => (current.includes(activeGroupId) ? current : [...current, activeGroupId]));
  }, [activeId, groups]);

  useEffect(() => {
    const panelNode = panelRef.current;
    const activeNode = linkRefs.current[activeId];
    if (!panelNode || !activeNode) return;

    const panelTop = panelNode.scrollTop;
    const panelBottom = panelTop + panelNode.clientHeight;
    const itemTop = activeNode.offsetTop;
    const itemBottom = itemTop + activeNode.offsetHeight;
    const padding = 12;

    if (itemTop < panelTop + padding) {
      panelNode.scrollTo({
        top: Math.max(itemTop - padding, 0),
        behavior: "smooth"
      });
      return;
    }

    if (itemBottom > panelBottom - padding) {
      panelNode.scrollTo({
        top: itemBottom - panelNode.clientHeight + padding,
        behavior: "smooth"
      });
    }
  }, [activeId]);

  return (
    <aside className="detail-sidebar">
      <div className="card detail-sidebar__panel" ref={panelRef}>
        <div className="detail-sidebar__head">
          <span className="eyebrow">Quick Move</span>
          <h2>상세 이동</h2>
        </div>
        <div className="detail-sidebar__groups">
          {groups.map((group) => {
            const isOpen = openGroupIds.includes(group.id);
            return (
              <section className="detail-sidebar__group" key={group.id}>
                <button
                  className="detail-sidebar__group-toggle"
                  onClick={() =>
                    setOpenGroupIds((current) =>
                      current.includes(group.id) ? current.filter((item) => item !== group.id) : [...current, group.id]
                    )
                  }
                  type="button"
                >
                  <span>{group.label}</span>
                  <span className="detail-sidebar__group-meta">
                    {group.badge != null ? <span className="detail-sidebar__badge">{group.badge}</span> : null}
                    <span className={`detail-sidebar__chevron ${isOpen ? "is-open" : ""}`} aria-hidden="true" />
                  </span>
                </button>
                {isOpen ? (
                  <nav className="detail-sidebar__nav" aria-label={group.label}>
                    {(group.items ?? []).map((section) => (
                      <div className="detail-sidebar__item" key={section.id}>
                        <span className={`detail-sidebar__dot ${activeId === section.id ? "is-active" : ""}`} aria-hidden="true" />
                        <a
                          className={`detail-sidebar__link ${activeId === section.id ? "is-active" : ""}`}
                          href={`#${section.id}`}
                          data-detail-link={section.id}
                          ref={(node) => {
                            if (node) {
                              linkRefs.current[section.id] = node;
                            } else {
                              delete linkRefs.current[section.id];
                            }
                          }}
                        >
                          {section.label}
                        </a>
                      </div>
                    ))}
                  </nav>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

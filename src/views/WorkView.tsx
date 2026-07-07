"use client";

import React from "react";
import { Tag } from "@/components/ds/Tag";
import { useData } from "@/lib/DataProvider";

export function WorkView() {
  const { experience } = useData();

  return (
    <div className="av-view" style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)", paddingTop: "var(--space-12)" }}>
      <header>
        <div className="av-eyebrow" style={{ marginBottom: 8 }}>
          Work
        </div>
        <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-strong)", margin: 0 }}>
          Where I&rsquo;ve worked
        </h1>
        <p style={{ fontSize: "var(--text-lg)", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 560, margin: "var(--space-4) 0 0" }}>
          A quick history of teams and problems I&rsquo;ve worked on.
        </p>
      </header>

      <div>
        {experience.map((e) => {
          const bullets = (e.description || "").split("\n").map((s) => s.trim()).filter(Boolean);
          return (
            <div
              key={e.id}
              style={{ display: "grid", gridTemplateColumns: "132px 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-subtle)" }}
            >
              <div style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-xs)", color: "var(--text-faint)", letterSpacing: "var(--ls-wide)", paddingTop: 3 }}>
                {e.period}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)", flexWrap: "wrap" }}>
                  {e.org && (
                    <>
                      <span style={{ fontSize: "var(--text-md)", fontWeight: "var(--fw-semibold)", color: "var(--text-strong)" }}>{e.org}</span>
                      <span style={{ color: "var(--text-faint)" }}>·</span>
                    </>
                  )}
                  <span style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{e.role}</span>
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.1em",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    lineHeight: "var(--lh-relaxed)",
                    color: "var(--text-muted)",
                  }}
                >
                  {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: 2 }}>
                  {e.tags.map((t) => (
                    <Tag key={t} size="sm" variant="outline">
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

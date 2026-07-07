"use client";

import React, { useState } from "react";

const SIGMA = 20;
const PEAK = 0.9;
const LIFT = 5;

function pagerBtnStyle(enabled: boolean): React.CSSProperties {
  return {
    height: 34,
    padding: "0 14px",
    border: "1px solid var(--border-strong)",
    background: "var(--surface-card)",
    color: "var(--text-body)",
    borderRadius: "var(--r-md)",
    cursor: enabled ? "pointer" : "default",
    fontFamily: "var(--font-ui)",
    fontSize: "var(--text-sm)",
    whiteSpace: "nowrap",
    opacity: enabled ? 1 : 0.4,
  };
}

/**
 * Dots below a threshold (with a macOS-dock-style hover: each dot scales by
 * its own pixel distance to the cursor, so the "wave" travels smoothly
 * across dots and the gaps between them). Falls back to a compact
 * "<- Prev / Page X of Y / Next ->" pager beyond the threshold, with an
 * editable page-number field.
 */
export function PaginationDock({
  page,
  totalPages,
  onChange,
  dotThreshold = 10,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  dotThreshold?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (totalPages <= 1) return null;

  if (totalPages <= dotThreshold) {
    const applyDock = (container: HTMLDivElement, clientX: number) => {
      container.querySelectorAll("button").forEach((b) => {
        const r = b.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const mag = Math.exp(-0.5 * Math.pow((clientX - cx) / SIGMA, 2));
        (b as HTMLElement).style.transform = `translateY(${(-LIFT * mag).toFixed(2)}px) scale(${(1 + PEAK * mag).toFixed(3)})`;
      });
    };
    const resetDock = (container: HTMLDivElement) => {
      container.querySelectorAll("button").forEach((b) => {
        (b as HTMLElement).style.transform = "translateY(0) scale(1)";
      });
    };

    return (
      <div
        onMouseMove={(e) => applyDock(e.currentTarget, e.clientX)}
        onMouseLeave={(e) => resetDock(e.currentTarget)}
        onClick={(e) => {
          const btns = Array.from(e.currentTarget.querySelectorAll("button"));
          if (!btns.length) return;
          let best = 0;
          let bestD = Infinity;
          btns.forEach((b, i) => {
            const r = b.getBoundingClientRect();
            const d = Math.abs(e.clientX - (r.left + r.width / 2));
            if (d < bestD) {
              bestD = d;
              best = i;
            }
          });
          onChange(best);
        }}
        style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, padding: "16px 0 12px", cursor: "pointer" }}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            style={{
              width: 8,
              height: 8,
              padding: 0,
              border: "none",
              borderRadius: 999,
              cursor: "pointer",
              background: i === page ? "var(--highlight)" : "var(--border-strong)",
              transform: "translateY(0) scale(1)",
              transition: "transform .16s cubic-bezier(0.34,1.4,0.64,1), background-color .15s ease",
              transformOrigin: "center bottom",
              flex: "none",
            }}
          />
        ))}
      </div>
    );
  }

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;
  const commit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n)) onChange(Math.max(0, Math.min(totalPages - 1, n - 1)));
    setEditing(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-4)", paddingTop: "var(--space-2)" }}>
      <button type="button" onClick={() => canPrev && onChange(page - 1)} style={pagerBtnStyle(canPrev)}>
        ← Prev
      </button>
      <span style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-sm)", color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 6 }}>
        Page
        <input
          value={editing ? draft : String(page + 1)}
          onFocus={(e) => {
            setEditing(true);
            setDraft(String(page + 1));
            e.target.select();
          }}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            else if (e.key === "Escape") setEditing(false);
          }}
          style={{
            width: "3ch",
            textAlign: "center",
            fontFamily: "var(--font-code)",
            fontSize: "var(--text-sm)",
            color: "var(--text-strong)",
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--r-sm)",
            padding: "2px 4px",
            outline: "none",
          }}
        />
        of {totalPages}
      </span>
      <button type="button" onClick={() => canNext && onChange(page + 1)} style={pagerBtnStyle(canNext)}>
        Next →
      </button>
    </div>
  );
}

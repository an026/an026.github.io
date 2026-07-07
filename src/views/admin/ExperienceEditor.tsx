"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ds/Button";
import * as api from "@/lib/data";
import { useData } from "@/lib/DataProvider";
import type { Experience } from "@/lib/types";
import { fieldWrap, grid2, smallInput, textareaBase } from "./formStyles";

function listify(s: string, sep: RegExp | string): string[] {
  return (s || "")
    .split(sep)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function ExperienceEditor({ item, onCancel, onSaved }: { item: Experience | null; onCancel: () => void; onSaved: () => void }) {
  const { experience } = useData();
  const isNew = !item;
  const formRef = useRef<HTMLDivElement | null>(null);
  const [saving, setSaving] = useState(false);

  const readForm = (name: string): string => {
    const el = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
    return el ? el.value : "";
  };

  const save = async () => {
    const role = readForm("role").trim();
    if (!role) return;
    setSaving(true);
    try {
      const nextSortIndex = isNew ? Math.max(0, ...experience.map((e) => e.sort_index)) + 1 : item!.sort_index;
      await api.upsertExperience(isNew ? null : item!.id, {
        period: readForm("period").trim(),
        role,
        org: readForm("org").trim(),
        description: readForm("description").trim(),
        tags: listify(readForm("tags"), ","),
        sort_index: nextSortIndex,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="av-view" style={{ paddingTop: "var(--space-8)", maxWidth: 760 }}>
      <button
        onClick={onCancel}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-6)" }}
      >
        ← Back to dashboard
      </button>
      <h1 style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-2xl)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-strong)", margin: "0 0 var(--space-6)" }}>
        {isNew ? "New" : "Edit"} experience
      </h1>

      <div ref={formRef} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div style={grid2}>
          <label style={fieldWrap}>
            <span className="av-eyebrow">Role</span>
            <input name="role" defaultValue={item?.role} style={smallInput} />
          </label>
          <label style={fieldWrap}>
            <span className="av-eyebrow">Organization</span>
            <input name="org" defaultValue={item?.org} style={smallInput} />
          </label>
        </div>
        <label style={fieldWrap}>
          <span className="av-eyebrow">Period</span>
          <input name="period" defaultValue={item?.period} placeholder="2023 — Now" style={smallInput} />
        </label>
        <label style={fieldWrap}>
          <span className="av-eyebrow">Bullets (one per line)</span>
          <textarea name="description" defaultValue={item?.description} style={{ ...textareaBase, minHeight: 100 }} />
        </label>
        <label style={fieldWrap}>
          <span className="av-eyebrow">Tags (comma separated)</span>
          <input name="tags" defaultValue={item?.tags.join(", ")} placeholder="Go, Kafka, Postgres" style={smallInput} />
        </label>

        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
          <Button variant="primary" onClick={save} disabled={saving}>
            Save experience
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

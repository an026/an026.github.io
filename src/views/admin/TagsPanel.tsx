"use client";

import React, { useRef } from "react";
import * as api from "@/lib/data";
import { useData } from "@/lib/DataProvider";

function Chip({ tag, onRemove }: { tag: string; onRemove: () => void }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 8px 6px 12px", borderRadius: "var(--r-sm)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", fontSize: "var(--text-sm)", color: "var(--text-body)" }}>
      {tag}
      <button
        type="button"
        onClick={onRemove}
        title="Remove"
        style={{ width: 18, height: 18, border: "none", background: "none", color: "var(--text-faint)", cursor: "pointer", fontSize: 12, lineHeight: 1, padding: 0 }}
      >
        ✕
      </button>
    </span>
  );
}

export function TagsPanel() {
  const { topics, categories, refetchTopics, refetchCategories } = useData();
  const topicRef = useRef<HTMLInputElement | null>(null);
  const catRef = useRef<HTMLInputElement | null>(null);

  const addTopic = async () => {
    const v = (topicRef.current?.value || "").trim();
    if (!v) return;
    if (!topics.includes(v)) {
      await api.addTopic(v);
      await refetchTopics();
    }
    if (topicRef.current) topicRef.current.value = "";
  };
  const removeTopic = async (name: string) => {
    if (!window.confirm(`Remove tag "${name}" from the topic list? Existing notes keep it until re-saved.`)) return;
    await api.removeTopic(name);
    await refetchTopics();
  };
  const addCat = async () => {
    const v = (catRef.current?.value || "").trim();
    if (!v) return;
    if (!categories.includes(v)) {
      await api.addCategory(v);
      await refetchCategories();
    }
    if (catRef.current) catRef.current.value = "";
  };
  const removeCat = async (name: string) => {
    if (!window.confirm(`Remove category "${name}" from the list? Existing projects keep it until re-saved.`)) return;
    await api.removeCategory(name);
    await refetchCategories();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-8)" }}>
      <div>
        <div className="av-eyebrow" style={{ marginBottom: 10 }}>
          Note topics
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "var(--space-4)" }}>
          {topics.map((t) => (
            <Chip key={t} tag={t} onRemove={() => removeTopic(t)} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, maxWidth: 320 }}>
          <input
            ref={topicRef}
            placeholder="Add a topic…"
            style={{ flex: 1, height: 36, padding: "0 12px", fontFamily: "var(--font-code)", fontSize: "var(--text-sm)", background: "var(--surface-card)", color: "var(--text-strong)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", outline: "none", minWidth: 0 }}
          />
          <button type="button" onClick={addTopic} style={{ height: 36, padding: "0 14px", background: "var(--accent-600)", color: "var(--text-on-accent)", border: "none", borderRadius: "var(--r-md)", cursor: "pointer", fontSize: "var(--text-sm)" }}>
            Add
          </button>
        </div>
      </div>
      <div>
        <div className="av-eyebrow" style={{ marginBottom: 10 }}>
          Project categories
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "var(--space-4)" }}>
          {categories.map((c) => (
            <Chip key={c} tag={c} onRemove={() => removeCat(c)} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, maxWidth: 320 }}>
          <input
            ref={catRef}
            placeholder="Add a category…"
            style={{ flex: 1, height: 36, padding: "0 12px", fontFamily: "var(--font-code)", fontSize: "var(--text-sm)", background: "var(--surface-card)", color: "var(--text-strong)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", outline: "none", minWidth: 0 }}
          />
          <button type="button" onClick={addCat} style={{ height: 36, padding: "0 14px", background: "var(--accent-600)", color: "var(--text-on-accent)", border: "none", borderRadius: "var(--r-md)", cursor: "pointer", fontSize: "var(--text-sm)" }}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

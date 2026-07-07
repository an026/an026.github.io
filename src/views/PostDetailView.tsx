"use client";

import React, { useEffect, useRef, useState } from "react";
import { Tag } from "@/components/ds/Tag";
import { Button } from "@/components/ds/Button";
import { useData } from "@/lib/DataProvider";
import { renderMarkdown } from "@/lib/markdown";
import * as api from "@/lib/data";
import type { Comment } from "@/lib/types";

export function PostDetailView({ slug }: { slug: string }) {
  const { posts } = useData();
  const post = posts.find((p) => p.slug === slug);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const draftRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingComments(true);
    api
      .fetchComments(slug)
      .then((c) => {
        if (!cancelled) setComments(c);
      })
      .finally(() => {
        if (!cancelled) setLoadingComments(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!post) {
    return (
      <div className="av-view" style={{ paddingTop: "var(--space-12)" }}>
        <p style={{ color: "var(--text-faint)" }}>Note not found.</p>
        <a href="#/writing" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
          ← All writing
        </a>
      </div>
    );
  }

  const submitComment = async () => {
    const text = (draftRef.current?.value || "").trim();
    if (!text) return;
    const name = (nameRef.current?.value || "").trim() || "anonymous";
    const created = await api.postComment(post.slug, name, text);
    setComments((prev) => [...prev, created]);
    if (draftRef.current) draftRef.current.value = "";
    if (nameRef.current) nameRef.current.value = "";
  };

  return (
    <div
      className="av-view"
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", paddingTop: "var(--space-8)", maxWidth: "var(--content-max)", margin: "0 auto" }}
    >
      <a
        href="#/writing"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: "var(--text-muted)", textDecoration: "none", width: "fit-content" }}
      >
        ← All writing
      </a>
      <header>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Tag variant="accent" size="sm">
            {post.topic}
          </Tag>
          <span style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>
            {post.date} · {post.reading_time} read
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-strong)", margin: 0 }}>
          {post.title}
        </h1>
      </header>

      <div>{renderMarkdown(post.body)}</div>

      <div style={{ height: 1, background: "var(--border-subtle)" }} />

      <section>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "var(--space-5)" }}>
          Comments{" "}
          <span style={{ color: "var(--text-faint)", fontFamily: "var(--font-code)", fontSize: "var(--text-md)" }}>
            ({loadingComments ? "…" : comments.length})
          </span>
        </h2>
        <div style={{ display: "flex", gap: 12, marginBottom: "var(--space-8)" }}>
          <div
            style={{
              width: 34,
              height: 34,
              flex: "none",
              borderRadius: 999,
              background: "var(--highlight-soft)",
              color: "var(--highlight-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-code)",
              fontSize: "var(--text-sm)",
            }}
          >
            Y
          </div>
          <div style={{ flex: 1 }}>
            <input
              ref={nameRef}
              placeholder="Your name"
              maxLength={40}
              style={{
                width: "100%",
                height: 38,
                fontFamily: "var(--font-code)",
                fontSize: "var(--text-sm)",
                color: "var(--text-strong)",
                background: "var(--surface-card)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--r-md)",
                padding: "0 14px",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 8,
              }}
            />
            <textarea
              ref={draftRef}
              placeholder="Add a comment…"
              style={{
                width: "100%",
                minHeight: 82,
                resize: "vertical",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
                color: "var(--text-strong)",
                background: "var(--surface-card)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--r-md)",
                padding: "12px 14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <Button variant="primary" size="sm" onClick={submitComment}>
                Post comment
              </Button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {comments.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  flex: "none",
                  borderRadius: 999,
                  background: "var(--accent-soft)",
                  color: "var(--text-strong)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-code)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {(c.name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "nowrap" }}>
                  <span style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-sm)", color: "var(--text-strong)", fontWeight: 500 }}>{c.name}</span>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                    {new Date(c.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.65, color: "var(--text-body)", margin: "4px 0 0" }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

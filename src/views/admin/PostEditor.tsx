"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ds/Button";
import * as api from "@/lib/data";
import { useData } from "@/lib/DataProvider";
import type { Post } from "@/lib/types";
import { buildImageToken, insertAtCursor, parseImages, removeImageBlock, reorderImageBlock, setImageField } from "@/lib/postImages";
import { fieldWrap, grid3, smallInput, textInput, textareaBase } from "./formStyles";

function slugify(t: string): string {
  return (
    (t || "")
      .toLowerCase()
      .trim()
      .replace(/[^\w]+/g, "-")
      .replace(/^-+|-+$/g, "") || "post-" + Date.now()
  );
}

const toolbarBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-card)",
  color: "var(--text-strong)",
  borderRadius: "var(--r-sm)",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
};

export function PostEditor({ post, onCancel, onSaved }: { post: Post | null; onCancel: () => void; onSaved: () => void }) {
  const { topics, refetchTopics } = useData();
  const isNew = !post;
  const formRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const pickImageRef = useRef<HTMLInputElement | null>(null);
  const replacePickRef = useRef<HTMLInputElement | null>(null);
  const newTopicRef = useRef<HTMLInputElement | null>(null);
  const replaceOrderRef = useRef<number | null>(null);
  const dragOrderRef = useRef<number | null>(null);

  const [topic, setTopic] = useState(post?.topic || topics[0] || "Notes");
  const [addingTopic, setAddingTopic] = useState(false);
  const [bodyDraft, setBodyDraft] = useState(post?.body || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const readForm = (name: string): string => {
    const el = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
    return el ? el.value : "";
  };

  const wrapSel = (before: string, after: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const s = el.selectionStart,
      e = el.selectionEnd,
      v = bodyDraft;
    const sel = v.slice(s, e) || "text";
    const next = v.slice(0, s) + before + sel + after + v.slice(e);
    setBodyDraft(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = s + before.length;
      el.selectionEnd = s + before.length + sel.length;
    });
  };
  const linePrefix = (prefix: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const s = el.selectionStart,
      v = bodyDraft;
    const ls = v.lastIndexOf("\n", s - 1) + 1;
    const next = v.slice(0, ls) + prefix + v.slice(ls);
    setBodyDraft(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = s + prefix.length;
    });
  };

  const insertImageFromFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await api.uploadMedia(file, "post-images");
      setBodyDraft((prev) => insertAtCursor(prev, bodyRef.current?.selectionStart ?? prev.length, buildImageToken("", url, "")));
    } finally {
      setUploading(false);
    }
  };

  const onBodyPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf("image/") === 0) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) insertImageFromFile(file);
        return;
      }
    }
  };
  const onBodyDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    const files = e.dataTransfer?.files;
    if (files && files.length && files[0].type.indexOf("image/") === 0) {
      e.preventDefault();
      insertImageFromFile(files[0]);
    }
  };

  const images = parseImages(bodyDraft);

  const confirmNewTopic = async () => {
    const v = (newTopicRef.current?.value || "").trim();
    if (!v) {
      setAddingTopic(false);
      return;
    }
    if (!topics.includes(v)) {
      await api.addTopic(v);
      await refetchTopics();
    }
    setTopic(v);
    setAddingTopic(false);
  };

  const save = async () => {
    const title = readForm("title").trim();
    if (!title) return;
    setSaving(true);
    try {
      const finalTopic = topic.trim() || topics[0] || "Notes";
      if (!topics.includes(finalTopic)) {
        await api.addTopic(finalTopic);
        await refetchTopics();
      }
      const slug = isNew ? slugify(title) : post!.slug;
      await api.upsertPost(isNew ? null : post!.slug, {
        title,
        topic: finalTopic,
        date: readForm("date").trim() || "Draft",
        reading_time: readForm("readingTime").trim() || "1 min",
        excerpt: readForm("excerpt").trim(),
        body: bodyDraft,
        slug,
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
        {isNew ? "New" : "Edit"} post
      </h1>

      <div ref={formRef} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <label style={fieldWrap}>
          <span className="av-eyebrow">Title</span>
          <input name="title" defaultValue={post?.title} style={textInput} />
        </label>

        <div style={grid3}>
          <div style={fieldWrap}>
            <span className="av-eyebrow">Topic</span>
            {!addingTopic ? (
              <select
                value={topic}
                onChange={(e) => {
                  if (e.target.value === "__new__") setAddingTopic(true);
                  else setTopic(e.target.value);
                }}
                style={smallInput}
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="__new__">+ New tag…</option>
              </select>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <input ref={newTopicRef} placeholder="New topic" autoFocus style={{ ...smallInput, flex: 1, minWidth: 0, borderColor: "var(--highlight)" }} />
                <button type="button" onClick={confirmNewTopic} style={{ height: 38, padding: "0 12px", background: "var(--accent-600)", color: "var(--text-on-accent)", border: "none", borderRadius: "var(--r-md)", cursor: "pointer", fontSize: "var(--text-sm)" }}>
                  Add
                </button>
                <button type="button" onClick={() => setAddingTopic(false)} style={{ height: 38, padding: "0 10px", background: "var(--surface-card)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)", borderRadius: "var(--r-md)", cursor: "pointer", fontSize: "var(--text-sm)" }}>
                  ✕
                </button>
              </div>
            )}
          </div>
          <label style={fieldWrap}>
            <span className="av-eyebrow">Date</span>
            <input name="date" defaultValue={post?.date} placeholder="Mar 2026" style={smallInput} />
          </label>
          <label style={fieldWrap}>
            <span className="av-eyebrow">Reading time</span>
            <input name="readingTime" defaultValue={post?.reading_time} placeholder="6 min" style={smallInput} />
          </label>
        </div>

        <label style={fieldWrap}>
          <span className="av-eyebrow">Excerpt</span>
          <textarea name="excerpt" defaultValue={post?.excerpt} style={textareaBase} />
        </label>

        <div>
          <span className="av-eyebrow" style={{ display: "block", marginBottom: 6 }}>
            Body
          </span>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            <button type="button" onClick={() => wrapSel("**", "**")} title="Bold" style={{ ...toolbarBtn, fontWeight: 700 }}>
              B
            </button>
            <button type="button" onClick={() => wrapSel("*", "*")} title="Italic" style={{ ...toolbarBtn, fontStyle: "italic" }}>
              I
            </button>
            <button type="button" onClick={() => wrapSel("`", "`")} title="Code" style={{ ...toolbarBtn, fontFamily: "var(--font-code)", fontSize: "var(--text-sm)" }}>
              {"</>"}
            </button>
            <button type="button" onClick={() => linePrefix("## ")} title="Heading" style={{ ...toolbarBtn, fontWeight: 700, fontSize: "var(--text-sm)" }}>
              H2
            </button>
            <button type="button" onClick={() => linePrefix("> ")} title="Quote" style={{ ...toolbarBtn, fontSize: "var(--text-md)" }}>
              &quot;
            </button>
            <button type="button" onClick={() => linePrefix("- ")} title="List" style={{ ...toolbarBtn, fontSize: "var(--text-md)" }}>
              •
            </button>
            <button type="button" onClick={() => pickImageRef.current?.click()} title="Insert image" style={{ ...toolbarBtn, fontSize: 16, lineHeight: 1 }}>
              🖼
            </button>
            {uploading && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", alignSelf: "center", marginLeft: 4 }}>Uploading…</span>}
          </div>
          <textarea
            ref={bodyRef}
            name="body"
            value={bodyDraft}
            onChange={(e) => setBodyDraft(e.target.value)}
            onPaste={onBodyPaste}
            onDrop={onBodyDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ ...textareaBase, minHeight: 280, fontFamily: "var(--font-code)", lineHeight: 1.7, width: "100%", boxSizing: "border-box" }}
          />
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", marginTop: 6 }}>
            Supports **bold**, *italic*, `code`, ## headings, &gt; quotes, - lists. Paste or drag an image into the text, or use 🖼 to browse — images
            center automatically on the page.
          </div>
          <input
            ref={pickImageRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) insertImageFromFile(file);
              e.target.value = "";
            }}
            style={{ display: "none" }}
          />
          <input
            ref={replacePickRef}
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              const order = replaceOrderRef.current;
              if (file && order != null) {
                setUploading(true);
                try {
                  const url = await api.uploadMedia(file, "post-images");
                  setBodyDraft((prev) => setImageField(prev, order, "src", url));
                } finally {
                  setUploading(false);
                }
              }
              e.target.value = "";
            }}
            style={{ display: "none" }}
          />

          {images.length > 0 && (
            <div style={{ marginTop: "var(--space-4)" }}>
              <span className="av-eyebrow" style={{ display: "block", marginBottom: 8 }}>
                Images in this post
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {images.map((im) => (
                  <div
                    key={im.order}
                    draggable
                    onDragStart={() => {
                      dragOrderRef.current = im.order;
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const from = dragOrderRef.current;
                      if (from != null) setBodyDraft((prev) => reorderImageBlock(prev, from, im.order));
                      dragOrderRef.current = null;
                    }}
                    style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 10, border: "1px solid var(--border-subtle)", borderRadius: "var(--r-md)", background: "var(--surface-card)", cursor: "grab" }}
                  >
                    <img src={im.src} alt={im.alt} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: "var(--r-sm)", flex: "none", border: "1px solid var(--border-subtle)", background: "var(--paper-sunk)" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                      <input
                        placeholder="Alt text"
                        value={im.alt}
                        onChange={(e) => setBodyDraft((prev) => setImageField(prev, im.order, "alt", e.target.value))}
                        style={{ height: 32, padding: "0 10px", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", background: "var(--paper)", color: "var(--text-strong)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", outline: "none" }}
                      />
                      <input
                        placeholder="Caption (optional)"
                        value={im.caption}
                        onChange={(e) => setBodyDraft((prev) => setImageField(prev, im.order, "caption", e.target.value))}
                        style={{ height: 32, padding: "0 10px", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", background: "var(--paper)", color: "var(--text-strong)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", outline: "none" }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: "none" }}>
                      <button
                        type="button"
                        onClick={() => {
                          replaceOrderRef.current = im.order;
                          replacePickRef.current?.click();
                        }}
                        style={{ height: 28, padding: "0 10px", fontSize: "var(--text-xs)", background: "var(--paper)", color: "var(--text-body)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", cursor: "pointer" }}
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setBodyDraft((prev) => removeImageBlock(prev, im.order))}
                        style={{ height: 28, padding: "0 10px", fontSize: "var(--text-xs)", background: "var(--paper)", color: "var(--danger-600)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", marginTop: 8 }}>
                Drag a row to reorder — position in this list matches where the image appears on the page.
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
          <Button variant="primary" onClick={save} disabled={saving}>
            Save post
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

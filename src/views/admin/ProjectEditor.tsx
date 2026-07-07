"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ds/Button";
import * as api from "@/lib/data";
import { useData } from "@/lib/DataProvider";
import { parseYoutubeId } from "@/lib/projectMedia";
import type { Project, ProjectMediaType } from "@/lib/types";
import { fieldWrap, grid2, grid3, smallInput, textInput, textareaBase } from "./formStyles";

function slugify(t: string): string {
  return (
    (t || "")
      .toLowerCase()
      .trim()
      .replace(/[^\w]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project-" + Date.now()
  );
}
function listify(s: string, sep: RegExp | string): string[] {
  return (s || "")
    .split(sep)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function ProjectEditor({ project, onCancel, onSaved }: { project: Project | null; onCancel: () => void; onSaved: () => void }) {
  const { categories, refetchCategories, projects } = useData();
  const isNew = !project;
  const formRef = useRef<HTMLDivElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const newCategoryRef = useRef<HTMLInputElement | null>(null);

  const [category, setCategory] = useState(project?.category || categories[0] || "web");
  const [addingCategory, setAddingCategory] = useState(false);
  const [featured, setFeatured] = useState(!!project?.featured);
  const [mediaType, setMediaType] = useState<ProjectMediaType>(project?.media_type ?? null);
  const [mediaSrc, setMediaSrc] = useState<string | null>(project?.media_src ?? null);
  const [youtubeDraft, setYoutubeDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const readForm = (name: string): string => {
    const el = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
    return el ? el.value : "";
  };

  const confirmNewCategory = async () => {
    const v = (newCategoryRef.current?.value || "").trim();
    if (!v) {
      setAddingCategory(false);
      return;
    }
    if (!categories.includes(v)) {
      await api.addCategory(v);
      await refetchCategories();
    }
    setCategory(v);
    setAddingCategory(false);
  };

  const applyYoutube = () => {
    const id = parseYoutubeId(youtubeDraft);
    if (!id) return;
    setMediaType("youtube");
    setMediaSrc(id);
    setYoutubeDraft("");
  };

  const save = async () => {
    const title = readForm("title").trim();
    if (!title) return;
    setSaving(true);
    try {
      const finalCat = category.trim() || categories[0] || "web";
      if (!categories.includes(finalCat)) {
        await api.addCategory(finalCat);
        await refetchCategories();
      }
      const slug = isNew ? slugify(title) : project!.slug;
      const nextSortIndex = isNew ? Math.max(0, ...projects.map((p) => p.sort_index)) + 1 : project!.sort_index;
      await api.upsertProject(isNew ? null : project!.slug, {
        title,
        year: readForm("year").trim() || "2026",
        category: finalCat,
        featured,
        description: readForm("description").trim(),
        tags: listify(readForm("tags"), ","),
        repo: readForm("repo").trim() || "https://github.com/an026",
        demo: readForm("demo").trim() || "https://github.com/an026",
        duration: readForm("duration").trim() || "0:30",
        overview: listify(readForm("overview"), /\n\n+/),
        highlights: listify(readForm("highlights"), "\n"),
        media_type: mediaType,
        media_src: mediaSrc,
        slug,
        sort_index: nextSortIndex,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const hasMedia = !!(mediaType && mediaSrc);
  const mediaLabel = mediaType === "photo" ? "Photo" : mediaType === "youtube" ? "YouTube video" : "";

  return (
    <div className="av-view" style={{ paddingTop: "var(--space-8)", maxWidth: 760 }}>
      <button
        onClick={onCancel}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-6)" }}
      >
        ← Back to dashboard
      </button>
      <h1 style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-2xl)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-strong)", margin: "0 0 var(--space-6)" }}>
        {isNew ? "New" : "Edit"} project
      </h1>

      <div ref={formRef} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <label style={fieldWrap}>
          <span className="av-eyebrow">Title</span>
          <input name="title" defaultValue={project?.title} style={textInput} />
        </label>

        <div style={grid3}>
          <label style={fieldWrap}>
            <span className="av-eyebrow">Year</span>
            <input name="year" defaultValue={project?.year} style={smallInput} />
          </label>
          <div style={fieldWrap}>
            <span className="av-eyebrow">Category</span>
            {!addingCategory ? (
              <select
                value={category}
                onChange={(e) => {
                  if (e.target.value === "__new__") setAddingCategory(true);
                  else setCategory(e.target.value);
                }}
                style={smallInput}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="__new__">+ New category…</option>
              </select>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <input ref={newCategoryRef} placeholder="New category" autoFocus style={{ ...smallInput, flex: 1, minWidth: 0, borderColor: "var(--highlight)" }} />
                <button type="button" onClick={confirmNewCategory} style={{ height: 38, padding: "0 12px", background: "var(--accent-600)", color: "var(--text-on-accent)", border: "none", borderRadius: "var(--r-md)", cursor: "pointer", fontSize: "var(--text-sm)" }}>
                  Add
                </button>
                <button type="button" onClick={() => setAddingCategory(false)} style={{ height: 38, padding: "0 10px", background: "var(--surface-card)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)", borderRadius: "var(--r-md)", cursor: "pointer", fontSize: "var(--text-sm)" }}>
                  ✕
                </button>
              </div>
            )}
          </div>
          <label style={fieldWrap}>
            <span className="av-eyebrow">Demo duration</span>
            <input name="duration" defaultValue={project?.duration} placeholder="0:45" style={smallInput} />
          </label>
        </div>

        <label style={fieldWrap}>
          <span className="av-eyebrow">Description</span>
          <textarea name="description" defaultValue={project?.description} style={textareaBase} />
        </label>

        <div style={grid2}>
          <label style={fieldWrap}>
            <span className="av-eyebrow">GitHub URL</span>
            <input name="repo" defaultValue={project?.repo} style={smallInput} />
          </label>
          <label style={fieldWrap}>
            <span className="av-eyebrow">Demo URL</span>
            <input name="demo" defaultValue={project?.demo} style={smallInput} />
          </label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="av-eyebrow">Demo media</span>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Button
              variant={mediaType === "photo" ? "primary" : "secondary"}
              onClick={() => photoInputRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Upload photo"}
            </Button>
            {hasMedia && (
              <Button
                variant="secondary"
                onClick={() => {
                  setMediaType(null);
                  setMediaSrc(null);
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={youtubeDraft}
              onChange={(e) => setYoutubeDraft(e.target.value)}
              placeholder="Or paste a YouTube link — https://youtu.be/…"
              style={{ ...smallInput, flex: 1, fontFamily: "var(--font-body)" }}
            />
            <button type="button" onClick={applyYoutube} style={{ height: 38, padding: "0 14px", background: "var(--accent-600)", color: "var(--text-on-accent)", border: "none", borderRadius: "var(--r-md)", cursor: "pointer", fontSize: "var(--text-sm)", whiteSpace: "nowrap" }}>
              Use link
            </button>
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setUploading(true);
                try {
                  const url = await api.uploadMedia(file, "project-media");
                  setMediaType("photo");
                  setMediaSrc(url);
                } finally {
                  setUploading(false);
                }
              }
              e.target.value = "";
            }}
          />
          {hasMedia && <div style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>{mediaLabel} attached — shown in place of the demo placeholder.</div>}
        </div>

        <label style={fieldWrap}>
          <span className="av-eyebrow">Tags (comma separated)</span>
          <input name="tags" defaultValue={project?.tags.join(", ")} placeholder="Next.js, TypeScript, FastAPI" style={smallInput} />
        </label>
        <label style={fieldWrap}>
          <span className="av-eyebrow">Overview (blank line = new paragraph)</span>
          <textarea name="overview" defaultValue={project?.overview.join("\n\n")} style={{ ...textareaBase, minHeight: 120, lineHeight: 1.6 }} />
        </label>
        <label style={fieldWrap}>
          <span className="av-eyebrow">Highlights (one per line)</span>
          <textarea name="highlights" defaultValue={project?.highlights.join("\n")} style={{ ...textareaBase, minHeight: 90, lineHeight: 1.6 }} />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          <span style={{ fontSize: "var(--text-sm)", color: "var(--text-body)" }}>Feature on homepage</span>
        </label>

        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
          <Button variant="primary" onClick={save} disabled={saving}>
            Save project
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ds/Tabs";
import { Button } from "@/components/ds/Button";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/DataProvider";
import * as api from "@/lib/data";
import type { Experience, Post, Project } from "@/lib/types";
import { PostEditor } from "./PostEditor";
import { ProjectEditor } from "./ProjectEditor";
import { ExperienceEditor } from "./ExperienceEditor";
import { AboutTab } from "./AboutEditor";
import { TagsPanel } from "./TagsPanel";

type AdminTab = "posts" | "projects" | "experience" | "tags" | "about";
type Editing = { kind: "post"; item: Post | null } | { kind: "project"; item: Project | null } | { kind: "experience"; item: Experience | null } | null;

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--space-4)",
  padding: "14px 16px",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--r-lg)",
  background: "var(--surface-card)",
};
const rowBtn: React.CSSProperties = {
  height: 32,
  padding: "0 12px",
  fontFamily: "var(--font-ui)",
  fontSize: "var(--text-sm)",
  color: "var(--text-body)",
  background: "var(--paper)",
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--r-sm)",
  cursor: "pointer",
};

export function AdminDashboard() {
  const { signOut } = useAuth();
  const { posts, projects, experience, refetchPosts, refetchProjects, refetchExperience } = useData();
  const [tab, setTab] = useState<AdminTab>("posts");
  const [editing, setEditing] = useState<Editing>(null);

  if (editing?.kind === "post") {
    return <PostEditor post={editing.item} onCancel={() => setEditing(null)} onSaved={async () => { await refetchPosts(); setEditing(null); }} />;
  }
  if (editing?.kind === "project") {
    return <ProjectEditor project={editing.item} onCancel={() => setEditing(null)} onSaved={async () => { await refetchProjects(); setEditing(null); }} />;
  }
  if (editing?.kind === "experience") {
    return <ExperienceEditor item={editing.item} onCancel={() => setEditing(null)} onSaved={async () => { await refetchExperience(); setEditing(null); }} />;
  }

  const deletePost = async (slug: string) => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    await api.deletePost(slug);
    await refetchPosts();
  };
  const deleteProject = async (slug: string) => {
    if (!window.confirm("Delete this project? This can't be undone.")) return;
    await api.deleteProject(slug);
    await refetchProjects();
  };
  const deleteExperience = async (id: string) => {
    if (!window.confirm("Delete this experience entry? This can't be undone.")) return;
    await api.deleteExperience(id);
    await refetchExperience();
  };

  return (
    <div className="av-view" style={{ paddingTop: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <div className="av-eyebrow" style={{ marginBottom: 6 }}>
            Admin
          </div>
          <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-strong)", margin: 0 }}>
            Content dashboard
          </h1>
        </div>
        <button
          onClick={() => signOut()}
          style={{ height: 36, padding: "0 14px", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: "var(--text-body)", background: "var(--surface-card)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-md)", cursor: "pointer" }}
        >
          Log out
        </button>
      </header>

      <Tabs
        variant="pill"
        value={tab}
        onChange={(v) => setTab(v as AdminTab)}
        items={[
          { label: "Posts", value: "posts" },
          { label: "Projects", value: "projects" },
          { label: "Work", value: "experience" },
          { label: "Tags", value: "tags" },
          { label: "About", value: "about" },
        ]}
      />

      {tab === "tags" && <TagsPanel />}

      {tab === "posts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div>
            <Button variant="primary" onClick={() => setEditing({ kind: "post", item: null })}>
              + New post
            </Button>
          </div>
          {posts.map((p) => (
            <div key={p.slug} style={rowStyle}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-sm)", color: "var(--text-faint)" }}>
                  {p.date} · {p.topic}
                </div>
                <div style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flex: "none" }}>
                <button onClick={() => setEditing({ kind: "post", item: p })} style={rowBtn}>
                  Edit
                </button>
                <button onClick={() => deletePost(p.slug)} style={{ ...rowBtn, color: "var(--danger-600)" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "projects" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div>
            <Button variant="primary" onClick={() => setEditing({ kind: "project", item: null })}>
              + New project
            </Button>
          </div>
          {projects.map((p) => (
            <div key={p.slug} style={rowStyle}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-sm)", color: "var(--text-faint)" }}>
                  {p.year} · {p.category}
                  {p.featured ? " · featured" : ""}
                </div>
                <div style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flex: "none" }}>
                <button onClick={() => setEditing({ kind: "project", item: p })} style={rowBtn}>
                  Edit
                </button>
                <button onClick={() => deleteProject(p.slug)} style={{ ...rowBtn, color: "var(--danger-600)" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "experience" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div>
            <Button variant="primary" onClick={() => setEditing({ kind: "experience", item: null })}>
              + New experience
            </Button>
          </div>
          {experience.map((x) => (
            <div key={x.id} style={rowStyle}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-sm)", color: "var(--text-faint)" }}>{x.period}</div>
                <div style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {x.role} · {x.org}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flex: "none" }}>
                <button onClick={() => setEditing({ kind: "experience", item: x })} style={rowBtn}>
                  Edit
                </button>
                <button onClick={() => deleteExperience(x.id)} style={{ ...rowBtn, color: "var(--danger-600)" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "about" && <AboutTab />}
    </div>
  );
}

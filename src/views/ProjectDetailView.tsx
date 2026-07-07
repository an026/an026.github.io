"use client";

import React from "react";
import { Button } from "@/components/ds/Button";
import { Card } from "@/components/ds/Card";
import { ArrowUpRightIcon, GithubIcon, PlayIcon } from "@/components/icons";
import { useData } from "@/lib/DataProvider";
import { youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/projectMedia";

export function ProjectDetailView({ slug }: { slug: string }) {
  const { projects } = useData();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="av-view" style={{ paddingTop: "var(--space-12)" }}>
        <p style={{ color: "var(--text-faint)" }}>Project not found.</p>
        <a href="#/projects" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
          ← All projects
        </a>
      </div>
    );
  }

  return (
    <div className="av-view" style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)", paddingTop: "var(--space-8)" }}>
      <a
        href="#/projects"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: "var(--text-muted)", textDecoration: "none", width: "fit-content" }}
      >
        ← All projects
      </a>

      <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--space-6)", flexWrap: "wrap" }}>
        <div>
          <div className="av-eyebrow" style={{ marginBottom: 8 }}>
            Project · {project.year}
          </div>
          <h1 style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-strong)", margin: 0 }}>
            {project.title}
          </h1>
          <p style={{ fontSize: "var(--text-lg)", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 560, margin: "var(--space-3) 0 0" }}>
            {project.description}
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Button variant="primary" as="a" href={project.demo} target="_blank" rel="noopener" trailingIcon={<ArrowUpRightIcon size={15} />}>
            Live demo
          </Button>
          <Button variant="secondary" as="a" href={project.repo} target="_blank" rel="noopener" leadingIcon={<GithubIcon size={16} />}>
            GitHub
          </Button>
        </div>
      </header>

      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          background: "var(--bg-sunk)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--r-xl)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="av-eyebrow" style={{ position: "absolute", top: 16, left: 18, zIndex: 1 }}>
          Demo
        </span>
        {project.media_type === "photo" && project.media_src && (
          <img src={project.media_src} alt={`${project.title} demo`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {project.media_type === "youtube" && project.media_src && (
          <>
            <iframe
              title={`${project.title} demo`}
              src={youtubeEmbedUrl(project.media_src)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none" }}
            />
            <a
              href={youtubeWatchUrl(project.media_src)}
              target="_blank"
              rel="noopener"
              style={{
                position: "absolute",
                bottom: 14,
                left: 16,
                zIndex: 1,
                fontFamily: "var(--font-code)",
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                background: "var(--surface-card)",
                padding: "3px 9px",
                borderRadius: 999,
                border: "1px solid var(--border-subtle)",
                textDecoration: "none",
              }}
            >
              Watch on YouTube ↗
            </a>
          </>
        )}
        {!project.media_type && (
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: 999,
              background: "var(--highlight)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-lg)",
              cursor: "pointer",
            }}
          >
            <PlayIcon size={26} />
          </div>
        )}
        <span
          style={{
            position: "absolute",
            bottom: 14,
            right: 16,
            fontFamily: "var(--font-code)",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            background: "var(--surface-card)",
            padding: "3px 9px",
            borderRadius: 999,
            border: "1px solid var(--border-subtle)",
            zIndex: 1,
          }}
        >
          {project.duration}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-10)", alignItems: "start" }}>
        <div style={{ maxWidth: "var(--content-max)" }}>
          <div className="av-eyebrow" style={{ marginBottom: 10 }}>
            Overview
          </div>
          {project.overview.map((para, i) => (
            <p key={i} style={{ fontSize: "var(--text-md)", lineHeight: 1.75, color: "var(--text-body)", marginBottom: "var(--space-4)" }}>
              {para}
            </p>
          ))}
        </div>
        <Card variant="raised" padding="lg">
          <div className="av-eyebrow" style={{ marginBottom: 12 }}>
            Highlights
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {project.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-body)" }}>
                <span style={{ color: "var(--highlight)", fontFamily: "var(--font-code)" }}>→</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: "var(--border-subtle)", margin: "var(--space-5) 0" }} />
          <div className="av-eyebrow" style={{ marginBottom: 10 }}>
            Stack
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.tags.map((t) => (
              <span
                key={t}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  lineHeight: 1,
                  padding: "5px 8px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--paper-sunk)",
                  color: "var(--text-body)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

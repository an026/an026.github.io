import React from "react";
import { Tag } from "@/components/ds/Tag";
import { indexDisplay } from "@/lib/projectMedia";
import type { Project } from "@/lib/types";

export function ProjectPreviewCard({
  project,
  previewImage,
  imgMinWidth = 180,
  maxWidth,
  flexBasis,
}: {
  project: Project;
  previewImage: string;
  imgMinWidth?: number;
  maxWidth?: number;
  flexBasis?: number;
}) {
  return (
    <a
      href={`#/projects/${project.slug}`}
      className="av-project-preview"
      style={{ flex: flexBasis ? `1 1 ${flexBasis}px` : undefined, maxWidth }}
    >
      <img src={previewImage} alt={`${project.title} preview`} className="av-project-preview__img" style={{ width: "44%", minWidth: imgMinWidth }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", padding: "var(--space-5)", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)" }}>
          <span style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-xs)", color: "var(--text-faint)", letterSpacing: "var(--ls-wide)" }}>
            {indexDisplay(project.sort_index)}
          </span>
          <span style={{ color: "var(--text-faint)" }}>↗</span>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--fw-semibold)", color: "var(--text-strong)", letterSpacing: "var(--ls-tight)" }}>
            {project.title}
          </div>
          <span style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>{project.year}</span>
        </div>
        <p style={{ fontSize: "var(--text-sm)", lineHeight: "var(--lh-relaxed)", color: "var(--text-muted)", margin: 0 }}>{project.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "auto", paddingTop: "var(--space-2)" }}>
          {project.tags.map((t) => (
            <Tag key={t} size="sm">
              {t}
            </Tag>
          ))}
        </div>
      </div>
    </a>
  );
}

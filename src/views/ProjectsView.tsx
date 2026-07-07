"use client";

import React, { useMemo, useState } from "react";
import { Tabs } from "@/components/ds/Tabs";
import { ProjectCard } from "@/components/ds/ProjectCard";
import { SearchInput } from "@/components/SearchInput";
import { PaginationDock } from "@/components/PaginationDock";
import { ProjectPreviewCard } from "@/components/ProjectPreviewCard";
import { useSearchSortPage } from "@/hooks/useSearchSortPage";
import { useData } from "@/lib/DataProvider";
import { previewImageFor } from "@/lib/projectMedia";
import type { Project } from "@/lib/types";

const PAGE_SIZE = 6;

export function ProjectsView() {
  const { projects, categories } = useData();
  const [tab, setTab] = useState("all");

  const tabItems = useMemo(
    () => [{ label: "All", value: "all" }, ...categories.map((c) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c }))],
    [categories]
  );

  const byCategory = useMemo(() => (tab === "all" ? projects : projects.filter((p) => p.category === tab)), [projects, tab]);

  const { search, setSearch, sort, setSort, page, setPage, totalPages, pageItems, filteredCount, dotThreshold } = useSearchSortPage<Project>(
    byCategory,
    {
      searchText: (p) => [p.title, p.description, p.category, ...p.tags].filter(Boolean).join(" \n "),
      sortCompare: (a, b, dir) => {
        const ya = parseInt(a.year, 10) || 0;
        const yb = parseInt(b.year, 10) || 0;
        return dir === "newest" ? yb - ya : ya - yb;
      },
      pageSize: PAGE_SIZE,
      resetKey: tab,
    }
  );

  return (
    <div className="av-view" style={{ display: "flex", flexDirection: "column", gap: "var(--space-16)", paddingTop: "var(--space-12)" }}>
      <header>
        <div className="av-eyebrow" style={{ marginBottom: 8 }}>
          Projects
        </div>
        <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-strong)", margin: 0 }}>
          Things I&rsquo;ve built
        </h1>
        <p style={{ fontSize: "var(--text-lg)", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 560, margin: "var(--space-4) 0 0" }}>
          A selection of projects — mostly AI-powered products and full-stack web apps, usually because I wanted them to exist.
        </p>
      </header>

      <SearchInput value={search} onChange={setSearch} placeholder="Search projects — titles, tags, stack…" />

      <div style={{ marginTop: "calc(-1 * var(--space-10))", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <Tabs variant="pill" value={tab} onChange={setTab} items={tabItems} />
        <Tabs
          variant="pill"
          value={sort}
          onChange={(v) => setSort(v as "newest" | "oldest")}
          items={[
            { label: "Newest", value: "newest" },
            { label: "Oldest", value: "oldest" },
          ]}
        />
      </div>

      <div>
        {filteredCount === 0 && (
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-faint)", padding: "var(--space-6) 0", textAlign: "center" }}>
            No projects match &ldquo;{search}&rdquo;.
          </p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-4)" }}>
          {pageItems.map((p) => {
            const preview = previewImageFor(p);
            return preview ? (
              <ProjectPreviewCard key={p.slug} project={p} previewImage={preview} imgMinWidth={120} />
            ) : (
              <ProjectCard
                key={p.slug}
                index={p.sort_index}
                title={p.title}
                year={p.year}
                description={p.description}
                tags={p.tags}
                href={`#/projects/${p.slug}`}
              />
            );
          })}
        </div>
        <PaginationDock page={page} totalPages={totalPages} onChange={setPage} dotThreshold={dotThreshold} />
      </div>
    </div>
  );
}

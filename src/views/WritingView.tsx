"use client";

import React, { useMemo, useState } from "react";
import { Tabs } from "@/components/ds/Tabs";
import { BlogPostCard } from "@/components/ds/BlogPostCard";
import { SearchInput } from "@/components/SearchInput";
import { PaginationDock } from "@/components/PaginationDock";
import { useSearchSortPage } from "@/hooks/useSearchSortPage";
import { useData } from "@/lib/DataProvider";
import type { Post } from "@/lib/types";

const PAGE_SIZE = 6;

function parseDateTs(p: Post): number {
  const t = Date.parse(p.date);
  if (!isNaN(t)) return t;
  const t2 = Date.parse(p.created_at);
  return isNaN(t2) ? 0 : t2;
}

export function WritingView() {
  const { posts } = useData();
  const [tab, setTab] = useState("all");

  const topics = useMemo(() => posts.map((p) => p.topic).filter((t, i, a) => t && a.indexOf(t) === i), [posts]);
  const tabItems = useMemo(() => [{ label: "All", value: "all" }, ...topics.map((t) => ({ label: t, value: t }))], [topics]);

  const byTopic = useMemo(() => (tab === "all" ? posts : posts.filter((p) => p.topic === tab)), [posts, tab]);

  const { search, setSearch, sort, setSort, page, setPage, totalPages, pageItems, filteredCount, dotThreshold } = useSearchSortPage<Post>(
    byTopic,
    {
      searchText: (p) => [p.title, p.excerpt, p.topic, p.body].filter(Boolean).join(" \n "),
      sortCompare: (a, b, dir) => {
        const ta = parseDateTs(a);
        const tb = parseDateTs(b);
        return dir === "newest" ? tb - ta : ta - tb;
      },
      pageSize: PAGE_SIZE,
      resetKey: tab,
    }
  );

  return (
    <div className="av-view" style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)", paddingTop: "var(--space-12)" }}>
      <header>
        <div className="av-eyebrow" style={{ marginBottom: 8 }}>
          Writing
        </div>
        <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-strong)", margin: 0 }}>
          Notes
        </h1>
        <p style={{ fontSize: "var(--text-lg)", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 560, margin: "var(--space-4) 0 0" }}>
          Long-ish posts about the systems I work on and the parts that surprised me.
        </p>
      </header>

      <SearchInput value={search} onChange={setSearch} placeholder="Search notes — titles, text, captions…" />

      <div style={{ marginTop: "calc(-1 * var(--space-4))", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
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

      {filteredCount === 0 && (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-faint)", padding: "var(--space-6) 0", textAlign: "center" }}>
          No notes match &ldquo;{search}&rdquo;.
        </p>
      )}

      <div>
        {pageItems.map((post) => (
          <BlogPostCard key={post.slug} date={post.date} title={post.title} excerpt={post.excerpt} readingTime={post.reading_time} href={`#/writing/${post.slug}`} />
        ))}
      </div>

      <PaginationDock page={page} totalPages={totalPages} onChange={setPage} dotThreshold={dotThreshold} />
    </div>
  );
}

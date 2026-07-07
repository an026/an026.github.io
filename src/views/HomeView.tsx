"use client";

import React from "react";
import { Badge } from "@/components/ds/Badge";
import { Button } from "@/components/ds/Button";
import { Link } from "@/components/ds/Link";
import { ProjectCard } from "@/components/ds/ProjectCard";
import { BlogPostCard } from "@/components/ds/BlogPostCard";
import { ArrowRightIcon, MailIcon, GithubIcon, LinkedinIcon } from "@/components/icons";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useData } from "@/lib/DataProvider";
import { previewImageFor } from "@/lib/projectMedia";
import { ProjectPreviewCard } from "@/components/ProjectPreviewCard";

const PHRASES = ["fast, legible systems.", "AI-powered virtual try-on.", "interfaces people enjoy.", "tools I wish existed."];

const GITHUB_URL = "https://github.com/an026";
const LINKEDIN_URL = "https://www.linkedin.com/in/an026/";
const EMAIL = "allisonvu.swe@gmail.com";

function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
      <div>
        <div className="av-eyebrow" style={{ marginBottom: 6 }}>
          {eyebrow}
        </div>
        <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function HomeView({ navigate }: { navigate: (hash: string) => void }) {
  void navigate;
  const typedRef = useTypewriter(PHRASES);
  const { projects, posts } = useData();
  const featured = projects.filter((p) => p.featured);

  const iconLinkStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: "var(--r-md)",
    color: "var(--text-muted)",
    border: "1px solid transparent",
    textDecoration: "none",
    transition: "var(--transition-colors)",
  };

  return (
    <div className="av-view" style={{ display: "flex", flexDirection: "column", gap: "var(--space-24)" }}>
      <header style={{ paddingTop: "var(--space-16)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-12)", alignItems: "center" }}>
          <div>
            <div style={{ marginBottom: "var(--space-5)" }}>
              <Badge tone="accent" dot>
                Open to interesting problems
              </Badge>
            </div>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 60px)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.03, margin: 0 }}>
              Allison Vu
            </h1>
            <div
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "var(--text-xl)",
                color: "var(--text-muted)",
                letterSpacing: "-0.01em",
                marginTop: "var(--space-4)",
                minHeight: "1.5em",
              }}
            >
              I build <span ref={typedRef} style={{ color: "var(--text-strong)", fontWeight: 500 }} />
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: "0.55ch",
                  height: "1.02em",
                  background: "var(--highlight)",
                  marginLeft: 3,
                  borderRadius: 1,
                  transform: "translateY(0.12em)",
                  animation: "av-blink 1.05s steps(1) infinite",
                }}
              />
            </div>
            <p style={{ fontSize: "var(--text-lg)", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 520, margin: "var(--space-5) 0 0" }}>
              Software engineer building AI-powered products and full-stack web apps — and I write about the parts that surprised me.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginTop: "var(--space-8)", flexWrap: "wrap" }}>
              <Button variant="primary" as="a" href="#/projects" trailingIcon={<ArrowRightIcon size={16} />}>
                See my work
              </Button>
              <Button variant="secondary" as="a" href={`mailto:${EMAIL}`} leadingIcon={<MailIcon size={16} />}>
                Get in touch
              </Button>
              <div style={{ display: "flex", gap: 4, marginLeft: "var(--space-2)" }}>
                <a href={GITHUB_URL} target="_blank" rel="noopener" aria-label="GitHub" title="GitHub" style={iconLinkStyle}>
                  <GithubIcon size={18} />
                </a>
                <a href={`mailto:${EMAIL}`} aria-label="Email" title="Email" style={iconLinkStyle}>
                  <MailIcon size={18} />
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn" style={iconLinkStyle}>
                  <LinkedinIcon size={18} />
                </a>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 420, width: "100%", margin: "0 auto", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-sunk)" }}>
              <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--highlight)", display: "inline-block" }} />
              <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--border-strong)", display: "inline-block" }} />
              <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--border-strong)", display: "inline-block" }} />
              <span style={{ marginLeft: 8, fontFamily: "var(--font-code)", fontSize: "var(--text-xs)", color: "var(--text-faint)", letterSpacing: "0.02em" }}>
                allison.vu — zsh
              </span>
            </div>
            <div style={{ padding: "22px 20px", fontFamily: "var(--font-code)", fontSize: "var(--text-sm)", lineHeight: 1.95, color: "var(--text-body)" }}>
              <div>
                <span style={{ color: "var(--text-faint)" }}>$</span> whoami
              </div>
              <div style={{ color: "var(--text-muted)" }}>
                <span style={{ color: "var(--highlight)" }}>→</span> allison vu · software engineer
              </div>
              <div style={{ marginTop: 6 }}>
                <span style={{ color: "var(--text-faint)" }}>$</span> cat status.txt
              </div>
              <div style={{ color: "var(--text-muted)" }}>
                <span style={{ color: "var(--highlight)" }}>→</span> open to interesting problems
              </div>
              <div style={{ marginTop: 6 }}>
                <span style={{ color: "var(--text-faint)" }}>$</span>{" "}
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: "0.55ch",
                    height: "1.02em",
                    background: "var(--highlight)",
                    transform: "translateY(0.14em)",
                    borderRadius: 1,
                    animation: "av-blink 1.05s steps(1) infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section>
        <SectionHead
          eyebrow="Selected Work"
          title="Things I've built"
          action={
            <Link href="#/projects" arrow>
              All projects
            </Link>
          }
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
          {featured.map((p) => {
            const preview = previewImageFor(p);
            return preview ? (
              <ProjectPreviewCard key={p.slug} project={p} previewImage={preview} maxWidth={560} flexBasis={420} />
            ) : (
              <div key={p.slug} style={{ flex: "1 1 260px", maxWidth: 420 }}>
                <ProjectCard
                  index={p.sort_index}
                  title={p.title}
                  year={p.year}
                  description={p.description}
                  tags={p.tags}
                  href={`#/projects/${p.slug}`}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHead
          eyebrow="Writing"
          title="Recent notes"
          action={
            <Link href="#/writing" arrow>
              All writing
            </Link>
          }
        />
        <div>
          {posts.slice(0, 3).map((post) => (
            <BlogPostCard
              key={post.slug}
              date={post.date}
              title={post.title}
              excerpt={post.excerpt}
              readingTime={post.reading_time}
              href={`#/writing/${post.slug}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

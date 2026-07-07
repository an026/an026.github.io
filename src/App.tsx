"use client";

import React from "react";
import { NavBar } from "@/components/ds/NavBar";
import { GithubIcon, MailIcon, LinkedinIcon, MoonIcon, SunIcon } from "@/components/icons";
import { useTheme } from "@/hooks/useTheme";
import { useHashRouter } from "@/hooks/useHashRouter";
import { AuthProvider } from "@/lib/auth";
import { DataProvider, useData } from "@/lib/DataProvider";
import { HomeView } from "@/views/HomeView";
import { ProjectsView } from "@/views/ProjectsView";
import { ProjectDetailView } from "@/views/ProjectDetailView";
import { WorkView } from "@/views/WorkView";
import { WritingView } from "@/views/WritingView";
import { PostDetailView } from "@/views/PostDetailView";
import { AboutView } from "@/views/AboutView";
import { AdminView } from "@/views/AdminView";

const GITHUB_URL = "https://github.com/an026";
const LINKEDIN_URL = "https://www.linkedin.com/in/an026/";
const EMAIL = "allisonvu.swe@gmail.com";

function SocialIcons({ size = 18 }: { size?: number }) {
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
    <div style={{ display: "flex", gap: 4 }}>
      <a href={GITHUB_URL} target="_blank" rel="noopener" aria-label="GitHub" title="GitHub" style={iconLinkStyle}>
        <GithubIcon size={size} />
      </a>
      <a href={`mailto:${EMAIL}`} aria-label="Email" title="Email" style={iconLinkStyle}>
        <MailIcon size={size} />
      </a>
      <a href={LINKEDIN_URL} target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn" style={iconLinkStyle}>
        <LinkedinIcon size={size} />
      </a>
    </div>
  );
}

function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const { view, navigate } = useHashRouter();

  const navLinks = [
    { label: "Projects", href: "#projects", current: view.name === "projects" || view.name === "project" },
    { label: "Work", href: "#work", current: view.name === "work" },
    { label: "Writing", href: "#writing", current: view.name === "writing" || view.name === "post" },
    { label: "About", href: "#about", current: view.name === "about" },
  ];

  const navActions = (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        type="button"
        style={{
          width: 34,
          height: 34,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid var(--border-strong)",
          background: "var(--surface)",
          color: "var(--text-body)",
          borderRadius: "var(--r-md)",
          cursor: "pointer",
          padding: 0,
          transition: "var(--transition-colors)",
        }}
      >
        {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
      </button>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 34,
          padding: "0 12px",
          fontFamily: "var(--font-ui)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--text-strong)",
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--r-md)",
          textDecoration: "none",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <GithubIcon size={15} />
        <span>GitHub</span>
      </a>
    </div>
  );

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "var(--bg-page)", color: "var(--text-body)", fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "0 var(--gutter) var(--space-12)" }}>
        <NavBar brand="allison.vu" links={navLinks} actions={navActions} />

        <main>
          {view.name === "home" && <HomeView navigate={navigate} />}
          {view.name === "projects" && <ProjectsView />}
          {view.name === "project" && <ProjectDetailView slug={view.slug} />}
          {view.name === "work" && <WorkView />}
          {view.name === "writing" && <WritingView />}
          {view.name === "post" && <PostDetailView slug={view.slug} />}
          {view.name === "about" && <AboutView />}
          {view.name === "admin" && <AdminView />}
        </main>

        <footer
          style={{
            borderTop: "1px solid var(--border-subtle)",
            marginTop: "var(--space-24)",
            paddingTop: "var(--space-8)",
            paddingBottom: "var(--space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-6)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: "var(--text-sm)", color: "var(--text-faint)" }}>
            © {new Date().getFullYear()} Allison Vu · <a href="#admin" style={{ color: "var(--text-faint)" }}>Admin</a>
          </div>
          <SocialIcons />
        </footer>
      </div>
    </div>
  );
}

function LoadGate({ children }: { children: React.ReactNode }) {
  const { loading, error } = useData();
  if (error) {
    return (
      <div style={{ padding: "var(--space-16)", textAlign: "center", color: "var(--danger-600)", fontFamily: "var(--font-code)" }}>
        Couldn&rsquo;t reach the database. Check that NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set (see SETUP.md).
        <div style={{ marginTop: 8, fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>{error}</div>
      </div>
    );
  }
  if (loading) {
    return <div style={{ padding: "var(--space-16)", textAlign: "center", color: "var(--text-faint)" }}>Loading…</div>;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <LoadGate>
          <AppShell />
        </LoadGate>
      </DataProvider>
    </AuthProvider>
  );
}

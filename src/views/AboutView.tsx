"use client";

import React from "react";
import { Card } from "@/components/ds/Card";
import { Link } from "@/components/ds/Link";
import { UserPlaceholderIcon } from "@/components/icons";
import { useData } from "@/lib/DataProvider";

export function AboutView() {
  const { about } = useData();
  if (!about) return null;

  return (
    <div className="av-view" style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)", paddingTop: "var(--space-12)" }}>
      <header>
        <div className="av-eyebrow" style={{ marginBottom: 8 }}>
          About
        </div>
        <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-strong)", margin: 0 }}>
          A little about me
        </h1>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-10)", alignItems: "start" }}>
        <div style={{ maxWidth: 360 }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "3/4",
              borderRadius: 20,
              overflow: "hidden",
              background: "var(--surface-sunk)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {about.photo_url ? (
              <img src={about.photo_url} alt={about.photo_caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <UserPlaceholderIcon size={56} style={{ color: "var(--text-faint)" }} />
            )}
          </div>
          <p style={{ margin: "var(--space-3) 0 0", fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>{about.photo_caption}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", minWidth: 0 }}>
          <div style={{ maxWidth: "var(--content-max)" }}>
            <p style={{ fontSize: "var(--text-md)", lineHeight: 1.75, color: "var(--text-body)" }}>{about.bio1}</p>
            <p style={{ fontSize: "var(--text-md)", lineHeight: 1.75, color: "var(--text-body)" }}>{about.bio2}</p>
          </div>
          <Card variant="raised" padding="lg">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-8)" }}>
              <div>
                <div className="av-eyebrow" style={{ marginBottom: 4 }}>
                  Currently
                </div>
                <div style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-md)", color: "var(--text-strong)" }}>{about.currently}</div>
              </div>
              <div>
                <div className="av-eyebrow" style={{ marginBottom: 4 }}>
                  Location
                </div>
                <div style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-md)", color: "var(--text-strong)" }}>{about.location}</div>
              </div>
              <div>
                <div className="av-eyebrow" style={{ marginBottom: 4 }}>
                  Email
                </div>
                <Link href={`mailto:${about.email}`}>{about.email}</Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

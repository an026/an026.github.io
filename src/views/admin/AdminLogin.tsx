"use client";

import React, { useRef, useState } from "react";
import { Card } from "@/components/ds/Card";
import { Button } from "@/components/ds/Button";
import { useAuth } from "@/lib/auth";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

export function AdminLogin() {
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const passRef = useRef<HTMLInputElement | null>(null);

  const tryLogin = async () => {
    if (!ADMIN_EMAIL) {
      setError("NEXT_PUBLIC_ADMIN_EMAIL isn't configured (see SETUP.md).");
      return;
    }
    const passcode = passRef.current?.value || "";
    setSubmitting(true);
    const { error: err } = await signIn(ADMIN_EMAIL, passcode);
    setSubmitting(false);
    if (err) {
      setError("Incorrect passcode. Try again.");
      if (passRef.current) passRef.current.value = "";
    } else {
      setError("");
    }
  };

  return (
    <div className="av-view" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "var(--space-8)" }}>
      <Card variant="raised" padding="lg">
        <div style={{ width: 340, maxWidth: "100%", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <div className="av-eyebrow" style={{ marginBottom: 6 }}>
              Admin
            </div>
            <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-strong)", margin: 0 }}>
              Enter passcode
            </h1>
          </div>
          <input
            ref={passRef}
            type="password"
            placeholder="Passcode"
            onKeyDown={(e) => {
              if (e.key === "Enter") tryLogin();
            }}
            style={{
              height: 42,
              padding: "0 14px",
              fontFamily: "var(--font-code)",
              fontSize: "var(--text-md)",
              color: "var(--text-strong)",
              background: "var(--surface-card)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--r-md)",
              outline: "none",
            }}
          />
          {error && <div style={{ fontSize: "var(--text-sm)", color: "var(--danger-600)" }}>{error}</div>}
          <Button variant="primary" full onClick={tryLogin} disabled={submitting}>
            Unlock
          </Button>
        </div>
      </Card>
    </div>
  );
}

import type { CSSProperties } from "react";

export const label: CSSProperties = {};

export const fieldWrap: CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };

export const textInput: CSSProperties = {
  height: 42,
  padding: "0 14px",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-md)",
  color: "var(--text-strong)",
  background: "var(--surface-card)",
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--r-md)",
  outline: "none",
};

export const smallInput: CSSProperties = {
  ...textInput,
  height: 38,
  padding: "0 12px",
  fontFamily: "var(--font-code)",
  fontSize: "var(--text-sm)",
};

export const textareaBase: CSSProperties = {
  minHeight: 56,
  resize: "vertical",
  padding: "10px 14px",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-sm)",
  color: "var(--text-strong)",
  background: "var(--surface-card)",
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--r-md)",
  outline: "none",
};

export const grid3: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" };
export const grid2: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" };

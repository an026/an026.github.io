import React from "react";
import { SearchIcon } from "@/components/icons";

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{ position: "relative", maxWidth: 420 }}>
      <SearchIcon
        size={16}
        style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none" }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 42,
          padding: "0 14px 0 40px",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          color: "var(--text-strong)",
          background: "var(--surface-card)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--r-md)",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

import React from "react";

export type TabItem = { label: string; value: string };

export function Tabs({
  items = [],
  value,
  onChange,
  variant = "pill",
  className = "",
  ...rest
}: {
  items?: TabItem[];
  value?: string;
  onChange?: (v: string) => void;
  variant?: "pill" | "underline";
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const cls = ["av-tabs", `av-tabs--${variant}`, className].filter(Boolean).join(" ");
  return (
    <div className={cls} role="tablist" {...rest}>
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          role="tab"
          className="av-tab"
          data-active={it.value === value}
          aria-selected={it.value === value}
          onClick={() => onChange && onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

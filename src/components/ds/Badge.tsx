import React from "react";

export function Badge({
  tone = "neutral",
  dot = false,
  className = "",
  children,
  ...rest
}: {
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const cls = ["av-badge", `av-badge--${tone}`, className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {dot && <span className="av-badge__dot" />}
      {children}
    </span>
  );
}

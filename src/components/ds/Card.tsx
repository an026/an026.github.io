import React from "react";

export function Card({
  variant = "flat",
  interactive = false,
  padding = "md",
  as = "div",
  className = "",
  children,
  ...rest
}: {
  variant?: "flat" | "raised" | "sunk";
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const As = as;
  const cls = [
    "av-card",
    `av-card--${variant}`,
    padding !== "md" ? `av-card--pad-${padding}` : "",
    interactive ? "av-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <As className={cls} {...rest}>
      {children}
    </As>
  );
}

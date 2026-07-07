import React from "react";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase();
}

export function Avatar({
  src,
  name = "",
  size = "md",
  square = false,
  className = "",
  ...rest
}: {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  square?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const cls = ["av-avatar", `av-avatar--${size}`, square ? "av-avatar--square" : "", className].filter(Boolean).join(" ");
  return (
    <span className={cls} role="img" aria-label={name || undefined} {...rest}>
      {src ? <img src={src} alt={name} /> : initials(name)}
    </span>
  );
}

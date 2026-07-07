import React from "react";

export function Tag({
  variant = "solid",
  size = "sm",
  dot = false,
  className = "",
  children,
  ...rest
}: {
  variant?: "solid" | "outline" | "accent";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const cls = ["av-tag", `av-tag--${size}`, variant !== "solid" ? `av-tag--${variant}` : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} {...rest}>
      {dot && <span className="av-tag__dot" />}
      {children}
    </span>
  );
}

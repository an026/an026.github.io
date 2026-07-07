import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "accentSoft";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type ButtonAsAnchor = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    full = false,
    leadingIcon = null,
    trailingIcon = null,
    as = "button",
    className = "",
    children,
    ...rest
  } = props as CommonProps & { as?: "button" | "a" } & Record<string, unknown>;

  const cls = ["av-btn", `av-btn--${variant}`, `av-btn--${size}`, full ? "av-btn--full" : "", className]
    .filter(Boolean)
    .join(" ");

  if (as === "a") {
    return (
      <a className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {leadingIcon}
        {children != null && <span>{children}</span>}
        {trailingIcon}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {leadingIcon}
      {children != null && <span>{children}</span>}
      {trailingIcon}
    </button>
  );
}

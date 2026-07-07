import React from "react";

type Variant = "ghost" | "outline" | "solid";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  label: string;
  className?: string;
  children?: React.ReactNode;
};

type AsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type AsAnchor = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

export type IconButtonProps = AsButton | AsAnchor;

export function IconButton(props: IconButtonProps) {
  const { variant = "ghost", size = "md", label, className = "", children, as = "button", ...rest } =
    props as CommonProps & { as?: "button" | "a" } & Record<string, unknown>;
  const cls = ["av-iconbtn", `av-iconbtn--${variant}`, `av-iconbtn--${size}`, className].filter(Boolean).join(" ");

  if (as === "a") {
    return (
      <a className={cls} aria-label={label} title={label} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} aria-label={label} title={label} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

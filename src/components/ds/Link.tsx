import React from "react";

export function Link({
  href,
  arrow = false,
  external = false,
  muted = false,
  className = "",
  children,
  ...rest
}: {
  href: string;
  arrow?: boolean;
  external?: boolean;
  muted?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = ["av-link", muted ? "av-link--muted" : "", external ? "av-link--ext" : "", className]
    .filter(Boolean)
    .join(" ");
  const extProps = external ? { target: "_blank", rel: "noreferrer noopener" } : {};
  return (
    <a href={href} className={cls} {...extProps} {...rest}>
      {children}
      {arrow && (
        <span className="av-link__arrow" aria-hidden="true">
          {external ? "↗" : "→"}
        </span>
      )}
    </a>
  );
}

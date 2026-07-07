import React from "react";

export type NavLink = { label: string; href: string; current?: boolean };

export function NavBar({
  brand = "allison.vu",
  links = [],
  actions = null,
  className = "",
  ...rest
}: {
  brand?: string;
  links?: NavLink[];
  actions?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const brandNode =
    typeof brand === "string" && brand.includes(".") ? (
      (() => {
        const idx = brand.indexOf(".");
        const a = brand.slice(0, idx);
        const b = brand.slice(idx + 1);
        return (
          <>
            {a}
            <span className="dot">.</span>
            {b}
          </>
        );
      })()
    ) : (
      brand
    );

  return (
    <nav className={["av-nav", className].filter(Boolean).join(" ")} {...rest}>
      <a className="av-nav__brand" href="#/">
        {brandNode}
      </a>
      <div className="av-nav__links">
        {links.map((l) => (
          <a key={l.href + l.label} className="av-nav__link" href={l.href} aria-current={l.current ? "page" : undefined}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="av-nav__actions">{actions}</div>
    </nav>
  );
}

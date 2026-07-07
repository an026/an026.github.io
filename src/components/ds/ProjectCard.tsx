import React from "react";
import { Tag } from "./Tag";

export function ProjectCard({
  index,
  title,
  description,
  tags = [],
  year,
  href,
  className = "",
  ...rest
}: {
  index?: number;
  title: string;
  description?: string;
  tags?: string[];
  year?: string;
  href?: string;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const cls = ["av-project", className].filter(Boolean).join(" ");
  const content = (
    <>
      <div className="av-project__top">
        {index != null && <span className="av-project__num">{String(index).padStart(2, "0")}</span>}
        <span className="av-project__arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <div>
        <div className="av-project__title">{title}</div>
        {year && <span className="av-project__year">{year}</span>}
      </div>
      {description && <p className="av-project__desc">{description}</p>}
      {tags.length > 0 && (
        <div className="av-project__tags">
          {tags.map((t) => (
            <Tag key={t} size="sm">
              {t}
            </Tag>
          ))}
        </div>
      )}
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <div className={cls} {...rest}>
      {content}
    </div>
  );
}

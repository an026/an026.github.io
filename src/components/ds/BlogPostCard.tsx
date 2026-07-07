import React from "react";

export function BlogPostCard({
  date,
  title,
  excerpt,
  readingTime,
  href = "#",
  className = "",
  ...rest
}: {
  date: string;
  title: string;
  excerpt?: string;
  readingTime?: string;
  href?: string;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={["av-post", className].filter(Boolean).join(" ")} {...rest}>
      <span className="av-post__date">{date}</span>
      <span className="av-post__main">
        <span className="av-post__title">{title}</span>
        {excerpt && <p className="av-post__excerpt">{excerpt}</p>}
        {readingTime && (
          <span className="av-post__meta">
            <span className="av-post__read">{readingTime}</span>
          </span>
        )}
      </span>
    </a>
  );
}

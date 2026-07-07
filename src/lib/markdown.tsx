import React from "react";

const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/;

function mdInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let m: RegExpExecArray | null;
  let last = 0;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] != null) nodes.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3] != null) nodes.push(<em key={key++}>{m[3]}</em>);
    else if (m[4] != null)
      nodes.push(
        <code key={key++} style={{ fontFamily: "var(--font-code)", fontSize: "0.9em", background: "var(--bg-sunk)", padding: "1px 5px", borderRadius: "var(--r-xs)" }}>
          {m[4]}
        </code>
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Renders the post body markdown subset used by the admin editor: **bold**,
 * *italic*, `code`, ## headings, > quotes, - lists, and centered image
 * blocks with an optional caption. */
export function renderMarkdown(md: string): React.ReactNode {
  const lines = (md || "").split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] | null = null;
  let key = 0;

  const flush = () => {
    if (list) {
      const items = list;
      blocks.push(
        <ul key={key++} style={{ margin: "0 0 var(--space-5)", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((li, j) => (
            <li key={j} style={{ fontSize: "var(--text-md)", lineHeight: 1.7, color: "var(--text-body)" }}>
              {mdInline(li)}
            </li>
          ))}
        </ul>
      );
      list = null;
    }
  };

  lines.forEach((raw) => {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      flush();
      return;
    }
    if (/^##\s+/.test(line)) {
      flush();
      blocks.push(
        <h2 key={key++} style={{ fontFamily: "var(--font-code)", fontSize: "var(--text-xl)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-strong)", margin: "var(--space-6) 0 var(--space-3)" }}>
          {mdInline(line.replace(/^##\s+/, ""))}
        </h2>
      );
      return;
    }
    if (/^>\s?/.test(line)) {
      flush();
      blocks.push(
        <blockquote key={key++} style={{ margin: "0 0 var(--space-5)", padding: "4px 0 4px 18px", borderLeft: "2px solid var(--highlight)", color: "var(--text-strong)", fontSize: "var(--text-lg)", lineHeight: 1.5 }}>
          {mdInline(line.replace(/^>\s?/, ""))}
        </blockquote>
      );
      return;
    }
    if (/^-\s+/.test(line)) {
      if (!list) list = [];
      list.push(line.replace(/^-\s+/, ""));
      return;
    }
    const imgMatch = line.match(IMAGE_LINE_RE);
    if (imgMatch) {
      flush();
      const [, alt, src, caption] = imgMatch;
      blocks.push(
        <figure key={key++} style={{ margin: "0 0 var(--space-6)", textAlign: "center" }}>
          <img src={src} alt={alt} style={{ maxWidth: "100%", maxHeight: 520, borderRadius: "var(--r-lg)", display: "block", margin: "0 auto", border: "1px solid var(--border-subtle)" }} />
          {caption && <figcaption style={{ marginTop: 8, fontSize: "var(--text-sm)", color: "var(--text-faint)", fontStyle: "italic" }}>{caption}</figcaption>}
        </figure>
      );
      return;
    }
    flush();
    blocks.push(
      <p key={key++} style={{ fontSize: "var(--text-md)", lineHeight: 1.8, color: "var(--text-body)", margin: "0 0 var(--space-5)" }}>
        {mdInline(line)}
      </p>
    );
  });
  flush();
  return <div>{blocks}</div>;
}

export { IMAGE_LINE_RE };

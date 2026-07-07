import { IMAGE_LINE_RE } from "./markdown";

export type ParsedImage = { order: number; blockIndex: number; alt: string; src: string; caption: string };

export function splitBlocks(text: string): string[] {
  return (text || "").split(/\n{2,}/);
}
export function joinBlocks(blocks: string[]): string {
  return blocks.join("\n\n");
}
export function buildImageToken(alt: string, src: string, caption: string): string {
  return "![" + (alt || "") + "](" + src + (caption ? ' "' + caption.replace(/"/g, "'") + '"' : "") + ")";
}

export function parseImages(body: string): ParsedImage[] {
  const blocks = splitBlocks(body);
  const out: ParsedImage[] = [];
  blocks.forEach((b, blockIndex) => {
    const m = b.trim().match(IMAGE_LINE_RE);
    if (m) out.push({ order: out.length, blockIndex, alt: m[1] || "", src: m[2], caption: m[3] || "" });
  });
  return out;
}

export function insertAtCursor(body: string, cursor: number | null, snippet: string): string {
  const s = cursor ?? body.length;
  const before = body.slice(0, s);
  const after = body.slice(s);
  const lead = before.length ? (/\n\n$/.test(before) ? "" : "\n\n") : "";
  const trail = after.length ? (/^\n\n/.test(after) ? "" : "\n\n") : "";
  return before + lead + snippet + trail + after;
}

export function setImageField(body: string, order: number, field: "alt" | "caption" | "src", value: string): string {
  const blocks = splitBlocks(body);
  const images = parseImages(body);
  const target = images[order];
  if (!target) return body;
  const data = { alt: target.alt, src: target.src, caption: target.caption, [field]: value };
  blocks[target.blockIndex] = buildImageToken(data.alt, data.src, data.caption);
  return joinBlocks(blocks);
}

export function removeImageBlock(body: string, order: number): string {
  const blocks = splitBlocks(body);
  const images = parseImages(body);
  const target = images[order];
  if (!target) return body;
  blocks.splice(target.blockIndex, 1);
  return joinBlocks(blocks);
}

export function reorderImageBlock(body: string, from: number, to: number): string {
  if (from === to) return body;
  const blocks = splitBlocks(body);
  const images = parseImages(body);
  const fromIdx = images[from]?.blockIndex;
  const toIdx = images[to]?.blockIndex;
  if (fromIdx == null || toIdx == null) return body;
  const item = blocks.splice(fromIdx, 1)[0];
  blocks.splice(toIdx, 0, item);
  return joinBlocks(blocks);
}

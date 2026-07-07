import type { Project } from "./types";

export function previewImageFor(p: Pick<Project, "media_type" | "media_src">): string | null {
  if (p.media_type === "photo" && p.media_src) return p.media_src;
  if (p.media_type === "youtube" && p.media_src) return `https://img.youtube.com/vi/${p.media_src}/hqdefault.jpg`;
  return null;
}

export function indexDisplay(index: number | null | undefined): string {
  return index != null ? String(index).padStart(2, "0") : "";
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function parseYoutubeId(url: string): string | null {
  const m = (url || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import type { View } from "@/lib/types";

// Hash-based routing: GitHub Pages serves one static index.html, and hash
// fragments never hit the server, so this needs no server rewrites/404
// tricks to support deep links or refreshes.
function parseHash(hash: string): View {
  const h = hash.replace(/^#\/?/, "");
  if (!h) return { name: "home" };
  const detail = h.match(/^(projects|writing)\/([\w-]+)$/);
  if (detail) {
    return detail[1] === "writing" ? { name: "post", slug: detail[2] } : { name: "project", slug: detail[2] };
  }
  if (h === "projects") return { name: "projects" };
  if (h === "work") return { name: "work" };
  if (h === "writing") return { name: "writing" };
  if (h === "about") return { name: "about" };
  if (h === "admin") return { name: "admin" };
  return { name: "home" };
}

export function useHashRouter() {
  const [view, setView] = useState<View>({ name: "home" });

  useEffect(() => {
    const update = () => {
      setView(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const navigate = useCallback((hash: string) => {
    if (window.location.hash === hash) {
      setView(parseHash(hash));
      window.scrollTo(0, 0);
    } else {
      window.location.hash = hash;
    }
  }, []);

  return { view, navigate };
}

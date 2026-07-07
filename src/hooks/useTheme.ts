"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("av-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const el = document.documentElement;
  if (theme === "dark") el.setAttribute("data-theme", "dark");
  else el.removeAttribute("data-theme");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = readInitialTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("av-theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

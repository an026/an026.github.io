"use client";

import { useEffect, useRef } from "react";

/**
 * Drives typed text into a DOM node imperatively via textContent, never
 * through React state/re-render — keeps the ~15-tick/sec animation cheap
 * and immune to re-render churn elsewhere in the tree.
 */
export function useTypewriter(phrases: string[], enabled = true) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || phrases.length === 0) return;

    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled || reduce) {
      el.textContent = phrases[0];
      return;
    }

    let typed = "";
    let pi = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const full = phrases[pi];
      if (!deleting) {
        if (typed.length < full.length) {
          typed = full.slice(0, typed.length + 1);
          el.textContent = typed;
          timer = setTimeout(tick, 65);
        } else {
          deleting = true;
          timer = setTimeout(tick, 1600);
        }
      } else {
        if (typed.length > 0) {
          typed = full.slice(0, typed.length - 1);
          el.textContent = typed;
          timer = setTimeout(tick, 32);
        } else {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          timer = setTimeout(tick, 320);
        }
      }
    };

    timer = setTimeout(tick, 650);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases.join("|"), enabled]);

  return ref;
}

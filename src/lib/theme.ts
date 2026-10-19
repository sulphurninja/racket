"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY as KEY } from "./theme-script";

export type Theme = "light" | "dark";

function current(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, current, () => "light");
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
}

let switching = false;

/**
 * Switch theme: a flood of the new base color pours out of (x, y) until it
 * covers the screen, the theme flips underneath, then the flood dissolves.
 */
export function toggleTheme(x: number, y: number) {
  if (switching) return;
  const next: Theme = current() === "dark" ? "light" : "dark";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply(next);
    return;
  }
  switching = true;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const flood = document.createElement("div");
  flood.setAttribute("aria-hidden", "true");
  Object.assign(flood.style, {
    position: "fixed",
    inset: "0",
    zIndex: "200",
    pointerEvents: "none",
    background:
      next === "dark"
        ? "radial-gradient(circle at var(--x) var(--y), #1d1f26 0%, #0c0d10 60%)"
        : "radial-gradient(circle at var(--x) var(--y), #ffffff 0%, #f7f7f5 60%)",
  });
  flood.style.setProperty("--x", `${x}px`);
  flood.style.setProperty("--y", `${y}px`);
  document.body.appendChild(flood);

  const fill = flood.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 700, easing: "cubic-bezier(0.7, 0, 0.3, 1)", fill: "forwards" },
  );
  fill.finished.then(() => {
    apply(next);
    const fade = flood.animate({ opacity: [1, 0] }, { duration: 450, delay: 80, easing: "ease-out", fill: "forwards" });
    fade.finished.finally(() => {
      flood.remove();
      switching = false;
    });
  });
}

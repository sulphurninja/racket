"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Shown while the tab is in the background. Each line holds, then the next one takes over. */
const AWAY = [
  "⌨️ Make some noise",
  "✨ Your desk is waiting",
  "🖤 Ash is still on",
  "🧊 Ice hasn't moved",
  "🍵 Matcha is steeping",
  "☁️ Sky is still here",
  "🎧 Come back to the board",
  "💎 The first run is small",
];

const AWAY_TITLES = new Set(AWAY);
const INTERVAL_MS = 1600;

let live = "";
let away = false;

/** Updates the real tab title. Ignored visually while the away rotation is running. */
export function setLiveTitle(title: string) {
  live = title;
  if (!away) document.title = title;
}

export function TabTitle() {
  const pathname = usePathname();

  useEffect(() => {
    let timer = 0;
    let i = 0;

    const stop = () => window.clearInterval(timer);

    const tick = () => {
      document.title = AWAY[i % AWAY.length];
      i += 1;
    };

    const onVis = () => {
      if (document.hidden) {
        away = true;
        const current = document.title;
        if (current && !AWAY_TITLES.has(current)) live = current;
        else if (!live) live = current;
        tick();
        stop();
        timer = window.setInterval(tick, INTERVAL_MS);
      } else {
        away = false;
        stop();
        if (live) document.title = live;
      }
    };

    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
      away = false;
    };
  }, []);

  useEffect(() => {
    live = "";
    const id = requestAnimationFrame(() => {
      if (!away && document.title && !AWAY_TITLES.has(document.title)) live = document.title;
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}

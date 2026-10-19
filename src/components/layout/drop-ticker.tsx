"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/ui-store";

/** Real first-run stock, passed down from the server catalog — never invented numbers. */
export type DropAlert = { slug: string; name: string; stock: number; image?: { url: string; alt: string } };

const FIRST_DELAY = 9_000;
const MIN_GAP = 28_000;
const MAX_GAP = 48_000;

/** Copy pool — all statements stay true to the seeded first-run stock. */
const LINES = [
  (a: DropAlert) => ({ title: "Low-key limited.", description: `${a.name} — first run capped at ${a.stock} units.` }),
  (a: DropAlert) => ({ title: `${a.name}.`, description: `Only ${a.stock} boards in the first run. Cop early, flex forever.` }),
  (a: DropAlert) => ({ title: "One batch. That's the run.", description: `${a.stock} units of the ${a.name} exist right now.` }),
];

/**
 * Periodically surfaces first-run stock alerts as toasts. Renders nothing itself;
 * it pushes into the global toaster. Quiet on cart/checkout so it never nags mid-purchase.
 */
export function DropTicker({ alerts }: { alerts: DropAlert[] }) {
  const toast = useUIStore((s) => s.toast);

  useEffect(() => {
    if (!alerts.length) return;
    let timer: ReturnType<typeof setTimeout>;
    let i = Math.floor(Math.random() * alerts.length);
    let line = Math.floor(Math.random() * LINES.length);

    const schedule = (delay: number) => {
      timer = setTimeout(() => {
        const path = window.location.pathname;
        if (!path.startsWith("/cart") && !path.startsWith("/checkout")) {
          const a = alerts[i % alerts.length];
          i += 1;
          line += 1;
          toast({
            ...LINES[line % LINES.length](a),
            tone: "hype",
            duration: 7_000,
            image: a.image,
            action: { label: "Cop now", href: `/products/${a.slug}` },
          });
        }
        schedule(MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP));
      }, delay);
    };

    schedule(FIRST_DELAY);
    return () => clearTimeout(timer);
  }, [alerts, toast]);

  return null;
}

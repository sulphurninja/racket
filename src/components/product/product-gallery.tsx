"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductMedia } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/**
 * Desktop: editorial two-column stack (first image full width).
 * Mobile: swipeable scroll-snap carousel with position dots.
 */
export function ProductGallery({ media, title }: { media: ProductMedia[]; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { root: track, threshold: 0.6 },
    );
    track.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [media]);

  return (
    <div>
      {/* Mobile carousel */}
      <div className="relative md:hidden">
        <div
          ref={trackRef}
          className="no-scrollbar -mx-[clamp(1.125rem,3.4vw,3rem)] flex snap-x snap-mandatory overflow-x-auto"
          aria-label={`${title} images`}
          role="region"
        >
          {media.map((m, i) => (
            <div
              key={m.id}
              data-index={i}
              className={cn("relative w-full shrink-0 snap-center bg-mist", m.view === "front" ? "aspect-[16/10]" : "aspect-square")}
            >
              <Image
                src={m.url}
                alt={m.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={m.view === "front" ? "object-contain p-2" : "object-cover"}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5" aria-hidden>
          {media.map((m, i) => (
            <span
              key={m.id}
              className={cn("h-1.5 rounded-full bg-ink/80 transition-all duration-500", i === active ? "w-5" : "w-1.5 opacity-30")}
            />
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden grid-cols-2 gap-3 md:grid">
        {media.map((m, i) => (
          <div
            key={m.id}
            className={cn(
              "relative overflow-hidden rounded-[var(--radius-lg)] bg-mist",
              m.view === "front" ? "col-span-2 aspect-[16/9]" : m.view === "lifestyle" ? "col-span-2 aspect-[4/3]" : "aspect-[4/5]",
            )}
          >
            <Image
              src={m.url}
              alt={m.alt}
              fill
              priority={i === 0}
              sizes={m.view === "front" || m.view === "lifestyle" ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 29vw, 50vw"}
              className={m.view === "front" ? "object-contain p-8" : "object-cover"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

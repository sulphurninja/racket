"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { ColorwayId } from "@/config/colorways";
import type { ImageAsset } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

export type StackItem = {
  slug: string;
  title: string;
  headline: string;
  colorway: ColorwayId;
  image: ImageAsset;
  pieces: { label: string; status: "live" | "loading" }[];
};

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 4500;

/** Underglow per stack. The light that leaks out from under the pressed key. */
const GLOW: Record<ColorwayId, string> = {
  glacier: "#8fd0ff",
  cedar: "#9ad6a6",
  cloud: "#7db6ee",
  midnight: "#b3a6ff",
};

/** Each stack's switcher key is dressed in that board's keycaps. */
const KEY: Record<ColorwayId, { face: string; skirt: string; base: string; ink: string }> = {
  glacier: { face: "linear-gradient(180deg,#f4f9fd,#cfe4f4)", skirt: "#a8c4da", base: "#5f7c93", ink: "text-ink" },
  cedar: { face: "linear-gradient(180deg,#b9cbbd,#8eaa96)", skirt: "#6f8c78", base: "#3c5143", ink: "text-ink" },
  cloud: { face: "linear-gradient(180deg,#ffffff,#a9d0f5)", skirt: "#7fb0e3", base: "#3f6f9f", ink: "text-ink" },
  midnight: { face: "linear-gradient(180deg,#3a3c43,#24252a)", skirt: "#18191d", base: "#050506", ink: "text-paper" },
};

export function StackShowcase({ items }: { items: StackItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (items.length < 2 || paused || reduce) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % items.length), DURATION);
    return () => clearTimeout(t);
  }, [active, items.length, paused, reduce]);

  const item = items[active];
  const glow = GLOW[item.colorway];

  return (
    <section
      id="stacks"
      data-nav-theme="dark"
      className="relative scroll-mt-20 overflow-hidden bg-[#0b0c0e] text-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <AnimatePresence initial={false}>
          <motion.div
            key={item.slug}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <Image src={item.image.url} alt={item.image.alt} fill sizes="100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0e] via-[#0b0c0e]/70 to-[#0b0c0e]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-transparent to-[#0b0c0e]/60" />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full blur-[120px]"
          animate={{ backgroundColor: glow, opacity: 0.35 }}
          transition={{ duration: 0.9, ease: EASE }}
        />

        <div className="container-racket relative py-20 md:py-24">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4">
                <p className="type-eyebrow text-paper/55">The stacks</p>
                <span className="h-px w-10 bg-paper/25" />
                <p className="type-meta tabular text-paper/55">
                  <span className="text-paper">{String(active + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
                </p>
              </div>
              <p className="type-display-narrow mt-8 text-2xl text-paper/70 md:text-4xl">One vibe,</p>
              <h2 className="sr-only">One vibe, {item.title}.</h2>
              <div aria-hidden className="relative mt-2 overflow-hidden pb-[0.08em]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={item.slug}
                    className="type-display text-[clamp(3rem,6.6vw,7.5rem)] leading-[0.88]"
                    initial="hidden"
                    animate="shown"
                    exit="gone"
                  >
                    {`${item.title}.`.split(" ").map((word, w, words) => (
                      <span key={w} className="inline-block whitespace-nowrap">
                        {[...word].map((ch, i) => {
                          const n = words.slice(0, w).join("").length + i;
                          return (
                            <motion.span
                              key={i}
                              className="inline-block"
                              variants={{
                                hidden: { y: "105%" },
                                shown: { y: "0%", transition: { duration: 0.7, ease: EASE, delay: n * 0.03 } },
                                gone: { y: "-105%", transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0], delay: n * 0.015 } },
                              }}
                            >
                              {ch}
                            </motion.span>
                          );
                        })}
                        {w < words.length - 1 ? "\u00a0" : null}
                      </span>
                    ))}
                  </motion.p>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={item.slug}
                  className="mt-5 text-lg text-paper/75 md:text-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.25 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  {item.headline}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-[24px] bg-white/[0.06] p-5 ring-1 ring-white/12 backdrop-blur-xl md:p-6">
                <p className="type-eyebrow text-paper/50">In the stack</p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.ul
                    key={item.slug}
                    className="mt-4 space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    {item.pieces.map((p) => (
                      <li key={p.label} className="flex items-center gap-3 text-sm">
                        <span
                          className={cn("h-2 w-2 shrink-0 rounded-full", p.status === "live" ? "animate-pulse" : "ring-1 ring-paper/40")}
                          style={p.status === "live" ? { background: glow, boxShadow: `0 0 12px ${glow}` } : undefined}
                        />
                        <span className={p.status === "live" ? "text-paper" : "text-paper/50"}>{p.label}</span>
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
                <Link
                  href={`/collections/${item.slug}`}
                  className="group/key relative mt-6 flex h-14 items-center justify-between rounded-[14px] bg-paper px-5 text-sm font-semibold text-ink shadow-[0_6px_0_#9b9b97] transition-transform duration-75 active:translate-y-[5px] active:shadow-[0_1px_0_#9b9b97]"
                >
                  Shop {item.title}
                  <span className="text-lg">↵</span>
                </Link>
              </div>
            </div>
          </div>

          <ol className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-4" aria-label="Choose a stack">
            {items.map((it, i) => {
              const on = i === active;
              const g = GLOW[it.colorway];
              const k = KEY[it.colorway];
              return (
                <li key={it.slug} className="relative">
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-2 h-8 rounded-full blur-2xl transition-opacity duration-500"
                    style={{ background: g, opacity: on ? 0.95 : 0 }}
                  />
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className={cn(
                      "relative block h-[6.5rem] w-full rounded-[18px] text-left transition-[transform,box-shadow,opacity] duration-100 md:h-28",
                      on ? "translate-y-[7px]" : "opacity-75 hover:-translate-y-0.5 hover:opacity-100",
                    )}
                    style={{ background: k.skirt, boxShadow: on ? `0 2px 0 ${k.base}` : `0 9px 0 ${k.base}` }}
                  >
                    <span
                      className="absolute inset-[6px] bottom-[13px] overflow-hidden rounded-[13px] shadow-[inset_0_1px_0_rgb(255_255_255/0.5)]"
                      style={{ background: k.face }}
                    >
                      <span className="absolute inset-y-2 right-2 aspect-square overflow-hidden rounded-[9px] ring-1 ring-black/10">
                        <Image src={it.image.url} alt="" fill sizes="96px" className="object-cover" />
                      </span>
                    </span>
                    <span className={cn("relative flex h-full flex-col justify-between py-3 pr-24 pb-6 pl-4 md:pr-28", k.ink)}>
                      <span className="type-meta tabular text-[11px] opacity-55">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-base leading-tight font-semibold tracking-[-0.02em] md:text-lg">{it.title}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

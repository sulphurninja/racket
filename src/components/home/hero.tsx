"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { setLiveTitle } from "@/components/brand/tab-title";
import { COLORWAYS, type ColorwayId } from "@/config/colorways";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  colorway: ColorwayId;
  slug: string;
  priceMinor: number;
  priceConfirmed: boolean;
  image: { url: string; alt: string };
};

const TAB_MARK: Record<ColorwayId, string> = {
  glacier: "🧊",
  cedar: "🌿",
  cloud: "☁️",
  midnight: "🖤",
};

const DURATION = 3000;
const EASE = [0.16, 1, 0.3, 1] as const;
/** Each slide starts laid back, then tips forward to face the camera. */
const REST_X = 58;
const FACE_Z = 80;
const RISE = { duration: 1.7, ease: [0.65, 0, 0.2, 1] as const };

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [introDelay, setIntroDelay] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--intro-delay");
    setIntroDelay((Number.parseFloat(raw) || 0) / 1000);
  }, []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (hidden || reduce) return;
    const t = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(t);
  }, [hidden, reduce, index, go]);

  const slide = slides[index];
  const cw = COLORWAYS[slide.colorway];

  useEffect(() => {
    setLiveTitle(`${TAB_MARK[slide.colorway]} ${cw.shortName} · RACKET`);
  }, [slide.colorway, cw.shortName]);
  const rise = { ...RISE, delay: index === 0 ? (introDelay ?? 0) : 0 };
  const facing = introDelay !== null;

  return (
    <section
      data-scene={cw.scene}
      data-nav-theme={cw.dark ? "dark" : "light"}
      aria-roledescription="carousel"
      aria-label="RACKET K75"
      className="scene-surface relative isolate flex flex-col overflow-hidden pt-[var(--header-h)] pb-8 md:block md:h-[100svh] md:min-h-[640px] md:pt-0 md:pb-0"
    >
      {/* Each colorway arrives laid back, then tips forward on its own. */}
      <div className="pointer-events-none relative flex shrink-0 justify-center md:absolute md:inset-x-0 md:top-[2%] md:bottom-[16%] md:grid md:place-items-center" style={{ perspective: 900 }}>
        <div className="relative aspect-[16/8.2] w-[min(1360px,96vw)]">
          <AnimatePresence>
            <motion.div
              key={slide.colorway}
              aria-hidden
              className="absolute bottom-[2%] left-[16%] z-0 h-6 w-[68%] origin-center rounded-[100%] bg-black/25 blur-2xl"
              initial={reduce ? false : { y: 36, scaleX: 1.25, opacity: 0.85 }}
              animate={facing ? { y: 4, scaleX: 0.94, opacity: 1 } : { y: 36, scaleX: 1.25, opacity: 0.85 }}
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
              transition={rise}
            />
            <motion.div
              key={`${slide.colorway}-board`}
              className="absolute inset-0 z-10 origin-[50%_72%]"
              initial={reduce ? { opacity: 0 } : { opacity: 1, rotateX: REST_X, z: 0 }}
              animate={
                facing
                  ? { opacity: 1, rotateX: 0, z: reduce ? 0 : FACE_Z }
                  : { opacity: 1, rotateX: REST_X, z: 0 }
              }
              exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE } }}
              transition={rise}
              style={{ transformPerspective: 900, transformStyle: "preserve-3d" }}
            >
              <Image
                src={slide.image.url}
                alt={slide.image.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 1360px, 96vw"
                className="object-contain object-center"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Quiet bottom bar: name left, buy right */}
      <div className="container-racket relative flex shrink-0 flex-col gap-6 pt-3 pb-6 md:absolute md:inset-x-0 md:bottom-0 md:flex-row md:items-end md:justify-between md:gap-5 md:pt-0 md:pb-10">
        <div className="min-w-0 text-scene-ink">
          <p className="intro-rise type-eyebrow opacity-50" style={{ ["--d" as string]: "80ms" }}>
            RACKET K75
          </p>
          <div className="intro-mask mt-3" style={{ paddingBottom: "0.34em", marginBottom: 0 }}>
            <h1 className="type-display w-full text-[clamp(2.85rem,12vw,4.75rem)] md:text-[clamp(3.25rem,7.6vw,6.75rem)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={slide.colorway}
                  className="block max-w-full"
                  initial={{ y: "70%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-70%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {cw.name}
                </motion.span>
              </AnimatePresence>
            </h1>
          </div>
          <div className="intro-rise mt-5 hidden flex-wrap gap-x-5 gap-y-2 md:flex" style={{ ["--d" as string]: "200ms" }} role="tablist" aria-label="Colorway">
            {slides.map((s, i) => (
              <button
                key={s.colorway}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => go(i)}
                className={cn(
                  "text-[13px] transition-opacity",
                  i === index ? "font-medium opacity-100" : "opacity-40 hover:opacity-75",
                )}
              >
                {COLORWAYS[s.colorway].shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="intro-rise w-full shrink-0 pb-2 md:w-auto md:self-end md:pb-0" style={{ ["--d" as string]: "260ms" }}>
          <Link
            href={`/products/${slide.slug}`}
            aria-label={`Shop RACKET K75 ${cw.name}`}
            className="group/enter relative grid h-[4.75rem] w-full place-items-center rounded-[16px] bg-[#b7b7b2] text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_8px_0_#8a8a86,0_20px_26px_-14px_rgb(0_0_0/0.6)] transition-[transform,box-shadow] duration-75 select-none [-webkit-tap-highlight-color:transparent] active:translate-y-[7px] active:shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_1px_0_#8a8a86] sm:h-[5.25rem] md:h-24 md:w-[19rem] md:rounded-[18px] md:shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_10px_0_#8a8a86,0_22px_28px_-14px_rgb(0_0_0/0.6)] md:active:translate-y-[9px]"
          >
            <span className="absolute inset-[6px] bottom-[12px] rounded-[11px] bg-[#f6f6f3] shadow-[inset_0_1px_0_rgb(255_255_255/0.98),inset_0_-10px_16px_rgb(0_0_0/0.05)] transition-[bottom] duration-75 group-active/enter:bottom-[8px] md:inset-[7px] md:bottom-[14px] md:rounded-[13px] md:group-active/enter:bottom-[9px]" />
            <span className="relative flex w-full items-center justify-between px-5 pb-1 md:px-6">
              <span className="text-left">
                <span className="block text-xl leading-none font-medium tabular sm:text-2xl md:text-3xl">{formatMoney(slide.priceMinor)}</span>
                {!slide.priceConfirmed ? <span className="type-meta mt-1 block text-[10px] tracking-[0.12em] uppercase opacity-45">Preview price</span> : null}
              </span>
              <span className="flex items-center gap-2.5 leading-none md:flex-col md:items-end md:gap-0">
                <span className="text-[12px] font-semibold tracking-[0.2em] uppercase md:order-2 md:mt-1 md:text-[11px]">Shop</span>
                <span className="text-2xl md:order-1 md:text-3xl">↵</span>
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { NavItem } from "@/config/navigation";
import { ArrowGlyph } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function MegaMenuPanel({
  item,
  index,
  onPointerEnter,
  onNavigate,
}: {
  item: NavItem;
  index: number;
  onPointerEnter: () => void;
  onNavigate: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-x-2 top-full hidden sm:inset-x-3 lg:block"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: EASE }}
      onPointerEnter={onPointerEnter}
    >
      <div className="mx-auto max-w-[1520px] overflow-hidden rounded-b-[20px] bg-paper text-ink shadow-[0_40px_80px_-40px_rgb(17_18_22/0.45)] ring-1 ring-line">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="grid grid-cols-12 gap-8 px-8 pt-6 pb-8"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <div className="col-span-7 grid grid-cols-2 gap-8">
              {item.groups.map((group, gi) => (
                <div key={group.title}>
                  <p className="type-eyebrow mb-4 text-ink/45">{group.title}</p>
                  <ul className="space-y-0.5">
                    {group.links.map((link, li) => (
                      <motion.li
                        key={link.href + link.label}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE, delay: 0.03 * (li + gi * 3) }}
                      >
                        <Link
                          href={link.href}
                          onClick={onNavigate}
                          className="group/link -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 text-[15px] tracking-[-0.01em] transition-colors hover:bg-ink/[0.04]"
                        >
                          {link.swatch && (
                            <span
                              className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10 ring-inset"
                              style={{ background: link.swatch }}
                            />
                          )}
                          <span className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/link:translate-x-0.5">
                            {link.label}
                          </span>
                          {link.note && (
                            <span className="type-eyebrow rounded-full bg-ink/5 px-2 py-1 text-[9px] text-ink/60">{link.note}</span>
                          )}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link
              href={item.feature.href}
              onClick={onNavigate}
              data-scene={item.feature.scene}
              className={cn(
                "group/btn scene-surface relative col-span-5 flex min-h-[280px] overflow-hidden rounded-[16px]",
              )}
            >
              <Image
                src={item.feature.image.url}
                alt={item.feature.image.alt}
                fill
                sizes="560px"
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover/btn:scale-[1.04]"
              />
              <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-[var(--scene-bg)] via-[color-mix(in_oklab,var(--scene-bg)_55%,transparent)] to-transparent" />
              <div className="relative z-10 flex w-full flex-col justify-between p-6">
                <div>
                  <p className="type-eyebrow opacity-60">Featured</p>
                  <p className="type-display-narrow mt-2 text-2xl">{item.feature.title}</p>
                  <p className="mt-1 text-sm opacity-70">{item.feature.caption}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-paper/85 px-3.5 py-2 text-sm font-medium text-ink backdrop-blur">
                  Shop now <ArrowGlyph />
                </span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

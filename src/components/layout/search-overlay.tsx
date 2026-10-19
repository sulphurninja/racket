"use client";

import { ArrowRight, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Price } from "@/components/ui/primitives";
import { ProductImage } from "@/components/product/product-image";
import { COLORWAYS } from "@/config/colorways";
import type { ProductCardData } from "@/lib/catalog/types";
import { useUIStore } from "@/stores/ui-store";

const SUGGESTIONS = ["Matcha", "Ice", "RGB", "Ash", "Hot-swap"];

export function SearchOverlay() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`, { signal: ctrl.signal });
        if (res.ok) setResults((await res.json()).items);
      } catch {
        /* aborted or offline: keep previous results */
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, q ? 160 : 0);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, open]);

  const close = () => setOpen(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} side="top" title="Search" description="Search the RACKET store" className="max-h-[88dvh] sm:inset-x-3 sm:top-3 sm:rounded-[var(--radius-lg)]">
      <form
        role="search"
        className="container-racket flex items-center gap-3 border-b border-line pt-5 pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!q.trim()) return;
          close();
          router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        }}
      >
        <Search className="h-6 w-6 shrink-0 text-ink/40" strokeWidth={1.6} />
        <input
          ref={inputRef}
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search keyboards, colorways…"
          aria-label="Search"
          className="type-display-narrow h-14 min-w-0 flex-1 bg-transparent text-[clamp(1.6rem,4vw,2.6rem)] placeholder:text-ink/25 focus:outline-none"
        />
        {loading ? <Loader2 className="h-5 w-5 animate-spin text-ink/40" /> : null}
        <kbd className="type-meta mr-12 hidden rounded-md px-2 py-1 text-[10px] text-ink/45 ring-1 ring-line-strong sm:block">ESC</kbd>
      </form>

      <div className="container-racket overflow-y-auto pt-5 pb-8">
        {!q ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQ(s);
                  inputRef.current?.focus();
                }}
                className="h-9 rounded-full px-4 text-sm ring-1 ring-line-strong ring-inset transition-colors hover:bg-ink hover:text-paper"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        <p className="type-eyebrow mb-4 text-ink/45">{q ? `Results for “${q}”` : "The lineup"}</p>
        {q && !loading && results.length === 0 ? (
          <p className="py-6 text-ink/60">Nothing matches “{q}”. Try a colorway like “Ice” or “Ash”.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                  exit={{ opacity: 0 }}
                >
                  <Link href={`/products/${p.slug}`} onClick={close} className="group block">
                    <ProductImage media={p.primary} sizes="(min-width: 768px) 25vw, 50vw" className="aspect-square rounded-[var(--radius-md)]" imageClassName="transition-transform duration-700 group-hover:scale-105" />
                    <p className="mt-3 text-sm font-medium">{p.family}</p>
                    <div className="flex items-center justify-between text-sm text-ink/55">
                      <span>{p.colorway ? COLORWAYS[p.colorway].name : p.tagline}</span>
                      <Price minor={p.priceFromMinor} className="text-ink" />
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
        {q && results.length > 0 ? (
          <Link
            href={`/search?q=${encodeURIComponent(q.trim())}`}
            onClick={close}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            See all results <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </Drawer>
  );
}

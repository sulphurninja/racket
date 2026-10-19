"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { COLORWAYS, type ColorwayId } from "@/config/colorways";
import type { ProductCardData, SortKey } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function sortCards(items: ProductCardData[], sort: SortKey) {
  const list = [...items];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return list.sort((a, b) => a.priceFromMinor - b.priceFromMinor);
    case "price-desc":
      return list.sort((a, b) => b.priceToMinor - a.priceToMinor);
    default:
      return list.sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999));
  }
}

export function CollectionGrid({ items, showColorFilter }: { items: ProductCardData[]; showColorFilter: boolean }) {
  const [color, setColor] = useState<ColorwayId | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");

  const colors = useMemo(
    () => [...new Set(items.flatMap((i) => i.swatches.map((s) => s.id)))],
    [items],
  );
  const visible = useMemo(
    () => sortCards(color ? items.filter((i) => i.swatches.some((s) => s.id === color)) : items, sort),
    [items, color, sort],
  );

  return (
    <div>
      <div className="sticky top-[calc(var(--header-h)-4px)] z-30 -mx-[clamp(1.125rem,3.4vw,3rem)] flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/85 px-[clamp(1.125rem,3.4vw,3rem)] py-3 backdrop-blur-xl">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          {showColorFilter && colors.length > 1 ? (
            <>
              <FilterChip active={color === null} onClick={() => setColor(null)}>
                All
              </FilterChip>
              {colors.map((c) => (
                <FilterChip key={c} active={color === c} onClick={() => setColor(color === c ? null : c)}>
                  <span
                    className="h-3 w-3 rounded-full ring-1 ring-black/10 ring-inset"
                    style={{ background: `linear-gradient(135deg, ${COLORWAYS[c].swatch} 0 55%, ${COLORWAYS[c].swatchAlt} 55%)` }}
                  />
                  {COLORWAYS[c].name}
                </FilterChip>
              ))}
            </>
          ) : (
            <span className="type-meta text-ink/55">
              {items.length} {items.length === 1 ? "product" : "products"}
            </span>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-ink/55">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-9 rounded-full bg-transparent px-3 text-sm ring-1 ring-line-strong ring-inset focus:outline-none focus-visible:ring-ink"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="Nothing here yet." description="Try another colorway." />
      ) : (
        <motion.ul layout className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={p} priority={i < 2} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm whitespace-nowrap transition-colors",
        active ? "bg-ink text-paper" : "ring-1 ring-line-strong ring-inset hover:ring-ink",
      )}
    >
      {children}
    </button>
  );
}

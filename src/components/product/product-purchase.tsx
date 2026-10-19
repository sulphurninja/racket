"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { AvailabilityLabel, DevNotice, Price } from "@/components/ui/primitives";
import { QuantitySelector } from "@/components/ui/quantity";
import { COLORWAYS } from "@/config/colorways";
import { addToCart } from "@/lib/cart/add-to-cart";
import { MAX_LINE_QUANTITY } from "@/lib/cart/totals";
import type { ProductCardData, ProductMedia, ProductVariant } from "@/lib/catalog/types";
import { variantAvailability } from "@/lib/catalog/product-utils";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
import { toast } from "@/stores/ui-store";

export type PurchaseProduct = {
  id: string;
  slug: string;
  title: string;
  family: string;
  tagline: string;
  summary: string;
  priceConfirmed: boolean;
  variant: ProductVariant;
  media: ProductMedia | null;
};

export function ProductPurchase({ product, family }: { product: PurchaseProduct; family: ProductCardData[] }) {
  const { variant } = product;
  const [quantity, setQuantity] = useState(1);
  const availability = variantAvailability(variant.stock);
  const soldOut = availability === "out-of-stock";
  const colorway = variant.options.colorway ? COLORWAYS[variant.options.colorway as keyof typeof COLORWAYS] : null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wished = useWishlistStore((s) => s.items.some((i) => i.productId === product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);

  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = () =>
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        variantId: variant.id,
        variantTitle: variant.title,
        sku: variant.sku,
        priceMinor: variant.priceMinor,
        stock: variant.stock,
        media: product.media,
      },
      quantity,
    );

  return (
    <div>
      <p className="type-eyebrow text-ink/50">{product.family}</p>
      <h1 className="type-display mt-4 text-[clamp(2.4rem,4.4vw,4rem)]">{colorway?.name ?? product.title}</h1>
      <p className="mt-3 text-lg text-ink/70">{product.tagline}</p>

      <div className="mt-6">
        <Price minor={variant.priceMinor} compareAtMinor={variant.compareAtMinor} className="text-2xl" />
      </div>
      {!product.priceConfirmed ? (
        <DevNotice className="mt-3">Preview price. The real number drops with the launch.</DevNotice>
      ) : null}

      <p className="mt-6 text-[15px] leading-relaxed text-ink/70">{product.summary}</p>

      {family.length > 1 ? (
        <div className="mt-8">
          <p className="text-sm">
            <span className="text-ink/55">Colorway:</span> <span className="font-medium">{colorway?.name}</span>
          </p>
          <ul className="mt-3 grid grid-cols-4 gap-2">
            {family.map((p) => {
              const c = p.colorway ? COLORWAYS[p.colorway] : null;
              const current = p.slug === product.slug;
              return (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    scroll={false}
                    aria-current={current ? "page" : undefined}
                    aria-label={c?.name ?? p.title}
                    className={cn(
                      "group block overflow-hidden rounded-[var(--radius-md)] ring-1 ring-inset transition-shadow",
                      current ? "ring-2 ring-ink" : "ring-line hover:ring-ink/40",
                    )}
                  >
                    <ProductImage
                      media={
                        c && p.primary
                          ? { ...p.primary, url: `/products/racket75-${c.id}-front.webp`, alt: `RACKET K75 in ${c.name}, front view` }
                          : p.primary
                      }
                      fit="contain"
                      sizes="120px"
                      className="aspect-[4/3]"
                      imageClassName="p-1.5 transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <p className={cn("mt-1.5 truncate text-center text-[12px]", current ? "text-ink" : "text-ink/55")}>{c?.shortName}</p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div ref={ctaRef} className="mt-8 flex items-center gap-3">
        <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(1, Math.min(MAX_LINE_QUANTITY, variant.stock))} />
        <Button size="lg" className="flex-1" onClick={add} disabled={soldOut}>
          <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
          {soldOut ? "Sold out" : "Add to cart"}
        </Button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            const added = toggleWish({
              productId: product.id,
              slug: product.slug,
              title: product.title,
              priceFromMinor: variant.priceMinor,
              media: product.media,
            });
            toast({ title: added ? "Saved to wishlist" : "Removed from wishlist", description: product.title });
          }}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full ring-1 ring-line-strong ring-inset transition-colors hover:ring-ink"
          aria-label={mounted && wished ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={mounted && wished}
        >
          <Heart className={cn("h-5 w-5", mounted && wished && "fill-ink")} strokeWidth={1.6} />
        </motion.button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <AvailabilityLabel availability={availability} stock={variant.stock} className="text-ink/65" />
        <span className="type-meta text-ink/45">SKU {variant.sku}</span>
      </div>

      <AnimatePresence>
        {showSticky ? (
          <motion.div
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            exit={{ y: "120%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-2 bottom-2 z-40 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[420px]"
          >
            <div className="flex items-center gap-3 rounded-[20px] bg-paper/90 p-2 pr-2 shadow-[0_20px_60px_-20px_rgb(17_18_22/0.45)] ring-1 ring-line backdrop-blur-xl">
              <ProductImage media={product.media} sizes="56px" className="h-14 w-14 shrink-0 rounded-[14px]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.title}</p>
                <Price minor={variant.priceMinor} className="text-sm text-ink/65" />
              </div>
              <Button onClick={add} disabled={soldOut}>
                {soldOut ? "Sold out" : "Add to cart"}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { Heart, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { COLORWAYS } from "@/config/colorways";
import { addToCart } from "@/lib/cart/add-to-cart";
import type { ProductCardData } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
import { toast } from "@/stores/ui-store";
import { AvailabilityLabel, Price, ProductBadgePill } from "@/components/ui/primitives";
import { ProductImage } from "./product-image";

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  className,
}: {
  product: ProductCardData;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const href = `/products/${product.slug}`;
  const colorway = product.colorway ? COLORWAYS[product.colorway] : null;
  const quick = product.quickAdd[product.colorway ?? "default"] ?? Object.values(product.quickAdd)[0] ?? null;
  const soldOut = product.availability === "out-of-stock";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wished = useWishlistStore((s) => s.items.some((i) => i.productId === product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);

  return (
    <article className={cn("group/card relative", className)}>
      <div className="relative overflow-hidden rounded-[var(--radius-lg)]">
        <Link href={href} aria-label={product.title} className="block">
          <ProductImage
            media={product.primary}
            sizes={sizes}
            priority={priority}
            className="aspect-[3/2]"
            fit="cover"
            imageClassName="object-center transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.04]"
          />
          {product.secondary ? (
            <ProductImage
              media={product.secondary}
              sizes={sizes}
              className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-[var(--ease-out-quart)] group-hover/card:opacity-100 max-md:hidden"
              imageClassName="scale-[1.06] transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover/card:scale-100"
            />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          <div className="flex gap-1.5">
            {product.badges.map((b) => (
              <ProductBadgePill key={b} badge={b} />
            ))}
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              const added = toggleWish({
                productId: product.id,
                slug: product.slug,
                title: product.title,
                priceFromMinor: product.priceFromMinor,
                media: product.primary,
              });
              toast({ title: added ? "Saved to wishlist" : "Removed from wishlist", description: product.title });
            }}
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-paper/80 text-ink backdrop-blur-md transition-colors hover:bg-paper"
            aria-label={mounted && wished ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
            aria-pressed={mounted && wished}
          >
            <Heart className={cn("h-[17px] w-[17px] transition-colors", mounted && wished && "fill-ink")} strokeWidth={1.6} />
          </motion.button>
        </div>

        {quick && !soldOut ? (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100 max-md:hidden">
            <button
              type="button"
              onClick={() =>
                addToCart({
                  productId: product.id,
                  slug: product.slug,
                  title: product.title,
                  variantId: quick.variantId,
                  variantTitle: quick.title,
                  sku: quick.sku,
                  priceMinor: quick.priceMinor,
                  stock: quick.stock,
                  media: product.primary,
                })
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink/90 text-sm font-medium text-paper backdrop-blur-md transition-colors hover:bg-ink"
            >
              <Plus className="h-4 w-4" /> Quick add
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <h3 className="text-[15px] font-medium tracking-[-0.01em]">
            <Link href={href} tabIndex={-1} className="hover:underline hover:underline-offset-4">
              {product.family}
            </Link>
          </h3>
          <p className="mt-0.5 flex items-center gap-2 text-sm text-ink/55">
            {colorway ? (
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10 ring-inset"
                style={{ background: `linear-gradient(135deg, ${colorway.swatch} 0 55%, ${colorway.swatchAlt} 55%)` }}
                aria-hidden
              />
            ) : null}
            <span className="truncate">{colorway?.name ?? product.tagline}</span>
          </p>
        </div>
        <div className="shrink-0 text-right">
          <Price minor={product.priceFromMinor} toMinor={product.priceToMinor} prefixFrom className="text-[15px]" />
          {!product.priceConfirmed ? <p className="type-meta mt-0.5 text-[10px] text-ink/40">Preview price</p> : null}
        </div>
      </div>
      {product.availability !== "in-stock" ? (
        <AvailabilityLabel availability={product.availability} className="mt-2 px-1 text-ink/60" />
      ) : null}
    </article>
  );
}

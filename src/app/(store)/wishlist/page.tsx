"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ProductImage } from "@/components/product/product-image";
import { ArrowGlyph, Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Price } from "@/components/ui/primitives";
import { useWishlistStore } from "@/stores/wishlist-store";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useWishlistStore.persist.hasHydrated()) setHydrated(true);
    return useWishlistStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return (
    <div className="container-racket pt-[calc(var(--header-h)+3rem)] pb-24">
      <h1 className="type-display text-[clamp(2.8rem,7vw,6rem)]">Wishlist.</h1>
      {hydrated && items.length === 0 ? (
        <EmptyState
          className="py-24"
          title="No grails yet."
          description="Tap the heart on anything you'd cop. It lives here."
          action={
            <Button asChild>
              <Link href="/collections/keyboards">
                Start hunting <ArrowGlyph />
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li key={item.productId} layout exit={{ opacity: 0, scale: 0.95 }} className="group relative">
                <Link href={`/products/${item.slug}`} className="block">
                  <ProductImage media={item.media} className="aspect-[4/5] rounded-[var(--radius-lg)]" sizes="(min-width: 1024px) 25vw, 50vw" />
                  <p className="mt-3 text-[15px] font-medium">{item.title}</p>
                  <Price minor={item.priceFromMinor} className="text-sm text-ink/65" />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(item.productId)}
                  className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-paper/85 backdrop-blur"
                  aria-label={`Remove ${item.title} from wishlist`}
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

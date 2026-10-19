"use client";

import Link from "next/link";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { CartLineItem, CartSummary } from "@/components/cart/cart-drawer";
import { ArrowGlyph, Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/primitives";
import { useCartStore } from "@/stores/cart-store";

export function CartView() {
  const lines = useCartStore((s) => s.lines);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useCartStore.persist.hasHydrated()) setHydrated(true);
    return useCartStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return (
      <div className="mt-10 space-y-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        className="py-24"
        title="Too quiet in here."
        description="Pick a colorway. Make some noise. It all lands here."
        action={
          <Button asChild>
            <Link href="/collections/keyboards">
              Fix that <ArrowGlyph />
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-12">
      <ul className="divide-y divide-line border-y border-line lg:col-span-8">
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <CartLineItem key={l.variantId} line={l} />
          ))}
        </AnimatePresence>
      </ul>
      <aside className="h-fit rounded-[var(--radius-lg)] bg-bone p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-4">
        <h2 className="type-display-narrow text-xl">Summary</h2>
        <div className="mt-5">
          <CartSummary lines={lines} />
        </div>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">
            Checkout <ArrowGlyph />
          </Link>
        </Button>
        <p className="type-meta mt-3 text-center text-[10.5px] text-ink/45">
          Final prices, shipping and taxes are confirmed at checkout.
        </p>
      </aside>
    </div>
  );
}

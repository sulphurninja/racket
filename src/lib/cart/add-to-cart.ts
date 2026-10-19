"use client";

import type { ProductMedia } from "@/lib/catalog/types";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "@/stores/ui-store";

export type AddableVariant = {
  productId: string;
  slug: string;
  title: string;
  variantId: string;
  variantTitle: string;
  sku: string;
  priceMinor: number;
  stock: number;
  media: ProductMedia | null;
};

/** Adds a variant to the cart and gives consistent feedback everywhere. */
export function addToCart(v: AddableVariant, quantity = 1, openDrawer = true) {
  const { added, capped } = useCartStore.getState().add(
    {
      productId: v.productId,
      slug: v.slug,
      sku: v.sku,
      title: v.title,
      variantTitle: v.variantTitle,
      priceMinor: v.priceMinor,
      stock: v.stock,
      media: v.media,
      variantId: v.variantId,
    },
    quantity,
    { openDrawer },
  );
  if (added === 0) {
    toast({ title: "Maximum quantity reached", description: v.title, tone: "error" });
  } else if (capped) {
    toast({ title: `Added ${added}. That's the most we can hold for you`, description: v.title });
  } else if (!openDrawer) {
    toast({ title: "Added to cart", description: v.title, action: { label: "View", onClick: () => useCartStore.getState().openDrawer() } });
  }
  return added;
}

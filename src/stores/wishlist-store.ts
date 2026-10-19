"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProductMedia } from "@/lib/catalog/types";

export type WishlistItem = {
  productId: string;
  slug: string;
  title: string;
  priceFromMinor: number;
  media: ProductMedia | null;
  addedAt: number;
};

type WishlistState = {
  items: WishlistItem[];
  toggle: (item: Omit<WishlistItem, "addedAt">) => boolean;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
};

/**
 * Guest wishlist persisted locally. Phase 2 merges it into the account
 * wishlist on sign-in.
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        set((s) => ({
          items: exists
            ? s.items.filter((i) => i.productId !== item.productId)
            : [{ ...item, addedAt: Date.now() }, ...s.items],
        }));
        return !exists;
      },
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      has: (productId) => get().items.some((i) => i.productId === productId),
    }),
    {
      name: "racket-wishlist",
      version: 2,
      // v1 stored code-drawn render media; start fresh rather than show broken lines.
      migrate: () => ({ items: [] }) as never,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

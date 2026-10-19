"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clampQuantity } from "@/lib/cart/totals";
import type { ProductMedia } from "@/lib/catalog/types";

export type CartLine = {
  variantId: string;
  productId: string;
  slug: string;
  sku: string;
  title: string;
  variantTitle: string;
  /** Snapshot for display; the server re-prices every line at checkout. */
  priceMinor: number;
  quantity: number;
  /** Stock snapshot at the time of adding; re-validated server-side. */
  stock: number;
  media: ProductMedia | null;
};

type AddInput = Omit<CartLine, "quantity">;

type CartState = {
  lines: CartLine[];
  drawerOpen: boolean;
  /** Increments on every add so UI can play feedback animations. */
  pulse: number;
  lastAdded: { title: string; variantTitle: string } | null;
  add: (line: AddInput, quantity?: number, options?: { openDrawer?: boolean }) => { added: number; capped: boolean };
  addMany: (lines: AddInput[]) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setDrawer: (open: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      drawerOpen: false,
      pulse: 0,
      lastAdded: null,
      add: (input, quantity = 1, options) => {
        const existing = get().lines.find((l) => l.variantId === input.variantId);
        const current = existing?.quantity ?? 0;
        const next = clampQuantity(current + quantity, input.stock);
        const added = next - current;
        if (added <= 0) return { added: 0, capped: true };
        set((s) => ({
          lines: existing
            ? s.lines.map((l) => (l.variantId === input.variantId ? { ...l, ...input, quantity: next } : l))
            : [...s.lines, { ...input, quantity: next }],
          pulse: s.pulse + 1,
          lastAdded: { title: input.title, variantTitle: input.variantTitle },
          drawerOpen: options?.openDrawer ?? s.drawerOpen,
        }));
        return { added, capped: added < quantity };
      },
      addMany: (inputs) => {
        set((s) => {
          const lines = [...s.lines];
          for (const input of inputs) {
            const idx = lines.findIndex((l) => l.variantId === input.variantId);
            if (idx >= 0) {
              lines[idx] = { ...lines[idx], quantity: clampQuantity(lines[idx].quantity + 1, input.stock) };
            } else if (input.stock > 0) {
              lines.push({ ...input, quantity: 1 });
            }
          }
          return { lines, pulse: s.pulse + 1, drawerOpen: true, lastAdded: { title: "Your setup", variantTitle: `${inputs.length} items` } };
        });
      },
      setQuantity: (variantId, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.variantId === variantId ? { ...l, quantity: clampQuantity(quantity, l.stock) } : l))
            .filter((l) => l.quantity > 0),
        })),
      remove: (variantId) => set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      setDrawer: (open) => set({ drawerOpen: open }),
    }),
    {
      name: "racket-cart",
      version: 2,
      // v1 stored code-drawn render media; start fresh rather than show broken lines.
      migrate: () => ({ lines: [] }) as never,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
      skipHydration: true,
    },
  ),
);

export function useCartCount() {
  return useCartStore((s) => s.lines.reduce((acc, l) => acc + l.quantity, 0));
}

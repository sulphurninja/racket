"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { useWishlistStore } from "@/stores/wishlist-store";

/**
 * Client-side store wiring: rehydrates persisted stores after mount (they use
 * skipHydration so server and first client render match), registers global
 * shortcuts, and makes Motion respect the OS reduced-motion setting.
 */
export function StoreProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "racket-cart") useCartStore.persist.rehydrate();
      if (e.key === "racket-wishlist") useWishlistStore.persist.rehydrate();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const { searchOpen, setSearchOpen } = useUIStore.getState();
        setSearchOpen(!searchOpen);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

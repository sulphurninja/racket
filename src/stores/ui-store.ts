"use client";

import { create } from "zustand";

export type Toast = {
  id: number;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error" | "hype";
  /** Auto-dismiss delay in ms. */
  duration?: number;
  image?: { url: string; alt: string };
  action?: { label: string; href?: string; onClick?: () => void };
};

type UIState = {
  searchOpen: boolean;
  mobileNavOpen: boolean;
  quickViewSlug: string | null;
  toasts: Toast[];
  setSearchOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
};

let toastId = 0;

export const useUIStore = create<UIState>()((set) => ({
  searchOpen: false,
  mobileNavOpen: false,
  quickViewSlug: null,
  toasts: [],
  setSearchOpen: (searchOpen) => set({ searchOpen, mobileNavOpen: false }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  openQuickView: (slug) => set({ quickViewSlug: slug }),
  closeQuickView: () => set({ quickViewSlug: null }),
  toast: (t) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), t.duration ?? 3800);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export const toast = (t: Omit<Toast, "id">) => useUIStore.getState().toast(t);

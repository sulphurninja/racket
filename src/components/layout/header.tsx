"use client";

import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AdaptiveLogo } from "@/components/brand/marks";
import { NAV } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useCartCount, useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useUIStore } from "@/stores/ui-store";
import { MegaMenuPanel } from "./mega-menu";

type NavTheme = "light" | "dark";

function useScrollState() {
  const [state, setState] = useState({ scrolled: false, hidden: false, theme: "light" as NavTheme });
  const last = useRef(0);
  const stateRef = useRef(state);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - last.current;
      const scrolled = y > 24;
      let hidden = false;
      if (y > 320 && delta > 4) hidden = true;
      else if (delta < -4 || y <= 320) hidden = false;
      else hidden = stateRef.current.hidden;
      last.current = y;

      let theme: NavTheme = "light";
      const els = document.elementsFromPoint(window.innerWidth / 2, 36);
      for (const el of els) {
        const host = (el as HTMLElement).closest?.("[data-nav-theme]") as HTMLElement | null;
        if (host && !host.closest("header")) {
          theme = host.dataset.navTheme === "dark" ? "dark" : "light";
          break;
        }
      }
      const next = { scrolled, hidden, theme };
      const prev = stateRef.current;
      if (prev.scrolled !== next.scrolled || prev.hidden !== next.hidden || prev.theme !== next.theme) {
        stateRef.current = next;
        setState(next);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const scenes = new MutationObserver(onScroll);
    scenes.observe(document.body, { attributes: true, attributeFilter: ["data-nav-theme"], subtree: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      scenes.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return state;
}

export function Header() {
  const pathname = usePathname();
  const { scrolled, hidden, theme } = useScrollState();
  const [active, setActive] = useState<number | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = useCartCount();
  const pulse = useCartStore((s) => s.pulse);
  const openCart = useCartStore((s) => s.openDrawer);
  const wishCount = useWishlistStore((s) => s.items.length);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setActive(null), [pathname]);

  const dark = theme === "dark" && active === null;
  const solid = scrolled || active !== null;

  const scheduleOpen = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setActive(i), active === null ? 90 : 0);
  };
  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 160);
  };

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[90] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out-expo)]",
          hidden && active === null && "-translate-y-full",
        )}
        onPointerLeave={scheduleClose}
        onKeyDown={(e) => e.key === "Escape" && setActive(null)}
      >
        <div
          className={cn(
            "relative transition-[padding] duration-500 ease-[var(--ease-out-expo)]",
            solid ? "px-2 pt-2 sm:px-3 sm:pt-3" : "px-0 pt-0",
          )}
        >
          <div
            className={cn(
              "relative mx-auto flex h-[var(--header-h)] max-w-[1520px] items-center justify-between gap-4 transition-[background-color,border-radius,box-shadow,color,max-width] duration-500 ease-[var(--ease-out-expo)]",
              "px-4 sm:px-6",
              solid
                ? dark
                  ? "h-[60px] rounded-[20px] bg-ink/75 text-paper shadow-[0_10px_40px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/10 backdrop-blur-xl backdrop-saturate-150"
                  : "h-[60px] rounded-[20px] bg-paper/80 text-ink shadow-[0_10px_40px_-24px_rgb(17_18_22/0.35)] ring-1 ring-line backdrop-blur-xl backdrop-saturate-150"
                : dark
                  ? "text-paper"
                  : "text-ink",
              active !== null && "rounded-b-none",
            )}
          >
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                className="-ml-2 grid h-10 w-10 place-items-center rounded-full"
                aria-label="Open menu"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="h-5 w-5" strokeWidth={1.6} />
              </button>
            </div>

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
              aria-label="RACKET home"
            >
              <AdaptiveLogo dark={dark} className="h-6 sm:h-[30px]" />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {NAV.map((item, i) => (
                  <li key={item.label} onPointerEnter={() => scheduleOpen(i)}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative inline-flex h-10 items-center rounded-full px-3.5 text-[13.5px] font-medium tracking-[-0.01em] transition-colors",
                        active === i ? "bg-current/[0.07]" : "hover:bg-current/[0.05]",
                      )}
                      aria-expanded={active === i}
                      aria-haspopup="true"
                      onFocus={() => setActive(i)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group hidden h-10 items-center gap-2 rounded-full pr-2 pl-3 text-[13px] transition-colors hover:bg-current/[0.05] md:inline-flex"
                aria-label="Search (Ctrl K)"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
                <kbd className="type-meta rounded-md px-1.5 py-0.5 text-[10px] opacity-50 ring-1 ring-current/20">⌘K</kbd>
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full md:hidden"
                aria-label="Search"
              >
                <Search className="h-[19px] w-[19px]" strokeWidth={1.6} />
              </button>
              <Link
                href="/account"
                className="hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-current/[0.05] sm:grid"
                aria-label="Account"
              >
                <User className="h-[19px] w-[19px]" strokeWidth={1.6} />
              </Link>
              <Link
                href="/wishlist"
                className="relative hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-current/[0.05] sm:grid"
                aria-label={`Wishlist${mounted && wishCount ? `, ${wishCount} items` : ""}`}
              >
                <Heart className="h-[19px] w-[19px]" strokeWidth={1.6} />
                {mounted && wishCount > 0 && (
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                )}
              </Link>
              <button
                type="button"
                onClick={openCart}
                className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-current/[0.05]"
                aria-label={`Cart${mounted ? `, ${count} items` : ""}`}
              >
                <motion.span
                  key={pulse}
                  initial={pulse ? { scale: 0.8, rotate: -8 } : false}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  className="grid place-items-center"
                >
                  <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.6} />
                </motion.span>
                <AnimatePresence>
                  {mounted && count > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 26 }}
                      className={cn(
                        "absolute top-0.5 right-0 grid h-[18px] min-w-[18px] place-items-center overflow-hidden rounded-full px-1 text-[10px] font-semibold tabular",
                        dark ? "bg-paper text-ink" : "bg-ink text-paper",
                      )}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={count}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {count}
                        </motion.span>
                      </AnimatePresence>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {active !== null && (
              <MegaMenuPanel
                key="mega"
                item={NAV[active]}
                index={active}
                onPointerEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
                onNavigate={() => setActive(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </header>
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-40 hidden bg-ink/10 backdrop-blur-[2px] lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onPointerEnter={scheduleClose}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </>
  );
}

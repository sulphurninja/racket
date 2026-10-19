"use client";

import { Heart, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Logo } from "@/components/brand/marks";
import { Drawer } from "@/components/ui/drawer";
import { NAV } from "@/config/navigation";
import { useUIStore } from "@/stores/ui-store";

export function MobileNav() {
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname, setOpen]);
  const close = () => setOpen(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} side="left" title="Menu" className="lg:hidden">
      <div className="flex h-16 items-center px-5">
        <Logo className="h-5" />
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="mt-2 flex h-12 w-full items-center gap-3 rounded-full bg-ink/[0.05] px-4 text-left text-[15px] text-ink/55"
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={1.6} /> Search keyboards
        </button>
        <nav aria-label="Mobile" className="mt-6 space-y-8">
          {NAV.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 + i * 0.05 }}
            >
              <Link href={item.href} onClick={close} className="type-display text-[2.6rem] leading-none">
                {item.label}
              </Link>
              {item.groups.map((group) => (
                <ul key={group.title} className="mt-4 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} onClick={close} className="flex items-center gap-3 py-1.5 text-[15px] text-ink/75">
                        {link.swatch ? (
                          <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10 ring-inset" style={{ background: link.swatch }} />
                        ) : null}
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </motion.div>
          ))}
        </nav>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-line p-5">
        <Link href="/account" onClick={close} className="flex h-11 items-center justify-center gap-2 rounded-full ring-1 ring-line-strong ring-inset text-sm">
          <User className="h-4 w-4" strokeWidth={1.6} /> Account
        </Link>
        <Link href="/wishlist" onClick={close} className="flex h-11 items-center justify-center gap-2 rounded-full ring-1 ring-line-strong ring-inset text-sm">
          <Heart className="h-4 w-4" strokeWidth={1.6} /> Wishlist
        </Link>
      </div>
    </Drawer>
  );
}

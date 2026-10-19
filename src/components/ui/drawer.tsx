"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Side = "right" | "left" | "bottom" | "top";

const panelMotion: Record<
  Side,
  { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition; className: string }
> = {
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    className: "inset-y-0 right-0 h-dvh w-full max-w-[460px] sm:inset-y-2 sm:right-2 sm:h-[calc(100dvh-1rem)] sm:rounded-[var(--radius-lg)]",
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    className: "inset-y-0 left-0 h-dvh w-full max-w-[460px]",
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    className: "inset-x-0 bottom-0 max-h-[92dvh] w-full rounded-t-[var(--radius-lg)]",
  },
  top: {
    initial: { y: "-8%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-6%", opacity: 0 },
    className: "inset-x-0 top-0 w-full",
  },
};

export function Drawer({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  children,
  className,
  overlayClassName,
  showClose = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: Side;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  showClose?: boolean;
}) {
  const m = panelMotion[side];
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className={cn("fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[3px]", overlayClassName)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className={cn(
                  "fixed z-[61] flex flex-col overflow-hidden bg-paper text-ink shadow-[0_30px_80px_-20px_rgb(17_18_22/0.35)] focus:outline-none",
                  m.className,
                  className,
                )}
                initial={m.initial}
                animate={m.animate}
                exit={m.exit}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Dialog.Title className="sr-only">{title}</Dialog.Title>
                <Dialog.Description className="sr-only">{description ?? title}</Dialog.Description>
                {showClose && (
                  <Dialog.Close
                    className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-ink/5"
                    aria-label="Close"
                  >
                    <X className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </Dialog.Close>
                )}
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

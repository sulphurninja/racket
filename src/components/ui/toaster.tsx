"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useUIStore, type Toast } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function Toaster() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);
  const hype = toasts.filter((t) => t.tone === "hype");
  const rest = toasts.filter((t) => t.tone !== "hype");
  return (
    <>
      <div
        className="pointer-events-none fixed bottom-4 left-4 z-[80] flex w-[min(100%-2rem,24rem)] flex-col items-start gap-2 sm:bottom-6 sm:left-6"
        role="region"
        aria-live="polite"
        aria-label="Drop alerts"
      >
        <AnimatePresence initial={false}>
          {hype.map((t) => (
            <HypeToast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence initial={false}>
          {rest.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[18px] bg-ink py-3 pr-3 pl-4 text-paper shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)]"
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full",
                  t.tone === "error" ? "bg-[#E2614B]" : "bg-paper text-ink",
                )}
              >
                {t.tone === "error" ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.title}</p>
                {t.description ? <p className="line-clamp-2 text-xs leading-relaxed text-paper/60">{t.description}</p> : null}
              </div>
              <ToastAction toast={t} onDismiss={() => dismiss(t.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function HypeToast({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -28, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -16, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="pointer-events-auto flex w-full items-center gap-3 rounded-[22px] bg-ink/95 p-2 pr-3 text-paper shadow-[0_24px_60px_-24px_rgb(0_0_0/0.7)] ring-1 ring-white/10 backdrop-blur-xl"
    >
      {toast.image ? (
        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white/10">
          <Image src={toast.image.url} alt={toast.image.alt} fill sizes="64px" className="object-cover object-center scale-110" />
        </span>
      ) : null}
      <div className="min-w-0 flex-1 py-1">
        <p className="truncate text-sm font-medium">{toast.title}</p>
        {toast.description ? <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-paper/60">{toast.description}</p> : null}
      </div>
      <ToastAction toast={toast} onDismiss={onDismiss} hype />
    </motion.div>
  );
}

function ToastAction({ toast, onDismiss, hype = false }: { toast: Toast; onDismiss: () => void; hype?: boolean }) {
  if (!toast.action) return null;
  const className = hype
    ? "relative grid h-11 w-16 shrink-0 place-items-center rounded-[10px] bg-[#d5d5d2] text-[10px] font-semibold tracking-wide text-ink uppercase shadow-[0_1px_0_rgb(255_255_255/0.8)_inset,0_5px_0_#9c9c9a]"
    : "rounded-full bg-paper/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-paper/20";
  if (toast.action.href) {
    return (
      <Link href={toast.action.href} onClick={onDismiss} className={className}>
        {hype ? <span className="absolute inset-[3px] bottom-[7px] rounded-[7px] bg-paper" /> : null}
        <span className={hype ? "relative" : undefined}>{toast.action.label}</span>
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        toast.action?.onClick?.();
        onDismiss();
      }}
      className={className}
    >
      {toast.action.label}
    </button>
  );
}

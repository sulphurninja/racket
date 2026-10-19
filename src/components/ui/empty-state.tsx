"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Emblem } from "@/components/brand/marks";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-16 text-center", className)}>
      <motion.div
        initial={{ rotate: -12, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-7"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-20 w-20 place-items-center rounded-[22px] bg-mist"
        >
          <Emblem className="w-10 opacity-30" title={null} />
        </motion.div>
      </motion.div>
      <h3 className="type-display-narrow text-2xl">{title}</h3>
      {description ? <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">{description}</p> : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}

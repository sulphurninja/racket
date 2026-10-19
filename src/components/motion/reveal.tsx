"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Scroll-triggered editorial reveal (opacity + translate only). */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  amount = 0.25,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Masked line-by-line headline reveal. Pass lines as an array. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h2",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag];
  // The observer watches the heading, not the lines: the lines start translated
  // outside their overflow-hidden masks, so they'd never register as visible.
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      {lines.map((line, i) => (
        <span key={i} className={cn("block overflow-hidden pb-[0.06em] -mb-[0.06em]", lineClassName)}>
          <motion.span
            className="block"
            variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

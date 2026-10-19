"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Swatch({
  color,
  colorAlt,
  label,
  selected,
  disabled,
  onSelect,
  onHover,
  size = "md",
  layoutGroup,
}: {
  color: string;
  colorAlt?: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  onHover?: () => void;
  size?: "sm" | "md" | "lg";
  layoutGroup?: string;
}) {
  const dims = { sm: "h-4 w-4", md: "h-7 w-7", lg: "h-10 w-10" }[size];
  return (
    <button
      type="button"
      aria-label={label + (disabled ? " (sold out)" : "")}
      aria-pressed={selected}
      title={label}
      onClick={onSelect}
      onPointerEnter={onHover}
      onFocus={onHover}
      className={cn("relative grid shrink-0 place-items-center rounded-full p-[3px] outline-offset-2", size === "sm" && "p-[2px]")}
    >
      {selected && (
        <motion.span
          layoutId={layoutGroup ? `swatch-ring-${layoutGroup}` : undefined}
          className="absolute inset-0 rounded-full ring-[1.5px] ring-current"
          transition={{ type: "spring", stiffness: 500, damping: 36 }}
        />
      )}
      <span
        className={cn(dims, "relative block overflow-hidden rounded-full ring-1 ring-black/10 ring-inset")}
        style={{
          background: colorAlt ? `linear-gradient(135deg, ${color} 0 55%, ${colorAlt} 55% 100%)` : color,
        }}
      >
        {disabled && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-[140%] w-px rotate-45 bg-ink/50" />
          </span>
        )}
      </span>
    </button>
  );
}

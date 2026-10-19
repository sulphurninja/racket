import type { ReactNode } from "react";
import { formatMoney } from "@/lib/money";
import type { Availability, ProductBadge } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

export function Price({
  minor,
  toMinor,
  compareAtMinor,
  className,
  prefixFrom = false,
}: {
  minor: number;
  toMinor?: number;
  compareAtMinor?: number | null;
  className?: string;
  prefixFrom?: boolean;
}) {
  const ranged = toMinor != null && toMinor !== minor;
  return (
    <span className={cn("inline-flex items-baseline gap-2 tabular", className)}>
      <span>
        {ranged && prefixFrom ? <span className="mr-1 text-[0.85em] opacity-60">From</span> : null}
        {formatMoney(minor)}
      </span>
      {compareAtMinor && compareAtMinor > minor ? (
        <s className="text-[0.85em] opacity-45">{formatMoney(compareAtMinor)}</s>
      ) : null}
    </span>
  );
}

const badgeTone: Record<ProductBadge, string> = {
  new: "bg-ink text-paper",
  edition: "bg-lavender text-[#241944]",
  drop: "bg-signal text-ink",
};
const badgeLabel: Record<ProductBadge, string> = { new: "New", edition: "Edition", drop: "Drop" };

export function ProductBadgePill({ badge, className }: { badge: ProductBadge; className?: string }) {
  return (
    <span className={cn("type-eyebrow inline-flex h-6 items-center rounded-full px-2.5 text-[10px]", badgeTone[badge], className)}>
      {badgeLabel[badge]}
    </span>
  );
}

export function AvailabilityLabel({ availability, stock, className }: { availability: Availability; stock?: number; className?: string }) {
  const map = {
    "in-stock": { dot: "bg-[#3BB273]", label: "In stock" },
    "low-stock": { dot: "bg-[#E8A33B]", label: stock != null ? `Only ${stock} left` : "Low stock" },
    "out-of-stock": { dot: "bg-slate/50", label: "Sold out" },
  }[availability];
  return (
    <span className={cn("type-meta inline-flex items-center gap-1.5", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", map.dot)} aria-hidden />
      {map.label}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("type-eyebrow text-current/60", className)}>{children}</p>;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-[var(--radius-sm)]", className)} aria-hidden />;
}

export function DevNotice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("type-meta inline-flex items-start gap-2 rounded-[var(--radius-sm)] bg-signal/25 px-3 py-2 text-[11px] leading-snug text-ink/80", className)}>
      <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/70" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  aside,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-4xl">
        {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
        <h2 className="type-display text-[clamp(2.4rem,6.2vw,5.8rem)] text-balance">{title}</h2>
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}

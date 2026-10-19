import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official RACKET marks, cut from the master artwork in assets-source/brand
 * by scripts/process-logos.py.
 *  - metal:    chrome finish, for dark surfaces
 *  - graphite: dark brushed finish, for light surfaces
 */
export const BRAND_ASSETS = {
  lockup: {
    metal: "/brand/racket-lockup-metal.png",
    graphite: "/brand/racket-lockup-graphite.png",
    width: 941,
    height: 208,
  },
  emblem: {
    metal: "/brand/racket-emblem-metal.png",
    graphite: "/brand/racket-emblem-graphite.png",
    width: 832,
    height: 703,
  },
} as const;

export type MarkTone = "metal" | "graphite";

type MarkProps = {
  tone?: MarkTone;
  className?: string;
  /** Accessible name; pass null when the mark sits inside a labelled link. */
  title?: string | null;
  priority?: boolean;
};

function Mark({
  asset,
  tone = "graphite",
  className,
  title = "RACKET",
  priority,
}: MarkProps & { asset: keyof typeof BRAND_ASSETS }) {
  const a = BRAND_ASSETS[asset];
  return (
    <Image
      src={a[tone]}
      width={a.width}
      height={a.height}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      priority={priority}
      unoptimized
      draggable={false}
      className={cn("h-auto w-auto shrink-0 select-none", className)}
    />
  );
}

export function Logo(props: MarkProps) {
  return <Mark asset="lockup" {...props} />;
}

export function Emblem(props: MarkProps) {
  return <Mark asset="emblem" {...props} />;
}

/**
 * Lockup that cross-fades between finishes, for surfaces that change
 * between light and dark (the header over editorial sections).
 */
export function AdaptiveLogo({ dark, className }: { dark: boolean; className?: string }) {
  const { width, height } = BRAND_ASSETS.lockup;
  return (
    <span
      className={cn("relative block h-5", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label="RACKET"
    >
      {(["graphite", "metal"] as const).map((tone) => (
        <Logo
          key={tone}
          tone={tone}
          title={null}
          priority
          className={cn(
            "absolute inset-0 h-full w-full object-contain transition-opacity duration-500",
            (tone === "metal") === dark ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </span>
  );
}

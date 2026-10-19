import { cn } from "@/lib/utils";

/**
 * A tiny sculpted keycap in a colorway's two tones: case color as the skirt,
 * keycap color on the dished top, with a legend. Used instead of flat swatch dots.
 */
export function Keycap({
  base,
  top,
  legend,
  darkTop = false,
  size = "md",
  className,
}: {
  base: string;
  top: string;
  legend?: string;
  /** Light legend for dark keycap tops. */
  darkTop?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-block shrink-0 rounded-[28%] ring-1 ring-black/10 ring-inset",
        "shadow-[0_1.5px_0_rgb(0_0_0/0.22),0_6px_12px_-6px_rgb(0_0_0/0.45)]",
        size === "md" ? "h-9 w-9" : "h-[22px] w-[22px]",
        className,
      )}
      style={{ background: `linear-gradient(180deg, ${base}, color-mix(in oklab, ${base} 78%, black))` }}
    >
      <span
        className={cn(
          "absolute rounded-[24%] shadow-[inset_0_1px_0_rgb(255_255_255/0.55),inset_0_-1px_2px_rgb(0_0_0/0.12)]",
          size === "md" ? "inset-x-[4px] top-[3px] bottom-[6px]" : "inset-x-[2.5px] top-[2px] bottom-[4px]",
        )}
        style={{ background: `radial-gradient(120% 90% at 50% 20%, color-mix(in oklab, ${top} 70%, white), ${top})` }}
      />
      {legend && size === "md" ? (
        <span
          className={cn(
            "absolute top-[6px] left-[8px] font-mono text-[7.5px] leading-none font-medium tracking-tight",
            darkTop ? "text-white/70" : "text-black/55",
          )}
        >
          {legend}
        </span>
      ) : null}
    </span>
  );
}

import { Slot } from "radix-ui";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "scene" | "outline-inverse" | "link";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-graphite active:bg-black shadow-[0_4px_0_#0a0a0a,inset_0_1px_0_rgb(255_255_255/0.08)] active:shadow-[0_1px_0_#0a0a0a]",
  secondary: "bg-transparent text-ink ring-1 ring-inset ring-line-strong hover:ring-ink hover:bg-ink/[0.03]",
  ghost: "bg-transparent text-current hover:bg-current/[0.06]",
  inverse: "bg-paper text-ink hover:bg-white shadow-[0_4px_0_rgb(0_0_0/0.18)] active:shadow-[0_1px_0_rgb(0_0_0/0.18)]",
  scene: "bg-scene-ink text-scene hover:opacity-90 shadow-[0_4px_0_rgb(0_0_0/0.22)] active:shadow-[0_1px_0_rgb(0_0_0/0.22)]",
  "outline-inverse": "bg-transparent text-paper ring-1 ring-inset ring-paper/25 hover:ring-paper/70 hover:bg-paper/5",
  link: "bg-transparent text-current underline-offset-4 hover:underline px-0! h-auto!",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-14 px-7 text-[15px] gap-2.5",
  icon: "h-10 w-10 p-0 justify-center",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", asChild, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        "group/btn relative inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-[-0.01em] whitespace-nowrap select-none",
        "transition-[background-color,box-shadow,color,opacity,transform] duration-100 ease-out active:translate-y-[3px]",
        "disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});

/** Arrow that slides on parent hover — used in CTAs. */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block h-[1em] w-[1.1em] overflow-hidden", className)} aria-hidden>
      <span className="absolute inset-0 flex items-center transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-full">
        →
      </span>
      <span className="absolute inset-0 flex -translate-x-full items-center transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0">
        →
      </span>
    </span>
  );
}

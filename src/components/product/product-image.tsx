import Image from "next/image";
import { getColorway } from "@/config/colorways";
import type { ImageAsset, ProductMedia } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/**
 * Product photography on a colorway-tinted frame. The tint shows while the
 * image loads and behind any letterboxing when `fit="contain"`.
 */
export function ProductImage({
  media,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 33vw, 50vw",
  priority = false,
  fit = "cover",
}: {
  media: ProductMedia | ImageAsset | null;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  const colorway = media && "colorway" in media ? media.colorway : undefined;
  const scene = colorway ? getColorway(colorway).scene : "neutral";
  return (
    <div
      data-scene={scene}
      className={cn("relative isolate overflow-hidden bg-[var(--scene-bg)]", className)}
    >
      {media ? (
        <Image
          src={media.url}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(fit === "cover" ? "object-cover" : "object-contain", imageClassName)}
        />
      ) : null}
    </div>
  );
}

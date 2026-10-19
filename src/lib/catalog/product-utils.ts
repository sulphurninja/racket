import { COLORWAYS, type ColorwayId } from "@/config/colorways";
import type {
  Availability,
  OptionKey,
  Product,
  ProductCardData,
  ProductMedia,
  ProductSwatch,
  ProductVariant,
} from "./types";

export const LOW_STOCK_THRESHOLD = 5;

export function variantAvailability(stock: number): Availability {
  if (stock <= 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function productAvailability(product: Product): Availability {
  const total = product.variants.reduce((acc, v) => acc + Math.max(0, v.stock), 0);
  if (total <= 0) return "out-of-stock";
  const anyHealthy = product.variants.some((v) => v.stock > LOW_STOCK_THRESHOLD);
  return anyHealthy ? "in-stock" : "low-stock";
}

export function productColorways(product: Product): ColorwayId[] {
  const option = product.options.find((o) => o.key === "colorway");
  return (option?.values.map((v) => v.value) ?? []) as ColorwayId[];
}

export function priceRange(product: Product) {
  const prices = product.variants.map((v) => v.priceMinor);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Finds the variant that exactly matches the selected options. */
export function findVariant(
  product: Product,
  selection: Partial<Record<OptionKey, string>>,
): ProductVariant | undefined {
  return product.variants.find((v) =>
    product.options.every((o) => v.options[o.key] === selection[o.key]),
  );
}

/** Default variant: first in-stock variant, otherwise the first variant. */
export function defaultVariant(product: Product, colorway?: string): ProductVariant {
  const pool = colorway
    ? product.variants.filter((v) => v.options.colorway === colorway)
    : product.variants;
  return pool.find((v) => v.stock > 0) ?? pool[0] ?? product.variants[0];
}

/** Whether a given option value can still lead to a purchasable variant. */
export function isOptionValueAvailable(
  product: Product,
  selection: Partial<Record<OptionKey, string>>,
  key: OptionKey,
  value: string,
) {
  return product.variants.some(
    (v) =>
      v.options[key] === value &&
      v.stock > 0 &&
      product.options.every((o) => o.key === key || !selection[o.key] || v.options[o.key] === selection[o.key]),
  );
}

export function mediaForColorway(product: Product, colorway?: string): ProductMedia[] {
  if (!colorway) {
    const first = productColorways(product)[0];
    return first ? product.media.filter((m) => !m.colorway || m.colorway === first) : product.media;
  }
  const matched = product.media.filter((m) => !m.colorway || m.colorway === colorway);
  return matched.length ? matched : product.media;
}

export function mediaForVariant(product: Product, variant?: ProductVariant): ProductMedia[] {
  if (!variant) return mediaForColorway(product);
  if (variant.options.colorway) return mediaForColorway(product, variant.options.colorway);
  // Variants without colorway (e.g. switch packs) pick media matching their option value
  const key = Object.values(variant.options)[0];
  const match = product.media.filter((m) => m.id.endsWith(`-${key}`));
  return match.length ? [...match, ...product.media.filter((m) => !match.includes(m))] : product.media;
}

export function toCardData(product: Product): ProductCardData {
  const { min, max } = priceRange(product);
  const colorways = productColorways(product);
  const nonColorOptions = product.options.filter((o) => o.key !== "colorway");
  const requiresOptions = nonColorOptions.some((o) => o.values.length > 1);

  const swatches: ProductSwatch[] = colorways.map((id) => {
    const media = mediaForColorway(product, id);
    return {
      id,
      name: COLORWAYS[id].name,
      swatch: COLORWAYS[id].swatch,
      swatchAlt: COLORWAYS[id].swatchAlt,
      primary: media.find((m) => m.view === "studio") ?? media[0] ?? null,
      secondary: media.find((m) => m.view === "lifestyle") ?? media[1] ?? null,
      inStock: product.variants.some((v) => v.options.colorway === id && v.stock > 0),
    };
  });

  const quickAdd: ProductCardData["quickAdd"] = {};
  const keys = colorways.length ? colorways : ["default"];
  for (const key of keys) {
    if (requiresOptions) {
      quickAdd[key] = null;
      continue;
    }
    const v = defaultVariant(product, key === "default" ? undefined : key);
    quickAdd[key] = v
      ? { variantId: v.id, sku: v.sku, priceMinor: v.priceMinor, stock: v.stock, title: v.title }
      : null;
  }

  const firstMedia = mediaForVariant(product, defaultVariant(product));
  const comparePrices = product.variants
    .map((v) => v.compareAtMinor)
    .filter((c): c is number => typeof c === "number" && c > 0);

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    family: product.family,
    category: product.category,
    subcategory: product.subcategory,
    tagline: product.tagline,
    priceFromMinor: min,
    priceToMinor: max,
    compareAtMinor: comparePrices.length ? Math.max(...comparePrices) : null,
    availability: productAvailability(product),
    badges: product.badges,
    swatches,
    primary: swatches[0]?.primary ?? firstMedia.find((m) => m.view === "studio") ?? firstMedia[0] ?? null,
    secondary: swatches[0]?.secondary ?? firstMedia[1] ?? null,
    quickAdd,
    requiresOptions,
    colorway: colorways.length === 1 ? colorways[0] : null,
    priceConfirmed: product.priceConfirmed,
    createdAt: product.createdAt,
    featuredRank: product.featured ? (product.featuredRank ?? 99) : null,
  };
}

export const CATEGORY_LABELS: Record<Product["category"], string> = {
  keyboards: "Keyboards",
  "desk-mats": "Desk Mats",
  workspace: "Workspace",
  lifestyle: "Lifestyle",
};

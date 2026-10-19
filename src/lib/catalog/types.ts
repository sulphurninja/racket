import type { ColorwayId } from "@/config/colorways";
import type { MinorUnits } from "@/lib/money";

export type CategorySlug = "keyboards" | "desk-mats" | "workspace" | "lifestyle";

export type MediaView = "studio" | "lifestyle" | "detail" | "top" | "hero" | "front";

export type ProductMedia = {
  id: string;
  alt: string;
  /** Local `/products/...` path in Phase 1, Cloudinary URL from Phase 2. */
  url: string;
  width: number;
  height: number;
  view: MediaView;
  /** When set, media only applies to variants of this colorway. */
  colorway?: ColorwayId;
};

export type ImageAsset = { url: string; alt: string; width: number; height: number };

export type OptionKey = "colorway" | "switch" | "size";

export type ProductOptionValue = {
  value: string;
  label: string;
  hint?: string;
};

export type ProductOption = {
  key: OptionKey;
  name: string;
  values: ProductOptionValue[];
};

export type ProductVariant = {
  id: string;
  sku: string;
  title: string;
  options: Partial<Record<OptionKey, string>>;
  priceMinor: MinorUnits;
  /** Only set when a genuine, verifiable previous price exists. */
  compareAtMinor?: MinorUnits | null;
  stock: number;
};

export type SpecGroup = {
  group: string;
  rows: { label: string; value: string }[];
};

export type Highlight = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image?: ImageAsset;
};

export type ProductBadge = "new" | "edition" | "drop";

export type ProductStatus = "active" | "draft" | "archived";

export type Product = {
  id: string;
  slug: string;
  title: string;
  family: string;
  category: CategorySlug;
  subcategory: string;
  collections: string[];
  tagline: string;
  summary: string;
  description: string[];
  options: ProductOption[];
  variants: ProductVariant[];
  media: ProductMedia[];
  highlights: Highlight[];
  specs: SpecGroup[];
  /** False until specifications are confirmed against final manufacturing data. */
  specsVerified: boolean;
  /** Where unverified specs came from, shown next to the spec table. */
  specsSource?: string;
  /** False while prices are working placeholders awaiting confirmation. */
  priceConfirmed: boolean;
  boxContents: string[];
  compatibility: string[];
  faqs: { q: string; a: string }[];
  badges: ProductBadge[];
  featured: boolean;
  featuredRank?: number;
  status: ProductStatus;
  seo: { title?: string; description?: string };
  createdAt: string;
};

export type Availability = "in-stock" | "low-stock" | "out-of-stock";

export type ProductSwatch = {
  id: ColorwayId;
  name: string;
  swatch: string;
  swatchAlt: string;
  primary: ProductMedia | null;
  secondary: ProductMedia | null;
  inStock: boolean;
};

/** Lightweight shape for cards, search and grids. */
export type ProductCardData = {
  id: string;
  slug: string;
  title: string;
  family: string;
  category: CategorySlug;
  subcategory: string;
  tagline: string;
  priceFromMinor: MinorUnits;
  priceToMinor: MinorUnits;
  compareAtMinor: MinorUnits | null;
  availability: Availability;
  badges: ProductBadge[];
  swatches: ProductSwatch[];
  primary: ProductMedia | null;
  secondary: ProductMedia | null;
  /** Variant used by quick-add per colorway; null when more choices are required. */
  quickAdd: Record<string, { variantId: string; sku: string; priceMinor: MinorUnits; stock: number; title: string } | null>;
  requiresOptions: boolean;
  /** Set when the product is a single-colorway member of a family. */
  colorway: ColorwayId | null;
  priceConfirmed: boolean;
  createdAt: string;
  featuredRank: number | null;
};

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name";

export type CatalogQuery = {
  q?: string;
  category?: CategorySlug;
  collection?: string;
  colors?: ColorwayId[];
  minPriceMinor?: number;
  maxPriceMinor?: number;
  inStockOnly?: boolean;
  sort?: SortKey;
  page?: number;
  perPage?: number;
};

export type CatalogPage = {
  items: ProductCardData[];
  total: number;
  page: number;
  pageCount: number;
  perPage: number;
  facets: {
    colors: { id: ColorwayId; name: string; swatch: string; count: number }[];
    priceMinMinor: number;
    priceMaxMinor: number;
  };
};

export type CollectionKind = "all" | "category" | "colorway" | "edition";

/** A piece of a curated stack. Only `live` pieces are purchasable; the rest are honest teasers. */
export type StackPiece = { label: string; status: "live" | "loading" };

export type CollectionDefinition = {
  slug: string;
  title: string;
  kind: CollectionKind;
  eyebrow: string;
  headline: string;
  description: string;
  scene: ColorwayId | "neutral";
  heroImage: ImageAsset;
  category?: CategorySlug;
  colorway?: ColorwayId;
  /** For curated stacks: what the full combo will include. */
  stack?: StackPiece[];
};

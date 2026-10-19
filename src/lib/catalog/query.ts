import { COLORWAYS, isColorwayId, type ColorwayId } from "@/config/colorways";
import { priceRange, productColorways, toCardData } from "./product-utils";
import type { CatalogPage, CatalogQuery, CategorySlug, Product, SortKey } from "./types";

export const DEFAULT_PER_PAGE = 12;
export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
];

const CATEGORIES: CategorySlug[] = ["keyboards", "desk-mats", "workspace", "lifestyle"];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s%]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Relevance score used by the in-memory search. Mirrors the weighting we'll
 * configure on the MongoDB text index (title > family/category > body).
 */
export function searchScore(product: Product, rawQuery: string): number {
  const q = normalize(rawQuery);
  if (!q) return 1;
  const terms = q.split(" ");
  const title = normalize(product.title);
  const meta = normalize(
    [
      product.family,
      product.category,
      product.subcategory,
      product.tagline,
      ...productColorways(product).flatMap((c) => [COLORWAYS[c].name, COLORWAYS[c].shortName, c]),
    ].join(" "),
  );
  const body = normalize(
    [product.summary, ...product.description, ...product.specs.flatMap((g) => g.rows.map((r) => r.value))].join(" "),
  );

  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += title.startsWith(term) ? 6 : 4;
    else if (meta.includes(term)) score += 2;
    else if (body.includes(term)) score += 1;
    else return 0; // every term must match somewhere
  }
  return score;
}

export function filterProducts(products: Product[], query: CatalogQuery) {
  return products.filter((p) => {
    if (p.status !== "active") return false;
    if (query.category && p.category !== query.category) return false;
    if (query.collection && query.collection !== "all" && !p.collections.includes(query.collection)) return false;
    if (query.colors?.length) {
      const cw = productColorways(p);
      if (!query.colors.some((c) => cw.includes(c))) return false;
    }
    const { min, max } = priceRange(p);
    if (query.minPriceMinor != null && max < query.minPriceMinor) return false;
    if (query.maxPriceMinor != null && min > query.maxPriceMinor) return false;
    if (query.inStockOnly && !p.variants.some((v) => v.stock > 0)) return false;
    if (query.q && searchScore(p, query.q) === 0) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortKey = "featured", q?: string) {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return list.sort((a, b) => priceRange(a).min - priceRange(b).min);
    case "price-desc":
      return list.sort((a, b) => priceRange(b).max - priceRange(a).max);
    case "name":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return list.sort((a, b) => {
        if (q) {
          const diff = searchScore(b, q) - searchScore(a, q);
          if (diff) return diff;
        }
        const ra = a.featured ? (a.featuredRank ?? 99) : 999;
        const rb = b.featured ? (b.featuredRank ?? 99) : 999;
        return ra - rb || b.createdAt.localeCompare(a.createdAt);
      });
  }
}

export function queryCatalog(products: Product[], query: CatalogQuery): CatalogPage {
  const perPage = query.perPage ?? DEFAULT_PER_PAGE;
  // Facets reflect the scope (collection/category/search), ignoring the facet's own filter.
  const scope = filterProducts(products, {
    category: query.category,
    collection: query.collection,
    q: query.q,
  });
  const filtered = sortProducts(filterProducts(products, query), query.sort, query.q);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);
  const items = filtered.slice((page - 1) * perPage, page * perPage).map(toCardData);

  const colorCounts = new Map<ColorwayId, number>();
  for (const p of scope) for (const c of productColorways(p)) colorCounts.set(c, (colorCounts.get(c) ?? 0) + 1);
  const prices = scope.flatMap((p) => p.variants.map((v) => v.priceMinor));

  return {
    items,
    total,
    page,
    pageCount,
    perPage,
    facets: {
      colors: [...colorCounts.entries()]
        .map(([id, count]) => ({ id, name: COLORWAYS[id].name, swatch: COLORWAYS[id].swatch, count }))
        .sort((a, b) => b.count - a.count),
      priceMinMinor: prices.length ? Math.min(...prices) : 0,
      priceMaxMinor: prices.length ? Math.max(...prices) : 0,
    },
  };
}

type RawParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

/** Parses URL search params into a validated CatalogQuery (prices in rupees in the URL). */
export function parseCatalogParams(params: RawParams): CatalogQuery {
  const q = first(params.q)?.slice(0, 80).trim() || undefined;
  const colorParam = first(params.color);
  const colors = colorParam
    ? (colorParam.split(",").filter(isColorwayId) as ColorwayId[])
    : undefined;
  const min = Number(first(params.min));
  const max = Number(first(params.max));
  const sortRaw = first(params.sort) as SortKey | undefined;
  const sort = SORT_OPTIONS.some((s) => s.value === sortRaw) ? sortRaw : undefined;
  const page = Number(first(params.page));
  const category = first(params.category) as CategorySlug | undefined;

  return {
    q,
    colors: colors?.length ? colors : undefined,
    minPriceMinor: Number.isFinite(min) && min > 0 ? Math.round(min * 100) : undefined,
    maxPriceMinor: Number.isFinite(max) && max > 0 ? Math.round(max * 100) : undefined,
    inStockOnly: first(params.stock) === "in",
    sort,
    page: Number.isInteger(page) && page > 0 ? page : undefined,
    category: category && CATEGORIES.includes(category) ? category : undefined,
  };
}

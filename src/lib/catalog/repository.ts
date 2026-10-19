import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { COLLECTIONS, getCollectionDefinition } from "./collections";
import { productColorways, toCardData } from "./product-utils";
import { queryCatalog, searchScore, sortProducts } from "./query";
import { SEED_PRODUCTS } from "./seed-data";
import type { CatalogQuery, Product, ProductCardData } from "./types";

/**
 * Catalog repository — the only module the UI uses to read catalog data.
 *
 * Phase 1: backed by the in-repo development catalog.
 * Phase 2: the `source()` function switches to Mongoose queries; callers and
 * cache tags stay identical, and admin mutations call `revalidateTag`.
 */

export const CATALOG_TAG = "catalog";

async function source(): Promise<Product[]> {
  return SEED_PRODUCTS.filter((p) => p.status === "active");
}

export async function getAllProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  return source();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG, `product:${slug}`);
  const all = await source();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProductSlugs(): Promise<string[]> {
  const all = await getAllProducts();
  return all.map((p) => p.slug);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const all = await source();
  return sortProducts(all.filter((p) => p.featured), "featured").slice(0, limit).map(toCardData);
}

export async function getCatalogPage(query: CatalogQuery) {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);
  const all = await source();
  return queryCatalog(all, query);
}

export async function searchProducts(q: string, limit = 8): Promise<ProductCardData[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);
  const all = await source();
  return all
    .map((p) => ({ p, score: searchScore(p, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => toCardData(r.p));
}

export async function getProductsByCategory(category: Product["category"], limit = 12) {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const all = await source();
  return sortProducts(all.filter((p) => p.category === category), "featured")
    .slice(0, limit)
    .map(toCardData);
}

/** Every product in the same family (including the product itself), in featured order. */
export async function getFamily(slug: string): Promise<ProductCardData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const all = await source();
  const product = all.find((p) => p.slug === slug);
  if (!product) return [];
  return sortProducts(all.filter((p) => p.family === product.family), "featured").map(toCardData);
}

/** Related products: other family members first, then the rest of the category. */
export async function getRelated(slug: string, limit = 4): Promise<ProductCardData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const all = await source();
  const product = all.find((p) => p.slug === slug);
  if (!product) return [];
  const colors = productColorways(product);
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const family = p.family === product.family ? 2 : 0;
      const category = p.category === product.category ? 1 : 0;
      const shared = productColorways(p).some((c) => colors.includes(c)) ? 0.5 : 0;
      return { p, score: family + category + shared };
    })
    .sort((a, b) => b.score - a.score || (a.p.featuredRank ?? 99) - (b.p.featuredRank ?? 99))
    .slice(0, limit)
    .map((r) => toCardData(r.p));
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const all = await source();
  return slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
}

export async function getCollections() {
  return COLLECTIONS;
}

export async function getCollection(slug: string) {
  return getCollectionDefinition(slug) ?? null;
}

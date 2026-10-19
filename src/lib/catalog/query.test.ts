import { describe, expect, it } from "vitest";
import { parseCatalogParams, queryCatalog, searchScore } from "./query";
import { SEED_PRODUCTS } from "./seed-data";

describe("catalog query", () => {
  it("lists every active product in the keyboards collection", () => {
    const page = queryCatalog(SEED_PRODUCTS, { collection: "keyboards" });
    expect(page.total).toBe(SEED_PRODUCTS.length);
    expect(page.items[0].primary?.url).toMatch(/^\/products\/.+\.webp$/);
  });

  it("filters a stack collection down to its product", () => {
    const page = queryCatalog(SEED_PRODUCTS, { collection: "touch-grass" });
    expect(page.items.map((i) => i.slug)).toEqual(["f75-cedar-green"]);
  });

  it("matches colorway names and specs in search", () => {
    const glacier = SEED_PRODUCTS.find((p) => p.slug === "f75-glacier-blue")!;
    expect(searchScore(glacier, "glacier")).toBeGreaterThan(0);
    expect(searchScore(glacier, "hot-swap")).toBeGreaterThan(0);
    expect(searchScore(glacier, "midnight")).toBe(0);
  });

  it("parses URL params defensively", () => {
    expect(parseCatalogParams({ color: "cedar,nope", min: "500", sort: "bogus", page: "-1" })).toMatchObject({
      colors: ["cedar"],
      minPriceMinor: 500_00,
      sort: undefined,
      page: undefined,
    });
  });
});

describe("seed catalog integrity", () => {
  it("stores prices as integer paise and never invents discounts", () => {
    for (const p of SEED_PRODUCTS) {
      for (const v of p.variants) {
        expect(Number.isSafeInteger(v.priceMinor)).toBe(true);
        expect(v.compareAtMinor ?? null).toBeNull();
      }
    }
  });

  it("only references real image files", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    for (const p of SEED_PRODUCTS) {
      for (const m of p.media) expect(existsSync(join(process.cwd(), "public", m.url))).toBe(true);
    }
  });
});

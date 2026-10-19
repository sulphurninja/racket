import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { COLLECTIONS } from "@/lib/catalog/collections";
import { getProductSlugs } from "@/lib/catalog/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProductSlugs();
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...COLLECTIONS.map((c) => ({ url: absoluteUrl(`/collections/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...slugs.map((s) => ({ url: absoluteUrl(`/products/${s}`), changeFrequency: "weekly" as const, priority: 0.9 })),
    ...["about", "shipping", "returns", "warranty", "contact", "privacy", "terms"].map((p) => ({
      url: absoluteUrl(`/pages/${p}`),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}

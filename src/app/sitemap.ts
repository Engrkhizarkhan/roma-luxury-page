import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { getProducts, getTaxonomy } from "@/services/catalog";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections] = await Promise.all([
    getProducts({ publishedOnly: true }),
    getTaxonomy("category", true),
    getTaxonomy("collection", true),
  ]);
  const base = siteUrl();
  const staticPages = ["/", "/products", "/contact"].map((path) => ({
    url: new URL(path, base).href,
    lastModified: new Date(),
    changeFrequency: path === "/" ? ("weekly" as const) : ("daily" as const),
    priority: path === "/" ? 1 : 0.8,
  }));
  return [
    ...staticPages,
    ...products.map((p) => ({
      url: new URL(`/products/${p.slug}`, base).href,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories.map((i) => ({
      url: new URL(`/categories/${i.slug}`, base).href,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...collections.map((i) => ({
      url: new URL(`/collections/${i.slug}`, base).href,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}

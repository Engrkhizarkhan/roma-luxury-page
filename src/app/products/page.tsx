import type { Metadata } from "next";
import { ProductsCatalog } from "@/components/store/ProductsCatalog";
import { getProducts, getTaxonomy } from "@/services/catalog";
import { getSiteSettings } from "@/services/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Fragrance Collection",
  description: "Explore SSAROMA fragrances by collection, concentration, profile and price.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, collections, categories, settings] = await Promise.all([
    getProducts({ publishedOnly: true }),
    getTaxonomy("collection", true),
    getTaxonomy("category", true),
    getSiteSettings(),
  ]);
  return (
    <ProductsCatalog
      products={products}
      collections={collections}
      categories={categories}
      settings={settings}
    />
  );
}

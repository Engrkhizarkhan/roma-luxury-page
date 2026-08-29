import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductsCatalog } from "@/components/store/ProductsCatalog";
import { getProducts, getTaxonomy, getTaxonomyBySlug } from "@/services/catalog";
import { getSiteSettings } from "@/services/settings";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getTaxonomyBySlug("category", slug);
  if (!item) return { title: "Category not found" };
  const title = item.seoTitle || item.name;
  const description = item.seoDescription || item.description;
  return {
    title,
    description,
    alternates: { canonical: `/categories/${item.slug}` },
    openGraph: { title, description, images: item.image ? [item.image.url] : [] },
  };
}
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [item, products, collections, categories, settings] = await Promise.all([
    getTaxonomyBySlug("category", slug),
    getProducts({ publishedOnly: true, categorySlug: slug }),
    getTaxonomy("collection", true),
    getTaxonomy("category", true),
    getSiteSettings(),
  ]);
  if (!item) notFound();
  return (
    <ProductsCatalog
      products={products}
      collections={collections}
      categories={categories}
      settings={settings}
      heading={item.name}
      intro={item.description}
    />
  );
}

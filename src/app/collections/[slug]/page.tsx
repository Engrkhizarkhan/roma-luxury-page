import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductsCatalog } from "@/components/store/ProductsCatalog";
import { getProducts, getTaxonomy, getTaxonomyBySlug } from "@/services/catalog";
import { getSiteSettings } from "@/services/settings";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getTaxonomyBySlug("collection", slug);
  if (!item) return { title: "Collection not found" };
  const title = item.seoTitle || `${item.name} Collection`;
  const description = item.seoDescription || item.description;
  return {
    title,
    description,
    alternates: { canonical: `/collections/${item.slug}` },
    openGraph: { title, description, images: item.image ? [item.image.url] : [] },
  };
}
export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const [item, products, collections, categories, settings] = await Promise.all([
    getTaxonomyBySlug("collection", slug),
    getProducts({ publishedOnly: true, collectionSlug: slug }),
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

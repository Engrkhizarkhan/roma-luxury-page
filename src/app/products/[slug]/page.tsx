import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/ProductDetail";
import { siteUrl } from "@/lib/env";
import { getProductBySlug, getProducts } from "@/services/catalog";
import { getSiteSettings } from "@/services/settings";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Fragrance not found" };
  const title = product.seoTitle || `${product.name} ${product.concentration}`;
  const description = product.seoDescription || `${product.mood}. ${product.story}`.slice(0, 170);
  const image = product.images[0];
  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/products/${product.slug}`,
      images: image ? [image] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, catalog, settings] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ publishedOnly: true }),
    getSiteSettings(),
  ]);
  if (!product) notFound();
  const related = catalog
    .filter((item) => item.id !== product.id)
    .sort(
      (a, b) =>
        Number(b.collectionSlug === product.collectionSlug) -
        Number(a.collectionSlug === product.collectionSlug),
    )
    .slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.story,
    image: product.images,
    sku: product.sku,
    brand: { "@type": "Brand", name: "SSAROMA" },
    offers: {
      "@type": "Offer",
      url: new URL(`/products/${product.slug}`, siteUrl()).href,
      priceCurrency: "PKR",
      price: product.price,
      availability: product.outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
    aggregateRating: product.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        }
      : undefined,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl().href },
      {
        "@type": "ListItem",
        position: 2,
        name: "Fragrances",
        item: new URL("/products", siteUrl()).href,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: new URL(`/products/${product.slug}`, siteUrl()).href,
      },
    ],
  };
  return (
    <>
      <ProductDetail product={product} related={related} catalog={catalog} settings={settings} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([schema, breadcrumb]).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}

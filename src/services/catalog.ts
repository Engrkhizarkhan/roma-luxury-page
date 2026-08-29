import "server-only";

import { connectToDatabase } from "@/lib/db";
import { Category, Collection } from "@/models/taxonomy";
import { Product } from "@/models/product";
import type { MediaItem, ProductItem, TaxonomyItem } from "@/types/domain";
import { cache } from "react";

type LeanRecord = Record<string, any>;

const idOf = (value: unknown) => String((value as { _id?: unknown })?._id ?? value ?? "");

export function serializeMedia(media: LeanRecord, index = 0): MediaItem {
  return {
    id: media.publicId || `${index}`,
    type: media.type === "video" ? "video" : "image",
    url: media.url,
    publicId: media.publicId,
    alt: media.alt || "",
    width: media.width,
    height: media.height,
    format: media.format,
    bytes: media.bytes,
  };
}

export function serializeProduct(product: LeanRecord): ProductItem {
  const collection =
    product.collectionRef && typeof product.collectionRef === "object" ? product.collectionRef : {};
  const category = product.category && typeof product.category === "object" ? product.category : {};
  const media = (product.media ?? []).map(serializeMedia);
  return {
    id: idOf(product),
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    family: product.family,
    gender: product.gender,
    collection: collection.name || "Unassigned",
    collectionSlug: collection.slug || "",
    collectionId: idOf(collection._id || product.collectionRef),
    category: category.name || "Fragrance",
    categorySlug: category.slug || "",
    categoryId: idOf(category._id || product.category),
    concentration: product.concentration,
    sizeMl: product.sizeMl,
    price: product.price,
    compareAt: product.compareAt,
    stock: product.stock,
    outOfStock: product.stock <= 0,
    featured: Boolean(product.featured),
    newArrival: Boolean(product.newArrival),
    published: Boolean(product.published),
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    launchYear: product.launchYear ?? new Date(product.createdAt).getFullYear(),
    mood: product.mood,
    story: product.story,
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    notes: {
      top: product.notes?.top ?? [],
      heart: product.notes?.heart ?? [],
      base: product.notes?.base ?? [],
    },
    media,
    images: media
      .filter((item: MediaItem) => item.type === "image")
      .map((item: MediaItem) => item.url),
    createdAt: new Date(product.createdAt).toISOString(),
    updatedAt: new Date(product.updatedAt).toISOString(),
  };
}

export function serializeTaxonomy(item: LeanRecord): TaxonomyItem {
  return {
    id: idOf(item),
    name: item.name,
    slug: item.slug,
    description: item.description || "",
    seoTitle: item.seoTitle || "",
    seoDescription: item.seoDescription || "",
    image: item.image?.url ? serializeMedia(item.image) : undefined,
    active: Boolean(item.active),
    sortOrder: item.sortOrder ?? 0,
  };
}

const productPopulate = [
  { path: "collectionRef", select: "name slug" },
  { path: "category", select: "name slug" },
];

export async function getProducts(
  options: {
    publishedOnly?: boolean;
    featured?: boolean;
    newArrival?: boolean;
    collectionSlug?: string;
    categorySlug?: string;
    limit?: number;
  } = {},
) {
  await connectToDatabase();
  const filter: LeanRecord = {};
  if (options.publishedOnly) filter.published = true;
  if (typeof options.featured === "boolean") filter.featured = options.featured;
  if (typeof options.newArrival === "boolean") filter.newArrival = options.newArrival;
  if (options.collectionSlug) {
    const collection = await Collection.findOne({ slug: options.collectionSlug, active: true })
      .select("_id")
      .lean();
    if (!collection) return [];
    filter.collectionRef = collection._id;
  }
  if (options.categorySlug) {
    const category = await Category.findOne({ slug: options.categorySlug, active: true })
      .select("_id")
      .lean();
    if (!category) return [];
    filter.category = category._id;
  }
  let query = Product.find(filter)
    .populate(productPopulate)
    .sort({ featured: -1, newArrival: -1, createdAt: -1 });
  if (options.limit) query = query.limit(options.limit);
  return (await query.lean()).map(serializeProduct);
}

export const getProductBySlug = cache(async function getProductBySlug(slug: string) {
  await connectToDatabase();
  const product = await Product.findOne({ slug, published: true }).populate(productPopulate).lean();
  return product ? serializeProduct(product) : null;
});

export async function getTaxonomy(type: "category" | "collection", activeOnly = false) {
  await connectToDatabase();
  const Model = type === "category" ? Category : Collection;
  const items = await Model.find(activeOnly ? { active: true } : {})
    .sort({ sortOrder: 1, name: 1 })
    .lean();
  return items.map(serializeTaxonomy);
}

export const getTaxonomyBySlug = cache(async function getTaxonomyBySlug(
  type: "category" | "collection",
  slug: string,
) {
  await connectToDatabase();
  const Model = type === "category" ? Category : Collection;
  const item = await Model.findOne({ slug, active: true }).lean();
  return item ? serializeTaxonomy(item) : null;
});

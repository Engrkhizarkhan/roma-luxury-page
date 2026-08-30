import { z } from "zod";
import { mediaSchema, objectIdSchema, slugSchema } from "@/validators/common";

const trimmed = (max: number) => z.string().trim().min(1).max(max);
const publicHttpUrl = z.union([
  z
    .url()
    .max(500)
    .refine(
      (value) => {
        try {
          return ["http:", "https:"].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      },
      { message: "URL must use http or https" },
    ),
  z.literal(""),
]);
const imageMediaSchema = mediaSchema.refine((media) => media.type === "image", {
  message: "An image is required",
});
const videoMediaSchema = mediaSchema.refine((media) => media.type === "video", {
  message: "A video is required",
});

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(180),
  password: z.string().min(8).max(200),
});

export const productSchema = z
  .object({
    name: trimmed(120),
    slug: slugSchema,
    sku: z
      .string()
      .trim()
      .min(2)
      .max(60)
      .regex(/^[A-Za-z0-9_-]+$/),
    family: trimmed(160),
    gender: z.enum(["male", "female", "unisex"]),
    collectionId: objectIdSchema,
    categoryId: objectIdSchema,
    concentration: z.enum(["EDT", "EDP", "Parfum", "Extrait"]),
    sizeMl: z.coerce.number().int().min(1).max(1000),
    price: z.coerce.number().int().nonnegative(),
    compareAt: z.coerce.number().int().nonnegative().optional(),
    stock: z.coerce.number().int().nonnegative(),
    featured: z.boolean().default(false),
    newArrival: z.boolean().default(false),
    published: z.boolean().default(false),
    rating: z.coerce.number().min(0).max(5).default(0),
    reviewCount: z.coerce.number().int().nonnegative().default(0),
    launchYear: z.coerce.number().int().min(1900).max(2200),
    mood: trimmed(240),
    story: trimmed(5000),
    seoTitle: z.string().trim().max(70).optional().default(""),
    seoDescription: z.string().trim().max(170).optional().default(""),
    notes: z.object({
      top: z.array(trimmed(60)).min(1).max(20),
      heart: z.array(trimmed(60)).min(1).max(20),
      base: z.array(trimmed(60)).min(1).max(20),
    }),
    media: z.array(mediaSchema).max(12).default([]),
  })
  .refine((value) => new Set(value.media.map((item) => item.type)).size <= 1, {
    message: "A product may use images or videos, but not both.",
    path: ["media"],
  })
  .refine((value) => !value.published || value.media.length > 0, {
    message: "Published products require at least one image or video.",
    path: ["media"],
  });

export const taxonomySchema = z.object({
  name: trimmed(80),
  slug: slugSchema,
  description: z.string().trim().max(1200).default(""),
  seoTitle: z.string().trim().max(70).optional().default(""),
  seoDescription: z.string().trim().max(170).optional().default(""),
  image: mediaSchema.optional(),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(-1000).max(1000).default(0),
});

export const promotionSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2)
      .max(40)
      .regex(/^[A-Za-z0-9_-]+$/)
      .transform((v) => v.toUpperCase()),
    discountType: z.enum(["percent", "amount"]),
    discountValue: z.coerce.number().positive(),
    minOrder: z.coerce.number().nonnegative().default(0),
    validFrom: z.coerce.date(),
    validTo: z.coerce.date(),
    active: z.boolean().default(true),
    usageLimit: z.coerce.number().int().positive().optional(),
  })
  .refine((value) => value.validTo >= value.validFrom, {
    message: "End date must follow start date",
    path: ["validTo"],
  })
  .refine((value) => value.discountType !== "percent" || value.discountValue <= 100, {
    message: "Percentage cannot exceed 100",
    path: ["discountValue"],
  });

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
});

export const returnCreateSchema = z.object({
  orderId: objectIdSchema,
  productId: objectIdSchema,
  reason: trimmed(1000),
  amount: z.coerce.number().positive(),
  condition: z.enum(["Sealed", "Opened", "Courier damage"]),
  refundMethod: z.enum(["Bank transfer", "Store credit"]),
});

export const returnStatusSchema = z.object({
  status: z.enum(["requested", "approved", "received", "refunded", "rejected"]),
});

export const settingsSchema = z.object({
  brandName: trimmed(80),
  city: trimmed(80),
  region: trimmed(100),
  address: trimmed(240),
  hours: trimmed(240),
  email: z.email(),
  phone: z.string().trim().max(24),
  instagramUrl: publicHttpUrl,
  mapUrl: publicHttpUrl,
  siteTitle: trimmed(70),
  siteDescription: trimmed(170),
  heroEyebrow: trimmed(100),
  heroTitle: trimmed(180),
  heroBody: trimmed(600),
  heroMediaType: z.enum(["image", "video"]).default("video"),
  heroSoundEnabled: z.boolean().default(false),
  deliveryFee: z.coerce.number().nonnegative(),
  freeDeliveryThreshold: z.coerce.number().nonnegative(),
  orderConfirmationMessage: trimmed(600),
  home: z.object({
    showHouse: z.boolean().default(true),
    showVisit: z.boolean().default(true),
    showCollection: z.boolean().default(true),
    showGallery: z.boolean().default(true),
    showCta: z.boolean().default(true),
    houseHeading: trimmed(220),
    houseBody: trimmed(1200),
    visitHeading: trimmed(220),
    visitBody: trimmed(1200),
    collectionHeading: trimmed(220),
    collectionBody: trimmed(800),
    galleryQuote: trimmed(300),
    galleryBody: trimmed(800),
    ctaHeading: trimmed(220),
    ctaBody: trimmed(800),
  }),
  logo: imageMediaSchema.optional(),
  heroImage: imageMediaSchema.optional(),
  heroVideo: videoMediaSchema.optional(),
  visitImage: imageMediaSchema.optional(),
  galleryWideImage: imageMediaSchema.optional(),
  galleryDetailImage: imageMediaSchema.optional(),
});

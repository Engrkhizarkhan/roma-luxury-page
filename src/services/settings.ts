import "server-only";

import { connectToDatabase } from "@/lib/db";
import { SiteSettingsModel } from "@/models/site-settings";
import type { SiteSettings } from "@/types/domain";
import { serializeMedia } from "@/services/catalog";

export const initialSettings: SiteSettings = {
  brandName: "SSAROMA",
  brandDisplayType: "text",
  city: "Peshawar",
  region: "Khyber Pakhtunkhwa",
  address: "First Floor, Shop No. 4, MK Tower, Peshawar, Pakistan",
  hours: "Visit details available on request",
  email: "hello@ssaroma.com",
  phone: "",
  instagramUrl: "https://instagram.com/ssaroma",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=MK+Tower%2C+Peshawar",
  siteTitle: "SSAROMA | Fragrance Boutique in Peshawar",
  siteDescription:
    "Find your signature at SSAROMA, an intimate fragrance boutique in Peshawar for unhurried, guided scent discovery.",
  heroEyebrow: "An intimate fragrance house · Peshawar",
  heroTitle: "Find the fragrance that feels like you.",
  heroBody: "A considered edit of fine fragrance, explored slowly and chosen with intention.",
  heroMediaType: "video",
  heroSoundEnabled: false,
  deliveryFee: 350,
  freeDeliveryThreshold: 20000,
  orderConfirmationMessage:
    "Your order has been received. Our team will call to confirm before dispatch.",
  home: {
    showHouse: true,
    showVisit: true,
    showCollection: true,
    showGallery: true,
    showCta: true,
    houseHeading: "You do not choose a signature in a hurry.",
    houseBody:
      "SSAROMA is built around the moment a fragrance stops smelling like a bottle and starts feeling like you. The selection is considered. The guidance is personal. The final decision is always yours.",
    visitHeading: "A room made for taking your time.",
    visitBody:
      "There is no pressure to know the language of perfumery. Come with a feeling, a memory or no idea at all. We will guide the rest.",
    collectionHeading: "Three distinct ways to be remembered.",
    collectionBody:
      "A first look at the SSAROMA edit. Explore the collection online, then visit to understand it on skin.",
    galleryQuote: "Find the fragrance people remember you by.",
    galleryBody:
      "The best fragrance does not announce itself. It becomes part of how people know you.",
    ctaHeading: "Your signature is waiting.",
    ctaBody:
      "Come in, take your time and leave with a fragrance that feels considered—not chosen in a rush.",
  },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  await connectToDatabase();
  const value = await SiteSettingsModel.findOneAndUpdate(
    { key: "primary" },
    { $setOnInsert: { key: "primary", ...initialSettings } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  ).lean();
  return {
    brandName: value.brandName,
    brandDisplayType: value.brandDisplayType === "logo" ? "logo" : "text",
    city: value.city,
    region: value.region,
    address: value.address,
    hours: value.hours,
    email: value.email,
    phone: value.phone || "",
    instagramUrl: value.instagramUrl || "",
    mapUrl: value.mapUrl || "",
    siteTitle: value.siteTitle,
    siteDescription: value.siteDescription,
    heroEyebrow: value.heroEyebrow,
    heroTitle: value.heroTitle,
    heroBody: value.heroBody,
    heroMediaType: value.heroMediaType ?? (value.heroVideo?.url ? "video" : "image"),
    heroSoundEnabled: Boolean(value.heroSoundEnabled),
    deliveryFee: value.deliveryFee,
    freeDeliveryThreshold: value.freeDeliveryThreshold,
    orderConfirmationMessage: value.orderConfirmationMessage,
    home: { ...initialSettings.home, ...(value.home ?? {}) },
    logo: value.logo?.url ? serializeMedia(value.logo) : undefined,
    heroImage: value.heroImage?.url ? serializeMedia(value.heroImage) : undefined,
    heroVideo: value.heroVideo?.url ? serializeMedia(value.heroVideo) : undefined,
    visitImage: value.visitImage?.url ? serializeMedia(value.visitImage) : undefined,
    galleryWideImage: value.galleryWideImage?.url
      ? serializeMedia(value.galleryWideImage)
      : undefined,
    galleryDetailImage: value.galleryDetailImage?.url
      ? serializeMedia(value.galleryDetailImage)
      : undefined,
  };
}

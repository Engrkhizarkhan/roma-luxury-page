import { model, models, Schema } from "mongoose";
import { MediaSchema } from "@/models/media-schema";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, unique: true, default: "primary", immutable: true },
    brandName: { type: String, required: true, trim: true, maxlength: 80 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    region: { type: String, required: true, trim: true, maxlength: 100 },
    address: { type: String, required: true, trim: true, maxlength: 240 },
    hours: { type: String, required: true, trim: true, maxlength: 240 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 180 },
    phone: { type: String, default: "", trim: true, maxlength: 24 },
    instagramUrl: { type: String, default: "", trim: true },
    mapUrl: { type: String, default: "", trim: true },
    siteTitle: { type: String, required: true, trim: true, maxlength: 70 },
    siteDescription: { type: String, required: true, trim: true, maxlength: 170 },
    heroEyebrow: { type: String, required: true, trim: true, maxlength: 100 },
    heroTitle: { type: String, required: true, trim: true, maxlength: 180 },
    heroBody: { type: String, required: true, trim: true, maxlength: 600 },
    heroMediaType: { type: String, enum: ["image", "video"], default: "video" },
    heroSoundEnabled: { type: Boolean, default: false },
    deliveryFee: { type: Number, default: 350, min: 0 },
    freeDeliveryThreshold: { type: Number, default: 20000, min: 0 },
    orderConfirmationMessage: { type: String, required: true, trim: true, maxlength: 600 },
    home: {
      houseHeading: { type: String, required: true, trim: true, maxlength: 220 },
      houseBody: { type: String, required: true, trim: true, maxlength: 1200 },
      visitHeading: { type: String, required: true, trim: true, maxlength: 220 },
      visitBody: { type: String, required: true, trim: true, maxlength: 1200 },
      collectionHeading: { type: String, required: true, trim: true, maxlength: 220 },
      collectionBody: { type: String, required: true, trim: true, maxlength: 800 },
      galleryQuote: { type: String, required: true, trim: true, maxlength: 300 },
      galleryBody: { type: String, required: true, trim: true, maxlength: 800 },
      ctaHeading: { type: String, required: true, trim: true, maxlength: 220 },
      ctaBody: { type: String, required: true, trim: true, maxlength: 800 },
    },
    logo: MediaSchema,
    heroImage: MediaSchema,
    heroVideo: MediaSchema,
  },
  { timestamps: true },
);

export const SiteSettingsModel = models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

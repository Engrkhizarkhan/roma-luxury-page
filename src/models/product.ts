import { model, models, Schema } from "mongoose";
import { MediaSchema } from "@/models/media-schema";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    family: { type: String, required: true, trim: true, maxlength: 160 },
    gender: { type: String, enum: ["male", "female", "unisex"], required: true },
    collectionRef: { type: Schema.Types.ObjectId, ref: "Collection", required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    concentration: { type: String, enum: ["EDT", "EDP", "Parfum", "Extrait"], required: true },
    sizeMl: { type: Number, required: true, min: 1, max: 1000 },
    price: { type: Number, required: true, min: 0 },
    compareAt: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    featured: { type: Boolean, default: false, index: true },
    newArrival: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    launchYear: { type: Number, min: 1900, max: 2200 },
    mood: { type: String, required: true, trim: true, maxlength: 240 },
    story: { type: String, required: true, trim: true, maxlength: 5000 },
    seoTitle: { type: String, maxlength: 70, trim: true },
    seoDescription: { type: String, maxlength: 170, trim: true },
    notes: {
      top: [{ type: String, trim: true, maxlength: 60 }],
      heart: [{ type: String, trim: true, maxlength: 60 }],
      base: [{ type: String, trim: true, maxlength: 60 }],
    },
    media: {
      type: [MediaSchema],
      validate: [
        {
          validator: (value: unknown[]) => value.length <= 12,
          message: "Maximum 12 media items",
        },
        {
          validator: (value: Array<{ type?: string }>) =>
            new Set(value.map((item) => item.type)).size <= 1,
          message: "A product may use images or videos, but not both",
        },
      ],
    },
  },
  { timestamps: true, optimisticConcurrency: true },
);

ProductSchema.index({ published: 1, featured: -1, createdAt: -1 });
ProductSchema.index({ published: 1, newArrival: -1, createdAt: -1 });
ProductSchema.index({ name: "text", family: "text", mood: "text", story: "text" });

export const Product = models.Product || model("Product", ProductSchema);

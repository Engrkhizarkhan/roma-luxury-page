import { model, models, Schema } from "mongoose";
import { MediaSchema } from "@/models/media-schema";

const taxonomyFields = {
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: "", maxlength: 1200, trim: true },
  seoTitle: { type: String, maxlength: 70, trim: true },
  seoDescription: { type: String, maxlength: 170, trim: true },
  image: MediaSchema,
  active: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0, index: true },
};

const CategorySchema = new Schema(taxonomyFields, { timestamps: true });
const CollectionSchema = new Schema(taxonomyFields, { timestamps: true });

CategorySchema.index({ active: 1, sortOrder: 1, name: 1 });
CollectionSchema.index({ active: 1, sortOrder: 1, name: 1 });

export const Category = models.Category || model("Category", CategorySchema);
export const Collection = models.Collection || model("Collection", CollectionSchema);

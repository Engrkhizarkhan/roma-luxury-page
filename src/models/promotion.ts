import { model, models, Schema } from "mongoose";

const PromotionSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percent", "amount"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrder: { type: Number, default: 0, min: 0 },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    active: { type: Boolean, default: true, index: true },
    usageCount: { type: Number, default: 0, min: 0 },
    usageLimit: { type: Number, min: 1 },
  },
  { timestamps: true },
);

PromotionSchema.index({ active: 1, validFrom: 1, validTo: 1 });
export const Promotion = models.Promotion || model("Promotion", PromotionSchema);

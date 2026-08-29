import { model, models, Schema } from "mongoose";

const RateLimitSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false },
);

RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RateLimit = models.RateLimit || model("RateLimit", RateLimitSchema);

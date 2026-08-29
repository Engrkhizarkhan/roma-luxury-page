import { model, models, Schema } from "mongoose";

const ReturnCaseSchema = new Schema(
  {
    returnNumber: { type: String, required: true, unique: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    customerName: { type: String, required: true },
    reason: { type: String, required: true, trim: true, maxlength: 1000 },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["requested", "approved", "received", "refunded", "rejected"],
      default: "requested",
      index: true,
    },
    condition: { type: String, enum: ["Sealed", "Opened", "Courier damage"], required: true },
    refundMethod: { type: String, enum: ["Bank transfer", "Store credit"], required: true },
  },
  { timestamps: true },
);

ReturnCaseSchema.index({ createdAt: -1 });
export const ReturnCaseModel = models.ReturnCase || model("ReturnCase", ReturnCaseSchema);

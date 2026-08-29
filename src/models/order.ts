import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, trim: true },
    customer: {
      name: { type: String, required: true, trim: true, maxlength: 120 },
      email: { type: String, lowercase: true, trim: true, maxlength: 180 },
      phone: { type: String, required: true, trim: true, maxlength: 24 },
    },
    address: {
      street: { type: String, required: true, trim: true, maxlength: 240 },
      city: { type: String, required: true, trim: true, maxlength: 80 },
      postalCode: { type: String, trim: true, maxlength: 20 },
    },
    note: { type: String, trim: true, maxlength: 1000 },
    items: [
      {
        _id: false,
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: String,
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1, max: 9 },
        sizeMl: { type: Number, required: true, min: 1 },
        concentration: { type: String, required: true },
      },
    ],
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    promoCode: { type: String, uppercase: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    statusHistory: [
      {
        _id: false,
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: String,
      },
    ],
  },
  { timestamps: true },
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "customer.phone": 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

export const Order = models.Order || model("Order", OrderSchema);

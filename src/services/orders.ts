import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/order";
import { Product } from "@/models/product";
import { Promotion } from "@/models/promotion";
import { getSiteSettings } from "@/services/settings";
import { calculatePromotion } from "@/services/promotions";
import type { z } from "zod";
import type { checkoutSchema } from "@/validators/public";

type CheckoutInput = z.infer<typeof checkoutSchema>;

function orderNumber() {
  const suffix =
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  return `SSA-${new Date().getFullYear()}-${suffix}`;
}

export async function createOrder(input: CheckoutInput) {
  await connectToDatabase();
  const ids = [...new Set(input.items.map((item) => item.productId))];
  const products = await Product.find({ _id: { $in: ids }, published: true }).lean();
  if (products.length !== ids.length)
    throw Object.assign(new Error("One or more products are no longer available."), {
      statusCode: 400,
    });

  const productMap = new Map(products.map((product) => [String(product._id), product]));
  const items = input.items.map((line) => {
    const product = productMap.get(line.productId);
    if (!product || product.stock < line.quantity)
      throw Object.assign(
        new Error(`${product?.name || "A product"} does not have enough stock.`),
        { statusCode: 409 },
      );
    const image = product.media?.find((item: any) => item.type === "image")?.url;
    return {
      product: product._id,
      name: product.name,
      slug: product.slug,
      image,
      price: product.price,
      quantity: line.quantity,
      sizeMl: product.sizeMl,
      concentration: product.concentration,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const settings = await getSiteSettings();
  const promotion = await calculatePromotion(input.promoCode, subtotal);
  const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const total = Math.max(0, subtotal + deliveryFee - promotion.discount);
  const number = orderNumber();

  const session = await mongoose.startSession();
  try {
    let created: any;
    await session.withTransaction(async () => {
      for (const line of input.items) {
        const updated = await Product.updateOne(
          { _id: line.productId, stock: { $gte: line.quantity } },
          { $inc: { stock: -line.quantity } },
          { session },
        );
        if (updated.modifiedCount !== 1)
          throw Object.assign(
            new Error("Stock changed while placing the order. Please review your bag."),
            { statusCode: 409 },
          );
      }
      [created] = await Order.create(
        [
          {
            orderNumber: number,
            customer: input.customer,
            address: input.address,
            note: input.note,
            items,
            subtotal,
            deliveryFee,
            discount: promotion.discount,
            total,
            promoCode: promotion.code,
            status: "pending",
            statusHistory: [{ status: "pending", changedAt: new Date(), changedBy: "storefront" }],
          },
        ],
        { session },
      );
      if (promotion.promotionId) {
        const filter = promotion.usageLimit
          ? { _id: promotion.promotionId, usageCount: { $lt: promotion.usageLimit } }
          : { _id: promotion.promotionId };
        const redemption = await Promotion.updateOne(
          filter,
          { $inc: { usageCount: 1 } },
          { session },
        );
        if (redemption.modifiedCount !== 1) {
          throw Object.assign(
            new Error("This promotion reached its redemption limit while the order was placed."),
            { statusCode: 409 },
          );
        }
      }
    });
    return {
      orderNumber: created.orderNumber,
      total,
      deliveryFee,
      discount: promotion.discount,
      message: settings.orderConfirmationMessage,
    };
  } finally {
    await session.endSession();
  }
}

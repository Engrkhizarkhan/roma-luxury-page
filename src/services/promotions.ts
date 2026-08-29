import "server-only";

import { connectToDatabase } from "@/lib/db";
import { Promotion } from "@/models/promotion";

export async function calculatePromotion(code: string | undefined, subtotal: number) {
  if (!code?.trim()) return { code: undefined, discount: 0 };
  await connectToDatabase();
  const now = new Date();
  const promo = await Promotion.findOne({
    code: code.trim().toUpperCase(),
    active: true,
    validFrom: { $lte: now },
    validTo: { $gte: now },
  }).lean();
  if (!promo) throw Object.assign(new Error("That promotion is not active."), { statusCode: 400 });
  if (subtotal < promo.minOrder) {
    throw Object.assign(
      new Error(
        `This promotion requires an order of at least PKR ${promo.minOrder.toLocaleString("en-PK")}.`,
      ),
      { statusCode: 400 },
    );
  }
  if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
    throw Object.assign(new Error("This promotion has reached its redemption limit."), {
      statusCode: 400,
    });
  }
  const raw =
    promo.discountType === "percent" ? subtotal * (promo.discountValue / 100) : promo.discountValue;
  return {
    code: promo.code,
    discount: Math.min(subtotal, Math.round(raw)),
    promotionId: String(promo._id),
    usageLimit: promo.usageLimit,
  };
}

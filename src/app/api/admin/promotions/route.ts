import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { Promotion } from "@/models/promotion";
import { serializePromotion } from "@/services/dashboard";
import { promotionSchema } from "@/validators/admin";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const promo = await Promotion.create(promotionSchema.parse(await request.json()));
    return NextResponse.json({ promotion: serializePromotion(promo.toObject()) }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

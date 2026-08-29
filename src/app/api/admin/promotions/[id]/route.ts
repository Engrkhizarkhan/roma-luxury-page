import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertObjectId, assertSameOrigin } from "@/lib/http";
import { Promotion } from "@/models/promotion";
import { serializePromotion } from "@/services/dashboard";
import { promotionSchema } from "@/validators/admin";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const { id } = await context.params;
    assertObjectId(id);
    const input = promotionSchema.partial().parse(await request.json());
    const promo = await Promotion.findByIdAndUpdate(id, input, {
      returnDocument: "after",
      runValidators: true,
    }).lean();
    if (!promo) throw Object.assign(new Error("Promotion not found"), { statusCode: 404 });
    return NextResponse.json({ promotion: serializePromotion(promo) });
  } catch (error) {
    return apiError(error);
  }
}
export async function DELETE(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const { id } = await context.params;
    assertObjectId(id);
    if (!(await Promotion.findByIdAndDelete(id)))
      throw Object.assign(new Error("Promotion not found"), { statusCode: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

import { NextResponse } from "next/server";
import { apiError, assertJsonRequest, assertSameOrigin, getClientIp } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createOrder } from "@/services/orders";
import { checkoutSchema } from "@/validators/public";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    await enforceRateLimit(`checkout:${getClientIp(request)}`, 10, 15 * 60);
    const result = await createOrder(checkoutSchema.parse(await request.json()));
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

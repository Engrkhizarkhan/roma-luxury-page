import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, assertJsonRequest, assertSameOrigin, getClientIp } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";
import { calculatePromotion } from "@/services/promotions";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    await enforceRateLimit(`promo:${getClientIp(request)}`, 30, 15 * 60);
    const input = z
      .object({ code: z.string().trim().min(1).max(40), subtotal: z.number().nonnegative() })
      .parse(await request.json());
    return NextResponse.json(await calculatePromotion(input.code, input.subtotal));
  } catch (error) {
    return apiError(error);
  }
}

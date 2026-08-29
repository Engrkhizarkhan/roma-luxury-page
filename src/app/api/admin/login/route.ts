import { NextResponse } from "next/server";
import { authenticateAdmin, createSession } from "@/lib/auth";
import { apiError, assertJsonRequest, assertSameOrigin, getClientIp } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/validators/admin";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    await enforceRateLimit(`admin-login:${getClientIp(request)}`, 8, 15 * 60);
    const input = loginSchema.parse(await request.json());
    const admin = await authenticateAdmin(input.username, input.password);
    if (!admin)
      throw Object.assign(new Error("Invalid username or password."), { statusCode: 401 });
    await createSession({ sub: admin.id, username: admin.username, role: admin.role });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

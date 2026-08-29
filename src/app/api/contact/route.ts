import { NextResponse } from "next/server";
import { apiError, assertJsonRequest, assertSameOrigin, getClientIp } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";
import { connectToDatabase } from "@/lib/db";
import { ContactSubmission } from "@/models/contact";
import { contactSchema } from "@/validators/public";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    await enforceRateLimit(`contact:${getClientIp(request)}`, 5, 60 * 60);
    const input = contactSchema.parse(await request.json());
    if (input.website) return NextResponse.json({ ok: true }, { status: 201 });
    await connectToDatabase();
    const { website: _honeypot, ...data } = input;
    await ContactSubmission.create(data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertObjectId, assertSameOrigin } from "@/lib/http";
import { ContactSubmission } from "@/models/contact";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const { id } = await context.params;
    assertObjectId(id);
    const { status } = z
      .object({ status: z.enum(["new", "read", "resolved"]) })
      .parse(await request.json());
    const item = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after", runValidators: true },
    ).lean();
    if (!item) throw Object.assign(new Error("Enquiry not found"), { statusCode: 404 });
    return NextResponse.json({ ok: true, status: item.status });
  } catch (error) {
    return apiError(error);
  }
}

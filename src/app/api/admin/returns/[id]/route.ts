import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertObjectId, assertSameOrigin } from "@/lib/http";
import { ReturnCaseModel } from "@/models/return-case";
import { serializeReturnCase } from "@/services/dashboard";
import { returnStatusSchema } from "@/validators/admin";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const { id } = await context.params;
    assertObjectId(id);
    const { status } = returnStatusSchema.parse(await request.json());
    const current = await ReturnCaseModel.findById(id);
    if (!current) throw Object.assign(new Error("Return case not found"), { statusCode: 404 });
    if (current.status === status) {
      await current.populate("order", "orderNumber");
      return NextResponse.json({ returnCase: serializeReturnCase(current.toObject()) });
    }
    const transitions: Record<string, string[]> = {
      requested: ["approved", "rejected"],
      approved: ["received", "rejected"],
      received: ["refunded"],
      refunded: [],
      rejected: [],
    };
    if (!transitions[current.status]?.includes(status)) {
      throw Object.assign(new Error(`A return cannot move from ${current.status} to ${status}.`), {
        statusCode: 409,
      });
    }
    const item = await ReturnCaseModel.findOneAndUpdate(
      { _id: id, status: current.status },
      { status },
      { returnDocument: "after", runValidators: true },
    )
      .populate("order", "orderNumber")
      .lean();
    if (!item) {
      throw Object.assign(new Error("The return case changed. Refresh and try again."), {
        statusCode: 409,
      });
    }
    return NextResponse.json({ returnCase: serializeReturnCase(item) });
  } catch (error) {
    return apiError(error);
  }
}

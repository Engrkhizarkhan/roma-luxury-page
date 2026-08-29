import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertObjectId, assertSameOrigin } from "@/lib/http";
import { Order } from "@/models/order";
import { Product } from "@/models/product";
import { serializeOrder } from "@/services/dashboard";
import { orderStatusSchema } from "@/validators/admin";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdminApi();
    await connectToDatabase();
    const { id } = await context.params;
    assertObjectId(id);
    const { status } = orderStatusSchema.parse(await request.json());
    const session = await mongoose.startSession();
    let order;
    try {
      await session.withTransaction(async () => {
        const current = await Order.findById(id).session(session);
        if (!current) throw Object.assign(new Error("Order not found"), { statusCode: 404 });
        if (current.status === status) {
          order = current.toObject();
          return;
        }
        const transitions: Record<string, string[]> = {
          pending: ["processing", "cancelled"],
          processing: ["shipped", "cancelled"],
          shipped: ["delivered", "cancelled"],
          delivered: [],
          cancelled: [],
        };
        if (!transitions[current.status]?.includes(status)) {
          throw Object.assign(
            new Error(`An order cannot move from ${current.status} to ${status}.`),
            { statusCode: 409 },
          );
        }
        if (status === "cancelled" && current.status !== "cancelled") {
          for (const item of current.items)
            await Product.updateOne(
              { _id: item.product },
              { $inc: { stock: item.quantity } },
              { session },
            );
        }
        order = await Order.findOneAndUpdate(
          { _id: id, status: current.status },
          {
            $set: { status },
            $push: { statusHistory: { status, changedAt: new Date(), changedBy: admin.username } },
          },
          { returnDocument: "after", runValidators: true, session },
        ).lean();
        if (!order) {
          throw Object.assign(new Error("The order changed. Refresh and try again."), {
            statusCode: 409,
          });
        }
      });
    } finally {
      await session.endSession();
    }
    return NextResponse.json({ order: serializeOrder(order) });
  } catch (error) {
    return apiError(error);
  }
}

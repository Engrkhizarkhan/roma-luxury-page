import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { Order } from "@/models/order";
import { ReturnCaseModel } from "@/models/return-case";
import { serializeReturnCase } from "@/services/dashboard";
import { returnCreateSchema } from "@/validators/admin";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const input = returnCreateSchema.parse(await request.json());
    const order = await Order.findById(input.orderId);
    if (!order) throw Object.assign(new Error("Order not found"), { statusCode: 404 });
    if (order.status !== "delivered") {
      throw Object.assign(new Error("Returns can only be opened for delivered orders."), {
        statusCode: 409,
      });
    }
    const orderItem = order.items.find((item: any) => String(item.product) === input.productId);
    if (!orderItem)
      throw Object.assign(new Error("Product is not part of this order"), { statusCode: 400 });
    const existing = await ReturnCaseModel.aggregate<{ amount: number }>([
      {
        $match: {
          order: order._id,
          product: orderItem.product,
          status: { $ne: "rejected" },
        },
      },
      { $group: { _id: null, amount: { $sum: "$amount" } } },
    ]);
    const itemGross = orderItem.price * orderItem.quantity;
    const discountShare = order.subtotal
      ? Math.round((order.discount * itemGross) / order.subtotal)
      : 0;
    const remaining = Math.max(0, itemGross - discountShare - (existing[0]?.amount || 0));
    if (input.amount > remaining) {
      throw Object.assign(
        new Error(`Refund amount exceeds the remaining PKR ${remaining.toLocaleString("en-PK")}.`),
        { statusCode: 409 },
      );
    }
    const returnCase = await ReturnCaseModel.create({
      ...input,
      order: order._id,
      product: orderItem.product,
      productName: orderItem.name,
      customerName: order.customer.name,
      returnNumber: `RET-${Date.now().toString(36).toUpperCase()}`,
    });
    await returnCase.populate("order", "orderNumber");
    return NextResponse.json(
      { returnCase: serializeReturnCase(returnCase.toObject()) },
      { status: 201 },
    );
  } catch (error) {
    return apiError(error);
  }
}

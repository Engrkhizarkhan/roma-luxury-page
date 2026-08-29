import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertObjectId, assertSameOrigin } from "@/lib/http";
import { deleteMedia } from "@/lib/cloudinary";
import { Product } from "@/models/product";
import { Order } from "@/models/order";
import { Category, Collection } from "@/models/taxonomy";
import { serializeProduct } from "@/services/catalog";
import { productSchema } from "@/validators/admin";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const { id } = await context.params;
    assertObjectId(id);
    const input = productSchema.parse(await request.json());
    const taxonomyFilter = input.published ? { active: true } : {};
    const [category, collection] = await Promise.all([
      Category.exists({ _id: input.categoryId, ...taxonomyFilter }),
      Collection.exists({ _id: input.collectionId, ...taxonomyFilter }),
    ]);
    if (!category || !collection) {
      throw Object.assign(new Error("Choose an existing category and collection."), {
        statusCode: 400,
      });
    }
    const existing = await Product.findById(id).select("media").lean();
    if (!existing) throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    const product = await Product.findByIdAndUpdate(
      id,
      { ...input, collectionRef: input.collectionId, category: input.categoryId },
      { returnDocument: "after", runValidators: true },
    ).populate([
      { path: "collectionRef", select: "name slug" },
      { path: "category", select: "name slug" },
    ]);
    if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    const retained = new Set(input.media.map((item) => item.publicId));
    const removed = (existing.media || []).filter((item: any) => !retained.has(item.publicId));
    const removals = await Promise.allSettled(
      removed.map((item: any) => deleteMedia(item.publicId, item.type)),
    );
    if (removals.some((result) => result.status === "rejected"))
      console.error("Some replaced product media could not be deleted", removals);
    return NextResponse.json({ product: serializeProduct(product.toObject()) });
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
    if (await Order.exists({ "items.product": id })) {
      throw Object.assign(
        new Error("This product belongs to order history. Unpublish it instead of deleting it."),
        { statusCode: 409 },
      );
    }
    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    const results = await Promise.allSettled(
      (product.media || []).map((item: any) => deleteMedia(item.publicId, item.type)),
    );
    if (results.some((result) => result.status === "rejected"))
      console.error("Some deleted product media could not be removed from Cloudinary", results);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

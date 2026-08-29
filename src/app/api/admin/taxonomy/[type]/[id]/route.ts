import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertObjectId, assertSameOrigin } from "@/lib/http";
import { Category, Collection } from "@/models/taxonomy";
import { Product } from "@/models/product";
import { deleteMedia } from "@/lib/cloudinary";
import { serializeTaxonomy } from "@/services/catalog";
import { taxonomySchema } from "@/validators/admin";

type Context = { params: Promise<{ type: string; id: string }> };
const modelFor = (type: string) =>
  type === "categories" ? Category : type === "collections" ? Collection : null;

export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const { type, id } = await context.params;
    assertObjectId(id);
    const Model = modelFor(type);
    if (!Model) throw Object.assign(new Error("Unknown taxonomy type"), { statusCode: 404 });
    const input = taxonomySchema.parse(await request.json());
    const field = type === "categories" ? "category" : "collectionRef";
    if (!input.active && (await Product.exists({ [field]: id, published: true }))) {
      throw Object.assign(
        new Error("Unpublish or reassign linked public products before hiding this item."),
        { statusCode: 409 },
      );
    }
    const existing = await Model.findById(id).select("image").lean();
    const item = await Model.findByIdAndUpdate(id, input, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!item) throw Object.assign(new Error("Taxonomy item not found"), { statusCode: 404 });
    if (existing?.image?.publicId && existing.image.publicId !== input.image?.publicId) {
      await deleteMedia(existing.image.publicId, existing.image.type).catch((error) =>
        console.error("Replaced taxonomy image could not be deleted", error),
      );
    }
    return NextResponse.json({ item: serializeTaxonomy(item.toObject()) });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const { type, id } = await context.params;
    assertObjectId(id);
    const Model = modelFor(type);
    if (!Model) throw Object.assign(new Error("Unknown taxonomy type"), { statusCode: 404 });
    const field = type === "categories" ? "category" : "collectionRef";
    if (await Product.exists({ [field]: id }))
      throw Object.assign(new Error("Reassign products before deleting this item."), {
        statusCode: 409,
      });
    const item = await Model.findByIdAndDelete(id);
    if (!item) throw Object.assign(new Error("Taxonomy item not found"), { statusCode: 404 });
    if (item.image?.publicId)
      await deleteMedia(item.image.publicId, item.image.type).catch((error) =>
        console.error("Deleted taxonomy image could not be removed", error),
      );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { Category, Collection } from "@/models/taxonomy";
import { getTaxonomy, serializeTaxonomy } from "@/services/catalog";
import { taxonomySchema } from "@/validators/admin";

type Context = { params: Promise<{ type: string }> };
const modelFor = (type: string) => {
  if (type === "categories") return Category;
  if (type === "collections") return Collection;
  throw Object.assign(new Error("Unknown taxonomy type"), { statusCode: 404 });
};

export async function GET(_request: Request, context: Context) {
  try {
    await requireAdminApi();
    const { type } = await context.params;
    modelFor(type);
    return NextResponse.json({
      items: await getTaxonomy(type === "categories" ? "category" : "collection"),
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const { type } = await context.params;
    const Model = modelFor(type);
    const input = taxonomySchema.parse(await request.json());
    const item = await Model.create(input);
    return NextResponse.json({ item: serializeTaxonomy(item.toObject()) }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

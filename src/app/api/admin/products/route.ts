import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { Product } from "@/models/product";
import { Category, Collection } from "@/models/taxonomy";
import { getProducts, serializeProduct } from "@/services/catalog";
import { productSchema } from "@/validators/admin";

export async function GET() {
  try {
    await requireAdminApi();
    return NextResponse.json({ products: await getProducts() });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
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
    const product = await Product.create({
      ...input,
      collectionRef: input.collectionId,
      category: input.categoryId,
    });
    await product.populate([
      { path: "collectionRef", select: "name slug" },
      { path: "category", select: "name slug" },
    ]);
    return NextResponse.json({ product: serializeProduct(product.toObject()) }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

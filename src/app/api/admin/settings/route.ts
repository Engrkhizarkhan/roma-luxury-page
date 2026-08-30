import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { SiteSettingsModel } from "@/models/site-settings";
import { deleteMedia } from "@/lib/cloudinary";
import { getSiteSettings } from "@/services/settings";
import { settingsSchema } from "@/validators/admin";

export async function GET() {
  try {
    await requireAdminApi();
    return NextResponse.json({ settings: await getSiteSettings() });
  } catch (error) {
    return apiError(error);
  }
}
export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    await connectToDatabase();
    const input = settingsSchema.parse(await request.json());
    const existing = await SiteSettingsModel.findOne({ key: "primary" })
      .select("logo heroImage heroVideo visitImage galleryWideImage galleryDetailImage")
      .lean();
    await SiteSettingsModel.findOneAndUpdate(
      { key: "primary" },
      { $set: input },
      { upsert: true, runValidators: true },
    );
    const removed = (
      [
        "logo",
        "heroImage",
        "heroVideo",
        "visitImage",
        "galleryWideImage",
        "galleryDetailImage",
      ] as const
    ).flatMap((key) => {
      const previous = existing?.[key];
      const next = input[key];
      return previous?.publicId && previous.publicId !== next?.publicId ? [previous] : [];
    });
    const cleanup = await Promise.allSettled(
      removed.map((item) => deleteMedia(item.publicId, item.type)),
    );
    if (cleanup.some((result) => result.status === "rejected"))
      console.error("Some replaced site media could not be deleted", cleanup);
    return NextResponse.json({ settings: await getSiteSettings() });
  } catch (error) {
    return apiError(error);
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/auth";
import { deleteMedia, uploadMedia } from "@/lib/cloudinary";
import { apiError, assertSameOrigin } from "@/lib/http";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    const data = await request.formData();
    const file = data.get("file");
    if (!(file instanceof File))
      throw Object.assign(new Error("A media file is required."), { statusCode: 400 });
    if (file.size === 0)
      throw Object.assign(new Error("The media file is empty."), { statusCode: 400 });
    const isImage = imageTypes.has(file.type);
    const isVideo = videoTypes.has(file.type);
    if (!isImage && !isVideo)
      throw Object.assign(new Error("Unsupported media type."), { statusCode: 415 });
    const max = isImage ? 8 * 1024 * 1024 : 40 * 1024 * 1024;
    if (file.size > max)
      throw Object.assign(new Error(`File exceeds the ${isImage ? 8 : 40} MB limit.`), {
        statusCode: 413,
      });
    const alt = String(data.get("alt") || "")
      .trim()
      .slice(0, 180);
    const media = await uploadMedia(Buffer.from(await file.arrayBuffer()), {
      folder: isVideo ? "ssaroma/products/video" : "ssaroma/products/image",
      resource_type: isVideo ? "video" : "image",
      ...(isImage ? { transformation: [{ quality: "auto", fetch_format: "auto" }] } : {}),
      alt,
    });
    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdminApi();
    const body = z
      .object({
        publicId: z.string().min(1).max(300).startsWith("ssaroma/"),
        type: z.enum(["image", "video"]).default("image"),
      })
      .parse(await request.json());
    await deleteMedia(body.publicId, body.type);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

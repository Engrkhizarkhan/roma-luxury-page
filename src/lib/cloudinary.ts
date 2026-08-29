import "server-only";

import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from "cloudinary";
import { serverEnv } from "@/lib/env";

let configured = false;
function configureCloudinary() {
  if (configured) return;
  cloudinary.config({
    cloud_name: serverEnv.cloudinaryCloudName(),
    api_key: serverEnv.cloudinaryApiKey(),
    api_secret: serverEnv.cloudinaryApiSecret(),
    secure: true,
  });
  configured = true;
}

export type UploadedMedia = {
  type: "image" | "video";
  url: string;
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

export async function uploadMedia(
  buffer: Buffer,
  options: UploadApiOptions & { alt?: string } = {},
) {
  configureCloudinary();
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ssaroma",
        resource_type: "auto",
        overwrite: false,
        unique_filename: true,
        ...options,
      },
      (error, uploaded) =>
        error || !uploaded ? reject(error || new Error("Upload failed")) : resolve(uploaded),
    );
    stream.end(buffer);
  });

  return {
    type: result.resource_type === "video" ? "video" : "image",
    url: result.secure_url,
    publicId: result.public_id,
    alt: options.alt ?? "",
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  } satisfies UploadedMedia;
}

export async function deleteMedia(publicId: string, type: "image" | "video" = "image") {
  configureCloudinary();
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: type,
    invalidate: true,
  });
  if (!["ok", "not found"].includes(result.result))
    throw new Error("Cloudinary media deletion failed");
}

import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid identifier");
export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only");

export const mediaSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.url().startsWith("https://res.cloudinary.com/"),
  publicId: z.string().min(1).max(300),
  alt: z.string().trim().max(180).default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().max(20).optional(),
  bytes: z.number().int().nonnegative().optional(),
});

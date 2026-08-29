import { z } from "zod";
import { objectIdSchema } from "@/validators/common";

export const checkoutSchema = z
  .object({
    customer: z.object({
      name: z.string().trim().min(2).max(120),
      email: z.union([z.email(), z.literal("")]).optional(),
      phone: z
        .string()
        .trim()
        .regex(/^[0-9+() -]{10,24}$/),
    }),
    address: z.object({
      street: z.string().trim().min(5).max(240),
      city: z.string().trim().min(2).max(80),
      postalCode: z.string().trim().max(20).optional(),
    }),
    note: z.string().trim().max(1000).optional(),
    promoCode: z.string().trim().max(40).optional(),
    items: z
      .array(
        z.object({ productId: objectIdSchema, quantity: z.coerce.number().int().min(1).max(9) }),
      )
      .min(1)
      .max(20),
  })
  .refine(
    (value) => new Set(value.items.map((item) => item.productId)).size === value.items.length,
    { message: "Duplicate cart items are not allowed", path: ["items"] },
  );

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(180),
  phone: z.string().trim().max(24).optional(),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(200).optional(),
});

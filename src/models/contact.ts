import { model, models, Schema } from "mongoose";

const ContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 180 },
    phone: { type: String, trim: true, maxlength: 24 },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    status: { type: String, enum: ["new", "read", "resolved"], default: "new", index: true },
  },
  { timestamps: true },
);

ContactSchema.index({ createdAt: -1 });
export const ContactSubmission =
  models.ContactSubmission || model("ContactSubmission", ContactSchema);

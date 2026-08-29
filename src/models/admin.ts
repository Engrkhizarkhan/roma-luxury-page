import { model, models, Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
    lastLoginAt: Date,
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Admin = models.Admin || model("Admin", AdminSchema);

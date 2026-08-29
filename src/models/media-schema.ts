import { Schema } from "mongoose";

export const MediaSchema = new Schema(
  {
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    alt: { type: String, default: "", maxlength: 180, trim: true },
    width: { type: Number, min: 1 },
    height: { type: Number, min: 1 },
    format: { type: String, trim: true },
    bytes: { type: Number, min: 0 },
    position: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

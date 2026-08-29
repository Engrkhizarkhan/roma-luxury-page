import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (forwarded || request.headers.get("x-real-ip") || "unknown").slice(0, 100);
}

export function assertJsonRequest(request: Request, maxBytes = 32 * 1024) {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== "application/json") {
    throw Object.assign(new Error("Content-Type must be application/json"), { statusCode: 415 });
  }
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > maxBytes) {
    throw Object.assign(new Error("Request body is too large"), { statusCode: 413 });
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  try {
    if (!host || new URL(origin).host !== host) {
      throw Object.assign(new Error("Cross-site request rejected"), { statusCode: 403 });
    }
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode) throw error;
    throw Object.assign(new Error("Invalid request origin"), { statusCode: 403 });
  }
}

export function assertObjectId(value: string) {
  if (!isValidObjectId(value))
    throw Object.assign(new Error("Invalid resource identifier"), { statusCode: 400 });
  return value;
}

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", fields: error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const candidate = error as { statusCode?: number; code?: number; message?: string };
  if (candidate?.code === 11000) {
    return NextResponse.json(
      { error: "A record with that unique value already exists." },
      { status: 409 },
    );
  }

  const status =
    candidate?.statusCode && candidate.statusCode >= 400 && candidate.statusCode < 600
      ? candidate.statusCode
      : 500;
  if (status >= 500) console.error(error);
  return NextResponse.json(
    {
      error:
        status >= 500
          ? "The server could not complete this request."
          : candidate.message || "Request failed",
    },
    { status },
  );
}

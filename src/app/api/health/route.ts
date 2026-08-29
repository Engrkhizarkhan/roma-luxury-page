import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    if (!mongoose.connection.db) throw new Error("Database connection is not ready");
    await mongoose.connection.db.admin().ping();
    return NextResponse.json(
      { ok: true, service: "ssaroma", database: "reachable" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Health check failed", error);
    return NextResponse.json(
      { ok: false, service: "ssaroma", database: "unreachable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

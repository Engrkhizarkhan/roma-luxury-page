import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
const SESSION_COOKIE = "ssaroma_admin_session";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET?.trim();
  if (!token || !secret) return NextResponse.redirect(new URL("/admin/login", request.url));
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    if (!payload.sub || payload.role !== "admin" || typeof payload.username !== "string") {
      throw new Error("Invalid administrator session");
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = { matcher: ["/admin/:path*"] };

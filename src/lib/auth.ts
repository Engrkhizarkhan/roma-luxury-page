import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { serverEnv } from "@/lib/env";
import { Admin } from "@/models/admin";

export const SESSION_COOKIE = "ssaroma_admin_session";

type SessionPayload = { sub: string; username: string; role: "admin" };

const sessionKey = () => new TextEncoder().encode(serverEnv.authSecret());

export async function authenticateAdmin(username: string, password: string) {
  await connectToDatabase();
  const normalized = username.trim().toLowerCase();
  const configuredUsername = serverEnv.adminUsername().trim().toLowerCase();

  let admin = await Admin.findOne({ username: normalized }).select("+passwordHash");
  if (!admin && normalized === configuredUsername) {
    const passwordHash = await bcrypt.hash(serverEnv.adminPassword(), 12);
    admin = await Admin.findOneAndUpdate(
      { username: configuredUsername },
      { $setOnInsert: { username: configuredUsername, passwordHash, role: "admin" } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    ).select("+passwordHash");
  }

  if (!admin || admin.disabled || !(await bcrypt.compare(password, admin.passwordHash))) {
    return null;
  }

  admin.lastLoginAt = new Date();
  await admin.save();
  return { id: String(admin._id), username: admin.username, role: "admin" as const };
}

export async function createSession(payload: SessionPayload) {
  const ttl = serverEnv.sessionTtlHours();
  const token = await new SignJWT({ username: payload.username, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttl}h`)
    .sign(sessionKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ttl * 60 * 60,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionKey(), { algorithms: ["HS256"] });
    if (
      !payload.sub ||
      !isValidObjectId(payload.sub) ||
      payload.role !== "admin" ||
      typeof payload.username !== "string"
    )
      return null;
    await connectToDatabase();
    const admin = await Admin.findOne({
      _id: payload.sub,
      username: payload.username,
      role: "admin",
      disabled: false,
    })
      .select("username role")
      .lean();
    if (!admin) return null;
    return { sub: String(admin._id), username: admin.username, role: "admin" };
  } catch {
    return null;
  }
}

export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session) throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  return session;
}

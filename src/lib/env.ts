const required = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const requiredLength = (name: string, minimum: number) => {
  const value = required(name);
  if (value.length < minimum) {
    throw new Error(`${name} must contain at least ${minimum} characters`);
  }
  return value;
};

export const serverEnv = {
  mongodbUri: () => required("MONGODB_URI"),
  cloudinaryCloudName: () => required("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: () => required("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: () => required("CLOUDINARY_API_SECRET"),
  adminUsername: () => required("ADMIN_USERNAME"),
  adminPassword: () => requiredLength("ADMIN_PASSWORD", 12),
  authSecret: () => requiredLength("AUTH_SECRET", 32),
  sessionTtlHours: () => {
    const value = Number(process.env.SESSION_TTL_HOURS ?? "8");
    return Number.isFinite(value) && value > 0 ? Math.min(value, 168) : 8;
  },
};

export const siteUrl = () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured && process.env.NODE_ENV === "production") {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SITE_URL");
  }
  const raw = configured || "http://localhost:3000";
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Unsupported protocol");
    const local = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    if (process.env.NODE_ENV === "production" && !local && url.protocol !== "https:") {
      throw new Error("Production site URL must use HTTPS");
    }
    return url;
  } catch {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_SITE_URL must be a valid HTTPS URL");
    }
    return new URL("http://localhost:3000");
  }
};

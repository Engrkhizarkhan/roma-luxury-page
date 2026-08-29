import type { NextConfig } from "next";

const productionHeaders =
  process.env.NODE_ENV === "production"
    ? [
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src https://www.google.com https://maps.google.com; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com; media-src 'self' blob: https://res.cloudinary.com; font-src 'self' data:; connect-src 'self'; upgrade-insecure-requests",
        },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ]
    : [];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-Accel-Buffering", value: "no" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ...productionHeaders,
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
      {
        source: "/api/admin/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;

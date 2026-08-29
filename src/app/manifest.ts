import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SSAROMA Fragrance Boutique",
    short_name: "SSAROMA",
    description: "An intimate fragrance house in Peshawar.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3efe5",
    theme_color: "#171713",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}

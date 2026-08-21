import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { Header } from "@/components/ssaroma/Header";
import { Hero } from "@/components/ssaroma/Hero";
import {
  Collection,
  Experience,
  FinalCta,
  Footer,
  Gallery,
  Statement,
} from "@/components/ssaroma/Sections";

const title = "SSAROMA | Fragrance Boutique in Peshawar";
const description =
  "Find your signature at SSAROMA, an intimate fragrance boutique in Peshawar for unhurried, guided scent discovery.";

const getSiteOrigin = createServerFn({ method: "GET" }).handler(
  () => getRequestUrl({ xForwardedHost: true }).origin,
);

export const Route = createFileRoute("/")({
  loader: () => getSiteOrigin(),
  head: ({ loaderData }) => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: new URL("/og.png", loaderData).href },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: new URL("/og.png", loaderData).href },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-offwhite text-ink min-h-screen overflow-clip">
      <Header />
      <main>
        <Hero />
        <Statement />
        <Experience />
        <Collection />
        <Gallery />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
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

const title = "SSAroma — Fine Fragrance Boutique in Peshawar";
const description =
  "A small fragrance boutique in Peshawar. Discover Noir Oud, Velvet Amber and Santal Reserve, or visit us to find your signature scent.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-offwhite text-ink min-h-screen">
      <Header />
      <main>
        <Hero />
        <Statement />
        <Collection />
        <Experience />
        <Gallery />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

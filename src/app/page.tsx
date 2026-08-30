import type { Metadata } from "next";
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
import { getProducts } from "@/services/catalog";
import { getSiteSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: { absolute: settings.siteTitle },
    description: settings.siteDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      url: "/",
      images: [settings.heroImage?.url || "/og-luxury.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [settings.heroImage?.url || "/og-luxury.png"],
    },
  };
}

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getProducts({ publishedOnly: true, featured: true, limit: 3 }),
  ]);
  const organization = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings.brandName,
    description: settings.siteDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city,
      addressRegion: settings.region,
      addressCountry: "PK",
    },
    email: settings.email,
    telephone: settings.phone || undefined,
    sameAs: settings.instagramUrl ? [settings.instagramUrl] : undefined,
  };
  return (
    <div className="bg-offwhite text-ink min-h-screen overflow-clip">
      <Header brandName={settings.brandName} />
      <main>
        <Hero settings={settings} />
        {settings.home.showHouse ? <Statement settings={settings} /> : null}
        {settings.home.showVisit ? <Experience settings={settings} /> : null}
        {settings.home.showCollection ? (
          <Collection products={featured} settings={settings} />
        ) : null}
        {settings.home.showGallery ? <Gallery settings={settings} /> : null}
        {settings.home.showCta ? <FinalCta settings={settings} /> : null}
      </main>
      <Footer settings={settings} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}

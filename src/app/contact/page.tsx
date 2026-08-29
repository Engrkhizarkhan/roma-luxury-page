import type { Metadata } from "next";
import { ContactForm } from "@/components/store/ContactForm";
import { ShopShell } from "@/components/ssaroma/ShopChrome";
import { getProducts } from "@/services/catalog";
import { getSiteSettings } from "@/services/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact the boutique",
  description:
    "Contact SSAROMA in Peshawar for fragrance guidance, product questions, and order support.",
  alternates: { canonical: "/contact" },
};
export default async function ContactPage() {
  const [products, settings] = await Promise.all([
    getProducts({ publishedOnly: true }),
    getSiteSettings(),
  ]);
  return (
    <ShopShell products={products} settings={settings}>
      <section className="mx-auto grid max-w-370 gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-24">
        <div>
          <p className="editorial-kicker text-gold">Contact SSAROMA</p>
          <h1 className="font-display mt-6 text-6xl leading-[.92] font-light">
            A considered answer, from the house.
          </h1>
          <p className="text-ink/58 mt-7 max-w-md text-sm leading-7">
            Ask about a fragrance, a visit, an existing order, or finding the right signature.
          </p>
          <div className="border-ink/12 mt-10 border-y py-6 text-sm leading-8">
            <p>{settings.address}</p>
            <a href={`mailto:${settings.email}`} className="link-underlined">
              {settings.email}
            </a>
            {settings.phone && <p>{settings.phone}</p>}
          </div>
        </div>
        <ContactForm />
      </section>
    </ShopShell>
  );
}

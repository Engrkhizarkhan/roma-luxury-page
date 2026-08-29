import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutClient } from "@/components/store/CheckoutClient";
import { getProducts } from "@/services/catalog";
import { getSiteSettings } from "@/services/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Secure checkout",
  description: "Complete your SSAROMA cash-on-delivery order.",
  robots: { index: false, follow: false },
};
export default async function CheckoutPage() {
  const [products, settings] = await Promise.all([
    getProducts({ publishedOnly: true }),
    getSiteSettings(),
  ]);
  return (
    <Suspense fallback={<div className="min-h-screen bg-offwhite" />}>
      <CheckoutClient products={products} settings={settings} />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import {
  Banknote,
  ChevronRight,
  Minus,
  PackageCheck,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductMediaCarousel } from "@/components/ssaroma/ProductMediaCarousel";
import { ShopShell } from "@/components/ssaroma/ShopChrome";
import { ProductCardPreview } from "@/components/store/ProductCardPreview";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { formatMoney } from "@/lib/catalog";
import type { ProductItem, SiteSettings } from "@/types/domain";

export function ProductDetail({
  product,
  related,
  catalog,
  settings,
}: {
  product: ProductItem;
  related: ProductItem[];
  catalog: ProductItem[];
  settings: SiteSettings;
}) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = Math.max(1, Math.min(9, product.stock));
  const add = () => {
    addToCart(product.id, quantity);
    toast.success(`${product.name} added to your bag`, {
      description: `${quantity} × ${product.sizeMl} ml ${product.concentration}`,
    });
  };
  const share = async () => {
    try {
      if (navigator.share)
        await navigator.share({ title: product.name, text: product.mood, url: location.href });
      else {
        await navigator.clipboard.writeText(location.href);
        toast.success("Product link copied");
      }
    } catch {}
  };
  return (
    <ShopShell products={catalog} settings={settings}>
      <div className="border-ink/10 border-b bg-cream">
        <div className="mx-auto flex max-w-370 items-center gap-2 px-5 py-3 text-[.65rem] tracking-[.11em] text-ink/48 uppercase sm:px-8 lg:px-12">
          <Link href="/products">Fragrances</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/collections/${product.collectionSlug}`}>{product.collection}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink">{product.name}</span>
        </div>
      </div>
      <section className="mx-auto grid max-w-370 gap-10 px-5 pt-8 sm:px-8 md:grid-cols-12 lg:px-12 lg:pt-12">
        <div className="md:col-span-7">
          <ProductMediaCarousel product={product} imageClassName="aspect-[4/5]" priority />
        </div>
        <div className="md:col-span-5 lg:col-span-4 lg:col-start-9 lg:pt-4">
          <div className="flex justify-between">
            <p className="editorial-kicker text-gold">
              {product.collection} · {product.concentration}
            </p>
            <div className="flex gap-4">
              <button onClick={share} aria-label="Share">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <h1 className="font-display mt-6 text-6xl leading-[.9] font-light sm:text-7xl">
            {product.name}
          </h1>
          <p className="editorial-kicker text-ink/48 mt-5">{product.family}</p>
          {product.rating > 0 && (
            <div className="mt-5 flex items-center gap-2 text-xs">
              <Star className="fill-gold text-gold h-4 w-4" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-ink/40">({product.reviewCount} reviews)</span>
            </div>
          )}
          <p className="font-display mt-8 text-3xl">{formatMoney(product.price)}</p>
          {product.compareAt && product.compareAt > product.price ? (
            <p className="text-ink/38 mt-1 text-sm line-through">
              {formatMoney(product.compareAt)}
            </p>
          ) : null}
          <p className="text-ink/62 mt-7 text-sm leading-7">{product.story}</p>
          <div className="border-ink/14 mt-8 grid grid-cols-3 border-y py-5 text-center">
            <div>
              <span className="editorial-kicker text-ink/40">Size</span>
              <p className="mt-2 text-sm">{product.sizeMl} ml</p>
            </div>
            <div className="border-ink/12 border-x">
              <span className="editorial-kicker text-ink/40">Profile</span>
              <p className="mt-2 text-sm">{product.gender}</p>
            </div>
            <div>
              <span className="editorial-kicker text-ink/40">Stock</span>
              <p className="mt-2 text-sm">{product.outOfStock ? "Unavailable" : "Available"}</p>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <div className="border-ink/20 flex h-13 border">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11">
                <Minus className="mx-auto h-4 w-4" />
              </button>
              <span className="flex w-8 items-center justify-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
                aria-label="Increase quantity"
                className="w-11 disabled:opacity-35"
              >
                <Plus className="mx-auto h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={add}
              disabled={product.outOfStock}
              className="h-13 flex-1 bg-ink text-cream"
            >
              {product.outOfStock ? "Currently unavailable" : "Add to bag"}
            </Button>
          </div>
          {!product.outOfStock && (
            <Link
              href={`/checkout?product=${product.slug}&quantity=${quantity}`}
              className="editorial-kicker border-ink/22 mt-3 flex h-13 items-center justify-center border"
            >
              Buy now · Cash on delivery
            </Link>
          )}
          <div className="mt-9 space-y-4 border-t border-ink/12 pt-6 text-xs text-ink/55">
            <Service icon={Truck} text="Delivery across Pakistan" />
            <Service icon={Banknote} text="Cash on delivery" />
            <Service icon={ShieldCheck} text="Authenticity assured" />
            <Service icon={PackageCheck} text="Carefully packed in Peshawar" />
          </div>
        </div>
      </section>
      <section className="bg-cream mt-24 py-20">
        <div className="mx-auto max-w-370 px-5 sm:px-8 lg:px-12">
          <p className="editorial-kicker text-gold">Composition</p>
          <h2 className="font-display mt-5 text-5xl font-light">The note pyramid.</h2>
          <div className="mt-10 grid border-y border-ink/12 md:grid-cols-3">
            {(["top", "heart", "base"] as const).map((stage) => (
              <div
                key={stage}
                className="border-ink/12 py-7 md:border-l md:px-8 md:first:border-l-0"
              >
                <p className="editorial-kicker text-ink/42">{stage} notes</p>
                <p className="mt-4 text-sm leading-7">{product.notes[stage].join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="mx-auto max-w-370 px-5 py-24 sm:px-8 lg:px-12">
          <p className="editorial-kicker text-gold">Continue exploring</p>
          <h2 className="font-display mt-5 text-5xl font-light">Related fragrances.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <article key={item.id} className="product-card relative -m-3 p-3">
                <Link
                  href={`/products/${item.slug}`}
                  className="focus-ring absolute inset-0 z-10"
                  aria-label={`View ${item.name}`}
                />
                <ProductCardPreview product={item} />
                <h3 className="font-display mt-4 text-3xl font-light">{item.name}</h3>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-ink/48 text-xs">{formatMoney(item.price)}</p>
                  <span className="editorial-kicker text-gold">View fragrance ↗</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </ShopShell>
  );
}

function Service({ icon: Icon, text }: { icon: typeof Truck; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="text-gold h-4 w-4" />
      <span>{text}</span>
    </div>
  );
}

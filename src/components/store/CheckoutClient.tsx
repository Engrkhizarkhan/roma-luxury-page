"use client";

import Link from "next/link";
import Image from "next/image";
import { Banknote, Check, LockKeyhole, PackageCheck, Truck } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ShopShell } from "@/components/ssaroma/ShopChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearCart, readCart } from "@/lib/cart";
import { formatMoney } from "@/lib/catalog";
import type { ProductItem, SiteSettings } from "@/types/domain";

type Line = { product: ProductItem; quantity: number };

export function CheckoutClient({
  products,
  settings,
}: {
  products: ProductItem[];
  settings: SiteSettings;
}) {
  const search = useSearchParams();
  const slug = search.get("product") || "";
  const requestedProduct = products.find((item) => item.slug === slug);
  const direct = requestedProduct && requestedProduct.stock > 0 ? requestedProduct : undefined;
  const requestedQuantity = Math.min(
    9,
    direct?.stock ?? 9,
    Math.max(1, Number(search.get("quantity")) || 1),
  );
  const [cartLines, setCartLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(Boolean(slug));
  const [city, setCity] = useState(settings.city);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<{
    orderNumber: string;
    total: number;
    message: string;
  } | null>(null);
  useEffect(() => {
    if (slug) return;
    const timeout = window.setTimeout(() => {
      setCartLines(
        readCart()
          .map((line) => {
            const product = products.find((item) => item.id === line.productId);
            return product && product.stock > 0
              ? { product, quantity: Math.min(line.quantity, product.stock, 9) }
              : null;
          })
          .filter((line): line is Line => Boolean(line)),
      );
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [products, slug]);
  const lines = useMemo(
    () => (direct ? [{ product: direct, quantity: requestedQuantity }] : cartLines),
    [cartLines, direct, requestedQuantity],
  );
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const delivery = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const total = Math.max(0, subtotal + delivery - discount);

  const applyPromo = async () => {
    setPromoMessage("");
    setDiscount(0);
    try {
      const response = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: promoCode, subtotal }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setDiscount(body.discount);
      setPromoMessage(`${body.code} applied: ${formatMoney(body.discount)} off.`);
    } catch (cause) {
      setPromoMessage(cause instanceof Error ? cause.message : "Promotion could not be applied.");
    }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: { name: data.get("name"), phone: data.get("phone"), email: data.get("email") },
          address: { street: data.get("street"), city, postalCode: data.get("postalCode") },
          note: data.get("note"),
          promoCode: promoCode || undefined,
          items: lines.map((line) => ({ productId: line.product.id, quantity: line.quantity })),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Order could not be placed.");
      if (!direct) clearCart();
      setConfirmed(body);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Order could not be placed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed)
    return (
      <ShopShell products={products} settings={settings}>
        <section className="mx-auto max-w-3xl px-5 py-24 text-center">
          <span className="bg-ink text-cream mx-auto flex h-14 w-14 items-center justify-center">
            <Check />
          </span>
          <p className="editorial-kicker text-gold mt-8">
            Order confirmed · {confirmed.orderNumber}
          </p>
          <h1 className="font-display mt-5 text-6xl leading-[.92] font-light">
            Thank you for choosing SSAROMA.
          </h1>
          <p className="text-ink/60 mx-auto mt-7 max-w-xl text-sm leading-7">
            {confirmed.message} Payment of {formatMoney(confirmed.total)} will be collected when
            your order arrives in {city}.
          </p>
          <div className="border-ink/12 mx-auto mt-10 grid max-w-xl border-y py-6 sm:grid-cols-3">
            <Step icon={PackageCheck} text="Order received" />
            <Step icon={Truck} text="Confirmation call" />
            <Step icon={Banknote} text="Pay on delivery" />
          </div>
          <Link
            href="/products"
            className="editorial-kicker bg-ink text-cream mt-9 inline-flex px-7 py-4"
          >
            Continue shopping
          </Link>
        </section>
      </ShopShell>
    );
  return (
    <ShopShell products={products} settings={settings}>
      <section className="mx-auto max-w-370 px-5 pt-12 sm:px-8 lg:px-12">
        <p className="editorial-kicker text-gold">Cash on delivery</p>
        <h1 className="font-display mt-5 text-6xl leading-[.9] font-light">Complete your order.</h1>
        {!ready ? (
          <p className="border-ink/12 mt-12 border-y py-16 text-center">Preparing your order…</p>
        ) : !lines.length ? (
          <div className="border-ink/12 mt-12 border-y py-16 text-center">
            <p className="font-display text-4xl">Your cart is empty.</p>
            <Link
              href="/products"
              className="editorial-kicker bg-ink text-cream mt-7 inline-flex px-7 py-4"
            >
              Explore fragrances
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_420px]">
            <form onSubmit={submit} className="space-y-10">
              <fieldset>
                <legend className="font-display border-ink/12 w-full border-b pb-4 text-3xl">
                  Contact details
                </legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Full name">
                    <Input name="name" required autoComplete="name" />
                  </Field>
                  <Field label="Mobile number">
                    <Input name="phone" required type="tel" autoComplete="tel" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Email (optional)">
                      <Input name="email" type="email" autoComplete="email" />
                    </Field>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend className="font-display border-ink/12 w-full border-b pb-4 text-3xl">
                  Delivery address
                </legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Street address">
                      <Input name="street" required autoComplete="street-address" />
                    </Field>
                  </div>
                  <Field label="City">
                    <Input required value={city} onChange={(e) => setCity(e.target.value)} />
                  </Field>
                  <Field label="Postal code (optional)">
                    <Input name="postalCode" autoComplete="postal-code" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Order note (optional)">
                      <textarea
                        name="note"
                        rows={4}
                        className="border-ink/20 bg-offwhite w-full border p-3"
                      />
                    </Field>
                  </div>
                </div>
              </fieldset>
              <div className="border-ink/15 bg-cream flex gap-4 border p-5">
                <Banknote className="text-gold h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Cash on delivery</p>
                  <p className="text-ink/52 mt-1 text-xs">
                    We confirm every order by phone before dispatch.
                  </p>
                </div>
              </div>
              {error && (
                <p
                  className="border border-red-900/20 bg-red-900/5 p-4 text-sm text-red-800"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <Button disabled={submitting} className="h-14 w-full bg-ink text-cream">
                {submitting ? "Placing order…" : `Place COD order · ${formatMoney(total)}`}
              </Button>
              <p className="text-ink/42 flex items-center justify-center gap-2 text-xs">
                <LockKeyhole className="h-4 w-4" />
                Your details are used only to fulfill this order.
              </p>
            </form>
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border-ink/14 bg-cream border p-6">
                <h2 className="font-display border-ink/12 border-b pb-4 text-3xl">Order summary</h2>
                {lines.map(({ product, quantity }) => (
                  <article
                    key={product.id}
                    className="border-ink/10 grid grid-cols-[72px_1fr_auto] gap-3 border-b py-5"
                  >
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt=""
                        width={72}
                        height={88}
                        className="h-22 w-18 object-cover"
                      />
                    ) : (
                      <div className="bg-ink/5 h-22 w-18" />
                    )}
                    <div>
                      <p className="font-display text-xl">{product.name}</p>
                      <p className="text-ink/45 mt-2 text-xs">
                        {quantity} × {product.sizeMl} ml
                      </p>
                    </div>
                    <p className="text-xs font-medium">{formatMoney(product.price * quantity)}</p>
                  </article>
                ))}
                <div className="mt-5 flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setDiscount(0);
                      setPromoMessage("");
                    }}
                    placeholder="Promotion code"
                  />
                  <Button type="button" variant="outline" onClick={applyPromo}>
                    Apply
                  </Button>
                </div>
                {promoMessage && <p className="text-ink/55 mt-2 text-xs">{promoMessage}</p>}
                <div className="border-ink/12 mt-5 space-y-3 border-t pt-4 text-sm">
                  <Row label="Subtotal" value={formatMoney(subtotal)} />
                  <Row
                    label="Delivery"
                    value={delivery ? formatMoney(delivery) : "Complimentary"}
                  />
                  {discount > 0 && <Row label="Promotion" value={`− ${formatMoney(discount)}`} />}
                  <div className="border-ink/12 flex justify-between border-t pt-4 font-medium">
                    <span>Total</span>
                    <span>{formatMoney(total)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </ShopShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="editorial-kicker text-ink/52 mb-2 block">{label}</span>
      {children}
    </label>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-ink/58 flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
function Step({ icon: Icon, text }: { icon: typeof Truck; text: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3 text-xs">
      <Icon className="text-gold h-4 w-4" />
      {text}
    </div>
  );
}

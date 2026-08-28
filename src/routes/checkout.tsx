import { Link, createFileRoute } from "@tanstack/react-router";
import { Banknote, Check, ChevronRight, LockKeyhole, PackageCheck, Truck } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ShopShell } from "@/components/ssaroma/ShopChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearCart, readCart } from "@/lib/cart";
import { formatMoney, products, type ProductItem } from "@/lib/catalog";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    product: typeof search["product"] === "string" ? search["product"] : "",
    quantity:
      typeof search["quantity"] === "number"
        ? Math.min(9, Math.max(1, Math.floor(search["quantity"])))
        : typeof search["quantity"] === "string"
          ? Math.min(9, Math.max(1, Number.parseInt(search["quantity"], 10) || 1))
          : 1,
  }),
  head: () => ({
    meta: [
      { title: "Secure checkout | SSAROMA" },
      {
        name: "description",
        content: "Complete your SSAROMA order with cash on delivery across Pakistan.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutPage,
});

type CheckoutLine = {
  product: ProductItem;
  quantity: number;
};

function CheckoutPage() {
  const { product: productSlug, quantity } = Route.useSearch();
  const [cartReady, setCartReady] = useState(Boolean(productSlug));
  const [cartLines, setCartLines] = useState<CheckoutLine[]>([]);
  const [placedOrder, setPlacedOrder] = useState<string | null>(null);
  const [city, setCity] = useState("Peshawar");

  const directProduct = products.find((product) => product.slug === productSlug);

  useEffect(() => {
    if (directProduct) return;
    const lines = readCart()
      .map((line) => {
        const product = products.find((entry) => entry.id === line.productId);
        return product ? { product, quantity: line.quantity } : null;
      })
      .filter((line): line is CheckoutLine => line !== null);
    setCartLines(lines);
    setCartReady(true);
  }, [directProduct]);

  const lines = useMemo<CheckoutLine[]>(
    () => (directProduct ? [{ product: directProduct, quantity }] : cartLines),
    [cartLines, directProduct, quantity],
  );
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const delivery = subtotal >= 20000 ? 0 : 350;
  const total = subtotal + delivery;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const orderNumber = `SSA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    if (!directProduct) clearCart();
    setPlacedOrder(orderNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placedOrder) {
    return (
      <ShopShell>
        <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 md:py-28">
          <span className="bg-ink text-cream mx-auto flex h-14 w-14 items-center justify-center">
            <Check className="h-6 w-6" />
          </span>
          <p className="editorial-kicker text-[#8b6b3e] mt-8">Order confirmed · {placedOrder}</p>
          <h1 className="font-display mt-5 text-[3.6rem] leading-[0.9] font-light sm:text-[4.8rem]">
            Thank you for choosing SSAROMA.
          </h1>
          <p className="text-ink/60 mx-auto mt-7 max-w-xl text-sm leading-7">
            Your order has been received. Our team will call to confirm before dispatch. Payment of{" "}
            {formatMoney(total)} will be collected in cash when your order arrives in {city}.
          </p>
          <div className="border-ink/12 mx-auto mt-10 grid max-w-xl border-y py-6 sm:grid-cols-3">
            <OrderStep icon={PackageCheck} label="Order received" />
            <OrderStep icon={Truck} label="Confirmation call" />
            <OrderStep icon={Banknote} label="Pay on delivery" />
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="editorial-kicker bg-ink text-cream px-7 py-4">
              Continue shopping
            </Link>
            <Link to="/" className="editorial-kicker border-ink/22 border px-7 py-4">
              Return home
            </Link>
          </div>
        </section>
      </ShopShell>
    );
  }

  return (
    <ShopShell>
      <div className="border-ink/10 border-b bg-cream">
        <div className="mx-auto flex max-w-370 items-center gap-2 px-5 py-3 text-[0.65rem] tracking-[0.11em] text-ink/48 uppercase sm:px-8 lg:px-12">
          <Link to="/products" className="hover:text-ink">
            Fragrances
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink">Secure checkout</span>
        </div>
      </div>

      <section className="mx-auto max-w-370 px-5 pt-12 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="editorial-kicker text-[#8b6b3e]">Cash on delivery</p>
          <h1 className="font-display mt-5 text-[3.5rem] leading-[0.9] font-light sm:text-[4.7rem]">
            Complete your order.
          </h1>
          <p className="text-ink/58 mt-5 text-sm leading-7">
            No advance payment is required. We confirm every order by phone before dispatch.
          </p>
        </div>

        {!cartReady ? (
          <div className="border-ink/12 mt-12 border-y py-16 text-center text-sm text-ink/48">
            Preparing your order…
          </div>
        ) : lines.length === 0 ? (
          <div className="border-ink/12 mt-12 border-y py-16 text-center">
            <ShoppingEmpty />
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-18">
            <form onSubmit={handleSubmit} className="space-y-10">
              <fieldset>
                <legend className="font-display border-ink/12 w-full border-b pb-4 text-3xl font-light">
                  Contact details
                </legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <CheckoutField label="Full name">
                    <Input
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      className="border-ink/20 h-12"
                    />
                  </CheckoutField>
                  <CheckoutField label="Mobile number">
                    <Input
                      required
                      type="tel"
                      autoComplete="tel"
                      pattern="[0-9+ -]{10,16}"
                      placeholder="03XX XXXXXXX"
                      className="border-ink/20 h-12"
                    />
                  </CheckoutField>
                  <div className="sm:col-span-2">
                    <CheckoutField label="Email address (optional)">
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        className="border-ink/20 h-12"
                      />
                    </CheckoutField>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-display border-ink/12 w-full border-b pb-4 text-3xl font-light">
                  Delivery address
                </legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <CheckoutField label="Street address">
                      <Input
                        required
                        autoComplete="street-address"
                        placeholder="House, street and area"
                        className="border-ink/20 h-12"
                      />
                    </CheckoutField>
                  </div>
                  <CheckoutField label="City">
                    <select
                      required
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      className="border-ink/20 bg-offwhite h-12 w-full border px-3 text-sm outline-none focus:border-[#8b6b3e]"
                    >
                      {[
                        "Peshawar",
                        "Islamabad",
                        "Rawalpindi",
                        "Lahore",
                        "Karachi",
                        "Faisalabad",
                        "Multan",
                        "Abbottabad",
                        "Other",
                      ].map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </CheckoutField>
                  <CheckoutField label="Postal code (optional)">
                    <Input
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="25000"
                      className="border-ink/20 h-12"
                    />
                  </CheckoutField>
                  <div className="sm:col-span-2">
                    <CheckoutField label="Order note (optional)">
                      <textarea
                        rows={4}
                        className="border-ink/20 bg-offwhite w-full resize-none border px-3 py-3 text-sm outline-none focus:border-[#8b6b3e]"
                        placeholder="Delivery instructions or gift note"
                      />
                    </CheckoutField>
                  </div>
                </div>
              </fieldset>

              <div className="border-ink/15 bg-cream flex items-start gap-4 border px-5 py-5">
                <Banknote className="text-[#8b6b3e] mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Cash on delivery</p>
                  <p className="text-ink/52 mt-1 text-xs leading-5">
                    Pay the courier in cash after your order is delivered. Please keep the exact
                    amount ready where possible.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-ink text-cream hover:bg-[#aa8755] hover:text-ink h-14 w-full text-sm"
              >
                Place COD order · {formatMoney(total)}
              </Button>
              <p className="text-ink/42 flex items-center justify-center gap-2 text-center text-[0.68rem]">
                <LockKeyhole className="h-3.5 w-3.5" /> Your details are used only to confirm and
                deliver this order.
              </p>
            </form>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border-ink/14 bg-cream border p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-ink/12 pb-4">
                  <h2 className="font-display text-3xl font-light">Order summary</h2>
                  <span className="text-ink/45 text-xs">
                    {lines.reduce((sum, line) => sum + line.quantity, 0)} pieces
                  </span>
                </div>
                <div className="divide-ink/10 divide-y">
                  {lines.map(({ product, quantity: lineQuantity }) => (
                    <article key={product.id} className="grid grid-cols-[72px_1fr_auto] gap-3 py-5">
                      <div className="relative">
                        <img src={product.images[0]} alt="" className="h-22 w-18 object-cover" />
                        <span className="bg-ink text-cream absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center px-1 text-[0.6rem]">
                          {lineQuantity}
                        </span>
                      </div>
                      <div>
                        <p className="font-display text-xl leading-none">{product.name}</p>
                        <p className="text-ink/45 mt-2 text-[0.62rem] tracking-wider uppercase">
                          {product.concentration} · {product.sizeMl} ml
                        </p>
                      </div>
                      <p className="text-xs font-medium tabular-nums">
                        {formatMoney(product.price * lineQuantity)}
                      </p>
                    </article>
                  ))}
                </div>
                <div className="border-ink/12 space-y-3 border-t pt-4 text-sm">
                  <div className="flex justify-between text-ink/58">
                    <span>Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ink/58">
                    <span>Delivery</span>
                    <span>{delivery === 0 ? "Complimentary" : formatMoney(delivery)}</span>
                  </div>
                  <div className="border-ink/12 flex justify-between border-t pt-4 font-medium">
                    <span>Total</span>
                    <span className="text-lg tabular-nums">{formatMoney(total)}</span>
                  </div>
                </div>
                <div className="border-ink/10 mt-5 border-t pt-4">
                  <p className="text-ink/50 flex items-center gap-2 text-xs">
                    <Truck className="h-4 w-4" /> Estimated delivery: 2–4 working days
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </ShopShell>
  );
}

function CheckoutField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="editorial-kicker text-ink/52 mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function OrderStep({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <div className="border-ink/10 flex items-center justify-center gap-2 border-b py-3 text-xs last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
      <Icon className="text-[#8b6b3e] h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}

function ShoppingEmpty() {
  return (
    <>
      <p className="font-display text-4xl font-light">Your cart is empty.</p>
      <p className="text-ink/52 mt-4 text-sm">Choose a fragrance before continuing to checkout.</p>
      <Link
        to="/products"
        className="editorial-kicker bg-ink text-cream mt-7 inline-flex px-7 py-4"
      >
        Explore fragrances
      </Link>
    </>
  );
}

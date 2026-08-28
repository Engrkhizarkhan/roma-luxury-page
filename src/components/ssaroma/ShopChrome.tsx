import { Link } from "@tanstack/react-router";
import { Menu, Minus, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CART_EVENT, clearCart, readCart, updateCartLine, type CartLine } from "@/lib/cart";
import { formatMoney, products } from "@/lib/catalog";
import { LINKS, SHOP } from "@/lib/ssaroma";

type ShellProps = {
  children: ReactNode;
};

const menuItems = [
  { label: "The house", to: "/" as const },
  { label: "Fragrances", to: "/products" as const },
] as const;

export function ShopShell({ children }: ShellProps) {
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => {
    const sync = () => setCart(readCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, line) => {
        const product = products.find((entry) => entry.id === line.productId);
        return sum + (product?.price ?? 0) * line.quantity;
      }, 0),
    [cart],
  );

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(updateCartLine(productId, quantity));
  };

  return (
    <div className="bg-offwhite text-ink min-h-screen">
      <div className="bg-[#aa8755] px-4 py-2 text-center text-[0.62rem] font-semibold tracking-[0.16em] text-[#15130f] uppercase">
        Complimentary delivery across Pakistan on orders over PKR 20,000
      </div>

      <header className="bg-ink border-cream/10 sticky top-0 z-40 border-b">
        <div className="mx-auto grid h-18 max-w-370 grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12">
          <nav className="hidden items-center gap-7 md:flex" aria-label="Shop navigation">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                activeProps={{ className: "text-gold" }}
                className="link-rule editorial-kicker text-cream/68 hover:text-cream transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="focus-ring text-cream justify-self-start md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-ink text-cream border-cream/15 w-[88%] p-0">
              <SheetHeader className="border-cream/12 border-b px-6 py-6 text-left">
                <SheetTitle className="wordmark text-cream text-base">SSAROMA</SheetTitle>
                <SheetDescription className="text-cream/48 text-xs">
                  Fragrance house · Peshawar
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col px-6 py-8" aria-label="Mobile navigation">
                {menuItems.map((item, index) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      to={item.to}
                      className="font-display border-cream/12 border-b py-5 text-3xl font-light"
                    >
                      <span className="text-gold mr-4 font-sans text-[0.62rem] tracking-widest">
                        0{index + 1}
                      </span>
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            to="/"
            className="wordmark text-cream focus-ring justify-self-center text-[0.98rem] leading-none sm:text-[1.05rem]"
          >
            SSAROMA
          </Link>

          <div className="flex items-center justify-self-end gap-4 sm:gap-5">
            <Link
              to="/products"
              search={{}}
              className="focus-ring text-cream/70 hover:text-cream hidden transition-colors sm:block"
              aria-label="Search fragrances"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="focus-ring text-cream relative flex items-center gap-2"
                  aria-label={`Open bag with ${cartCount} items`}
                >
                  <ShoppingBag className="h-[18px] w-[18px]" />
                  <span className="editorial-kicker text-cream/70 hidden sm:inline">Bag</span>
                  <span className="bg-gold text-ink flex h-5 min-w-5 items-center justify-center px-1 text-[0.62rem] font-semibold">
                    {cartCount}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent className="bg-offwhite border-ink/15 flex w-full flex-col p-0 sm:max-w-md">
                <SheetHeader className="border-ink/12 border-b px-6 py-6 text-left">
                  <SheetTitle className="font-display text-3xl font-light">
                    Your selection
                  </SheetTitle>
                  <SheetDescription>
                    {cartCount === 0
                      ? "Your bag is waiting."
                      : `${cartCount} ${cartCount === 1 ? "piece" : "pieces"} reserved for checkout.`}
                  </SheetDescription>
                </SheetHeader>

                {cart.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                    <ShoppingBag className="text-ink/25 h-9 w-9" strokeWidth={1.25} />
                    <p className="font-display mt-5 text-3xl font-light">
                      Begin your fragrance wardrobe.
                    </p>
                    <SheetClose asChild>
                      <Link
                        to="/products"
                        className="editorial-kicker bg-ink text-cream mt-7 px-6 py-4"
                      >
                        Explore fragrances
                      </Link>
                    </SheetClose>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-6">
                      {cart.map((line) => {
                        const product = products.find((entry) => entry.id === line.productId);
                        if (!product) return null;
                        return (
                          <article
                            key={line.productId}
                            className="border-ink/12 grid grid-cols-[76px_1fr] gap-4 border-b py-5"
                          >
                            <img
                              src={product.images[0]}
                              alt=""
                              className="h-24 w-[76px] object-cover"
                            />
                            <div className="min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-display text-xl leading-none">
                                    {product.name}
                                  </p>
                                  <p className="text-ink/48 mt-2 text-[0.66rem] tracking-[0.12em] uppercase">
                                    {product.concentration} · {product.sizeMl} ml
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(line.productId, 0)}
                                  className="focus-ring text-ink/45 hover:text-destructive"
                                  aria-label={`Remove ${product.name}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-4 flex items-center justify-between gap-3">
                                <div className="border-ink/18 flex h-8 items-center border">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(line.productId, line.quantity - 1)
                                    }
                                    className="focus-ring flex h-full w-8 items-center justify-center"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="w-7 text-center text-xs tabular-nums">
                                    {line.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(line.productId, line.quantity + 1)
                                    }
                                    className="focus-ring flex h-full w-8 items-center justify-center"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <p className="text-sm tabular-nums">
                                  {formatMoney(product.price * line.quantity)}
                                </p>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    <div className="border-ink/12 border-t bg-cream px-6 py-6">
                      <div className="flex items-center justify-between">
                        <span className="editorial-kicker text-ink/54">Subtotal</span>
                        <span className="font-display text-2xl">{formatMoney(cartTotal)}</span>
                      </div>
                      <p className="text-ink/50 mt-2 text-xs">
                        Delivery and payment are confirmed at checkout.
                      </p>
                      <Button
                        className="bg-ink text-cream hover:bg-[#aa8755] hover:text-ink mt-5 h-12 w-full"
                        onClick={() =>
                          toast.success("Demo checkout is ready", {
                            description: "Your selection has been saved on this device.",
                          })
                        }
                      >
                        Continue to checkout
                      </Button>
                      <button
                        type="button"
                        className="editorial-kicker text-ink/48 hover:text-ink mt-4 w-full"
                        onClick={() => {
                          clearCart();
                          setCart([]);
                        }}
                      >
                        Clear selection
                      </button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-ink text-cream mt-24 border-t border-white/10 py-12">
        <div className="mx-auto grid max-w-370 gap-10 px-5 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr] lg:px-12">
          <div>
            <p className="wordmark text-[0.95rem]">SSAROMA</p>
            <p className="text-cream/48 mt-4 max-w-sm text-sm leading-7">
              An intimate fragrance house for considered signatures and unhurried discovery.
            </p>
          </div>
          <div>
            <p className="editorial-kicker text-gold">Visit</p>
            <p className="text-cream/62 mt-4 text-sm leading-7">
              {SHOP.city}, {SHOP.region}
              <br />
              Pakistan
            </p>
          </div>
          <div>
            <p className="editorial-kicker text-gold">Follow</p>
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              className="link-underlined mt-4 text-sm text-cream/62 hover:text-cream"
            >
              Instagram ↗
            </a>
          </div>
        </div>
        <div className="border-cream/10 mx-auto mt-10 flex max-w-370 flex-col gap-3 border-t px-5 pt-6 text-[0.62rem] tracking-[0.12em] text-cream/38 uppercase sm:px-8 md:flex-row md:justify-between lg:px-12">
          <span>© {new Date().getFullYear()} SSAROMA</span>
          <span>Curated fragrance experience</span>
        </div>
      </footer>
    </div>
  );
}

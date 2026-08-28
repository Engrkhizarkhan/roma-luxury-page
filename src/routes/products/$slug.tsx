import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Gift,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ProductMediaCarousel } from "@/components/ssaroma/ProductMediaCarousel";
import { ShopShell } from "@/components/ssaroma/ShopChrome";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addToCart } from "@/lib/cart";
import { formatMoney, products, type ProductItem } from "@/lib/catalog";

const getSiteOrigin = createServerFn({ method: "GET" }).handler(
  () => getRequestUrl({ xForwardedHost: true }).origin,
);

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => ({
    product: products.find((entry) => entry.slug === params.slug),
    origin: await getSiteOrigin(),
  }),
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    if (!product) {
      return { meta: [{ title: "Fragrance not found | SSAROMA" }] };
    }

    const title = `${product.name} ${product.concentration} | SSAROMA`;
    const description = `${product.mood}. ${product.story}`;
    const primaryImage = product.images[0]
      ? new URL(product.images[0], loaderData.origin).href
      : undefined;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        ...(primaryImage ? [{ property: "og:image", content: primaryImage }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(primaryImage ? [{ name: "twitter:image", content: primaryImage }] : []),
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reservationSent, setReservationSent] = useState(false);

  if (!product) {
    return (
      <ShopShell>
        <section className="mx-auto max-w-370 px-5 py-24 sm:px-8 lg:px-12">
          <p className="editorial-kicker text-[#8b6b3e]">Product not found</p>
          <h1 className="font-display mt-6 text-5xl font-light">
            This fragrance is no longer in the edit.
          </h1>
          <Link
            to="/products"
            className="link-underlined editorial-kicker text-ink hover:text-[#8b6b3e] mt-8 inline-block"
          >
            Back to collection →
          </Link>
        </section>
      </ShopShell>
    );
  }

  const related = products
    .filter((entry) => entry.slug !== product.slug)
    .sort(
      (a, b) =>
        Number(b.collection === product.collection) - Number(a.collection === product.collection),
    )
    .slice(0, 3);

  const handleAddToBag = () => {
    addToCart(product.id, quantity);
    toast.success(`${product.name} added to your bag`, {
      description: `${quantity} × ${product.sizeMl} ml ${product.concentration}`,
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.mood,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied");
      }
    } catch {
      // Native share dismissal does not need an error state.
    }
  };

  return (
    <ShopShell>
      <div className="border-ink/10 border-b bg-cream">
        <div className="mx-auto flex max-w-370 items-center gap-2 px-5 py-3 text-[0.65rem] tracking-[0.11em] text-ink/48 uppercase sm:px-8 lg:px-12">
          <Link to="/products" className="hover:text-ink">
            Fragrances
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>{product.collection}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink">{product.name}</span>
        </div>
      </div>

      <section className="mx-auto grid max-w-370 gap-10 px-5 pt-8 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-12 lg:pt-12">
        <div className="md:col-span-7 lg:col-span-7">
          <ProductGallery product={product} />
        </div>

        <div className="md:col-span-5 lg:col-span-4 lg:col-start-9">
          <div className="md:sticky md:top-28">
            <div className="flex items-center justify-between gap-4">
              <p className="editorial-kicker text-[#8b6b3e]">
                {product.collection} collection · {product.launchYear}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setWishlisted((current) => !current)}
                  className="focus-ring text-ink/52 hover:text-ink"
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`h-[18px] w-[18px] ${wishlisted ? "fill-[#8b6b3e] text-[#8b6b3e]" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="focus-ring text-ink/52 hover:text-ink"
                  aria-label="Share fragrance"
                >
                  <Share2 className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>

            <h1 className="font-display mt-5 text-[3.6rem] leading-[0.86] font-light tracking-[-0.04em] sm:text-[4.2rem] md:text-[3.7rem] lg:text-[4.4rem]">
              {product.name}
            </h1>
            <p className="text-ink/48 mt-5 text-[0.68rem] tracking-[0.12em] uppercase">
              {product.family}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div
                className="flex items-center gap-0.5 text-[#9a773f]"
                aria-label={`${product.rating} out of 5 stars`}
              >
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <a href="#reviews" className="link-underlined text-ink/52 text-xs">
                {product.rating.toFixed(1)} · {product.reviewCount} reviews
              </a>
            </div>

            <p className="text-ink mt-7 text-[1.55rem] tabular-nums">
              {formatMoney(product.price)}
            </p>
            <p className="text-ink/40 mt-1 text-xs line-through">
              {formatMoney(product.compareAt)}
            </p>

            <div className="border-ink/14 mt-8 border-t pt-6">
              <div className="flex items-center justify-between">
                <p className="editorial-kicker text-ink/55">Size</p>
                <button type="button" className="link-underlined text-ink/48 text-xs">
                  Size guide
                </button>
              </div>
              <button
                type="button"
                className="border-ink bg-cream mt-3 flex w-full items-center justify-between border px-4 py-3.5 text-left"
              >
                <span className="text-sm">
                  {product.sizeMl} ml · {product.concentration}
                </span>
                <Check className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <div className="border-ink/22 flex h-12 items-center border">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="focus-ring flex h-full w-10 items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(9, current + 1))}
                  className="focus-ring flex h-full w-10 items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <Button
                disabled={product.outOfStock}
                onClick={handleAddToBag}
                className="bg-ink text-cream hover:bg-[#aa8755] hover:text-ink h-12 flex-1"
              >
                {product.outOfStock
                  ? "Currently unavailable"
                  : `Add to bag · ${formatMoney(product.price * quantity)}`}
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setReserveOpen(true)}
              className="border-ink/24 mt-3 h-12 w-full bg-transparent hover:bg-cream"
            >
              <Store className="mr-2 h-4 w-4" /> Reserve in Peshawar boutique
            </Button>

            <div className="border-ink/12 mt-7 grid grid-cols-2 border-y py-5">
              <Service icon={Truck} label="Complimentary delivery" />
              <Service icon={Gift} label="Signature gift wrapping" />
              <Service icon={ShieldCheck} label="Authenticity assured" />
              <Service icon={PackageCheck} label="7-day sealed returns" />
            </div>

            <div className="divide-ink/12 mt-3 divide-y">
              <ProductDisclosure title="The fragrance" open>
                <p>{product.story}</p>
                <p className="mt-3 font-medium text-ink">{product.mood}</p>
              </ProductDisclosure>
              <ProductDisclosure title="Composition">
                <div className="grid grid-cols-[64px_1fr] gap-y-3">
                  <span className="text-ink/44 uppercase">Top</span>
                  <span>{product.notes.top.join(" · ")}</span>
                  <span className="text-ink/44 uppercase">Heart</span>
                  <span>{product.notes.heart.join(" · ")}</span>
                  <span className="text-ink/44 uppercase">Base</span>
                  <span>{product.notes.base.join(" · ")}</span>
                </div>
              </ProductDisclosure>
              <ProductDisclosure title="Delivery & returns">
                <p>
                  Complimentary delivery in 2–4 working days across Pakistan. Unopened fragrances
                  may be returned within seven days.
                </p>
              </ProductDisclosure>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-370 px-5 pt-24 sm:px-8 lg:px-12">
        <div className="border-ink/14 grid gap-12 border-y py-14 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-18">
          <div>
            <p className="editorial-kicker text-[#8b6b3e]">Olfactive architecture</p>
            <h2 className="font-display mt-5 text-5xl leading-[0.95] font-light">
              A measured evolution on skin.
            </h2>
            <p className="text-ink/60 mt-6 max-w-md text-sm leading-7">
              The composition moves from a precise opening into a textured heart, leaving a close,
              memorable trail.
            </p>
          </div>
          <div className="space-y-6">
            <AccordBar label={product.notes.top.join(" · ")} stage="Opening" width="82%" />
            <AccordBar label={product.notes.heart.join(" · ")} stage="Heart" width="96%" />
            <AccordBar label={product.notes.base.join(" · ")} stage="Dry down" width="74%" />
          </div>
        </div>
      </section>

      <section
        id="reviews"
        className="mx-auto grid max-w-370 gap-12 px-5 pt-24 sm:px-8 md:grid-cols-[0.72fr_1.28fr] lg:px-12"
      >
        <div>
          <p className="editorial-kicker text-[#8b6b3e]">Client impressions</p>
          <div className="mt-5 flex items-end gap-3">
            <span className="font-display text-7xl leading-none font-light">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-ink/48 pb-1 text-sm">out of 5</span>
          </div>
          <div className="mt-7 space-y-2.5">
            {[78, 16, 4, 2, 0].map((value, index) => (
              <div
                key={index}
                className="grid grid-cols-[18px_1fr_34px] items-center gap-3 text-xs text-ink/48"
              >
                <span>{5 - index}</span>
                <div className="bg-ink/10 h-1">
                  <div className="bg-[#9a773f] h-full" style={{ width: `${value}%` }} />
                </div>
                <span>{value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="divide-ink/14 divide-y border-y border-ink/14">
          <Review
            name="Mariam S."
            city="Peshawar"
            date="16 August 2026"
            title="Beautifully composed, never loud."
            text={`The ${product.notes.heart[0]?.toLowerCase() ?? "heart"} comes through slowly and stays elegant for hours. The presentation also feels considered from start to finish.`}
          />
          <Review
            name="Areeb K."
            city="Islamabad"
            date="03 August 2026"
            title="Exactly the signature I was looking for."
            text={`Polished enough for evenings but never overwhelming. ${product.name} wears closer to the skin after the first hour, which I really appreciate.`}
          />
        </div>
      </section>

      <section className="mx-auto max-w-370 px-5 pt-24 sm:px-8 lg:px-12">
        <div className="border-ink/14 flex items-end justify-between gap-6 border-t pt-8">
          <div>
            <p className="editorial-kicker text-[#8b6b3e]">Continue the wardrobe</p>
            <h2 className="font-display mt-3 text-4xl font-light">You may also consider</h2>
          </div>
          <Link
            to="/products"
            className="link-underlined editorial-kicker text-ink/55 hover:text-ink hidden sm:block"
          >
            View all fragrances →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {related.map((entry) => (
            <article key={entry.id} className="group">
              <ProductMediaCarousel product={entry} imageClassName="aspect-[4/4.6]" />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-light">{entry.name}</p>
                  <p className="text-ink/45 mt-2 text-[0.62rem] tracking-widest uppercase">
                    {entry.collection} · {entry.concentration}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{formatMoney(entry.price)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Dialog
        open={reserveOpen}
        onOpenChange={(open) => {
          setReserveOpen(open);
          if (!open) setReservationSent(false);
        }}
      >
        <DialogContent className="bg-offwhite border-ink/18 rounded-none p-0 sm:max-w-lg">
          {reservationSent ? (
            <div className="px-8 py-12 text-center">
              <span className="bg-ink text-cream mx-auto flex h-11 w-11 items-center justify-center">
                <Check className="h-5 w-5" />
              </span>
              <DialogTitle className="font-display mt-6 text-4xl font-light">
                Your visit request is noted.
              </DialogTitle>
              <DialogDescription className="text-ink/58 mt-4 leading-7">
                The boutique team will confirm your preferred time and hold {product.name} for your
                consultation.
              </DialogDescription>
              <Button onClick={() => setReserveOpen(false)} className="bg-ink text-cream mt-7">
                Close
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader className="border-ink/12 border-b px-7 py-6 text-left">
                <DialogTitle className="font-display text-3xl font-light">
                  Reserve {product.name}
                </DialogTitle>
                <DialogDescription>
                  Request a private fragrance consultation at our Peshawar boutique.
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4 px-7 py-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  setReservationSent(true);
                }}
              >
                <label className="block">
                  <span className="editorial-kicker text-ink/50">Your name</span>
                  <Input required className="border-ink/22 mt-2 h-11" placeholder="Full name" />
                </label>
                <label className="block">
                  <span className="editorial-kicker text-ink/50">Mobile number</span>
                  <Input
                    required
                    type="tel"
                    className="border-ink/22 mt-2 h-11"
                    placeholder="03XX XXXXXXX"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="editorial-kicker text-ink/50">Preferred date</span>
                    <Input required type="date" className="border-ink/22 mt-2 h-11" />
                  </label>
                  <label className="block">
                    <span className="editorial-kicker text-ink/50">Preferred time</span>
                    <Input required type="time" className="border-ink/22 mt-2 h-11" />
                  </label>
                </div>
                <Button
                  type="submit"
                  className="bg-ink text-cream hover:bg-[#aa8755] hover:text-ink mt-2 h-12 w-full"
                >
                  Request reservation
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ShopShell>
  );
}

function ProductGallery({ product }: { product: ProductItem }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef<number | null>(null);
  const frameWidth = useRef(1);

  const goTo = (index: number) =>
    setActiveIndex((index + product.images.length) % product.images.length);

  return (
    <div className="grid gap-3 lg:grid-cols-[86px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col">
        {product.images.map((image, index) => (
          <button
            key={`${product.id}-thumb-${index}`}
            type="button"
            onClick={() => goTo(index)}
            className={`focus-ring shrink-0 border p-0.5 ${activeIndex === index ? "border-ink" : "border-transparent opacity-62 hover:opacity-100"}`}
            aria-label={`Show ${product.name} image ${index + 1}`}
          >
            <img src={image} alt="" className="h-22 w-17 object-cover lg:h-27 lg:w-20" />
          </button>
        ))}
      </div>
      <div
        className="group/gallery relative order-1 overflow-hidden bg-[#e8e2d7] touch-pan-y select-none lg:order-2"
        onPointerDown={(event) => {
          startX.current = event.clientX;
          frameWidth.current = event.currentTarget.clientWidth;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (startX.current !== null) setDragOffset(event.clientX - startX.current);
        }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const offset = event.clientX - startX.current;
          const threshold = Math.min(80, frameWidth.current * 0.15);
          if (offset < -threshold) goTo(activeIndex + 1);
          if (offset > threshold) goTo(activeIndex - 1);
          startX.current = null;
          setDragOffset(0);
        }}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
            transition:
              startX.current === null ? "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        >
          {product.images.map((image, index) => (
            <img
              key={`${product.id}-hero-${index}`}
              src={image}
              alt={
                index === 0
                  ? `${product.name} fragrance bottle`
                  : `${product.name} presentation ${index + 1}`
              }
              className="aspect-[4/4.75] w-full shrink-0 cursor-grab object-cover active:cursor-grabbing"
              draggable={false}
            />
          ))}
        </div>
        {product.images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="focus-ring bg-offwhite/94 absolute top-1/2 left-4 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-black/10 opacity-0 transition-opacity group-hover/gallery:opacity-100 md:flex"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="focus-ring bg-offwhite/94 absolute top-1/2 right-4 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-black/10 opacity-0 transition-opacity group-hover/gallery:opacity-100 md:flex"
              aria-label="Next image"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="editorial-kicker bg-ink/82 text-cream absolute right-4 bottom-4 px-3 py-2 tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(product.images.length).padStart(2, "0")}
            </span>
          </>
        ) : null}
        {product.outOfStock ? (
          <span className="editorial-kicker bg-ink text-cream absolute top-4 right-4 px-3 py-2">
            Currently unavailable
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Service({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <div className="flex items-center gap-2.5 py-2 pr-2">
      <Icon className="text-[#8b6b3e] h-4 w-4 shrink-0" strokeWidth={1.5} />
      <span className="text-ink/58 text-[0.67rem] leading-4">{label}</span>
    </div>
  );
}

function ProductDisclosure({
  title,
  children,
  open = false,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="group py-4" open={open}>
      <summary className="editorial-kicker flex cursor-pointer list-none items-center justify-between">
        <span>{title}</span>
        <Plus className="h-3.5 w-3.5 transition-transform group-open:rotate-45" />
      </summary>
      <div className="text-ink/58 pt-4 text-sm leading-7">{children}</div>
    </details>
  );
}

function AccordBar({ stage, label, width }: { stage: string; label: string; width: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="editorial-kicker text-ink/50">{stage}</span>
        <span className="text-ink/62 text-right text-xs">{label}</span>
      </div>
      <div className="bg-ink/8 h-2">
        <div className="bg-[#9a773f] h-full" style={{ width }} />
      </div>
    </div>
  );
}

function Review({
  name,
  city,
  date,
  title,
  text,
}: {
  name: string;
  city: string;
  date: string;
  title: string;
  text: string;
}) {
  return (
    <article className="py-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#9a773f]">
          {[0, 1, 2, 3, 4].map((star) => (
            <Star key={star} className="h-3 w-3 fill-current" />
          ))}
          <span className="text-ink/50 ml-2 text-xs">Verified purchase</span>
        </div>
        <span className="text-ink/40 text-xs">{date}</span>
      </div>
      <h3 className="font-display mt-4 text-2xl font-light">{title}</h3>
      <p className="text-ink/58 mt-3 max-w-2xl text-sm leading-7">{text}</p>
      <p className="editorial-kicker text-ink/46 mt-4">
        {name} · {city}
      </p>
    </article>
  );
}

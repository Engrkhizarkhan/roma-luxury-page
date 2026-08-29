"use client";

import Link from "next/link";
import {
  Grid2X2,
  List,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShopShell } from "@/components/ssaroma/ShopChrome";
import { ProductCardPreview } from "@/components/store/ProductCardPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addToCart } from "@/lib/cart";
import { formatMoney } from "@/lib/catalog";
import type { ProductItem, SiteSettings, TaxonomyItem } from "@/types/domain";

type Props = {
  products: ProductItem[];
  collections: TaxonomyItem[];
  categories: TaxonomyItem[];
  settings: SiteSettings;
  heading?: string;
  intro?: string;
};

export function ProductsCatalog({
  products,
  collections,
  categories,
  settings,
  heading = "A signature, chosen with intention.",
  intro = "Explore the complete house collection by note, mood, collection, and concentration.",
}: Props) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("all");
  const [category, setCategory] = useState("all");
  const [concentration, setConcentration] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products
      .filter((product) => {
        const text = [
          product.name,
          product.family,
          product.mood,
          product.story,
          ...product.notes.top,
          ...product.notes.heart,
          ...product.notes.base,
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!needle || text.includes(needle)) &&
          (collection === "all" || product.collectionSlug === collection) &&
          (category === "all" || product.categorySlug === category) &&
          (concentration === "all" || product.concentration === concentration) &&
          (availability === "all" || !product.outOfStock)
        );
      })
      .sort((a, b) =>
        sort === "price-asc"
          ? a.price - b.price
          : sort === "price-desc"
            ? b.price - a.price
            : sort === "newest"
              ? b.launchYear - a.launchYear
              : Number(b.featured) - Number(a.featured) || b.rating - a.rating,
      );
  }, [availability, category, collection, concentration, products, query, sort]);
  const reset = () => {
    setQuery("");
    setCollection("all");
    setCategory("all");
    setConcentration("all");
    setAvailability("all");
    setSort("featured");
  };
  const activeFilters = [collection, category, concentration, availability].filter(
    (value) => value !== "all",
  ).length;
  const filters = (fullWidth = false) => (
    <>
      <Filter
        label="Collection"
        value={collection}
        onChange={setCollection}
        items={collections.map((item) => [item.slug, item.name])}
        fullWidth={fullWidth}
      />
      <Filter
        label="Category"
        value={category}
        onChange={setCategory}
        items={categories.map((item) => [item.slug, item.name])}
        fullWidth={fullWidth}
      />
      <Filter
        label="Concentration"
        value={concentration}
        onChange={setConcentration}
        items={[
          ["EDT", "EDT"],
          ["EDP", "EDP"],
          ["Parfum", "Parfum"],
          ["Extrait", "Extrait"],
        ]}
        fullWidth={fullWidth}
      />
      <Filter
        label="Availability"
        value={availability}
        onChange={setAvailability}
        items={[["stock", "In stock"]]}
        fullWidth={fullWidth}
      />
      <Filter
        label="Sort"
        value={sort}
        onChange={setSort}
        items={[
          ["featured", "Featured"],
          ["price-asc", "Price: low to high"],
          ["price-desc", "Price: high to low"],
          ["newest", "Newest"],
        ]}
        hideAll
        fullWidth={fullWidth}
      />
    </>
  );
  return (
    <ShopShell products={products} settings={settings}>
      <section className="border-ink/10 border-b bg-cream">
        <div className="mx-auto max-w-370 px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
          <p className="editorial-kicker text-gold">The fragrance edit</p>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <h1 className="font-display max-w-[17ch] text-4xl leading-none font-light sm:text-5xl">
              {heading}
            </h1>
            <p className="text-ink/58 max-w-md text-sm leading-7">{intro}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-370 px-5 pt-8 sm:px-8 lg:px-12">
        <div className="border-ink/14 flex items-end gap-3 border-b pb-6 lg:grid lg:grid-cols-[1fr_repeat(5,auto)]">
          <label className="min-w-0 flex-1">
            <span className="editorial-kicker text-ink/52">Search</span>
            <div className="relative mt-2">
              <Search className="text-ink/42 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Fragrance, note or mood"
                className="h-11 pl-10 lg:h-10 lg:w-72"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </label>
          <div className="hidden contents lg:contents">{filters()}</div>
          <Sheet>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" className="h-11 shrink-0 lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Filters{activeFilters ? ` (${activeFilters})` : ""}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-offwhite border-ink/15 flex w-[92%] flex-col p-0">
              <SheetHeader className="border-ink/12 border-b px-6 py-6 text-left">
                <SheetTitle className="font-display text-3xl font-light">Refine the edit</SheetTitle>
                <SheetDescription>Choose a collection, profile, concentration, or order.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-7">{filters(true)}</div>
              <SheetFooter className="border-ink/12 border-t p-6">
                <button type="button" onClick={reset} className="editorial-kicker px-4 py-3">
                  Reset
                </button>
                <SheetClose asChild>
                  <Button type="button" className="h-12 flex-1">
                    Show {filtered.length} fragrances
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center justify-between py-6">
          <p className="text-ink/52 text-xs">
            {filtered.length} {filtered.length === 1 ? "fragrance" : "fragrances"}
          </p>
          <div className="border-ink/20 flex border">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`p-2.5 ${view === "grid" ? "bg-ink text-cream" : ""}`}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={`p-2.5 ${view === "list" ? "bg-ink text-cream" : ""}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        {filtered.length ? (
          <div
            className={
              view === "grid" ? "grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" : "space-y-5"
            }
          >
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                list={view === "list"}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="border-ink/14 border-y py-20 text-center">
            <p className="font-display text-4xl font-light">No fragrance matches those choices.</p>
            <button onClick={reset} className="link-underlined editorial-kicker mt-6">
              Clear filters
            </button>
          </div>
        )}
      </section>
    </ShopShell>
  );
}

function Filter({
  label,
  value,
  onChange,
  items,
  hideAll = false,
  fullWidth = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: string[][];
  hideAll?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <label>
      <span className="editorial-kicker text-ink/52">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`mt-2 h-10 min-w-36 bg-transparent ${fullWidth ? "w-full" : ""}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {!hideAll && <SelectItem value="all">All</SelectItem>}
          {items.map(([key, text]) => (
            <SelectItem key={key} value={key!}>
              {text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function ProductCard({
  product,
  list,
  priority,
}: {
  product: ProductItem;
  list: boolean;
  priority: boolean;
}) {
  const add = () => {
    if (product.outOfStock) return;
    addToCart(product.id);
    toast.success(`${product.name} added to your bag`);
  };
  if (list)
    return (
      <article className="product-card border-ink/12 relative grid gap-5 border p-4 sm:grid-cols-[160px_1fr_auto] sm:items-center">
        <Link
          href={`/products/${product.slug}`}
          className="focus-ring absolute inset-0 z-10"
          aria-label={`View ${product.name}`}
        />
        <ProductCardPreview product={product} eager={priority} square />
        <div>
          <p className="editorial-kicker text-gold">
            {product.collection} · {product.concentration}
          </p>
          <h2 className="font-display mt-3 text-4xl font-light">{product.name}</h2>
          <p className="text-ink/55 mt-3 text-sm">{product.mood}</p>
        </div>
        <div className="sm:text-right">
          <p className="font-medium">{formatMoney(product.price)}</p>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              add();
            }}
            disabled={product.outOfStock}
            className="relative z-20 mt-4"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {product.outOfStock ? "Unavailable" : "Add to bag"}
          </Button>
        </div>
      </article>
    );
  return (
    <article className="product-card relative -m-3 p-3">
      <Link
        href={`/products/${product.slug}`}
        className="focus-ring absolute inset-0 z-10"
        aria-label={`View ${product.name}`}
      />
      <ProductCardPreview product={product} eager={priority} />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="editorial-kicker text-ink/45">
            {product.collection} · {product.concentration}
          </p>
          <h2 className="font-display mt-2 text-3xl font-light">{product.name}</h2>
          <p className="text-ink/52 mt-2 text-xs">{product.mood}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{formatMoney(product.price)}</p>
          <button
            onClick={(event) => {
              event.stopPropagation();
              add();
            }}
            disabled={product.outOfStock}
            className="editorial-kicker text-gold relative z-20 mt-3 disabled:text-ink/30"
          >
            {product.outOfStock ? "Unavailable" : "+ Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

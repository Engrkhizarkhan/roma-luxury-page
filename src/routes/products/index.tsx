import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Grid2X2, List, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ProductMediaCarousel } from "@/components/ssaroma/ProductMediaCarousel";
import { ShopShell } from "@/components/ssaroma/ShopChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { addToCart } from "@/lib/cart";
import { formatMoney, products, type ProductItem } from "@/lib/catalog";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Fragrance Collection | SSAROMA" },
      {
        name: "description",
        content: "Explore SSAROMA fragrances by collection, concentration, profile and price.",
      },
    ],
  }),
  component: ProductsIndex,
});

type SortMode = "featured" | "price-asc" | "price-desc" | "newest" | "rating";
type ViewMode = "grid" | "list";

const collections = ["Signature", "Evening", "Daily", "Limited"] as const;
const concentrations = ["EDP", "Parfum", "Extrait"] as const;

function ProductsIndex() {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("all");
  const [gender, setGender] = useState("all");
  const [concentration, setConcentration] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sort, setSort] = useState<SortMode>("featured");
  const [view, setView] = useState<ViewMode>("grid");

  const resetFilters = () => {
    setQuery("");
    setCollection("all");
    setGender("all");
    setConcentration("all");
    setAvailability("all");
    setMaxPrice(30000);
    setSort("featured");
  };

  const activeFilterCount = [
    collection !== "all",
    gender !== "all",
    concentration !== "all",
    availability !== "all",
    maxPrice < 30000,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const base = products.filter((item) => {
      const searchText = [
        item.name,
        item.family,
        item.mood,
        item.story,
        ...item.notes.top,
        ...item.notes.heart,
        ...item.notes.base,
      ]
        .join(" ")
        .toLowerCase();

      const byQuery = normalizedQuery.length === 0 || searchText.includes(normalizedQuery);
      const byCollection = collection === "all" || item.collection === collection;
      const byGender = gender === "all" || item.gender === gender;
      const byConcentration = concentration === "all" || item.concentration === concentration;
      const byAvailability = availability === "all" || !item.outOfStock;
      const byPrice = item.price <= maxPrice;

      return byQuery && byCollection && byGender && byConcentration && byAvailability && byPrice;
    });

    return [...base].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return b.launchYear - a.launchYear;
      if (sort === "rating") return b.rating - a.rating;
      if (a.featured === b.featured) return b.rating - a.rating;
      return a.featured ? -1 : 1;
    });
  }, [availability, collection, concentration, gender, maxPrice, query, sort]);

  const filterProps: FilterPanelProps = {
    collection,
    setCollection,
    gender,
    setGender,
    concentration,
    setConcentration,
    availability,
    setAvailability,
    maxPrice,
    setMaxPrice,
    resetFilters,
  };

  return (
    <ShopShell>
      <section className="border-ink/10 border-b bg-cream">
        {/* <div className="mx-auto grid max-w-370 gap-8 px-5 py-14 sm:px-8 md:grid-cols-[1fr_auto] md:items-end md:py-18 lg:px-12">
          <div>
            <p className="editorial-kicker text-[#8b6b3e]">The fragrance edit · 2026</p>
            <h1 className="font-display mt-5 max-w-[13ch] text-[3.25rem] leading-[0.92] font-light tracking-[-0.035em] sm:text-[4.7rem]">
              A signature, chosen with intention.
            </h1>
          </div>
          <p className="text-ink/60 max-w-md text-sm leading-7 md:pb-2">
            Explore the complete house collection. Drag with a mouse or swipe on touch to move
            through each fragrance’s imagery.
          </p>
        </div> */}
      </section>

      <section className="mx-auto max-w-370 px-5 pt-9 sm:px-8 lg:px-12">
        <div className="border-ink/14 flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
          <label className="max-w-xl flex-1">
            <span className="editorial-kicker text-ink/52">Search the collection</span>
            <div className="relative mt-2">
              <Search className="text-ink/42 pointer-events-none absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by fragrance, note or mood"
                className="border-ink/22 h-11 border-x-0 border-t-0 bg-transparent pr-9 pl-7 shadow-none focus-visible:ring-0"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="focus-ring text-ink/45 absolute top-1/2 right-1 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </label>

          <div className="flex flex-wrap items-end gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-ink/22 h-10 bg-transparent lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                  {activeFilterCount > 0 ? (
                    <span className="bg-ink text-cream ml-2 flex h-5 min-w-5 items-center justify-center px-1 text-[0.65rem]">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-offwhite w-full overflow-y-auto sm:max-w-md">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-display text-3xl font-light">
                    Refine the edit
                  </SheetTitle>
                  <SheetDescription>
                    Choose a profile that suits the way you wear fragrance.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8">
                  <FilterPanel {...filterProps} />
                </div>
              </SheetContent>
            </Sheet>

            <label>
              <span className="editorial-kicker text-ink/52">Sort</span>
              <Select value={sort} onValueChange={(value) => setSort(value as SortMode)}>
                <SelectTrigger className="border-ink/22 mt-2 h-10 w-49 bg-transparent">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Curator’s choice</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="newest">Newest launches</SelectItem>
                  <SelectItem value="rating">Best reviewed</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <div className="border-ink/22 flex h-10 border" aria-label="Product view">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`focus-ring flex w-10 items-center justify-center ${view === "grid" ? "bg-ink text-cream" : "text-ink/48"}`}
                aria-label="Grid view"
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`focus-ring flex w-10 items-center justify-center ${view === "list" ? "bg-ink text-cream" : "text-ink/48"}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-10 pt-8 lg:grid-cols-[230px_1fr] xl:grid-cols-[260px_1fr]">
          <aside className="border-ink/12 hidden border-r pr-8 lg:block">
            <FilterPanel {...filterProps} />
          </aside>

          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-ink/58 text-sm">
                <span className="text-ink font-medium tabular-nums">{filtered.length}</span>{" "}
                fragrances
              </p>
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="link-underlined editorial-kicker text-ink/55 hover:text-ink"
                >
                  Clear {activeFilterCount} filters
                </button>
              ) : null}
            </div>

            {filtered.length > 0 ? (
              <div
                className={
                  view === "grid"
                    ? "mt-7 grid gap-x-5 gap-y-11 sm:grid-cols-2 xl:grid-cols-3"
                    : "mt-7 space-y-0"
                }
              >
                {filtered.map((item, index) => (
                  <ProductResult key={item.id} item={item} view={view} priority={index < 3} />
                ))}
              </div>
            ) : (
              <div className="border-ink/14 mt-7 border-y py-20 text-center">
                <p className="editorial-kicker text-[#8b6b3e]">No match found</p>
                <h2 className="font-display mt-4 text-4xl font-light">
                  Try a broader fragrance profile.
                </h2>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="border-ink/25 mt-7 bg-transparent"
                >
                  Reset all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </ShopShell>
  );
}

type FilterPanelProps = {
  collection: string;
  setCollection: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  concentration: string;
  setConcentration: (value: string) => void;
  availability: string;
  setAvailability: (value: string) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  resetFilters: () => void;
};

function FilterPanel({
  collection,
  setCollection,
  gender,
  setGender,
  concentration,
  setConcentration,
  availability,
  setAvailability,
  maxPrice,
  setMaxPrice,
  resetFilters,
}: FilterPanelProps) {
  const options = (
    title: string,
    values: readonly string[],
    active: string,
    onChange: (value: string) => void,
  ) => (
    <fieldset className="border-ink/12 border-b pb-6">
      <legend className="editorial-kicker text-ink/54 mb-4">{title}</legend>
      <div className="space-y-3">
        <FilterOption label="All" active={active === "all"} onClick={() => onChange("all")} />
        {values.map((value) => (
          <FilterOption
            key={value}
            label={value}
            active={active === value}
            onClick={() => onChange(value)}
          />
        ))}
      </div>
    </fieldset>
  );

  return (
    <div className="space-y-6">
      {options("Collection", collections, collection, setCollection)}
      {options("For", ["male", "female"], gender, setGender)}
      {options("Concentration", concentrations, concentration, setConcentration)}

      <fieldset className="border-ink/12 border-b pb-6">
        <legend className="editorial-kicker text-ink/54 mb-4">Availability</legend>
        <FilterOption
          label="All fragrances"
          active={availability === "all"}
          onClick={() => setAvailability("all")}
        />
        <div className="mt-3">
          <FilterOption
            label="Available now"
            active={availability === "in-stock"}
            onClick={() => setAvailability("in-stock")}
          />
        </div>
      </fieldset>

      <fieldset className="border-ink/12 border-b pb-6">
        <legend className="editorial-kicker text-ink/54 mb-4">Price up to</legend>
        <div className="flex items-center justify-between text-sm">
          <span>PKR 15,000</span>
          <span className="font-medium">{formatMoney(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="15000"
          max="30000"
          step="500"
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="accent-ink mt-4 w-full"
          aria-label="Maximum price"
        />
      </fieldset>

      <button
        type="button"
        onClick={resetFilters}
        className="link-underlined editorial-kicker text-ink/52 hover:text-ink"
      >
        Reset filters
      </button>
    </div>
  );
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex w-full items-center justify-between text-left text-sm capitalize"
    >
      <span className={active ? "text-ink" : "text-ink/58"}>{label}</span>
      <span
        className={`flex h-4 w-4 items-center justify-center border ${active ? "border-ink bg-ink text-cream" : "border-ink/25"}`}
      >
        {active ? <Check className="h-3 w-3" /> : null}
      </span>
    </button>
  );
}

function ProductResult({
  item,
  view,
  priority,
}: {
  item: ProductItem;
  view: ViewMode;
  priority: boolean;
}) {
  const quickAdd = () => {
    if (item.outOfStock) return;
    addToCart(item.id);
    toast.success(`${item.name} added to your bag`, {
      description: `${item.concentration} · ${item.sizeMl} ml`,
    });
  };

  if (view === "list") {
    return (
      <article className="border-ink/14 grid gap-5 border-t py-6 first:border-t-0 sm:grid-cols-[180px_1fr_auto] sm:items-center">
        <ProductMediaCarousel
          product={item}
          imageClassName="aspect-[4/5] sm:h-56"
          priority={priority}
        />
        <div>
          <p className="editorial-kicker text-[#8b6b3e]">
            {item.collection} · {item.concentration}
          </p>
          <Link
            to="/products/$slug"
            params={{ slug: item.slug }}
            className="font-display hover:text-[#8b6b3e] mt-3 block text-4xl font-light transition-colors"
          >
            {item.name}
          </Link>
          <p className="text-ink/50 mt-3 text-xs tracking-[0.1em] uppercase">{item.family}</p>
          <p className="text-ink/62 mt-4 max-w-xl text-sm leading-7">{item.story}</p>
        </div>
        <div className="sm:min-w-44 sm:text-right">
          <p className="text-lg tabular-nums">{formatMoney(item.price)}</p>
          <p className="text-ink/42 mt-1 text-xs line-through">{formatMoney(item.compareAt)}</p>
          <Button
            onClick={quickAdd}
            disabled={item.outOfStock}
            className="bg-ink text-cream hover:bg-[#aa8755] hover:text-ink mt-5 h-10 w-full sm:w-auto"
          >
            {item.outOfStock ? "Unavailable" : "Quick add"}
          </Button>
          <Link
            to="/products/$slug"
            params={{ slug: item.slug }}
            className="link-underlined editorial-kicker text-ink/55 hover:text-ink mt-4 block"
          >
            View fragrance →
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group">
      <div className="relative">
        <ProductMediaCarousel product={item} priority={priority} />
        {item.outOfStock ? (
          <span className="editorial-kicker bg-ink text-cream absolute top-3 right-3 px-2.5 py-1.5">
            Unavailable
          </span>
        ) : null}
        {!item.outOfStock ? (
          <button
            type="button"
            onClick={quickAdd}
            className="editorial-kicker bg-offwhite text-ink absolute right-3 bottom-3 left-3 hidden h-11 border border-black/10 opacity-0 transition-opacity group-hover:opacity-100 md:block"
          >
            Quick add
          </button>
        ) : null}
      </div>
      <div className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="editorial-kicker text-[#8b6b3e]">
              {item.collection} · {item.concentration}
            </p>
            <Link
              to="/products/$slug"
              params={{ slug: item.slug }}
              className="font-display hover:text-[#8b6b3e] mt-2 block text-[2rem] leading-none font-light transition-colors"
            >
              {item.name}
            </Link>
          </div>
          <p className="pt-5 text-sm tabular-nums">{formatMoney(item.price)}</p>
        </div>
        <p className="text-ink/48 mt-3 text-[0.65rem] tracking-[0.1em] uppercase">{item.family}</p>
        <p className="text-ink/58 mt-3 text-sm">{item.mood}</p>
        <Link
          to="/products/$slug"
          params={{ slug: item.slug }}
          className="link-underlined editorial-kicker text-ink/55 hover:text-ink mt-4 inline-block"
        >
          View fragrance →
        </Link>
        <Button
          onClick={quickAdd}
          disabled={item.outOfStock}
          variant="outline"
          className="border-ink/22 mt-5 w-full bg-transparent md:hidden"
        >
          {item.outOfStock ? "Unavailable" : "Quick add"}
        </Button>
      </div>
    </article>
  );
}

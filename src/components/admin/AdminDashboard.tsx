"use client";

import Link from "next/link";
import {
  Box,
  ChevronDown,
  CircleDollarSign,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
  Truck,
  UploadCloud,
  X,
} from "lucide-react";
import { Fragment, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { formatMoney } from "@/lib/catalog";
import type {
  MediaItem,
  ContactRecord,
  OrderRecord,
  ProductItem,
  PromoCode,
  ReturnCase,
  SiteSettings,
  TaxonomyItem,
} from "@/types/domain";

type DashboardData = {
  products: ProductItem[];
  orders: OrderRecord[];
  promotions: PromoCode[];
  returns: ReturnCase[];
  contacts: ContactRecord[];
  categories: TaxonomyItem[];
  collections: TaxonomyItem[];
  settings: SiteSettings;
  metrics: {
    revenue: number;
    orderCount: number;
    averageOrder: number;
    delivered: number;
    dispatchQueue: number;
    productCount: number;
    lowStock: number;
  };
};
type View =
  | "overview"
  | "orders"
  | "fulfillment"
  | "finance"
  | "catalog"
  | "taxonomy"
  | "promotions"
  | "returns"
  | "enquiries"
  | "settings";
type HomeCopyKey = Exclude<
  keyof SiteSettings["home"],
  "showHouse" | "showVisit" | "showCollection" | "showGallery" | "showCta"
>;

const nav: Array<[View, string, typeof LayoutDashboard]> = [
  ["overview", "Dashboard", LayoutDashboard],
  ["orders", "Orders", ShoppingBag],
  ["fulfillment", "Dispatch", Truck],
  ["finance", "Revenue", CircleDollarSign],
  ["catalog", "Products", Box],
  ["taxonomy", "Collections", FolderTree],
  ["promotions", "Discounts", Tag],
  ["returns", "Returns", RotateCcw],
  ["enquiries", "Enquiries", Mail],
  ["settings", "Store settings", Store],
];

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "content-type": "application/json" }),
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body as T;
}

export function AdminDashboard({
  initialData,
  username,
}: {
  initialData: DashboardData;
  username: string;
}) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [view, setView] = useState<View>("overview");
  const [mobile, setMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const title: Record<View, [string, string]> = {
    overview: ["Dashboard", "Orders, revenue, stock, and recent activity at a glance."],
    orders: ["Orders", "View every order and update its status."],
    fulfillment: ["Dispatch", "See only orders that still need action."],
    finance: ["Revenue", "Track completed sales and daily performance."],
    catalog: ["Products", "Update fragrances, stock, prices, and media."],
    taxonomy: ["Collections", "Organize products into collections and categories."],
    promotions: ["Discounts", "Create and manage promotional codes."],
    returns: ["Returns", "Review return requests and refunds."],
    enquiries: ["Enquiries", "Read and resolve messages from the public contact form."],
    settings: ["Store settings", "Update contact details, delivery, and homepage content."],
  };
  const logout = async () => {
    await api("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };
  const update = <K extends keyof DashboardData>(key: K, value: DashboardData[K]) =>
    setData((current) => ({ ...current, [key]: value }));
  return (
    <div
      className={`admin-dashboard bg-[#f1efe9] text-[#171713] min-h-screen lg:grid ${sidebarCollapsed ? "lg:grid-cols-[88px_1fr]" : "lg:grid-cols-[288px_1fr]"}`}
    >
      <aside className="bg-[#171713] text-[#f3efe5] sticky top-0 hidden h-screen min-w-0 flex-col transition-[width] lg:flex">
        <Brand collapsed={sidebarCollapsed} />
        <Navigation value={view} setValue={setView} data={data} collapsed={sidebarCollapsed} />
        <div className="mt-auto border-t border-white/10 p-4">
          <button
            onClick={logout}
            title={sidebarCollapsed ? "Sign out" : undefined}
            className={`flex w-full items-center px-3 py-3 text-xs text-white/55 hover:text-white ${sidebarCollapsed ? "justify-center" : "gap-3"}`}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed ? "Sign out" : null}
          </button>
          {!sidebarCollapsed ? <p className="px-3 pt-3 text-xs text-white/35">{username}</p> : null}
        </div>
      </aside>
      <div className="min-w-0">
        <header className="border-black/10 bg-[#f1efe9]/95 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur sm:px-7">
          <button
            className="lg:hidden"
            onClick={() => setMobile(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-4 lg:flex">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((current) => !current)}
              className="border-black/15 border p-2 text-black/55 transition-colors hover:text-black"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
            <p className="text-xs text-black/45">
              SSAROMA / <span className="text-black">{title[view][0]}</span>
            </p>
          </div>
          <Link
            href="/products"
            target="_blank"
            className="border-black/15 flex items-center gap-2 border px-3 py-2 text-xs"
          >
            <Store className="h-4 w-4" />
            View shop
          </Link>
        </header>
        <Sheet open={mobile} onOpenChange={setMobile}>
          <SheetContent side="left" className="bg-[#171713] text-white border-white/10 p-0">
            <Brand />
            <Navigation
              value={view}
              data={data}
              setValue={(next) => {
                setView(next);
                setMobile(false);
              }}
            />
          </SheetContent>
        </Sheet>
        <main className="px-4 py-7 sm:px-7 lg:px-10">
          <div className="mb-8 border-b border-black/10 pb-6">
            <h1 className="font-display text-5xl font-light">{title[view][0]}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-black/55">{title[view][1]}</p>
          </div>
          {view === "overview" && <Overview data={data} />}
          {view === "orders" && (
            <OrdersPanel orders={data.orders} update={(orders) => update("orders", orders)} />
          )}
          {view === "fulfillment" && (
            <OrdersPanel
              orders={data.orders.filter(
                (order) => !["delivered", "cancelled"].includes(order.status),
              )}
              update={(orders) =>
                update(
                  "orders",
                  data.orders.map((old) => orders.find((item) => item.id === old.id) || old),
                )
              }
              fulfillment
            />
          )}
          {view === "finance" && <Finance orders={data.orders} />}
          {view === "catalog" && (
            <Catalog
              products={data.products}
              categories={data.categories}
              collections={data.collections}
              update={(products) => update("products", products)}
            />
          )}
          {view === "taxonomy" && (
            <Taxonomy
              categories={data.categories}
              collections={data.collections}
              updateCategories={(value) => update("categories", value)}
              updateCollections={(value) => update("collections", value)}
            />
          )}
          {view === "promotions" && (
            <Promotions items={data.promotions} update={(value) => update("promotions", value)} />
          )}
          {view === "returns" && (
            <Returns
              items={data.returns}
              orders={data.orders}
              update={(value) => update("returns", value)}
            />
          )}
          {view === "enquiries" && (
            <Enquiries items={data.contacts} update={(value) => update("contacts", value)} />
          )}
          {view === "settings" && (
            <Settings value={data.settings} update={(value) => update("settings", value)} />
          )}
        </main>
      </div>
    </div>
  );
}

function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`border-b border-white/10 py-6 ${collapsed ? "px-3 text-center" : "px-7"}`}>
      <p className="wordmark text-sm">{collapsed ? "SSA" : "SSAROMA"}</p>
      {!collapsed ? (
        <p className="mt-2 text-xs tracking-[.12em] text-white/45 uppercase">Store operations</p>
      ) : null}
    </div>
  );
}
function Navigation({
  value,
  setValue,
  data,
  collapsed = false,
}: {
  value: View;
  setValue: (v: View) => void;
  data: DashboardData;
  collapsed?: boolean;
}) {
  return (
    <nav className={`admin-sidebar-scroll flex-1 overflow-y-auto ${collapsed ? "p-2" : "p-4"}`}>
      {nav.map(([key, label, Icon]) => {
        const count =
          key === "fulfillment"
            ? data.orders.filter((order) =>
                ["pending", "processing", "shipped"].includes(order.status),
              ).length
            : key === "returns"
              ? data.returns.filter((r) => !["refunded", "rejected"].includes(r.status)).length
              : key === "enquiries"
                ? data.contacts.filter((item) => item.status === "new").length
                : 0;
        return (
          <button
            key={key}
            onClick={() => setValue(key)}
            title={collapsed ? label : undefined}
            aria-label={label}
            className={`relative mb-1 flex w-full items-center px-3 py-3 text-left text-sm ${collapsed ? "justify-center" : "gap-3"} ${value === key ? "bg-[#aa8755] font-semibold text-[#171713]" : "text-white/65 hover:bg-white/5 hover:text-white"}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed ? <span className="flex-1">{label}</span> : null}
            {count > 0 && (
              <span
                className={`bg-white/10 px-2 py-0.5 text-[.6rem] ${collapsed ? "absolute top-1 right-1 min-w-5 px-1 text-center" : ""}`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function Overview({ data }: { data: DashboardData }) {
  const deliveredOrders = data.orders.filter((order) => order.status === "delivered");
  const liveRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
  const liveAverage = deliveredOrders.length ? Math.round(liveRevenue / deliveredOrders.length) : 0;
  const dispatchQueue = data.orders.filter((order) =>
    ["pending", "processing", "shipped"].includes(order.status),
  ).length;
  const lowStock = data.products.filter((product) => product.stock <= 5).length;
  const chart = useMemo(() => {
    const days = new Map<string, number>();
    for (const order of data.orders) {
      if (order.status !== "delivered") continue;
      const day = new Date(order.placedAt).toLocaleDateString("en-PK", {
        month: "short",
        day: "numeric",
      });
      days.set(day, (days.get(day) || 0) + order.total);
    }
    return [...days].slice(-14).map(([day, revenue]) => ({ day, revenue }));
  }, [data.orders]);
  const metrics = [
    ["Delivered revenue", formatMoney(liveRevenue), "From completed orders"],
    ["All orders", String(data.orders.length), `${dispatchQueue} still need action`],
    ["Average sale", formatMoney(liveAverage), "Across delivered orders"],
    ["Products", String(data.products.length), `${lowStock} low in stock`],
  ];
  return (
    <div className="space-y-7">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, note]) => (
          <section key={label} className="border border-black/10 bg-white/45 p-5">
            <p className="editorial-kicker text-black/40">{label}</p>
            <p className="font-display mt-4 text-4xl font-light">{value}</p>
            <p className="mt-2 text-xs text-black/40">{note}</p>
          </section>
        ))}
      </div>
      <section className="border border-black/10 bg-white/45 p-5">
        <h2 className="font-display text-3xl font-light">Order revenue</h2>
        <div className="mt-6 h-72">
          {chart.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,.08)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={72} />
                <Tooltip formatter={(value) => formatMoney(Number(value))} />
                <Bar dataKey="revenue" fill="#aa8755" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty text="Revenue will appear after orders are placed." />
          )}
        </div>
      </section>
      <section className="border border-black/10 bg-white/45">
        <PanelTitle title="Recent orders" note="Latest storefront activity" />
        <OrderTable orders={data.orders.slice(0, 6)} onStatus={undefined} />
      </section>
    </div>
  );
}

function OrdersPanel({
  orders,
  update,
  fulfillment = false,
}: {
  orders: OrderRecord[];
  update: (orders: OrderRecord[]) => void;
  fulfillment?: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? orders : orders.filter((order) => order.status === filter);
  const change = async (id: string, status: OrderRecord["status"]) => {
    try {
      const { order } = await api<{ order: OrderRecord }>(`/api/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      update(orders.map((item) => (item.id === id ? order : item)));
      toast.success(`${order.orderNumber} moved to ${status}.`);
    } catch (error) {
      toast.error(message(error));
    }
  };
  return (
    <section className="border border-black/10 bg-white/45">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 p-5">
        <div>
          <h2 className="font-display text-3xl font-light">
            {fulfillment ? "Active fulfillment" : "All client orders"}
          </h2>
          <p className="mt-1 text-xs text-black/40">{filtered.length} records</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <OrderTable orders={filtered} onStatus={change} />
    </section>
  );
}
function OrderTable({
  orders,
  onStatus,
}: {
  orders: OrderRecord[];
  onStatus?: (id: string, status: OrderRecord["status"]) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const open = expanded === order.id;
            return (
              <Fragment key={order.id}>
                <TableRow>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : order.id)}
                      className="group text-left"
                      aria-expanded={open}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {order.orderNumber}
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-black/35 transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </span>
                      <span className="mt-1 block text-[.65rem] text-black/40">{order.city}</span>
                    </button>
                  </TableCell>
                  <TableCell>
                    {order.customer}
                    <p className="mt-1 text-[.65rem] text-black/40">{order.phone}</p>
                  </TableCell>
                  <TableCell>{date(order.placedAt)}</TableCell>
                  <TableCell>{order.itemCount}</TableCell>
                  <TableCell>{formatMoney(order.total)}</TableCell>
                  <TableCell>
                    {onStatus ? (
                      <Select
                        value={order.status}
                        onValueChange={(v) => onStatus(order.id, v as OrderRecord["status"])}
                      >
                        <SelectTrigger className="h-8 w-34">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["pending", "processing", "shipped", "delivered", "cancelled"].map(
                            (v) => (
                              <SelectItem key={v} value={v}>
                                {v}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Status value={order.status} />
                    )}
                  </TableCell>
                </TableRow>
                {open ? (
                  <TableRow className="bg-[#f7f5ef] hover:bg-[#f7f5ef]">
                    <TableCell colSpan={6} className="p-5 sm:p-7">
                      <div className="grid gap-7 lg:grid-cols-[1.25fr_1fr]">
                        <div>
                          <p className="editorial-kicker text-black/40">Order tracking</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {order.statusHistory.map((event, index) => (
                              <div
                                key={`${event.status}-${event.changedAt}-${index}`}
                                className="border-l-2 border-[#aa8755] pl-3"
                              >
                                <p className="text-sm font-semibold capitalize">{event.status}</p>
                                <p className="mt-1 text-xs text-black/45">
                                  {dateTime(event.changedAt)}
                                </p>
                                <p className="mt-1 text-xs text-black/35">by {event.changedBy}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                          <div>
                            <p className="editorial-kicker text-black/40">Delivery</p>
                            <p className="mt-2 text-sm leading-6">
                              {order.address}, {order.city}
                              {order.postalCode ? ` ${order.postalCode}` : ""}
                            </p>
                            {order.email ? (
                              <p className="mt-1 text-xs text-black/45">{order.email}</p>
                            ) : null}
                          </div>
                          <div>
                            <p className="editorial-kicker text-black/40">Items</p>
                            <div className="mt-2 space-y-1">
                              {order.items.map((item) => (
                                <p
                                  key={`${item.productId}-${item.name}`}
                                  className="flex justify-between gap-4 text-sm"
                                >
                                  <span>
                                    {item.quantity} × {item.name} · {item.sizeMl}ml
                                  </span>
                                  <span>{formatMoney(item.price * item.quantity)}</span>
                                </p>
                              ))}
                            </div>
                            {order.note ? (
                              <p className="mt-3 text-xs italic text-black/45">“{order.note}”</p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
          {!orders.length && (
            <TableRow>
              <TableCell colSpan={6}>
                <Empty text="No orders in this view." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function Finance({ orders }: { orders: OrderRecord[] }) {
  const delivered = orders.filter((o) => o.status === "delivered");
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const discount = orders.reduce((s, o) => s + o.discount, 0);
  const codPending = orders
    .filter((o) => !["delivered", "cancelled"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);
  const cities = Object.entries(
    orders.reduce<Record<string, number>>((acc, o) => {
      if (o.status !== "cancelled") acc[o.city] = (acc[o.city] || 0) + o.total;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Collected revenue" value={formatMoney(revenue)} />
        <Metric label="COD in progress" value={formatMoney(codPending)} />
        <Metric label="Promotions granted" value={formatMoney(discount)} />
      </div>
      <section className="border border-black/10 bg-white/45">
        <PanelTitle title="Revenue by city" note="Non-cancelled orders" />
        <div className="p-5 space-y-4">
          {cities.map(([city, total]) => (
            <div key={city}>
              <div className="flex justify-between text-xs">
                <span>{city}</span>
                <span>{formatMoney(total)}</span>
              </div>
              <div className="mt-2 h-1.5 bg-black/8">
                <div
                  className="h-full bg-[#aa8755]"
                  style={{ width: `${Math.max(4, (total / (cities[0]?.[1] || 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {!cities.length && <Empty text="Finance data will appear after orders arrive." />}
        </div>
      </section>
    </div>
  );
}

type ProductDraft = Omit<
  ProductItem,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "images"
  | "collection"
  | "collectionSlug"
  | "category"
  | "categorySlug"
  | "outOfStock"
> & { id?: string; collectionId: string; categoryId: string };
const blankProduct = (categories: TaxonomyItem[], collections: TaxonomyItem[]): ProductDraft => ({
  name: "",
  slug: "",
  sku: "",
  family: "",
  gender: "unisex",
  collectionId: collections[0]?.id || "",
  categoryId: categories[0]?.id || "",
  concentration: "EDP",
  sizeMl: 50,
  price: 0,
  compareAt: 0,
  stock: 0,
  featured: false,
  newArrival: false,
  published: false,
  rating: 0,
  reviewCount: 0,
  launchYear: new Date().getFullYear(),
  mood: "",
  story: "",
  seoTitle: "",
  seoDescription: "",
  notes: { top: [], heart: [], base: [] },
  media: [],
});

function Catalog({
  products,
  categories,
  collections,
  update,
}: {
  products: ProductItem[];
  categories: TaxonomyItem[];
  collections: TaxonomyItem[];
  update: (p: ProductItem[]) => void;
}) {
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const open = (p?: ProductItem) =>
    setDraft(
      p
        ? { ...p, id: p.id, collectionId: p.collectionId || "", categoryId: p.categoryId || "" }
        : blankProduct(categories, collections),
    );
  const remove = async (product: ProductItem) => {
    if (!confirm(`Delete ${product.name} and its Cloudinary media? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/products/${product.id}`, { method: "DELETE" });
      update(products.filter((p) => p.id !== product.id));
      toast.success(`${product.name} deleted.`);
    } catch (error) {
      toast.error(message(error));
    }
  };
  return (
    <section className="border border-black/10 bg-white/45">
      <div className="flex items-center justify-between border-b border-black/10 p-5">
        <div>
          <h2 className="font-display text-3xl font-light">Fragrance catalog</h2>
          <p className="mt-1 text-xs text-black/40">{products.length} products · database backed</p>
        </div>
        <Button onClick={() => open()}>
          <Plus className="mr-2 h-4 w-4" />
          Add fragrance
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fragrance</TableHead>
              <TableHead>Taxonomy</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt="" className="h-14 w-11 object-cover" />
                    ) : (
                      <div className="h-14 w-11 bg-black/5" />
                    )}
                    <div>
                      <p className="font-display text-xl">{p.name}</p>
                      <p className="text-[.65rem] text-black/40">{p.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {p.collection}
                  <p className="text-[.65rem] text-black/40">{p.category}</p>
                </TableCell>
                <TableCell>{formatMoney(p.price)}</TableCell>
                <TableCell className={p.stock <= 5 ? "text-red-800" : ""}>{p.stock}</TableCell>
                <TableCell>
                  <Status value={p.published ? "published" : "draft"} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => open(p)} className="border border-black/10 p-2">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="border border-black/10 p-2 text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ProductEditor
        draft={draft}
        setDraft={setDraft}
        categories={categories}
        collections={collections}
        saved={(product) => {
          update(
            draft?.id
              ? products.map((p) => (p.id === product.id ? product : p))
              : [product, ...products],
          );
          setDraft(null);
        }}
      />
    </section>
  );
}

function ProductEditor({
  draft,
  setDraft,
  categories,
  collections,
  saved,
}: {
  draft: ProductDraft | null;
  setDraft: (v: ProductDraft | null) => void;
  categories: TaxonomyItem[];
  collections: TaxonomyItem[];
  saved: (p: ProductItem) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  if (!draft) return null;
  const productMediaType = draft.media[0]?.type;
  const field = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) =>
    setDraft({ ...draft, [key]: value });
  const upload = async (files: File[]) => {
    if (!files.length) return;
    const chosenTypes = new Set(
      files.map((file) => (file.type.startsWith("video/") ? "video" : "image")),
    );
    if (chosenTypes.size > 1) {
      toast.error("Choose only images or only videos in one upload.");
      return;
    }
    const chosenType = [...chosenTypes][0];
    if (productMediaType && chosenType !== productMediaType) {
      toast.error(
        `This product already uses ${productMediaType}s. Remove them before uploading ${chosenType}s.`,
      );
      return;
    }
    setUploading(true);
    try {
      const added: MediaItem[] = [];
      for (const file of files) {
        const form = new FormData();
        form.set("file", file);
        form.set("alt", `${draft.name} fragrance`);
        const result = await api<{ media: MediaItem }>("/api/admin/media", {
          method: "POST",
          body: form,
        });
        added.push({ ...result.media, id: result.media.publicId });
      }
      field("media", [...draft.media, ...added]);
      toast.success(`${added.length} media file${added.length === 1 ? "" : "s"} uploaded.`);
    } catch (error) {
      toast.error(message(error));
    } finally {
      setUploading(false);
    }
  };
  const submit = async () => {
    setSaving(true);
    try {
      const body = {
        ...draft,
        notes: draft.notes,
        compareAt: Number(draft.compareAt) || undefined,
      };
      const result = await api<{ product: ProductItem }>(
        draft.id ? `/api/admin/products/${draft.id}` : "/api/admin/products",
        { method: draft.id ? "PATCH" : "POST", body: JSON.stringify(body) },
      );
      saved(result.product);
      toast.success(`${result.product.name} saved.`);
    } catch (error) {
      toast.error(message(error));
    } finally {
      setSaving(false);
    }
  };
  return (
    <Sheet open onOpenChange={(open) => !open && setDraft(null)}>
      <SheetContent className="bg-[#f7f5ef] w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl font-light">
            {draft.id ? "Edit" : "Add"} fragrance
          </SheetTitle>
          <SheetDescription>
            Storefront details, search metadata, availability, and Cloudinary media.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-7 space-y-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input
                value={draft.name}
                onChange={(e) => {
                  field("name", e.target.value);
                  if (!draft.id) field("slug", slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Slug">
              <Input value={draft.slug} onChange={(e) => field("slug", slugify(e.target.value))} />
            </Field>
            <Field label="SKU">
              <Input
                value={draft.sku}
                onChange={(e) => field("sku", e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Fragrance family">
              <Input value={draft.family} onChange={(e) => field("family", e.target.value)} />
            </Field>
            <Choice
              label="Collection"
              value={draft.collectionId}
              onChange={(v) => field("collectionId", v)}
              items={collections.map((i) => [i.id, i.name])}
            />
            <Choice
              label="Category"
              value={draft.categoryId}
              onChange={(v) => field("categoryId", v)}
              items={categories.map((i) => [i.id, i.name])}
            />
            <Choice
              label="Concentration"
              value={draft.concentration}
              onChange={(v) => field("concentration", v as ProductDraft["concentration"])}
              items={["EDT", "EDP", "Parfum", "Extrait"].map((v) => [v, v])}
            />
            <Choice
              label="Audience"
              value={draft.gender}
              onChange={(v) => field("gender", v as ProductDraft["gender"])}
              items={["male", "female", "unisex"].map((v) => [v, v])}
            />
            <NumberField
              label="Size (ml)"
              value={draft.sizeMl}
              onChange={(v) => field("sizeMl", v)}
            />
            <NumberField
              label="Price (PKR)"
              value={draft.price}
              onChange={(v) => field("price", v)}
            />
            <NumberField
              label="Compare-at price"
              value={draft.compareAt || 0}
              onChange={(v) => field("compareAt", v)}
            />
            <NumberField label="Stock" value={draft.stock} onChange={(v) => field("stock", v)} />
            <NumberField
              label="Launch year"
              value={draft.launchYear}
              onChange={(v) => field("launchYear", v)}
            />
            <NumberField label="Rating" value={draft.rating} onChange={(v) => field("rating", v)} />
          </div>
          <Field label="Mood line">
            <Input value={draft.mood} onChange={(e) => field("mood", e.target.value)} />
          </Field>
          <Field label="Story">
            <Textarea
              rows={5}
              value={draft.story}
              onChange={(e) => field("story", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            {(["top", "heart", "base"] as const).map((stage) => (
              <Field key={stage} label={`${stage} notes`}>
                <Textarea
                  rows={4}
                  value={draft.notes[stage].join(", ")}
                  onChange={(e) =>
                    field("notes", { ...draft.notes, [stage]: split(e.target.value) })
                  }
                />
              </Field>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SEO title">
              <Input
                value={draft.seoTitle || ""}
                maxLength={70}
                onChange={(e) => field("seoTitle", e.target.value)}
              />
            </Field>
            <Field label="SEO description">
              <Input
                value={draft.seoDescription || ""}
                maxLength={170}
                onChange={(e) => field("seoDescription", e.target.value)}
              />
            </Field>
          </div>
          <div className="flex flex-wrap gap-6">
            {(["published", "featured", "newArrival"] as const).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft[key]}
                  onChange={(e) => field(key, e.target.checked)}
                />
                {key}
              </label>
            ))}
          </div>
          <section className="border-t border-black/10 pt-6">
            <label className="border-black/18 flex cursor-pointer flex-col items-center border border-dashed p-7 text-center">
              <UploadCloud className="h-6 w-6 text-black/35" />
              <p className="mt-2 text-sm">
                {uploading
                  ? "Uploading securely…"
                  : productMediaType
                    ? `Add more ${productMediaType}s`
                    : "Choose images or videos"}
              </p>
              <p className="mt-1 text-xs text-black/45">
                A product can have one media type only. Remove existing media to switch type.
              </p>
              <input
                disabled={uploading}
                type="file"
                multiple
                className="sr-only"
                accept={
                  productMediaType === "image"
                    ? "image/jpeg,image/png,image/webp,image/avif"
                    : productMediaType === "video"
                      ? "video/mp4,video/webm,video/quicktime"
                      : "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
                }
                onChange={(e) => upload(Array.from(e.target.files || []))}
              />
            </label>
            <div className="mt-3 space-y-2">
              {draft.media.map((m, index) => (
                <div
                  key={m.publicId}
                  className="flex items-center gap-3 border border-black/10 p-2"
                >
                  {m.type === "image" ? (
                    <img src={m.url} alt="" className="h-12 w-12 object-cover" />
                  ) : (
                    <video src={m.url} className="h-12 w-12 object-cover" />
                  )}
                  <span className="flex-1 truncate text-xs">{m.publicId}</span>
                  <button
                    onClick={() =>
                      field(
                        "media",
                        draft.media.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <div className="sticky bottom-0 flex justify-end gap-2 border-t border-black/10 bg-[#f7f5ef] py-4">
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button disabled={saving || uploading} onClick={submit}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving…" : "Save fragrance"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Taxonomy({
  categories,
  collections,
  updateCategories,
  updateCollections,
}: {
  categories: TaxonomyItem[];
  collections: TaxonomyItem[];
  updateCategories: (v: TaxonomyItem[]) => void;
  updateCollections: (v: TaxonomyItem[]) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <TaxonomyList
        type="categories"
        title="Categories"
        items={categories}
        update={updateCategories}
      />
      <TaxonomyList
        type="collections"
        title="Collections"
        items={collections}
        update={updateCollections}
      />
    </div>
  );
}
function TaxonomyList({
  type,
  title,
  items,
  update,
}: {
  type: "categories" | "collections";
  title: string;
  items: TaxonomyItem[];
  update: (v: TaxonomyItem[]) => void;
}) {
  const [draft, setDraft] = useState<Partial<TaxonomyItem> | null>(null);
  const [uploading, setUploading] = useState(false);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    try {
      const payload = {
        name: draft.name,
        slug: draft.slug,
        description: draft.description || "",
        seoTitle: draft.seoTitle || "",
        seoDescription: draft.seoDescription || "",
        image: draft.image,
        active: draft.active ?? true,
        sortOrder: draft.sortOrder || 0,
      };
      const result = await api<{ item: TaxonomyItem }>(
        draft.id ? `/api/admin/taxonomy/${type}/${draft.id}` : `/api/admin/taxonomy/${type}`,
        { method: draft.id ? "PATCH" : "POST", body: JSON.stringify(payload) },
      );
      update(
        draft.id
          ? items.map((i) => (i.id === result.item.id ? result.item : i))
          : [...items, result.item],
      );
      setDraft(null);
      toast.success(`${result.item.name} saved.`);
    } catch (error) {
      toast.error(message(error));
    }
  };
  const uploadImage = async (file: File) => {
    if (!draft) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("alt", draft.name || title);
      const result = await api<{ media: MediaItem }>("/api/admin/media", {
        method: "POST",
        body: form,
      });
      setDraft({ ...draft, image: result.media });
      toast.success("Image uploaded. Save to publish it.");
    } catch (error) {
      toast.error(message(error));
    } finally {
      setUploading(false);
    }
  };
  const remove = async (item: TaxonomyItem) => {
    if (!confirm(`Delete ${item.name}?`)) return;
    try {
      await api(`/api/admin/taxonomy/${type}/${item.id}`, { method: "DELETE" });
      update(items.filter((i) => i.id !== item.id));
      toast.success(`${item.name} deleted.`);
    } catch (error) {
      toast.error(message(error));
    }
  };
  return (
    <section className="border border-black/10 bg-white/45">
      <div className="flex items-center justify-between border-b border-black/10 p-5">
        <div>
          <h2 className="font-display text-3xl font-light">{title}</h2>
          <p className="text-xs text-black/40">Public filters and SEO landing pages</p>
        </div>
        <Button
          onClick={() =>
            setDraft({ name: "", slug: "", description: "", active: true, sortOrder: items.length })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="divide-y divide-black/10">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-5">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="mt-1 text-xs text-black/40">
                /{type}/{item.slug} · {item.active ? "Active" : "Hidden"}
              </p>
            </div>
            <button onClick={() => setDraft(item)} className="p-2">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => remove(item)} className="p-2 text-red-800">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {!items.length && <Empty text={`No ${title.toLowerCase()} yet.`} />}
      </div>
      {draft && (
        <form onSubmit={save} className="border-t border-black/10 bg-[#f7f5ef] p-5 space-y-4">
          <Field label="Name">
            <Input
              required
              value={draft.name || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  name: e.target.value,
                  slug: draft.id ? draft.slug : slugify(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Slug">
            <Input
              required
              value={draft.slug || ""}
              onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
            />
          </Field>
          <Field label="Description">
            <Textarea
              required
              value={draft.description || ""}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </Field>
          <label className="block cursor-pointer border border-dashed border-black/15 p-4 text-center">
            {draft.image ? (
              <img src={draft.image.url} alt="" className="mx-auto h-32 w-full object-cover" />
            ) : (
              <UploadCloud className="mx-auto h-5 w-5 text-black/30" />
            )}
            <span className="editorial-kicker mt-3 block text-black/45">
              {uploading ? "Uploading…" : "Upload landing image"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={uploading}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) uploadImage(file);
              }}
            />
          </label>
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.active ?? true}
              onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
            />
            Visible publicly
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              Save
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

function Promotions({ items, update }: { items: PromoCode[]; update: (v: PromoCode[]) => void }) {
  const [creating, setCreating] = useState(false);
  const toggle = async (item: PromoCode) => {
    try {
      const result = await api<{ promotion: PromoCode }>(`/api/admin/promotions/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !item.active }),
      });
      update(items.map((i) => (i.id === item.id ? result.promotion : i)));
    } catch (error) {
      toast.error(message(error));
    }
  };
  const remove = async (item: PromoCode) => {
    if (!confirm(`Delete ${item.code}?`)) return;
    try {
      await api(`/api/admin/promotions/${item.id}`, { method: "DELETE" });
      update(items.filter((i) => i.id !== item.id));
    } catch (error) {
      toast.error(message(error));
    }
  };
  return (
    <section className="border border-black/10 bg-white/45">
      <div className="flex justify-between border-b border-black/10 p-5">
        <div>
          <h2 className="font-display text-3xl">Campaigns</h2>
          <p className="text-xs text-black/40">Validated during public checkout</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New promotion
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Offer</TableHead>
            <TableHead>Minimum</TableHead>
            <TableHead>Window</TableHead>
            <TableHead>Uses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.code}</TableCell>
              <TableCell>
                {item.discountType === "percent"
                  ? `${item.discountValue}%`
                  : formatMoney(item.discountValue)}
              </TableCell>
              <TableCell>{formatMoney(item.minOrder)}</TableCell>
              <TableCell>
                {date(item.validFrom)} – {date(item.validTo)}
              </TableCell>
              <TableCell>{item.usageCount}</TableCell>
              <TableCell>
                <button onClick={() => toggle(item)}>
                  <Status value={item.active ? "active" : "paused"} />
                </button>
              </TableCell>
              <TableCell>
                <button onClick={() => remove(item)} className="text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {creating && (
        <PromotionForm
          close={() => setCreating(false)}
          saved={(item) => {
            update([item, ...items]);
            setCreating(false);
          }}
        />
      )}
    </section>
  );
}
function PromotionForm({ close, saved }: { close: () => void; saved: (p: PromoCode) => void }) {
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const result = await api<{ promotion: PromoCode }>("/api/admin/promotions", {
        method: "POST",
        body: JSON.stringify({
          code: f.get("code"),
          discountType: f.get("type"),
          discountValue: Number(f.get("value")),
          minOrder: Number(f.get("minimum")),
          validFrom: f.get("from"),
          validTo: f.get("to"),
          active: true,
        }),
      });
      saved(result.promotion);
      toast.success(`${result.promotion.code} created.`);
    } catch (error) {
      toast.error(message(error));
    }
  };
  return (
    <form
      onSubmit={submit}
      className="grid gap-4 border-t border-black/10 bg-[#f7f5ef] p-5 sm:grid-cols-2"
    >
      <Field label="Code">
        <Input name="code" required />
      </Field>
      <Field label="Type">
        <select name="type" className="h-10 w-full border border-black/15 bg-transparent px-3">
          <option value="percent">Percentage</option>
          <option value="amount">Fixed amount</option>
        </select>
      </Field>
      <Field label="Value">
        <Input name="value" required type="number" min="1" />
      </Field>
      <Field label="Minimum order">
        <Input name="minimum" required type="number" min="0" />
      </Field>
      <Field label="Valid from">
        <Input name="from" required type="date" />
      </Field>
      <Field label="Valid to">
        <Input name="to" required type="date" />
      </Field>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}

function Returns({
  items,
  orders,
  update,
}: {
  items: ReturnCase[];
  orders: OrderRecord[];
  update: (v: ReturnCase[]) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [orderId, setOrderId] = useState(orders[0]?.id ?? "");
  const [productId, setProductId] = useState(orders[0]?.items[0]?.productId ?? "");
  const selectedOrder = orders.find((order) => order.id === orderId);
  const change = async (item: ReturnCase, status: ReturnCase["status"]) => {
    try {
      const result = await api<{ returnCase: ReturnCase }>(`/api/admin/returns/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      update(items.map((i) => (i.id === item.id ? result.returnCase : i)));
      toast.success(`${item.id} moved to ${status}.`);
    } catch (error) {
      toast.error(message(error));
    }
  };
  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const result = await api<{ returnCase: ReturnCase }>("/api/admin/returns", {
        method: "POST",
        body: JSON.stringify({
          orderId,
          productId: form.get("productId"),
          reason: form.get("reason"),
          amount: Number(form.get("amount")),
          condition: form.get("condition"),
          refundMethod: form.get("refundMethod"),
        }),
      });
      update([result.returnCase, ...items]);
      setCreating(false);
      toast.success(`${result.returnCase.id} opened.`);
    } catch (error) {
      toast.error(message(error));
    }
  };
  return (
    <section className="border border-black/10 bg-white/45">
      <div className="flex items-center justify-between border-b border-black/10 p-5">
        <div>
          <h2 className="font-display text-3xl font-light">Return cases</h2>
          <p className="mt-1 text-xs text-black/40">Created against verified order items</p>
        </div>
        <Button onClick={() => setCreating((value) => !value)} disabled={!orders.length}>
          <Plus className="mr-2 h-4 w-4" /> Open return
        </Button>
      </div>
      {creating ? (
        <form
          onSubmit={create}
          className="grid gap-4 border-b border-black/10 bg-[#f7f5ef] p-5 sm:grid-cols-2"
        >
          <Choice
            label="Order"
            value={orderId}
            onChange={(value) => {
              setOrderId(value);
              setProductId(orders.find((order) => order.id === value)?.items[0]?.productId ?? "");
            }}
            items={orders.map((order) => [order.id, `${order.orderNumber} · ${order.customer}`])}
          />
          <Choice
            label="Product"
            value={productId}
            onChange={setProductId}
            items={(selectedOrder?.items ?? []).map((item) => [item.productId, item.name])}
          />
          <input type="hidden" name="productId" value={productId} />
          <Field label="Refund amount">
            <Input
              name="amount"
              required
              type="number"
              min="0"
              defaultValue={selectedOrder?.items[0]?.price ?? 0}
            />
          </Field>
          <Field label="Condition">
            <select
              name="condition"
              className="h-10 w-full border border-black/15 bg-transparent px-3"
            >
              <option>Sealed</option>
              <option>Opened</option>
              <option>Courier damage</option>
            </select>
          </Field>
          <Field label="Refund method">
            <select
              name="refundMethod"
              className="h-10 w-full border border-black/15 bg-transparent px-3"
            >
              <option>Bank transfer</option>
              <option>Store credit</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Reason">
              <Textarea name="reason" required />
            </Field>
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button type="submit">Create case</Button>
          </div>
        </form>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.orderNumber}</TableCell>
              <TableCell>{item.customer}</TableCell>
              <TableCell>{item.product}</TableCell>
              <TableCell className="max-w-xs">{item.reason}</TableCell>
              <TableCell>{formatMoney(item.amount)}</TableCell>
              <TableCell>
                <Select
                  value={item.status}
                  onValueChange={(v) => change(item, v as ReturnCase["status"])}
                >
                  <SelectTrigger className="w-34">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["requested", "approved", "received", "refunded", "rejected"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {!items.length && (
            <TableRow>
              <TableCell colSpan={7}>
                <Empty text="No return cases have been opened." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}

function Enquiries({
  items,
  update,
}: {
  items: ContactRecord[];
  update: (value: ContactRecord[]) => void;
}) {
  const change = async (item: ContactRecord, status: ContactRecord["status"]) => {
    try {
      const result = await api<{ ok: true; status: ContactRecord["status"] }>(
        `/api/admin/contacts/${item.id}`,
        { method: "PATCH", body: JSON.stringify({ status }) },
      );
      update(
        items.map((current) =>
          current.id === item.id ? { ...current, status: result.status } : current,
        ),
      );
      toast.success(`${item.subject} marked ${result.status}.`);
    } catch (error) {
      toast.error(message(error));
    }
  };

  return (
    <section className="border border-black/10 bg-white/45">
      <PanelTitle
        title="Contact enquiries"
        note={`${items.length} messages from the public form`}
      />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Received</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subject and message</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="whitespace-nowrap">{date(item.createdAt)}</TableCell>
                <TableCell>
                  <p className="font-medium">{item.name}</p>
                  <a
                    className="mt-1 block text-xs text-black/50 underline"
                    href={`mailto:${item.email}`}
                  >
                    {item.email}
                  </a>
                  {item.phone ? (
                    <a
                      className="mt-1 block text-xs text-black/50 underline"
                      href={`tel:${item.phone}`}
                    >
                      {item.phone}
                    </a>
                  ) : null}
                </TableCell>
                <TableCell className="min-w-80 max-w-2xl">
                  <p className="font-medium">{item.subject}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-black/60">
                    {item.message}
                  </p>
                </TableCell>
                <TableCell>
                  <Select
                    value={item.status}
                    onValueChange={(value) => change(item, value as ContactRecord["status"])}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["new", "read", "resolved"] as const).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {!items.length ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Empty text="No contact enquiries have arrived." />
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function Settings({ value, update }: { value: SiteSettings; update: (v: SiteSettings) => void }) {
  const [draft, setDraft] = useState({
    ...value,
    heroMediaType: value.heroMediaType ?? (value.heroVideo ? "video" : "image"),
    heroSoundEnabled: value.heroSoundEnabled ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await api<{ settings: SiteSettings }>("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(draft),
      });
      setDraft(result.settings);
      update(result.settings);
      toast.success("Public brand settings updated.");
    } catch (error) {
      toast.error(message(error));
    } finally {
      setSaving(false);
    }
  };
  const field = (key: keyof SiteSettings, val: any) => setDraft({ ...draft, [key]: val });
  const homeField = (key: keyof SiteSettings["home"], val: string | boolean) =>
    setDraft({ ...draft, home: { ...draft.home, [key]: val } });
  const upload = async (
    key:
      "logo" | "heroImage" | "heroVideo" | "visitImage" | "galleryWideImage" | "galleryDetailImage",
    file: File,
  ) => {
    setUploading(key);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set(
        "alt",
        key === "logo"
          ? `${draft.brandName} logo`
          : `${draft.brandName} ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`,
      );
      const result = await api<{ media: MediaItem }>("/api/admin/media", {
        method: "POST",
        body: form,
      });
      setDraft((current) => ({
        ...current,
        [key]: result.media,
        ...(key === "heroImage"
          ? { heroMediaType: "image" as const }
          : key === "heroVideo"
            ? { heroMediaType: "video" as const }
            : {}),
      }));
      toast.success(
        key === "heroImage" || key === "heroVideo"
          ? "Hero media uploaded and selected. Save settings to publish it."
          : "Media uploaded. Save settings to publish it.",
      );
    } catch (error) {
      toast.error(message(error));
    } finally {
      setUploading(null);
    }
  };
  return (
    <form onSubmit={save} className="border border-black/10 bg-white/45 p-5 space-y-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand name">
          <Input value={draft.brandName} onChange={(e) => field("brandName", e.target.value)} />
        </Field>
        <Field label="Public email">
          <Input
            type="email"
            value={draft.email}
            onChange={(e) => field("email", e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <Input value={draft.phone} onChange={(e) => field("phone", e.target.value)} />
        </Field>
        <Field label="Hours">
          <Input value={draft.hours} onChange={(e) => field("hours", e.target.value)} />
        </Field>
        <Field label="City">
          <Input value={draft.city} onChange={(e) => field("city", e.target.value)} />
        </Field>
        <Field label="Region">
          <Input value={draft.region} onChange={(e) => field("region", e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address">
            <Input value={draft.address} onChange={(e) => field("address", e.target.value)} />
          </Field>
        </div>
        <Field label="Instagram URL">
          <Input
            value={draft.instagramUrl}
            onChange={(e) => field("instagramUrl", e.target.value)}
          />
        </Field>
        <Field label="Map URL">
          <Input value={draft.mapUrl} onChange={(e) => field("mapUrl", e.target.value)} />
        </Field>
      </div>
      <section className="border-t border-black/10 pt-6">
        <div>
          <h3 className="font-display text-3xl font-light">Homepage hero</h3>
          <p className="mt-1 text-xs text-black/45">
            Choose one live background. Both assets stay saved so you can switch instantly.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="border border-black/12 bg-white/45 p-4">
            <p className="text-sm font-medium">Live hero background</p>
            <div className="mt-4 flex items-center gap-3">
              <span className={draft.heroMediaType === "image" ? "font-semibold" : "text-black/45"}>
                Image
              </span>
              <Switch
                checked={draft.heroMediaType === "video"}
                onCheckedChange={(checked) => field("heroMediaType", checked ? "video" : "image")}
                aria-label="Show video instead of image in the homepage hero"
              />
              <span className={draft.heroMediaType === "video" ? "font-semibold" : "text-black/45"}>
                Video
              </span>
            </div>
          </div>
          <div className="border border-black/12 bg-white/45 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Video sound by default</p>
                <p className="mt-1 text-xs text-black/45">
                  Browsers may still require one tap before playing sound.
                </p>
              </div>
              <Switch
                checked={draft.heroSoundEnabled}
                disabled={draft.heroMediaType !== "video"}
                onCheckedChange={(checked) => field("heroSoundEnabled", checked)}
                aria-label="Start the homepage hero video with sound"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="border-t border-black/10 pt-6">
        <h3 className="font-display text-3xl font-light">Homepage imagery</h3>
        <p className="mt-1 text-xs text-black/45">
          Upload the visual used in each homepage position, then save to publish every change.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(
          [
            "logo",
            "heroImage",
            "heroVideo",
            "visitImage",
            "galleryWideImage",
            "galleryDetailImage",
          ] as const
        ).map((key) => {
          const media = draft[key];
          const labels = {
            logo: "Logo",
            heroImage: "Hero image",
            heroVideo: "Hero video",
            visitImage: "Visit section image",
            galleryWideImage: "Gallery banner image",
            galleryDetailImage: "Gallery detail image",
          } as const;
          const label = labels[key];
          const active =
            (key === "heroImage" && draft.heroMediaType === "image") ||
            (key === "heroVideo" && draft.heroMediaType === "video");
          return (
            <label
              key={key}
              className={`relative cursor-pointer border p-4 text-center ${active ? "border-[#aa8755] bg-[#aa8755]/8" : "border-black/12"}`}
            >
              {active ? (
                <span className="editorial-kicker bg-[#aa8755] text-[#171713] absolute top-2 left-2 z-10 px-2 py-1">
                  Live
                </span>
              ) : null}
              {media ? (
                media.type === "video" ? (
                  <video src={media.url} muted className="mx-auto h-28 w-full object-cover" />
                ) : (
                  <img src={media.url} alt="" className="mx-auto h-28 w-full object-cover" />
                )
              ) : (
                <UploadCloud className="mx-auto h-6 w-6 text-black/30" />
              )}
              <span className="editorial-kicker mt-3 block text-black/45">
                {uploading === key ? "Uploading…" : `Replace ${label}`}
              </span>
              <input
                type="file"
                className="sr-only"
                disabled={Boolean(uploading)}
                accept={
                  key === "heroVideo"
                    ? "video/mp4,video/webm,video/quicktime"
                    : "image/jpeg,image/png,image/webp,image/avif"
                }
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) upload(key, file);
                }}
              />
            </label>
          );
        })}
      </div>
      <div className="border-t border-black/10 pt-6 space-y-5">
        <div>
          <h3 className="font-display text-3xl font-light">Homepage editorial content</h3>
          <p className="mt-1 text-xs text-black/40">
            Copy shown across the house, visit, collection, gallery, and final call-to-action
            sections.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {(
            [
              ["showHouse", "House"],
              ["showVisit", "Visit"],
              ["showCollection", "Collection"],
              ["showGallery", "Gallery"],
              ["showCta", "Final CTA"],
            ] as Array<
              ["showHouse" | "showVisit" | "showCollection" | "showGallery" | "showCta", string]
            >
          ).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 border border-black/12 bg-white/45 p-3"
            >
              <span className="text-sm">{label}</span>
              <Switch
                checked={draft.home[key]}
                onCheckedChange={(checked) => homeField(key, checked)}
                aria-label={`Show ${label} section`}
              />
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["houseHeading", "House heading", "input"],
              ["houseBody", "House body", "textarea"],
              ["visitHeading", "Visit heading", "input"],
              ["visitBody", "Visit body", "textarea"],
              ["collectionHeading", "Collection heading", "input"],
              ["collectionBody", "Collection body", "textarea"],
              ["galleryQuote", "Gallery quote", "input"],
              ["galleryBody", "Gallery body", "textarea"],
              ["ctaHeading", "Final CTA heading", "input"],
              ["ctaBody", "Final CTA body", "textarea"],
            ] as Array<[HomeCopyKey, string, "input" | "textarea"]>
          ).map(([key, label, kind]) => (
            <Field key={key} label={label}>
              {kind === "textarea" ? (
                <Textarea
                  value={draft.home[key]}
                  onChange={(event) => homeField(key, event.target.value)}
                />
              ) : (
                <Input
                  value={draft.home[key]}
                  onChange={(event) => homeField(key, event.target.value)}
                />
              )}
            </Field>
          ))}
        </div>
      </div>
      <div className="border-t border-black/10 pt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Site title">
          <Input value={draft.siteTitle} onChange={(e) => field("siteTitle", e.target.value)} />
        </Field>
        <Field label="Meta description">
          <Input
            value={draft.siteDescription}
            onChange={(e) => field("siteDescription", e.target.value)}
          />
        </Field>
        <Field label="Hero eyebrow">
          <Input value={draft.heroEyebrow} onChange={(e) => field("heroEyebrow", e.target.value)} />
        </Field>
        <Field label="Hero title">
          <Input value={draft.heroTitle} onChange={(e) => field("heroTitle", e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Hero body">
            <Textarea value={draft.heroBody} onChange={(e) => field("heroBody", e.target.value)} />
          </Field>
        </div>
      </div>
      <div className="border-t border-black/10 pt-6 grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Delivery fee"
          value={draft.deliveryFee}
          onChange={(v) => field("deliveryFee", v)}
        />
        <NumberField
          label="Free delivery threshold"
          value={draft.freeDeliveryThreshold}
          onChange={(v) => field("freeDeliveryThreshold", v)}
        />
        <div className="sm:col-span-2">
          <Field label="Order confirmation message">
            <Textarea
              value={draft.orderConfirmationMessage}
              onChange={(e) => field("orderConfirmationMessage", e.target.value)}
            />
          </Field>
        </div>
      </div>
      <div className="flex justify-end">
        <Button disabled={saving || Boolean(uploading)} type="submit">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save public settings"}
        </Button>
      </div>
    </form>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <section className="border border-black/10 bg-white/45 p-5">
      <p className="editorial-kicker text-black/40">{label}</p>
      <p className="font-display mt-4 text-4xl">{value}</p>
    </section>
  );
}
function PanelTitle({ title, note }: { title: string; note: string }) {
  return (
    <div className="border-b border-black/10 p-5">
      <h2 className="font-display text-3xl font-light">{title}</h2>
      <p className="mt-1 text-xs text-black/40">{note}</p>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="p-10 text-center text-sm text-black/40">{text}</div>;
}
function Status({ value }: { value: string }) {
  return (
    <Badge variant="outline" className="rounded-none capitalize">
      {value}
    </Badge>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="editorial-kicker mb-2 block text-black/45">{label}</span>
      {children}
    </label>
  );
}
function Choice({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  items: string[][];
}) {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map(([v, l]) => (
            <SelectItem key={v} value={v!}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label}>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </Field>
  );
}
const date = (value: string) =>
  new Date(value).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
const dateTime = (value: string) =>
  new Date(value).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
const split = (value: string) =>
  value
    .split(/[,\n·]+/)
    .map((v) => v.trim())
    .filter(Boolean);
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const message = (error: unknown) =>
  error instanceof Error ? error.message : "The action could not be completed.";

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  ChartNoAxesCombined,
  Check,
  CircleDollarSign,
  Clock3,
  Copy,
  Ellipsis,
  Eye,
  Film,
  Grid2X2,
  ImagePlus,
  Image as ImageIcon,
  LayoutDashboard,
  List,
  LockKeyhole,
  LogOut,
  Menu,
  PackageCheck,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
  Truck,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  dashboardSeedOrders,
  dashboardSeedProducts,
  dashboardSeedPromos,
  formatMoney,
  getProductMedia,
  products,
  type OrderRecord,
  type ProductMediaItem,
  type ProductItem,
  type PromoCode,
} from "@/lib/catalog";

export const Route = createFileRoute("/secret/dashboard")({
  head: () => ({
    meta: [
      { title: "Operations dashboard | SSAROMA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SecretDashboard,
});

const AUTH_KEY = "ssaroma-dashboard-auth";
const DATA_KEY = "ssaroma-dashboard-demo-data-v2";
const LOGIN_EMAIL = "admin@ssaroma.com";
const LOGIN_PASSWORD = "ssaroma-admin";

type DashboardView =
  | "overview"
  | "orders"
  | "fulfillment"
  | "returns"
  | "finance"
  | "catalog"
  | "promotions";
type CatalogView = "table" | "grid";
type OrderStatus = OrderRecord["status"];
type ReturnStatus = "requested" | "approved" | "received" | "refunded" | "rejected";

type ReturnCase = {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  reason: string;
  requestedAt: string;
  amount: number;
  status: ReturnStatus;
  condition: "Sealed" | "Opened" | "Courier damage";
  refundMethod: "Bank transfer" | "Store credit";
};

type ProductDraft = {
  id: string | null;
  name: string;
  slug: string;
  family: string;
  gender: ProductItem["gender"];
  collection: ProductItem["collection"];
  concentration: ProductItem["concentration"];
  sizeMl: string;
  price: string;
  rating: string;
  reviewCount: string;
  mood: string;
  story: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  outOfStock: boolean;
  media: ProductMediaItem[];
};

type PromoDraft = {
  code: string;
  discountType: PromoCode["discountType"];
  discountValue: string;
  minOrder: string;
  validFrom: string;
  validTo: string;
};

type SavedDashboardData = {
  products: ProductItem[];
  orders: OrderRecord[];
  promos: PromoCode[];
  returnCases?: ReturnCase[];
  dismissedFulfillmentIds?: string[];
};

const extraOrders: OrderRecord[] = [
  {
    id: "ORD-24036",
    customer: "Omar Yousaf",
    city: "Rawalpindi",
    items: 1,
    total: 25200,
    placedAt: "2026-08-22T10:18:00.000Z",
    status: "processing",
  },
  {
    id: "ORD-24037",
    customer: "Rida Aslam",
    city: "Lahore",
    items: 2,
    total: 43900,
    placedAt: "2026-08-23T16:42:00.000Z",
    status: "delivered",
  },
  {
    id: "ORD-24038",
    customer: "Sarmad Ali",
    city: "Peshawar",
    items: 1,
    total: 22900,
    placedAt: "2026-08-24T08:32:00.000Z",
    status: "shipped",
  },
  {
    id: "ORD-24039",
    customer: "Imaan Tariq",
    city: "Islamabad",
    items: 2,
    total: 40600,
    placedAt: "2026-08-25T12:05:00.000Z",
    status: "pending",
  },
  {
    id: "ORD-24040",
    customer: "Faraz Ahmed",
    city: "Karachi",
    items: 1,
    total: 18900,
    placedAt: "2026-08-26T15:27:00.000Z",
    status: "delivered",
  },
  {
    id: "ORD-24041",
    customer: "Zara Faisal",
    city: "Peshawar",
    items: 3,
    total: 62700,
    placedAt: "2026-08-27T09:14:00.000Z",
    status: "processing",
  },
  {
    id: "ORD-24042",
    customer: "Noman Shah",
    city: "Abbottabad",
    items: 1,
    total: 19600,
    placedAt: "2026-08-28T07:46:00.000Z",
    status: "pending",
  },
];

const allSeedOrders = [...dashboardSeedOrders, ...extraOrders].sort(
  (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
);

const seedReturnCases: ReturnCase[] = [
  {
    id: "RET-1024",
    orderId: "ORD-24018",
    customer: "Areeba Malik",
    product: "Santal Reserve",
    reason: "Courier packaging damaged",
    requestedAt: "2026-08-16T11:24:00.000Z",
    amount: 18900,
    status: "refunded",
    condition: "Courier damage",
    refundMethod: "Bank transfer",
  },
  {
    id: "RET-1025",
    orderId: "ORD-24023",
    customer: "Mariam Shah",
    product: "Velvet Amber",
    reason: "Changed mind before opening",
    requestedAt: "2026-08-20T14:10:00.000Z",
    amount: 21400,
    status: "refunded",
    condition: "Sealed",
    refundMethod: "Bank transfer",
  },
  {
    id: "RET-1026",
    orderId: "ORD-24029",
    customer: "Hamza Rauf",
    product: "Citrus Memoir",
    reason: "Incorrect fragrance received",
    requestedAt: "2026-08-23T09:42:00.000Z",
    amount: 17500,
    status: "refunded",
    condition: "Sealed",
    refundMethod: "Bank transfer",
  },
  {
    id: "RET-1027",
    orderId: "ORD-24034",
    customer: "Sana Tariq",
    product: "Noir Oud",
    reason: "Requested sealed return",
    requestedAt: "2026-08-27T12:05:00.000Z",
    amount: 23800,
    status: "requested",
    condition: "Sealed",
    refundMethod: "Bank transfer",
  },
  {
    id: "RET-1028",
    orderId: "ORD-24038",
    customer: "Sarmad Ali",
    product: "Santal Reserve",
    reason: "Duplicate order placed",
    requestedAt: "2026-08-27T16:18:00.000Z",
    amount: 19600,
    status: "approved",
    condition: "Sealed",
    refundMethod: "Store credit",
  },
  {
    id: "RET-1029",
    orderId: "ORD-24037",
    customer: "Rida Aslam",
    product: "Iris Suede",
    reason: "Presentation box damaged",
    requestedAt: "2026-08-28T08:32:00.000Z",
    amount: 25200,
    status: "received",
    condition: "Courier damage",
    refundMethod: "Bank transfer",
  },
  {
    id: "RET-1030",
    orderId: "ORD-24040",
    customer: "Faraz Ahmed",
    product: "Citrus Memoir",
    reason: "Fragrance opened and tested",
    requestedAt: "2026-08-28T10:46:00.000Z",
    amount: 16800,
    status: "rejected",
    condition: "Opened",
    refundMethod: "Store credit",
  },
];

const salesData = [
  { day: "22 Aug", revenue: 32600, orders: 2 },
  { day: "23 Aug", revenue: 49400, orders: 3 },
  { day: "24 Aug", revenue: 38900, orders: 2 },
  { day: "25 Aug", revenue: 45700, orders: 3 },
  { day: "26 Aug", revenue: 57400, orders: 3 },
  { day: "27 Aug", revenue: 62600, orders: 4 },
  { day: "28 Aug", revenue: 41400, orders: 2 },
];

const monthlyRevenueData = [
  { month: "Mar", revenue: 920000, orders: 43 },
  { month: "Apr", revenue: 1045000, orders: 49 },
  { month: "May", revenue: 1138000, orders: 52 },
  { month: "Jun", revenue: 1264000, orders: 58 },
  { month: "Jul", revenue: 1372000, orders: 63 },
  { month: "Aug", revenue: 1486500, orders: 68 },
];

const citySalesData = [
  { city: "Peshawar", revenue: 462000 },
  { city: "Islamabad", revenue: 338500 },
  { city: "Lahore", revenue: 294000 },
  { city: "Karachi", revenue: 241000 },
  { city: "Other", revenue: 151000 },
];

const financeDailyData = [
  { date: "2026-08-01", revenue: 43200, orders: 2 },
  { date: "2026-08-02", revenue: 38600, orders: 2 },
  { date: "2026-08-03", revenue: 58100, orders: 3 },
  { date: "2026-08-04", revenue: 42100, orders: 1 },
  { date: "2026-08-05", revenue: 64700, orders: 3 },
  { date: "2026-08-06", revenue: 29700, orders: 1 },
  { date: "2026-08-07", revenue: 46200, orders: 2 },
  { date: "2026-08-08", revenue: 61100, orders: 3 },
  { date: "2026-08-09", revenue: 40500, orders: 2 },
  { date: "2026-08-10", revenue: 47300, orders: 2 },
  { date: "2026-08-11", revenue: 59200, orders: 3 },
  { date: "2026-08-12", revenue: 44900, orders: 2 },
  { date: "2026-08-13", revenue: 63600, orders: 3 },
  { date: "2026-08-14", revenue: 48700, orders: 2 },
  { date: "2026-08-15", revenue: 42900, orders: 2 },
  { date: "2026-08-16", revenue: 61800, orders: 3 },
  { date: "2026-08-17", revenue: 45500, orders: 2 },
  { date: "2026-08-18", revenue: 66800, orders: 3 },
  { date: "2026-08-19", revenue: 40100, orders: 2 },
  { date: "2026-08-20", revenue: 51900, orders: 2 },
  { date: "2026-08-21", revenue: 58600, orders: 3 },
  { date: "2026-08-22", revenue: 49400, orders: 3 },
  { date: "2026-08-23", revenue: 48900, orders: 2 },
  { date: "2026-08-24", revenue: 55700, orders: 3 },
  { date: "2026-08-25", revenue: 67400, orders: 3 },
  { date: "2026-08-26", revenue: 72600, orders: 3 },
  { date: "2026-08-27", revenue: 81400, orders: 4 },
  { date: "2026-08-28", revenue: 55600, orders: 2 },
].map((entry, index) => {
  const costOfGoods = Math.round(entry.revenue * (0.31 + (index % 3) * 0.012));
  const deliveryCost = entry.orders * 340;
  const refunds = index === 8 ? 16800 : index === 19 ? 21400 : index === 25 ? 19600 : 0;
  return {
    ...entry,
    costOfGoods,
    deliveryCost,
    refunds,
    profit: entry.revenue - costOfGoods - deliveryCost - refunds,
  };
});

const emptyProductDraft: ProductDraft = {
  id: null,
  name: "",
  slug: "",
  family: "",
  gender: "male",
  collection: "Signature",
  concentration: "EDP",
  sizeMl: "",
  price: "",
  rating: "5.0",
  reviewCount: "0",
  mood: "",
  story: "",
  topNotes: "",
  heartNotes: "",
  baseNotes: "",
  outOfStock: false,
  media: [],
};

const emptyPromoDraft: PromoDraft = {
  code: "",
  discountType: "percent",
  discountValue: "",
  minOrder: "",
  validFrom: "2026-08-28",
  validTo: "2026-09-30",
};

const navItems: { value: DashboardView; label: string; icon: typeof LayoutDashboard }[] = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "orders", label: "Orders", icon: ShoppingBag },
  { value: "fulfillment", label: "Fulfillment", icon: Truck },
  { value: "returns", label: "Returns & refunds", icon: RotateCcw },
  { value: "finance", label: "Finance", icon: CircleDollarSign },
  { value: "catalog", label: "Catalog", icon: Box },
  { value: "promotions", label: "Promotions", icon: Tag },
];

const statusOrder: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

function SecretDashboard() {
  const [productRows, setProductRows] = useState<ProductItem[]>(products);
  const [orders, setOrders] = useState<OrderRecord[]>(allSeedOrders);
  const [promos, setPromos] = useState<PromoCode[]>(dashboardSeedPromos);
  const [returnCases, setReturnCases] = useState<ReturnCase[]>(seedReturnCases);
  const [dismissedFulfillmentIds, setDismissedFulfillmentIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [view, setView] = useState<DashboardView>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [productEditorOpen, setProductEditorOpen] = useState(false);
  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProductDraft);
  const [promoEditorOpen, setPromoEditorOpen] = useState(false);
  const [promoDraft, setPromoDraft] = useState<PromoDraft>(emptyPromoDraft);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(window.sessionStorage.getItem(AUTH_KEY) === "granted");
    const saved = window.localStorage.getItem(DATA_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedDashboardData;
        if (Array.isArray(parsed.products)) setProductRows(parsed.products);
        if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
        if (Array.isArray(parsed.promos)) setPromos(parsed.promos);
        if (Array.isArray(parsed.returnCases)) setReturnCases(parsed.returnCases);
        if (Array.isArray(parsed.dismissedFulfillmentIds)) {
          setDismissedFulfillmentIds(parsed.dismissedFulfillmentIds);
        }
      } catch {
        window.localStorage.removeItem(DATA_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(
      DATA_KEY,
      JSON.stringify({
        products: productRows,
        orders,
        promos,
        returnCases,
        dismissedFulfillmentIds,
      }),
    );
  }, [dismissedFulfillmentIds, orders, productRows, promos, ready, returnCases]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const metrics = useMemo(() => {
    const dispatchQueue = orders.filter((order) => order.status === "processing").length;
    return {
      revenue: 1486500,
      orderCount: 68,
      averageOrder: 21860,
      delivered: 59,
      dispatchQueue,
      customers: 61,
      conversionRate: 3.8,
      returningRate: 41,
    };
  }, [orders]);

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    if (email.trim().toLowerCase() === LOGIN_EMAIL && password === LOGIN_PASSWORD) {
      window.sessionStorage.setItem(AUTH_KEY, "granted");
      setIsAuthenticated(true);
      setAuthError("");
      return;
    }
    setAuthError("Those credentials do not match the demo account.");
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setPassword("");
    setEmail("");
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
    if (status !== "delivered") {
      setDismissedFulfillmentIds((current) => current.filter((orderId) => orderId !== id));
    }
    setSelectedOrder((current) => (current?.id === id ? { ...current, status } : current));
    setNotice(`${id} moved to ${statusLabel(status).toLowerCase()}.`);
  };

  const dismissFulfillmentOrder = (id: string) => {
    setDismissedFulfillmentIds((current) => (current.includes(id) ? current : [...current, id]));
    setNotice(`${id} was cleared from Fulfillment and remains available in Orders and Finance.`);
  };

  const updateReturnStatus = (id: string, status: ReturnStatus) => {
    setReturnCases((current) =>
      current.map((returnCase) =>
        returnCase.id === id ? { ...returnCase, status } : returnCase,
      ),
    );
    setNotice(
      status === "refunded"
        ? `${id} was refunded and recorded in Finance.`
        : `${id} moved to ${returnStatusLabel(status).toLowerCase()}.`,
    );
  };

  const openNewProduct = () => {
    setProductDraft({ ...emptyProductDraft, media: [] });
    setProductEditorOpen(true);
  };

  const editProduct = (product: ProductItem) => {
    setProductDraft({
      id: product.id,
      name: product.name,
      slug: product.slug,
      family: product.family,
      gender: product.gender,
      collection: product.collection,
      concentration: product.concentration,
      sizeMl: String(product.sizeMl),
      price: String(product.price),
      rating: String(product.rating),
      reviewCount: String(product.reviewCount),
      mood: product.mood,
      story: product.story,
      topNotes: product.notes.top.join(", "),
      heartNotes: product.notes.heart.join(", "),
      baseNotes: product.notes.base.join(", "),
      outOfStock: product.outOfStock,
      media: getProductMedia(product),
    });
    setProductEditorOpen(true);
  };

  const saveProduct = () => {
    const price = Number(productDraft.price);
    const sizeMl = Number(productDraft.sizeMl);
    const rating = Number(productDraft.rating);
    const reviewCount = Math.floor(Number(productDraft.reviewCount));
    const notes = {
      top: parseNoteList(productDraft.topNotes),
      heart: parseNoteList(productDraft.heartNotes),
      base: parseNoteList(productDraft.baseNotes),
    };
    if (
      !productDraft.name.trim() ||
      !productDraft.slug.trim() ||
      !productDraft.family.trim() ||
      !productDraft.mood.trim() ||
      !productDraft.story.trim() ||
      notes.top.length === 0 ||
      notes.heart.length === 0 ||
      notes.base.length === 0 ||
      price <= 0 ||
      sizeMl <= 0 ||
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5 ||
      !Number.isFinite(reviewCount) ||
      reviewCount < 0
    ) {
      setNotice("Complete the required product details before saving.");
      return;
    }

    const fallback = dashboardSeedProducts[0];
    if (!fallback) return;
    const media = productDraft.media.filter((item) => item.src);
    const normalizedMedia = media.length > 0 ? media : getProductMedia(fallback);
    const imageSources = normalizedMedia
      .filter((item) => item.type === "image")
      .map((item) => item.src);
    const images = imageSources.length > 0 ? imageSources : fallback.images;

    if (productDraft.id) {
      setProductRows((current) =>
        current.map((product) =>
          product.id === productDraft.id
            ? {
                ...product,
                name: productDraft.name.trim(),
                slug: productDraft.slug.trim(),
                family: productDraft.family.trim(),
                gender: productDraft.gender,
                collection: productDraft.collection,
                concentration: productDraft.concentration,
                sizeMl,
                price,
                rating,
                reviewCount,
                mood: productDraft.mood.trim(),
                story: productDraft.story.trim(),
                notes,
                compareAt: Math.max(product.compareAt, Math.round(price * 1.12)),
                outOfStock: productDraft.outOfStock,
                images,
                media: normalizedMedia,
              }
            : product,
        ),
      );
      setNotice(`${productDraft.name} was updated.`);
    } else {
      const next: ProductItem = {
        ...fallback,
        id: `prd-${Date.now()}`,
        name: productDraft.name.trim(),
        slug: productDraft.slug.trim(),
        family: productDraft.family.trim(),
        gender: productDraft.gender,
        collection: productDraft.collection,
        concentration: productDraft.concentration,
        sizeMl,
        price,
        rating,
        reviewCount,
        mood: productDraft.mood.trim(),
        story: productDraft.story.trim(),
        notes,
        compareAt: Math.round(price * 1.12),
        outOfStock: productDraft.outOfStock,
        images,
        media: normalizedMedia,
        featured: false,
      };
      setProductRows((current) => [next, ...current]);
      setNotice(`${productDraft.name} was added to the catalog.`);
    }
    setProductEditorOpen(false);
  };

  const deleteProduct = (product: ProductItem) => {
    setProductRows((current) => current.filter((entry) => entry.id !== product.id));
    setNotice(`${product.name} was removed from the catalog.`);
  };

  const savePromo = () => {
    const discountValue = Number(promoDraft.discountValue);
    const minOrder = Number(promoDraft.minOrder);
    if (
      !promoDraft.code.trim() ||
      discountValue <= 0 ||
      minOrder < 0 ||
      !promoDraft.validFrom ||
      !promoDraft.validTo
    ) {
      setNotice("Complete the promotion details before saving.");
      return;
    }
    const promo: PromoCode = {
      id: `PRM-${Date.now()}`,
      code: promoDraft.code.trim().toUpperCase(),
      discountType: promoDraft.discountType,
      discountValue,
      minOrder,
      validFrom: promoDraft.validFrom,
      validTo: promoDraft.validTo,
      active: true,
    };
    setPromos((current) => [promo, ...current]);
    setPromoEditorOpen(false);
    setPromoDraft(emptyPromoDraft);
    setNotice(`${promo.code} is now active.`);
  };

  const resetDemo = () => {
    setProductRows(products);
    setOrders(allSeedOrders);
    setPromos(dashboardSeedPromos);
    setReturnCases(seedReturnCases);
    setDismissedFulfillmentIds([]);
    window.localStorage.removeItem(DATA_KEY);
    setNotice("Demo data was restored.");
  };

  if (!ready) {
    return (
      <div className="bg-[#f1efe9] flex min-h-screen items-center justify-center">
        <p className="editorial-kicker text-ink/48">Preparing workspace</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <DashboardLogin
        email={email}
        password={password}
        authError={authError}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  const pageTitle: Record<DashboardView, [string, string]> = {
    overview: ["Good evening, Kadir.", "Here is what is happening across SSAROMA today."],
    orders: ["Orders", "Review, filter and manage every client order."],
    fulfillment: ["Fulfillment", "Move orders from confirmation through delivery."],
    returns: ["Returns & refunds", "Review return requests and control every refund stage."],
    finance: ["Finance", "Track revenue, COD collection, costs and order performance."],
    catalog: ["Catalog", "Manage fragrances, availability and product media."],
    promotions: ["Promotions", "Control offers, eligibility and campaign windows."],
  };

  return (
    <div className="admin-dashboard bg-[#f1efe9] text-[#171713] min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {notice ? <DashboardNotice message={notice} onClose={() => setNotice(null)} /> : null}
      <aside className="bg-[#171713] text-[#f3efe5] sticky top-0 hidden h-screen flex-col border-r border-white/8 lg:flex">
        <DashboardBrand />
        <DashboardNav
          value={view}
          onChange={setView}
          fulfillmentCount={
            orders.filter((order) => order.status !== "delivered" && order.status !== "cancelled")
              .length
          }
          returnsCount={
            returnCases.filter(
              (returnCase) =>
                returnCase.status !== "refunded" && returnCase.status !== "rejected",
            ).length
          }
        />
        <div className="mt-auto border-t border-white/10 p-4">
          <button
            type="button"
            onClick={resetDemo}
            className="focus-ring flex w-full items-center gap-3 px-3 py-3 text-left text-xs text-white/50 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" /> Restore demo data
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="focus-ring flex w-full items-center gap-3 px-3 py-3 text-left text-xs text-white/50 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <div className="mt-3 flex items-center gap-3 px-3 py-3">
            <span className="bg-[#aa8755] text-[#171713] flex h-8 w-8 items-center justify-center text-xs font-semibold">
              KK
            </span>
            <div>
              <p className="text-xs font-medium">Kadir Khan</p>
              <p className="mt-0.5 text-[0.62rem] text-white/38">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-black/10 bg-[#f1efe9] sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="focus-ring lg:hidden"
                  aria-label="Open dashboard navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#171713] text-[#f3efe5] border-white/10 w-[86%] p-0"
              >
                <DashboardBrand />
                <DashboardNav
                  value={view}
                  fulfillmentCount={
                    orders.filter(
                      (order) => order.status !== "delivered" && order.status !== "cancelled",
                    ).length
                  }
                  returnsCount={
                    returnCases.filter(
                      (returnCase) =>
                        returnCase.status !== "refunded" && returnCase.status !== "rejected",
                    ).length
                  }
                  onChange={(next) => {
                    setView(next);
                    setMobileNavOpen(false);
                  }}
                />
                <div className="absolute right-4 bottom-5 left-4 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 text-xs text-white/55"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </SheetContent>
            </Sheet>
            <div className="lg:hidden">
              <span className="wordmark text-xs">SSAROMA</span>
              <span className="text-black/32 ml-2 text-[0.6rem] tracking-widest uppercase">
                Admin
              </span>
            </div>
            <div className="hidden items-center gap-2 text-xs text-black/45 sm:flex">
              <span>SSAROMA</span>
              <span>/</span>
              <span className="text-black capitalize">{view}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/products"
              className="border-black/12 hover:bg-black hover:text-white hidden h-9 items-center gap-2 border px-3 text-xs transition-colors sm:flex"
            >
              <Store className="h-3.5 w-3.5" /> View store
            </Link>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="font-display text-[2.55rem] leading-none font-light tracking-[-0.025em] sm:text-[3rem]">
                {pageTitle[view][0]}
              </h1>
              <p className="mt-3 text-sm text-black/48">{pageTitle[view][1]}</p>
            </div>
            {view === "overview" ? (
              <Select defaultValue="30-days">
                <SelectTrigger className="border-black/15 h-9 w-40 bg-transparent text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7-days">Last 7 days</SelectItem>
                  <SelectItem value="30-days">Last 30 days</SelectItem>
                  <SelectItem value="quarter">This quarter</SelectItem>
                </SelectContent>
              </Select>
            ) : null}
          </div>

          {view === "overview" ? (
            <Overview
              metrics={metrics}
              orders={orders}
              products={productRows}
              openOrder={setSelectedOrder}
            />
          ) : null}
          {view === "orders" ? (
            <OrdersView
              orders={orders}
              updateStatus={updateOrderStatus}
              openOrder={setSelectedOrder}
            />
          ) : null}
          {view === "fulfillment" ? (
            <FulfillmentView
              orders={orders}
              dismissedIds={dismissedFulfillmentIds}
              updateStatus={updateOrderStatus}
              dismissDelivered={dismissFulfillmentOrder}
              openOrder={setSelectedOrder}
            />
          ) : null}
          {view === "returns" ? (
            <ReturnsView
              returnCases={returnCases}
              updateStatus={updateReturnStatus}
              notify={setNotice}
            />
          ) : null}
          {view === "finance" ? <FinanceView orders={orders} /> : null}
          {view === "catalog" ? (
            <CatalogViewPanel
              products={productRows}
              editProduct={editProduct}
              deleteProduct={deleteProduct}
              openNew={openNewProduct}
            />
          ) : null}
          {view === "promotions" ? (
            <PromotionsView
              promos={promos}
              setPromos={setPromos}
              openNew={() => setPromoEditorOpen(true)}
              notify={setNotice}
            />
          ) : null}
        </main>
      </div>

      <OrderDetail
        order={selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
        updateStatus={updateOrderStatus}
        notify={setNotice}
      />
      <ProductEditor
        open={productEditorOpen}
        onOpenChange={setProductEditorOpen}
        draft={productDraft}
        setDraft={setProductDraft}
        save={saveProduct}
      />
      <PromoEditor
        open={promoEditorOpen}
        onOpenChange={setPromoEditorOpen}
        draft={promoDraft}
        setDraft={setPromoDraft}
        save={savePromo}
      />
    </div>
  );
}

function DashboardLogin({
  email,
  password,
  authError,
  setEmail,
  setPassword,
  onSubmit,
}: {
  email: string;
  password: string;
  authError: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <div className="bg-[#efede6] min-h-screen md:grid md:grid-cols-[0.95fr_1.05fr]">
      <div className="bg-[#171713] text-[#f3efe5] relative hidden min-h-screen overflow-hidden px-12 py-12 md:flex md:flex-col lg:px-20">
        <p className="wordmark text-sm">SSAROMA</p>
        <div className="my-auto max-w-lg">
          <p className="editorial-kicker text-[#b4915e]">Operations workspace</p>
          <h1 className="font-display mt-7 text-[4.6rem] leading-[0.88] font-light tracking-[-0.035em] lg:text-[5.5rem]">
            The house, in good order.
          </h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-white/48">
            Sales, clients, fulfillment and the fragrance catalog—managed from one considered
            workspace.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[0.62rem] tracking-[0.14em] text-white/34 uppercase">
          <LockKeyhole className="h-3.5 w-3.5" /> Private administration
        </div>
        <div className="border-[#aa8755]/35 absolute top-24 right-[-14rem] h-[34rem] w-[34rem] rounded-full border" />
        <div className="border-white/8 absolute top-39 right-[-9rem] h-[24rem] w-[24rem] rounded-full border" />
      </div>
      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <div className="mb-14 flex items-center justify-between md:hidden">
            <span className="wordmark text-sm">SSAROMA</span>
            <Link to="/" className="text-xs text-black/45">
              Return to house
            </Link>
          </div>
          <p className="editorial-kicker text-[#8b6b3e]">Administrator access</p>
          <h2 className="font-display mt-5 text-5xl font-light">Welcome back.</h2>
          <p className="mt-4 text-sm leading-7 text-black/48">
            Sign in to manage the SSAROMA storefront and order desk.
          </p>
          <div className="mt-9 space-y-5">
            <label className="block">
              <span className="editorial-kicker text-black/48">Email address</span>
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@ssaroma.com"
                className="border-black/18 mt-2 h-12 bg-white/35"
              />
            </label>
            <label className="block">
              <div className="flex items-center justify-between">
                <span className="editorial-kicker text-black/48">Password</span>
                <button type="button" className="text-[0.65rem] text-black/42">
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="border-black/18 mt-2 h-12 bg-white/35"
              />
            </label>
          </div>
          {authError ? <p className="mt-4 text-sm text-[#9a3d2e]">{authError}</p> : null}
          <Button
            type="submit"
            className="bg-[#171713] text-[#f3efe5] hover:bg-[#aa8755] hover:text-[#171713] mt-6 h-12 w-full"
          >
            Sign in securely
          </Button>
          <button
            type="button"
            onClick={() => {
              setEmail(LOGIN_EMAIL);
              setPassword(LOGIN_PASSWORD);
            }}
            className="border-black/12 mt-5 flex w-full items-center justify-between border px-4 py-3 text-left text-xs"
          >
            <span>
              <span className="block font-medium">Use demo account</span>
              <span className="mt-1 block text-black/42">{LOGIN_EMAIL}</span>
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardBrand() {
  return (
    <div className="border-white/10 border-b px-6 py-6">
      <p className="wordmark text-sm">SSAROMA</p>
      <p className="mt-2 text-[0.58rem] tracking-[0.17em] text-white/34 uppercase">
        Operations console
      </p>
    </div>
  );
}

function DashboardNotice({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      role="status"
      className="border-black/15 bg-[#f7f5ef] fixed top-5 right-5 z-[80] flex max-w-sm items-start gap-3 border px-4 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.14)]"
    >
      <span className="bg-[#47705a] mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
        <Check className="h-3 w-3" />
      </span>
      <p className="pr-3 text-sm leading-5">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="text-black/40 hover:text-black"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function DashboardNav({
  value,
  onChange,
  fulfillmentCount,
}: {
  value: DashboardView;
  onChange: (value: DashboardView) => void;
  fulfillmentCount: number;
}) {
  return (
    <nav className="space-y-1 px-3 py-6" aria-label="Dashboard navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`focus-ring relative flex w-full items-center gap-3 px-3 py-3 text-left text-xs transition-colors ${active ? "bg-white/8 text-white" : "text-white/45 hover:bg-white/4 hover:text-white/75"}`}
          >
            {active ? <span className="bg-[#aa8755] absolute top-2 bottom-2 left-0 w-0.5" /> : null}
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            {item.value === "fulfillment" ? (
              <span className="ml-auto bg-white/8 px-1.5 py-0.5 text-[0.58rem]">
                {fulfillmentCount}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

type Metrics = {
  revenue: number;
  orderCount: number;
  averageOrder: number;
  delivered: number;
  dispatchQueue: number;
  customers: number;
  conversionRate: number;
  returningRate: number;
};

function BusinessPulse({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border-black/10 border-b p-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
      <p className="text-xs text-black/45">{label}</p>
      <p className="mt-3 text-2xl font-medium tabular-nums">{value}</p>
      <p className="mt-1 text-[0.65rem] text-black/38">{note}</p>
    </div>
  );
}

function Overview({
  metrics,
  orders,
  products: catalog,
  openOrder,
}: {
  metrics: Metrics;
  orders: OrderRecord[];
  products: ProductItem[];
  openOrder: (order: OrderRecord) => void;
}) {
  const inventory = catalog
    .map((product, index) => ({
      product,
      stock: product.outOfStock ? 0 : ([18, 7, 24, 5, 31, 9, 14, 4, 21][index % 9] ?? 12),
    }))
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="grid border border-black/10 bg-[#f7f5ef] sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Monthly revenue"
          value={formatMoney(metrics.revenue)}
          trend="12.8%"
          positive
          icon={CircleDollarSign}
        />
        <Metric
          label="Orders"
          value={String(metrics.orderCount)}
          trend="8.4%"
          positive
          icon={ShoppingBag}
        />
        <Metric
          label="Average order"
          value={formatMoney(metrics.averageOrder)}
          trend="2.1%"
          positive
          icon={ChartNoAxesCombined}
        />
        <Metric
          label="Delivered"
          value={String(metrics.delivered)}
          trend="10.4%"
          positive
          icon={PackageCheck}
        />
      </div>

      <div className="grid border border-black/10 bg-[#f7f5ef] sm:grid-cols-3">
        <BusinessPulse
          label="Store conversion"
          value={`${metrics.conversionRate}%`}
          note="from product view to order"
        />
        <BusinessPulse
          label="Returning clients"
          value={`${metrics.returningRate}%`}
          note="of this month’s buyers"
        />
        <BusinessPulse label="COD collection" value="97.6%" note="successful delivery payment" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">
        <section className="border border-black/10 bg-[#f7f5ef] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Sales performance</p>
              <p className="mt-1 text-xs text-black/42">Revenue and order volume · last 7 days</p>
            </div>
            <div className="flex items-center gap-5 text-[0.62rem] text-black/48">
              <span className="flex items-center gap-2">
                <i className="h-0.5 w-4 bg-[#1b1b17]" /> Revenue
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 bg-[#aa8755]" /> Orders
              </span>
            </div>
          </div>
          <div className="mt-7 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ left: -12, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="#17171318" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#17171377", fontSize: 10 }}
                  dy={8}
                />
                <YAxis
                  yAxisId="revenue"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#17171366", fontSize: 10 }}
                  tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                />
                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#17171355", fontSize: 10 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 0,
                    border: "1px solid #17171322",
                    background: "#f7f5ef",
                    fontSize: 11,
                  }}
                  formatter={(value: number, name: string) =>
                    name === "revenue" ? [formatMoney(value), "Revenue"] : [value, "Orders"]
                  }
                />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1b1b17"
                  strokeWidth={2}
                  dot={{ fill: "#1b1b17", r: 3 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke="#aa8755"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="border border-black/10 bg-[#f7f5ef] p-5 sm:p-6">
          <div>
            <p className="text-sm font-medium">Fulfillment pulse</p>
            <p className="mt-1 text-xs text-black/42">Current order distribution</p>
          </div>
          <div className="mt-7 space-y-5">
            {statusOrder.map((status) => {
              const count = orders.filter((order) => order.status === status).length;
              const percent = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <StatusDot status={status} /> {statusLabel(status)}
                    </span>
                    <span className="font-medium tabular-nums">{count}</span>
                  </div>
                  <div className="h-1.5 bg-black/7">
                    <div className="h-full bg-[#aa8755]" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 grid grid-cols-2 border-t border-black/10 pt-5">
            <div>
              <p className="text-[0.62rem] tracking-wider text-black/42 uppercase">Preparing</p>
              <p className="mt-2 text-2xl font-medium tabular-nums">{metrics.dispatchQueue}</p>
            </div>
            <div className="border-l border-black/10 pl-5">
              <p className="text-[0.62rem] tracking-wider text-black/42 uppercase">Clients</p>
              <p className="mt-2 text-2xl font-medium tabular-nums">{metrics.customers}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="border border-black/10 bg-[#f7f5ef] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Six-month growth</p>
              <p className="mt-1 text-xs text-black/42">
                Revenue has crossed PKR 14 lakh this month
              </p>
            </div>
            <p className="text-sm font-medium text-[#47705a]">+61.6% since March</p>
          </div>
          <div className="mt-7 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ left: -4, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} stroke="#17171318" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#17171377", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#17171366", fontSize: 10 }}
                  tickFormatter={(value: number) => `${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 0,
                    border: "1px solid #17171322",
                    background: "#f7f5ef",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [formatMoney(value), "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#aa8755" radius={0} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="border border-black/10 bg-[#f7f5ef] p-5 sm:p-6">
          <div>
            <p className="text-sm font-medium">Revenue by city</p>
            <p className="mt-1 text-xs text-black/42">August demand across Pakistan</p>
          </div>
          <div className="mt-7 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={citySalesData} layout="vertical" margin={{ left: 6, right: 16 }}>
                <CartesianGrid horizontal={false} stroke="#17171314" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="city"
                  axisLine={false}
                  tickLine={false}
                  width={72}
                  tick={{ fill: "#17171399", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 0,
                    border: "1px solid #17171322",
                    background: "#f7f5ef",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [formatMoney(value), "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#1b1b17" radius={0} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="overflow-hidden border border-black/10 bg-[#f7f5ef]">
        <SectionHeader
          title="Product performance"
          subtitle="Storefront rating, reviews and August sales use the same catalog records"
        />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-black/8">
                <TableHead>Fragrance</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Units sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalog.slice(0, 5).map((product, index) => {
                const units = [18, 15, 13, 11, 9][index] ?? 7;
                return (
                  <TableRow key={product.id} className="border-black/8">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="h-11 w-9 object-cover" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="mt-1 text-[0.62rem] text-black/40">
                            {product.collection} · {product.concentration}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.rating.toFixed(1)} / 5</TableCell>
                    <TableCell>{product.reviewCount.toLocaleString("en-PK")}</TableCell>
                    <TableCell>{units}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatMoney(product.price * units)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <section className="overflow-hidden border border-black/10 bg-[#f7f5ef]">
          <SectionHeader
            title="Recent orders"
            subtitle="Latest activity across all channels"
            action="View all"
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-black/8">
                  <TableHead>Order</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 6).map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-black/8 cursor-pointer hover:bg-black/[0.025]"
                    onClick={() => openOrder(order)}
                  >
                    <TableCell>
                      <p className="text-xs font-medium">{order.id}</p>
                      <p className="mt-1 text-[0.62rem] text-black/38">
                        {formatShortDate(order.placedAt)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs">{order.customer}</p>
                      <p className="mt-1 text-[0.62rem] text-black/38">{order.city}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-xs font-medium tabular-nums">
                      {formatMoney(order.total)}
                    </TableCell>
                    <TableCell>
                      <Eye className="h-3.5 w-3.5 text-black/34" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="border border-black/10 bg-[#f7f5ef]">
          <SectionHeader title="Inventory watch" subtitle="Pieces requiring attention" />
          <div className="px-5 pb-2">
            {inventory.map(({ product, stock }) => (
              <div
                key={product.id}
                className="grid grid-cols-[38px_1fr_auto] items-center gap-3 border-t border-black/8 py-3 first:border-t-0"
              >
                <img src={product.images[0]} alt="" className="h-11 w-9 object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{product.name}</p>
                  <p className="mt-1 text-[0.6rem] text-black/38">
                    SSA-{product.id.slice(-3)} · {product.sizeMl} ml
                  </p>
                </div>
                <span
                  className={`text-[0.62rem] font-medium ${stock <= 5 ? "text-[#9a3d2e]" : "text-black/46"}`}
                >
                  {stock === 0 ? "Out" : `${stock} left`}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  trend,
  positive,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend: string;
  positive: boolean;
  icon: typeof CircleDollarSign;
}) {
  return (
    <article className="border-black/10 border-b p-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(n+3)]:border-b-0 xl:border-r xl:border-b-0 xl:last:border-r-0 xl:[&:nth-child(n+3)]:border-b-0">
      <div className="flex items-center justify-between">
        <span className="text-xs text-black/45">{label}</span>
        <Icon className="h-4 w-4 text-black/28" />
      </div>
      <p className="mt-5 text-[1.65rem] font-medium tracking-[-0.03em] tabular-nums">{value}</p>
      <p
        className={`mt-3 flex items-center gap-1 text-[0.62rem] ${positive ? "text-[#47705a]" : "text-[#9a5b3d]"}`}
      >
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {trend} <span className="text-black/32">vs last period</span>
      </p>
    </article>
  );
}

function OrdersView({
  orders,
  updateStatus,
  openOrder,
}: {
  orders: OrderRecord[];
  updateStatus: (id: string, status: OrderStatus) => void;
  openOrder: (order: OrderRecord) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = orders.filter(
    (order) =>
      (status === "all" || order.status === status) &&
      [order.id, order.customer, order.city].join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-5">
      <div className="grid border border-black/10 bg-[#f7f5ef] sm:grid-cols-4">
        {["pending", "processing", "shipped", "delivered"].map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setStatus(entry)}
            className={`border-black/10 p-4 text-left sm:border-r sm:last:border-r-0 ${status === entry ? "bg-black/[0.045]" : ""}`}
          >
            <p className="text-[0.62rem] tracking-wider text-black/42 uppercase">
              {statusLabel(entry as OrderStatus)}
            </p>
            <p className="mt-2 text-2xl font-medium tabular-nums">
              {orders.filter((order) => order.status === entry).length}
            </p>
          </button>
        ))}
      </div>
      <section className="overflow-hidden border border-black/10 bg-[#f7f5ef]">
        <div className="flex flex-col gap-4 border-b border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/35" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order, client or city"
              className="border-black/15 h-9 bg-transparent pl-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-black/15 h-9 w-40 bg-transparent text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((entry) => (
                  <SelectItem key={entry} value={entry}>
                    {statusLabel(entry as OrderStatus)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-black/15 h-9 bg-transparent text-xs">
              Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-black/8">
                <TableHead className="w-10">
                  <input type="checkbox" aria-label="Select all orders" />
                </TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id} className="border-black/8 hover:bg-black/[0.025]">
                  <TableCell>
                    <input type="checkbox" aria-label={`Select ${order.id}`} />
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => openOrder(order)}
                      className="font-medium hover:underline"
                    >
                      {order.id}
                    </button>
                  </TableCell>
                  <TableCell>
                    <p>{order.customer}</p>
                    <p className="mt-1 text-[0.62rem] text-black/38">{order.city}</p>
                  </TableCell>
                  <TableCell className="text-black/52">{formatShortDate(order.placedAt)}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <span
                      className={order.status === "delivered" ? "text-[#47705a]" : "text-[#9a773f]"}
                    >
                      {order.status === "delivered" ? "Collected" : "Pending"}
                    </span>
                    <p className="mt-1 text-[0.6rem] text-black/35">Cash on delivery</p>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateStatus(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="border-0 h-7 w-31 bg-transparent p-0 shadow-none">
                        <StatusBadge status={order.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {["pending", "processing", "shipped", "delivered", "cancelled"].map(
                          (entry) => (
                            <SelectItem key={entry} value={entry}>
                              {statusLabel(entry as OrderStatus)}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatMoney(order.total)}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => openOrder(order)}
                      className="focus-ring text-black/38 hover:text-black"
                      aria-label={`View ${order.id}`}
                    >
                      <Ellipsis className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t border-black/10 px-4 py-3 text-xs text-black/42">
          <span>
            Showing {filtered.length} of {orders.length} orders
          </span>
          <div className="flex gap-1">
            <button className="border-black/12 flex h-8 w-8 items-center justify-center border">
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button className="border-black/12 flex h-8 w-8 items-center justify-center border">
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FulfillmentView({
  orders,
  dismissedIds,
  updateStatus,
  dismissDelivered,
  openOrder,
}: {
  orders: OrderRecord[];
  dismissedIds: string[];
  updateStatus: (id: string, status: OrderStatus) => void;
  dismissDelivered: (id: string) => void;
  openOrder: (order: OrderRecord) => void;
}) {
  const columns: { status: OrderStatus; title: string; note: string }[] = [
    { status: "pending", title: "New orders", note: "Awaiting confirmation" },
    { status: "processing", title: "Preparing", note: "Packing and quality check" },
    { status: "shipped", title: "Dispatched", note: "With courier" },
    { status: "delivered", title: "Delivered", note: "Completed" },
  ];
  const move = (order: OrderRecord, direction: -1 | 1) => {
    const current = statusOrder.indexOf(order.status);
    const next = statusOrder[current + direction];
    if (next) updateStatus(order.id, next);
  };
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-black/42">
          <span className="font-medium text-black">Drag orders</span> between stages or use the
          arrow controls.
        </p>
        <div className="flex items-center gap-2 text-[0.62rem] text-black/42">
          <Clock3 className="h-3.5 w-3.5" /> Synced just now
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-5 xl:grid xl:grid-cols-4">
        {columns.map((column) => {
          const columnOrders = orders.filter(
            (order) =>
              order.status === column.status &&
              !(column.status === "delivered" && dismissedIds.includes(order.id)),
          );
          return (
            <section
              key={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const id = event.dataTransfer.getData("text/order-id");
                if (id) updateStatus(id, column.status);
              }}
              className="w-[290px] shrink-0 border border-black/10 bg-black/[0.018] xl:w-auto"
            >
              <div className="border-b border-black/10 bg-[#f7f5ef] px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">{column.title}</p>
                  <span className="bg-black/6 px-2 py-0.5 text-[0.62rem] font-medium tabular-nums">
                    {columnOrders.length}
                  </span>
                </div>
                <p className="mt-1 text-[0.62rem] text-black/38">{column.note}</p>
              </div>
              <div className="min-h-104 space-y-3 p-3">
                {columnOrders.map((order) => (
                  <article
                    key={order.id}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/order-id", order.id)}
                    className="cursor-grab border border-black/10 bg-[#f7f5ef] p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)] active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between">
                      <button
                        type="button"
                        onClick={() => openOrder(order)}
                        className="text-xs font-medium hover:underline"
                      >
                        {order.id}
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.58rem] text-black/35">
                          {order.items} {order.items === 1 ? "item" : "items"}
                        </span>
                        {column.status === "delivered" ? (
                          <button
                            type="button"
                            onClick={() => dismissDelivered(order.id)}
                            className="border-black/12 hover:border-[#9a3d2e] hover:text-[#9a3d2e] flex h-6 w-6 items-center justify-center border text-black/35"
                            aria-label={`Clear delivered order ${order.id} from fulfillment`}
                            title="Clear from fulfillment"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-medium">{order.customer}</p>
                    <p className="mt-1 text-[0.62rem] text-black/40">
                      {order.city} · {formatShortDate(order.placedAt)}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-black/8 pt-3">
                      <span className="text-xs font-medium tabular-nums">
                        {formatMoney(order.total)}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={column.status === "pending"}
                          onClick={() => move(order, -1)}
                          className="border-black/12 disabled:text-black/15 flex h-7 w-7 items-center justify-center border"
                          aria-label="Move back"
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          disabled={column.status === "delivered"}
                          onClick={() => move(order, 1)}
                          className="border-black/12 disabled:text-black/15 flex h-7 w-7 items-center justify-center border"
                          aria-label="Move forward"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
                {columnOrders.length === 0 ? (
                  <div className="border border-dashed border-black/12 px-4 py-10 text-center text-[0.65rem] text-black/30">
                    Drop an order here
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function FinanceView({ orders }: { orders: OrderRecord[] }) {
  const [fromDate, setFromDate] = useState("2026-08-01");
  const [toDate, setToDate] = useState("2026-08-28");

  const setTrailingRange = (days: number) => {
    const end = financeDailyData[financeDailyData.length - 1]?.date ?? "2026-08-28";
    const start = new Date(`${end}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() - (days - 1));
    setFromDate(start.toISOString().slice(0, 10));
    setToDate(end);
  };

  const validRange = fromDate <= toDate;
  const daily = validRange
    ? financeDailyData.filter((entry) => entry.date >= fromDate && entry.date <= toDate)
    : [];
  const rangeOrders = validRange
    ? orders.filter((order) => {
        const date = order.placedAt.slice(0, 10);
        return date >= fromDate && date <= toDate;
      })
    : [];
  const totals = daily.reduce(
    (summary, entry) => ({
      revenue: summary.revenue + entry.revenue,
      orders: summary.orders + entry.orders,
      costOfGoods: summary.costOfGoods + entry.costOfGoods,
      deliveryCost: summary.deliveryCost + entry.deliveryCost,
      refunds: summary.refunds + entry.refunds,
      profit: summary.profit + entry.profit,
    }),
    { revenue: 0, orders: 0, costOfGoods: 0, deliveryCost: 0, refunds: 0, profit: 0 },
  );
  const averageOrder = totals.orders > 0 ? Math.round(totals.revenue / totals.orders) : 0;
  const margin = totals.revenue > 0 ? (totals.profit / totals.revenue) * 100 : 0;
  const collectedCod = Math.max(0, Math.round((totals.revenue - totals.refunds) * 0.976));
  const pendingCod = rangeOrders
    .filter((order) => order.status !== "delivered" && order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const chartData = daily.map((entry) => ({
    ...entry,
    label: new Date(`${entry.date}T00:00:00Z`).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }),
  }));
  const statusRows = [...statusOrder, "cancelled" as const].map((status) => {
    const matching = rangeOrders.filter((order) => order.status === status);
    return {
      status,
      count: matching.length,
      value: matching.reduce((sum, order) => sum + order.total, 0),
    };
  });

  return (
    <div className="space-y-6">
      <section className="border border-black/10 bg-[#f7f5ef] p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-medium">Reporting period</p>
            <p className="mt-1 text-xs text-black/42">
              Revenue, costs, COD and orders update for the selected dates.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="From date">
              <Input
                type="date"
                min="2026-08-01"
                max="2026-08-28"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="border-black/15 w-42 bg-transparent"
              />
            </Field>
            <Field label="To date">
              <Input
                type="date"
                min="2026-08-01"
                max="2026-08-28"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="border-black/15 w-42 bg-transparent"
              />
            </Field>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTrailingRange(7)}
              className="border-black/15 bg-transparent"
            >
              Last 7 days
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTrailingRange(28)}
              className="border-black/15 bg-transparent"
            >
              Full month
            </Button>
          </div>
        </div>
        {!validRange ? (
          <p className="mt-4 text-xs text-[#9a3d2e]">From date must be before the to date.</p>
        ) : null}
      </section>

      <div className="grid border border-black/10 bg-[#f7f5ef] sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStat
          label="Gross revenue"
          value={formatMoney(totals.revenue)}
          note="before costs"
        />
        <FinanceStat label="Recorded orders" value={String(totals.orders)} note="within range" />
        <FinanceStat label="Average order" value={formatMoney(averageOrder)} note="gross AOV" />
        <FinanceStat
          label="Operating profit"
          value={formatMoney(totals.profit)}
          note={`${margin.toFixed(1)}% margin`}
        />
      </div>

      <div className="grid border border-black/10 bg-[#f7f5ef] sm:grid-cols-3">
        <BusinessPulse
          label="COD collected"
          value={formatMoney(collectedCod)}
          note="97.6% successful collection"
        />
        <BusinessPulse
          label="Pending COD"
          value={formatMoney(pendingCod)}
          note="open order records"
        />
        <BusinessPulse
          label="Refunds"
          value={formatMoney(totals.refunds)}
          note="approved in selected period"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
        <section className="border border-black/10 bg-[#f7f5ef] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Revenue and profit trend</p>
              <p className="mt-1 text-xs text-black/42">Daily performance for the selected range</p>
            </div>
            <div className="flex items-center gap-4 text-[0.65rem] text-black/48">
              <span className="flex items-center gap-2">
                <i className="h-0.5 w-4 bg-[#171713]" /> Revenue
              </span>
              <span className="flex items-center gap-2">
                <i className="h-0.5 w-4 bg-[#aa8755]" /> Profit
              </span>
            </div>
          </div>
          <div className="mt-7 h-78">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: -8, right: 10, top: 8 }}>
                <CartesianGrid vertical={false} stroke="#17171318" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                  tick={{ fill: "#17171377", fontSize: 10 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#17171366", fontSize: 10 }}
                  tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 0,
                    border: "1px solid #17171322",
                    background: "#f7f5ef",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [
                    formatMoney(value),
                    name === "revenue" ? "Revenue" : "Profit",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#171713"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#aa8755"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="border border-black/10 bg-[#f7f5ef] p-5 sm:p-6">
          <div>
            <p className="text-sm font-medium">Cost structure</p>
            <p className="mt-1 text-xs text-black/42">Where period revenue is allocated</p>
          </div>
          <div className="mt-7 space-y-5">
            <FinanceBreakdown
              label="Cost of goods"
              value={totals.costOfGoods}
              total={totals.revenue}
            />
            <FinanceBreakdown
              label="Courier expense"
              value={totals.deliveryCost}
              total={totals.revenue}
            />
            <FinanceBreakdown label="Refunds" value={totals.refunds} total={totals.revenue} />
            <FinanceBreakdown
              label="Operating profit"
              value={totals.profit}
              total={totals.revenue}
              accent
            />
          </div>
          <div className="mt-8 border-t border-black/10 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-black/45">Total operating costs</span>
              <span className="text-sm font-medium tabular-nums">
                {formatMoney(totals.costOfGoods + totals.deliveryCost + totals.refunds)}
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="border border-black/10 bg-[#f7f5ef]">
          <SectionHeader title="Order position" subtitle="Stored order records in this range" />
          <div className="px-5 pb-4">
            {statusRows.map((row) => (
              <div
                key={row.status}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-black/8 py-4 first:border-t-0"
              >
                <div className="flex items-center gap-2.5">
                  <StatusDot status={row.status} />
                  <span className="text-xs">{statusLabel(row.status)}</span>
                  <span className="text-[0.65rem] text-black/35">{row.count}</span>
                </div>
                <span className="text-xs font-medium tabular-nums">{formatMoney(row.value)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden border border-black/10 bg-[#f7f5ef]">
          <SectionHeader
            title="Daily financial ledger"
            subtitle="Gross, costs, refunds and net result"
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-black/8">
                  <TableHead>Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Costs</TableHead>
                  <TableHead>Refunds</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...chartData]
                  .reverse()
                  .slice(0, 12)
                  .map((entry) => (
                    <TableRow key={entry.date} className="border-black/8">
                      <TableCell className="text-xs">{entry.label}</TableCell>
                      <TableCell>{entry.orders}</TableCell>
                      <TableCell className="font-medium tabular-nums">
                        {formatMoney(entry.revenue)}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {formatMoney(entry.costOfGoods + entry.deliveryCost)}
                      </TableCell>
                      <TableCell className="tabular-nums">{formatMoney(entry.refunds)}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatMoney(entry.profit)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {chartData.length === 0 ? (
            <p className="border-t border-black/10 px-5 py-8 text-center text-xs text-black/38">
              No financial records fall inside this date range.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function FinanceStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="border-black/10 border-b p-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(n+3)]:border-b-0 xl:border-r xl:border-b-0 xl:last:border-r-0">
      <p className="text-xs text-black/45">{label}</p>
      <p className="mt-4 text-[1.65rem] font-medium tracking-[-0.03em] tabular-nums">{value}</p>
      <p className="mt-2 text-[0.65rem] text-black/38">{note}</p>
    </article>
  );
}

function FinanceBreakdown({
  label,
  value,
  total,
  accent = false,
}: {
  label: string;
  value: number;
  total: number;
  accent?: boolean;
}) {
  const percent = total > 0 ? Math.max(0, (value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-xs">
        <span className="text-black/52">{label}</span>
        <span className="font-medium tabular-nums">
          {formatMoney(value)} · {percent.toFixed(1)}%
        </span>
      </div>
      <div className="h-1.5 bg-black/7">
        <div
          className={`h-full ${accent ? "bg-[#47705a]" : "bg-[#aa8755]"}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
}

function CatalogViewPanel({
  products: catalog,
  editProduct,
  deleteProduct,
  openNew,
}: {
  products: ProductItem[];
  editProduct: (product: ProductItem) => void;
  deleteProduct: (product: ProductItem) => void;
  openNew: () => void;
}) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("all");
  const [view, setView] = useState<CatalogView>("table");
  const filtered = catalog.filter(
    (product) =>
      (collection === "all" || product.collection === collection) &&
      [product.name, product.family, product.slug]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-5">
      <div className="grid border border-black/10 bg-[#f7f5ef] sm:grid-cols-3">
        <CatalogMetric label="Total fragrances" value={catalog.length} />
        <CatalogMetric
          label="Available"
          value={catalog.filter((product) => !product.outOfStock).length}
        />
        <CatalogMetric
          label="Media assets"
          value={catalog.reduce((sum, product) => sum + getProductMedia(product).length, 0)}
        />
      </div>
      <section className="overflow-hidden border border-black/10 bg-[#f7f5ef]">
        <div className="flex flex-col gap-4 border-b border-black/10 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/35" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="border-black/15 h-9 bg-transparent pl-9 text-xs"
                placeholder="Search catalog"
              />
            </div>
            <Select value={collection} onValueChange={setCollection}>
              <SelectTrigger className="border-black/15 h-9 w-full bg-transparent text-xs sm:w-42">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All collections</SelectItem>
                {["Signature", "Evening", "Daily", "Limited"].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="border-black/12 flex h-9 border">
              <button
                type="button"
                onClick={() => setView("table")}
                className={`flex w-9 items-center justify-center ${view === "table" ? "bg-black text-white" : "text-black/38"}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`flex w-9 items-center justify-center ${view === "grid" ? "bg-black text-white" : "text-black/38"}`}
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={openNew}
              className="bg-[#171713] text-white hover:bg-[#aa8755] hover:text-black h-9 text-xs"
            >
              <Plus className="mr-2 h-3.5 w-3.5" /> Add fragrance
            </Button>
          </div>
        </div>
        {view === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-black/8">
                  <TableHead>Fragrance</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Client response</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product, index) => {
                  const media = getProductMedia(product);
                  const stock = product.outOfStock
                    ? 0
                    : ([18, 7, 24, 5, 31, 9, 14, 4, 21][index % 9] ?? 12);
                  return (
                    <TableRow key={product.id} className="border-black/8">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt="" className="h-12 w-10 object-cover" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="mt-1 text-[0.6rem] text-black/38">
                              SSA-{product.id.slice(-3)} · {product.sizeMl} ml
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {media.slice(0, 3).map((item) =>
                            item.type === "video" ? (
                              <span
                                key={item.id}
                                className="bg-black text-white flex h-8 w-8 items-center justify-center border-2 border-[#f7f5ef]"
                              >
                                <Film className="h-3.5 w-3.5" />
                              </span>
                            ) : (
                              <img
                                key={item.id}
                                src={item.src}
                                alt=""
                                className="h-8 w-8 border-2 border-[#f7f5ef] object-cover"
                              />
                            ),
                          )}
                          {media.length > 3 ? (
                            <span className="bg-[#e7e3da] flex h-8 w-8 items-center justify-center border-2 border-[#f7f5ef] text-[0.58rem]">
                              +{media.length - 3}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{product.collection}</TableCell>
                      <TableCell>
                        <p className="font-medium">{product.rating.toFixed(1)} / 5</p>
                        <p className="mt-1 text-[0.62rem] text-black/40">
                          {product.reviewCount} reviews
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className={stock <= 5 ? "text-[#9a3d2e]" : ""}>{stock} units</p>
                        <p className="mt-1 text-[0.6rem] text-black/35">
                          {stock <= 5 ? "Reorder needed" : "In stock"}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium tabular-nums">
                        {formatMoney(product.price)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 text-[0.65rem] ${product.outOfStock ? "text-[#9a3d2e]" : "text-[#47705a]"}`}
                        >
                          <i className="h-1.5 w-1.5 rounded-full bg-current" />
                          {product.outOfStock ? "Unavailable" : "Published"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => editProduct(product)}
                            className="border-black/10 flex h-8 w-8 items-center justify-center border text-black/48 hover:text-black"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product)}
                            className="border-black/10 flex h-8 w-8 items-center justify-center border text-black/48 hover:text-[#9a3d2e]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid gap-px bg-black/10 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => {
              const media = getProductMedia(product);
              const videoCount = media.filter((item) => item.type === "video").length;
              return (
                <article key={product.id} className="bg-[#f7f5ef] p-4">
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={`${product.name} bottle`}
                      className="aspect-[4/3.5] w-full object-cover"
                    />
                    <span className="bg-black/72 text-white absolute right-2 bottom-2 px-2 py-1 text-[0.58rem]">
                      {media.length} media · {videoCount} video
                    </span>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl">{product.name}</p>
                      <p className="mt-2 text-[0.6rem] tracking-wider text-black/42 uppercase">
                        {product.collection} · {product.concentration}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="border-black/12 flex h-8 w-8 items-center justify-center border"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-black/8 pt-3 text-xs">
                    <span>
                      {formatMoney(product.price)} · {product.rating.toFixed(1)} (
                      {product.reviewCount})
                    </span>
                    <span className={product.outOfStock ? "text-[#9a3d2e]" : "text-[#47705a]"}>
                      {product.outOfStock ? "Unavailable" : "Published"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <div className="border-t border-black/10 px-4 py-3 text-xs text-black/42">
          {filtered.length} fragrances ·{" "}
          {filtered.reduce((sum, product) => sum + getProductMedia(product).length, 0)} media assets
        </div>
      </section>
    </div>
  );
}

function CatalogMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-black/10 border-b p-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
      <p className="text-[0.62rem] tracking-wider text-black/42 uppercase">{label}</p>
      <p className="mt-2 text-2xl font-medium tabular-nums">{value}</p>
    </div>
  );
}

function PromotionsView({
  promos,
  setPromos,
  openNew,
  notify,
}: {
  promos: PromoCode[];
  setPromos: React.Dispatch<React.SetStateAction<PromoCode[]>>;
  openNew: () => void;
  notify: (message: string) => void;
}) {
  const toggle = (id: string) =>
    setPromos((current) =>
      current.map((promo) => (promo.id === id ? { ...promo, active: !promo.active } : promo)),
    );
  const remove = (id: string) => setPromos((current) => current.filter((promo) => promo.id !== id));
  const redeemed = [28, 14, 9, 6];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-8">
          <div>
            <p className="text-[0.62rem] tracking-wider text-black/42 uppercase">
              Active campaigns
            </p>
            <p className="mt-2 text-2xl font-medium">
              {promos.filter((promo) => promo.active).length}
            </p>
          </div>
          <div className="border-l border-black/10 pl-8">
            <p className="text-[0.62rem] tracking-wider text-black/42 uppercase">
              Attributed revenue
            </p>
            <p className="mt-2 text-2xl font-medium">PKR 184,600</p>
          </div>
        </div>
        <Button
          onClick={openNew}
          className="bg-[#171713] text-white hover:bg-[#aa8755] hover:text-black"
        >
          <Plus className="mr-2 h-4 w-4" /> Create promotion
        </Button>
      </div>
      <section className="overflow-hidden border border-black/10 bg-[#f7f5ef]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-black/8">
                <TableHead>Code</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead>Minimum order</TableHead>
                <TableHead>Window</TableHead>
                <TableHead>Redemptions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.map((promo, index) => (
                <TableRow key={promo.id} className="border-black/8">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="border-black/12 border px-2.5 py-1 font-mono text-xs font-medium tracking-wider">
                        {promo.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(promo.code);
                          notify(`${promo.code} copied.`);
                        }}
                        className="text-black/32"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {promo.discountType === "percent"
                      ? `${promo.discountValue}% off`
                      : `${formatMoney(promo.discountValue)} off`}
                  </TableCell>
                  <TableCell>{formatMoney(promo.minOrder)}</TableCell>
                  <TableCell>
                    <p>{promo.validFrom}</p>
                    <p className="mt-1 text-[0.6rem] text-black/35">through {promo.validTo}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{redeemed[index] ?? 3}</p>
                    <p className="mt-1 text-[0.6rem] text-black/35">uses</p>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => toggle(promo.id)}
                      className={`inline-flex items-center gap-2 text-[0.65rem] ${promo.active ? "text-[#47705a]" : "text-black/40"}`}
                    >
                      <span
                        className={`relative h-4 w-7 rounded-full ${promo.active ? "bg-[#47705a]" : "bg-black/15"}`}
                      >
                        <span
                          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${promo.active ? "translate-x-3.5" : "translate-x-0.5"}`}
                        />
                      </span>
                      {promo.active ? "Active" : "Paused"}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => remove(promo.id)}
                        className="border-black/10 flex h-8 w-8 items-center justify-center border text-black/42 hover:text-[#9a3d2e]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function OrderDetail({
  order,
  onOpenChange,
  updateStatus,
  notify,
}: {
  order: OrderRecord | null;
  onOpenChange: (open: boolean) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  notify: (message: string) => void;
}) {
  if (!order) return null;
  const index = Number(order.id.slice(-2)) % products.length;
  const lineProducts = Array.from(
    { length: Math.min(order.items, 3) },
    (_, offset) => products[(index + offset) % products.length],
  ).filter((product): product is ProductItem => Boolean(product));
  const timeline = statusOrder.map((status) => ({
    status,
    complete: statusOrder.indexOf(status) <= statusOrder.indexOf(order.status),
  }));
  return (
    <Sheet open={Boolean(order)} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#f7f5ef] border-black/15 w-full overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-black/10 px-6 py-5 text-left">
          <div className="flex items-center gap-3">
            <SheetTitle className="font-display text-3xl font-light">{order.id}</SheetTitle>
            <StatusBadge status={order.status} />
          </div>
          <SheetDescription>
            Placed{" "}
            {new Date(order.placedAt).toLocaleString("en-PK", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-7 px-6 py-6">
          <div>
            <p className="text-[0.62rem] font-semibold tracking-[0.13em] text-black/42 uppercase">
              Fulfillment status
            </p>
            <Select
              value={order.status}
              onValueChange={(value) => updateStatus(order.id, value as OrderStatus)}
            >
              <SelectTrigger className="border-black/15 mt-3 h-11 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabel(status as OrderStatus)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4">
            {timeline.map((step, stepIndex) => (
              <div key={step.status} className="relative">
                <div
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border ${step.complete ? "border-[#47705a] bg-[#47705a] text-white" : "border-black/15 bg-[#f7f5ef] text-black/25"}`}
                >
                  {step.complete ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="text-[0.55rem]">{stepIndex + 1}</span>
                  )}
                </div>
                {stepIndex < timeline.length - 1 ? (
                  <div
                    className={`absolute top-3 left-6 h-px w-[calc(100%-24px)] ${timeline[stepIndex + 1]?.complete ? "bg-[#47705a]" : "bg-black/12"}`}
                  />
                ) : null}
                <p className="mt-2 pr-2 text-[0.58rem] text-black/44">{statusLabel(step.status)}</p>
              </div>
            ))}
          </div>
          <section className="border-y border-black/10 py-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[0.62rem] font-semibold tracking-[0.13em] text-black/42 uppercase">
                Order items
              </p>
              <span className="text-xs text-black/42">{order.items} pieces</span>
            </div>
            <div className="space-y-4">
              {lineProducts.map((product, productIndex) => (
                <div
                  key={`${product.id}-${productIndex}`}
                  className="grid grid-cols-[54px_1fr_auto] gap-3"
                >
                  <img src={product.images[0]} alt="" className="h-16 w-13 object-cover" />
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="mt-1 text-[0.62rem] text-black/38">
                      {product.sizeMl} ml · {product.concentration} · Qty 1
                    </p>
                  </div>
                  <p className="text-xs font-medium tabular-nums">
                    {formatMoney(
                      productIndex === lineProducts.length - 1
                        ? Math.max(
                            0,
                            order.total -
                              lineProducts
                                .slice(0, -1)
                                .reduce((sum, entry) => sum + entry.price, 0),
                          )
                        : product.price,
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[0.62rem] font-semibold tracking-[0.13em] text-black/42 uppercase">
                Client
              </p>
              <p className="mt-3 text-sm font-medium">{order.customer}</p>
              <p className="mt-1 text-xs leading-5 text-black/45">
                +92 3{String(Number(order.id.slice(-2)) + 10).padStart(2, "0")} 555 0182
                <br />
                {order.customer.toLowerCase().replace(" ", ".")}@example.com
              </p>
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold tracking-[0.13em] text-black/42 uppercase">
                Delivery address
              </p>
              <p className="mt-3 text-xs leading-5 text-black/52">
                House 18, Street 4<br />
                {order.city}, Pakistan
              </p>
            </div>
          </div>
          <div className="border-t border-black/10 pt-5">
            <div className="flex justify-between text-xs text-black/48">
              <span>Subtotal</span>
              <span>{formatMoney(order.total)}</span>
            </div>
            <div className="mt-3 flex justify-between text-xs text-black/48">
              <span>Delivery</span>
              <span>Complimentary</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-black/10 pt-4">
              <span className="text-sm font-medium">Due on delivery</span>
              <span className="text-lg font-medium tabular-nums">{formatMoney(order.total)}</span>
            </div>
          </div>
          <div>
            <Button
              className="bg-[#171713] text-white hover:bg-[#aa8755] hover:text-black w-full"
              onClick={() => notify("Order update sent to the client.")}
            >
              Notify client
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ProductEditor({
  open,
  onOpenChange,
  draft,
  setDraft,
  save,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: ProductDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductDraft>>;
  save: () => void;
}) {
  const [mediaError, setMediaError] = useState("");
  const update = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const addFiles = (files: File[]) => {
    const accepted: ProductMediaItem[] = [];
    let rejected = 0;

    files.forEach((file, index) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const withinLimit = isImage ? file.size <= 8 * 1024 * 1024 : file.size <= 40 * 1024 * 1024;
      if ((!isImage && !isVideo) || !withinLimit) {
        rejected += 1;
        return;
      }
      accepted.push({
        id: `upload-${Date.now()}-${index}`,
        type: isVideo ? "video" : "image",
        src: URL.createObjectURL(file),
        name: file.name,
        sizeBytes: file.size,
      });
    });

    if (accepted.length) {
      setDraft((current) => ({ ...current, media: [...current.media, ...accepted] }));
    }
    setMediaError(
      rejected > 0
        ? `${rejected} file${rejected === 1 ? " was" : "s were"} skipped. Use images up to 8 MB or videos up to 40 MB.`
        : "",
    );
  };

  const moveMedia = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= draft.media.length) return;
    const next = [...draft.media];
    const currentItem = next[index];
    const targetItem = next[nextIndex];
    if (!currentItem || !targetItem) return;
    next[index] = targetItem;
    next[nextIndex] = currentItem;
    update("media", next);
  };

  const removeMedia = (index: number) => {
    const item = draft.media[index];
    if (item?.src.startsWith("blob:")) URL.revokeObjectURL(item.src);
    update(
      "media",
      draft.media.filter((_, mediaIndex) => mediaIndex !== index),
    );
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#f7f5ef] border-black/15 w-full overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-black/10 px-6 py-5 text-left">
          <SheetTitle className="font-display text-3xl font-light">
            {draft.id ? "Edit fragrance" : "Add fragrance"}
          </SheetTitle>
          <SheetDescription>
            Manage the storefront record and upload its image and video media.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-7 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fragrance name">
              <Input
                value={draft.name}
                onChange={(event) => {
                  update("name", event.target.value);
                  if (!draft.id) update("slug", slugify(event.target.value));
                }}
                placeholder="Noir Oud"
              />
            </Field>
            <Field label="URL slug">
              <Input
                value={draft.slug}
                onChange={(event) => update("slug", slugify(event.target.value))}
                placeholder="noir-oud"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Fragrance family">
                <Input
                  value={draft.family}
                  onChange={(event) => update("family", event.target.value)}
                  placeholder="Oud · Leather · Smoke"
                />
              </Field>
            </div>
            <Field label="Collection">
              <Select
                value={draft.collection}
                onValueChange={(value) => update("collection", value as ProductItem["collection"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Signature", "Evening", "Daily", "Limited"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Concentration">
              <Select
                value={draft.concentration}
                onValueChange={(value) =>
                  update("concentration", value as ProductItem["concentration"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["EDP", "Parfum", "Extrait"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Audience">
              <Select
                value={draft.gender}
                onValueChange={(value) => update("gender", value as ProductItem["gender"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Size (ml)">
              <Input
                type="number"
                min="1"
                value={draft.sizeMl}
                onChange={(event) => update("sizeMl", event.target.value)}
              />
            </Field>
            <Field label="Price (PKR)">
              <Input
                type="number"
                min="1"
                value={draft.price}
                onChange={(event) => update("price", event.target.value)}
              />
            </Field>
            <Field label="Availability">
              <button
                type="button"
                onClick={() => update("outOfStock", !draft.outOfStock)}
                className="border-black/15 flex h-10 w-full items-center justify-between border bg-transparent px-3 text-xs"
              >
                <span>{draft.outOfStock ? "Unavailable" : "Available"}</span>
                <span
                  className={`relative h-4 w-7 rounded-full ${draft.outOfStock ? "bg-black/15" : "bg-[#47705a]"}`}
                >
                  <span
                    className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${draft.outOfStock ? "translate-x-0.5" : "translate-x-3.5"}`}
                  />
                </span>
              </button>
            </Field>
          </div>
          <section className="border-t border-black/10 pt-6">
            <div>
              <p className="text-xs font-medium">Client response</p>
              <p className="mt-1 text-[0.65rem] text-black/42">
                These values appear with the fragrance in the catalog and performance reports.
              </p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Review rating (0–5)">
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={draft.rating}
                  onChange={(event) => update("rating", event.target.value)}
                  placeholder="4.9"
                />
              </Field>
              <Field label="Published review count">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={draft.reviewCount}
                  onChange={(event) => update("reviewCount", event.target.value)}
                  placeholder="146"
                />
              </Field>
            </div>
          </section>

          <section className="border-t border-black/10 pt-6">
            <div>
              <p className="text-xs font-medium">Fragrance story and composition</p>
              <p className="mt-1 text-[0.65rem] text-black/42">
                Manage the copy and note pyramid shown on the product detail page.
              </p>
            </div>
            <div className="mt-4 space-y-4">
              <Field label="Mood line">
                <Input
                  value={draft.mood}
                  onChange={(event) => update("mood", event.target.value)}
                  placeholder="Smoky, poised and magnetic"
                />
              </Field>
              <Field label="Fragrance description">
                <Textarea
                  value={draft.story}
                  onChange={(event) => update("story", event.target.value)}
                  rows={5}
                  placeholder="Noir Oud opens with dry spice before settling into an elegant leather core..."
                  className="resize-y"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Top notes">
                  <Textarea
                    value={draft.topNotes}
                    onChange={(event) => update("topNotes", event.target.value)}
                    rows={4}
                    placeholder="Saffron, Pink Pepper, Cardamom"
                  />
                </Field>
                <Field label="Heart notes">
                  <Textarea
                    value={draft.heartNotes}
                    onChange={(event) => update("heartNotes", event.target.value)}
                    rows={4}
                    placeholder="Oud Accord, Labdanum, Suede"
                  />
                </Field>
                <Field label="Base notes">
                  <Textarea
                    value={draft.baseNotes}
                    onChange={(event) => update("baseNotes", event.target.value)}
                    rows={4}
                    placeholder="Cedarwood, Incense, Musk"
                  />
                </Field>
              </div>
              <p className="text-[0.65rem] text-black/38">
                Separate individual notes with commas or place each note on a new line.
              </p>
            </div>
          </section>

          <section className="border-t border-black/10 pt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium">Product media</p>
                <p className="mt-1 text-[0.65rem] text-black/42">
                  Arrange images and videos in the order clients should see them.
                </p>
              </div>
              <span className="text-[0.62rem] text-black/38">
                {draft.media.length} files ·{" "}
                {draft.media.filter((item) => item.type === "video").length} videos
              </span>
            </div>

            <label
              className="border-black/18 hover:border-[#8b6b3e] mt-4 flex cursor-pointer flex-col items-center justify-center border border-dashed px-5 py-8 text-center transition-colors"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                addFiles(Array.from(event.dataTransfer.files));
              }}
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
                className="sr-only"
                onChange={(event) => {
                  addFiles(Array.from(event.target.files ?? []));
                  event.target.value = "";
                }}
              />
              <UploadCloud className="h-6 w-6 text-black/32" />
              <p className="mt-3 text-sm font-medium">Choose files or drag them here</p>
              <p className="mt-1 text-[0.65rem] text-black/42">
                JPG, PNG, WebP, AVIF up to 8 MB · MP4, WebM or MOV up to 40 MB
              </p>
            </label>
            {mediaError ? <p className="mt-2 text-xs text-[#9a3d2e]">{mediaError}</p> : null}

            {draft.media.length > 0 ? (
              <div className="mt-4 space-y-2">
                {draft.media.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[54px_1fr_auto] items-center gap-3 border border-black/10 bg-black/[0.015] p-2"
                  >
                    <div className="relative">
                      {item.type === "video" ? (
                        <video
                          src={item.src}
                          muted
                          playsInline
                          preload="metadata"
                          className="h-14 w-13 bg-black object-cover"
                        />
                      ) : (
                        <img src={item.src} alt="" className="h-14 w-13 object-cover" />
                      )}
                      {index === 0 ? (
                        <span className="bg-black/75 text-white absolute right-0 bottom-0 left-0 py-0.5 text-center text-[0.48rem] uppercase">
                          Primary
                        </span>
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{item.name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-[0.6rem] text-black/40">
                        {item.type === "video" ? (
                          <Film className="h-3 w-3" />
                        ) : (
                          <ImageIcon className="h-3 w-3" />
                        )}
                        {item.type === "video" ? "Video" : "Image"}
                        {item.sizeBytes
                          ? ` · ${formatFileSize(item.sizeBytes)}`
                          : " · Existing media"}
                      </p>
                    </div>
                    <div className="flex">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveMedia(index, -1)}
                        className="border-black/10 disabled:text-black/15 flex h-8 w-7 items-center justify-center border"
                        aria-label={`Move ${item.name} earlier`}
                      >
                        <ArrowLeft className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        type="button"
                        disabled={index === draft.media.length - 1}
                        onClick={() => moveMedia(index, 1)}
                        className="border-black/10 disabled:text-black/15 flex h-8 w-7 items-center justify-center border"
                        aria-label={`Move ${item.name} later`}
                      >
                        <ArrowRight className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="border-black/10 flex h-8 w-7 items-center justify-center border hover:text-[#9a3d2e]"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-black/15 mt-4 py-8 text-center">
                <ImagePlus className="mx-auto h-5 w-5 text-black/25" />
                <p className="mt-2 text-xs text-black/38">No media uploaded yet</p>
              </div>
            )}
          </section>
          <div className="sticky bottom-0 -mx-6 flex justify-end gap-2 border-t border-black/10 bg-[#f7f5ef] px-6 pt-5 pb-1">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-black/15 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              className="bg-[#171713] text-white hover:bg-[#aa8755] hover:text-black"
            >
              {draft.id ? "Save changes" : "Add fragrance"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PromoEditor({
  open,
  onOpenChange,
  draft,
  setDraft,
  save,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: PromoDraft;
  setDraft: React.Dispatch<React.SetStateAction<PromoDraft>>;
  save: () => void;
}) {
  const update = <K extends keyof PromoDraft>(key: K, value: PromoDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#f7f5ef] border-black/15 w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-3xl font-light">Create promotion</SheetTitle>
          <SheetDescription>Set the offer, eligibility and active campaign dates.</SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          <Field label="Promotion code">
            <Input
              value={draft.code}
              onChange={(event) => update("code", event.target.value.toUpperCase())}
              placeholder="SIGNATURE10"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Offer type">
              <Select
                value={draft.discountType}
                onValueChange={(value) =>
                  update("discountType", value as PromoCode["discountType"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage</SelectItem>
                  <SelectItem value="amount">Fixed amount</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Discount value">
              <Input
                type="number"
                value={draft.discountValue}
                onChange={(event) => update("discountValue", event.target.value)}
              />
            </Field>
          </div>
          <Field label="Minimum order (PKR)">
            <Input
              type="number"
              value={draft.minOrder}
              onChange={(event) => update("minOrder", event.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Valid from">
              <Input
                type="date"
                value={draft.validFrom}
                onChange={(event) => update("validFrom", event.target.value)}
              />
            </Field>
            <Field label="Valid through">
              <Input
                type="date"
                value={draft.validTo}
                onChange={(event) => update("validTo", event.target.value)}
              />
            </Field>
          </div>
          <Button
            onClick={save}
            className="bg-[#171713] text-white hover:bg-[#aa8755] hover:text-black mt-3 h-11 w-full"
          >
            Create promotion
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.62rem] font-semibold tracking-[0.12em] text-black/45 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-[0.62rem] text-black/38">{subtitle}</p>
      </div>
      {action ? (
        <button type="button" className="text-[0.62rem] font-medium text-black/44 hover:text-black">
          {action} <ArrowRight className="ml-1 inline h-3 w-3" />
        </button>
      ) : null}
    </div>
  );
}
function StatusDot({ status }: { status: OrderStatus }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${statusColor(status).dot}`} />;
}
function StatusBadge({ status }: { status: OrderStatus }) {
  const color = statusColor(status);
  return (
    <Badge
      variant="outline"
      className={`rounded-none px-2 py-1 text-[0.58rem] font-medium ${color.badge}`}
    >
      <StatusDot status={status} />
      {statusLabel(status)}
    </Badge>
  );
}
function statusLabel(status: OrderStatus) {
  return status === "pending"
    ? "New"
    : status === "processing"
      ? "Preparing"
      : status === "shipped"
        ? "Dispatched"
        : status === "delivered"
          ? "Delivered"
          : "Cancelled";
}
function statusColor(status: OrderStatus) {
  if (status === "pending")
    return { dot: "bg-[#9a773f]", badge: "border-[#9a773f]/25 bg-[#9a773f]/7 text-[#765928]" };
  if (status === "processing")
    return { dot: "bg-[#556a7b]", badge: "border-[#556a7b]/25 bg-[#556a7b]/7 text-[#455968]" };
  if (status === "shipped")
    return { dot: "bg-[#6b5b84]", badge: "border-[#6b5b84]/25 bg-[#6b5b84]/7 text-[#5b4b75]" };
  if (status === "delivered")
    return { dot: "bg-[#47705a]", badge: "border-[#47705a]/25 bg-[#47705a]/7 text-[#47705a]" };
  return { dot: "bg-[#9a3d2e]", badge: "border-[#9a3d2e]/25 bg-[#9a3d2e]/7 text-[#9a3d2e]" };
}
function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function parseNoteList(value: string) {
  return value
    .split(/[,\n·]+/)
    .map((note) => note.trim())
    .filter(Boolean);
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatFileSize(value: number) {
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

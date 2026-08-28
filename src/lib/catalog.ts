import boutiqueInterior from "@/assets/boutique-interior.jpg";
import galleryDetail from "@/assets/gallery-detail.jpg";
import galleryWide from "@/assets/gallery-wide.jpg";
import heroPoster from "@/assets/hero-poster.jpg";
import noirOud from "@/assets/noir-oud.jpg";
import santalReserve from "@/assets/santal-reserve.jpg";
import velvetAmber from "@/assets/velvet-amber.jpg";

export type ProductItem = {
  id: string;
  slug: string;
  name: string;
  family: string;
  gender: "male" | "female";
  collection: "Signature" | "Evening" | "Daily" | "Limited";
  concentration: "EDP" | "Extrait" | "Parfum";
  sizeMl: number;
  price: number;
  compareAt: number;
  outOfStock: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  launchYear: number;
  mood: string;
  story: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  images: string[];
};

export type OrderRecord = {
  id: string;
  customer: string;
  city: string;
  items: number;
  total: number;
  placedAt: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
};

export type PromoCode = {
  id: string;
  code: string;
  discountType: "percent" | "amount";
  discountValue: number;
  minOrder: number;
  validFrom: string;
  validTo: string;
  active: boolean;
};

export const products: ProductItem[] = [
  {
    id: "prd-001",
    slug: "noir-oud",
    name: "Noir Oud",
    family: "Oud · Leather · Smoke",
    gender: "male",
    collection: "Evening",
    concentration: "Extrait",
    sizeMl: 50,
    price: 23800,
    compareAt: 26500,
    outOfStock: false,
    featured: true,
    rating: 4.9,
    reviewCount: 146,
    launchYear: 2025,
    mood: "Smoky, poised and magnetic",
    story:
      "Noir Oud opens with dry spice before settling into an elegant leather core. The finish is a slow, resinous trail that stays close to skin.",
    notes: {
      top: ["Saffron", "Pink Pepper", "Cardamom"],
      heart: ["Oud Accord", "Labdanum", "Suede"],
      base: ["Cedarwood", "Incense", "Musk"],
    },
    images: [noirOud, galleryWide, heroPoster],
  },
  {
    id: "prd-002",
    slug: "velvet-amber",
    name: "Velvet Amber",
    family: "Amber · Vanilla · Benzoin",
    gender: "female",
    collection: "Signature",
    concentration: "Parfum",
    sizeMl: 75,
    price: 21400,
    compareAt: 24400,
    outOfStock: false,
    featured: true,
    rating: 4.8,
    reviewCount: 188,
    launchYear: 2024,
    mood: "Warm, smooth and intimate",
    story:
      "Velvet Amber is a polished amber accord with gentle sweetness. It starts luminous and settles into a creamy dry-down built for everyday elegance.",
    notes: {
      top: ["Bergamot", "Neroli"],
      heart: ["Amber Resin", "Vanilla Orchid"],
      base: ["Benzoin", "Tonka", "Sandalwood"],
    },
    images: [velvetAmber, heroPoster, galleryDetail],
  },
  {
    id: "prd-003",
    slug: "santal-reserve",
    name: "Santal Reserve",
    family: "Sandalwood · Cedar · Iris",
    gender: "male",
    collection: "Daily",
    concentration: "EDP",
    sizeMl: 100,
    price: 19600,
    compareAt: 21600,
    outOfStock: false,
    featured: true,
    rating: 4.7,
    reviewCount: 97,
    launchYear: 2024,
    mood: "Clean wood with soft depth",
    story:
      "Santal Reserve blends dry woods with powdery iris. It wears quietly in the first hour and then deepens into a modern skin scent.",
    notes: {
      top: ["Violet Leaf", "Cardamom"],
      heart: ["Sandalwood", "Iris"],
      base: ["Cedar", "Vetiver", "Cashmere Musk"],
    },
    images: [santalReserve, boutiqueInterior, noirOud],
  },
  {
    id: "prd-004",
    slug: "amber-dusk",
    name: "Amber Dusk",
    family: "Amber · Spice · Woods",
    gender: "female",
    collection: "Evening",
    concentration: "Parfum",
    sizeMl: 50,
    price: 22900,
    compareAt: 25600,
    outOfStock: false,
    featured: false,
    rating: 4.6,
    reviewCount: 64,
    launchYear: 2023,
    mood: "Rich sunset warmth",
    story: "A darker amber profile layered with clove and smoky woods for formal evenings.",
    notes: {
      top: ["Mandarin", "Clove"],
      heart: ["Amber", "Rosewood"],
      base: ["Patchouli", "Dry Cedar"],
    },
    images: [galleryDetail, galleryWide, velvetAmber],
  },
  {
    id: "prd-005",
    slug: "citrus-memoir",
    name: "Citrus Memoir",
    family: "Citrus · Neroli · Musk",
    gender: "male",
    collection: "Daily",
    concentration: "EDP",
    sizeMl: 100,
    price: 16800,
    compareAt: 18600,
    outOfStock: false,
    featured: false,
    rating: 4.5,
    reviewCount: 120,
    launchYear: 2023,
    mood: "Bright and refined",
    story: "A textured citrus perfume that remains calm and polished from morning to evening.",
    notes: {
      top: ["Bergamot", "Grapefruit"],
      heart: ["Neroli", "Petitgrain"],
      base: ["White Musk", "Ambrette"],
    },
    images: [heroPoster, galleryDetail, boutiqueInterior],
  },
  {
    id: "prd-006",
    slug: "iris-suede",
    name: "Iris Suede",
    family: "Iris · Leather · Powder",
    gender: "female",
    collection: "Signature",
    concentration: "Extrait",
    sizeMl: 50,
    price: 25200,
    compareAt: 27900,
    outOfStock: false,
    featured: true,
    rating: 4.9,
    reviewCount: 82,
    launchYear: 2025,
    mood: "Elegant and tactile",
    story:
      "Iris Suede contrasts powdery iris petals with soft leather, creating a finely tailored floral wood scent.",
    notes: {
      top: ["Aldehydes", "Carrot Seed"],
      heart: ["Iris Butter", "Violet"],
      base: ["Suede", "Sandalwood", "Musk"],
    },
    images: [noirOud, boutiqueInterior, velvetAmber],
  },
  {
    id: "prd-007",
    slug: "cedar-atelier",
    name: "Cedar Atelier",
    family: "Cedar · Incense · Pepper",
    gender: "male",
    collection: "Limited",
    concentration: "Parfum",
    sizeMl: 75,
    price: 24300,
    compareAt: 27100,
    outOfStock: true,
    featured: false,
    rating: 4.6,
    reviewCount: 41,
    launchYear: 2022,
    mood: "Architectural and dry",
    story: "Incense and black pepper sharpen a dry cedar profile that wears with crisp precision.",
    notes: {
      top: ["Black Pepper", "Juniper"],
      heart: ["Cedar Atlas", "Incense"],
      base: ["Papyrus", "Musk"],
    },
    images: [santalReserve, heroPoster, galleryWide],
  },
  {
    id: "prd-008",
    slug: "rose-nocturne",
    name: "Rose Nocturne",
    family: "Rose · Oud · Patchouli",
    gender: "female",
    collection: "Evening",
    concentration: "Extrait",
    sizeMl: 50,
    price: 26100,
    compareAt: 28600,
    outOfStock: false,
    featured: false,
    rating: 4.8,
    reviewCount: 73,
    launchYear: 2026,
    mood: "Velvet floral depth",
    story:
      "Rose Nocturne is built around Turkish rose and polished oud, finished with earthy patchouli.",
    notes: {
      top: ["Damask Rose", "Pink Pepper"],
      heart: ["Turkish Rose", "Saffron"],
      base: ["Oud", "Patchouli", "Amber"],
    },
    images: [velvetAmber, galleryWide, galleryDetail],
  },
  {
    id: "prd-009",
    slug: "marine-velour",
    name: "Marine Velour",
    family: "Sea Salt · Fig · Ambergris",
    gender: "male",
    collection: "Signature",
    concentration: "EDP",
    sizeMl: 100,
    price: 18900,
    compareAt: 20500,
    outOfStock: false,
    featured: false,
    rating: 4.4,
    reviewCount: 58,
    launchYear: 2022,
    mood: "Airy with soft mineral warmth",
    story:
      "Marine Velour captures sea wind and ripe fig, then dries down to mineral amber and creamy woods.",
    notes: {
      top: ["Sea Salt", "Mandarin"],
      heart: ["Fig", "Violet"],
      base: ["Ambergris", "Driftwood"],
    },
    images: [galleryDetail, heroPoster, santalReserve],
  },
];

export const dashboardSeedProducts = products.slice(0, 6);

export const dashboardSeedOrders: OrderRecord[] = [
  {
    id: "ORD-24031",
    customer: "Mariam Shah",
    city: "Peshawar",
    items: 2,
    total: 42800,
    placedAt: "2026-08-17T11:24:00.000Z",
    status: "processing",
  },
  {
    id: "ORD-24032",
    customer: "Areeb Khan",
    city: "Islamabad",
    items: 1,
    total: 23800,
    placedAt: "2026-08-18T14:55:00.000Z",
    status: "shipped",
  },
  {
    id: "ORD-24033",
    customer: "Sana Qureshi",
    city: "Lahore",
    items: 3,
    total: 60100,
    placedAt: "2026-08-19T09:40:00.000Z",
    status: "pending",
  },
  {
    id: "ORD-24034",
    customer: "Hamza Wali",
    city: "Karachi",
    items: 1,
    total: 19600,
    placedAt: "2026-08-20T17:06:00.000Z",
    status: "delivered",
  },
  {
    id: "ORD-24035",
    customer: "Hina Fareed",
    city: "Peshawar",
    items: 2,
    total: 35700,
    placedAt: "2026-08-21T13:10:00.000Z",
    status: "cancelled",
  },
];

export const dashboardSeedPromos: PromoCode[] = [
  {
    id: "PRM-1",
    code: "SIGNATURE10",
    discountType: "percent",
    discountValue: 10,
    minOrder: 15000,
    validFrom: "2026-08-01",
    validTo: "2026-09-15",
    active: true,
  },
  {
    id: "PRM-2",
    code: "EVENING2500",
    discountType: "amount",
    discountValue: 2500,
    minOrder: 20000,
    validFrom: "2026-08-10",
    validTo: "2026-08-31",
    active: true,
  },
  {
    id: "PRM-3",
    code: "PAKWEEKEND",
    discountType: "percent",
    discountValue: 15,
    minOrder: 28000,
    validFrom: "2026-08-20",
    validTo: "2026-08-28",
    active: false,
  },
];

export const formatMoney = (value: number) => `PKR ${value.toLocaleString("en-PK")}`;

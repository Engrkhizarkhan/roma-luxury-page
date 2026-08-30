export type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

export type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  image?: MediaItem;
  active: boolean;
  sortOrder: number;
};

export type ProductItem = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  family: string;
  gender: "male" | "female" | "unisex";
  collection: string;
  collectionSlug: string;
  collectionId?: string;
  category: string;
  categorySlug: string;
  categoryId?: string;
  concentration: "EDT" | "EDP" | "Parfum" | "Extrait";
  sizeMl: number;
  price: number;
  compareAt?: number;
  stock: number;
  outOfStock: boolean;
  featured: boolean;
  newArrival: boolean;
  published: boolean;
  rating: number;
  reviewCount: number;
  launchYear: number;
  mood: string;
  story: string;
  seoTitle?: string;
  seoDescription?: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  media: MediaItem[];
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderRecord = {
  id: string;
  orderNumber: string;
  customer: string;
  email?: string;
  phone: string;
  city: string;
  address: string;
  postalCode?: string;
  note?: string;
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    image?: string;
    price: number;
    quantity: number;
    sizeMl: number;
    concentration: string;
  }>;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  promoCode?: string;
  placedAt: string;
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    changedAt: string;
    changedBy: string;
  }>;
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
  usageCount: number;
  usageLimit?: number;
};

export type ReturnCase = {
  id: string;
  orderId: string;
  orderNumber: string;
  customer: string;
  product: string;
  reason: string;
  requestedAt: string;
  amount: number;
  status: "requested" | "approved" | "received" | "refunded" | "rejected";
  condition: "Sealed" | "Opened" | "Courier damage";
  refundMethod: "Bank transfer" | "Store credit";
};

export type ContactRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "resolved";
  createdAt: string;
};

export type SiteSettings = {
  brandName: string;
  city: string;
  region: string;
  address: string;
  hours: string;
  email: string;
  phone: string;
  instagramUrl: string;
  mapUrl: string;
  siteTitle: string;
  siteDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroMediaType: "image" | "video";
  heroSoundEnabled: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  orderConfirmationMessage: string;
  home: {
    showHouse: boolean;
    showVisit: boolean;
    showCollection: boolean;
    showGallery: boolean;
    showCta: boolean;
    houseHeading: string;
    houseBody: string;
    visitHeading: string;
    visitBody: string;
    collectionHeading: string;
    collectionBody: string;
    galleryQuote: string;
    galleryBody: string;
    ctaHeading: string;
    ctaBody: string;
  };
  logo?: MediaItem;
  heroImage?: MediaItem;
  heroVideo?: MediaItem;
  visitImage?: MediaItem;
  galleryWideImage?: MediaItem;
  galleryDetailImage?: MediaItem;
};

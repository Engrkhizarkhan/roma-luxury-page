import { loadEnvConfig } from "@next/env";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import path from "node:path";
import { Product } from "../src/models/product";
import { Category, Collection } from "../src/models/taxonomy";
import { SiteSettingsModel } from "../src/models/site-settings";
import { Order } from "../src/models/order";
import { Promotion } from "../src/models/promotion";
import { ReturnCaseModel } from "../src/models/return-case";
import { ContactSubmission } from "../src/models/contact";

loadEnvConfig(process.cwd());
const required = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};
cloudinary.config({
  cloud_name: required("CLOUDINARY_CLOUD_NAME"),
  api_key: required("CLOUDINARY_API_KEY"),
  api_secret: required("CLOUDINARY_API_SECRET"),
  secure: true,
});

const collections = [
  {
    name: "Signature",
    slug: "signature",
    description: "The defining expressions of the SSAROMA house.",
    sortOrder: 1,
  },
  {
    name: "Evening",
    slug: "evening",
    description: "Fragrances with depth, warmth, and a measured evening trail.",
    sortOrder: 2,
  },
  {
    name: "Daily",
    slug: "daily",
    description: "Polished, versatile fragrances designed to live close to the skin.",
    sortOrder: 3,
  },
  {
    name: "Limited",
    slug: "limited",
    description: "Small, considered releases available for a limited time.",
    sortOrder: 4,
  },
];
const categories = [
  {
    name: "Oud & Resin",
    slug: "oud-resin",
    description: "Oud, incense, amber, and polished resins.",
    sortOrder: 1,
  },
  {
    name: "Woods",
    slug: "woods",
    description: "Sandalwood, cedar, vetiver, and dry woods.",
    sortOrder: 2,
  },
  {
    name: "Floral",
    slug: "floral",
    description: "Rose, iris, and tactile floral compositions.",
    sortOrder: 3,
  },
  {
    name: "Fresh",
    slug: "fresh",
    description: "Citrus, marine, green, and airy profiles.",
    sortOrder: 4,
  },
];
const products = [
  {
    slug: "noir-oud",
    name: "Noir Oud",
    sku: "SSA-NO-50",
    family: "Oud · Leather · Smoke",
    gender: "male",
    collection: "Evening",
    category: "Oud & Resin",
    concentration: "Extrait",
    sizeMl: 50,
    price: 23800,
    compareAt: 26500,
    stock: 14,
    featured: true,
    newArrival: true,
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
    media: ["noir-oud", "gallery-wide", "hero-poster"],
  },
  {
    slug: "velvet-amber",
    name: "Velvet Amber",
    sku: "SSA-VA-75",
    family: "Amber · Vanilla · Benzoin",
    gender: "female",
    collection: "Signature",
    category: "Oud & Resin",
    concentration: "Parfum",
    sizeMl: 75,
    price: 21400,
    compareAt: 24400,
    stock: 19,
    featured: true,
    newArrival: false,
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
    media: ["velvet-amber", "hero-poster", "gallery-detail"],
  },
  {
    slug: "santal-reserve",
    name: "Santal Reserve",
    sku: "SSA-SR-100",
    family: "Sandalwood · Cedar · Iris",
    gender: "unisex",
    collection: "Daily",
    category: "Woods",
    concentration: "EDP",
    sizeMl: 100,
    price: 19600,
    compareAt: 21600,
    stock: 11,
    featured: true,
    newArrival: false,
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
    media: ["santal-reserve", "boutique-interior", "noir-oud"],
  },
  {
    slug: "amber-dusk",
    name: "Amber Dusk",
    sku: "SSA-AD-50",
    family: "Amber · Spice · Woods",
    gender: "female",
    collection: "Evening",
    category: "Oud & Resin",
    concentration: "Parfum",
    sizeMl: 50,
    price: 22900,
    compareAt: 25600,
    stock: 8,
    featured: false,
    newArrival: false,
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
    media: ["gallery-detail", "gallery-wide", "velvet-amber"],
  },
  {
    slug: "citrus-memoir",
    name: "Citrus Memoir",
    sku: "SSA-CM-100",
    family: "Citrus · Neroli · Musk",
    gender: "unisex",
    collection: "Daily",
    category: "Fresh",
    concentration: "EDP",
    sizeMl: 100,
    price: 16800,
    compareAt: 18600,
    stock: 22,
    featured: false,
    newArrival: false,
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
    media: ["hero-poster", "gallery-detail", "boutique-interior"],
  },
  {
    slug: "iris-suede",
    name: "Iris Suede",
    sku: "SSA-IS-50",
    family: "Iris · Leather · Powder",
    gender: "female",
    collection: "Signature",
    category: "Floral",
    concentration: "Extrait",
    sizeMl: 50,
    price: 25200,
    compareAt: 27900,
    stock: 6,
    featured: true,
    newArrival: true,
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
    media: ["noir-oud", "boutique-interior", "velvet-amber"],
  },
  {
    slug: "cedar-atelier",
    name: "Cedar Atelier",
    sku: "SSA-CA-75",
    family: "Cedar · Incense · Pepper",
    gender: "male",
    collection: "Limited",
    category: "Woods",
    concentration: "Parfum",
    sizeMl: 75,
    price: 24300,
    compareAt: 27100,
    stock: 0,
    featured: false,
    newArrival: false,
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
    media: ["santal-reserve", "hero-poster", "gallery-wide"],
  },
  {
    slug: "rose-nocturne",
    name: "Rose Nocturne",
    sku: "SSA-RN-50",
    family: "Rose · Oud · Patchouli",
    gender: "female",
    collection: "Evening",
    category: "Floral",
    concentration: "Extrait",
    sizeMl: 50,
    price: 26100,
    compareAt: 28600,
    stock: 10,
    featured: false,
    newArrival: true,
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
    media: ["velvet-amber", "gallery-wide", "gallery-detail"],
  },
  {
    slug: "marine-velour",
    name: "Marine Velour",
    sku: "SSA-MV-100",
    family: "Sea Salt · Fig · Ambergris",
    gender: "unisex",
    collection: "Signature",
    category: "Fresh",
    concentration: "EDP",
    sizeMl: 100,
    price: 18900,
    compareAt: 20500,
    stock: 13,
    featured: false,
    newArrival: false,
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
    media: ["gallery-detail", "hero-poster", "santal-reserve"],
  },
] as const;

async function main() {
  await mongoose.connect(required("MONGODB_URI"));
  const collectionMap = new Map<string, mongoose.Types.ObjectId>();
  for (const item of collections) {
    const doc = await Collection.findOneAndUpdate(
      { slug: item.slug },
      { $set: { ...item, active: true } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    collectionMap.set(item.name, doc._id);
  }
  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  for (const item of categories) {
    const doc = await Category.findOneAndUpdate(
      { slug: item.slug },
      { $set: { ...item, active: true } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    categoryMap.set(item.name, doc._id);
  }
  const assetNames = [...new Set(products.flatMap((p) => p.media))];
  const assets = new Map<string, any>();
  for (const name of assetNames) {
    const file = path.join(process.cwd(), "src", "assets", `${name}.jpg`);
    const uploaded = await cloudinary.uploader.upload(file, {
      public_id: `ssaroma/migration/${name}`,
      overwrite: true,
      resource_type: "image",
    });
    assets.set(name, {
      type: "image",
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      alt: "SSAROMA fragrance presentation",
      width: uploaded.width,
      height: uploaded.height,
      format: uploaded.format,
      bytes: uploaded.bytes,
    });
  }
  const productMap = new Map<string, any>();
  for (const item of products) {
    const media = item.media.map((name, index) => ({
      ...assets.get(name),
      alt: `${item.name} ${index === 0 ? "fragrance bottle" : `presentation ${index + 1}`}`,
      position: index,
    }));
    const product = await Product.findOneAndUpdate(
      { slug: item.slug },
      {
        $set: {
          ...item,
          collectionRef: collectionMap.get(item.collection),
          category: categoryMap.get(item.category),
          media,
          published: true,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );
    productMap.set(item.slug, product);
  }
  const hero = assets.get("hero-poster");
  const uploadedVideo = await cloudinary.uploader.upload(
    path.join(process.cwd(), "src", "assets", "gemini_generated_video_c9383871.mp4"),
    { public_id: "ssaroma/migration/hero-video", overwrite: true, resource_type: "video" },
  );
  const heroVideo = {
    type: "video",
    url: uploadedVideo.secure_url,
    publicId: uploadedVideo.public_id,
    alt: "SSAROMA boutique atmosphere",
    width: uploadedVideo.width,
    height: uploadedVideo.height,
    format: uploadedVideo.format,
    bytes: uploadedVideo.bytes,
  };
  await SiteSettingsModel.findOneAndUpdate(
    { key: "primary" },
    {
      $set: {
        key: "primary",
        brandName: "SSAROMA",
        brandDisplayType: "text",
        city: "Peshawar",
        region: "Khyber Pakhtunkhwa",
        address: "First Floor, Shop No. 4, MK Tower, Peshawar, Pakistan",
        hours: "Visit details available on request",
        email: "hello@ssaroma.com",
        phone: "",
        instagramUrl: "https://instagram.com/ssaroma",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=MK+Tower%2C+Peshawar",
        siteTitle: "SSAROMA | Fragrance Boutique in Peshawar",
        siteDescription:
          "Find your signature at SSAROMA, an intimate fragrance boutique in Peshawar for unhurried, guided scent discovery.",
        heroEyebrow: "Fragrance boutique · Peshawar",
        heroTitle: "The one they remember you by.",
        heroBody:
          "Discover your signature at SSAROMA — an intimate fragrance house where time, skin, and instinct make the final choice.",
        heroMediaType: "video",
        heroSoundEnabled: false,
        deliveryFee: 350,
        freeDeliveryThreshold: 20000,
        orderConfirmationMessage:
          "Your order has been received. Our team will call to confirm before dispatch.",
        home: {
          showHouse: true,
          showVisit: true,
          showCollection: true,
          showGallery: true,
          showCta: true,
          houseHeading: "You do not choose a signature in a hurry.",
          houseBody:
            "SSAROMA is built around the moment a fragrance stops smelling like a bottle and starts feeling like you. The selection is considered. The guidance is personal. The final decision is always yours.",
          visitHeading: "A room made for taking your time.",
          visitBody:
            "There is no pressure to know the language of perfumery. Come with a feeling, a memory or no idea at all. We will guide the rest.",
          collectionHeading: "Three distinct ways to be remembered.",
          collectionBody:
            "A first look at the SSAROMA edit. Explore the collection online, then visit to understand it on skin.",
          galleryQuote: "Find the fragrance people remember you by.",
          galleryBody:
            "The best fragrance does not announce itself. It becomes part of how people know you.",
          ctaHeading: "Your signature is waiting.",
          ctaBody:
            "Come in, take your time and leave with a fragrance that feels considered—not chosen in a rush.",
        },
        heroImage: hero,
        heroVideo,
        visitImage: assets.get("boutique-interior"),
        galleryWideImage: assets.get("gallery-wide"),
        galleryDetailImage: assets.get("gallery-detail"),
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );

  const daysAgo = (days: number, hour = 12) => {
    const value = new Date();
    value.setDate(value.getDate() - days);
    value.setHours(hour, 0, 0, 0);
    return value;
  };
  const demoOrders = [
    {
      orderNumber: "SSA-DEMO-1001",
      customer: { name: "Areeba Khan", email: "areeba@example.com", phone: "+92 300 1112233" },
      address: {
        street: "House 18, Street 4, Hayatabad Phase 3",
        city: "Peshawar",
        postalCode: "25100",
      },
      note: "Please call before delivery.",
      lines: [{ slug: "velvet-amber", quantity: 1 }],
      status: "pending",
      placedAt: daysAgo(0, 10),
      discount: 0,
      promoCode: "",
    },
    {
      orderNumber: "SSA-DEMO-1002",
      customer: { name: "Hamza Shah", email: "hamza@example.com", phone: "+92 333 4455667" },
      address: { street: "University Town, Park Road", city: "Peshawar", postalCode: "25000" },
      note: "Gift wrap the fragrance, please.",
      lines: [
        { slug: "noir-oud", quantity: 1 },
        { slug: "citrus-memoir", quantity: 1 },
      ],
      status: "processing",
      placedAt: daysAgo(1, 15),
      discount: 1500,
      promoCode: "PESHAWAR1500",
    },
    {
      orderNumber: "SSA-DEMO-1003",
      customer: { name: "Mariam Ali", email: "mariam@example.com", phone: "+92 321 7788990" },
      address: { street: "Street 7, Cantonment", city: "Rawalpindi", postalCode: "46000" },
      note: "",
      lines: [{ slug: "iris-suede", quantity: 1 }],
      status: "shipped",
      placedAt: daysAgo(2, 11),
      discount: 2520,
      promoCode: "WELCOME10",
    },
    {
      orderNumber: "SSA-DEMO-1004",
      customer: { name: "Usman Tariq", email: "usman@example.com", phone: "+92 345 1122334" },
      address: { street: "F-10 Markaz, Street 12", city: "Islamabad", postalCode: "44000" },
      note: "Leave with reception if unavailable.",
      lines: [{ slug: "santal-reserve", quantity: 1 }],
      status: "delivered",
      placedAt: daysAgo(4, 9),
      discount: 0,
      promoCode: "",
    },
    {
      orderNumber: "SSA-DEMO-1005",
      customer: { name: "Sana Noor", email: "sana@example.com", phone: "+92 312 5566778" },
      address: { street: "Gulberg III, Block C", city: "Lahore", postalCode: "54660" },
      note: "",
      lines: [
        { slug: "rose-nocturne", quantity: 1 },
        { slug: "marine-velour", quantity: 1 },
      ],
      status: "delivered",
      placedAt: daysAgo(7, 14),
      discount: 1500,
      promoCode: "PESHAWAR1500",
    },
    {
      orderNumber: "SSA-DEMO-1006",
      customer: { name: "Bilal Ahmed", email: "bilal@example.com", phone: "+92 304 9988776" },
      address: { street: "Saddar Road, Near Mall", city: "Peshawar", postalCode: "25000" },
      note: "Customer requested cancellation before packing.",
      lines: [{ slug: "amber-dusk", quantity: 1 }],
      status: "cancelled",
      placedAt: daysAgo(9, 16),
      discount: 0,
      promoCode: "",
    },
  ] as const;

  const seededOrders = new Map<string, any>();
  for (const demo of demoOrders) {
    const items = demo.lines.map((line) => {
      const product = productMap.get(line.slug);
      if (!product) throw new Error(`Seed product ${line.slug} was not created.`);
      return {
        product: product._id,
        name: product.name,
        slug: product.slug,
        image: product.media?.[0]?.url,
        price: product.price,
        quantity: line.quantity,
        sizeMl: product.sizeMl,
        concentration: product.concentration,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 20000 ? 0 : 350;
    const path =
      demo.status === "delivered"
        ? ["pending", "processing", "shipped", "delivered"]
        : demo.status === "shipped"
          ? ["pending", "processing", "shipped"]
          : demo.status === "processing"
            ? ["pending", "processing"]
            : demo.status === "cancelled"
              ? ["pending", "cancelled"]
              : ["pending"];
    const statusHistory = path.map((status, index) => ({
      status,
      changedAt: new Date(demo.placedAt.getTime() + index * 8 * 60 * 60 * 1000),
      changedBy: index === 0 ? "storefront" : "demo.admin",
    }));
    const order = await Order.findOneAndUpdate(
      { orderNumber: demo.orderNumber },
      {
        $set: {
          customer: demo.customer,
          address: demo.address,
          note: demo.note,
          items,
          subtotal,
          deliveryFee,
          discount: demo.discount,
          total: subtotal + deliveryFee - demo.discount,
          promoCode: demo.promoCode || undefined,
          status: demo.status,
          statusHistory,
          createdAt: demo.placedAt,
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true, runValidators: true },
    );
    seededOrders.set(demo.orderNumber, order);
  }

  const now = new Date();
  await Promotion.findOneAndUpdate(
    { code: "WELCOME10" },
    {
      $set: {
        discountType: "percent",
        discountValue: 10,
        minOrder: 15000,
        validFrom: daysAgo(30),
        validTo: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        active: true,
        usageCount: 1,
        usageLimit: 100,
      },
    },
    { upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  await Promotion.findOneAndUpdate(
    { code: "PESHAWAR1500" },
    {
      $set: {
        discountType: "amount",
        discountValue: 1500,
        minOrder: 20000,
        validFrom: daysAgo(14),
        validTo: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        active: true,
        usageCount: 2,
        usageLimit: 50,
      },
    },
    { upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  const returnedOrder = seededOrders.get("SSA-DEMO-1004");
  const returnedProduct = productMap.get("santal-reserve");
  await ReturnCaseModel.findOneAndUpdate(
    { returnNumber: "RET-DEMO-1001" },
    {
      $set: {
        order: returnedOrder._id,
        product: returnedProduct._id,
        productName: returnedProduct.name,
        customerName: returnedOrder.customer.name,
        reason: "The sealed box arrived with a dent on one corner.",
        amount: returnedProduct.price,
        status: "approved",
        condition: "Courier damage",
        refundMethod: "Bank transfer",
        createdAt: daysAgo(2, 13),
      },
    },
    { upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  const demoContacts = [
    {
      name: "Zoya Rehman",
      email: "zoya@example.com",
      phone: "+92 301 2233445",
      subject: "Private fragrance consultation",
      message: "I would like to arrange a guided visit for two people this weekend.",
      status: "new",
      createdAt: daysAgo(0, 9),
    },
    {
      name: "Fahad Malik",
      email: "fahad@example.com",
      phone: "+92 322 3344556",
      subject: "Noir Oud availability",
      message: "Could you confirm whether Noir Oud is available for collection today?",
      status: "read",
      createdAt: daysAgo(1, 12),
    },
    {
      name: "Hira Saeed",
      email: "hira@example.com",
      phone: "",
      subject: "Corporate gifting",
      message: "Please share options for twelve individually wrapped gifts.",
      status: "resolved",
      createdAt: daysAgo(5, 10),
    },
  ] as const;
  for (const contact of demoContacts) {
    await ContactSubmission.findOneAndUpdate(
      { email: contact.email, subject: contact.subject },
      { $set: contact },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }
  console.log(
    `Seeded ${products.length} products, ${demoOrders.length} orders, ${collections.length} collections, ${categories.length} categories, promotions, a return, and enquiries.`,
  );
  await mongoose.disconnect();
}
main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exitCode = 1;
});

import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { Admin } from "../src/models/admin";
import { ContactSubmission } from "../src/models/contact";
import { Order } from "../src/models/order";
import { Product } from "../src/models/product";
import { Promotion } from "../src/models/promotion";
import { ReturnCaseModel } from "../src/models/return-case";
import { SiteSettingsModel } from "../src/models/site-settings";
import { Category, Collection } from "../src/models/taxonomy";

loadEnvConfig(process.cwd());

const mongodbUri = process.env.MONGODB_URI?.trim();
if (!mongodbUri) throw new Error("Missing MONGODB_URI");

type Finding = { severity: "error" | "warning"; message: string };
const findings: Finding[] = [];
const error = (message: string) => findings.push({ severity: "error", message });
const warning = (message: string) => findings.push({ severity: "warning", message });

async function duplicates(model: mongoose.Model<any>, field: string) {
  return model.aggregate([
    { $match: { [field]: { $type: "string", $ne: "" } } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);
}

async function main() {
  await mongoose.connect(mongodbUri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10_000,
  });
  await mongoose.connection.db?.admin().ping();

  const [
    productCount,
    orderCount,
    promotionCount,
    returnCount,
    contactCount,
    categoryCount,
    collectionCount,
    adminCount,
    settingsCount,
  ] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Promotion.countDocuments(),
    ReturnCaseModel.countDocuments(),
    ContactSubmission.countDocuments(),
    Category.countDocuments(),
    Collection.countDocuments(),
    Admin.countDocuments(),
    SiteSettingsModel.countDocuments(),
  ]);

  const counts = {
    products: productCount,
    orders: orderCount,
    promotions: promotionCount,
    returns: returnCount,
    contacts: contactCount,
    categories: categoryCount,
    collections: collectionCount,
    admins: adminCount,
    settings: settingsCount,
  };

  for (const [model, field] of [
    [Product, "slug"],
    [Product, "sku"],
    [Order, "orderNumber"],
    [Promotion, "code"],
    [Category, "slug"],
    [Collection, "slug"],
  ] as const) {
    const values = await duplicates(model, field);
    if (values.length) error(`${model.modelName}.${field} contains ${values.length} duplicate value(s).`);
  }

  const products = await Product.find({}).lean();
  const categoryIds = new Set((await Category.find({}).select("_id").lean()).map((item) => String(item._id)));
  const collectionIds = new Set((await Collection.find({}).select("_id").lean()).map((item) => String(item._id)));
  const productIds = new Set(products.map((item) => String(item._id)));

  for (const product of products) {
    const label = `${product.name} (${product.slug})`;
    if (!categoryIds.has(String(product.category))) error(`${label} references a missing category.`);
    if (!collectionIds.has(String(product.collectionRef))) error(`${label} references a missing collection.`);
    if (product.published && !(product.media || []).some((item: any) => item.type === "image"))
      warning(`${label} is published without an image.`);
    if ((product.media || []).some((item: any) => !/^https:\/\//.test(item.url || "")))
      error(`${label} contains media without a valid HTTPS URL.`);
    if (new Set((product.media || []).map((item: any) => item.type)).size > 1)
      error(`${label} mixes image and video media.`);
    if (product.compareAt != null && product.compareAt < product.price)
      warning(`${label} has a compare-at price below its selling price.`);
  }

  const orders = await Order.find({}).lean();
  for (const order of orders) {
    const itemSubtotal = (order.items || []).reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    if (itemSubtotal !== order.subtotal)
      error(`${order.orderNumber} subtotal is ${order.subtotal}, expected ${itemSubtotal}.`);
    const expectedTotal = Math.max(0, order.subtotal + order.deliveryFee - order.discount);
    if (expectedTotal !== order.total)
      error(`${order.orderNumber} total is ${order.total}, expected ${expectedTotal}.`);
    for (const item of order.items || []) {
      if (!productIds.has(String(item.product)))
        warning(`${order.orderNumber} references a product that no longer exists (${item.name}).`);
    }
  }

  const returns = await ReturnCaseModel.find({}).select("returnNumber order product amount").lean();
  const orderIds = new Set(orders.map((item) => String(item._id)));
  for (const item of returns) {
    if (!orderIds.has(String(item.order))) error(`${item.returnNumber} references a missing order.`);
    if (!productIds.has(String(item.product))) error(`${item.returnNumber} references a missing product.`);
  }

  const promotions = await Promotion.find({}).lean();
  for (const promotion of promotions) {
    if (promotion.validTo < promotion.validFrom)
      error(`${promotion.code} ends before its start date.`);
    if (promotion.discountType === "percent" && promotion.discountValue > 100)
      error(`${promotion.code} has a percentage discount above 100%.`);
  }

  const settings = await SiteSettingsModel.findOne({ key: "primary" }).lean();
  if (settingsCount !== 1) warning(`Expected one site-settings record; found ${settingsCount}.`);
  if (!settings) error("Primary site settings are missing.");
  if (settings && !["image", "video"].includes(settings.heroMediaType))
    error("Primary site settings have an invalid hero media type.");

  console.log(JSON.stringify({ ok: !findings.some((item) => item.severity === "error"), counts, findings }, null, 2));
  if (findings.some((item) => item.severity === "error")) process.exitCode = 1;
}

main()
  .catch((caught) => {
    console.error(caught instanceof Error ? caught.message : caught);
    process.exitCode = 1;
  })
  .finally(async () => mongoose.disconnect());

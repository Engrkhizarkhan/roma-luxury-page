import "server-only";

import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/product";
import { Order } from "@/models/order";
import { Promotion } from "@/models/promotion";
import { ReturnCaseModel } from "@/models/return-case";
import { ContactSubmission } from "@/models/contact";
import { getProducts, getTaxonomy } from "@/services/catalog";
import { getSiteSettings } from "@/services/settings";
import type { ContactRecord, OrderRecord, PromoCode, ReturnCase } from "@/types/domain";

const idOf = (value: any) => String(value?._id ?? value ?? "");

export function serializeOrder(order: any): OrderRecord {
  return {
    id: idOf(order),
    orderNumber: order.orderNumber,
    customer: order.customer.name,
    email: order.customer.email || "",
    phone: order.customer.phone,
    city: order.address.city,
    address: order.address.street,
    postalCode: order.address.postalCode || "",
    note: order.note || "",
    items: (order.items || []).map((item: any) => ({
      productId: idOf(item.product),
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      sizeMl: item.sizeMl,
      concentration: item.concentration,
    })),
    itemCount: (order.items || []).reduce((sum: number, item: any) => sum + item.quantity, 0),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    discount: order.discount,
    total: order.total,
    promoCode: order.promoCode || "",
    placedAt: new Date(order.createdAt).toISOString(),
    status: order.status,
    statusHistory: (order.statusHistory || []).map((event: any) => ({
      status: event.status,
      changedAt: new Date(event.changedAt).toISOString(),
      changedBy: event.changedBy || "system",
    })),
  };
}

export function serializePromotion(promo: any): PromoCode {
  return {
    id: idOf(promo),
    code: promo.code,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    minOrder: promo.minOrder,
    validFrom: new Date(promo.validFrom).toISOString(),
    validTo: new Date(promo.validTo).toISOString(),
    active: promo.active,
    usageCount: promo.usageCount || 0,
    usageLimit: promo.usageLimit,
  };
}

export function serializeReturnCase(item: any): ReturnCase {
  return {
    id: idOf(item),
    orderId: idOf(item.order),
    orderNumber: item.order?.orderNumber || "",
    customer: item.customerName,
    product: item.productName,
    reason: item.reason,
    requestedAt: new Date(item.createdAt).toISOString(),
    amount: item.amount,
    status: item.status,
    condition: item.condition,
    refundMethod: item.refundMethod,
  };
}

export function serializeContact(item: any): ContactRecord {
  return {
    id: idOf(item),
    name: item.name,
    email: item.email,
    phone: item.phone || "",
    subject: item.subject,
    message: item.message,
    status: item.status,
    createdAt: new Date(item.createdAt).toISOString(),
  };
}

export async function getDashboardData() {
  await connectToDatabase();
  const [
    products,
    ordersRaw,
    promosRaw,
    returnsRaw,
    contactsRaw,
    categories,
    collections,
    settings,
  ] = await Promise.all([
    getProducts(),
    Order.find({}).sort({ createdAt: -1 }).limit(500).lean(),
    Promotion.find({}).sort({ createdAt: -1 }).lean(),
    ReturnCaseModel.find({}).populate("order", "orderNumber").sort({ createdAt: -1 }).lean(),
    ContactSubmission.find({}).sort({ createdAt: -1 }).limit(500).lean(),
    getTaxonomy("category"),
    getTaxonomy("collection"),
    getSiteSettings(),
  ]);
  const orders = ordersRaw.map(serializeOrder);
  const delivered = orders.filter((order) => order.status === "delivered");
  const revenue = delivered.reduce((sum, order) => sum + order.total, 0);
  return {
    products,
    orders,
    promotions: promosRaw.map(serializePromotion),
    returns: returnsRaw.map(serializeReturnCase),
    contacts: contactsRaw.map(serializeContact),
    categories,
    collections,
    settings,
    metrics: {
      revenue,
      orderCount: orders.length,
      averageOrder: delivered.length ? Math.round(revenue / delivered.length) : 0,
      delivered: delivered.length,
      dispatchQueue: orders.filter((order) =>
        ["pending", "processing", "shipped"].includes(order.status),
      ).length,
      productCount: await Product.countDocuments(),
      lowStock: await Product.countDocuments({ stock: { $lte: 5 } }),
    },
  };
}

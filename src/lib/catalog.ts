import type { MediaItem, OrderRecord, ProductItem, PromoCode, ReturnCase } from "@/types/domain";

export type { MediaItem as ProductMediaItem, OrderRecord, ProductItem, PromoCode, ReturnCase };
export const formatMoney = (value: number) => `PKR ${Math.round(value).toLocaleString("en-PK")}`;
export const getProductMedia = (product: ProductItem): MediaItem[] => product.media;

import Image from "next/image";
import type { ProductItem } from "@/types/domain";

export function ProductCardPreview({
  product,
  eager = false,
  square = false,
}: {
  product: ProductItem;
  eager?: boolean;
  square?: boolean;
}) {
  const images = product.media.filter((item) => item.type === "image");
  const videos = product.media.filter((item) => item.type === "video");
  const [first, second] = images;
  const video = videos[0];

  return (
    <div
      className={`product-card-media relative overflow-hidden bg-[#e8e2d7] ${square ? "aspect-square" : "aspect-[4/5]"}`}
    >
      {video ? (
        <video
          src={video.url}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          aria-label={`${product.name} fragrance presentation`}
          className="h-full w-full object-cover"
        />
      ) : first ? (
        <Image
          src={first.url}
          alt={first.alt || `${product.name} fragrance bottle`}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes={square ? "160px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw"}
          className="product-card-image-primary object-cover"
        />
      ) : (
        <span className="editorial-kicker text-ink/35 absolute inset-0 flex items-center justify-center">
          Media coming soon
        </span>
      )}
      {second ? (
        <Image
          src={second.url}
          alt={second.alt || `${product.name} alternate presentation`}
          fill
          sizes={square ? "160px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw"}
          className="product-card-image-secondary object-cover opacity-0"
        />
      ) : null}
      {product.outOfStock ? (
        <span className="editorial-kicker bg-ink/85 text-cream absolute top-3 left-3 px-3 py-2">
          Unavailable
        </span>
      ) : null}
    </div>
  );
}

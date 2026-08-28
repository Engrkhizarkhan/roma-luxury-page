import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { getProductMedia, type ProductItem } from "@/lib/catalog";

type ProductMediaCarouselProps = {
  product: ProductItem;
  imageClassName?: string;
  priority?: boolean;
};

export function ProductMediaCarousel({
  product,
  imageClassName = "aspect-[4/5]",
  priority = false,
}: ProductMediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef<number | null>(null);
  const width = useRef(1);
  const suppressClick = useRef(false);
  const media = getProductMedia(product);
  const hasGallery = media.length > 1;

  const goTo = (index: number) => {
    const bounded = (index + media.length) % media.length;
    setActiveIndex(bounded);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasGallery) return;
    startX.current = event.clientX;
    width.current = event.currentTarget.clientWidth;
    suppressClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const offset = event.clientX - startX.current;
    setDragOffset(offset);
    if (Math.abs(offset) > 8) suppressClick.current = true;
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const offset = event.clientX - startX.current;
    const threshold = Math.min(70, width.current * 0.16);

    if (offset < -threshold) goTo(activeIndex + 1);
    if (offset > threshold) goTo(activeIndex - 1);
    startX.current = null;
    setDragOffset(0);

    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
  };

  return (
    <div
      className="group/media relative overflow-hidden bg-[#e8e2d7] touch-pan-y select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClickCapture={(event) => {
        if (suppressClick.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goTo(activeIndex - 1);
        if (event.key === "ArrowRight") goTo(activeIndex + 1);
      }}
    >
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        aria-label={`View ${product.name}`}
        className={hasGallery ? "block cursor-grab active:cursor-grabbing" : "block"}
      >
        <div
          className="flex will-change-transform"
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
            transition:
              startX.current === null ? "transform 480ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        >
          {media.map((item, index) =>
            item.type === "video" ? (
              <video
                key={item.id}
                src={item.src}
                className={`${imageClassName} w-full shrink-0 object-cover`}
                muted
                playsInline
                loop
                autoPlay={activeIndex === index}
                preload="metadata"
                aria-label={`${product.name} product video ${index + 1}`}
                draggable={false}
              />
            ) : (
              <img
                key={item.id}
                src={item.src}
                alt={
                  index === 0
                    ? `${product.name} fragrance bottle`
                    : `${product.name} presentation ${index + 1}`
                }
                className={`${imageClassName} w-full shrink-0 object-cover`}
                width={1200}
                height={1500}
                loading={priority && index === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            ),
          )}
        </div>
      </Link>

      {hasGallery ? (
        <>
          <div
            className="absolute right-3 bottom-3 flex items-center gap-1.5 bg-ink/84 px-2.5 py-2"
            aria-label={`Media ${activeIndex + 1} of ${media.length}`}
          >
            {media.map((item, index) => (
              <button
                key={`${item.id}-dot`}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-1.5 transition-all ${activeIndex === index ? "w-5 bg-gold" : "w-1.5 bg-cream/55"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

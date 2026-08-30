"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import boutiqueInterior from "@/assets/boutique-interior.jpg";
import galleryDetail from "@/assets/gallery-detail.jpg";
import galleryWide from "@/assets/gallery-wide.jpg";
import { LINKS, MAP_EMBED_URL } from "@/lib/ssaroma";
import type { ProductItem, SiteSettings } from "@/types/domain";
import { Reveal, RevealImage } from "./Reveal";

const HOUSE_PRINCIPLES = [
  ["01", "We listen", "To what you wear, what you avoid and how you want to be remembered."],
  ["02", "You wear", "Fragrance is tested on skin—not chosen from a strip or a screen."],
  [
    "03",
    "Time decides",
    "You leave it to settle, then return to the scent that still feels right.",
  ],
] as const;

export function Statement({ settings }: { settings: SiteSettings }) {
  return (
    <section id="house" className="bg-cream text-ink py-28 md:py-44">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="border-ink/18 flex items-center justify-between border-b pb-7">
            <span className="editorial-kicker text-ink/52">The House</span>
            <span className="font-display text-ink/48 text-lg italic">Peshawar, Pakistan</span>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-8 lg:col-span-7 lg:col-start-2">
            <h2 className="font-display max-w-[11ch] text-[3rem] leading-[0.98] font-light tracking-[-0.03em] sm:text-[4.25rem] md:text-[5.4rem]">
              {settings.home.houseHeading}
            </h2>
          </Reveal>

          <Reveal delay={0.12} className="md:col-span-4 md:self-end lg:col-span-3 lg:col-start-10">
            <p className="text-ink/68 text-[0.95rem] leading-[1.9]">{settings.home.houseBody}</p>
          </Reveal>
        </div>

        <div className="mt-24 grid border-y border-ink/18 md:mt-36 md:grid-cols-3">
          {HOUSE_PRINCIPLES.map(([number, title, copy], index) => (
            <Reveal
              key={title}
              delay={index * 0.08}
              className="border-ink/18 py-8 md:border-l md:px-8 md:first:border-l-0 lg:px-10"
            >
              <div className="flex gap-5">
                <span className="editorial-kicker text-gold pt-1">{number}</span>
                <div>
                  <h3 className="font-display text-2xl font-light">{title}</h3>
                  <p className="text-ink/58 mt-3 max-w-[19rem] text-sm leading-[1.75]">{copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const RITUAL = [
  ["Arrive", "Tell us where you are going, what you wear now, or simply what you never want."],
  ["Discover", "We narrow the room to a few fragrances with the right character and presence."],
  ["Live with it", "Wear the final choices on skin. Let warmth, time and memory do their work."],
] as const;

export function Experience({ settings }: { settings: SiteSettings }) {
  return (
    <section id="ritual" className="bg-ink text-cream py-28 md:py-44">
      <div className="mx-auto grid max-w-[1480px] gap-16 px-5 sm:px-8 md:grid-cols-12 md:items-center lg:px-12">
        <RevealImage className="img-frame md:col-span-6 lg:col-span-5 lg:col-start-2">
          <Image
            src={settings.visitImage?.url || boutiqueInterior}
            alt={
              settings.visitImage?.alt ||
              "An intimate fragrance boutique lined with dark wood and warmly lit bottles"
            }
            width={1408}
            height={1760}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </RevealImage>

        <div className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
          <Reveal>
            <p className="editorial-kicker text-gold">The visit</p>
            <h2 className="font-display mt-7 text-[3rem] leading-[0.98] font-light tracking-[-0.025em] sm:text-[4rem] md:text-[4.7rem]">
              {settings.home.visitHeading}
            </h2>
            <p className="text-cream/64 mt-8 max-w-md text-[0.95rem] leading-[1.9]">
              {settings.home.visitBody}
            </p>
          </Reveal>

          <div className="mt-12 border-b border-cream/16">
            {RITUAL.map(([title, copy], index) => (
              <Reveal key={title} delay={index * 0.08}>
                <div className="grid grid-cols-[2rem_1fr] gap-4 border-t border-cream/16 py-6">
                  <span className="editorial-kicker text-gold/80 pt-1">0{index + 1}</span>
                  <div>
                    <h3 className="font-display text-cream text-2xl font-light">{title}</h3>
                    <p className="text-cream/52 mt-2 text-sm leading-[1.75]">{copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Collection({
  products,
  settings,
}: {
  products: ProductItem[];
  settings: SiteSettings;
}) {
  return (
    <section id="collection" className="bg-offwhite text-ink py-28 md:py-44">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="border-ink/18 grid gap-9 border-b pb-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7 lg:col-start-2">
              <p className="editorial-kicker text-gold">The fragrance edit</p>
              <h2 className="font-display mt-6 max-w-[13ch] text-[3rem] leading-[1] font-light tracking-[-0.025em] sm:text-[4.1rem] md:text-[4.8rem]">
                {settings.home.collectionHeading}
              </h2>
            </div>
            <p className="text-ink/58 max-w-sm text-sm leading-[1.8] md:col-span-3 md:col-start-10">
              {settings.home.collectionBody}
            </p>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col gap-28 md:mt-28 md:gap-40">
          {products.map((fragrance, index) => {
            const flipped = index === 1;
            return (
              <article
                key={fragrance.name}
                className="grid items-end gap-9 md:grid-cols-12 md:gap-12"
              >
                <RevealImage
                  className={[
                    "img-frame",
                    flipped
                      ? "md:col-span-5 md:col-start-8 md:row-start-1 lg:col-span-5 lg:col-start-7"
                      : index === 2
                        ? "md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-2"
                        : "md:col-span-7 lg:col-span-6 lg:col-start-2",
                  ].join(" ")}
                >
                  <a href={`/products/${fragrance.slug}`} aria-label={`View ${fragrance.name}`}>
                    {fragrance.images[0] ? (
                      <Image
                        src={fragrance.images[0]}
                        alt={`${fragrance.name} fragrance bottle`}
                        width={1200}
                        height={1504}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={[
                          "w-full object-cover",
                          index === 0 ? "aspect-[5/6]" : "aspect-[4/5]",
                        ].join(" ")}
                      />
                    ) : (
                      <div className="bg-cream aspect-[4/5] w-full" aria-hidden="true" />
                    )}
                  </a>
                </RevealImage>

                <Reveal
                  delay={0.12}
                  className={[
                    "md:pb-7",
                    flipped
                      ? "md:col-span-5 md:col-start-2 md:row-start-1 lg:col-span-3"
                      : "md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-9",
                  ].join(" ")}
                >
                  <div className="border-ink/18 flex items-center justify-between border-b pb-4">
                    <span className="editorial-kicker text-ink/42">0{index + 1}</span>
                    <span className="editorial-kicker text-gold">SSAROMA edit</span>
                  </div>
                  <h3 className="font-display mt-7 text-[2.7rem] leading-none font-light sm:text-[3.4rem]">
                    {fragrance.name}
                  </h3>
                  <p className="editorial-kicker text-ink/52 mt-5">{fragrance.family}</p>
                  <p className="text-ink/64 mt-7 max-w-sm text-[0.95rem] leading-[1.85]">
                    {fragrance.mood}
                  </p>
                  <a
                    href={`/products/${fragrance.slug}`}
                    className="link-underlined arrow-shift editorial-kicker text-ink hover:text-gold mt-9 inline-block transition-colors duration-300"
                  >
                    View fragrance{" "}
                    <span className="arrow ml-2" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </Reveal>
              </article>
            );
          })}
        </div>

        {products.length === 0 ? (
          <div className="border-ink/18 mt-20 border-y py-16 text-center">
            <p className="font-display text-3xl font-light">The online edit is being prepared.</p>
            <a
              href={`mailto:${settings.email}`}
              className="link-underlined editorial-kicker mt-6 inline-block"
            >
              Ask about current fragrances
            </a>
          </div>
        ) : null}

        <Reveal className="mt-28 border-t border-ink/18 pt-9 text-right md:mt-40">
          <a
            href={LINKS.store}
            className="link-underlined arrow-shift editorial-kicker text-ink hover:text-gold transition-colors duration-300"
          >
            Explore all fragrances{" "}
            <span className="arrow ml-2" aria-hidden="true">
              ↗
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Gallery({ settings }: { settings: SiteSettings }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section className="bg-ink text-cream pb-28 md:pb-44">
      <RevealImage className="w-full overflow-hidden">
        <div ref={ref} className="h-[52svh] min-h-[420px] w-full overflow-hidden md:h-[76svh]">
          <motion.img
            src={settings.galleryWideImage?.url || galleryWide.src}
            alt={
              settings.galleryWideImage?.alt ||
              "A line of fragrance bottles displayed along a dark wood and brass boutique shelf"
            }
            width={1920}
            height={1008}
            loading="lazy"
            className="h-[108%] w-full object-cover"
            {...(reduced ? {} : { style: { y } })}
          />
        </div>
      </RevealImage>

      <div className="mx-auto grid max-w-[1480px] gap-16 px-5 pt-24 sm:px-8 md:grid-cols-12 md:items-center md:pt-36 lg:px-12">
        <Reveal className="md:col-span-5 lg:col-span-4 lg:col-start-2">
          <p className="editorial-kicker text-gold">Leave an impression</p>
          <blockquote className="font-display mt-8 text-[2.8rem] leading-[1.03] font-light tracking-[-0.02em] sm:text-[3.6rem]">
            “{settings.home.galleryQuote}”
          </blockquote>
          <p className="text-cream/48 mt-8 max-w-sm text-sm leading-[1.8]">
            {settings.home.galleryBody}
          </p>
        </Reveal>

        <RevealImage className="img-frame md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
          <img
            src={settings.galleryDetailImage?.url || galleryDetail.src}
            alt={
              settings.galleryDetailImage?.alt ||
              "Perfume mist suspended in warm light beside an amber bottle"
            }
            width={1104}
            height={1408}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </RevealImage>
      </div>
    </section>
  );
}

export function FinalCta({ settings }: { settings: SiteSettings }) {
  return (
    <section id="visit" className="bg-cream text-ink py-28 md:py-44">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="border-ink/18 flex items-center justify-between border-b pb-7">
            <span className="editorial-kicker text-ink/52">Visit SSAROMA</span>
            <span className="editorial-kicker text-gold">Peshawar</span>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-7 lg:col-start-2">
            <h2 className="font-display max-w-[10ch] text-[3.5rem] leading-[0.94] font-light tracking-[-0.035em] sm:text-[5rem] md:text-[6.15rem]">
              {settings.home.ctaHeading}
            </h2>
            <p className="text-ink/64 mt-8 max-w-md text-[0.95rem] leading-[1.85]">
              {settings.home.ctaBody}
            </p>
          </Reveal>

          <Reveal
            delay={0.12}
            className="md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10"
          >
            <div className="border-y border-ink/18">
              <div className="py-6">
                <p className="editorial-kicker text-ink/42">Location</p>
                <p className="font-display mt-3 text-2xl font-light">{settings.address}</p>
              </div>
              <div className="border-t border-ink/18 py-6">
                <p className="editorial-kicker text-ink/42">In store</p>
                <p className="mt-3 text-sm leading-[1.75]">
                  Personal guidance · Skin testing · Time to decide
                </p>
              </div>
              <div className="border-t border-ink/18 py-6">
                <p className="editorial-kicker text-ink/42">Visit</p>
                <p className="mt-3 text-sm leading-[1.75]">{settings.hours}</p>
              </div>
            </div>

            <div className="mt-9 flex flex-col items-start gap-6">
              <a
                href={settings.mapUrl || LINKS.map}
                target="_blank"
                rel="noreferrer"
                className="bg-ink text-cream editorial-kicker hover:bg-gold hover:text-ink w-full px-8 py-4 text-center transition-colors duration-400"
              >
                Find the boutique ↗
              </a>
              <a
                href={LINKS.store}
                className="link-underlined arrow-shift editorial-kicker text-ink hover:text-gold transition-colors duration-300"
              >
                Browse before visiting{" "}
                <span className="arrow ml-2" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="border-ink/18 relative mt-20 overflow-hidden border bg-offwhite md:mt-28">
          <div className="border-ink/14 border-b px-5 py-5 md:absolute md:top-6 md:left-6 md:z-10 md:w-[330px] md:border md:bg-offwhite/95 md:px-6 md:py-6 md:shadow-2xl md:backdrop-blur-sm">
            <p className="editorial-kicker text-gold">SSAROMA boutique</p>
            <p className="font-display mt-3 text-2xl font-light">First Floor, Shop No. 4</p>
            <p className="text-ink/58 mt-2 text-sm leading-6">MK Tower · Peshawar</p>
            <a
              href={settings.mapUrl || LINKS.map}
              target="_blank"
              rel="noreferrer"
              className="link-underlined editorial-kicker mt-5 inline-block"
            >
              Open directions ↗
            </a>
          </div>
          <iframe
            src={MAP_EMBED_URL}
            title="Map showing SSAROMA at MK Tower, Peshawar"
            className="h-[390px] w-full border-0 md:h-[520px]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream pt-20 pb-9 md:pt-28">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="wordmark text-cream block text-[clamp(2.9rem,10.5vw,9.6rem)] leading-none tracking-[0.04em]"
          aria-label="Back to the top"
        >
          {settings.brandName}
        </a>

        <div className="border-cream/16 mt-14 grid gap-10 border-t pt-9 md:grid-cols-12 md:items-end">
          <p className="text-cream/46 max-w-sm text-sm leading-[1.75] md:col-span-4">
            An intimate fragrance house in {settings.city}, devoted to the art of finding your
            signature.
          </p>

          <nav
            className="flex flex-wrap gap-x-9 gap-y-5 md:col-span-6 md:col-start-7 md:justify-end"
            aria-label="Footer navigation"
          >
            <a
              href="#house"
              className="link-rule editorial-kicker text-cream/66 hover:text-gold transition-colors duration-300"
            >
              The House
            </a>
            <a
              href="#ritual"
              className="link-rule editorial-kicker text-cream/66 hover:text-gold transition-colors duration-300"
            >
              The Visit
            </a>
            <a
              href={LINKS.store}
              className="link-rule editorial-kicker text-cream/66 hover:text-gold transition-colors duration-300"
            >
              Fragrances ↗
            </a>
            <a
              href={settings.instagramUrl || LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              className="link-rule editorial-kicker text-cream/66 hover:text-gold transition-colors duration-300"
            >
              Instagram ↗
            </a>
            <a
              href="/contact"
              className="link-rule editorial-kicker text-cream/66 hover:text-gold transition-colors duration-300"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="text-cream/36 mt-12 flex flex-col gap-3 text-[0.7rem] tracking-[0.08em] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {settings.city} · {settings.region}
          </p>
          <p>
            © {year} {settings.brandName}
          </p>
        </div>
      </div>
    </footer>
  );
}

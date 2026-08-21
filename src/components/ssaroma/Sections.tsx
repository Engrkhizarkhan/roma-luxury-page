import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import boutiqueInterior from "@/assets/boutique-interior.jpg";
import galleryDetail from "@/assets/gallery-detail.jpg";
import galleryWide from "@/assets/gallery-wide.jpg";
import noirOud from "@/assets/noir-oud.jpg";
import santalReserve from "@/assets/santal-reserve.jpg";
import velvetAmber from "@/assets/velvet-amber.jpg";
import { LINKS, SHOP } from "@/lib/ssaroma";
import { Reveal, RevealImage } from "./Reveal";

/* ------------------------------- 3. STATEMENT ------------------------------ */

export function Statement() {
  return (
    <section id="house" className="bg-cream text-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex items-center gap-5">
            <span className="bg-gold h-px w-10" />
            <span className="label-eyebrow text-ink/55">The House</span>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-7">
            <h2 className="font-display text-[2.4rem] leading-[1.08] font-light tracking-[-0.01em] sm:text-5xl md:text-[3.9rem]">
              Fragrance is remembered
              <br />
              before it is understood.
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="md:col-span-4 md:col-start-9">
            <p className="text-ink/70 text-[0.95rem] leading-[1.9]">
              SSAroma is a small boutique built around one idea: a person should wear a scent that
              belongs to them. We keep a tight selection, we let you take your time, and we help you
              read the notes until one of them feels like yours.
            </p>
            <div className="bg-ink/15 mt-10 h-px w-full" />
            <p className="label-eyebrow text-ink/50 mt-6">Established in {SHOP.city}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ 4. COLLECTION ----------------------------- */

const FRAGRANCES = [
  {
    name: "Noir Oud",
    family: "Oud · Leather · Smoke",
    note: "Dense, resinous and quiet. Built for evenings and for people who stay in the memory.",
    image: noirOud,
    width: 1200,
    height: 1504,
  },
  {
    name: "Velvet Amber",
    family: "Amber · Vanilla · Benzoin",
    note: "Warm and skin-close. Softens through the day without ever disappearing.",
    image: velvetAmber,
    width: 1200,
    height: 1504,
  },
  {
    name: "Santal Reserve",
    family: "Sandalwood · Cedar · Iris",
    note: "Dry woods with a clean centre. The most wearable fragrance on our shelf.",
    image: santalReserve,
    width: 1200,
    height: 1504,
  },
] as const;

export function Collection() {
  return (
    <section id="collection" className="bg-offwhite text-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="border-ink/15 flex flex-wrap items-end justify-between gap-6 border-b pb-8">
            <div>
              <span className="label-eyebrow text-gold">Signature Collection</span>
              <h2 className="font-display mt-5 text-[2.2rem] leading-[1.1] font-light md:text-[3.2rem]">
                Three fragrances we
                <br className="hidden sm:block" /> keep recommending.
              </h2>
            </div>
            <a
              href={LINKS.store}
              className="link-underlined arrow-shift label-eyebrow text-ink hover:text-gold transition-colors duration-300"
            >
              Explore all fragrances <span className="arrow ml-2">→</span>
            </a>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-24 md:mt-24 md:gap-32">
          {FRAGRANCES.map((f, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={f.name}
                className="grid items-end gap-8 md:grid-cols-12 md:gap-12"
              >
                <RevealImage
                  className={[
                    "img-frame group",
                    flipped
                      ? "md:col-span-5 md:col-start-8 md:row-start-1"
                      : i === 2
                        ? "md:col-span-6"
                        : "md:col-span-7",
                  ].join(" ")}
                >
                  <a href={LINKS.store} aria-label={`View ${f.name}`} className="block">
                    <img
                      src={f.image}
                      alt={`${f.name} fragrance bottle`}
                      width={f.width}
                      height={f.height}
                      loading="lazy"
                      className={[
                        "w-full object-cover",
                        i === 1 ? "aspect-[4/5]" : i === 2 ? "aspect-[3/4]" : "aspect-[5/6]",
                      ].join(" ")}
                    />
                  </a>
                </RevealImage>

                <Reveal
                  delay={0.12}
                  className={[
                    "md:pb-6",
                    flipped ? "md:col-span-5 md:col-start-2 md:row-start-1" : "md:col-span-4 md:col-start-9",
                  ].join(" ")}
                >
                  <span className="label-eyebrow text-ink/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-4 text-[2rem] leading-tight font-light md:text-[2.6rem]">
                    {f.name}
                  </h3>
                  <p className="label-eyebrow text-gold mt-4">{f.family}</p>
                  <p className="text-ink/70 mt-6 max-w-sm text-[0.95rem] leading-[1.85]">{f.note}</p>
                  <a
                    href={LINKS.store}
                    className="link-underlined arrow-shift label-eyebrow text-ink hover:text-gold mt-8 inline-block transition-colors duration-300"
                  >
                    View fragrance <span className="arrow ml-2">→</span>
                  </a>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ 5. EXPERIENCE ----------------------------- */

const EXPERIENCE_LINES = [
  "Curated selection",
  "Guided discovery",
  "A considered in-store experience",
] as const;

export function Experience() {
  return (
    <section id="experience" className="bg-ink text-cream py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 md:grid-cols-12 md:gap-16 md:px-10">
        <RevealImage className="img-frame md:col-span-6">
          <img
            src={boutiqueInterior}
            alt="Interior of the SSAroma boutique, dark shelving lined with fragrance bottles"
            width={1408}
            height={1760}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </RevealImage>

        <div className="md:col-span-5 md:col-start-8">
          <Reveal>
            <span className="label-eyebrow text-gold">The SSAroma Experience</span>
            <h2 className="font-display mt-6 text-[2.3rem] leading-[1.08] font-light md:text-[3.4rem]">
              More than a shelf
              <br />
              of bottles.
            </h2>
            <p className="text-cream/65 mt-8 text-[0.95rem] leading-[1.9]">
              Come in and take your time. Compare notes side by side, wear two or three on skin, and
              let them settle before deciding. We will tell you honestly which one suits you — and
              which one does not.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12">
              {EXPERIENCE_LINES.map((line) => (
                <div key={line} className="border-cream/15 border-t py-5">
                  <span className="font-display text-cream/90 text-xl md:text-2xl">{line}</span>
                </div>
              ))}
              <div className="border-cream/15 border-t" />
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <a
              href={LINKS.map}
              target="_blank"
              rel="noreferrer"
              className="link-underlined arrow-shift label-eyebrow text-cream hover:text-gold mt-10 inline-block transition-colors duration-300"
            >
              Find the boutique <span className="arrow ml-2">→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- 6. GALLERY ------------------------------ */

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section className="bg-ink text-cream pb-28 md:pb-40">
      <RevealImage className="w-full overflow-hidden">
        <div ref={ref} className="h-[55svh] w-full overflow-hidden md:h-[80svh]">
          <motion.img
            src={galleryWide}
            alt="Rows of dark fragrance bottles on a brass-railed boutique shelf"
            width={1920}
            height={1008}
            loading="lazy"
            className="h-[112%] w-full object-cover"
            {...(reduced ? {} : { style: { y } })}
          />
        </div>
      </RevealImage>

      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 pt-24 md:grid-cols-12 md:gap-12 md:px-10 md:pt-32">
        <Reveal className="md:col-span-5 md:col-start-1">
          <span className="bg-gold block h-px w-10" />
          <p className="font-display mt-8 text-[1.9rem] leading-[1.25] font-light md:text-[2.7rem]">
            “Find the fragrance
            <br />
            people remember you by.”
          </p>
          <p className="label-eyebrow text-cream/45 mt-8">{SHOP.name} · {SHOP.city}</p>
        </Reveal>

        <RevealImage className="img-frame md:col-span-5 md:col-start-8">
          <img
            src={galleryDetail}
            alt="Perfume mist caught in warm light beside a glass bottle"
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

/* ------------------------------- 7. FINAL CTA ----------------------------- */

export function FinalCta() {
  return (
    <section id="visit" className="bg-cream text-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="max-w-3xl md:ml-[8%]">
            <span className="label-eyebrow text-gold">Visit</span>
            <h2 className="font-display mt-6 text-[2.6rem] leading-[1.05] font-light md:text-[4.4rem]">
              Your signature
              <br />
              is waiting.
            </h2>
            <p className="text-ink/70 mt-8 max-w-md text-[0.95rem] leading-[1.9]">
              Explore the collection online or experience SSAroma in person.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <a
                href={LINKS.store}
                className="bg-ink text-cream label-eyebrow hover:bg-gold hover:text-ink rounded-none px-9 py-4 text-center transition-colors duration-500"
              >
                Shop fragrances
              </a>
              <a
                href={LINKS.map}
                target="_blank"
                rel="noreferrer"
                className="border-ink/30 text-ink hover:border-gold hover:text-gold label-eyebrow rounded-none border px-9 py-4 text-center transition-colors duration-500"
              >
                Visit SSAroma
              </a>
            </div>

            <div className="border-ink/15 mt-16 grid gap-8 border-t pt-10 sm:grid-cols-3">
              <div>
                <p className="label-eyebrow text-ink/45">Address</p>
                <p className="mt-3 text-sm leading-relaxed">{SHOP.address}</p>
              </div>
              <div>
                <p className="label-eyebrow text-ink/45">Hours</p>
                <p className="mt-3 text-sm leading-relaxed">{SHOP.hours}</p>
              </div>
              <div>
                <p className="label-eyebrow text-ink/45">Phone</p>
                <p className="mt-3 text-sm leading-relaxed">{SHOP.phone}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------- 8. FOOTER ------------------------------- */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream pt-20 pb-10 md:pt-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="border-cream/15 flex flex-col gap-10 border-b pb-12 md:flex-row md:items-end md:justify-between">
          <a href="#top" className="font-display text-3xl tracking-[0.18em] md:text-4xl">
            SSAroma
          </a>
          <nav className="flex flex-wrap gap-x-10 gap-y-4">
            <a href={LINKS.store} className="link-rule label-eyebrow text-cream/70 hover:text-gold transition-colors duration-300">
              Collection
            </a>
            <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="link-rule label-eyebrow text-cream/70 hover:text-gold transition-colors duration-300">
              Instagram
            </a>
            <a href={LINKS.whatsapp} target="_blank" rel="noreferrer" className="link-rule label-eyebrow text-cream/70 hover:text-gold transition-colors duration-300">
              WhatsApp
            </a>
            <a href="#visit" className="link-rule label-eyebrow text-cream/70 hover:text-gold transition-colors duration-300">
              Visit
            </a>
            <a href={`mailto:${SHOP.email}`} className="link-rule label-eyebrow text-cream/70 hover:text-gold transition-colors duration-300">
              Contact
            </a>
          </nav>
        </div>

        <div className="text-cream/45 mt-10 flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between">
          <p>
            {SHOP.address} · {SHOP.phone}
          </p>
          <p>© {year} SSAroma</p>
        </div>
      </div>
    </footer>
  );
}

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroPoster from "@/assets/hero-poster.jpg";
import { LINKS } from "@/lib/ssaroma";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.055]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.15, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="top"
      ref={ref}
      className="bg-ink relative h-[100svh] min-h-[680px] w-full overflow-hidden"
    >
      <motion.div className="absolute inset-0" {...(reduced ? {} : { style: { scale, y } })}>
        <img
          src={heroPoster}
          alt="Amber fragrance bottle illuminated in the intimate light of the boutique"
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center"
          width={1920}
          height={1200}
          fetchPriority="high"
        />
        <div className="bg-ink/58 absolute inset-0" />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1480px] flex-col justify-end px-5 pb-20 sm:px-8 md:pb-24 lg:px-12 lg:pb-28">
        <div className="max-w-[870px] lg:ml-[5%] ">
          {/* <motion.p className="text-gold editorial-kicker" {...rise(0.12)}> */}
            Fragrance boutique · Peshawar
          {/* </motion.p> */}

          <motion.h1
            className="text-cream font-display mt-7 max-w-[14ch] text-[3.4rem] leading-[0.92] font-light tracking-[-0.035em] sm:text-[4.8rem] md:text-[6.2rem] lg:text-[7.15rem]"
            {...rise(0.24)}
          >
            The one they remember you by.
          </motion.h1>

          <motion.p
            className="text-cream/72 mt-8 max-w-[34rem] text-[0.95rem] leading-[1.8] sm:text-base"
            {...rise(0.38)}
          >
            Discover your signature at SSAROMA - an intimate fragrance house where time, skin and
            instinct make the final choice.
          </motion.p>

          <motion.div
            className="mt-11 flex flex-wrap items-center gap-x-11 gap-y-5"
            {...rise(0.52)}
          >
            <a
              href="#visit"
              className="link-underlined arrow-shift text-cream editorial-kicker hover:text-gold transition-colors duration-300"
            >
              Plan your visit{" "}
              <span className="arrow ml-2" aria-hidden="true">
                →
              </span>
            </a>
            <a
              href={LINKS.store}
              className="link-rule text-cream/62 hover:text-cream editorial-kicker transition-colors duration-300"
            >
              Browse fragrances ↗
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute right-12 bottom-11 z-10 hidden items-end gap-5 lg:flex">
        <span className="text-cream/46 editorial-kicker text-[0.58rem]">34° 01′ N · Peshawar</span>
        <span className="bg-cream/35 block h-px w-14" />
      </div>
    </section>
  );
}

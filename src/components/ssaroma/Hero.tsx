import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import heroPoster from "@/assets/hero-poster.jpg";
import { HERO_VIDEO_SRC } from "@/lib/ssaroma";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="top" ref={ref} className="bg-ink relative h-[100svh] w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        {...(reduced ? {} : { style: { scale, y } })}
      >
        {!videoFailed && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO_SRC}
            poster={heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
          />
        )}
        {videoFailed && (
          <img
            src={heroPoster}
            alt="Amber glass perfume bottle in low boutique light"
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1200}
          />
        )}
        <div className="bg-ink/55 absolute inset-0" />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-24 md:px-10 md:pb-28">
        <div className="max-w-3xl md:ml-[6%]">
          <motion.p className="text-gold label-eyebrow" {...rise(0.15)}>
            Peshawar · Fine Fragrance Boutique
          </motion.p>

          <motion.h1
            className="text-cream font-display mt-7 text-[2.75rem] leading-[1.04] font-light tracking-[-0.01em] sm:text-6xl md:text-[4.75rem] lg:text-[5.5rem]"
            {...rise(0.28)}
          >
            A scent becomes
            <br />
            part of your presence.
          </motion.h1>

          <motion.p
            className="text-cream/70 mt-8 max-w-lg text-[0.95rem] leading-relaxed" 
            {...rise(0.42)}
          >
            Discover fragrances chosen for character, depth and the moments they leave behind.
          </motion.p>

          <motion.div className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-5" {...rise(0.56)}>
            <a
              href="#collection"
              className="link-underlined arrow-shift text-cream label-eyebrow hover:text-gold transition-colors duration-300"
            >
              Discover the collection <span className="arrow ml-2">→</span>
            </a>
            <a
              href="#experience"
              className="link-rule text-cream/65 hover:text-cream label-eyebrow transition-colors duration-300"
            >
              Experience SSAroma
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 md:bottom-10">
        <span className="text-cream/45 label-eyebrow block text-center text-[0.6rem]">Scroll</span>
        <span className="bg-cream/40 mx-auto mt-3 block h-12 w-px" />
      </div>
    </section>
  );
}

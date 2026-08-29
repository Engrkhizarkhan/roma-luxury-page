"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import heroPoster from "@/assets/hero-poster.jpg";
import { LINKS } from "@/lib/ssaroma";
import type { SiteSettings } from "@/types/domain";

export function Hero({ settings }: { settings: SiteSettings }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const showVideo = settings.heroMediaType === "video" && Boolean(settings.heroVideo);
  const [muted, setMuted] = useState(!settings.heroSoundEnabled);
  const [needsPlay, setNeedsPlay] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.055]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  useEffect(() => {
    const video = videoRef.current;
    if (!showVideo || !video) return;

    const shouldMute = !settings.heroSoundEnabled;
    video.muted = shouldMute;
    setMuted(shouldMute);
    setNeedsPlay(false);
    void video.play().catch(() => {
      if (!shouldMute) {
        video.muted = true;
        setMuted(true);
        setNeedsPlay(true);
        void video.play();
      }
    });
  }, [settings.heroSoundEnabled, showVideo]);

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
        {showVideo && settings.heroVideo ? (
          <video
            ref={videoRef}
            src={settings.heroVideo.url}
            poster={settings.heroImage?.url || heroPoster.src}
            autoPlay
            muted={muted}
            playsInline
            preload="metadata"
            suppressHydrationWarning
            className="absolute inset-0 h-full w-full object-cover object-[76%_center] sm:object-center"
            aria-label="SSAROMA boutique atmosphere"
          />
        ) : (
          <Image
            src={settings.heroImage?.url || heroPoster.src}
            alt="Amber fragrance bottle illuminated in the intimate light of the boutique"
            className="absolute inset-0 h-full w-full object-cover object-[76%_center] sm:object-center"
            fill
            sizes="100vw"
            preload
          />
        )}
        <div className="bg-ink/52 absolute inset-0 sm:bg-ink/58" />
        <div className="from-ink/70 via-ink/15 absolute inset-0 bg-gradient-to-r to-transparent sm:hidden" />
      </motion.div>

      {showVideo ? (
        <button
          type="button"
          onClick={async () => {
            const nextMuted = !muted;
            setMuted(nextMuted);
            if (videoRef.current) {
              videoRef.current.muted = nextMuted;
              if (!nextMuted) {
                await videoRef.current.play().then(() => setNeedsPlay(false)).catch(() => {
                  setMuted(true);
                  setNeedsPlay(true);
                });
              }
            }
          }}
          className="focus-ring border-cream/25 bg-ink/35 text-cream absolute top-24 right-5 z-20 flex items-center gap-2 border px-3 py-2 text-[0.65rem] font-semibold tracking-[0.12em] uppercase backdrop-blur-sm sm:right-8 lg:right-12"
          aria-label={muted ? "Turn on film sound" : "Mute film sound"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {muted ? "Sound on" : "Sound off"}
        </button>
      ) : null}

      {showVideo && needsPlay ? (
        <button
          type="button"
          onClick={async () => {
            if (!videoRef.current) return;
            videoRef.current.muted = false;
            await videoRef.current.play();
            setMuted(false);
            setNeedsPlay(false);
          }}
          className="focus-ring border-cream/30 bg-ink/60 text-cream absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 border px-6 py-4 text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur-sm"
        >
          Play with sound
        </button>
      ) : null}

      <div className="relative z-10 mx-auto flex h-full max-w-[1480px] flex-col justify-end px-5 pb-20 sm:px-8 md:pb-24 lg:px-12 lg:pb-28">
        <div className="max-w-[870px] lg:ml-[5%] ">
          <motion.p className="text-gold editorial-kicker" {...rise(0.12)}>
            {settings.heroEyebrow}
          </motion.p>
          <motion.h1
            className="text-cream font-display mt-7 max-w-[14ch] text-[3.4rem] leading-[0.92] font-light tracking-[-0.035em] sm:text-[4.8rem] md:text-[6.2rem] lg:text-[7.15rem]"
            {...rise(0.24)}
          >
            {settings.heroTitle}
          </motion.h1>
          <motion.p
            className="text-cream/72 mt-8 max-w-[34rem] text-[0.95rem] leading-[1.8] sm:text-base"
            {...rise(0.38)}
          >
            {settings.heroBody}
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

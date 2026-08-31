"use client";

import { useEffect, useState } from "react";
import { LINKS, NAV } from "@/lib/ssaroma";
import type { SiteSettings } from "@/types/domain";
import { BrandMark } from "./BrandMark";

export function Header({ settings }: { settings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-500",
        scrolled || open
          ? "border-cream/15 bg-ink border-b py-4"
          : "border-b border-transparent py-6 md:py-7",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="text-cream focus-ring flex min-h-9 max-w-40 items-center leading-none sm:max-w-52"
          onClick={() => setOpen(false)}
          aria-label={`${settings.brandName} home`}
        >
          <BrandMark
            settings={settings}
            textClassName="text-[1.05rem]"
            logoClassName="h-9 w-auto max-w-40 sm:max-w-52"
            priority
          />
        </a>

        <nav
          className="hidden items-center gap-8 lg:flex xl:gap-11"
          aria-label="Primary navigation"
        >
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="link-rule text-cream/68 hover:text-cream editorial-kicker transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href={LINKS.store}
            className="link-underlined arrow-shift text-cream editorial-kicker hover:text-gold transition-colors duration-300"
          >
            Fragrance edit{" "}
            <span className="arrow ml-2" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="text-cream focus-ring flex h-9 w-9 flex-col items-end justify-center gap-[6px] lg:hidden"
        >
          <span
            className={[
              "bg-cream h-px transition-all duration-500",
              open ? "w-6 translate-y-[3.5px] rotate-45" : "w-7",
            ].join(" ")}
          />
          <span
            className={[
              "bg-cream h-px transition-all duration-500",
              open ? "w-6 -translate-y-[3.5px] -rotate-45" : "w-4",
            ].join(" ")}
          />
        </button>
      </div>

      <div
        className={[
          "bg-ink overflow-hidden transition-[max-height,opacity] duration-500 lg:hidden",
          open ? "max-h-[calc(100svh-64px)] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav
          className="flex min-h-[calc(100svh-64px)] flex-col px-5 pt-8 pb-8 sm:px-8"
          aria-label="Mobile navigation"
        >
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-cream/15 text-cream font-display border-t py-5 text-[2.15rem] font-light tracking-[-0.01em]"
            >
              {item.label}
            </a>
          ))}
          <a
            href={LINKS.store}
            className="text-gold editorial-kicker border-cream/15 mt-auto border-t pt-6"
          >
            Open the fragrance edit ↗
          </a>
        </nav>
      </div>
    </header>
  );
}

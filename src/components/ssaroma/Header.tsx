import { useEffect, useState } from "react";
import { LINKS, NAV } from "@/lib/ssaroma";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-700",
        scrolled || open
          ? "bg-ink/95 border-b border-cream/12 py-4"
          : "border-b border-transparent py-6",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          className="font-display text-cream text-2xl leading-none tracking-[0.18em] md:text-[1.7rem]"
          onClick={() => setOpen(false)}
        >
          SSAroma
        </a>

        <nav className="hidden items-center gap-10 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="link-rule text-cream/75 hover:text-cream label-eyebrow transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#collection"
            className="link-underlined arrow-shift text-cream label-eyebrow hover:text-gold transition-colors duration-300"
          >
            Explore Collection <span className="arrow ml-2">→</span>
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-cream flex h-8 w-8 flex-col items-end justify-center gap-[6px] lg:hidden"
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
          "bg-ink overflow-hidden transition-[max-height,opacity] duration-700 lg:hidden",
          open ? "max-h-[70svh] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="flex flex-col px-6 pt-6 pb-10">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-cream/12 text-cream font-display border-t py-5 text-3xl tracking-wide"
            >
              {item.label}
            </a>
          ))}
          <a
            href={LINKS.store}
            className="text-gold label-eyebrow border-cream/12 border-t pt-6"
          >
            Explore Collection →
          </a>
        </nav>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// SSAroma — editable content constants.
// Replace these values with the client's real details.
// ---------------------------------------------------------------------------

import heroVideo from "@/assets/media/hero-ssaroma.mp4.asset.json";

/** Swap this single URL for the client's own cinematic hero film. */
export const HERO_VIDEO_SRC: string = heroVideo.url;

export const SHOP = {
  name: "SSAroma",
  city: "Peshawar",
  /** PLACEHOLDER — replace with the real street address. */
  address: "Shop 12, University Road, Peshawar, Pakistan",
  /** PLACEHOLDER — replace with the real phone number. */
  phone: "+92 300 000 0000",
  /** PLACEHOLDER — replace with the real hours. */
  hours: "Mon – Sat · 11:00 – 21:00",
  /** PLACEHOLDER — replace with the real email. */
  email: "hello@ssaroma.com",
} as const;

export const LINKS = {
  /** PLACEHOLDER — online store. */
  store: "https://products.ssaroma.com",
  /** PLACEHOLDER — Instagram profile. */
  instagram: "https://instagram.com",
  /** PLACEHOLDER — WhatsApp chat link. */
  whatsapp: "https://wa.me/920000000000",
  /** PLACEHOLDER — map link for the boutique. */
  map: "https://maps.google.com",
} as const;

export const NAV = [
  { label: "Home", href: "#top" },
  { label: "The House", href: "#house" },
  { label: "Collection", href: "#collection" },
  { label: "Experience", href: "#experience" },
  { label: "Visit", href: "#visit" },
] as const;

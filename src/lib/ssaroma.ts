export const SHOP = {
  name: "SSAROMA",
  city: "Peshawar",
  region: "Khyber Pakhtunkhwa",
  address: "First Floor, Shop No. 4, MK Tower, Peshawar, Pakistan",
  // Replace with the boutique's confirmed opening hours.
  hours: "Visit details available on request",
  // Replace with the boutique's confirmed contact address.
  email: "hello@ssaroma.com",
} as const;

export const LINKS = {
  // Internal storefront route. Backend wiring will be added later.
  store: "/products",
  instagram: "https://instagram.com/ssaroma",
  map: "https://www.google.com/maps/search/?api=1&query=MK+Tower%2C+Peshawar",
} as const;

export const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.562556926891!2d71.5330096!3d34.029437900000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d917514a791ab7%3A0x66dc8c1f4b311f50!2sMK%20TOWER!5e0!3m2!1sen!2s!4v1788019607905!5m2!1sen!2s";

export const NAV = [
  { label: "The House", href: "#house" },
  { label: "The Visit", href: "#ritual" },
  { label: "Fragrances", href: "#collection" },
  { label: "Peshawar", href: "#visit" },
] as const;

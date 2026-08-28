export const SHOP = {
  name: "SSAROMA",
  city: "Peshawar",
  region: "Khyber Pakhtunkhwa",
  // Add the confirmed street address here when it is available.
  address: "Peshawar, Pakistan",
  // Replace with the boutique's confirmed opening hours.
  hours: "Visit details available on request",
  // Replace with the boutique's confirmed contact address.
  email: "hello@ssaroma.com",
} as const;

export const LINKS = {
  // Internal storefront route. Backend wiring will be added later.
  store: "/products",
  instagram: "https://instagram.com/ssaroma",
  map: "https://www.google.com/maps/search/?api=1&query=SSAROMA+Peshawar",
} as const;

export const NAV = [
  { label: "The House", href: "#house" },
  { label: "The Visit", href: "#ritual" },
  { label: "Fragrances", href: "#collection" },
  { label: "Peshawar", href: "#visit" },
] as const;

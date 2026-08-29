import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { siteUrl } from "@/lib/env";
import { initialSettings } from "@/services/settings";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: initialSettings.siteTitle, template: "%s | SSAROMA" },
  description: initialSettings.siteDescription,
  applicationName: "SSAROMA",
  openGraph: {
    type: "website",
    siteName: "SSAROMA",
    title: initialSettings.siteTitle,
    description: initialSettings.siteDescription,
    images: ["/og-luxury.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: initialSettings.siteTitle,
    description: initialSettings.siteDescription,
    images: ["/og-luxury.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#171713",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        {children}
        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}

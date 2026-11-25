import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/inter";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { DemoBanner } from "@/components/site/demo-banner";

const description =
  "Azure Estates is a fictional luxury Caribbean real estate portfolio demo. All listings are illustrative and not available for sale.";

export const metadata: Metadata = {
  metadataBase: new URL("https://azure-estates.example"),
  title: { default: "Azure Estates | Luxury Caribbean Real Estate (Demo)", template: "%s | Azure Estates (Demo)" },
  description,
  openGraph: {
    title: "Azure Estates — Fictional luxury real estate demo",
    description,
    type: "website",
    siteName: "Azure Estates (Demo)",
    images: [{ url: "/images/hero-villa.webp", width: 1800, height: 1200, alt: "Illustrative white villa above a reflecting pool" }],
  },
  // Demonstration site: keep it out of search indexes so sample listings are never mistaken for real ones.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#102A43" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-TT">
      <body className="min-h-svh">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-3 focus:text-sm"
        >
          Skip to content
        </a>
        <DemoBanner />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

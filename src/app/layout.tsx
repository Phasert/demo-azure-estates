import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const title = "Azure Estates | Luxury Caribbean Real Estate";
const description = "Explore a fictional collection of luxury Caribbean homes in the Azure Estates portfolio demo.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Azure Estates" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

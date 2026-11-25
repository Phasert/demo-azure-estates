import type { MetadataRoute } from "next";
import { getAllProperties } from "@/features/properties/data";

const base = "https://azure-estates.example";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/properties", "/experience", "/about", "/neighbourhoods", "/contact"].map((p) => ({ url: `${base}${p}` })),
    ...getAllProperties().map((p) => ({ url: `${base}/properties/${p.slug}`, lastModified: p.listedOn })),
  ];
}

/**
 * Domain types for the Azure Estates demo.
 * Shapes mirror what a future database/CMS record would return, so the
 * local mock data in `data.ts` can be swapped for a repository call later.
 */
export type PropertyType = "villa" | "contemporary" | "beachfront" | "investment";

export type PropertyImage = {
  src: string;
  alt: string;
  /** Short caption shown in the gallery. */
  caption?: string;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  neighbourhood: string; // Neighbourhood slug
  location: string;
  priceTTD: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  lotSqFt?: number;
  yearCompleted: number;
  tagline: string;
  description: string[];
  amenities: string[];
  images: PropertyImage[];
  featured?: boolean;
  listedOn: string; // ISO date
};

export type Neighbourhood = {
  slug: string;
  name: string;
  island: "Trinidad" | "Tobago";
  summary: string;
  description: string;
  image: PropertyImage;
  highlights: string[];
  /** Real-world area that inspired the fictionalised neighbourhood, with approximate coordinates. */
  inspiredBy: { area: string; lat: number; lon: number };
};

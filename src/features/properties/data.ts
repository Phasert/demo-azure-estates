export type Property = {
  name: string;
  location: string;
  description: string;
  bedrooms: number;
  highlights: readonly string[];
};

export const featuredProperty: Property = {
  name: "Coral House",
  location: "West Coast, Barbados",
  description: "Limestone terraces, shaded outdoor rooms and a pool overlooking the Caribbean Sea define this imagined hillside residence.",
  bedrooms: 5,
  highlights: ["Infinity pool", "Ocean views"],
};

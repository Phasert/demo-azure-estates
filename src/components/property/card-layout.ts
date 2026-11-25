export type CardVariant = "portrait" | "feature" | "landscape";

/** Editorial rhythm for a list of cards: feature, then varied portrait/landscape pairs. */
export function layoutFor(i: number): { variant: CardVariant; className: string } {
  const slot = i % 6;
  if (slot === 0) return { variant: "feature", className: "sm:col-span-2 lg:col-span-6" };
  if (slot === 1) return { variant: "portrait", className: "lg:col-span-3" };
  if (slot === 2) return { variant: "landscape", className: "lg:col-span-3 lg:mt-32" };
  if (slot === 3) return { variant: "landscape", className: "lg:col-span-3" };
  if (slot === 4) return { variant: "portrait", className: "lg:col-span-3 lg:-mt-16" };
  return { variant: "portrait", className: "sm:col-span-2 lg:col-span-2 lg:col-start-3" };
}

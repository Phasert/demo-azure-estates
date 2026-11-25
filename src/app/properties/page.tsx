import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/page/page-intro";
import { PropertyExplorer } from "@/components/property/property-explorer";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse illustrative luxury villas, contemporary homes, beachfront and investment properties in the fictional Azure Estates portfolio.",
};

export default function PropertiesPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="The portfolio · Illustrative listings"
        title="Properties"
        intro="Filter, sort and save homes from our fictional Caribbean collection. Prices are shown in Trinidad & Tobago dollars and are for demonstration only."
      />
      <Suspense fallback={<div className="container-lux h-96" />}>
        <PropertyExplorer />
      </Suspense>
    </main>
  );
}

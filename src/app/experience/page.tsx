import type { Metadata } from "next";
import { PageIntro } from "@/components/page/page-intro";
import { DayNightSection, FloorPlanSection, TourSection } from "@/components/experience/sections";

export const metadata: Metadata = {
  title: "The Residence Experience",
  description: "Explore a conceptual Caribbean residence through a room-by-room tour, an interactive floor plan and a day-to-night scene. Illustrative demo only.",
};

export default function ExperiencePage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Residence Concept A · Interactive"
        title="Experience the property before you arrive."
        intro="A conceptual home presented three ways: walk its rooms, read its plan and watch its atmosphere change. It is a design concept, not a listing."
        image="/images/hero-villa.webp"
        imageAlt="Illustrative white villa with cantilevered terraces"
      />
      <TourSection />
      <FloorPlanSection />
      <DayNightSection />
    </main>
  );
}

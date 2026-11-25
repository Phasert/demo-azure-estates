# Azure Estates

Azure Estates is a fictional luxury Caribbean real estate portfolio demo: an editorial, motion-led agency site with eight illustrative listings across Trinidad and Tobago.

> **Demonstration only.** Azure Estates is not a real agency. Every listing, price, address and person is invented, enquiry forms send nothing, and the site is set to `noindex`. A site-wide banner, per-listing notices and the footer state this.

## Features

- **Pages:** Home, Properties, Property details (`/properties/[slug]`, statically generated), Experience (`/experience`), About, Neighbourhoods, Contact.
- **Cinematic hero:** each featured property arrives through louvred shutters, a slow camera push toward a focal point, a floating magnified detail lens and pointer-driven depth layers. It has pause and property controls and pauses when offscreen.
- **Conceptual walkthrough** (`src/components/experience/property-tour.tsx`): seven rooms of "Residence Concept A", each opening through a doorway-shaped mask, with hotspots, swipe, arrow-key tabs and a "you are here" mini-plan. It is clearly labelled as a concept, illustrated with photos of different homes, and not a 360° tour.
- **Interactive floor plan** (`floor-plan.tsx`): an SVG schematic with animated walls, selectable rooms (mouse, touch, keyboard), a travelling locator and a room panel. It is labelled "not to scale".
- **Day-to-night scene** (`day-night.tsx`): an original illustrated villa rendered from four colour keyframes and controlled by a slider, presets or autoplay. Matched photographs were not available, so no unrelated photos are blended.
- **Listings:** editorial layouts (feature / portrait / landscape), a second-image hover wipe and amenity reveals, plus filter by type, price and bedrooms, search, sort and a saved-only view. Filter state lives in the URL.
- **Detail pages:** a full-bleed arrival hero that pulls back on scroll, a specification sheet, visual chapters, gallery and lightbox, amenities, neighbourhood lifestyle, enquiry, related homes and a "next residence" link.
- **Neighbourhoods:** a destination explorer with a stylised SVG map of Trinidad and Tobago. Markers sit at the real areas that inspired each fictionalised neighbourhood.
- **Favourites:** stored in `localStorage` and synced across tabs.
- **Performance and accessibility:** heavy scenes are code-split with loading skeletons and error boundaries, animations pause offscreen, every effect has a `prefers-reduced-motion` alternative, and controls are keyboard and touch operable.

The concept residence data lives in `src/features/concept/residence.ts`. Image sources and licensing are documented in `public/images/SOURCES.md`.

## Getting started

Use Bun 1.4.3, as pinned in `package.json`. The Next.js scripts also require a Node.js version supported by Next.js.

```sh
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3000. The application runs with local assets and requires zero environment variables.

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | Generate Next.js route types and check TypeScript |
| `bun run build` | Create a production build |
| `bun run start` | Serve the production build locally |

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS v4, Bun, Lucide React, Motion for React, self-hosted Cormorant Garamond and Inter (Fontsource), and ESLint.

## Project structure

- `src/app/` contains routes, root metadata, Tailwind theme tokens, and the favicon.
- `src/components/site/` contains shared site components.
- `src/components/home/` contains homepage sections and the client-side Motion component.
- `src/features/properties/` contains domain types (`types.ts`), mock data and accessor functions (`data.ts`), pure filter/sort logic (`query.ts`) and the favourites store. To connect a database, replace the accessors in `data.ts`; components only depend on the types and accessors.
- `src/components/` contains site chrome, homepage sections, property components and motion primitives.
- `public/images/` contains the demo's photography: `coral-house.webp` (generated for the starter) and photos from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license). They illustrate architectural style only and do not show the fictional listings.

## Extending the demo

Build new routes in `src/app/` and keep property data and domain types in `src/features/properties/`. Keep components on the server by default and add client boundaries for interactions that need browser state. Run lint, type-checking, and the production build before committing changes.

Property names, details and imagery are illustrative. This project does not represent a real brokerage or an offer for sale.

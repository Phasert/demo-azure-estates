# Azure Estates

Azure Estates is a fictional luxury Caribbean real estate portfolio demo. The starter homepage introduces the brand and showcases Coral House, an imagined Barbados residence.

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

Next.js App Router, React, TypeScript, Tailwind CSS v4, Bun, Lucide React, Motion for React, and ESLint.

## Project structure

- `src/app/` contains routes, root metadata, Tailwind theme tokens, and the favicon.
- `src/components/site/` contains shared site components.
- `src/components/home/` contains homepage sections and the client-side Motion component.
- `src/features/properties/` contains typed fictional property data.
- `public/images/` contains the demo's generated architectural imagery.

## Extending the demo

Build new routes in `src/app/` and keep property data and domain types in `src/features/properties/`. Keep components on the server by default and add client boundaries for interactions that need browser state. Run lint, type-checking, and the production build before committing changes.

Property names, details, and AI-generated imagery are illustrative. This project does not represent a real brokerage or an offer for sale.

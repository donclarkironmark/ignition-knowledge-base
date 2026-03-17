# Ignition Knowledge Base

Internal knowledge website for the Ignition platform. Surfaces ~799 markdown docs from the product-management repo as a searchable, branded site.

## Tech Stack
- **Next.js 16** (App Router) + React 19 + TypeScript 5.9
- **Tailwind CSS 3.4** + shadcn/ui patterns (CVA + clsx + tailwind-merge)
- **Supabase** auth (shared project with product-management app)
- **react-markdown** + remark-gfm for document rendering
- **FlexSearch** for client-side full-text search
- **Vercel** deployment

## Brand
- Colors: Ironmark red `#EF462F`, cyan `#38C6F4`, gray `#707070`, off-white `#f4f2f2`
- Fonts: Raleway (body), Bebas Neue (headings), Lora (serif accent)
- Icons: lucide-react
- Animations: framer-motion

## Content Pipeline
Content is fetched at build time from the `kbrapp1/product-management` GitHub repo via API. The `scripts/sync-content.ts` prebuild script:
1. Fetches all `.md` files from `docs/` and `docs-donai/`
2. Writes them to `content/` directory preserving structure
3. Generates `content/manifest.json` with metadata (path, title, category, word count)
4. Builds a FlexSearch index at `public/search-index.json`

Rebuilds are triggered manually via the `/deploy-kb` skill in the PM repo.

## Coding Standards
Inherits from parent `claude-hub/CLAUDE.md`:
- Explicit over implicit
- Fail fast with clear errors
- No lint suppression (`// eslint-disable`, `// @ts-ignore`, `as any`)
- No defensive coding that masks bugs between internal functions
- DRY — check existing helpers before writing new ones
- Functions: `verbNoun` format
- Constants: `UPPER_SNAKE_CASE`

## Pipeline
This project is being built using the 19-step agent pipeline. Status tracker: `docs/pipeline/ignition-kb/pipeline.md`

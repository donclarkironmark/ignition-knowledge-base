# Ignition Knowledge Base

Internal product marketing website for Ironmark's Ignition platform. Audience: sales, marketing, account managers, executives (non-technical). Content is fully static TSX — no markdown rendering, no external content sync.

## Tech Stack
- **Next.js 16** (App Router) + React 19 + TypeScript 5.9
- **Tailwind 4** with `@plugin "@tailwindcss/typography"` in globals.css
- **jose** for JWT auth (Edge Runtime compatible — `jsonwebtoken` crashes in middleware)
- **lucide-react** for icons
- **Vercel** deployment

## Architecture
- **Static TSX content + Supabase-backed Insider feature** under `src/app/(site)/`
- **Dual-password auth** — `KB_PASSWORD` (viewer) and `KB_ADMIN_PASSWORD` (admin), JWT cookie carries role; API routes at `/api/auth/{login,logout,session}`
- **Navigation** defined in `src/config/navigation.ts` — sections, items, status badges
- **Shared UI components** in `src/components/ui/` (PageHeader, SectionHeading, StatusBadge, CapabilityCard, TangoEmbed, etc.)
- **Route group** `(site)` wraps all authenticated pages with SiteShell layout

## Brand
- Colors: red `#EF462F`, cyan `#38C6F4`, gray `#707070`, off-white `#f4f2f2`
- Fonts: Raleway (body), Bebas Neue (headings), Lora (serif accent) — loaded via `next/font/google`
- Brand tokens in `src/styles/brand.ts`

## Content Structure (3 nav sections)
- **Intel & Insights**: Feed (`/insider`), Editions (`/insider/editions`), Admin (`/insider/admin`) — Supabase-backed, populated by Claude Code Routines + manual admin entry
- **Capabilities**: Overview (all 7 tiered), ROI Reporting (live), Iggy AI (live), Competitive Positioning
- **Resources**: Demo Guide, Glossary, Help Guides (Tango-embed walkthroughs)

> Removed in the IA simplification: `/platform/*` and `/verticals/*` (deleted), `/competitive` (moved to `/capabilities/competitive`). Old URLs 301-redirect via `next.config.ts`.

## Content Rules
- NO pricing, revenue, ARR targets, or financial details anywhere
- Competitors named only on `/capabilities/competitive` and inside the Intel & Insights feed; generic references elsewhere
- Capability status: LIVE (green) / PHASE 2 (amber) / PHASE 3 (gray)
- Phase labels, not quarter-based timelines (avoids credibility risk when dates slip)

## Gotchas (things that burned time)
- `@tailwindcss/typography` must be installed AND registered with `@plugin` in CSS — prose classes silently no-op without it
- `Set` cannot cross the RSC→client component boundary — pass `string[]`, convert client-side
- `useRef<T>()` requires explicit initial value in React 19: `useRef<T>(undefined)`
- Next.js 16 requires `<Suspense>` around any client component using `useSearchParams()`
- URL slugs must sanitize special chars (`&`, `()`) — encoding mismatches cause 404s
- Can't `renameSync(dir, dir/subdir)` — atomic swap paths must be siblings, not nested
- `react-markdown` v10: default export is async/RSC-only; use `MarkdownHooks` in client components

## Coding Standards
Inherits from parent `claude-hub/CLAUDE.md`. Key rules:
- No lint suppression (`// eslint-disable`, `// @ts-ignore`, `as any`)
- No defensive coding between internal functions — fail fast at origin
- DRY — check existing helpers before writing new ones

## Pipeline Artifacts
Content rebuild pipeline docs: `docs/pipeline/content-rebuild/`
- `01-research/brief.md` — source material research
- `02-requirements/draft.md` (PM-A), `challenge.md` (PM-B), `approved.md` (consolidated)

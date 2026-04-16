# Technical Specification: Ignition Knowledge Base

**Date:** 2026-03-17
**Input:** approved.md (58 scenarios: 30 P1, 18 P2, 10 P3)
**Status:** Draft -- pending Don's review

---

## 1. Architecture Overview

The Ignition Knowledge Base is a statically generated Next.js 16 site that renders markdown documents fetched at build time from the `kbrapp1/product-management` GitHub repo. All pages are pre-rendered. Content is searchable via Pagefind (build-time index, lazy-loaded chunks). All routes are protected by Supabase auth (shared project with the PM app).

### Build Pipeline

```
scripts/sync-content.ts          (prebuild: fetch .md files from GitHub API)
        |
        v
content/docs/**/*.md             (local markdown files, gitignored)
content/manifest.json            (metadata index)
content/nav.json                 (parsed SUMMARY.md tree)
        |
        v
next build                       (SSG: generateStaticParams from manifest)
        |
        v
npx pagefind --site .next/...    (postbuild: index rendered HTML)
        |
        v
public/pagefind/                 (search index chunks)
```

### Runtime Flow

```
Browser request
    |
    v
middleware.ts                    (check Supabase session, refresh if needed, redirect to /login if none)
    |
    v
Static page served              (pre-rendered HTML + hydration)
    |
    v
Pagefind JS loaded on demand    (only when search dialog opens)
```

---

## 2. TypeScript Interfaces

### 2.1 Content Manifest

```typescript
// src/types/content.ts

/** Single document entry in the build-time manifest */
export interface ManifestEntry {
  /** URL path slug, e.g. "/strategy/verticals/qsr-vertical-product-vision" */
  slug: string;
  /** Document title extracted from first h1 or derived from filename */
  title: string;
  /** Top-level category key, e.g. "strategy", "roadmap", "research" */
  category: string;
  /** Original file path in the GitHub repo, e.g. "docs/01-strategy/verticals/QSR.md" */
  filePath: string;
  /** Total word count */
  wordCount: number;
  /** First non-heading, non-empty line of content (for category page summaries) */
  summary: string;
}

/** Full manifest written to content/manifest.json */
export type ContentManifest = ManifestEntry[];
```

### 2.2 Navigation Tree

```typescript
// src/types/navigation.ts

/** A single document link in the nav tree */
export interface NavLink {
  title: string;
  slug: string;
}

/** A category group in the nav tree (parsed from SUMMARY.md) */
export interface NavCategory {
  /** Display name, e.g. "Market Research" */
  title: string;
  /** URL-safe key, e.g. "market-research" */
  key: string;
  /** Ordered child document links */
  children: NavLink[];
}

/** Full navigation tree written to content/nav.json */
export type NavTree = NavCategory[];
```

### 2.3 Category Metadata

```typescript
// src/types/content.ts (continued)

/** Derived category for homepage grid and category pages */
export interface CategoryMeta {
  /** URL-safe key matching NavCategory.key */
  key: string;
  /** Display name */
  title: string;
  /** Document count */
  count: number;
  /** Sort order from directory numeric prefix */
  sortOrder: number;
  /** lucide-react icon name */
  icon: string;
}
```

### 2.4 Sync Config

```typescript
// src/config/sync.config.ts

export interface SyncConfig {
  repo: string;
  branch: string;
  include: string[];
  exclude: string[];
  minFileSizeBytes: number;
  /** Map directory path prefixes to category keys */
  categoryMapping: Array<{
    pathPrefix: string;
    category: string;
    displayName: string;
    icon: string;
    sortOrder: number;
  }>;
}
```

### 2.5 Recently Viewed (Client)

```typescript
// src/types/content.ts (continued)

export interface RecentlyViewedItem {
  slug: string;
  title: string;
  category: string;
  viewedAt: number; // Date.now()
}
```

---

## 3. Data Flow

### 3.1 Build-Time Content Sync (sync-content.ts)

1. Read `SyncConfig` for repo, branch, include/exclude patterns.
2. Fetch the full git tree via `GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1` (single API call, returns all file paths + sizes).
3. Filter tree entries: match `docs/**/*.md`, reject excluded directories, reject files under 1,500 bytes.
4. Create a temp directory (`content/.tmp/`).
5. Fetch each file's content via `GET /repos/{owner}/{repo}/contents/{path}?ref={branch}` with the GitHub PAT. Batch at concurrency 5, with rate-limit handling (check `X-RateLimit-Remaining`, wait on 403 using `X-RateLimit-Reset`).
6. Write each file to `content/.tmp/docs/...` preserving directory structure.
7. Fetch `SUMMARY.md` separately and write to `content/.tmp/SUMMARY.md`.
8. Parse SUMMARY.md into `NavTree` (see 3.2). If SUMMARY.md is missing or has no list items, abort with error (S-33).
9. For each fetched file, generate a `ManifestEntry`: derive slug (strip numeric prefixes, lowercase, kebab-case, drop `.md`), extract title from first `# ` line or filename, compute word count, extract summary.
10. Filter empty categories from NavTree (S-13). Log warnings for manifest entries not in SUMMARY.md (S-14).
11. Write `content/.tmp/manifest.json`, `content/.tmp/nav.json`.
12. Atomic swap: rename `content/docs/` to `content/.old/`, rename `content/.tmp/` to `content/`, delete `content/.old/` (S-52). If any fetch failed, leave `content/` untouched, exit non-zero.
13. Log summary: files synced, files skipped, warnings, errors.

### 3.2 SUMMARY.md Parsing

SUMMARY.md contains markdown list items with links:

```markdown
# Summary

## Strategy
- [Master Strategy](docs/01-strategy/vision/master-strategy.md)
- [Platform Vision](docs/01-strategy/vision/platform-vision.md)

## Market Research
- [TAM Analysis](docs/01-strategy/market-research/market-analysis/tam-analysis.md)
```

Parsing rules:
- `## Heading` lines become `NavCategory` nodes with `title` = heading text, `key` = slugified heading.
- `- [Title](path)` lines become `NavLink` nodes. The `path` is converted to the same slug algorithm used for manifest entries.
- Malformed entries (no valid `[text](path)` match) are skipped with a warning including line number (S-32).
- If zero valid categories are found after parsing, build aborts (S-33).

### 3.3 Slug Generation Algorithm

```
Input:  "docs/01-strategy/verticals/QSR-Vertical-Product-Vision.md"
Step 1: Strip "docs/" prefix             -> "01-strategy/verticals/QSR-Vertical-Product-Vision.md"
Step 2: Strip numeric prefixes per segment -> "strategy/verticals/QSR-Vertical-Product-Vision.md"
Step 3: Drop .md extension               -> "strategy/verticals/QSR-Vertical-Product-Vision"
Step 4: Lowercase                        -> "strategy/verticals/qsr-vertical-product-vision"
Step 5: Prepend /                        -> "/strategy/verticals/qsr-vertical-product-vision"
```

Numeric prefix pattern: `/^\d+-/` applied per path segment.

### 3.4 Internal Link Rewriting (S-36)

During markdown rendering, a custom `a` component intercepts links:
- If `href` ends in `.md` and is a relative path, apply the slug algorithm to resolve it against the current document's directory.
- Check if the resolved slug exists in the manifest. If yes, rewrite to the KB URL. If no, leave as-is (will navigate to 404 per S-46).

### 3.5 Pagefind Indexing

After `next build`, run `npx pagefind --site .next/server/app --output-path public/pagefind`. Pagefind indexes the pre-rendered HTML, producing lazy-loadable index chunks. The Pagefind JS (~6KB) is loaded only when the search dialog opens (S-38).

### 3.6 Auth Flow

Identical pattern to the PM app:
- `middleware.ts` checks Supabase session on every page request (not static assets, not `/login`, not `/auth`).
- If no session, redirect to `/login?redirect={originalPath}` (S-02, S-05).
- If expired token, `supabase.auth.getUser()` triggers automatic refresh via the cookie-based server client (S-04).
- Login page uses `supabase.auth.signInWithPassword()` with PKCE flow (S-03).
- On success, redirect to `searchParams.redirect` or `/` (S-05).
- Logout calls `supabase.auth.signOut()`, clears cookies, redirects to `/login` (S-07).

---

## 4. Database Schema

No new database tables. The KB uses the shared Supabase project for authentication only. Content is static files on disk. Recently viewed history uses localStorage (S-55).

---

## 5. Dependency List

### Production Dependencies (to add)

| Package | Version | Purpose | Scenarios |
|---------|---------|---------|-----------|
| `@supabase/ssr` | `^0.6` | Server/browser Supabase clients with cookie auth | S-01 through S-07, S-50 |
| `@supabase/supabase-js` | `^2.49` | Supabase core (peer dep of @supabase/ssr) | S-01 through S-07, S-50 |
| `react-markdown` | `^10.1` | Markdown to React rendering | S-15, S-16, S-43 |
| `remark-gfm` | `^4.0` | GFM tables, strikethrough, autolinks | S-16 |
| `lucide-react` | `^0.475` | Icon library | S-08, S-17 |
| `framer-motion` | `^12` | Animations for search dialog, sidebar transitions | S-23, S-57 |
| `clsx` | `^2.1` | Conditional class joining | All UI |

### Dev Dependencies (to add)

| Package | Version | Purpose | Scenarios |
|---------|---------|---------|-----------|
| `pagefind` | `^1.3` | Build-time search index generation | S-34, S-23, S-24 |
| `@tailwindcss/typography` | `^0.5` | Prose classes for markdown styling | S-15, S-17 |
| `tsx` | `^4.19` | Run TypeScript scripts (sync-content.ts) directly | S-28 |
| `minimatch` | `^10` | Glob matching for include/exclude patterns in sync | S-29 |

### Fonts (Google Fonts via next/font or CSS import)

- Raleway (body text)
- Bebas Neue (display headings)
- Lora (serif accents)

---

## 6. File Inventory

### Layer 0: Project Config, Types, Brand

| # | File Path | Action | Purpose | Key Exports |
|---|-----------|--------|---------|-------------|
| 1 | `package.json` | Modify | Add all dependencies listed in Section 5 | -- |
| 2 | `next.config.ts` | Modify | Add output config, image domains, redirects | nextConfig |
| 3 | `tsconfig.json` | Modify | Add `content` to include paths, add `scripts` path alias | -- |
| 4 | `src/types/content.ts` | Create | ManifestEntry, CategoryMeta, RecentlyViewedItem | Types |
| 5 | `src/types/navigation.ts` | Create | NavLink, NavCategory, NavTree | Types |
| 6 | `src/styles/brand.ts` | Create | Brand colors, font config, PROSE_CLASSES constant | BRAND, PROSE_CLASSES |
| 7 | `src/app/globals.css` | Modify | Import brand fonts, Tailwind config, print styles | -- |
| 8 | `src/app/layout.tsx` | Modify | Brand fonts via next/font, metadata, favicon | RootLayout |
| 9 | `.env.example` | Create | Document required env vars | -- |
| 10 | `.gitignore` | Modify | Add `content/` directory (fetched at build time) | -- |

### Layer 1: Content Pipeline

| # | File Path | Action | Purpose | Key Exports |
|---|-----------|--------|---------|-------------|
| 11 | `src/config/sync.config.ts` | Create | Repo, branch, include/exclude, category mappings | SYNC_CONFIG |
| 12 | `scripts/sync-content.ts` | Create | Build-time GitHub fetch, manifest + nav generation | main() |
| 13 | `src/lib/content/slug.ts` | Create | Slug generation from file paths | generateSlug, stripNumericPrefix |
| 14 | `src/lib/content/summary-parser.ts` | Create | Parse SUMMARY.md into NavTree | parseSummaryMd |
| 15 | `src/lib/content/manifest.ts` | Create | Read manifest.json + nav.json at build time | getManifest, getNavTree, getDocumentBySlug |
| 16 | `src/lib/content/link-rewriter.ts` | Create | Resolve relative .md links to KB slugs | rewriteInternalLink |

### Layer 2: Auth

| # | File Path | Action | Purpose | Key Exports |
|---|-----------|--------|---------|-------------|
| 17 | `src/lib/supabase/client.ts` | Create | Browser Supabase client (PKCE, navigator.locks bypass) | createClient |
| 18 | `src/lib/supabase/server.ts` | Create | Server Supabase client (cookie-based session) | createClient |
| 19 | `src/middleware.ts` | Create | Auth guard: redirect unauthenticated to /login | middleware, config |
| 20 | `src/app/login/page.tsx` | Create | Login form with email/password, error handling, redirect | LoginPage |
| 21 | `src/app/auth/callback/route.ts` | Create | PKCE callback handler (code exchange) | GET handler |

### Layer 3: Layout Shell

| # | File Path | Action | Purpose | Key Exports |
|---|-----------|--------|---------|-------------|
| 22 | `src/app/layout.tsx` | Modify | (already in L0 -- this layer adds AuthProvider wrapper) | RootLayout |
| 23 | `src/components/layout/AppShell.tsx` | Create | Main layout: sidebar + header + content area | AppShell |
| 24 | `src/components/layout/Sidebar.tsx` | Create | Nav tree from nav.json, collapse/expand, active state | Sidebar |
| 25 | `src/components/layout/Header.tsx` | Create | Logo, search trigger, breadcrumbs, user menu/logout | Header |
| 26 | `src/components/layout/Breadcrumbs.tsx` | Create | Breadcrumb trail from slug + nav tree | Breadcrumbs |
| 27 | `src/components/layout/MobileMenu.tsx` | Create | Hamburger menu overlay for <768px viewports | MobileMenu |

### Layer 4: Page Routes

| # | File Path | Action | Purpose | Key Exports |
|---|-----------|--------|---------|-------------|
| 28 | `src/app/page.tsx` | Modify | Homepage: category grid, recently viewed | HomePage |
| 29 | `src/components/home/CategoryGrid.tsx` | Create | Category cards with icons + counts | CategoryGrid |
| 30 | `src/components/home/RecentlyViewed.tsx` | Create | Last 10 viewed docs from localStorage | RecentlyViewed |
| 31 | `src/app/[...slug]/page.tsx` | Create | Catch-all route: document renderer OR category page | DocumentPage, generateStaticParams, generateMetadata |
| 32 | `src/components/document/DocumentRenderer.tsx` | Create | ReactMarkdown with GFM, prose styling, link rewriting | DocumentRenderer |
| 33 | `src/components/document/TableOfContents.tsx` | Create | Right-side TOC panel (h2/h3 links, active tracking) | TableOfContents |
| 34 | `src/components/document/DocumentHeader.tsx` | Create | Title, category badge, word count, reading time | DocumentHeader |
| 35 | `src/app/category/[key]/page.tsx` | Create | Category listing page with document cards | CategoryPage, generateStaticParams |
| 36 | `src/app/not-found.tsx` | Create | Branded 404 with search + home link | NotFound |

### Layer 5: Search

| # | File Path | Action | Purpose | Key Exports |
|---|-----------|--------|---------|-------------|
| 37 | `src/components/search/SearchDialog.tsx` | Create | Modal dialog, Cmd+K trigger, Pagefind integration | SearchDialog |
| 38 | `src/components/search/SearchResults.tsx` | Create | Result cards with title, snippet, category badge | SearchResults |
| 39 | `src/components/search/SearchTrigger.tsx` | Create | Visible search bar in header (click to open dialog) | SearchTrigger |
| 40 | `src/hooks/usePagefind.ts` | Create | Lazy-load Pagefind JS, debounced search hook | usePagefind |
| 41 | `src/types/pagefind.d.ts` | Create | Type declarations for Pagefind API | PagefindResult, PagefindSubResult |

### Layer 6: Polish and Deploy

| # | File Path | Action | Purpose | Key Exports |
|---|-----------|--------|---------|-------------|
| 42 | `src/components/document/ReadingProgressBar.tsx` | Create | Thin progress bar at viewport top | ReadingProgressBar |
| 43 | `src/components/ui/Skeleton.tsx` | Create | Branded skeleton/shimmer placeholder | Skeleton |
| 44 | `src/hooks/useRecentlyViewed.ts` | Create | localStorage read/write for recent docs | useRecentlyViewed |
| 45 | `src/app/globals.css` | Modify | (already modified in L0 -- this layer adds print @media) | -- |
| 46 | `scripts/postbuild.ts` | Create | Run Pagefind indexing + optional broken link report | main() |
| 47 | `vercel.json` | Create | Build command overrides, env var references | -- |
| 48 | `.claude/skills/deploy-kb/SKILL.md` | Create | /deploy-kb skill definition for Claude Code | -- |
| 49 | `package.json` | Modify | (already modified in L0 -- this layer updates build scripts) | -- |

**Total: 49 file operations (37 create, 12 modify) across 7 layers (0-6).**

---

## 7. Layered Build Order

### Layer 0: Project Config, Types, Brand Setup

**Goal:** Establish the project foundation so all subsequent layers can import types and use brand tokens.

**Files:** #1-10 (package.json, next.config.ts, tsconfig.json, types/content.ts, types/navigation.ts, styles/brand.ts, globals.css, layout.tsx, .env.example, .gitignore)

**Scenarios covered:** S-17 (brand styling), S-39 (performance via config)

**Dependencies:** None (starting point)

**Validation checkpoint:**
- `pnpm install` succeeds with all new dependencies
- `pnpm build` succeeds (still the default Next.js page, but with fonts + brand CSS applied)
- `npx tsc --noEmit` passes with zero errors
- Manual: open dev server, verify Ironmark fonts load, brand colors visible in globals.css

---

### Layer 1: Content Pipeline

**Goal:** Build the sync script that fetches content from GitHub and produces manifest.json + nav.json. This is the data foundation for all pages.

**Files:** #11-16 (sync.config.ts, sync-content.ts, slug.ts, summary-parser.ts, manifest.ts, link-rewriter.ts)

**Scenarios covered:** S-28 (GitHub fetch), S-29 (exclusions), S-30 (manifest), S-31 (slugs), S-32 (SUMMARY.md parse), S-33 (parse failure halts), S-35 (category metadata), S-45 (rate limit), S-49 (PAT auth), S-52 (atomic sync), S-53 (idempotent rebuild), S-14 (coverage warning), S-13 (empty category suppression)

**Dependencies:** Layer 0 (types)

**Validation checkpoint:**
- `npx tsx scripts/sync-content.ts` runs successfully against the live GitHub repo (requires `GITHUB_PAT` env var)
- `content/manifest.json` exists with ~345-370 entries
- `content/nav.json` exists with 24 categories
- Re-running sync produces byte-identical manifest.json
- Build warnings appear for any manifest entries not in nav.json
- `npx tsc --noEmit` passes

---

### Layer 2: Auth

**Goal:** Supabase auth that protects all routes. Users can log in, get redirected, refresh sessions, and log out.

**Files:** #17-21 (supabase/client.ts, supabase/server.ts, middleware.ts, login/page.tsx, auth/callback/route.ts)

**Scenarios covered:** S-01 (authenticated homepage), S-02 (unauthenticated redirect), S-03 (login), S-04 (session refresh), S-05 (deep link redirect), S-06 (login failure), S-07 (logout), S-50 (shared Supabase)

**Dependencies:** Layer 0 (brand for login page styling)

**Validation checkpoint:**
- `npx tsc --noEmit` passes
- `pnpm build` succeeds
- Manual: visiting `/` without a session redirects to `/login`
- Manual: logging in with valid PM app credentials redirects to `/`
- Manual: visiting `/login?redirect=/foo` after login redirects to `/foo`
- Manual: logout clears session and returns to `/login`

---

### Layer 3: Layout Shell

**Goal:** The persistent layout components: sidebar navigation, header with search trigger and breadcrumbs, responsive mobile menu. After this layer, the app has the full chrome -- pages inside are still placeholder.

**Files:** #22-27 (layout.tsx update, AppShell.tsx, Sidebar.tsx, Header.tsx, Breadcrumbs.tsx, MobileMenu.tsx)

**Scenarios covered:** S-09 (sidebar from SUMMARY.md), S-10 (collapse/expand), S-11 (breadcrumbs), S-17 (brand styling -- logo, favicon, page titles), S-18 (responsive mobile)

**Dependencies:** Layer 0 (brand), Layer 1 (nav.json via manifest.ts), Layer 2 (auth -- layout wraps auth provider, header has logout button)

**Validation checkpoint:**
- `npx tsc --noEmit` passes
- `pnpm build` succeeds
- Manual: sidebar renders nav tree from nav.json with 24 categories
- Manual: clicking a category expands/collapses its children
- Manual: on mobile (<768px), sidebar collapses to hamburger menu
- Manual: breadcrumbs render on nested routes
- Manual: Ironmark logo visible in sidebar header

---

### Layer 4: Page Routes

**Goal:** All page routes: homepage with category grid, document pages with markdown rendering, category listing pages, 404 page. After this layer, the site is fully functional for browsing.

**Files:** #28-36 (page.tsx, CategoryGrid.tsx, RecentlyViewed.tsx, [...slug]/page.tsx, DocumentRenderer.tsx, TableOfContents.tsx, DocumentHeader.tsx, category/[key]/page.tsx, not-found.tsx)

**Scenarios covered:** S-08 (category grid), S-12 (browse by category), S-15 (markdown rendering), S-16 (GFM tables), S-36 (internal link rewriting), S-37 (static generation), S-42 (404 page), S-43 (malformed markdown), S-19 (TOC panel), S-22 (reading time + word count), S-46 (broken links to 404), S-55 (recently viewed -- placeholder, finished in L6)

**Dependencies:** Layer 0 (types, brand), Layer 1 (manifest, nav, slug, link-rewriter), Layer 2 (auth for page access), Layer 3 (layout shell)

**Validation checkpoint:**
- `npx tsc --noEmit` passes
- `pnpm build` succeeds -- `generateStaticParams` produces ~345-370 pages
- Manual: homepage displays category grid with icons and counts
- Manual: clicking a category navigates to its listing page
- Manual: clicking a document renders its markdown content
- Manual: GFM tables render with horizontal scroll on narrow viewports
- Manual: navigating to `/strategy/nonexistent-slug` shows branded 404
- Manual: right-side TOC panel visible on wide viewports for documents with 3+ h2 headings

---

### Layer 5: Search

**Goal:** Pagefind search integration with a modal dialog accessible via header click or Cmd+K.

**Files:** #37-41 (SearchDialog.tsx, SearchResults.tsx, SearchTrigger.tsx, usePagefind.ts, pagefind.d.ts)

**Scenarios covered:** S-23 (search dialog + Cmd+K), S-24 (results with title/snippet/category), S-25 (close behavior), S-26 (keyboard navigation), S-27 (no results message), S-34 (Pagefind index), S-38 (lazy-loaded), S-40 (search <200ms), S-54 (consistent re-index)

**Dependencies:** Layer 0 (types, brand), Layer 4 (pages must exist for Pagefind to index)

**Validation checkpoint:**
- `npx tsc --noEmit` passes
- `pnpm build && npx pagefind --site .next/server/app --output-path public/pagefind` succeeds
- `public/pagefind/` directory contains index chunks
- Manual: Cmd+K opens search dialog
- Manual: typing 3+ characters produces results within 200ms
- Manual: results show title, snippet with highlights, category badge
- Manual: arrow keys navigate results, Enter navigates to selected result
- Manual: Escape closes dialog

---

### Layer 6: Polish and Deploy

**Goal:** Reading progress bar, skeleton loading states, print styles, recently viewed persistence, Pagefind postbuild script, Vercel config, deploy skill.

**Files:** #42-49 (ReadingProgressBar.tsx, Skeleton.tsx, useRecentlyViewed.ts, globals.css print update, postbuild.ts, vercel.json, deploy-kb skill, package.json build script update)

**Scenarios covered:** S-58 (reading progress bar), S-57 (skeleton states), S-56 (print stylesheet), S-55 (recently viewed -- full implementation), S-47 (broken link report), S-48 (deploy skill), S-51 (Vercel deploy), S-20 (code syntax highlighting -- basic monospace-on-gray, no advanced highlighting), S-21 (active heading tracking -- enhance TOC from L4), S-41 (image optimization -- basic Next.js Image where applicable)

**Dependencies:** All prior layers

**Validation checkpoint:**
- `npx tsc --noEmit` passes
- `pnpm build` succeeds (full pipeline: sync, build, pagefind)
- Manual: progress bar fills on document scroll
- Manual: Ctrl+P shows print-optimized view (no sidebar, no TOC, full-width content, Ironmark logo in header)
- Manual: skeleton placeholders appear during page transitions
- Manual: recently viewed section on homepage shows last 10 documents visited
- Manual: `vercel.json` is valid and build commands are correct

---

## 8. Scenario Coverage Matrix

Every scenario maps to at least one layer. P1 scenarios are bold.

| ID | Title | Priority | Layer(s) | Files |
|----|-------|----------|----------|-------|
| **S-01** | Authenticated users see homepage | P1 | L2, L4 | #19, #28 |
| **S-02** | Unauthenticated redirect to login | P1 | L2 | #19 |
| **S-03** | Login with Supabase credentials | P1 | L2 | #20, #21 |
| **S-04** | Session refresh on expired token | P1 | L2 | #19 |
| **S-05** | Redirect to original page after login | P1 | L2 | #19, #20 |
| **S-06** | Login failure feedback | P1 | L2 | #20 |
| **S-07** | Logout flow | P1 | L2, L3 | #20, #25 |
| **S-08** | Homepage displays category grid | P1 | L4 | #28, #29 |
| **S-09** | Sidebar navigation from SUMMARY.md | P1 | L3 | #24 |
| **S-10** | Sidebar category collapse/expand | P1 | L3 | #24 |
| **S-11** | Breadcrumb navigation on document pages | P1 | L3 | #26 |
| **S-12** | Browse documents by category | P1 | L4 | #35 |
| **S-13** | Empty category suppression | P1 | L1 | #12, #14 |
| **S-14** | SUMMARY.md coverage warning at build time | P1 | L1 | #12 |
| **S-15** | Document page renders markdown | P1 | L4 | #32 |
| **S-16** | GFM tables render with horizontal scroll | P1 | L4 | #32 |
| **S-17** | Ironmark brand styling applied | P1 | L0, L3 | #6, #7, #8, #23, #24, #25 |
| **S-18** | Responsive layout on mobile | P1 | L3 | #23, #27 |
| S-19 | Right-side table of contents panel | P2 | L4 | #33 |
| S-20 | Code blocks render with syntax highlighting | P3 | L6 | #32 (enhance) |
| S-21 | Active heading tracking on scroll | P3 | L6 | #33 (enhance) |
| S-22 | Reading time and word count displayed | P3 | L4 | #34 |
| **S-23** | Pagefind search via header bar and Cmd+K | P1 | L5 | #37, #39 |
| **S-24** | Search results show title, snippet, category | P1 | L5 | #38 |
| S-25 | Search dialog close behavior | P2 | L5 | #37 |
| S-26 | Keyboard navigation in search results | P2 | L5 | #37, #38 |
| S-27 | Search with no results shows helpful message | P2 | L5 | #38 |
| **S-28** | Build-time content fetch from GitHub API | P1 | L1 | #12 |
| **S-29** | Content exclusion rules applied | P1 | L1 | #11, #12 |
| **S-30** | Content manifest generation | P1 | L1 | #12 |
| **S-31** | URL slug generation from file paths | P1 | L1 | #13 |
| **S-32** | SUMMARY.md parsed into navigation structure | P1 | L1 | #14 |
| **S-33** | SUMMARY.md parse failure halts build | P1 | L1 | #14 |
| **S-34** | Pagefind index built at build time | P1 | L5, L6 | #46 |
| S-35 | Category metadata derived from directory structure | P2 | L1 | #11, #12 |
| S-36 | Internal cross-document links rewritten to KB URLs | P2 | L1, L4 | #16, #32 |
| **S-37** | Static generation for all document pages | P1 | L4 | #31 |
| **S-38** | Pagefind JS lazy-loaded on first search | P1 | L5 | #40 |
| **S-39** | Initial page load under 2 seconds | P1 | L0, L4 | #2, #31 |
| **S-40** | Search results appear within 200ms of typing | P1 | L5 | #40 |
| S-41 | Images optimized via Next.js Image component | P3 | L6 | #32 (enhance) |
| **S-42** | 404 page for nonexistent document slugs | P1 | L4 | #36 |
| **S-43** | Malformed markdown renders without crashing | P1 | L4 | #32 |
| S-44 | Sync script reports errors for failed fetches | P2 | L1 | #12 |
| **S-45** | GitHub API rate limit handling during sync | P1 | L1 | #12 |
| S-46 | Broken internal links navigate to 404 | P2 | L4 | #32, #36 |
| S-47 | Build-time broken link report | P3 | L6 | #46 |
| **S-48** | Manual deploy via /deploy-kb skill | P1 | L6 | #48 |
| **S-49** | GitHub PAT authentication for API calls | P1 | L1 | #12 |
| **S-50** | Shared Supabase project with PM app | P1 | L2 | #17, #18 |
| S-51 | Vercel deployment target | P2 | L6 | #47 |
| **S-52** | Atomic content sync (no partial corruption) | P1 | L1 | #12 |
| **S-53** | Rebuild with unchanged content produces identical output | P1 | L1 | #12, #13 |
| S-54 | Pagefind re-index on rebuild produces consistent results | P2 | L5 | #46 |
| S-55 | Recently viewed documents on homepage | P2 | L4, L6 | #30, #44 |
| S-56 | Print-optimized stylesheet | P2 | L6 | #45 |
| S-57 | Loading/skeleton states during transitions | P2 | L6 | #43 |
| S-58 | Reading progress bar | P3 | L6 | #42 |

### Coverage Summary

| Priority | Total | Covered | Percentage |
|----------|-------|---------|------------|
| P1 | 30 | 30 | 100% |
| P2 | 18 | 18 | 100% |
| P3 | 10 | 10 | 100% |
| **Total** | **58** | **58** | **100%** |

---

## 9. Dependency Map

### File Dependencies (imports from other project files)

```
src/types/content.ts              <- (no internal deps)
src/types/navigation.ts           <- (no internal deps)
src/types/pagefind.d.ts           <- (no internal deps)

src/styles/brand.ts               <- (no internal deps)

src/config/sync.config.ts         <- types/content

src/lib/content/slug.ts           <- (no internal deps)
src/lib/content/summary-parser.ts <- types/navigation, lib/content/slug
src/lib/content/manifest.ts       <- types/content, types/navigation
src/lib/content/link-rewriter.ts  <- lib/content/slug, lib/content/manifest

src/lib/supabase/client.ts        <- (external: @supabase/ssr)
src/lib/supabase/server.ts        <- (external: @supabase/ssr, @supabase/supabase-js)
src/middleware.ts                  <- lib/supabase (via @supabase/ssr inline)

src/hooks/usePagefind.ts          <- types/pagefind
src/hooks/useRecentlyViewed.ts    <- types/content

src/components/layout/AppShell.tsx      <- Sidebar, Header, MobileMenu
src/components/layout/Sidebar.tsx       <- types/navigation, lib/content/manifest, styles/brand
src/components/layout/Header.tsx        <- SearchTrigger, Breadcrumbs, styles/brand
src/components/layout/Breadcrumbs.tsx   <- types/navigation
src/components/layout/MobileMenu.tsx    <- Sidebar (reuses nav rendering)

src/components/home/CategoryGrid.tsx    <- types/content, styles/brand
src/components/home/RecentlyViewed.tsx  <- hooks/useRecentlyViewed

src/components/document/DocumentRenderer.tsx <- styles/brand (PROSE_CLASSES), lib/content/link-rewriter
src/components/document/TableOfContents.tsx  <- (self-contained, receives props)
src/components/document/DocumentHeader.tsx   <- types/content, styles/brand
src/components/document/ReadingProgressBar.tsx <- (self-contained)

src/components/search/SearchDialog.tsx  <- hooks/usePagefind, SearchResults
src/components/search/SearchResults.tsx <- types/pagefind, styles/brand
src/components/search/SearchTrigger.tsx <- (self-contained, fires callback)

src/components/ui/Skeleton.tsx          <- (self-contained)

src/app/layout.tsx                      <- styles/brand, components/layout/AppShell
src/app/page.tsx                        <- CategoryGrid, RecentlyViewed, lib/content/manifest
src/app/[...slug]/page.tsx              <- DocumentRenderer, TableOfContents, DocumentHeader, lib/content/manifest
src/app/category/[key]/page.tsx         <- lib/content/manifest, styles/brand
src/app/login/page.tsx                  <- lib/supabase/client, styles/brand
src/app/auth/callback/route.ts          <- lib/supabase/server
src/app/not-found.tsx                   <- SearchTrigger, styles/brand

scripts/sync-content.ts                 <- config/sync.config, lib/content/slug, lib/content/summary-parser, types/content, types/navigation
scripts/postbuild.ts                    <- lib/content/manifest (for broken link report)
```

### External Dependencies

```
Next.js 16           <- React 19, React DOM 19
@supabase/ssr        <- @supabase/supabase-js
react-markdown       <- remark-gfm
Tailwind CSS 4       <- @tailwindcss/postcss, @tailwindcss/typography
lucide-react         <- (standalone)
framer-motion        <- (standalone)
clsx                 <- (standalone)
pagefind             <- (dev, CLI only)
tsx                  <- (dev, script runner)
minimatch            <- (dev, used in sync script)
```

---

## 10. Key Design Decisions

### 10.1 Catch-All Route vs. Separate Routes

The `[...slug]` catch-all handles both document pages and potentially unresolved paths. At build time, `generateStaticParams` produces params for every manifest entry. At runtime, any non-matching slug triggers the Next.js `notFound()` function, rendering `not-found.tsx`.

Category pages use a separate route (`/category/[key]`) rather than overloading the catch-all. This keeps the slug namespace clean -- document slugs never collide with category keys because documents always have multi-segment paths (`/strategy/vision/master-strategy`) while categories are at `/category/market-research`.

### 10.2 Content as Files, Not JSON Blobs

The sync script writes actual `.md` files to `content/docs/`, not a single JSON blob. Benefits:
- `generateStaticParams` + `fs.readFileSync` per page keeps memory usage flat during build.
- Git diff shows exactly which documents changed (even though content/ is gitignored, the developer can inspect locally).
- Pagefind indexes the rendered HTML, not raw markdown -- the build pipeline is `md files -> SSG HTML -> Pagefind index`.

### 10.3 nav.json Separate from manifest.json

The navigation tree (parsed from SUMMARY.md) is a separate file from the content manifest. This allows:
- The sidebar to load only the nav tree (small) without pulling the full manifest.
- The manifest to include documents not in SUMMARY.md (searchable but not in nav).
- Independent validation: "is every nav entry in the manifest?" and "is every manifest entry in the nav?" are separate checks.

### 10.4 No @tailwindcss/typography at V4

Tailwind CSS 4 has a different plugin model. The `@tailwindcss/typography` plugin may need the v4-compatible version or manual prose classes. The `PROSE_CLASSES` constant in `src/styles/brand.ts` will define all typography styles explicitly using Tailwind utility classes (same pattern as the PM app's `PREMIUM_PROSE_CLASSES`), providing full control and no dependency on the typography plugin's compatibility status. If the v4-compatible typography plugin is available and stable, it can be used as an enhancement, but the explicit classes are the primary approach.

### 10.5 Pagefind Integration with Next.js App Router

Pagefind needs pre-rendered HTML to index. With Next.js 16 App Router SSG:
- Pages are pre-rendered to `.next/server/app/` as HTML files.
- The postbuild script runs `pagefind --site .next/server/app --output-path public/pagefind`.
- The `public/pagefind/` directory is served statically by Next.js.
- The client loads Pagefind JS from `/pagefind/pagefind.js` on first search dialog open.

This is the same approach used by Nextra 4.

### 10.6 Print Stylesheet Strategy

Print styles are implemented as `@media print` rules in `globals.css` rather than a separate stylesheet. This approach:
- Hides sidebar, header, TOC panel, search, and mobile menu.
- Renders document content full-width with appropriate margins.
- Ensures tables do not overflow the print area (forced `table-layout: fixed` or reduced font size).
- Adds the Ironmark logo as a print header via CSS `@page` or a hidden element made visible only in print.

---

## 11. Build Scripts

### package.json scripts (final state)

```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "tsx scripts/sync-content.ts",
    "build": "next build",
    "postbuild": "tsx scripts/postbuild.ts",
    "start": "next start",
    "lint": "eslint",
    "sync": "tsx scripts/sync-content.ts",
    "typecheck": "tsc --noEmit"
  }
}
```

The full build pipeline is: `pnpm build` which triggers `prebuild` (sync) -> `build` (Next.js SSG) -> `postbuild` (Pagefind index + optional link report).

### Environment Variables

```
# Required
GITHUB_PAT=                          # GitHub Personal Access Token for content fetch
NEXT_PUBLIC_SUPABASE_URL=            # Shared Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # Shared Supabase anon key

# Optional
SUPABASE_SERVICE_ROLE_KEY=           # For server-side operations (fallback in tests)
```

---

## 12. Risk Notes for Implementers

1. **Pagefind + Next.js 16 path:** The `.next/server/app` directory structure may vary by Next.js version. The postbuild script should verify the path exists before running Pagefind and fail with a clear message if not found.

2. **Tailwind CSS 4 breaking changes:** Tailwind v4 has a new configuration model (CSS-first instead of `tailwind.config.js`). The prose classes approach must work with Tailwind v4's utility class system. Test typography rendering early in Layer 0.

3. **SUMMARY.md evolution:** The SUMMARY.md will be expanded before ship. The sync script must handle additions gracefully. The coverage warning (S-14) is the safety net.

4. **Rate limiting at scale:** With ~370 files and GitHub's 5,000/hr limit, a single sync is safe. But rapid re-syncs (debugging) could hit limits. The rate-limit handler (S-45) with wait-and-retry is critical for developer experience.

5. **Content directory gitignore:** `content/` must be in `.gitignore` because it is rebuilt from source. But the build pipeline must handle the case where `content/` does not exist (first build on a new machine).

---

*Spec ready for Don's review. Once approved, proceed to Test Writer (Step 8b) and then layered implementation.*

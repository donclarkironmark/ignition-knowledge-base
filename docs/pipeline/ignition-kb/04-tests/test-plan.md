# Test Plan: Ignition Knowledge Base

**Date:** 2026-03-17
**Input:** approved.md (58 scenarios), spec.md (7 layers, 49 files)
**Status:** Ready for implementation

---

## 1. Test Strategy

### 1.1 Test Framework and Tooling

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit and integration test runner (ESM-native, fast, compatible with Next.js) |
| **React Testing Library** | Component rendering and DOM assertions |
| **@testing-library/user-event** | Simulating user interactions (clicks, keyboard, typing) |
| **jsdom** | DOM environment for component tests (via Vitest) |
| **Playwright** | E2E tests for critical user journeys (auth flow, search, navigation) |

### 1.2 Test Types by Layer

| Layer | Primary Test Type | Secondary | Notes |
|-------|-------------------|-----------|-------|
| L0: Config/Types | Unit | -- | Type-only validation via tsc, brand constants via unit |
| L1: Content Pipeline | Unit | Integration | Pure functions (slug, parser, manifest). Integration for sync script with mocked GitHub API |
| L2: Auth | Integration | E2E | Middleware logic with mocked Supabase. E2E for full login/logout flow |
| L3: Layout Shell | Component | -- | React Testing Library for sidebar, header, breadcrumbs, responsive |
| L4: Page Routes | Component | Unit | Page rendering with mocked data. Unit for generateStaticParams logic |
| L5: Search | Component | E2E | Dialog behavior with mocked Pagefind. E2E for real search flow |
| L6: Polish/Deploy | Component | Unit | UI polish components. Unit for postbuild script logic |

### 1.3 Mock Strategy

**GitHub API (Layer 1):**
- Mock `fetch` globally in sync script tests
- Provide fixture responses for tree API, contents API, rate-limit headers
- Test both success paths and error paths (403 rate limit, 404, partial failures)

**Supabase (Layer 2):**
- Mock `@supabase/ssr` createClient functions
- Mock `supabase.auth.getUser()`, `signInWithPassword()`, `signOut()`
- Provide fixtures for valid session, expired session, no session, invalid credentials

**Pagefind (Layer 5):**
- Mock the Pagefind API (`window.pagefind.search()`, `window.pagefind.init()`)
- Provide fixture search results matching the PagefindResult interface
- Test lazy-loading by verifying dynamic import is called only on dialog open

**File System (Layer 1):**
- Use Vitest's `vi.mock('node:fs')` for sync script file operations
- Provide in-memory file fixtures for manifest.json and nav.json reads

**Next.js (Layers 3-4):**
- Mock `next/navigation` (useRouter, usePathname, useSearchParams)
- Mock `next/link` as a simple anchor element
- Provide static props via test wrappers rather than mocking server components directly

### 1.4 What Requires E2E vs. Unit/Component

**E2E Required (Playwright):**
- S-02/S-03/S-05/S-07: Full auth redirect flow with real browser cookies
- S-23/S-24: Search dialog with real Pagefind index loading
- S-39: LCP measurement (Lighthouse or performance.measure)
- S-40: Search latency measurement

**Unit/Component Sufficient:**
- All data pipeline scenarios (S-28 through S-36, S-44, S-45, S-49, S-52, S-53)
- All UI rendering scenarios (S-08 through S-18, S-19 through S-22)
- All error handling scenarios (S-42, S-43, S-46)
- All polish scenarios (S-55 through S-58)

---

## 2. Test File Inventory

### 2.1 Layer 0: Config/Types/Brand

| File | Purpose | Scenarios |
|------|---------|-----------|
| `__tests__/styles/brand.test.ts` | Brand constants are defined with correct hex values, font names, prose classes | S-17 |

**Test count: 1 file, ~5 tests**

### 2.2 Layer 1: Content Pipeline

| File | Purpose | Scenarios |
|------|---------|-----------|
| `__tests__/lib/content/slug.test.ts` | Slug generation: numeric prefix stripping, lowercase, kebab-case, stability | S-31, S-53 |
| `__tests__/lib/content/summary-parser.test.ts` | SUMMARY.md parsing: categories, links, malformed entries, missing file, empty result | S-32, S-33, S-13, S-14 |
| `__tests__/lib/content/manifest.test.ts` | Manifest read functions: getManifest, getNavTree, getDocumentBySlug | S-30 |
| `__tests__/lib/content/link-rewriter.test.ts` | Internal link rewriting: relative .md paths to KB slugs, broken links | S-36, S-46 |
| `__tests__/config/sync-config.test.ts` | Sync config: exclusion patterns match expected dirs, include patterns correct | S-29 |
| `__tests__/scripts/sync-content.test.ts` | Sync script integration: GitHub API mocking, atomic swap, rate limiting, error reporting, idempotency | S-28, S-29, S-44, S-45, S-49, S-52, S-53 |

**Test count: 6 files, ~55 tests**

### 2.3 Layer 2: Auth

| File | Purpose | Scenarios |
|------|---------|-----------|
| `__tests__/middleware.test.ts` | Middleware: redirect unauthenticated, pass authenticated, refresh expired, preserve redirect param | S-01, S-02, S-04, S-05 |
| `__tests__/app/login/login-page.test.tsx` | Login page: form rendering, submit with valid creds, submit with invalid creds, error display, redirect after login | S-03, S-05, S-06 |
| `__tests__/app/auth/callback.test.ts` | Auth callback: code exchange, redirect handling | S-03 |
| `e2e/auth.spec.ts` | E2E: full login flow, logout flow, deep link redirect, session persistence | S-02, S-03, S-05, S-07 |

**Test count: 4 files, ~25 tests**

### 2.4 Layer 3: Layout Shell

| File | Purpose | Scenarios |
|------|---------|-----------|
| `__tests__/components/layout/Sidebar.test.tsx` | Sidebar: renders nav tree, collapse/expand, active document highlight, SUMMARY.md-only content | S-09, S-10 |
| `__tests__/components/layout/Header.test.tsx` | Header: logo present, search trigger visible, user menu/logout button | S-17, S-07 |
| `__tests__/components/layout/Breadcrumbs.test.tsx` | Breadcrumbs: path segments rendered, links clickable, home link present | S-11 |
| `__tests__/components/layout/MobileMenu.test.tsx` | Mobile menu: hamburger button visible at narrow viewport, sidebar hidden by default, toggle behavior | S-18 |
| `__tests__/components/layout/AppShell.test.tsx` | AppShell: integrates sidebar + header + content area, responsive layout | S-17, S-18 |

**Test count: 5 files, ~25 tests**

### 2.5 Layer 4: Page Routes

| File | Purpose | Scenarios |
|------|---------|-----------|
| `__tests__/app/home-page.test.tsx` | Homepage: category grid rendered, correct card count, icons and counts displayed | S-08 |
| `__tests__/components/home/CategoryGrid.test.tsx` | CategoryGrid: cards render with name/icon/count, empty categories suppressed, click navigates | S-08, S-12, S-13 |
| `__tests__/components/home/RecentlyViewed.test.tsx` | RecentlyViewed: renders items from localStorage, max 10 items, empty state | S-55 |
| `__tests__/app/document-page.test.tsx` | Document page: renders markdown content, passes correct props, generates metadata, 404 for unknown slug | S-15, S-37, S-42 |
| `__tests__/components/document/DocumentRenderer.test.tsx` | Markdown rendering: headings, lists, bold/italic, GFM tables with scroll wrapper, malformed markdown resilience, internal link rewriting | S-15, S-16, S-36, S-43 |
| `__tests__/components/document/TableOfContents.test.tsx` | TOC: renders h2/h3 links, hidden when fewer than 3 headings, hidden on narrow viewport | S-19 |
| `__tests__/components/document/DocumentHeader.test.tsx` | Document header: title, category badge, word count, reading time calculation | S-22 |
| `__tests__/app/category-page.test.tsx` | Category page: lists documents with titles and summaries, respects SUMMARY.md order | S-12 |
| `__tests__/app/not-found.test.tsx` | 404 page: message displayed, search bar present, home link present | S-42 |

**Test count: 9 files, ~45 tests**

### 2.6 Layer 5: Search

| File | Purpose | Scenarios |
|------|---------|-----------|
| `__tests__/components/search/SearchDialog.test.tsx` | Search dialog: opens on click, opens on Cmd+K, closes on Escape/click-outside/Cmd+K, auto-focus input | S-23, S-25 |
| `__tests__/components/search/SearchResults.test.tsx` | Search results: title/snippet/category displayed, highlighted terms, click navigates, no-results message | S-24, S-27 |
| `__tests__/components/search/SearchTrigger.test.tsx` | Search trigger: visible in header, click opens dialog | S-23 |
| `__tests__/hooks/usePagefind.test.ts` | Pagefind hook: lazy loads on first call, debounces queries, returns results within interface contract | S-38, S-40 |
| `__tests__/components/search/KeyboardNav.test.tsx` | Keyboard navigation: arrow keys move focus, Enter navigates | S-26 |
| `e2e/search.spec.ts` | E2E: real Pagefind index, type query, see results, navigate to document | S-23, S-24, S-34, S-40 |

**Test count: 6 files, ~30 tests**

### 2.7 Layer 6: Polish and Deploy

| File | Purpose | Scenarios |
|------|---------|-----------|
| `__tests__/components/document/ReadingProgressBar.test.tsx` | Progress bar: renders at 0% initially, updates on scroll mock | S-58 |
| `__tests__/components/ui/Skeleton.test.tsx` | Skeleton: renders shimmer placeholder, matches branded styling | S-57 |
| `__tests__/hooks/useRecentlyViewed.test.ts` | Recently viewed hook: reads/writes localStorage, max 10 items, deduplication, most-recent-first order | S-55 |
| `__tests__/scripts/postbuild.test.ts` | Postbuild script: Pagefind invocation, broken link report generation | S-34, S-47 |

**Test count: 4 files, ~18 tests**

### 2.8 E2E Tests (Playwright)

| File | Purpose | Scenarios |
|------|---------|-----------|
| `e2e/auth.spec.ts` | Login, logout, deep link redirect, session refresh | S-02, S-03, S-05, S-07 |
| `e2e/search.spec.ts` | Search dialog, real results, keyboard navigation | S-23, S-24, S-34, S-40 |
| `e2e/navigation.spec.ts` | Sidebar navigation, category pages, document rendering, 404 | S-09, S-12, S-15, S-42 |
| `e2e/performance.spec.ts` | LCP measurement, search latency | S-39, S-40 |

**Test count: 4 files, ~15 tests**

---

## 3. Test Cases by Scenario

### Auth (S-01 through S-07)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| **S-01** | P1 | Integration | `__tests__/middleware.test.ts` | Given valid session cookie, middleware calls next() without redirect |
| **S-02** | P1 | Integration + E2E | `__tests__/middleware.test.ts`, `e2e/auth.spec.ts` | Given no session cookie, middleware redirects to /login with redirect param preserving original URL |
| **S-03** | P1 | Component + E2E | `__tests__/app/login/login-page.test.tsx`, `e2e/auth.spec.ts` | Login form calls signInWithPassword with email/password, on success redirects to homepage or redirect param |
| **S-04** | P1 | Integration | `__tests__/middleware.test.ts` | Given expired access token + valid refresh token, middleware refreshes session transparently (getUser triggers refresh) |
| **S-05** | P1 | Component + E2E | `__tests__/app/login/login-page.test.tsx`, `e2e/auth.spec.ts` | After login, redirect to searchParams.redirect value instead of homepage |
| **S-06** | P1 | Component | `__tests__/app/login/login-page.test.tsx` | On invalid credentials, display "Incorrect email or password" message, form remains editable, no email-exists leakage |
| **S-07** | P1 | Component + E2E | `__tests__/components/layout/Header.test.tsx`, `e2e/auth.spec.ts` | Logout button calls signOut, clears session, redirects to /login |

### Navigation (S-08 through S-14)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| **S-08** | P1 | Component | `__tests__/components/home/CategoryGrid.test.tsx` | Grid renders category cards with name, icon (from lucide-react), and document count |
| **S-09** | P1 | Component + E2E | `__tests__/components/layout/Sidebar.test.tsx`, `e2e/navigation.spec.ts` | Sidebar renders NavTree categories with nested document links matching SUMMARY.md structure |
| **S-10** | P1 | Component | `__tests__/components/layout/Sidebar.test.tsx` | Clicking category heading toggles children visibility; current doc's parent category starts expanded |
| **S-11** | P1 | Component | `__tests__/components/layout/Breadcrumbs.test.tsx` | Breadcrumb renders "Home > Category > Document" with each segment as a clickable link |
| **S-12** | P1 | Component + E2E | `__tests__/app/category-page.test.tsx`, `e2e/navigation.spec.ts` | Category page lists documents with titles and first-line summaries in SUMMARY.md order |
| **S-13** | P1 | Unit | `__tests__/lib/content/summary-parser.test.ts` | Categories with zero documents after filtering are excluded from nav tree; build warning logged |
| **S-14** | P1 | Unit | `__tests__/lib/content/summary-parser.test.ts` | Files in manifest but not in SUMMARY.md produce build-time warning listing file path |

### Display (S-15 through S-22)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| **S-15** | P1 | Component + E2E | `__tests__/components/document/DocumentRenderer.test.tsx`, `e2e/navigation.spec.ts` | Markdown renders with correct heading hierarchy (h1-h6), paragraphs, bold/italic, lists, blockquotes, links |
| **S-16** | P1 | Component | `__tests__/components/document/DocumentRenderer.test.tsx` | GFM table wrapped in horizontal-scroll container; no full-page horizontal scroll |
| **S-17** | P1 | Unit + Component | `__tests__/styles/brand.test.ts`, `__tests__/components/layout/AppShell.test.tsx` | Brand colors (#EF462F, #38C6F4, #707070, #f4f2f2), fonts (Raleway, Bebas Neue, Lora), logo in sidebar, page title format |
| **S-18** | P1 | Component | `__tests__/components/layout/MobileMenu.test.tsx` | Below 768px: sidebar collapses to hamburger menu, content fills full width |
| S-19 | P2 | Component | `__tests__/components/document/TableOfContents.test.tsx` | TOC panel renders h2/h3 links when 3+ h2 headings exist; hidden below 1280px viewport |
| S-20 | P3 | Component | `__tests__/components/document/DocumentRenderer.test.tsx` | Fenced code blocks render with monospace font and distinct background |
| S-21 | P3 | Component | `__tests__/components/document/TableOfContents.test.tsx` | Active TOC entry updates when heading enters top 120px of viewport (via IntersectionObserver mock) |
| S-22 | P3 | Component | `__tests__/components/document/DocumentHeader.test.tsx` | Reading time = ceil(wordCount / 200) minutes; word count displayed |

### Search (S-23 through S-27)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| **S-23** | P1 | Component + E2E | `__tests__/components/search/SearchDialog.test.tsx`, `e2e/search.spec.ts` | Dialog opens on search trigger click and Cmd+K/Ctrl+K; input auto-focused |
| **S-24** | P1 | Component + E2E | `__tests__/components/search/SearchResults.test.tsx`, `e2e/search.spec.ts` | Results display title, highlighted snippet, category badge; click navigates to document |
| S-25 | P2 | Component | `__tests__/components/search/SearchDialog.test.tsx` | Escape, click-outside, and Cmd+K close dialog; focus returns to previous element |
| S-26 | P2 | Component | `__tests__/components/search/KeyboardNav.test.tsx` | Arrow keys move visual focus between results; Enter navigates to focused result |
| S-27 | P2 | Component | `__tests__/components/search/SearchResults.test.tsx` | Zero results displays "No documents match your search" message |

### Data Pipeline (S-28 through S-36)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| **S-28** | P1 | Integration | `__tests__/scripts/sync-content.test.ts` | Sync script fetches tree API, then contents API for each file, writes to content/ preserving structure |
| **S-29** | P1 | Unit + Integration | `__tests__/config/sync-config.test.ts`, `__tests__/scripts/sync-content.test.ts` | Excluded directories (docs-donai/, docs/06-updates/, etc.) are skipped; not in manifest or content/ |
| **S-30** | P1 | Unit + Integration | `__tests__/lib/content/manifest.test.ts`, `__tests__/scripts/sync-content.test.ts` | manifest.json contains array of objects with slug, title, category, filePath, wordCount |
| **S-31** | P1 | Unit | `__tests__/lib/content/slug.test.ts` | Slug algorithm: strips "docs/" prefix, strips numeric prefixes per segment, lowercase, drops .md, prepends / |
| **S-32** | P1 | Unit | `__tests__/lib/content/summary-parser.test.ts` | SUMMARY.md parsed into NavTree: ## headings become categories, - [title](path) become links, malformed entries skipped with line-number warning |
| **S-33** | P1 | Unit | `__tests__/lib/content/summary-parser.test.ts` | Missing SUMMARY.md or zero valid categories throws error halting build |
| **S-34** | P1 | Unit + E2E | `__tests__/scripts/postbuild.test.ts`, `e2e/search.spec.ts` | Pagefind index produced in public/pagefind/ covering all document pages |
| S-35 | P2 | Unit | `__tests__/lib/content/slug.test.ts` | Category derived from first directory segment; display name strips numeric prefix; sort order from prefix |
| S-36 | P2 | Unit + Component | `__tests__/lib/content/link-rewriter.test.ts`, `__tests__/components/document/DocumentRenderer.test.tsx` | Relative .md links rewritten to KB slugs; non-resolvable links left as-is |

### Performance (S-37 through S-41)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| **S-37** | P1 | Unit | `__tests__/app/document-page.test.tsx` | generateStaticParams returns an entry for every document in manifest |
| **S-38** | P1 | Unit | `__tests__/hooks/usePagefind.test.ts` | Pagefind JS not imported until first search invocation; dynamic import used |
| **S-39** | P1 | E2E | `e2e/performance.spec.ts` | LCP under 2 seconds on statically generated page (Lighthouse CI or performance.measure) |
| **S-40** | P1 | Unit + E2E | `__tests__/hooks/usePagefind.test.ts`, `e2e/performance.spec.ts` | Search debounce configured; results callback fires within 200ms of last keystroke |
| S-41 | P3 | Component | `__tests__/components/document/DocumentRenderer.test.tsx` | Images in markdown use Next.js Image component or img with lazy loading |

### Error Handling (S-42 through S-47)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| **S-42** | P1 | Component + E2E | `__tests__/app/not-found.test.tsx`, `e2e/navigation.spec.ts` | 404 page shows "Document not found" message, search bar, and home link |
| **S-43** | P1 | Component | `__tests__/components/document/DocumentRenderer.test.tsx` | Malformed markdown (unclosed code blocks, broken tables, HTML fragments) renders without crashing; surrounding content intact |
| S-44 | P2 | Integration | `__tests__/scripts/sync-content.test.ts` | Failed file fetch logged with path + status; script continues; summary includes failed count |
| **S-45** | P1 | Integration | `__tests__/scripts/sync-content.test.ts` | 403 rate-limit response triggers wait using X-RateLimit-Reset header; aborts if reset > 5 minutes |
| S-46 | P2 | Component | `__tests__/components/document/DocumentRenderer.test.tsx` | Broken internal link href resolves to a path that triggers 404 page |
| S-47 | P3 | Unit | `__tests__/scripts/postbuild.test.ts` | Broken link report lists source document, line number, and broken target for unresolvable internal links |

### Integration (S-48 through S-51)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| **S-48** | P1 | Manual | -- | Deploy skill file exists at .claude/skills/deploy-kb/SKILL.md with correct build commands. Validated manually. |
| **S-49** | P1 | Integration | `__tests__/scripts/sync-content.test.ts` | Sync script sends Authorization header with GitHub PAT from env var |
| **S-50** | P1 | Unit | `__tests__/middleware.test.ts` | Middleware uses NEXT_PUBLIC_SUPABASE_URL and ANON_KEY env vars (same as PM app) |
| S-51 | P2 | Manual | -- | vercel.json contains correct build commands and env var references. Validated manually at deploy time. |

### Reliability (S-52 through S-54)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| **S-52** | P1 | Integration | `__tests__/scripts/sync-content.test.ts` | On partial failure: temp dir not promoted, original content/ untouched, exit code non-zero |
| **S-53** | P1 | Unit | `__tests__/lib/content/slug.test.ts`, `__tests__/scripts/sync-content.test.ts` | Same input produces identical slug and manifest output on repeated runs |
| S-54 | P2 | E2E | `e2e/search.spec.ts` | Same query returns same results after rebuild with no content changes |

### UX Polish (S-55 through S-58)

| Scenario | Priority | Test Type | Test File | Description |
|----------|----------|-----------|-----------|-------------|
| S-55 | P2 | Unit + Component | `__tests__/hooks/useRecentlyViewed.test.ts`, `__tests__/components/home/RecentlyViewed.test.tsx` | Hook stores/retrieves last 10 items from localStorage; component renders them with titles and category badges |
| S-56 | P2 | Manual | -- | Print stylesheet hides sidebar/TOC, renders full-width, Ironmark logo in header. Validated visually via Ctrl+P. |
| S-57 | P2 | Component | `__tests__/components/ui/Skeleton.test.tsx` | Skeleton component renders with shimmer animation class; no layout shift when content loads |
| S-58 | P3 | Component | `__tests__/components/document/ReadingProgressBar.test.tsx` | Progress bar width is 0% at top, proportional to scroll position |

---

## 4. Coverage Matrix

| ID | Priority | Test File(s) | Test Type | Automated? |
|----|----------|-------------|-----------|------------|
| **S-01** | P1 | `middleware.test.ts` | Integration | Yes |
| **S-02** | P1 | `middleware.test.ts`, `e2e/auth.spec.ts` | Integration + E2E | Yes |
| **S-03** | P1 | `login-page.test.tsx`, `callback.test.ts`, `e2e/auth.spec.ts` | Component + E2E | Yes |
| **S-04** | P1 | `middleware.test.ts` | Integration | Yes |
| **S-05** | P1 | `login-page.test.tsx`, `e2e/auth.spec.ts` | Component + E2E | Yes |
| **S-06** | P1 | `login-page.test.tsx` | Component | Yes |
| **S-07** | P1 | `Header.test.tsx`, `e2e/auth.spec.ts` | Component + E2E | Yes |
| **S-08** | P1 | `CategoryGrid.test.tsx`, `home-page.test.tsx` | Component | Yes |
| **S-09** | P1 | `Sidebar.test.tsx`, `e2e/navigation.spec.ts` | Component + E2E | Yes |
| **S-10** | P1 | `Sidebar.test.tsx` | Component | Yes |
| **S-11** | P1 | `Breadcrumbs.test.tsx` | Component | Yes |
| **S-12** | P1 | `category-page.test.tsx`, `e2e/navigation.spec.ts` | Component + E2E | Yes |
| **S-13** | P1 | `summary-parser.test.ts` | Unit | Yes |
| **S-14** | P1 | `summary-parser.test.ts` | Unit | Yes |
| **S-15** | P1 | `DocumentRenderer.test.tsx`, `e2e/navigation.spec.ts` | Component + E2E | Yes |
| **S-16** | P1 | `DocumentRenderer.test.tsx` | Component | Yes |
| **S-17** | P1 | `brand.test.ts`, `AppShell.test.tsx` | Unit + Component | Yes |
| **S-18** | P1 | `MobileMenu.test.tsx`, `AppShell.test.tsx` | Component | Yes |
| S-19 | P2 | `TableOfContents.test.tsx` | Component | Yes |
| S-20 | P3 | `DocumentRenderer.test.tsx` | Component | Yes |
| S-21 | P3 | `TableOfContents.test.tsx` | Component | Yes |
| S-22 | P3 | `DocumentHeader.test.tsx` | Component | Yes |
| **S-23** | P1 | `SearchDialog.test.tsx`, `SearchTrigger.test.tsx`, `e2e/search.spec.ts` | Component + E2E | Yes |
| **S-24** | P1 | `SearchResults.test.tsx`, `e2e/search.spec.ts` | Component + E2E | Yes |
| S-25 | P2 | `SearchDialog.test.tsx` | Component | Yes |
| S-26 | P2 | `KeyboardNav.test.tsx` | Component | Yes |
| S-27 | P2 | `SearchResults.test.tsx` | Component | Yes |
| **S-28** | P1 | `sync-content.test.ts` | Integration | Yes |
| **S-29** | P1 | `sync-config.test.ts`, `sync-content.test.ts` | Unit + Integration | Yes |
| **S-30** | P1 | `manifest.test.ts`, `sync-content.test.ts` | Unit + Integration | Yes |
| **S-31** | P1 | `slug.test.ts` | Unit | Yes |
| **S-32** | P1 | `summary-parser.test.ts` | Unit | Yes |
| **S-33** | P1 | `summary-parser.test.ts` | Unit | Yes |
| **S-34** | P1 | `postbuild.test.ts`, `e2e/search.spec.ts` | Unit + E2E | Yes |
| S-35 | P2 | `slug.test.ts` | Unit | Yes |
| S-36 | P2 | `link-rewriter.test.ts`, `DocumentRenderer.test.tsx` | Unit + Component | Yes |
| **S-37** | P1 | `document-page.test.tsx` | Unit | Yes |
| **S-38** | P1 | `usePagefind.test.ts` | Unit | Yes |
| **S-39** | P1 | `e2e/performance.spec.ts` | E2E | Yes |
| **S-40** | P1 | `usePagefind.test.ts`, `e2e/performance.spec.ts` | Unit + E2E | Yes |
| S-41 | P3 | `DocumentRenderer.test.tsx` | Component | Yes |
| **S-42** | P1 | `not-found.test.tsx`, `e2e/navigation.spec.ts` | Component + E2E | Yes |
| **S-43** | P1 | `DocumentRenderer.test.tsx` | Component | Yes |
| S-44 | P2 | `sync-content.test.ts` | Integration | Yes |
| **S-45** | P1 | `sync-content.test.ts` | Integration | Yes |
| S-46 | P2 | `DocumentRenderer.test.tsx` | Component | Yes |
| S-47 | P3 | `postbuild.test.ts` | Unit | Yes |
| **S-48** | P1 | -- | Manual | No |
| **S-49** | P1 | `sync-content.test.ts` | Integration | Yes |
| **S-50** | P1 | `middleware.test.ts` | Unit | Yes |
| S-51 | P2 | -- | Manual | No |
| **S-52** | P1 | `sync-content.test.ts` | Integration | Yes |
| **S-53** | P1 | `slug.test.ts`, `sync-content.test.ts` | Unit + Integration | Yes |
| S-54 | P2 | `e2e/search.spec.ts` | E2E | Yes |
| S-55 | P2 | `useRecentlyViewed.test.ts`, `RecentlyViewed.test.tsx` | Unit + Component | Yes |
| S-56 | P2 | -- | Manual | No |
| S-57 | P2 | `Skeleton.test.tsx` | Component | Yes |
| S-58 | P3 | `ReadingProgressBar.test.tsx` | Component | Yes |

### Coverage Summary

| Priority | Total | Automated Tests | Manual Only | Coverage |
|----------|-------|-----------------|-------------|----------|
| P1 | 30 | 29 | 1 (S-48) | 97% automated |
| P2 | 18 | 15 | 3 (S-51, S-56) | 83% automated |
| P3 | 10 | 10 | 0 | 100% automated |
| **Total** | **58** | **54** | **4** | **93% automated** |

**Manual-only justification:**
- **S-48** (deploy skill): A Claude Code skill definition file -- tested by running the skill, not by automated test
- **S-51** (Vercel deploy): Infrastructure configuration validated at deploy time
- **S-56** (print stylesheet): CSS @media print requires visual browser validation; cannot meaningfully assert in JSDOM

---

## 5. Test Dependencies

### 5.1 Packages to Install

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  playwright @playwright/test
```

### 5.2 Vitest Configuration

Create `vitest.config.ts` at project root:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

### 5.3 Test Setup File

Create `__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest';

// Mock next/navigation globally
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  redirect: vi.fn(),
}));

// Mock next/link as a simple anchor
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));
```

### 5.4 Playwright Configuration

Create `playwright.config.ts` at project root:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  webServer: {
    command: 'pnpm start',
    port: 3000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

### 5.5 Package.json Script Additions

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 5.6 Directory Structure

```
ignition-knowledge-base/
  __tests__/
    setup.ts
    styles/
      brand.test.ts
    lib/
      content/
        slug.test.ts
        summary-parser.test.ts
        manifest.test.ts
        link-rewriter.test.ts
    config/
      sync-config.test.ts
    scripts/
      sync-content.test.ts
      postbuild.test.ts
    middleware.test.ts
    app/
      home-page.test.tsx
      document-page.test.tsx
      category-page.test.tsx
      not-found.test.tsx
      login/
        login-page.test.tsx
      auth/
        callback.test.ts
    components/
      layout/
        Sidebar.test.tsx
        Header.test.tsx
        Breadcrumbs.test.tsx
        MobileMenu.test.tsx
        AppShell.test.tsx
      home/
        CategoryGrid.test.tsx
        RecentlyViewed.test.tsx
      document/
        DocumentRenderer.test.tsx
        TableOfContents.test.tsx
        DocumentHeader.test.tsx
        ReadingProgressBar.test.tsx
      search/
        SearchDialog.test.tsx
        SearchResults.test.tsx
        SearchTrigger.test.tsx
        KeyboardNav.test.tsx
      ui/
        Skeleton.test.tsx
    hooks/
      usePagefind.test.ts
      useRecentlyViewed.test.ts
  e2e/
    auth.spec.ts
    search.spec.ts
    navigation.spec.ts
    performance.spec.ts
  vitest.config.ts
  playwright.config.ts
```

### 5.7 Test Fixtures Needed

| Fixture | Location | Used By |
|---------|----------|---------|
| Sample manifest.json | `__tests__/fixtures/manifest.json` | manifest.test.ts, document-page.test.tsx, CategoryGrid, category-page |
| Sample nav.json | `__tests__/fixtures/nav.json` | Sidebar, Breadcrumbs, summary-parser |
| Sample SUMMARY.md | `__tests__/fixtures/SUMMARY.md` | summary-parser.test.ts |
| Malformed SUMMARY.md | `__tests__/fixtures/SUMMARY-malformed.md` | summary-parser.test.ts |
| Sample markdown documents | `__tests__/fixtures/docs/*.md` | DocumentRenderer.test.tsx |
| Malformed markdown | `__tests__/fixtures/docs/malformed.md` | DocumentRenderer.test.tsx (S-43) |
| GitHub API tree response | `__tests__/fixtures/github-tree.json` | sync-content.test.ts |
| GitHub API contents response | `__tests__/fixtures/github-contents.json` | sync-content.test.ts |
| GitHub API rate-limit response | `__tests__/fixtures/github-rate-limit.json` | sync-content.test.ts (S-45) |
| Pagefind search results | `__tests__/fixtures/pagefind-results.json` | SearchResults, usePagefind |

---

## 6. Implementation Order for Test Files

Tests are written layer-by-layer to match the build order. Each layer's tests should be written BEFORE that layer's implementation code.

| Phase | Test Files | Depends On |
|-------|-----------|------------|
| **Phase 1** | `brand.test.ts` | Nothing (type/constant checks) |
| **Phase 2** | `slug.test.ts`, `summary-parser.test.ts`, `manifest.test.ts`, `link-rewriter.test.ts`, `sync-config.test.ts`, `sync-content.test.ts` | Phase 1 types |
| **Phase 3** | `middleware.test.ts`, `login-page.test.tsx`, `callback.test.ts` | Phase 1 |
| **Phase 4** | `Sidebar.test.tsx`, `Header.test.tsx`, `Breadcrumbs.test.tsx`, `MobileMenu.test.tsx`, `AppShell.test.tsx` | Phase 2 fixtures |
| **Phase 5** | `home-page.test.tsx`, `CategoryGrid.test.tsx`, `RecentlyViewed.test.tsx`, `document-page.test.tsx`, `DocumentRenderer.test.tsx`, `TableOfContents.test.tsx`, `DocumentHeader.test.tsx`, `category-page.test.tsx`, `not-found.test.tsx` | Phase 2 + 4 |
| **Phase 6** | `SearchDialog.test.tsx`, `SearchResults.test.tsx`, `SearchTrigger.test.tsx`, `usePagefind.test.ts`, `KeyboardNav.test.tsx` | Phase 1 |
| **Phase 7** | `ReadingProgressBar.test.tsx`, `Skeleton.test.tsx`, `useRecentlyViewed.test.ts`, `postbuild.test.ts` | Phase 1 |
| **Phase 8** | `e2e/auth.spec.ts`, `e2e/search.spec.ts`, `e2e/navigation.spec.ts`, `e2e/performance.spec.ts` | All layers implemented |

---

## 7. Notes for Test Writer (Phase 1: TDD)

1. **Tests must fail for the right reason.** Each test should import from the expected module path (e.g., `@/lib/content/slug`) and call the expected function signature. The test fails because the module does not exist yet, not because of a syntax error.

2. **No mocking implementation details.** Test what the function returns or what the component renders, not how it gets there. For example, test that `generateSlug("docs/01-strategy/vision/master.md")` returns `"/strategy/vision/master"`, not that it calls `stripNumericPrefix` internally.

3. **Fixture-driven tests.** The content pipeline tests should use realistic fixture data that mirrors the actual product-management repo structure. The SUMMARY.md fixture should include multiple categories with nested links.

4. **Malformed input tests are P1.** Scenarios S-33 (SUMMARY.md parse failure) and S-43 (malformed markdown) are explicitly P1 -- these are not edge cases but expected conditions with user-generated content.

5. **Performance tests (S-39, S-40) are E2E only.** Do not attempt to measure LCP or search latency in Vitest. These require a real browser and a built site.

6. **S-48 and S-51 are manual validation.** Do not write automated tests for the deploy skill file or Vercel configuration. These are validated by running the actual deploy process.

---

*Test plan ready. Proceed to writing test files (Phase 1: TDD) layer by layer.*

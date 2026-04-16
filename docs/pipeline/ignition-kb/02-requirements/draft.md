# Requirements Draft: Ignition Knowledge Base

**Date:** 2026-03-17
**Feature:** Internal knowledge website surfacing ~405 markdown documents from `kbrapp1/product-management`
**Author:** PM-A (Requirements-Fit Pipeline)
**Status:** Draft -- pending PM-B challenge

---

## Summary

The Ignition Knowledge Base is a branded, authenticated internal website that makes ~405 product management markdown documents searchable and browsable for non-technical users (Sales, Marketing, Account Managers, Executives). Content is fetched from GitHub at build time, indexed by Pagefind, and served as statically generated pages behind Supabase authentication.

---

## Scenario Index

| ID | Title | Priority | Category |
|----|-------|----------|----------|
| S-01 | Authenticated users see homepage | P1 | Security/Auth |
| S-02 | Unauthenticated redirect to login | P1 | Security/Auth |
| S-03 | Login with Supabase credentials | P1 | Security/Auth |
| S-04 | Session refresh on expired token | P2 | Security/Auth |
| S-05 | Redirect to original page after login | P2 | Security/Auth |
| S-06 | Homepage displays category grid | P1 | UX/Display |
| S-07 | Sidebar navigation from SUMMARY.md | P1 | UX/Display |
| S-08 | Sidebar category collapse/expand | P2 | UX/Display |
| S-09 | Document page renders markdown | P1 | UX/Display |
| S-10 | GFM tables render with horizontal scroll | P1 | UX/Display |
| S-11 | Code blocks render with syntax highlighting | P2 | UX/Display |
| S-12 | Breadcrumb navigation on document pages | P1 | UX/Display |
| S-13 | Right-side table of contents panel | P2 | UX/Display |
| S-14 | Active heading tracking on scroll | P3 | UX/Display |
| S-15 | Responsive layout on mobile | P1 | UX/Display |
| S-16 | Ironmark brand styling applied | P1 | UX/Display |
| S-17 | Reading time and word count displayed | P3 | UX/Display |
| S-18 | Pagefind search via Cmd+K shortcut | P1 | User Features |
| S-19 | Search results show title, snippet, category | P1 | User Features |
| S-20 | Keyboard navigation in search results | P2 | User Features |
| S-21 | Browse documents by category | P1 | User Features |
| S-22 | Category page lists all documents in that category | P2 | User Features |
| S-23 | Reading progress bar | P3 | User Features |
| S-24 | Build-time content fetch from GitHub API | P1 | Data/Storage |
| S-25 | Content manifest generation | P1 | Data/Storage |
| S-26 | URL slug generation from file paths | P1 | Data/Storage |
| S-27 | SUMMARY.md parsed into navigation structure | P1 | Data/Storage |
| S-28 | Content exclusion rules applied | P1 | Data/Storage |
| S-29 | Pagefind index built at build time | P1 | Data/Storage |
| S-30 | Category metadata derived from directory structure | P2 | Data/Storage |
| S-31 | 404 page for nonexistent document slugs | P1 | Error Handling |
| S-32 | Malformed markdown renders gracefully | P1 | Error Handling |
| S-33 | Sync script reports errors for failed fetches | P2 | Error Handling |
| S-34 | Search with no results shows helpful message | P2 | Error Handling |
| S-35 | Broken internal links show fallback | P2 | Error Handling |
| S-36 | Static generation for all document pages | P1 | Performance |
| S-37 | Pagefind JS lazy-loaded on first search | P1 | Performance |
| S-38 | Initial page load under 2 seconds | P2 | Performance |
| S-39 | Search results appear within 200ms of typing | P2 | Performance |
| S-40 | Images optimized via Next.js Image component | P3 | Performance |
| S-41 | Manual deploy via /deploy-kb skill | P1 | Integration |
| S-42 | GitHub PAT authentication for API calls | P1 | Integration |
| S-43 | Shared Supabase project with PM app | P1 | Integration |
| S-44 | Vercel deployment target | P2 | Integration |
| S-45 | Rebuild with unchanged content produces identical output | P1 | Idempotency |
| S-46 | Partial sync failure does not corrupt existing content | P1 | Idempotency |
| S-47 | Pagefind re-index on rebuild produces consistent results | P2 | Idempotency |

---

## Scenarios

---

### S-01: Authenticated users see homepage (P1)
**Category:** Security/Auth

**Given** a user with a valid Supabase session cookie
**When** they navigate to the root URL `/`
**Then** the homepage renders with the category navigation grid, and no login redirect occurs

---

### S-02: Unauthenticated redirect to login (P1)
**Category:** Security/Auth

**Given** a visitor with no valid Supabase session cookie
**When** they navigate to any page (e.g., `/strategy/vision/master-strategy`)
**Then** the middleware redirects them to `/login` before any page content is rendered

---

### S-03: Login with Supabase credentials (P1)
**Category:** Security/Auth

**Given** a user on the `/login` page who has an existing account in the shared Supabase project
**When** they enter valid email and password and submit
**Then** Supabase authenticates via PKCE flow, a session cookie is set, and the user is redirected to the homepage (or their original requested page per S-05)

---

### S-04: Session refresh on expired token (P2)
**Category:** Security/Auth

**Given** a user with an expired access token but a valid refresh token
**When** they navigate to any protected page
**Then** the middleware refreshes the session transparently (new access token issued) and the page loads without requiring re-login

---

### S-05: Redirect to original page after login (P2)
**Category:** Security/Auth

**Given** an unauthenticated user who was redirected to `/login` from a deep link (e.g., `/research/competitors/forrester-wave`)
**When** they successfully authenticate
**Then** they are redirected to the originally requested URL, not the homepage

---

### S-06: Homepage displays category grid (P1)
**Category:** UX/Display

**Given** an authenticated user on the homepage
**When** the page loads
**Then** the homepage displays a grid of content categories derived from the SUMMARY.md structure (e.g., Strategy, Market Research, Competitive Intelligence, GTM Enablement), each showing the category name, document count, and a brief description or representative icon

---

### S-07: Sidebar navigation from SUMMARY.md (P1)
**Category:** UX/Display

**Given** an authenticated user on any document page
**When** the page loads
**Then** a left sidebar displays the full navigation tree parsed from SUMMARY.md, organized into its 24+ category groups with document links nested under each category

---

### S-08: Sidebar category collapse/expand (P2)
**Category:** UX/Display

**Given** an authenticated user viewing the sidebar navigation
**When** they click a category heading (e.g., "Market Research")
**Then** the category toggles between collapsed (showing only the heading) and expanded (showing all child document links), with the current document's parent category expanded by default

---

### S-09: Document page renders markdown (P1)
**Category:** UX/Display

**Given** an authenticated user navigating to a valid document URL (e.g., `/strategy/vision/master-strategy`)
**When** the page loads
**Then** the full markdown content renders with proper heading hierarchy (h1-h6), paragraph spacing, bold/italic formatting, ordered and unordered lists, blockquotes, and inline links -- all styled with Ironmark brand typography (Raleway body, Bebas Neue headings)

---

### S-10: GFM tables render with horizontal scroll (P1)
**Category:** UX/Display

**Given** a document containing a GitHub Flavored Markdown table with 5+ columns
**When** the page renders on a viewport narrower than the table's natural width
**Then** the table renders with proper header/row styling and a horizontal scroll container, without breaking the page layout or causing full-page horizontal scroll

---

### S-11: Code blocks render with syntax highlighting (P2)
**Category:** UX/Display

**Given** a document containing fenced code blocks with language identifiers (e.g., ```sql, ```json)
**When** the page renders
**Then** code blocks display with syntax highlighting appropriate to the specified language, a distinct background color, monospace font, and a copy-to-clipboard button

---

### S-12: Breadcrumb navigation on document pages (P1)
**Category:** UX/Display

**Given** an authenticated user on a document page nested in the navigation hierarchy
**When** the page loads
**Then** a breadcrumb trail appears above the document title showing the path (e.g., "Home > Market Research > TAM Analysis"), with each segment clickable to navigate to that level

---

### S-13: Right-side table of contents panel (P2)
**Category:** UX/Display

**Given** a document with 3 or more h2-level headings
**When** the page loads on a viewport wider than 1280px
**Then** a right-side table of contents panel displays, listing all h2 and h3 headings as clickable links that smooth-scroll to that section within the document

---

### S-14: Active heading tracking on scroll (P3)
**Category:** UX/Display

**Given** the table of contents panel is visible and the user is scrolling through a document
**When** a new h2 heading enters the top 120px of the viewport
**Then** the corresponding entry in the table of contents panel highlights to indicate the current reading position

---

### S-15: Responsive layout on mobile (P1)
**Category:** UX/Display

**Given** an authenticated user accessing the site on a device with a viewport width under 768px
**When** any page loads
**Then** the sidebar navigation collapses into a hamburger menu, the table of contents panel hides (accessible via a toggle button), document content fills the full width with appropriate padding, and tables scroll horizontally

---

### S-16: Ironmark brand styling applied (P1)
**Category:** UX/Display

**Given** any page on the knowledge base
**When** it renders
**Then** the visual design uses Ironmark brand colors (red #EF462F for primary accents, cyan #38C6F4 for interactive elements, gray #707070 for secondary text, off-white #f4f2f2 for backgrounds), Ironmark fonts (Raleway body, Bebas Neue headings, Lora for serif accents), and lucide-react icons throughout

---

### S-17: Reading time and word count displayed (P3)
**Category:** UX/Display

**Given** an authenticated user on a document page
**When** the page loads
**Then** the document header area displays the estimated reading time (calculated at 200 words per minute) and total word count

---

### S-18: Pagefind search via Cmd+K shortcut (P1)
**Category:** User Features

**Given** an authenticated user on any page
**When** they press Cmd+K (Mac) or Ctrl+K (Windows)
**Then** a modal search dialog opens with an auto-focused text input, ready to accept a query

---

### S-19: Search results show title, snippet, category (P1)
**Category:** User Features

**Given** a user has typed 3 or more characters in the search dialog
**When** Pagefind returns results
**Then** each result displays the document title, a text snippet with the matching terms highlighted, and a category badge (e.g., "Strategy", "Market Research"), and clicking a result navigates to that document page

---

### S-20: Keyboard navigation in search results (P2)
**Category:** User Features

**Given** the search dialog is open with results displayed
**When** the user presses the up/down arrow keys
**Then** the visual focus moves between results, and pressing Enter navigates to the focused result

---

### S-21: Browse documents by category (P1)
**Category:** User Features

**Given** an authenticated user on the homepage
**When** they click a category card (e.g., "Competitive Intelligence")
**Then** they navigate to a category page that lists all documents belonging to that category with their titles and brief descriptions or first-line summaries

---

### S-22: Category page lists all documents in that category (P2)
**Category:** User Features

**Given** an authenticated user on a category page
**When** the page loads
**Then** all documents in that category are listed in a scannable format (title, optional description, content type badge), sorted in the order defined by SUMMARY.md for curated entries

---

### S-23: Reading progress bar (P3)
**Category:** User Features

**Given** an authenticated user on a document page
**When** they scroll through the document
**Then** a thin progress bar at the top of the viewport fills proportionally to indicate how far through the document they have scrolled

---

### S-24: Build-time content fetch from GitHub API (P1)
**Category:** Data/Storage

**Given** the `scripts/sync-content.ts` prebuild script executes
**When** it runs with a valid GitHub PAT
**Then** it fetches all matching `.md` files from `kbrapp1/product-management` (branch: `master`) using the GitHub Contents/Trees API, respecting include patterns (`docs/**/*.md`) and writing each file to the local `content/` directory preserving the directory structure

---

### S-25: Content manifest generation (P1)
**Category:** Data/Storage

**Given** the sync script has fetched all content files
**When** it completes
**Then** it writes a `content/manifest.json` file containing an array of objects, each with: `slug` (URL path), `title` (extracted from first h1 or filename), `category` (derived from directory), `filePath` (original GitHub path), `wordCount`, and `lastModified` (from git metadata or file fetch timestamp)

---

### S-26: URL slug generation from file paths (P1)
**Category:** Data/Storage

**Given** a source file at path `docs/01-strategy/verticals/QSR-Vertical-Product-Vision.md`
**When** the sync script generates its URL slug
**Then** the slug strips numbered prefixes (`01-`, `02-`), converts to lowercase kebab-case, drops the `.md` extension, and produces a clean path like `/strategy/verticals/qsr-vertical-product-vision`

---

### S-27: SUMMARY.md parsed into navigation structure (P1)
**Category:** Data/Storage

**Given** the SUMMARY.md file has been fetched from the repo
**When** the build process parses it
**Then** it produces a JSON navigation tree where each category is a group node containing ordered child entries, each child having a `title` and `slug` that maps to the generated URL path, with malformed links (e.g., nested markdown syntax, bare paths) handled gracefully by either resolving them or excluding them with a build warning

---

### S-28: Content exclusion rules applied (P1)
**Category:** Data/Storage

**Given** the sync script runs
**When** it encounters files in excluded directories (`docs-donai/`, `docs/06-updates/`, `docs/09-legacy/`, `docs/05-operations/people/`, `docs/05-operations/document-templates/`)
**Then** those files are skipped entirely -- not fetched, not written to `content/`, not included in the manifest or search index

---

### S-29: Pagefind index built at build time (P1)
**Category:** Data/Storage

**Given** all document pages have been statically generated by Next.js
**When** the Pagefind indexing step runs as a post-build script
**Then** it produces a search index in `public/pagefind/` that covers all rendered document pages, with lazy-loadable index chunks totaling approximately 6KB of initial JS

---

### S-30: Category metadata derived from directory structure (P2)
**Category:** Data/Storage

**Given** the content manifest has been generated
**When** the build process derives category metadata
**Then** each top-level directory under `docs/` maps to a category with a display name (e.g., `01-strategy` becomes "Strategy"), a document count, and a sort order matching the numeric prefix

---

### S-31: 404 page for nonexistent document slugs (P1)
**Category:** Error Handling

**Given** a user navigates to a URL that does not match any known document slug (e.g., `/strategy/nonexistent-document`)
**When** the page loads
**Then** a branded 404 page displays with a clear message ("Document not found"), a search bar to find related content, and a link back to the homepage

---

### S-32: Malformed markdown renders gracefully (P1)
**Category:** Error Handling

**Given** a document contains malformed markdown (e.g., unclosed code blocks, broken table syntax, HTML fragments)
**When** the page renders
**Then** react-markdown renders as much content as possible without crashing, and malformed sections appear as plain text rather than causing a blank page or error state

---

### S-33: Sync script reports errors for failed fetches (P2)
**Category:** Error Handling

**Given** the sync script is running and the GitHub API returns a non-200 response for a specific file
**When** the error occurs
**Then** the script logs the file path and HTTP status, continues processing remaining files, and includes a summary of failed files in its completion output (the build does not abort for individual file failures)

---

### S-34: Search with no results shows helpful message (P2)
**Category:** Error Handling

**Given** a user has entered a search query in the Cmd+K dialog
**When** Pagefind returns zero results
**Then** the dialog displays a message like "No documents match [query]. Try different keywords." rather than an empty state or spinner

---

### S-35: Broken internal links show fallback (P2)
**Category:** Error Handling

**Given** a document contains a markdown link that references another document by relative path, and that path does not resolve to a valid slug in the manifest
**When** the user clicks the link
**Then** the user sees the 404 page (S-31) rather than a browser error, and the link is visually distinguishable or annotated if the broken reference can be detected at build time

---

### S-36: Static generation for all document pages (P1)
**Category:** Performance

**Given** the Next.js build process runs
**When** `generateStaticParams` executes
**Then** every document in the manifest is pre-rendered as a static HTML page at build time, with no server-side rendering required at request time

---

### S-37: Pagefind JS lazy-loaded on first search (P1)
**Category:** Performance

**Given** a user loads any page on the knowledge base
**When** they have not yet opened the search dialog
**Then** no Pagefind JavaScript or index data is loaded -- the Pagefind bundle loads only when the search dialog opens for the first time

---

### S-38: Initial page load under 2 seconds (P2)
**Category:** Performance

**Given** a user with a standard broadband connection (10+ Mbps)
**When** they navigate to any statically generated page
**Then** the page reaches Largest Contentful Paint (LCP) in under 2 seconds, as measured by Lighthouse or Web Vitals

---

### S-39: Search results appear within 200ms of typing (P2)
**Category:** Performance

**Given** the Pagefind JS has been loaded (after first search dialog open)
**When** the user types or modifies their search query
**Then** results update within 200ms of the last keystroke (debounced), with no perceptible lag

---

### S-40: Images optimized via Next.js Image component (P3)
**Category:** Performance

**Given** a document references images (either embedded in markdown or as separate assets)
**When** the page renders
**Then** images are served through Next.js Image optimization (responsive sizing, lazy loading, modern formats) where the image source is available, and a placeholder or alt text is shown for missing images

---

### S-41: Manual deploy via /deploy-kb skill (P1)
**Category:** Integration

**Given** a user triggers the `/deploy-kb` Claude Code skill from the product-management repo
**When** the skill executes
**Then** it runs the content sync script, commits any content changes, pushes to the deployment branch, and triggers a Vercel build -- producing a new version of the knowledge base with current content

---

### S-42: GitHub PAT authentication for API calls (P1)
**Category:** Integration

**Given** the sync script needs to fetch content from the GitHub API
**When** it makes API requests
**Then** it authenticates using a GitHub Personal Access Token (from environment variable), enabling the 5,000 requests/hour rate limit required for fetching ~405 files

---

### S-43: Shared Supabase project with PM app (P1)
**Category:** Integration

**Given** the knowledge base app is configured with Supabase environment variables
**When** a user logs in
**Then** it authenticates against the same Supabase project used by the PM app (same `NEXT_PUBLIC_SUPABASE_URL` and `ANON_KEY`), so any user with a PM app account can access the knowledge base without separate registration

---

### S-44: Vercel deployment target (P2)
**Category:** Integration

**Given** the project is pushed to its deployment branch
**When** Vercel detects the push
**Then** it runs the build process (sync script + Next.js build + Pagefind index) and deploys the result to a production URL, completing within Vercel's build time limits

---

### S-45: Rebuild with unchanged content produces identical output (P1)
**Category:** Idempotency

**Given** no documents have changed in the source GitHub repo since the last build
**When** the sync script and build process run again
**Then** the generated `content/` files, `manifest.json`, and Pagefind index are byte-identical to the previous build, and no spurious diffs appear in version control

---

### S-46: Partial sync failure does not corrupt existing content (P1)
**Category:** Idempotency

**Given** a previous successful build has produced valid content in the `content/` directory
**When** a new sync run fails partway through (e.g., GitHub API rate limit hit after 200 of 405 files)
**Then** the sync script either completes with partial content and a clear warning log, or rolls back to the previous content state -- it does not leave a mix of old and new files that could produce broken cross-references

---

### S-47: Pagefind re-index on rebuild produces consistent results (P2)
**Category:** Idempotency

**Given** the same set of HTML pages exists from a rebuild
**When** Pagefind re-indexes the output
**Then** search results for any given query return the same documents in the same relevance order as the previous index, assuming no content changes

---

## Priority Distribution

| Priority | Count | Percentage | Coverage |
|----------|-------|------------|----------|
| P1 | 24 | 51% | Core auth, navigation, rendering, search, data pipeline, deploy |
| P2 | 16 | 34% | Polish UX, error handling, performance targets, keyboard nav |
| P3 | 7 | 15% | Reading progress, active heading tracking, word count, image optimization |

## Category Distribution

| Category | Scenarios | IDs |
|----------|-----------|-----|
| UX/Display | 12 | S-06 through S-17 |
| User Features | 6 | S-18 through S-23 |
| Data/Storage | 7 | S-24 through S-30 |
| Error Handling | 5 | S-31 through S-35 |
| Performance | 5 | S-36 through S-40 |
| Security/Auth | 5 | S-01 through S-05 |
| Integration | 4 | S-41 through S-44 |
| Idempotency | 3 | S-45 through S-47 |

---

## Notes for PM-B Review

1. **P1 count is at 51%, above the 20-30% guideline.** This is deliberate -- the KB is a relatively straightforward content site where most functionality is either "works" or "doesn't ship." Several P1 scenarios (e.g., S-10 tables, S-12 breadcrumbs) could arguably be P2, but for a non-technical audience that needs to trust the site on first use, rendering correctness and navigation clarity are launch-blocking.

2. **No role-based access scenarios included.** Per the feature spec, all content is available to all authenticated users. If RBAC is needed later, it would be a separate feature.

3. **The SUMMARY.md expansion (from 122 to ~405 entries) is an assumption.** The feature description states SUMMARY.md will be expanded to cover all included content. If that expansion does not happen, scenarios S-07, S-22, and S-27 need adjustment to account for documents that exist in the manifest but not in the curated navigation.

4. **No "recently updated" feature was included as P1.** The research brief mentions it, but for a build-time static site with manual deploys, "recently updated" is only meaningful relative to the last build. It could be derived from git commit dates if available from the API. This is a candidate for PM-B to evaluate.

5. **Sync script atomicity (S-46) is a design decision.** The scenario describes the desired outcome but not the mechanism. The architect should determine whether this means write-to-temp-then-swap, or simply a clean-before-write approach.

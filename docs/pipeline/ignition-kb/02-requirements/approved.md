# Approved Requirements: Ignition Knowledge Base

**Date:** 2026-03-17
**Feature:** Internal knowledge website surfacing product management markdown documents from `kbrapp1/product-management`
**Status:** Approved -- ready for architecture
**Inputs:** PM-A draft (47 scenarios), PM-B challenge report (9 must-fix, 10 should-fix, 6 observations)

---

## Assumptions

1. **SUMMARY.md will be expanded** to cover all included content before the site ships. The build script will warn on any included file not present in SUMMARY.md. Files not in SUMMARY.md are still searchable via Pagefind but will not appear in sidebar navigation. This is a curated-only nav strategy -- no auto-generated browse-all fallback.

2. **Included file count is approximately 345-370 after exclusions.** The exact count depends on stub filtering (files under 1,500 bytes). The sync script's exclusion rules are the source of truth, not the approximate count. `docs/11-donai-design/` is **excluded** (PO confirmed 2026-03-17).

3. **`lastModified` is deferred from the v1 manifest.** Per-file git metadata requires one API call per file (~405 additional calls), adding sync time and rate-limit risk. The manifest will include `slug`, `title`, `category`, `filePath`, and `wordCount`. `lastModified` is a P2 enhancement for a future version.

4. **No role-based access control.** All content is available to all authenticated users. RBAC would be a separate feature.

5. **Shared Supabase project.** The KB authenticates against the same Supabase instance as the PM app. Session policies (e.g., concurrent sessions) inherit from that project's configuration.

6. **Architecture decisions are locked:** build-time GitHub API fetch, Pagefind for search, expanded SUMMARY.md as curated editorial nav, all content behind Supabase auth, manual deploy via `/deploy-kb` skill.

---

## Scenario Index

| ID | Title | Priority | Category |
|----|-------|----------|----------|
| S-01 | Authenticated users see homepage | P1 | Auth |
| S-02 | Unauthenticated redirect to login | P1 | Auth |
| S-03 | Login with Supabase credentials | P1 | Auth |
| S-04 | Session refresh on expired token | P1 | Auth |
| S-05 | Redirect to original page after login | P1 | Auth |
| S-06 | Login failure feedback | P1 | Auth |
| S-07 | Logout flow | P1 | Auth |
| S-08 | Homepage displays category grid | P1 | Navigation |
| S-09 | Sidebar navigation from SUMMARY.md | P1 | Navigation |
| S-10 | Sidebar category collapse/expand | P1 | Navigation |
| S-11 | Breadcrumb navigation on document pages | P1 | Navigation |
| S-12 | Browse documents by category | P1 | Navigation |
| S-13 | Empty category suppression | P1 | Navigation |
| S-14 | SUMMARY.md coverage warning at build time | P1 | Navigation |
| S-15 | Document page renders markdown | P1 | Display |
| S-16 | GFM tables render with horizontal scroll | P1 | Display |
| S-17 | Ironmark brand styling applied | P1 | Display |
| S-18 | Responsive layout on mobile | P1 | Display |
| S-19 | Right-side table of contents panel | P2 | Display |
| S-20 | Code blocks render with syntax highlighting | P3 | Display |
| S-21 | Active heading tracking on scroll | P3 | Display |
| S-22 | Reading time and word count displayed | P3 | Display |
| S-23 | Pagefind search via header bar and Cmd+K | P1 | Search |
| S-24 | Search results show title, snippet, category | P1 | Search |
| S-25 | Search dialog close behavior | P2 | Search |
| S-26 | Keyboard navigation in search results | P2 | Search |
| S-27 | Search with no results shows helpful message | P2 | Search |
| S-28 | Build-time content fetch from GitHub API | P1 | Data Pipeline |
| S-29 | Content exclusion rules applied | P1 | Data Pipeline |
| S-30 | Content manifest generation | P1 | Data Pipeline |
| S-31 | URL slug generation from file paths | P1 | Data Pipeline |
| S-32 | SUMMARY.md parsed into navigation structure | P1 | Data Pipeline |
| S-33 | SUMMARY.md parse failure halts build | P1 | Data Pipeline |
| S-34 | Pagefind index built at build time | P1 | Data Pipeline |
| S-35 | Category metadata derived from directory structure | P2 | Data Pipeline |
| S-36 | Internal cross-document links rewritten to KB URLs | P2 | Data Pipeline |
| S-37 | Static generation for all document pages | P1 | Performance |
| S-38 | Pagefind JS lazy-loaded on first search | P1 | Performance |
| S-39 | Initial page load under 2 seconds | P1 | Performance |
| S-40 | Search results appear within 200ms of typing | P1 | Performance |
| S-41 | Images optimized via Next.js Image component | P3 | Performance |
| S-42 | 404 page for nonexistent document slugs | P1 | Error Handling |
| S-43 | Malformed markdown renders without crashing | P1 | Error Handling |
| S-44 | Sync script reports errors for failed fetches | P2 | Error Handling |
| S-45 | GitHub API rate limit handling during sync | P1 | Error Handling |
| S-46 | Broken internal links navigate to 404 | P2 | Error Handling |
| S-47 | Build-time broken link report | P3 | Error Handling |
| S-48 | Manual deploy via /deploy-kb skill | P1 | Integration |
| S-49 | GitHub PAT authentication for API calls | P1 | Integration |
| S-50 | Shared Supabase project with PM app | P1 | Integration |
| S-51 | Vercel deployment target | P2 | Integration |
| S-52 | Atomic content sync (no partial corruption) | P1 | Reliability |
| S-53 | Rebuild with unchanged content produces identical output | P1 | Reliability |
| S-54 | Pagefind re-index on rebuild produces consistent results | P2 | Reliability |
| S-55 | Recently viewed documents on homepage | P2 | UX Polish |
| S-56 | Print-optimized stylesheet | P2 | UX Polish |
| S-57 | Loading/skeleton states during transitions | P2 | UX Polish |
| S-58 | Reading progress bar | P3 | UX Polish |

---

## Scenarios

---

### S-01: Authenticated users see homepage (P1)
**Category:** Auth

**Given** a user with a valid Supabase session cookie
**When** they navigate to the root URL `/`
**Then** the homepage renders with the category navigation grid, and no login redirect occurs

---

### S-02: Unauthenticated redirect to login (P1)
**Category:** Auth

**Given** a visitor with no valid Supabase session cookie
**When** they navigate to any page (e.g., `/strategy/vision/master-strategy`)
**Then** the middleware redirects them to `/login` before any page content is rendered

---

### S-03: Login with Supabase credentials (P1)
**Category:** Auth

**Given** a user on the `/login` page who has an existing account in the shared Supabase project
**When** they enter valid email and password and submit
**Then** Supabase authenticates via PKCE flow, a session cookie is set, and the user is redirected to the homepage (or their original requested page per S-05)

---

### S-04: Session refresh on expired token (P1)
**Category:** Auth

**Given** a user with an expired access token but a valid refresh token
**When** they navigate to any protected page
**Then** the middleware refreshes the session transparently (new access token issued) and the page loads without requiring re-login

*[Promoted from P2 per PM-B: non-technical users will experience expired tokens as "the site is broken" within a single workday. Token refresh is minimal middleware code.]*

---

### S-05: Redirect to original page after login (P1)
**Category:** Auth

**Given** an unauthenticated user who was redirected to `/login` from a deep link (e.g., `/research/competitors/forrester-wave`)
**When** they successfully authenticate
**Then** they are redirected to the originally requested URL, not the homepage

*[Promoted from P2 per PM-B: deep links via Slack/email are the primary entry path for the target audience. Landing on homepage after login breaks the core use case.]*

---

### S-06: Login failure feedback (P1)
**Category:** Auth

**Given** a user on the `/login` page
**When** they submit invalid credentials (wrong email, wrong password, or nonexistent account)
**Then** the page displays a specific, non-technical error message (e.g., "Incorrect email or password. Please try again.") without revealing whether the email exists in the system, and the form remains editable for retry

*[New scenario per PM-B must-fix M-07: draft only covered login happy path.]*

---

### S-07: Logout flow (P1)
**Category:** Auth

**Given** an authenticated user on any page
**When** they click the logout/sign-out control
**Then** the Supabase session is destroyed, the session cookie is cleared, and the user is redirected to the `/login` page

*[New scenario per PM-B must-fix M-01: every authenticated application needs a logout flow.]*

---

### S-08: Homepage displays category grid (P1)
**Category:** Navigation

**Given** an authenticated user on the homepage
**When** the page loads
**Then** the homepage displays a grid of content categories derived from the SUMMARY.md structure (e.g., Strategy, Market Research, Competitive Intelligence, GTM Enablement), each showing the category name, document count, and a manually assigned icon from lucide-react

*[Tightened per PM-B: removed ambiguous "brief description or representative icon" -- v1 uses icon + count only, no auto-generated descriptions.]*

---

### S-09: Sidebar navigation from SUMMARY.md (P1)
**Category:** Navigation

**Given** an authenticated user on any document page
**When** the page loads
**Then** a left sidebar displays the navigation tree parsed from SUMMARY.md, organized into category groups with document links nested under each category. The sidebar reflects only content curated in SUMMARY.md. Documents not in SUMMARY.md are reachable via search (S-23/S-24) but do not appear in the sidebar.

*[Clarified per PM-B contradiction finding: "full navigation tree" replaced with explicit statement that sidebar is SUMMARY.md-curated only. Per PO decision, SUMMARY.md will be expanded to cover all included content before ship.]*

---

### S-10: Sidebar category collapse/expand (P1)
**Category:** Navigation

**Given** an authenticated user viewing the sidebar navigation
**When** they click a category heading (e.g., "Market Research")
**Then** the category toggles between collapsed (showing only the heading) and expanded (showing all child document links), with the current document's parent category expanded by default

*[Promoted from P2 per PM-B: with 24+ categories, an always-expanded sidebar is hundreds of items long and unusable. Collapse/expand is the mechanism that makes the sidebar functional.]*

---

### S-11: Breadcrumb navigation on document pages (P1)
**Category:** Navigation

**Given** an authenticated user on a document page nested in the navigation hierarchy
**When** the page loads
**Then** a breadcrumb trail appears above the document title showing the path (e.g., "Home > Market Research > TAM Analysis"), with each segment clickable to navigate to that level

---

### S-12: Browse documents by category (P1)
**Category:** Navigation

**Given** an authenticated user on the homepage
**When** they click a category card (e.g., "Competitive Intelligence")
**Then** they navigate to a category page that lists all documents belonging to that category with their titles and first-line summaries, sorted in the order defined by SUMMARY.md for curated entries

*[Merged former S-21 and S-22 per PM-B: these described the same page at different priorities. Combined into one P1 scenario with the specific list format from S-22.]*

---

### S-13: Empty category suppression (P1)
**Category:** Navigation

**Given** a category exists in the navigation structure but contains zero documents after filtering
**When** the build process runs
**Then** that category is excluded from the homepage grid and sidebar navigation, with a build-time warning logged

*[New scenario per PM-B must-fix M-03: prevents broken navigation if SUMMARY.md expansion is incomplete or all docs in a category fall below the stub threshold.]*

---

### S-14: SUMMARY.md coverage warning at build time (P1)
**Category:** Navigation

**Given** the build process has the content manifest and the parsed SUMMARY.md navigation tree
**When** it compares the two
**Then** any file in the manifest that is not referenced in SUMMARY.md produces a build-time warning listing the file path. The build does not fail -- uncovered files are still indexed by Pagefind and accessible via search, but they will not appear in sidebar navigation.

*[New scenario per PO decision: SUMMARY.md will be expanded to cover all content, but the build must surface gaps so they can be addressed before ship.]*

---

### S-15: Document page renders markdown (P1)
**Category:** Display

**Given** an authenticated user navigating to a valid document URL (e.g., `/strategy/vision/master-strategy`)
**When** the page loads
**Then** the full markdown content renders with proper heading hierarchy (h1-h6), paragraph spacing, bold/italic formatting, ordered and unordered lists, blockquotes, and inline links -- all styled with Ironmark brand typography

---

### S-16: GFM tables render with horizontal scroll (P1)
**Category:** Display

**Given** a document containing a GitHub Flavored Markdown table with 5+ columns
**When** the page renders on a viewport narrower than the table's natural width
**Then** the table renders with proper header/row styling and a horizontal scroll container, without breaking the page layout or causing full-page horizontal scroll

---

### S-17: Ironmark brand styling applied (P1)
**Category:** Display

**Given** any page on the knowledge base
**When** it renders
**Then** the visual design uses:
- **Colors:** red #EF462F for primary accents, cyan #38C6F4 for interactive elements, gray #707070 for secondary text, off-white #f4f2f2 for backgrounds
- **Fonts:** Raleway for body, Bebas Neue for headings, Lora for serif accents
- **Icons:** lucide-react throughout
- **Logo:** Ironmark logo in the sidebar header
- **Favicon:** Branded favicon in the browser tab
- **Page titles:** Format "Document Title | Ignition Knowledge Base"

*[Expanded per PM-B should-fix: added logo placement, favicon, and page title format -- highly visible branding elements missing from draft.]*

---

### S-18: Responsive layout on mobile (P1)
**Category:** Display

**Given** an authenticated user accessing the site on a device with a viewport width under 768px
**When** any page loads
**Then** the sidebar navigation collapses into a hamburger menu, the table of contents panel hides (accessible via a toggle button), document content fills the full width with appropriate padding, and tables scroll horizontally

---

### S-19: Right-side table of contents panel (P2)
**Category:** Display

**Given** a document with 3 or more h2-level headings
**When** the page loads on a viewport wider than 1280px
**Then** a right-side table of contents panel displays, listing all h2 and h3 headings as clickable links that smooth-scroll to that section within the document

---

### S-20: Code blocks render with syntax highlighting (P3)
**Category:** Display

**Given** a document containing fenced code blocks with language identifiers (e.g., ```sql, ```json)
**When** the page renders
**Then** code blocks display with syntax highlighting appropriate to the specified language, a distinct background color, monospace font, and a copy-to-clipboard button

*[Demoted from P2 to P3 per PM-B: target audience is Sales/Marketing/Executives who rarely encounter code blocks. Monospace-on-gray is sufficient for launch.]*

---

### S-21: Active heading tracking on scroll (P3)
**Category:** Display

**Given** the table of contents panel is visible and the user is scrolling through a document
**When** a new h2 heading enters the top 120px of the viewport
**Then** the corresponding entry in the table of contents panel highlights to indicate the current reading position

---

### S-22: Reading time and word count displayed (P3)
**Category:** Display

**Given** an authenticated user on a document page
**When** the page loads
**Then** the document header area displays the estimated reading time (calculated at 200 words per minute) and total word count

---

### S-23: Pagefind search via header bar and Cmd+K (P1)
**Category:** Search

**Given** an authenticated user on any page
**When** they click the search input/icon in the top navigation bar, OR press Cmd+K (Mac) / Ctrl+K (Windows)
**Then** a modal search dialog opens with an auto-focused text input, ready to accept a query

*[Expanded per PM-B: non-technical users do not know keyboard shortcuts. A visible, clickable search affordance in the header is required alongside the keyboard shortcut.]*

---

### S-24: Search results show title, snippet, category (P1)
**Category:** Search

**Given** a user has typed 3 or more characters in the search dialog
**When** Pagefind returns results
**Then** each result displays the document title, a text snippet with the matching terms highlighted, and a category badge (e.g., "Strategy", "Market Research"), and clicking a result navigates to that document page

---

### S-25: Search dialog close behavior (P2)
**Category:** Search

**Given** the search dialog is open
**When** the user presses Escape, clicks outside the dialog, or presses Cmd+K/Ctrl+K again
**Then** the dialog closes and keyboard focus returns to the previously focused element

*[New scenario per PM-B should-fix M-06: draft specified how to open search but not how to close it.]*

---

### S-26: Keyboard navigation in search results (P2)
**Category:** Search

**Given** the search dialog is open with results displayed
**When** the user presses the up/down arrow keys
**Then** the visual focus moves between results, and pressing Enter navigates to the focused result

---

### S-27: Search with no results shows helpful message (P2)
**Category:** Search

**Given** a user has entered a search query in the search dialog
**When** Pagefind returns zero results
**Then** the dialog displays a message like "No documents match your search. Try different keywords." rather than an empty state or spinner

---

### S-28: Build-time content fetch from GitHub API (P1)
**Category:** Data Pipeline

**Given** the `scripts/sync-content.ts` prebuild script executes
**When** it runs with a valid GitHub PAT
**Then** it fetches all matching `.md` files from `kbrapp1/product-management` (branch: `master`) using the GitHub Contents/Trees API, respecting include patterns (`docs/**/*.md`) and writing each file to the local `content/` directory preserving the directory structure

---

### S-29: Content exclusion rules applied (P1)
**Category:** Data Pipeline

**Given** the sync script runs
**When** it encounters files in excluded directories (`docs-donai/`, `docs/06-updates/`, `docs/09-legacy/`, `docs/05-operations/people/`, `docs/05-operations/document-templates/`, `docs/11-donai-design/`)
**Then** those files are skipped entirely -- not fetched, not written to `content/`, not included in the manifest or search index

---

### S-30: Content manifest generation (P1)
**Category:** Data Pipeline

**Given** the sync script has fetched all content files
**When** it completes
**Then** it writes a `content/manifest.json` file containing an array of objects, each with: `slug` (URL path), `title` (extracted from first h1 or filename), `category` (derived from directory), `filePath` (original GitHub path), and `wordCount`

*[Removed `lastModified` from v1 manifest per PM-B scope creep warning: per-file git metadata requires ~405 additional API calls. Deferred to future enhancement.]*

---

### S-31: URL slug generation from file paths (P1)
**Category:** Data Pipeline

**Given** a source file at path `docs/01-strategy/verticals/QSR-Vertical-Product-Vision.md`
**When** the sync script generates its URL slug
**Then** the slug strips numbered prefixes (`01-`, `02-`), converts to lowercase kebab-case, drops the `.md` extension, and produces a clean path like `/strategy/verticals/qsr-vertical-product-vision`. URL slugs, once generated, must remain stable across rebuilds. Any future change to the slug generation algorithm must include redirects from old slugs to new ones.

*[Added URL stability constraint per PM-B: the target audience shares links via Slack and email. Slug changes would break all previously shared links.]*

---

### S-32: SUMMARY.md parsed into navigation structure (P1)
**Category:** Data Pipeline

**Given** the SUMMARY.md file has been fetched from the repo
**When** the build process parses it
**Then** it produces a JSON navigation tree where each category is a group node containing ordered child entries, each child having a `title` and `slug` that maps to the generated URL path. Malformed entries (broken link syntax, non-resolvable paths) are excluded from the navigation tree and a build-time warning is logged identifying each excluded entry by line number and raw text. The rest of the navigation tree builds successfully.

*[Tightened per PM-B: replaced vague "handled gracefully" with specific behavior -- skip and warn with line number context.]*

---

### S-33: SUMMARY.md parse failure halts build (P1)
**Category:** Data Pipeline

**Given** the sync script runs and SUMMARY.md is either missing from the repo or contains structural errors that prevent parsing (e.g., no markdown list items found)
**When** the parse step executes
**Then** the build fails with a clear error message identifying the issue, rather than producing a site with no navigation

*[New scenario per PM-B must-fix M-08: S-32 only addressed malformed individual links, not a missing or fundamentally broken SUMMARY.md.]*

---

### S-34: Pagefind index built at build time (P1)
**Category:** Data Pipeline

**Given** all document pages have been statically generated by Next.js
**When** the Pagefind indexing step runs as a post-build script
**Then** it produces a search index in `public/pagefind/` that covers all rendered document pages, with lazy-loadable index chunks

---

### S-35: Category metadata derived from directory structure (P2)
**Category:** Data Pipeline

**Given** the content manifest has been generated
**When** the build process derives category metadata
**Then** each top-level directory under `docs/` maps to a category with a display name (e.g., `01-strategy` becomes "Strategy"), a document count, and a sort order matching the numeric prefix

---

### S-36: Internal cross-document links rewritten to KB URLs (P2)
**Category:** Data Pipeline

**Given** a document contains a markdown link with a relative path pointing to another `.md` file in the repo
**When** the page renders
**Then** the link href is rewritten to the corresponding KB URL slug (e.g., `../02-roadmap/mvp/mvp-critical-path.md` becomes `/roadmap/mvp/mvp-critical-path`), and clicking it navigates within the KB rather than to a broken path

*[New scenario per PM-B should-fix M-05: many documents contain relative links that would 404 without build-time rewriting.]*

---

### S-37: Static generation for all document pages (P1)
**Category:** Performance

**Given** the Next.js build process runs
**When** `generateStaticParams` executes
**Then** every document in the manifest is pre-rendered as a static HTML page at build time, with no server-side rendering required at request time

---

### S-38: Pagefind JS lazy-loaded on first search (P1)
**Category:** Performance

**Given** a user loads any page on the knowledge base
**When** they have not yet opened the search dialog
**Then** no Pagefind JavaScript or index data is loaded -- the Pagefind bundle loads only when the search dialog opens for the first time

---

### S-39: Initial page load under 2 seconds (P1)
**Category:** Performance

**Given** a user with a standard broadband connection (10+ Mbps)
**When** they navigate to any statically generated page
**Then** the page reaches Largest Contentful Paint (LCP) in under 2 seconds, as measured by Lighthouse or Web Vitals

*[Promoted from P2 per PM-B: these are statically generated pages -- if they cannot meet this bar, something is fundamentally wrong. Non-technical audience judges site credibility in the first 3 seconds.]*

---

### S-40: Search results appear within 200ms of typing (P1)
**Category:** Performance

**Given** the Pagefind JS has been loaded (after first search dialog open)
**When** the user types or modifies their search query
**Then** results update within 200ms of the last keystroke (debounced), with no perceptible lag

*[Promoted from P2 per PM-B: same reasoning as S-39. Performance targets should be P1 constraints the architect designs against.]*

---

### S-41: Images optimized via Next.js Image component (P3)
**Category:** Performance

**Given** a document references images (either embedded in markdown or as separate assets)
**When** the page renders
**Then** images are served through Next.js Image optimization (responsive sizing, lazy loading, modern formats) where the image source is available, and a placeholder or alt text is shown for missing images

*[Note: Per PM-B scope creep warning, an audit of image references in content should be done before implementation. If images are rare, defer entirely.]*

---

### S-42: 404 page for nonexistent document slugs (P1)
**Category:** Error Handling

**Given** a user navigates to a URL that does not match any known document slug (e.g., `/strategy/nonexistent-document`)
**When** the page loads
**Then** a branded 404 page displays with a clear message ("Document not found"), a search bar to find related content, and a link back to the homepage

---

### S-43: Malformed markdown renders without crashing (P1)
**Category:** Error Handling

**Given** a document contains malformed markdown (e.g., unclosed code blocks, broken table syntax, HTML fragments)
**When** the page renders
**Then** the page renders without a white screen or error boundary. Content before and after the malformed section renders correctly. The malformed section itself renders as unstyled plain text. No JavaScript errors appear in the browser console.

*[Tightened per PM-B must-fix: replaced vague "renders gracefully" with specific testable criteria.]*

---

### S-44: Sync script reports errors for failed fetches (P2)
**Category:** Error Handling

**Given** the sync script is running and the GitHub API returns a non-200 response for a specific file
**When** the error occurs
**Then** the script logs the file path and HTTP status, continues processing remaining files, and includes a summary of failed files in its completion output (the build does not abort for individual file failures)

---

### S-45: GitHub API rate limit handling during sync (P1)
**Category:** Error Handling

**Given** the sync script is fetching content and the GitHub API returns a 403 rate-limit response
**When** the rate limit is encountered
**Then** the script logs the remaining file count, waits for the rate limit reset window (from the `X-RateLimit-Reset` header), and resumes fetching -- or aborts with a clear message if the reset window exceeds 5 minutes

*[New scenario per PM-B observation: realistic failure mode when syncing ~405 files. S-33/S-44 handle individual failures but not the specific rate-limit case.]*

---

### S-46: Broken internal links navigate to 404 (P2)
**Category:** Error Handling

**Given** a document contains a markdown link that references another document by relative path, and that path does not resolve to a valid slug in the manifest
**When** the user clicks the link
**Then** the user sees the 404 page (S-42) rather than a browser error

*[Split from original S-35 per PM-B scope creep warning: runtime fallback (free -- just S-42 working) separated from build-time detection (S-47).]*

---

### S-47: Build-time broken link report (P3)
**Category:** Error Handling

**Given** the build process has access to the content manifest and all rendered documents
**When** a post-build link validation step runs
**Then** it produces a report of internal links that do not resolve to valid manifest entries, listing the source document, line number, and broken link target

*[Split from original S-35 per PM-B: build-time link checking is a pipeline feature, not a render feature. P3 priority reflects implementation cost.]*

---

### S-48: Manual deploy via /deploy-kb skill (P1)
**Category:** Integration

**Given** a user triggers the `/deploy-kb` Claude Code skill from the product-management repo
**When** the skill executes
**Then** it runs the sync script against the `main` branch of the source repo, commits changes to the KB repo's `main` branch (or skips commit if no files changed), pushes, and Vercel's automatic deploy hook triggers the build

*[Tightened per PM-B should-fix: specified branch names and no-change behavior.]*

---

### S-49: GitHub PAT authentication for API calls (P1)
**Category:** Integration

**Given** the sync script needs to fetch content from the GitHub API
**When** it makes API requests
**Then** it authenticates using a GitHub Personal Access Token (from environment variable), enabling the 5,000 requests/hour rate limit required for fetching the full file set

---

### S-50: Shared Supabase project with PM app (P1)
**Category:** Integration

**Given** the knowledge base app is configured with Supabase environment variables
**When** a user logs in
**Then** it authenticates against the same Supabase project used by the PM app (same `NEXT_PUBLIC_SUPABASE_URL` and `ANON_KEY`), so any user with a PM app account can access the knowledge base without separate registration

---

### S-51: Vercel deployment target (P2)
**Category:** Integration

**Given** the project is pushed to its deployment branch
**When** Vercel detects the push
**Then** it runs the build process (sync script + Next.js build + Pagefind index) and deploys the result to a production URL, completing within Vercel's build time limits

---

### S-52: Atomic content sync (no partial corruption) (P1)
**Category:** Reliability

**Given** a previous successful build has produced valid content in the `content/` directory
**When** a new sync run fails partway through (e.g., GitHub API rate limit hit after 200 of ~405 files)
**Then** the sync script writes all fetched files to a temporary directory. Only after all files are fetched successfully does it swap the temp directory into `content/`. If any file fails, the previous `content/` directory remains untouched, and the script exits with a non-zero code and a log of all failed files.

*[Tightened per PM-B must-fix: replaced ambiguous "either A or B" with specific atomic-swap mechanism.]*

---

### S-53: Rebuild with unchanged content produces identical output (P1)
**Category:** Reliability

**Given** no documents have changed in the source GitHub repo since the last build
**When** the sync script and build process run again
**Then** the `content/` directory files and `manifest.json` are byte-identical to the previous build, and no spurious diffs appear in version control. The Pagefind index produces functionally equivalent search results (per S-54).

*[Narrowed per PM-B should-fix: Pagefind index files may include non-deterministic elements. Byte-identical requirement scoped to content and manifest only.]*

---

### S-54: Pagefind re-index on rebuild produces consistent results (P2)
**Category:** Reliability

**Given** the same set of HTML pages exists from a rebuild
**When** Pagefind re-indexes the output
**Then** search results for any given query return the same documents in the same relevance order as the previous index, assuming no content changes

---

### S-55: Recently viewed documents on homepage (P2)
**Category:** UX Polish

**Given** an authenticated user who has previously viewed documents in this browser
**When** they visit the homepage
**Then** a "Recently Viewed" section displays the last 10 documents they visited, with titles and category badges, ordered by most recent first. Storage uses localStorage (no backend required).

*[New scenario per PM-B non-technical audience gap: Sales reps visit the same 5-10 documents repeatedly and need a fast path back.]*

---

### S-56: Print-optimized stylesheet (P2)
**Category:** UX Polish

**Given** an authenticated user on a document page
**When** they trigger the browser print function (Ctrl+P / Cmd+P)
**Then** a print-optimized stylesheet activates: the sidebar and table of contents are hidden, the document renders full-width, tables do not overflow, and the Ironmark logo appears in the print header

*[New scenario per PM-B non-technical audience gap: Account Managers preparing for client meetings need to print competitive analyses and pricing sheets.]*

---

### S-57: Loading/skeleton states during transitions (P2)
**Category:** UX Polish

**Given** any page is loading (initial navigation, client-side transition, or search index initialization)
**When** content is not yet available
**Then** a branded skeleton/shimmer placeholder is displayed in the content area, and the sidebar/header remain visible and stable (no layout shift)

*[New scenario per PM-B non-technical audience gap: non-technical users interpret blank screens as "the site is broken."]*

---

### S-58: Reading progress bar (P3)
**Category:** UX Polish

**Given** an authenticated user on a document page
**When** they scroll through the document
**Then** a thin progress bar at the top of the viewport fills proportionally to indicate how far through the document they have scrolled

---

## Priority Summary

| Priority | Count | Percentage |
|----------|-------|------------|
| P1 | 30 | 52% |
| P2 | 18 | 31% |
| P3 | 10 | 17% |
| **Total** | **58** | |

**P1 justification:** The P1 count remains above the typical 20-30% guideline. This is deliberate and carried forward from the draft rationale: the KB is a content site for non-technical users where most functionality either works or does not ship. Auth flows, navigation, rendering, search, and data pipeline correctness are all launch-blocking. PM-B's promotions (S-04, S-05, S-10, S-39, S-40) and new P1 scenarios (S-06, S-07, S-13, S-14, S-33, S-45) are justified by the non-technical audience's low tolerance for friction.

---

## Consolidation Notes

### Priority Changes from Draft
| Scenario | Draft | Approved | Rationale (PM-B Finding) |
|----------|-------|----------|--------------------------|
| S-04 (session refresh) | P2 | P1 | Must-fix: expired tokens = "site is broken" for non-technical users |
| S-05 (deep link redirect) | P2 | P1 | Must-fix: deep links are the primary entry path |
| S-10 (sidebar collapse) | P2 | P1 | Must-fix: 24+ categories unusable without collapse |
| S-20 (code syntax highlighting) | P2 | P3 | Should-fix: target audience rarely encounters code blocks |
| S-39 (page load <2s) | P2 | P1 | Observation accepted: static pages must meet this bar by design |
| S-40 (search <200ms) | P2 | P1 | Observation accepted: same reasoning as S-39 |

### Merged Scenarios
| Result | Sources | Rationale |
|--------|---------|-----------|
| S-12 (browse by category) | Draft S-21 + S-22 | PM-B should-fix: described same page at different priorities |

### New Scenarios Added
| ID | Source | PM-B Finding |
|----|--------|-------------|
| S-06 | PM-B M-07 | Login failure feedback (must-fix) |
| S-07 | PM-B M-01 | Logout flow (must-fix) |
| S-13 | PM-B M-03 | Empty category suppression (should-fix, accepted) |
| S-14 | PO decision | SUMMARY.md coverage warning (derived from must-fix M-02 + PO nav decision) |
| S-25 | PM-B M-06 | Search dialog close behavior (should-fix, accepted) |
| S-33 | PM-B M-08 | SUMMARY.md parse failure (must-fix) |
| S-36 | PM-B M-05 | Internal link rewriting (should-fix, accepted) |
| S-45 | PM-B M-04 | Rate limit handling (observation, accepted as P1) |
| S-47 | PM-B S-35 split | Build-time broken link report (split from original S-35) |
| S-55 | PM-B non-tech gap | Recently viewed documents |
| S-56 | PM-B non-tech gap | Print stylesheet |
| S-57 | PM-B non-tech gap | Loading/skeleton states |

### Tightened Acceptance Criteria
| ID | Change | PM-B Finding |
|----|--------|-------------|
| S-08 (now S-08) | Category cards: icon + count only, no descriptions | Ambiguous "description or icon" |
| S-09 | Explicit: sidebar is SUMMARY.md-curated only | Contradiction S-07 vs S-06 on "full" nav |
| S-32 | Skip-and-warn with line numbers for malformed entries | Vague "handled gracefully" |
| S-43 | Specific testable criteria replacing "renders gracefully" | Must-fix: untestable acceptance criterion |
| S-52 | Atomic temp-dir swap mechanism specified | Ambiguous "either A or B" rollback |
| S-53 | Byte-identical scoped to content + manifest only | Pagefind index may be non-deterministic |
| S-17 | Added logo, favicon, page title format | Incomplete branding spec |
| S-48 | Specified branch names and no-change behavior | Underspecified deploy skill |
| S-31 | Added URL stability constraint | Link sharing via Slack/email |

### Deferred Items
| Item | Reason |
|------|--------|
| `lastModified` in manifest | Scope creep: ~405 additional API calls per sync. Deferred to future enhancement. |
| M-09: Concurrent session behavior | Inherits from shared Supabase project config. Not KB-specific. |
| `docs/11-donai-design/` inclusion | **Excluded** -- PO confirmed 2026-03-17. |

### Items NOT Changed
| PM-B Finding | Decision | Rationale |
|-------------|----------|-----------|
| M-02: Non-SUMMARY.md doc navigation | Reframed as S-14 (coverage warning) | PO decision: SUMMARY.md will be expanded. Build warns on gaps. No two-tier nav fallback. |

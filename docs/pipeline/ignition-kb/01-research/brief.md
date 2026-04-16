# Research Brief: Ignition Knowledge Base Website

**Date:** 2026-03-17
**Feature:** Internal knowledge website surfacing ~799 markdown documents from `kbrapp1/product-management`
**Audience:** Sales, Marketing, Account Managers, Executives
**Target project:** `ignition-knowledge-base` (Next.js 16, React 19, TypeScript, Tailwind CSS)

---

## 1. What Exists

### 1.1 Ignition Knowledge Base Project (Target)

The project has been scaffolded at `C:\Users\doncl\claude-hub\ignition-knowledge-base` with a standard Next.js 16 App Router skeleton. Current state:

- **package.json** -- Next.js 16.1.7, React 19.2.3, Tailwind CSS 4, TypeScript 5. No application dependencies beyond the framework.
- **CLAUDE.md** -- Already defines the full tech stack plan: react-markdown + remark-gfm for rendering, FlexSearch for search, Supabase auth, Vercel deployment, Ironmark brand colors/fonts, and a content pipeline via `scripts/sync-content.ts`.
- **src/** -- Contains only the default `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, and `favicon.ico`. No application code has been written.
- **Pipeline directory** -- `docs/pipeline/ignition-kb/` already has empty stage directories (01-research through 07-results).

### 1.2 Product Management App (Source Patterns)

The PM app (`C:\Users\doncl\claude-hub\product-management`) has several components directly relevant as patterns to replicate or reference.

**Supabase Auth (3 files to mirror):**

| File | Pattern |
|------|---------|
| `src/lib/supabase/client.ts` | Browser client using `@supabase/ssr` with PKCE flow and a navigator.locks bypass for cross-tab safety |
| `src/lib/supabase/server.ts` | Server client with cookie-based session, falls back to service role client outside request scope |
| `src/middleware.ts` | Route-level auth guard: skips static assets, public routes, and API routes; redirects unauthenticated page requests to `/login` |

These three files form a clean, proven Supabase auth pattern. The KB app should replicate the same structure with a simplified public routes list (just `/login` and `/auth`).

**Markdown Rendering:**

The PM app uses `react-markdown` v10.1.0 + `remark-gfm` v4.0.1. The key rendering component is at `src/app/knowledge-base/[id]/page.tsx` which provides:
- ReactMarkdown with remarkGfm plugin
- Custom link component (opens in new tab)
- Premium prose styling via shared `PREMIUM_PROSE_CLASSES` constant (in `viewer-utils.ts`)
- Reading progress bar, document outline panel, word count, reading time
- Glassmorphism header with type badges

The `PREMIUM_PROSE_CLASSES` constant (`src/app/don-ai/components/chat/viewer-utils.ts`) defines extensive Tailwind prose customizations worth extracting into the KB app directly.

**Document Outline:**

`src/app/knowledge-base/[id]/OutlinePanel.tsx` parses `## ` headings from markdown content to build a clickable table of contents with active section tracking via scroll position. This is a pattern to replicate.

**GitHub Sync Config:**

`src/config/github-sync.config.ts` defines the content source:
- Repo: `kbrapp1/product-management`, branch: `master`
- Include: `docs/**/*.md`
- Exclude: `.claude/**`, `node_modules/**`, `docs/05-operations/people/**`, `docs/05-operations/document-templates/**`, `docs/09-legacy/**`
- Minimum file size: 1,500 bytes (skips stubs)
- Type mapping by directory path (strategy, roadmap, feature, meeting_notes, market_research, board-slides)

The KB app's sync script should apply these same exclusions and type mappings.

### 1.3 Content Source (SUMMARY.md)

`docs/SUMMARY.md` is the editorial navigation structure with **24 categories** and **122 curated entries** (out of 799 total files). This represents a hand-picked subset -- roughly 15% of all content.

**Categories in SUMMARY.md:**

| Category | Entries | Notes |
|----------|---------|-------|
| Strategy | 2 | Core vision docs |
| Vertical Strategies | 5 | Per-vertical product visions |
| Pricing | 6 | Full pricing analysis suite |
| Market Research | 11 | TAM, competitive by vertical |
| Roadmap | 1 | Capability themes |
| MVP | 6 | Critical path, deliverables, brand launches |
| Problem Statements | 5 | Validated problems + briefs |
| Roadmap Views | 2 | Source + audit |
| Competitive Intelligence | 4 | Forrester, scoring, revenue data |
| DMP & TCMA Competitors | 5 | Deep research reports |
| ROI Reporting Competitors | 1 | |
| Brand Asset Mgmt Competitors | 12 | Individual platform assessments |
| Specific Competitor Assessments | 5 | ElveX, Vidoso, Zellus, etc. |
| Consultants | 1 | Winterberry summary |
| Personas | 1 | |
| Customer Interviews | 7 | Demo notes, check-ins |
| Vendors | 3 | Iris, Atlas, What Converts |
| GTM Enablement | 14 | Messaging, sales, rollout, marketing |
| Sales Tutorials | 4 | Demo script, capability matrix |
| Customer Enablement | 5 | Getting started guides, FAQ |
| Marketing Materials | 4 | Feature descriptions, data flow |
| AI Prompt Library | 6 | Vertical, platform, executive prompts |
| Board Presentations | 5 | Q2 2025 through Q1 2026 |
| Internal Communications | 3 | Brand unification, roadmap comms |

**Notable:** One entry has a malformed link (`Zellus Marketing` has a nested markdown link pointing to a non-existent `specific-competitor-assessments/` path). One entry (`ROI-Based Reporting Expanded Problem Statement`) uses a bare `problem-statements/` path instead of `02-roadmap/problem-statements/`, which is a different relative root. These need handling in the sync script.

---

## 2. Content Inventory

### 2.1 File Counts by Directory

| Directory | Files | In SUMMARY.md | Notes |
|-----------|-------|---------------|-------|
| `docs/01-strategy/` | 30 | 24 | Well-curated |
| `docs/02-roadmap/` | 15 | 14 | Nearly complete coverage |
| `docs/03-capabilities/` | 56 | 0 | Not in SUMMARY.md at all |
| `docs/04-architecture/` | 34 | 0 | Not in SUMMARY.md at all |
| `docs/05-operations/` | 55 | 0 | 25 excluded (people + templates) |
| `docs/06-updates/` | 59 | 0 | Meeting notes, updates |
| `docs/07-research/` | 69 | 38 | Good coverage |
| `docs/08-communications/` | 74 | 46 | Good coverage |
| `docs/09-legacy/` | 31 | 0 | Excluded by sync config |
| `docs/10-departments/` | 24 | 0 | Not in SUMMARY.md |
| `docs/11-donai-design/` | 35 | 0 | Technical design docs |
| `docs-donai/` | 304 | 0 | Engineering docs (20 subdirectories) |
| Other (`plans/`, `problem-statements/`, `specific-competitor-assessments/`) | 11 | 1 | Loose directories under `docs/` |
| **Total** | **799** | **122** | |

### 2.2 Key Observations

1. **SUMMARY.md covers 122 of 799 files (15%).** It is a curated navigation index, not a complete TOC. The KB app needs a strategy for the other 677 files.

2. **`docs/03-capabilities/` (56 files) and `docs/04-architecture/` (34 files) are entirely absent from SUMMARY.md** but are likely high-value for the target audience (Sales needs capability descriptions, executives need architecture overview).

3. **`docs-donai/` (304 files)** is engineering documentation across 20 subdirectories (pipeline design, HubSpot integration, LLM routing, security, etc.). The CLAUDE.md specifies syncing from both `docs/` and `docs-donai/`, but these are developer-focused. Decision needed: include or exclude for a Sales/Marketing/Exec audience?

4. **15 files are under 1,500 bytes** -- these are stubs that the PM app's sync config already skips.

5. **`docs/09-legacy/` (31 files)** is excluded by the existing sync config. These should remain excluded.

6. **`docs/05-operations/people/` (18 files) and `docs/05-operations/document-templates/` (7 files)** are excluded by sync config. The remaining 30 operations files are not in SUMMARY.md but may be relevant.

---

## 3. Patterns to Follow

### 3.1 Project Conventions (from PM app and CLAUDE.md)

- **Framework:** Next.js App Router with `'use client'` directives where needed
- **Auth:** Supabase SSR with PKCE flow, middleware-based route protection
- **Styling:** Tailwind CSS with prose classes for markdown content
- **Icons:** `lucide-react`
- **Animations:** `framer-motion`
- **Markdown:** `react-markdown` + `remark-gfm`
- **Component pattern:** Colocated page + component files (e.g., `[id]/page.tsx` + `[id]/OutlinePanel.tsx`)
- **State management:** React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`), no external state library
- **Error handling:** Explicit error states with user-friendly messages, no silent swallowing
- **No lint suppression:** No `// eslint-disable`, `// @ts-ignore`, `as any`

### 3.2 Brand (from CLAUDE.md)

- **Colors:** Ironmark red `#EF462F`, cyan `#38C6F4`, gray `#707070`, off-white `#f4f2f2`
- **Fonts:** Raleway (body), Bebas Neue (headings), Lora (serif accent)
- **Icons:** lucide-react
- **Animations:** framer-motion

### 3.3 Content Pipeline (from CLAUDE.md)

The planned architecture is a build-time content pipeline:
1. `scripts/sync-content.ts` fetches `.md` files from GitHub API
2. Writes to `content/` directory preserving structure
3. Generates `content/manifest.json` with metadata
4. Builds search index at `public/search-index.json`
5. Rebuilds triggered manually via `/deploy-kb` skill

This is a static-generation approach -- content baked into the build, no runtime database for content.

---

## 4. Constraints

### 4.1 Technical

- **GitHub API rate limits:** Unauthenticated: 60 req/hr. Authenticated (PAT): 5,000 req/hr. For 799 files, authenticated access is mandatory. The PM app batches with `SYNC_BATCH_SIZE = 5` and `SYNC_CONCURRENCY = 3` to stay within limits.
- **Vercel build time:** Free tier: 45s, Pro: 5 min. With 799 files to fetch, the sync script needs to be efficient or run as a separate prebuild step.
- **Bundle size:** 799 documents as static JSON would be large. The manifest should contain metadata only; full content should be loaded on-demand or at build time per page (SSG with `generateStaticParams`).
- **Supabase auth:** Shared project with the PM app. The KB app will use the same Supabase project (same `NEXT_PUBLIC_SUPABASE_URL` and `ANON_KEY`). Users must already have accounts in this Supabase project.

### 4.2 Business

- **Audience is non-technical.** Sales, Marketing, Account Managers, and Executives. No code documentation UX -- this should feel like a polished internal knowledge portal, not a developer docs site.
- **No role-based content filtering.** Per feature intent: "Content is NOT organized by role -- users navigate freely."
- **`docs-donai/` inclusion is a judgment call.** 304 engineering docs may confuse or clutter the site for non-technical users. If included, they need clear labeling.

### 4.3 Content Quality

- **SUMMARY.md has 2 broken/malformed entries** that need graceful handling (Zellus nested link, ROI problem statement bare path).
- **No SUMMARY.md coverage for 03-capabilities, 04-architecture, 06-updates, 10-departments, 11-donai-design, or docs-donai.** If these are included, the site needs auto-generated navigation for uncurated content.
- **File naming is inconsistent.** Some use kebab-case (`mvp-critical-path.md`), some use Title-Case with special characters (`Competitive-Analysis--Distributed-Marketing-Platforms-(DMP)-for-Healthcare.md`). URL slug generation needs to handle all of these cleanly.

---

## 5. Search Library Evaluation

### 5.1 Candidates

| Library | Type | Index Strategy | Bundle | Best For |
|---------|------|---------------|--------|----------|
| **Pagefind** | Full-text, Rust-powered | Build-time, lazy-loaded chunks | Very small (loads on demand) | Static/docs sites at scale |
| **FlexSearch** | Full-text, JS | Runtime or prebuild | Small | Large in-memory datasets |
| **Lunr.js** | Full-text, JS | Prebuild JSON index | Moderate | Small-medium sites |
| **Fuse.js** | Fuzzy matching, JS | Runtime (needs full dataset in memory) | Moderate | Small datasets, typo-tolerant |

### 5.2 Recommendation: Pagefind over FlexSearch

The CLAUDE.md currently specifies FlexSearch, but the research strongly favors **Pagefind** for this use case:

1. **Scale:** 799 documents is a large corpus. Pagefind indexes at build time and lazy-loads index chunks -- users download only what they search for. FlexSearch loads the entire index into memory.
2. **Industry momentum:** Nextra 4 (the Next.js docs framework) migrated from FlexSearch to Pagefind specifically for better performance and relevance. Docusaurus also supports Pagefind plugins.
3. **Typo tolerance:** Pagefind handles typos well. FlexSearch has limited fuzzy matching. For a non-technical audience, typo tolerance matters.
4. **Zero config:** Pagefind indexes HTML output after build (`npx pagefind --site .next/server/app` or similar). No custom indexing code needed.
5. **Bundle impact:** Pagefind's JS payload is ~6KB. The index is fetched on-demand in chunks.

**Tradeoff:** Pagefind is designed for static HTML output. With Next.js App Router SSG pages, it can index the rendered output. If the app uses heavy client-side rendering, Pagefind needs the pre-rendered HTML. Since this is a docs site with static content, SSG is the natural fit anyway.

**If FlexSearch is preferred** (simpler, already specified in CLAUDE.md): The prebuild script can generate a JSON index and the client loads it on first search. For 799 docs, the index would be roughly 2-5MB depending on content -- acceptable but not ideal for mobile.

### 5.3 Fuse.js and Lunr.js -- Not Recommended

- **Fuse.js** requires the entire dataset in client memory. With 799 documents, this means loading all content upfront. Not viable.
- **Lunr.js** has poor typo tolerance and is showing its age. No compelling advantage over FlexSearch or Pagefind.

---

## 6. Prior Art and Recommendations

### 6.1 Navigation Patterns (from GitBook, Docusaurus, Mintlify, Nextra)

**Sidebar navigation** is the universal standard for documentation sites:
- Collapsible category groups matching the SUMMARY.md structure
- Active page highlighting and breadcrumbs
- Sticky/fixed sidebar that persists during scroll
- Mobile: sidebar collapses into hamburger menu

**Right-side table of contents** for in-page heading navigation:
- Auto-generated from h2/h3 headings in the current document
- Active heading tracking on scroll (the PM app already does this in `OutlinePanel.tsx`)
- Sticky positioning so it stays visible

**Breadcrumbs** showing `Category > Subcategory > Document Title` -- essential for a 799-doc site where users arrive via search.

### 6.2 Search UX

- **Cmd/Ctrl+K shortcut** to open search -- this is now universal across all major docs platforms
- **Instant results** as user types (no submit button)
- **Highlighted matching terms** in result snippets
- **Category badges** on results so users know what type of content they are looking at
- **Keyboard navigation** (arrow keys to move, Enter to select)
- **Recent searches** for returning users

### 6.3 Document Rendering

- **Responsive tables** -- many markdown docs contain large comparison tables. These need horizontal scroll on mobile.
- **Code block syntax highlighting** -- relevant for architecture docs. Use a lightweight highlighter.
- **Copy button on code blocks** -- standard practice.
- **Image handling** -- some docs may reference images. The sync pipeline needs to handle image assets or gracefully handle missing ones.

### 6.4 Architecture Recommendation: Two-Tier Navigation

Given the SUMMARY.md covers 15% of content, the recommended approach:

**Tier 1 -- Curated Navigation (SUMMARY.md):** The primary sidebar navigation mirrors SUMMARY.md's 24 categories and 122 entries. This is the "editorial" path for Sales/Marketing/Execs who want guided access.

**Tier 2 -- Browse All / Search:** A secondary "Browse" view organized by directory (01-strategy, 02-roadmap, etc.) that shows all documents, including the 677 not in SUMMARY.md. Search covers everything.

This avoids forcing a choice between curated-only (losing 85% of content) and everything-at-once (overwhelming users with 799 items in a flat list).

---

## 7. Open Questions (Requiring Don's Judgment)

1. **Should `docs-donai/` (304 engineering docs) be included?** These are developer-focused (pipeline design, HubSpot integration, LLM routing, security). Including them doubles the content but may confuse the Sales/Marketing audience. Options: (a) exclude entirely, (b) include under a clearly labeled "Engineering" section, (c) include but deprioritize in navigation.

2. **Should `docs/06-updates/` (59 meeting notes) be included?** These are meeting transcripts and updates. They are searchable context but may not be worth navigating. Option: include in search but not in sidebar navigation.

3. **FlexSearch or Pagefind?** The CLAUDE.md specifies FlexSearch. Research favors Pagefind for this scale and audience. Should we switch?

4. **SUMMARY.md as source of truth or starting point?** The SUMMARY.md covers 15% of files. Should the curated navigation be expanded to include 03-capabilities and 04-architecture (which have 90 combined docs of high value to the audience), or should those be discoverable only via search/browse?

5. **Authentication scope:** Should every page require auth, or should some content (like the GTM enablement suite) be accessible without login for prospects? The PM app pattern protects everything behind auth.

6. **Content freshness:** The CLAUDE.md specifies manual rebuild via `/deploy-kb` skill. Should we add a webhook or cron-based rebuild trigger for when docs change in the PM repo?

---

## Sources

- [FlexSearch vs Fuse.js vs Lunr -- npm trends](https://npmtrends.com/flexsearch-vs-fuse.js-vs-lunr)
- [Best Search Packages for JavaScript -- Mattermost](https://mattermost.com/blog/best-search-packages-for-javascript/)
- [Top 6 JavaScript Search Libraries](https://byby.dev/js-search-libraries)
- [npm-compare: fuse.js vs flexsearch vs minisearch](https://npm-compare.com/elasticlunr,flexsearch,fuse.js,minisearch)
- [Nextra 4 x App Router -- Migration from FlexSearch to Pagefind](https://the-guild.dev/blog/nextra-4)
- [FlexSearch vs Pagefind Usage Comparison](https://www.wmtips.com/technologies/compare/flexsearch-vs-pagefind/)
- [Implementing Pagefind Search for Hugo](https://jamieede.com/posts/pagefind-search-for-hugo/)

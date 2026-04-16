# Challenge Report: Ignition Knowledge Base Requirements

**Date:** 2026-03-17
**Reviewer:** PM-B (Requirements-Fit Pipeline)
**Input:** `02-requirements/draft.md` (47 scenarios), `01-research/brief.md`

---

## 1. Priority Disputes

### MUST-FIX

**S-04 (Session refresh) should be P1, not P2.**
A Sales rep shares a deep link with a colleague. That colleague opens it two hours later, their token has expired, and they get bounced to login with no redirect back (because S-05 is also P2). For a non-technical audience, "I was logged in and now it does not work" is indistinguishable from "the site is broken." Supabase token refresh is a few lines of middleware code -- it is not heavy lift, and without it the site will feel unreliable within a single workday.

**Proposed fix:** Promote S-04 to P1.

**S-05 (Redirect to original page after login) should be P1, not P2.**
This is the most common entry path for the target audience. Executives receive Slack/email links to specific documents. If they click a link, get sent to login, authenticate, and land on the homepage instead of the document they wanted, they will not hunt for it -- they will close the tab. Deep link preservation is table-stakes for any authenticated content site.

**Proposed fix:** Promote S-05 to P1.

**S-08 (Sidebar collapse/expand) should be P1, not P2.**
The sidebar will contain 24+ categories. If all categories are expanded simultaneously with no collapse, the navigation list will be hundreds of items long and unusable. Collapse/expand is not polish -- it is the mechanism that makes a 24-category sidebar functional at all.

**Proposed fix:** Promote S-08 to P1.

### SHOULD-FIX

**S-11 (Code block syntax highlighting) is over-prioritized at P2.**
The target audience is Sales, Marketing, Account Managers, and Executives. They will encounter code blocks rarely, and when they do, monospace-on-gray is sufficient. Syntax highlighting with a copy button is a developer docs feature. This could safely drop to P3 without any user impact.

**Proposed fix:** Demote S-11 to P3.

**S-38 (Page load under 2 seconds) and S-39 (Search results within 200ms) should be P1, not P2.**
These are statically generated pages -- if they cannot load in under 2 seconds, something is fundamentally wrong with the build. More importantly, the non-technical audience will judge the site's credibility in the first 3 seconds. Performance targets should be P1 constraints that the architect designs against, not P2 aspirations tested after the fact.

**Proposed fix:** Promote S-38 and S-39 to P1. Alternatively, if the concern is that these are hard to enforce at the requirements level, at minimum flag them as P1 acceptance criteria on S-36 (static generation) and S-18 (Pagefind search).

**S-22 (Category page lists documents) is a near-duplicate of S-21.**
S-21 says clicking a category card navigates to a category page listing documents. S-22 says the category page lists documents with title, description, and content type badge. These describe the same page. Having them as separate scenarios at different priorities (P1 vs P2) creates ambiguity about what the category page actually contains at launch.

**Proposed fix:** Merge S-22 into S-21 as a single P1 scenario. The "Then" clause of S-21 should specify the list format (title, description/summary, sorted by SUMMARY.md order).

---

## 2. Missing Scenarios

### MUST-FIX

**M-01: Logout flow (P1)**
There is no scenario for logging out. Every authenticated application needs one.

> **Given** an authenticated user on any page
> **When** they click the logout/sign-out control
> **Then** the Supabase session is destroyed, the session cookie is cleared, and the user is redirected to the `/login` page

**M-02: Documents not in SUMMARY.md are still accessible (P1)**
The research brief states SUMMARY.md covers only 122 of ~405 included files (after exclusions). PM-A Note 3 acknowledges this gap but does not resolve it. If a user searches for a document that exists in the manifest but is not in SUMMARY.md, clicks the result, and arrives at the page -- what navigation context do they see? Is the sidebar blank for that section? Does the breadcrumb break?

> **Given** an authenticated user navigates to a document that exists in the manifest but is not listed in SUMMARY.md
> **When** the page loads
> **Then** the document renders with a breadcrumb derived from its directory path, the sidebar highlights the appropriate directory-based category, and no navigation elements appear broken or empty

**M-03: Empty category handling (P1)**
If SUMMARY.md expansion is incomplete, or if all documents in a directory are under the 1,500-byte minimum, a category could have zero documents.

> **Given** a category exists in the navigation structure but contains zero documents after filtering
> **When** the build process runs
> **Then** that category is excluded from the homepage grid and sidebar navigation, with a build-time warning logged

**M-04: GitHub API rate limit handling during sync (P1)**
S-42 mentions the 5,000 request/hour rate limit and S-33 handles individual file failures, but there is no scenario for the specific case where the API rate limit is hit mid-sync. This is a realistic failure mode when syncing ~405 files.

> **Given** the sync script is fetching content and the GitHub API returns a 403 rate-limit response
> **When** the rate limit is encountered
> **Then** the script logs the remaining file count, waits for the rate limit reset window (from the `X-RateLimit-Reset` header), and resumes fetching -- or aborts with a clear message if the reset window exceeds 5 minutes

### SHOULD-FIX

**M-05: Internal cross-document links resolve to KB URLs (P2)**
Many markdown documents contain relative links to other documents (e.g., `[See MVP Critical Path](../02-roadmap/mvp/mvp-critical-path.md)`). These need to be rewritten to the KB's URL slug format at build time, not left as raw GitHub paths that 404.

> **Given** a document contains a markdown link with a relative path pointing to another `.md` file in the repo
> **When** the page renders
> **Then** the link href is rewritten to the corresponding KB URL slug (e.g., `/roadmap/mvp/mvp-critical-path`), and clicking it navigates within the KB rather than to a broken path

**M-06: Search dialog close behavior (P2)**
S-18 specifies how to open search but not how to close it.

> **Given** the search dialog is open
> **When** the user presses Escape, clicks outside the dialog, or presses Cmd+K/Ctrl+K again
> **Then** the dialog closes and keyboard focus returns to the previously focused element

**M-07: Login failure feedback (P1)**
S-03 covers the happy path only. What happens when credentials are wrong?

> **Given** a user on the `/login` page
> **When** they submit invalid credentials (wrong email, wrong password, or nonexistent account)
> **Then** the page displays a specific, non-technical error message (e.g., "Incorrect email or password. Please try again.") without revealing whether the email exists in the system, and the form remains editable for retry

**M-08: Build-time SUMMARY.md parse failure (P1)**
S-27 describes parsing SUMMARY.md but only addresses malformed individual links. What if SUMMARY.md itself is malformed or missing?

> **Given** the sync script runs and SUMMARY.md is either missing from the repo or contains structural errors that prevent parsing (e.g., no markdown list items found)
> **When** the parse step executes
> **Then** the build fails with a clear error message identifying the issue, rather than producing a site with no navigation

**M-09: Concurrent session behavior (P2)**
A user is logged in on their laptop and their phone. Do both sessions remain valid? This matters because the shared Supabase project (S-43) may have session policies set by the PM app.

> **Given** a user has active sessions on two devices
> **When** they access the KB from both devices simultaneously
> **Then** both sessions remain valid and neither device is logged out, consistent with the PM app's session behavior

---

## 3. Ambiguous Acceptance Criteria

### MUST-FIX

**S-32: "Renders gracefully" is not testable.**
The "Then" clause says "react-markdown renders as much content as possible without crashing, and malformed sections appear as plain text." What counts as "as much as possible"? If a document has 10 sections and the 3rd has a broken table, does everything after the table render, or just sections 1-2?

**Proposed fix:** Replace with: "Then the page renders without a white screen or error boundary. Content before and after the malformed section renders correctly. The malformed section itself renders as unstyled plain text. No JavaScript errors appear in the browser console."

**S-27: "Handled gracefully" for malformed links is vague.**
The "Then" clause says malformed links are "handled gracefully by either resolving them or excluding them with a build warning." Which is it? The implementer needs to know whether to attempt resolution (complex) or just skip-and-warn (simple).

**Proposed fix:** Replace with: "Then malformed entries (broken link syntax, non-resolvable paths) are excluded from the navigation tree and a build-time warning is logged identifying each excluded entry by line number and raw text. The rest of the navigation tree builds successfully."

**S-06: "Brief description or representative icon" is ambiguous.**
The "Then" clause says each category shows "a brief description or representative icon." Where do descriptions come from? SUMMARY.md has no descriptions. Are these hardcoded? Auto-generated from the first document? The "or" makes this untestable -- either outcome passes.

**Proposed fix:** Pick one and specify the source. Recommendation: "Each category card displays the category name, document count, and a manually assigned icon from lucide-react. No auto-generated descriptions for v1."

**S-46: "Rolls back to the previous content state" lacks mechanism.**
The "Then" says the script "either completes with partial content and a clear warning log, or rolls back to the previous content state." Saying "either A or B" in an acceptance criterion means the implementer picks, and the tester does not know what to verify.

**Proposed fix:** Pick one behavior. Recommendation: "Then the sync script writes all fetched files to a temporary directory. Only after all files are fetched successfully does it swap the temp directory into `content/`. If any file fails, the previous `content/` directory remains untouched, and the script exits with a non-zero code and a log of all failed files."

### SHOULD-FIX

**S-16: Brand styling list is specific but incomplete.**
The "Then" clause lists exact hex colors and font names, which is good. But it does not specify: the Ironmark logo placement, the favicon, or the page title format. These are highly visible branding elements.

**Proposed fix:** Add to S-16's "Then" clause: "The Ironmark logo appears in the sidebar header. The browser tab displays a branded favicon and page titles in the format 'Document Title | Ignition Knowledge Base'."

**S-41: Deploy skill description is underspecified.**
"Runs the content sync script, commits any content changes, pushes to the deployment branch, and triggers a Vercel build." What is "the deployment branch"? Is it `main`? A dedicated `deploy` branch? What happens if there are no content changes -- does it still trigger a build?

**Proposed fix:** Specify the branch name and the no-change behavior: "Then it runs the sync script against the `main` branch of the source repo, commits changes to the KB repo's `main` branch (or skips commit if no files changed), pushes, and Vercel's automatic deploy hook triggers the build."

**S-45: "Byte-identical" may be overly strict.**
Pagefind index files may include timestamps or randomized chunk names across builds. Requiring byte-identical output for the Pagefind index is likely not achievable. The manifest and content files can be deterministic, but the search index may not be.

**Proposed fix:** Narrow the scope: "Then the `content/` directory files and `manifest.json` are byte-identical to the previous build. The Pagefind index produces functionally equivalent search results (per S-47)."

---

## 4. Contradictions

### MUST-FIX

**S-24 says ~405 files; research brief says ~799 files.**
S-24 references "~405 files" while the research brief counts 799 total files. The delta is accounted for by exclusions (`docs-donai/` = 304, `docs/06-updates/` = 59, `docs/09-legacy/` = 31, excluded operations = 25, plus stubs). However, the math does not add up: 799 - 304 - 59 - 31 - 25 = 380, not 405. And the PO decisions list excludes `docs-donai/`, `docs/06-updates/`, `docs/09-legacy/`, and two operations subdirectories, but `docs/11-donai-design/` (35 files) is not mentioned in the exclusion list despite being developer-focused content.

**Proposed fix:** Provide an exact count of included files after all exclusion rules are applied. Clarify whether `docs/11-donai-design/` is included or excluded. The "~405" approximation is fine for a summary but the sync script needs a definitive set of inclusion/exclusion rules.

**S-07 says "full navigation tree" but S-06 says "categories derived from SUMMARY.md structure."**
If SUMMARY.md only covers 122 of ~405 included files, the "full navigation tree" in S-07 is actually a partial navigation tree. Documents outside SUMMARY.md would have no sidebar entry. This contradicts the implied promise that users can navigate to all content.

**Proposed fix:** Either (a) explicitly state that the sidebar only shows SUMMARY.md-curated content and uncurated docs are reachable only via search, or (b) define a two-tier navigation as the research brief recommends (Section 6.4) and add a scenario for the "Browse All" tier.

### SHOULD-FIX

**S-25 manifest includes `lastModified` "from git metadata or file fetch timestamp."**
The "or" creates two different behaviors. Git metadata gives the actual last-edit date (meaningful). File fetch timestamp gives the sync date (meaningless -- it would be the same for all files on every sync). This matters because PM-A Note 4 mentions "recently updated" as a candidate feature. If `lastModified` is always the sync timestamp, that feature is impossible.

**Proposed fix:** Specify git metadata as the required source. The GitHub API's commits endpoint can provide last-commit-date per file. If this is too expensive (one API call per file), state that `lastModified` is deferred to a future version and remove it from the manifest schema.

---

## 5. Scope Creep Warnings

**S-40 (Image optimization via Next.js Image component) -- HIGH RISK**
Markdown documents may reference images via relative paths pointing to files in the GitHub repo. These images need to be (a) synced alongside the markdown, (b) stored somewhere accessible at runtime, and (c) mapped through Next.js Image. This is a non-trivial pipeline extension. For a P3 item, it has P1-level implementation complexity if images are actually present in the content.

**Proposed fix:** Split into two parts. First, audit the content for image references and quantify how many documents contain them. If the count is low, defer entirely. If images are common, promote the sync-side work (fetching images) to P2 and keep the optimization layer at P3.

**S-35 (Broken internal links show fallback) -- MODERATE RISK**
Detecting broken internal links at build time requires resolving every markdown link against the manifest. This is a link-checking pipeline, not a simple render feature. At P2, this could consume disproportionate implementation time.

**Proposed fix:** Split S-35 into two scenarios: (a) P2: Broken links navigate to the 404 page (this is free -- it is just S-31 working as designed). (b) P3: Build-time link validation produces a report of broken internal references. The "visually distinguishable" broken link styling is part of (b), not (a).

**S-25 (Content manifest with `lastModified` from git metadata) -- MODERATE RISK**
Getting per-file last-modified dates from the GitHub API requires one commit-history API call per file, which for 405 files is a significant additional API cost and sync time. This is a hidden P1 dependency masquerading as a manifest field.

**Proposed fix:** Drop `lastModified` from the v1 manifest schema. Add it as a separate P2 enhancement with its own scenario that specifies the API strategy (batch commit history vs. repository events endpoint).

---

## 6. Non-Technical Audience Gaps

### MUST-FIX

**No "recently viewed" or navigation breadcrumb trail for return visits.**
Sales reps will visit the same 5-10 documents repeatedly (pricing sheets, competitive analyses, demo scripts). There is no scenario for quickly returning to previously viewed content. This audience will not memorize URL paths or re-search every time.

**Proposed fix:** Add a P2 scenario for "Recently Viewed" using localStorage (no backend needed):

> **Given** an authenticated user who has previously viewed documents in this browser
> **When** they visit the homepage
> **Then** a "Recently Viewed" section displays the last 10 documents they visited, with titles and category badges, ordered by most recent first

**No scenario for printing or exporting a document.**
Account Managers preparing for client meetings will want to print a competitive analysis or pricing sheet. Markdown rendered in a web app often prints poorly (sidebar prints, code blocks overflow, etc.).

**Proposed fix:** Add a P2 scenario:

> **Given** an authenticated user on a document page
> **When** they trigger the browser print function (Ctrl+P / Cmd+P)
> **Then** a print-optimized stylesheet activates: the sidebar and table of contents are hidden, the document renders full-width, tables do not overflow, and the Ironmark logo appears in the print header

### SHOULD-FIX

**No loading/skeleton states specified.**
Non-technical users seeing a blank white screen for even 500ms will assume the site is broken. There are no scenarios for loading states during page transitions, search index loading, or initial auth check.

**Proposed fix:** Add a P2 scenario:

> **Given** any page is loading (initial navigation, client-side transition, or search index initialization)
> **When** content is not yet available
> **Then** a branded skeleton/shimmer placeholder is displayed in the content area, and the sidebar/header remain visible and stable (no layout shift)

**No scenario for the search bar in the header.**
S-18 specifies Cmd+K to open search. But non-technical users do not know keyboard shortcuts. There must be a visible, clickable search input in the header/toolbar that opens the same search dialog.

**Proposed fix:** Amend S-18 or add a companion scenario (P1):

> **Given** an authenticated user on any page
> **When** they click the search input/icon in the top navigation bar
> **Then** the same search dialog from S-18 opens, with the same behavior for results, keyboard navigation, and close actions

**No mention of link sharing or URL stability.**
If URL slugs change between builds (e.g., because the slug generation algorithm is tweaked), all previously shared links break. For an audience that shares links via Slack and email, URL stability is critical.

**Proposed fix:** Add a constraint to S-26: "URL slugs, once generated, must remain stable across rebuilds. Any change to the slug generation algorithm must include redirects from old slugs to new ones."

---

## 7. Summary Recommendation

**Approve with changes.** The draft is thorough and well-structured -- 47 scenarios with clear Given/When/Then format and reasonable category coverage. PM-A has done strong work, particularly on the data pipeline, idempotency, and error handling categories. The priority justification in Note 1 is appreciated and mostly sound.

However, the following issues should be resolved before passing to the Consolidator:

### Must-Fix Items (9)

| # | Issue | Section |
|---|-------|---------|
| 1 | Promote S-04 (session refresh) to P1 | Priority Disputes |
| 2 | Promote S-05 (deep link redirect) to P1 | Priority Disputes |
| 3 | Promote S-08 (sidebar collapse) to P1 | Priority Disputes |
| 4 | Add M-01: Logout flow (P1) | Missing Scenarios |
| 5 | Add M-02: Non-SUMMARY.md document navigation (P1) | Missing Scenarios |
| 6 | Add M-07: Login failure feedback (P1) | Missing Scenarios |
| 7 | Add M-08: SUMMARY.md parse failure (P1) | Missing Scenarios |
| 8 | Tighten S-32 "renders gracefully" into testable criteria | Ambiguous Criteria |
| 9 | Resolve S-07 vs S-06 contradiction on full vs partial nav | Contradictions |

### Should-Fix Items (10)

| # | Issue | Section |
|---|-------|---------|
| 1 | Demote S-11 (syntax highlighting) to P3 | Priority Disputes |
| 2 | Merge S-22 into S-21 | Priority Disputes |
| 3 | Add M-03: Empty category handling | Missing Scenarios |
| 4 | Add M-05: Internal link rewriting | Missing Scenarios |
| 5 | Add M-06: Search dialog close behavior | Missing Scenarios |
| 6 | Tighten S-27 "handled gracefully" | Ambiguous Criteria |
| 7 | Tighten S-06 "description or icon" | Ambiguous Criteria |
| 8 | Tighten S-46 to pick one rollback behavior | Ambiguous Criteria |
| 9 | Add visible search bar/icon scenario (P1) | Non-Technical Gaps |
| 10 | Add print stylesheet scenario (P2) | Non-Technical Gaps |

### Observations (6)

| # | Issue | Section |
|---|-------|---------|
| 1 | Promote S-38/S-39 performance targets to P1 | Priority Disputes |
| 2 | Add M-04: Rate limit handling | Missing Scenarios |
| 3 | Add M-09: Concurrent session behavior | Missing Scenarios |
| 4 | Clarify exact included file count and `docs/11-donai-design/` status | Contradictions |
| 5 | Drop `lastModified` from v1 manifest to avoid scope creep | Scope Creep |
| 6 | Add recently-viewed and loading states for non-technical UX | Non-Technical Gaps |

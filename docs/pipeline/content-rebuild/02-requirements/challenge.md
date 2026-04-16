# Ignition Knowledge Base — Adversarial Challenge Report (PM-B)

**Date:** 2026-03-18
**Pipeline Stage:** 02-requirements (PM-B Challenge)
**Inputs Reviewed:** Research brief (01-research/brief.md), PM-A content plan (02-requirements/draft.md)

---

## Executive Summary

PM-A's content plan is thorough, well-structured, and demonstrates strong alignment with the research brief. The page-by-page briefs are detailed enough for an implementer to build without ambiguity. However, the plan over-indexes on breadth (22 pages at launch) when a tighter 14-page MVP would ship faster, get feedback sooner, and avoid the "coming soon" graveyard problem. The five "coming soon" capability pages are the weakest part of the plan -- they deliver little value to the sales audience, risk creating a perception of vaporware, and will be the first pages to go stale. The plan also lacks a "daily use" hook that would bring people back after the initial visit.

---

## Critical Issues (Must Fix)

### C1: 22 Pages Is Scope Bloat for a V1 Launch

**The problem:** 22 pages with ~10,150 words of hardcoded TSX content is a significant build for an internal site that has never been validated with its audience. Every page added increases time-to-launch and maintenance surface area.

**The math:** 5 "coming soon" capability pages (pages 8-12) account for ~1,750 words and 5 TSX files that say essentially the same thing with different nouns: "here is the vision, here are bullets, here is why it matters." These pages do not help a salesperson sell what exists today.

**Recommended change:** Cut to a 14-page MVP. Eliminate the 5 individual "coming soon" capability pages. Instead, expand the Capabilities Overview page (page 5) to include a "What's Coming" section with a brief card per future capability -- same information, zero additional pages. The overview page already has capability cards; add a "Coming Soon" section below the live capabilities with 3-4 sentences and a bullet list per theme. Ship the 14-page version, validate with 5-6 internal users, then decide if individual pages are warranted.

**Pages in the MVP (14):**
1. Home
2. What Is Ignition
3. How Ignition Works
4. Why Ignition
5. Capabilities Overview (expanded with "Coming Soon" section)
6. ROI Reporting (full page)
7. Iggy AI (full page)
8. Industries Overview
9. Healthcare
10. QSR
11. Automotive
12. Financial Services
13. Franchise
14. Competitive Positioning

Resources section (Glossary, FAQ, Demo Guide) moves to Phase 2 -- see C3.

---

### C2: No "Daily Use" Hook -- This Site Will Be Visited Once

**The problem:** The content plan builds a reference site. Reference sites get bookmarked and forgotten. The research brief says the audience is "busy sales/marketing people." A static KB competes with Slack, email, and the CRM for attention. Without a reason to come back, adoption will peak at launch and flatline.

**What's missing:** Something that changes. A living element that gives people a reason to return. The plan has zero dynamic or regularly-updated elements.

**Recommended change:** Add a "What's New" section to the Home page -- a manually-updated changelog showing recent platform updates, new features, new proof points, and competitive intel updates. This is still static TSX (someone edits the file), but it creates the perception of a living site and gives leadership a channel to push updates. Structure it as a simple reverse-chronological list: date, one-line title, 1-2 sentence description. Start with 3-5 entries at launch (e.g., "TJC goes live on ROI Reporting," "Iggy Notebook feature launched," "Domino's onboarding begins"). This becomes the reason people check back.

---

### C3: Resources Section (Glossary, FAQ, Demo Guide) Should Be Phase 2

**The problem:** The Glossary, FAQ, and Demo Guide are useful but not critical for launch. The Glossary duplicates terminology guides already embedded in each vertical page. The FAQ answers are largely available across the other pages. The Demo Guide is valuable but serves a narrow audience (people who actually demo the product).

**Why this matters:** Every page added delays launch. The resources section is 3 pages / ~1,600 words of content that serves a "nice to have" function. Meanwhile, the core pages (platform story, live capabilities, verticals, competitive) are what sales reps actually need for customer conversations.

**Recommended change:** Ship without the Resources section. Add it in Phase 2 based on feedback from Phase 1 users. If sales reps say "I need a glossary" or "I need a demo guide," build those pages. If they don't ask, you saved 3 pages of maintenance. The vertical terminology guides already cover the most important terms in context.

**Exception:** If the Demo Guide is considered critical by sales leadership, it could be included in the MVP as a standalone page at `/demo-guide` without the Resources section overhead.

---

## Improvements (Should Fix)

### I1: "Why Ignition" and "Competitive Positioning" Cover the Same Ground

**The problem:** Page 4 (Why Ignition) discusses the 5 differentiators and competitive positioning. Page 19 (Competitive Positioning) covers head-to-head comparisons. The overlap is significant -- both pages talk about revenue attribution vs. vanity metrics, conversational AI gaps, print + digital advantage, and the "monthly PDF" status quo.

**The risk:** A sales rep reads "Why Ignition," gets the competitive pitch, then navigates to "Competitive Positioning" and reads a longer version of the same arguments. Redundancy erodes trust in the site's organization.

**Recommended change:** Sharpen the split. "Why Ignition" should be the elevator pitch -- short, punchy, no competitor names. It answers "why should I care?" The Competitive page is the reference card -- detailed, named competitors, talk tracks, the comparison matrix. Remove the "Status Quo Is the Real Competitor" section from "Why Ignition" (it belongs on the Competitive page) and remove the "Intelligence Over Execution" framing (already covered in the core positioning on the Competitive page).

---

### I2: The Platform Section Has One Page Too Many

**The problem:** Three Platform pages (What Is Ignition, How It Works, Why Ignition) is one too many for the narrative they carry. "What Is Ignition" covers the problem, the solution, the transformation story, and who it's for. "How It Works" covers the through-channel model, what each level gets, data flow, and three phases. There is significant overlap between "Who It's For" on page 2 and "What Each Level Gets" on page 3 -- both describe the Brand HQ / Regional / Local user tiers.

**Recommended change:** Merge "What Is Ignition" and "How It Works" into a single page. The combined page tells the full story: problem, solution, through-channel model, three phases. This eliminates the redundant user-tier descriptions and creates a stronger narrative flow. The "Why Ignition" page remains separate as the differentiation/conviction page.

Alternatively, if you keep both pages, remove the "Who It's For" section from "What Is Ignition" entirely -- let "How It Works" own the user-tier breakdown.

---

### I3: Vertical Pages Are Structurally Identical -- Consider Whether All 5 Are Needed at Launch

**The problem:** All 5 vertical pages follow the exact same template: Market Context, Pain Points, How Ignition Helps, Proof Point, Terminology Guide. This is good for consistency but raises the question: does the General Franchise page (page 18) add enough unique value to justify its own page? The pain points and solutions overlap heavily with QSR and Healthcare. The proof point (TJC) is the same one used on the Healthcare page.

**Recommended change:** Keep all 5 verticals but be honest about which ones are strong vs. thin. Healthcare and Automotive have genuinely differentiated content (HIPAA workflows, AMMS data asset). QSR has specific LTO/franchise language. Financial Services has unique compliance angles. General Franchise is the weakest -- consider whether it could be folded into the Industries Overview as a "More Verticals" section rather than a full page. If it stays, it needs a stronger proof point beyond re-using TJC.

---

### I4: The "Coming Soon" Treatment Risks the Vaporware Perception

**The problem:** Even with the recommended consolidation from C1, the "coming soon" treatment needs tighter guardrails. The draft says "Target Q2-Q4 2026" and "Target Q1-Q2 2027" -- these are soft dates that internal audiences will read as promises. When Q4 2026 arrives and Dynamic AI Creative isn't shipped, the KB loses credibility.

**Recommended change:** Use phase labels instead of quarters. Say "Phase 2 -- Activation" and "Phase 3 -- Automation" rather than specific quarters. If pressed on timing, sales reps can say "our next phase" rather than citing a quarter that might slip. The Capabilities Overview page should present the roadmap as phases, not calendar dates.

Additionally, every "coming soon" item should include a sentence like: "When this capability launches, this page will be updated with full details, proof points, and use cases." This manages expectations and signals that the light treatment is intentional, not lazy.

---

### I5: The Capability Comparison Matrix Needs a Reality Check

**The problem:** The Competitive page proposes a comparison matrix with checkmarks and X marks across 7 capabilities. This is a common sales tool, but for an internal KB it risks oversimplification. Ansira does have co-op fund management (better than Ignition). SOCi does have campaign automation (broader than Ignition today). A matrix full of green checkmarks for Ignition and red X marks for everyone else will feel dishonest to anyone who has actually seen a competitor demo.

**Recommended change:** Use three states in the matrix: Strong (filled circle), Partial/Basic (half circle), and Not Available (empty circle). Be honest about where competitors are strong. Ansira gets "Strong" on co-op/MDF management. SOCi gets "Strong" on execution automation. Ignition gets "Not Available" or "Partial" on capabilities that are still "coming soon." Honesty here builds trust with the internal audience and better prepares sales reps for real conversations.

---

### I6: No Search Functionality Specified

**The problem:** 14-22 pages of content with no search. The plan specifies search for the Glossary page (client-side text filtering) but not for the site overall. A sales rep preparing for a meeting needs to find "co-op fund management" quickly -- are they going to navigate through the sidebar hoping they pick the right page?

**Recommended change:** Add a simple client-side search to the sidebar or header. Since all content is static TSX, a basic keyword search that indexes page titles, headings, and key terms would cover 90% of use cases. This doesn't need to be sophisticated -- even a search box that filters nav items by keyword would help. Flag this as a Phase 2 enhancement if it complicates the MVP build, but note it as a known gap.

---

## Nice-to-Haves (Could Fix)

### N1: Consider a "Quick Reference Card" Page

A single-page summary designed for printing or screenshotting: Ignition in 60 seconds. Platform name, one-line positioning, what's live, top 3 differentiators, proof points. Sales reps would actually use this before meetings. Could be a dedicated page or a downloadable/printable section on the Home page.

### N2: Internal Links Could Be More Prescriptive

The dependency map in Appendix A is helpful, but the page briefs don't consistently specify where internal links should appear. For example, the ROI Reporting page should link to Iggy AI with copy like "See how Iggy turns your dashboard data into actionable insights." The brief mentions the link exists but doesn't specify the call-to-action text. Adding suggested link text to each brief would reduce implementer guesswork.

### N3: The Glossary Should Include Competitor Names

If a sales rep hears "BrandMuscle" in a meeting and doesn't know it was acquired by Ansira, they're caught off guard. Consider adding major competitor names to the glossary with brief, factual descriptions. "Ansira: Enterprise distributed marketing platform formed from the merger of BrandMuscle and SproutLoud (July 2024). Primary competitor in the co-op/MDF space."

### N4: Mobile Experience Needs Explicit Guidance

The plan mentions "responsive layout" and "mobile menu pattern" from the existing site, but the content briefs are designed for desktop reading. Vertical pages with Market Context, Pain Points, How Ignition Helps, Proof Points, and Terminology Guide sections will be long on mobile. Consider specifying a mobile-first content hierarchy: which section should be most prominent, and should any sections be collapsed by default on mobile?

### N5: Consider Adding a "How to Use This Site" Tooltip or Intro

For a password-protected internal site, the audience is captive but not necessarily oriented. A brief tooltip or dismissible intro on first visit ("This site helps you understand, explain, and sell Ignition. Start with [link] if you're new, or jump to [link] for your next customer meeting.") would reduce bounce from the Home page.

---

## Recommended Changes Summary

| # | Priority | Action | Impact |
|---|----------|--------|--------|
| C1 | Critical | Cut to 14-page MVP. Eliminate 5 individual "coming soon" capability pages. Consolidate into expanded Capabilities Overview. | Faster launch, less maintenance, no vaporware pages |
| C2 | Critical | Add "What's New" section to Home page with manually-updated changelog. | Creates daily-use hook and living site perception |
| C3 | Critical | Move Resources section (Glossary, FAQ, Demo Guide) to Phase 2. | Reduces MVP scope by 3 pages / ~1,600 words |
| I1 | Improvement | Sharpen split between "Why Ignition" and "Competitive Positioning." Remove overlap. | Cleaner navigation, no redundant reading |
| I2 | Improvement | Merge "What Is Ignition" and "How It Works" OR remove the duplicate user-tier section. | Tighter narrative, one less page |
| I3 | Improvement | Evaluate whether General Franchise needs a full page or can be a section on Industries Overview. | Removes weakest vertical page |
| I4 | Improvement | Replace quarter-based timelines with phase labels for "coming soon" items. | Avoids credibility risk when timelines slip |
| I5 | Improvement | Use three-state comparison matrix (Strong / Partial / Not Available) with honest competitor ratings. | Builds internal trust, better sales prep |
| I6 | Improvement | Spec a basic client-side search for site-wide navigation. Phase 2 if needed. | Helps sales reps find content quickly |
| N1 | Nice-to-have | Add a "Quick Reference Card" page or printable section. | High-utility single-page summary for meetings |
| N2 | Nice-to-have | Add suggested internal link text to each page brief. | Reduces implementer guesswork |
| N3 | Nice-to-have | Add competitor names to the glossary with factual descriptions. | Helps sales reps recognize competitor names |
| N4 | Nice-to-have | Add mobile-first content hierarchy guidance to page briefs. | Better mobile experience for field reps |
| N5 | Nice-to-have | Add first-visit orientation tooltip or intro on Home page. | Reduces bounce, orients new users |

---

### If All Recommendations Are Accepted: Revised Page Count

**MVP (Phase 1): 12 pages**

1. Home (with "What's New" changelog)
2. What Is Ignition + How It Works (merged)
3. Why Ignition (sharpened as elevator pitch, no competitor names)
4. Capabilities Overview (expanded with "Coming Soon" section for all 5 future capabilities)
5. ROI Reporting (full page)
6. Iggy AI (full page)
7. Industries Overview
8. Healthcare
9. QSR
10. Automotive
11. Financial Services
12. Competitive Positioning (detailed, with comparison matrix and talk tracks)

**Phase 2 additions (based on user feedback):**
- Franchise & Multi-Unit (if demand warrants a full page)
- Glossary
- FAQ
- Demo Guide
- Quick Reference Card
- Site-wide search

This is a 45% reduction in page count (22 to 12) with minimal loss of value to the primary audience. Every page that ships serves an active use case -- no placeholder pages, no content that exists only because the research brief had material for it.

---

*Challenge report prepared by PM-B for the Ignition Knowledge Base content rebuild pipeline.*

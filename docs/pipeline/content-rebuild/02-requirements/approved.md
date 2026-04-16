# Ignition Knowledge Base — Approved Content Plan

**Date:** 2026-03-18
**Pipeline Stage:** 02-requirements (Consolidator Approved)
**Inputs:** Research brief, PM-A draft, PM-B challenge report

---

## 1. Decision Log

### Critical Issues

**C1: Cut to 14-page MVP — PARTIALLY ACCEPT**

PM-B is right that 22 pages is too many for a V1, and the 5 individual "coming soon" capability pages are the weakest part of the plan. However, cutting all the way to 14 loses the Franchise & Multi-Unit vertical, which is the broadest TAM segment (647K locations). Consolidate the 5 "coming soon" capability pages into an expanded Capabilities Overview page as PM-B recommends, but keep the Franchise vertical page. Result: 17 pages reduced to 16 (see I2/I3 below for further reductions).

**C2: Add "What's New" section to Home page — ACCEPT**

A manually-updated changelog is low-cost, creates a reason to revisit, and signals the site is maintained. Add a "What's New" section to the Home page with 3-5 entries at launch. This is still static TSX — someone edits the file when updates happen.

**C3: Move Resources section to Phase 2 — PARTIALLY ACCEPT**

Defer the Glossary and FAQ to Phase 2. However, keep the Demo Guide in the MVP. Sales reps actively demoing the product need this page before any other resource page. The Demo Guide moves from the Resources section to a standalone nav item. Vertical terminology guides embedded in each vertical page cover the glossary need for V1.

### Improvements

**I1: Sharpen "Why Ignition" vs. "Competitive Positioning" split — ACCEPT**

Clear separation: "Why Ignition" is the elevator pitch (no competitor names, punchy conviction statements). "Competitive Positioning" is the reference card (named competitors, talk tracks, matrix). Remove the "Status Quo Is the Real Competitor" section from Why Ignition — it belongs on the Competitive page. Remove the "Intelligence Over Execution" framing from Why Ignition — already covered in Competitive.

**I2: Merge "What Is Ignition" and "How It Works" — ACCEPT**

These two pages cover overlapping ground (the user-tier breakdown appears in both). Merge into a single "What Is Ignition" page that tells the complete story: problem, solution, through-channel model, three phases. This tightens the narrative and removes one page. The "Why Ignition" page stays separate.

**I3: Evaluate General Franchise page — REJECT**

PM-B suggests the General Franchise page is the weakest vertical. The concern is valid — the proof point (TJC) overlaps with Healthcare. However, this is the broadest TAM segment at 647K locations and covers home services, personal services, and retail franchises that don't fit other verticals. Keep it, but strengthen the proof points by emphasizing the non-healthcare pipeline names (Home Instead, South Moon Under, Madden Plumbing) and making the content distinct from QSR and Healthcare.

**I4: Use phase labels instead of quarter-based timelines — ACCEPT**

Replace "Target Q2-Q4 2026" with "Phase 2 — Activation" and "Phase 3 — Automation." Sales reps say "our next phase" instead of citing quarters that may slip. Add a note to each coming-soon item: "Full details, proof points, and use cases will be added when this capability launches."

**I5: Three-state comparison matrix — ACCEPT**

Use Strong / Partial / Not Available instead of binary checkmarks. Give Ansira "Strong" on co-op/MDF. Give SOCi "Strong" on execution automation. Mark Ignition "Not Available" or "Partial" on capabilities still coming. Honesty builds internal trust and better prepares reps for real conversations.

**I6: Site-wide search — PARTIALLY ACCEPT**

Flag as a Phase 2 enhancement, not MVP. The site at 15 pages with a clear sidebar is navigable without search. Note it as a known gap in the implementation notes. Don't add build complexity for V1.

### Nice-to-Haves

**N1: Quick Reference Card — REJECT for MVP.** Good idea, but Phase 2. The Home page with capability cards and the Demo Guide cover the "quick glance" use case for now.

**N2: Prescriptive internal link text — ACCEPT.** Added suggested link copy to each page spec below. Low effort, high value for the implementer.

**N3: Competitor names in Glossary — REJECT.** Glossary is Phase 2, and the Competitive page already names and describes each competitor. Adding them to the glossary is redundant.

**N4: Mobile content hierarchy guidance — PARTIALLY ACCEPT.** Added a mobile note to content rules. Full mobile-specific section specs are Phase 2 — for now, the existing responsive layout handles it.

**N5: First-visit orientation tooltip — REJECT for MVP.** Overhead for a V1 with a small internal audience. If analytics show bounce, add it in Phase 2.

---

## 2. Final Site Map

### MVP (Phase 1): 15 Pages

| # | Route Path | Page Title | Section | Purpose | Status | Est. Words |
|---|-----------|------------|---------|---------|--------|-----------|
| 1 | `/` | Home | — | Landing page with platform overview, capability status cards, What's New changelog, and quick navigation | General | 500 |
| 2 | `/platform` | What Is Ignition | Platform | The complete story: problem, solution, through-channel model, three phases, who it's for | General | 800 |
| 3 | `/platform/why-ignition` | Why Ignition | Platform | Elevator pitch — five differentiators, no competitor names, pure conviction | General | 400 |
| 4 | `/capabilities` | Platform Capabilities | Capabilities | Overview of all 7 themes with status badges, expanded "Coming Soon" section for future capabilities | General | 700 |
| 5 | `/capabilities/roi-reporting` | ROI-Based Reporting | Capabilities | Full deep-dive on the live ROI Reporting capability | Live | 700 |
| 6 | `/capabilities/iggy-ai` | Iggy AI Insights Agent | Capabilities | Full deep-dive on the live Iggy AI capability | Live | 700 |
| 7 | `/verticals` | Industries We Serve | Verticals | Overview of target verticals with key stats and links to detail pages | General | 400 |
| 8 | `/verticals/healthcare` | Healthcare & Chiropractic | Verticals | Vertical-specific value proposition, pain points, how Ignition addresses them | General | 500 |
| 9 | `/verticals/qsr` | Quick Service Restaurants | Verticals | Vertical-specific value proposition for QSR/franchise restaurants | General | 500 |
| 10 | `/verticals/automotive` | Automotive Dealers | Verticals | Vertical-specific value proposition for dealer groups | General | 500 |
| 11 | `/verticals/financial-services` | Financial Services | Verticals | Vertical-specific value proposition for banks, credit unions, advisory firms | General | 500 |
| 12 | `/verticals/franchise` | Franchise & Multi-Unit | Verticals | Vertical-specific value proposition for general franchise/multi-unit brands | General | 500 |
| 13 | `/competitive` | Competitive Positioning | Competitive | Head-to-head comparisons, capability matrix, talk tracks, "we already use X" responses | General | 700 |
| 14 | `/demo-guide` | Demo Guide | — | How to demo Ignition effectively — flows, talking points, common questions | General | 600 |
| 15 | `/resources/glossary` | Glossary | Resources | Searchable glossary of platform terms with plain-English definitions | General | 500 |

**Total estimated words:** ~7,500

### Phase 2 Additions (Based on User Feedback)

- FAQ page
- Quick Reference Card (printable one-pager)
- Site-wide client-side search
- Individual "coming soon" capability pages (if demand warrants)
- Mobile-optimized content hierarchy

---

## 3. Final Navigation Structure

```
HOME
  Home                                    /

PLATFORM
  What Is Ignition                        /platform
  Why Ignition                            /platform/why-ignition

CAPABILITIES
  Overview                                /capabilities
  ROI-Based Reporting            [LIVE]   /capabilities/roi-reporting
  Iggy AI Insights Agent         [LIVE]   /capabilities/iggy-ai

INDUSTRIES
  Overview                                /verticals
  Healthcare & Chiropractic               /verticals/healthcare
  Quick Service Restaurants               /verticals/qsr
  Automotive Dealers                      /verticals/automotive
  Financial Services                      /verticals/financial-services
  Franchise & Multi-Unit                  /verticals/franchise

COMPETITIVE
  Competitive Positioning                 /competitive

RESOURCES
  Demo Guide                              /demo-guide
  Glossary                                /resources/glossary
```

### Navigation Behavior

- **Section headers** are non-clickable labels (uppercase, small, gray text)
- **Items** are clickable links
- **Active page** highlighted with teal text and light teal background (matching current Sidebar.tsx pattern)
- **Status badges** appear inline next to capability items:
  - `LIVE` — small green badge/pill
- **All sections expanded by default** — no collapse behavior needed at 15 pages
- **Home link** sits above all sections, styled distinctly (e.g., with a home icon)

---

## 4. Page-by-Page Content Specs

---

### Page 1: Home (`/`)

**H1:** Ignition Knowledge Base
**Subheadline:** Everything you need to understand, explain, and sell Ironmark's AI-powered distributed marketing platform.

#### Section A: Hero Area
- H1 + subheadline
- One sentence: "Ignition connects brand strategy to local execution for multilocation brands — and proves it works with real revenue data."
- Two prominent buttons: "Explore the Platform" (links to `/platform`) and "See What's Live" (links to `/capabilities`)

#### Section B: What's New (Changelog)
- Heading: "What's New"
- Reverse-chronological list of recent updates, 3-5 entries at launch
- Each entry: date, one-line title, 1-2 sentence description
- Launch entries:
  - TJC goes live on ROI Reporting across 900+ locations
  - Iggy Notebook feature launched — natural language questions become visual reports
  - Domino's onboarding begins — first QSR customer
  - Knowledge Base launched — your guide to selling and explaining Ignition
- This section is the "living" element — updated manually when significant platform events occur

#### Section C: Platform Status Dashboard
- Visual card grid showing all 7 capability themes
- Each card: theme name, one-line description, status badge (Live / Phase 2 / Phase 3)
- Live capability cards link to their full pages
- Future capability cards link to the relevant section on the Capabilities Overview page
- Purpose: instant at-a-glance view of what's live and what's coming

#### Section D: Quick Links Grid
- 4 cards linking to key starting points:
  - "What Is Ignition?" — `/platform` — for the full platform story
  - "Industries We Serve" — `/verticals` — for vertical-specific messaging
  - "Competitive Positioning" — `/competitive` — for competitive talk tracks
  - "Demo Guide" — `/demo-guide` — for preparing to show the platform

**Cross-links:** All section landing pages, all capability pages (via status cards), Demo Guide.

**Word count target:** 500

---

### Page 2: What Is Ignition (`/platform`)

**H1:** What Is Ignition?
**Subheadline:** The AI-powered platform that connects brand strategy to local execution — and proves it works.

#### Section A: The Problem We Solve
- Heading: "Multilocation marketing is broken"
- Multilocation brands spend heavily on marketing but can't connect spend to revenue
- Print, digital, and local execution are fragmented across vendors
- Data lives in silos — nobody can answer "is our marketing working?" at the location level
- Use a concrete scenario: "A QSR brand with 400 locations spends $2M on marketing. Their agency sends a monthly PDF with impressions and clicks. But nobody can tell you which locations are profitable and why."

#### Section B: What Ignition Does
- Heading: "Ignition bridges the gap"
- Unified reporting connecting marketing spend to actual revenue at the location level
- AI-driven insights that surface problems and recommend actions automatically
- Campaign tools that work across every location in the network
- Visibility for brand leaders, simplicity for local operators
- Key phrase: "Competitors run marketing. Ignition proves it works."

#### Section C: The Through-Channel Model
- Heading: "Full-channel coverage, not just one layer"
- Most platforms serve only brand HQ (dashboards) or only local operators (templates) — Ignition serves the entire channel
- Visual concept: a vertical flow showing Brand HQ, Regional, Local, Customer — with Ignition capabilities mapped at each level
- **Brand HQ:** Network-level dashboards, campaign performance across all locations, AI-powered anomaly detection, compliance tools
- **Regional Managers:** Location benchmarking, performance alerts, team activity monitoring
- **Local Operators:** Pre-built campaign kits, AI-generated creative, co-op fund access, simple dashboards

#### Section D: The Transformation Story
- Heading: "From marketing vendor to platform company"
- Ironmark has operated as a marketing services provider for 30+ years
- Already sits inside the marketing operations of multilocation brands — producing materials, managing campaigns, handling data
- Ignition adds an intelligence layer on top of these existing relationships
- Not starting from scratch — adding technology to trusted relationships

#### Section E: Three Compounding Phases
- Heading: "Intelligence, Activation, Automation"
- **Phase 1 — Intelligence:** See what's happening (ROI Reporting, Iggy AI) — live today
- **Phase 2 — Activation:** Turn insight into action (AI Creative, CDP, Campaigns)
- **Phase 3 — Automation:** Embed into daily operations (Marketing Hub, Workflows)
- Each phase compounds: reporting feeds AI, AI feeds creative, creative feeds campaigns, campaigns feed automation

**Cross-links:** `/capabilities` (from phase descriptions), `/capabilities/roi-reporting` and `/capabilities/iggy-ai` (from Phase 1 mention), `/platform/why-ignition` ("See what makes Ignition different").

**Word count target:** 800

---

### Page 3: Why Ignition (`/platform/why-ignition`)

**H1:** Why Ignition?
**Subheadline:** What makes Ignition different from every other marketing platform on the market.

#### Section A: The Ignition Difference
- Heading: "Five things no competitor can match"
- Present each as a brief, punchy block — no competitor names on this page:

1. **Revenue Attribution, Not Vanity Metrics** — Closed-loop tracking from ad spend to actual revenue at the location level. Most platforms stop at clicks or leads. Ignition answers "did this marketing make money?"

2. **Conversational AI That Answers Real Questions** — Not a chatbot with canned responses. An AI agent that reasons over live campaign data, identifies problems, and recommends specific actions. Ask it anything about your campaigns in plain English.

3. **Print + Digital in One Platform** — Ironmark's 30+ years of print production means direct mail, printed materials, and digital campaigns orchestrated together in one system. No pure-digital platform can do this.

4. **Proprietary Data Assets** — 160M automotive consumer records and growing campaign intelligence across verticals. Data that fuels AI models and targeting that cannot be replicated by competitors.

5. **Built on Existing Relationships** — Not selling cold into new accounts. Adding intelligence to brands that already trust Ironmark with their marketing operations. Platform adoption built on proven relationships.

#### Section B: The Question Only Ignition Can Answer
- Heading: "Can you tell me which of your 300 locations are profitable — and why?"
- This is the question that separates Ignition from every alternative
- Most platforms can tell you what was spent and what was clicked
- Ignition tells you what made money, where, and why — at the individual location level
- If a prospect's current tools can answer this question, they don't need Ignition. If they can't, nothing else on the market will get them there.

**Cross-links:** `/competitive` ("See how we compare head-to-head"), `/capabilities/roi-reporting` ("See ROI Reporting in detail"), `/capabilities/iggy-ai` ("Meet Iggy, our AI insights agent").

**Word count target:** 400

---

### Page 4: Platform Capabilities Overview (`/capabilities`)

**H1:** Platform Capabilities
**Subheadline:** Seven capability themes, three compounding phases — from visibility to intelligence to automation.

#### Section A: The Three Phases
- Heading: "Each phase compounds on the last"
- Brief intro explaining the phased approach:
  - **Phase 1 — Intelligence:** ROI Reporting + Iggy AI (live today)
  - **Phase 2 — Activation:** AI Creative + CDP + Campaigns (in development)
  - **Phase 3 — Automation:** Marketing Hub + Full-Funnel Automation (planned)
- Each phase builds on the previous — reporting feeds AI, AI feeds creative, creative feeds campaigns, campaigns feed automation

#### Section B: Live Capabilities
- Heading: "What's live today"
- Two prominent capability cards for ROI Reporting and Iggy AI
- Each card: theme name, one-line description, LIVE badge, target persona, link to full page
- Callout: "The Joint Chiropractic runs on Ignition today across 900+ locations."

#### Section C: What's Coming — Phase 2 (Activation)
- Heading: "Phase 2 — Activation"
- Three capability cards in a lighter visual treatment than the live cards:

  **Dynamic AI Creative**
  - AI-generated, brand-compliant creative assets localized automatically for each location
  - Content generated within brand guidelines — tone, style, disclaimers enforced as hard constraints
  - Multi-format output: social posts, email copy, ad headlines, direct mail, landing pages
  - Three different customers in three different verticals independently requested this
  - "Full details, proof points, and use cases will be added when this capability launches."

  **Customer Data Platform (CDP)**
  - Unified customer data from CRM, POS, web analytics, and ad platforms
  - Identity resolution, hierarchy mapping, predictive segmentation
  - Segment activation: email/SMS (94% match), paid media (87%), direct mail (98%)
  - The CDP makes data an appreciating asset — more data flowing through Ignition increases switching costs
  - "Full details, proof points, and use cases will be added when this capability launches."

  **Omni-Channel Campaign Management**
  - Print and digital campaigns orchestrated from one platform with unified attribution
  - Campaign kits, unified inventory, cross-channel attribution across digital and physical
  - Ironmark's print production heritage is the unfair advantage — no pure-digital DMP can match this
  - "Full details, proof points, and use cases will be added when this capability launches."

#### Section D: What's Coming — Phase 3 (Automation)
- Heading: "Phase 3 — Automation"
- Two capability cards in the lightest visual treatment:

  **Distributed Marketing Hub & Brand Assets**
  - The "front door" for local operators — curated programs, co-op fund management, brand-safe templates, AI recommendations
  - Mobile-first design for franchisees and local operators who are operators first and marketers never
  - "Full details, proof points, and use cases will be added when this capability launches."

  **Full-Funnel Marketing Automation**
  - Trigger-based workflows, lead nurturing, and conversion optimization embedded into daily operations
  - Visual journey builder, pre-defined playbooks, AI lead capture, call tracking
  - The final lock-in — once Ignition manages the complete workflow, it becomes the operating system for marketing
  - "Full details, proof points, and use cases will be added when this capability launches."

**Cross-links:** `/capabilities/roi-reporting` and `/capabilities/iggy-ai` (from live cards), `/platform` ("Learn the full Ignition story").

**Word count target:** 700

---

### Page 5: ROI-Based Reporting (`/capabilities/roi-reporting`)

**Status:** LIVE (green banner: "This capability is live in production.")

**H1:** ROI-Based Reporting
**Subheadline:** See exactly which locations are making money from marketing — and which aren't.

#### Section A: The Problem
- Heading: "Marketing spend without marketing proof"
- Brands spend millions but can't connect spend to revenue at the location level
- Monthly PDFs from agencies show impressions and clicks — not business outcomes
- No location-level visibility — everything is aggregated at the brand level
- Nobody can answer the basic question: "Is this marketing actually working?"

#### Section B: What It Does
- Heading: "Unified dashboards connecting spend to revenue"
- **Automated data ingestion** — Google, Meta, TikTok, LinkedIn pulled in automatically. No spreadsheets, no manual exports, no waiting for someone to update a report.
- **Closed-loop attribution** — Not just clicks or impressions. Connect upstream ad spend to downstream CRM and POS revenue. The full journey from spend to outcome.
- **Multi-tenant views** — Network, region, and individual location dashboards in one system. Brand HQ sees the whole picture; a franchise operator sees their location.
- **Daily performance metrics** — Campaign performance by platform with 7 timeframe options. Not monthly. Not weekly. Daily.

#### Section C: Who It's For
- Heading: "Built for the people asking 'is it working?'"
- Brand CMOs and VPs of Marketing who need to justify spend to the board
- Regional marketing managers tracking performance across their territory
- Franchise operators who want to know if their marketing dollars are paying off
- The common thread: everyone asking "am I making money from marketing?"

#### Section D: Why It Matters Strategically
- Heading: "The entry point to the platform"
- ROI Reporting is fast to deploy and delivers immediate value
- Once reporting lives in Ignition, switching costs increase
- Opens the upsell path to Iggy AI, then the full platform
- The "Trojan Horse" — easy to sell, fast to deploy, and the foundation everything else builds on

#### Section E: Proof Point
- Heading: "Live in production"
- The Joint Chiropractic: 900+ locations live on Ignition (February 2026)
- Daily campaign performance data across all locations
- Real revenue attribution, not just engagement metrics

**Cross-links:** `/capabilities/iggy-ai` ("See how Iggy turns your dashboard data into actionable insights"), `/capabilities` ("See all platform capabilities"), `/competitive` ("See how ROI Reporting compares to alternatives").

**Word count target:** 700

---

### Page 6: Iggy AI Insights Agent (`/capabilities/iggy-ai`)

**Status:** LIVE (green banner: "This capability is live in production.")

**H1:** Iggy AI — Your Intelligent Marketing Analyst
**Subheadline:** Ask questions in plain English. Get answers from live campaign data. No more waiting for reports.

#### Section A: The Problem
- Heading: "Data without intelligence is just noise"
- Dashboards are great, but most marketers don't have time to dig through them
- They need someone to tell them what's happening and what to do about it
- Waiting for a monthly report from an analyst is too slow — the opportunity is gone by the time you see it
- That's what Iggy does: always-on intelligence that surfaces problems and recommends actions

#### Section B: Two Ways to Use Iggy
- Heading: "Proactive alerts and on-demand answers"
- **Persistent Insights Panel** — Iggy proactively surfaces issues: underperforming locations, budget anomalies, campaign opportunities. No need to ask — the alerts come to you.
- **Ask Iggy Chat** — Type a question in plain English and get an answer grounded in live data. "Which locations are underperforming this month?" "Why did Location 12's cost per lead spike?" "What are top clinics doing differently?"

#### Section C: How Iggy Thinks
- Heading: "Not a chatbot — a reasoning engine"
- Multi-method health assessment: goal-based analysis (95% confidence), historical trend comparison (85%), vertical benchmarks (75%)
- Root cause analysis: identifies symptoms, generates hypotheses, gathers evidence, delivers scored recommendations
- This isn't keyword matching or canned responses — Iggy reasons over real data and produces original analysis

#### Section D: Iggy Notebook
- Heading: "Turn questions into visual reports"
- Ask a natural language question, get a visual report with metrics, charts, tables, and insights
- Reports are saveable, re-runnable, and PDF-exportable
- Example: "Show me new patient cost by clinic for Q1" produces a formatted report with benchmarks and recommendations
- Turns ad-hoc questions into reusable reporting assets

#### Section E: Insight Lifecycle
- Heading: "From intelligence to accountability"
- Insights move through tracked states: New, Acknowledged, In Progress, Resolved, Dismissed
- Insights don't just appear and vanish — they're tracked to resolution
- Creates accountability: "We identified this problem. Did we fix it?"

#### Section F: The Competitive Gap
- Heading: "No competitor has this"
- No DMP competitor offers conversational AI answering questions from live campaign data
- This is the differentiator that makes customers choose Ignition
- And the capability that makes them stay

**Cross-links:** `/capabilities/roi-reporting` ("Iggy works on top of your ROI data — see ROI Reporting"), `/capabilities` ("See all platform capabilities"), `/demo-guide` ("Learn how to demo Iggy effectively").

**Word count target:** 700

---

### Page 7: Industries We Serve Overview (`/verticals`)

**H1:** Industries We Serve
**Subheadline:** Ignition is purpose-built for multilocation brands. Here's how it works in your vertical.

#### Section A: Vertical Cards Grid
- 5 cards, one per vertical:
  - **Healthcare & Chiropractic** — Clinic networks, chiropractic franchises, healthcare systems. 110,000 locations. "From patient acquisition to clinic-level ROI." Links to `/verticals/healthcare`.
  - **Quick Service Restaurants** — QSR franchises, multi-unit restaurant operators. 204,000 locations. "Store-level LTO performance and franchise marketing intelligence." Links to `/verticals/qsr`.
  - **Automotive Dealers** — Dealer groups, OEM franchise networks. 18,000 rooftops. "Unified sales and service marketing with proprietary data." Links to `/verticals/automotive`.
  - **Financial Services** — Banks, credit unions, advisory firms, insurance agencies. 98,000+ locations. "Compliant advisor marketing with full audit trails." Links to `/verticals/financial-services`.
  - **Franchise & Multi-Unit** — Personal services, retail, home services, and more. 647,000 locations. "Close the gap between your best-performing franchisees and everyone else." Links to `/verticals/franchise`.

#### Section B: Why Verticals Matter
- Heading: "One platform, adapted for each industry"
- Ignition isn't one-size-fits-all
- Each vertical has specific terminology, compliance requirements, KPIs, and operational patterns
- Vertical pages use the language your customers use — patients not leads, rooftops not locations, guests not customers
- Ignition adapts to each vertical's reality

**Cross-links:** All 5 vertical detail pages, `/platform` ("Learn the full Ignition story").

**Word count target:** 400

---

### Page 8: Healthcare & Chiropractic (`/verticals/healthcare`)

**H1:** Healthcare & Chiropractic
**Subheadline:** From patient acquisition to clinic-level ROI — marketing intelligence for healthcare networks.

#### Section A: Market Context
- Heading: "The opportunity"
- 40,000 enterprise healthcare locations (hospitals, ASCs, urgent care, multi-location physician groups)
- 70,000 chiropractic clinics
- Franchise chiro segment growing at 28.5% CAGR — the fastest-growing sub-segment
- Key stat to display prominently: 110,000 total locations

#### Section B: The Pain Points
- Heading: "What healthcare marketers struggle with"
- Clinic managers are not marketers — wide variance in local marketing skills and execution across locations
- Fragmented tooling (print portals, creative DAMs, digital vendors) with no hierarchical visibility across the network
- Attribution gaps across the full funnel: media spend to call to schedule to visit to revenue
- HIPAA/PHI compliance slows speed to market and limits what tools clinics can use

#### Section C: How Ignition Helps
- Heading: "How Ignition solves it"
- **Location-level ROI Reporting:** Turns scattered clinic reports into one source of truth showing new patient cost and channel performance by clinic
- **Iggy AI for benchmarking:** Surfaces insights in plain language — "Your new patient cost is 34% above network average; here's what top clinics do differently"
- **Patient acquisition attribution:** Connects campaign spend to call tracking, appointment booking, and new patient visits — the full funnel from ad to patient
- **HIPAA-aware workflows:** Privacy-first architecture designed for healthcare compliance requirements

#### Section D: Proof Point
- Heading: "Already in production"
- The Joint Chiropractic: 900+ locations live on Ignition (February 2026)
- Network-wide ROI reporting with clinic-level granularity
- The largest deployment on the Ignition platform

#### Section E: Healthcare Terminology Guide
- Brief table of healthcare-specific terms:
  - "New patient cost" (not "cost per lead")
  - "Clinic" (not "location" or "store")
  - "Patient acquisition" (not "lead generation")
  - "Provider" or "practitioner" (not "operator")

**Cross-links:** `/capabilities/roi-reporting` ("See how ROI Reporting works for healthcare networks"), `/capabilities/iggy-ai` ("See how Iggy provides clinic-level benchmarking"), `/verticals` ("See all industries").

**Word count target:** 500

---

### Page 9: Quick Service Restaurants (`/verticals/qsr`)

**H1:** Quick Service Restaurants
**Subheadline:** Store-level campaign performance, LTO execution, and franchise marketing intelligence.

#### Section A: Market Context
- Heading: "The opportunity"
- 204,000 QSR franchise locations — the largest addressable segment
- 82% operated by multi-unit franchisees
- +2.2% YoY growth
- Key stat to display prominently: 204,000 locations

#### Section B: The Pain Points
- Heading: "What QSR marketers struggle with"
- LTO execution is fragmented and inconsistent — corporate doesn't know if stores are actually running campaigns
- Disconnected data across POS, loyalty programs, app/web ordering, and delivery marketplaces
- Heavy lift to localize creative across hundreds of stores for each LTO window
- Co-op/ad fund dollars deployed on faith with no ROI proof — franchisees don't know if the money is working

#### Section C: How Ignition Helps
- Heading: "How Ignition solves it"
- **Campaign performance by location:** Store-by-store view for every active LTO campaign — not just brand-level averages
- **Channel attribution for local marketing:** Connects spend to same-store traffic indicators and average ticket movement
- **Network benchmarking:** Surfaces top-quartile franchisee behavior and packages it as actionable recommendations for underperformers

#### Section D: Proof Point
- Heading: "In the pipeline"
- Domino's targeted for onboarding — first QSR customer
- QSR-specific campaign kits (LTO Booster, New-Store Launch) designed for the platform

#### Section E: QSR Terminology Guide
- "LTO" (limited-time offer)
- "Store" or "unit" (not "location")
- "Guest count" or "traffic" (not "leads")
- "Average ticket" (not "order value")
- "Franchisee" or "operator"

**Cross-links:** `/capabilities/roi-reporting` ("See store-level ROI Reporting"), `/capabilities/iggy-ai` ("See how Iggy benchmarks stores against top performers"), `/verticals` ("See all industries").

**Word count target:** 500

---

### Page 10: Automotive Dealers (`/verticals/automotive`)

**H1:** Automotive Dealers
**Subheadline:** Unified sales and service marketing intelligence for dealer groups.

#### Section A: Market Context
- Heading: "The opportunity"
- 18,000 franchised dealership rooftops
- Average revenue per dealership ~$70.8M
- Top 150 dealer groups control 33% of industry revenue
- Key stat: 18,000 rooftops, $1.3T in total industry revenue

#### Section B: The Pain Points
- Heading: "What auto marketers struggle with"
- Each rooftop running its own marketing through its own vendors — no aggregate visibility across the group
- OEM co-op programs are a compliance nightmare; money left on the table annually
- Service marketing (fixed ops) under-leveraged vs. sales despite higher margins
- Siloed systems: DMS, CRM, inventory feeds, websites, call tracking — none of them talk to each other

#### Section C: How Ignition Helps
- Heading: "How Ignition solves it"
- **AMMS data asset:** 160M automotive consumer records enabling audience segments no competitor can build — in-market buyers, service mileage intervals, conquest opportunities
- **Unified sales + service ROI:** Campaign spend mapped to VDP views, leads, appointments, and closed repair orders by rooftop
- **OEM co-op compliance:** Pre-approved templates, auto-generated offer footnotes and disclaimers, documentation meeting OEM submission requirements

#### Section D: Proof Point
- Heading: "Data already in production"
- AMMS is live and generating measurable value — 160M records
- Channel partners (DealerWing, Dynatron) already white-labeling Ironmark solutions in automotive
- Proprietary data is the moat — no competitor can replicate this asset

#### Section E: Automotive Terminology Guide
- "Rooftop" (not "location") — a single dealership location
- "Fixed ops" or "service department" — the parts and service side of the dealership
- "VDP" (vehicle detail page) — the webpage showing a specific vehicle's details
- "DMS" (dealer management system) — the dealership's core operating software
- "RO" (repair order) — a service department work ticket

**Cross-links:** `/capabilities/roi-reporting` ("See rooftop-level ROI Reporting"), `/capabilities/iggy-ai` ("See how Iggy analyzes dealership performance"), `/verticals` ("See all industries").

**Word count target:** 500

---

### Page 11: Financial Services (`/verticals/financial-services`)

**H1:** Financial Services
**Subheadline:** Compliant advisor marketing, branch-level attribution, and audit-ready campaign management.

#### Section A: Market Context
- Heading: "The opportunity"
- 98,000 locations (76,000 bank branches + 22,000 credit union offices)
- Excludes ~135K-145K insurance agencies — significant TAM upside
- 9-18 month sales cycles; compliance is the gating factor for every buying decision
- Key stat: 98,000+ locations, compliance-first market

#### Section B: The Pain Points
- Heading: "What financial services marketers struggle with"
- Strict compliance (FINRA/SEC/GLBA) slows campaigns and creates fragmented review loops
- Branches and advisors either go rogue on marketing or don't market at all — no middle ground
- Hard to scale local advisor marketing while maintaining brand safety and audit readiness
- Cannot connect marketing spend to qualified appointments, proposals, or funded accounts

#### Section C: How Ignition Helps
- Heading: "How Ignition solves it"
- **Pre-approved creative and compliance workflow:** Moves compliance upstream so advisors deploy from approved libraries without individual reviews per piece
- **Branch-level benchmarking:** Surfaces marketing activity rates, campaign participation, and pipeline attribution by branch, region, and advisor
- **Full audit trail:** Timestamps, approval records, disclosure versions for every piece of advisor-generated marketing — audit-ready from day one

#### Section D: Proof Point
- Heading: "Built for compliance"
- Compliance workflow, pre-approved template libraries, and RBAC built into the Ignition MVP
- Preferra and Janney in the sales pipeline
- Architecture designed for the regulatory requirements financial services demands

#### Section E: Financial Services Terminology Guide
- "Advisor" or "financial advisor" (not "operator" or "agent")
- "Branch" (not "location")
- "AUM" (assets under management) — total value of client investments an advisor manages
- "Funded account" (not "conversion") — the downstream outcome financial services tracks
- "Compliance review" (not "approval") — the regulatory validation process

**Cross-links:** `/capabilities/roi-reporting` ("See branch-level ROI Reporting"), `/capabilities/iggy-ai` ("See how Iggy tracks advisor marketing performance"), `/verticals` ("See all industries").

**Word count target:** 500

---

### Page 12: Franchise & Multi-Unit (`/verticals/franchise`)

**H1:** Franchise & Multi-Unit Brands
**Subheadline:** Close the gap between your best-performing franchisees and everyone else.

#### Section A: Market Context
- Heading: "The opportunity"
- 647,000 non-QSR franchise locations across personal services, retail, home services, fitness, education, and more
- +2.5% YoY growth
- The broadest segment in the TAM — and the one where the performance gap between top and bottom franchisees is most visible
- Key stat: 647,000 locations across dozens of industries

#### Section B: The Pain Points
- Heading: "What franchise marketers struggle with"
- Franchisees either do nothing with their local marketing budget or go off-brand — no middle ground between inaction and chaos
- Ad fund contributions collected from every franchisee but ROI on fund deployment nearly impossible to demonstrate
- Best franchisees figured out what works through trial and error; worst franchisees don't know what to run; no scalable way to close the gap
- Every franchise system is slightly different — personal services, home repair, fitness, retail — one size doesn't fit

#### Section C: How Ignition Helps
- Heading: "How Ignition solves it"
- **One-click campaign kits:** Everything a franchisee needs to run a brand-approved campaign in a single deployable unit — select, customize, launch
- **Location benchmarking with Iggy:** "You're in the bottom quartile for marketing-attributed revenue — top performers run two additional campaigns per month. Here's how to match them."
- **Ad fund and co-op visibility:** Connects fund spend to network-level and location-level outcomes — finally proving the ad fund is working (or identifying where it isn't)

#### Section D: Proof Points
- Heading: "Validated across verticals"
- TJC validates the franchise model at 900+ locations
- Home Instead (senior care), South Moon Under (retail), Madden Plumbing (home services) in MVP cohort
- Cross-vertical validation proves the franchise model works beyond any single industry

#### Section E: Franchise Terminology Guide
- "Franchisee" or "owner-operator" — the person running the local business
- "Unit" (not "store" unless QSR context)
- "Ad fund" or "brand fund" — pooled marketing dollars collected from franchisees
- "Co-op" (cooperative advertising) — shared marketing programs between franchisor and franchisee
- "Franchisor" — the corporate/brand HQ entity

**Cross-links:** `/capabilities/roi-reporting` ("See franchisee-level ROI Reporting"), `/capabilities/iggy-ai` ("See how Iggy benchmarks franchisees against top performers"), `/verticals` ("See all industries").

**Word count target:** 500

---

### Page 13: Competitive Positioning (`/competitive`)

**H1:** Competitive Positioning
**Subheadline:** How Ignition compares to the alternatives — and what to say when a prospect brings them up.

#### Section A: The Core Positioning
- Heading: "One line to remember"
- "Competitors run marketing. Ignition proves it works."
- The consistent differentiator across every competitor: Ignition answers "is my marketing driving revenue at the location level?" when others cannot

#### Section B: The Status Quo Is the Real Competitor
- Heading: "Your biggest competitor isn't a platform — it's the monthly PDF"
- Most multilocation brands are still getting static monthly reports from their agency
- The agency report: monthly cadence (already outdated), spend/click metrics (no revenue), brand-level aggregates (no location visibility), no interactivity, agency owns the data
- Ignition: real-time, revenue attribution, location-level, interactive, brand owns the data
- Talk track: "Your agency sends you a monthly report that says you spent $200,000 and got 1.2 million impressions. Can they tell you which of your 300 locations are profitable?"

#### Section C: Head-to-Head Comparisons
- One section per named competitor with consistent structure:

  **Ansira (BrandMuscle + SproutLoud)**
  - What they do: Largest enterprise DMP following July 2024 merger. Claims 300+ brands, 1.6M active users. Named Strong Performer in Forrester Wave Q2 2025.
  - Their strength: Co-op/MDF fund management (best-in-class), creative compliance and DAM, enterprise-scale operations
  - Where we win: No conversational AI agent. G2 reviews cite complexity and steep learning curves. Stops at spend-to-lead; Ignition traces to revenue. No native print + digital attribution.
  - Talk track: "Ansira manages distribution and co-op well. Can they tell you which of your 500 locations are profitable and why?"

  **SOCi**
  - What they do: Local marketing execution at scale. 1,000+ brands, 3M+ locations. AI autonomously publishes posts, responds to reviews, manages listings.
  - Their strength: Agentic execution at scale (posts, reviews, listings), 140+ integrations, ISO 42001 certified
  - Where we win: Shows tasks completed and engagement metrics, not revenue attribution. No conversational analytics layer for marketers. Digital-only. Execution-focused vs. intelligence-focused.
  - Talk track: "SOCi executes marketing. Ignition measures whether it's working. They're execution; we're intelligence."

  **Evocalize**
  - What they do: Collaborative marketing platform with pre-configured "Blueprints" for local digital campaign deployment. Partners include Mastercard, Kumon, UberEats.
  - Their strength: Local operator simplicity, Facebook/Google/TikTok automation, data-triggered campaigns
  - Where we win: Spend-to-clicks attribution only. Digital-only. No conversational AI, no root cause analysis, no proactive alerts. No proprietary data assets.
  - Talk track: "Evocalize tells you Location 12 spent $5,000 and got 200 clicks. Ignition tells you Location 12 generated $47,000 in revenue — and here's why."

  **Pica9**
  - What they do: Brand management and template customization for franchise organizations. Most transparent per-location pricing in market.
  - Their strength: Template compliance, affordability, accessible to smaller franchise systems
  - Where we win: Template tool, not an analytics or intelligence platform. No revenue attribution, no AI capabilities.
  - Talk track: "Pica9 answers 'are my locations using the right assets?' Ignition answers 'are those assets working?'"

#### Section D: Capability Comparison Matrix
- Visual comparison table: Ignition vs. Ansira, SOCi, Evocalize, Pica9
- Three-state indicators: Strong (filled circle), Partial/Basic (half circle), Not Available (empty circle)
- Capabilities compared:
  - Location-level ROI reporting: Ignition Strong, all others Not Available
  - Conversational AI insights: Ignition Strong, all others Not Available
  - Print + digital attribution: Ignition Strong, all others Not Available
  - Proprietary data assets: Ignition Strong, all others Not Available
  - Co-op/MDF fund management: Ansira Strong, Ignition Partial, SOCi Partial, Evocalize Not Available, Pica9 Not Available
  - Brand asset management: Ansira Strong, Pica9 Strong, Ignition Partial, SOCi Partial, Evocalize Not Available
  - Campaign execution/automation: SOCi Strong, Evocalize Strong, Ansira Partial, Ignition Partial, Pica9 Not Available
- Note below the matrix: "Ignition capabilities marked Partial are on the platform roadmap. Honest assessment as of March 2026."

#### Section E: "We Already Use X" Response Guide
- Heading: "What to say when a prospect says 'we already use...'"
- Brief scripts for each competitor:
  - "We already use Ansira" — "Great for co-op management. Ask them to show you location-level revenue attribution. That's where we complement or replace."
  - "We already use SOCi" — "SOCi handles execution well. Who's measuring whether that execution is actually driving revenue? That's Ignition."
  - "We already use Evocalize" — "Evocalize automates local ad deployment. But can it tell you which locations are actually profitable? Ignition adds the intelligence layer."
  - "We already use Pica9" — "Pica9 handles templates and brand compliance. Ignition handles everything from that point forward — attribution, intelligence, and optimization."
- Frame as complementary where appropriate, competitive where direct

**Cross-links:** `/capabilities/roi-reporting` ("See ROI Reporting in detail"), `/capabilities/iggy-ai` ("See Iggy AI in detail"), `/platform/why-ignition` ("See the five things no competitor can match").

**Word count target:** 700

---

### Page 14: Demo Guide (`/demo-guide`)

**H1:** Demo Guide
**Subheadline:** How to show Ignition effectively — key flows, talking points, and common questions.

#### Section A: Before the Demo
- Heading: "Preparation checklist"
- Know the prospect's vertical and adjust terminology accordingly (use the vertical pages as reference)
- Know their current marketing setup: agency, in-house team, tools they use today
- Know their location count and structure (corporate, regional, local levels)
- Have 2-3 specific scenarios ready using their vertical's language
- Review the competitive page if you know they use a competitor platform

#### Section B: The Demo Flow
- Heading: "Recommended demo structure (15-20 minutes)"
- **Open with the problem (2 min):** Mirror their pain — "You have X [locations/clinics/stores/branches] and you can't tell which ones are making money from marketing."
- **Show ROI Dashboard (5 min):** Network view, drill to location, show channel attribution, show daily performance. Let the data speak. Key moment: show them a location they would recognize.
- **Introduce Iggy (5 min):** Show the Insights Panel (proactive alerts), ask Iggy a natural language question live, show the Notebook output. This is the "wow moment" — let it land.
- **Connect to their world (3 min):** Use their vertical terminology. Reference their specific challenges. Show how the dashboard answers their specific question.
- **Close with the roadmap (2 min):** Briefly mention what's coming — AI Creative, CDP, Campaigns. Plant the long-term vision without overpromising.

#### Section C: Key Talking Points
- Heading: "Phrases that land"
- **Opening:** "Can you tell me which of your [locations/clinics/stores/branches] are profitable from marketing?"
- **Dashboard:** "This isn't clicks and impressions — this is revenue."
- **Iggy:** "Ask it anything. It's looking at your live data right now."
- **Differentiation:** "No other platform in the market can answer that question from live data."
- **Close:** "This is what's live today. Imagine what happens when AI creative and automation are added."

#### Section D: Handling Common Questions
- Heading: "Questions you'll get — and how to answer them"
- "How does the data get in?" — Automated integrations with Google, Meta, TikTok, LinkedIn, CRM systems. No manual work for the customer.
- "How accurate is the attribution?" — Closed-loop methodology connecting ad platforms to CRM/POS data. Multi-method validation.
- "What about our existing tools?" — Ignition complements, doesn't replace. It's the intelligence layer that sits on top of whatever they're already running.
- "When can we start?" — Fast onboarding. ROI Reporting can be live in weeks, not months.
- "What does it cost?" — Direct them to sales leadership. No pricing discussed in this context.

**Cross-links:** `/capabilities/roi-reporting` ("Review the ROI Reporting details before your demo"), `/capabilities/iggy-ai` ("Review the Iggy AI details before your demo"), `/competitive` ("Review competitive positioning before your demo"), `/verticals` ("Find vertical-specific language for your prospect").

**Word count target:** 600

---

### Page 15: Glossary (`/resources/glossary`)

**H1:** Glossary
**Subheadline:** Key terms and concepts used across the Ignition platform — in plain English.

#### Implementation
- Client-side text filtering (search box at top of page)
- Alphabetical jump links (A-Z bar)
- Each term: term name (bold), plain-English definition, context note (where this term comes up in the platform)

#### Term List

| Term | Definition | Context |
|------|-----------|---------|
| Attribution | Connecting a marketing action (like an ad click) to a business outcome (like a sale). "Closed-loop attribution" means tracking the full journey from ad spend to revenue. | ROI Reporting, Iggy AI |
| CDP | Customer Data Platform. A system that unifies customer data from multiple sources (CRM, POS, ad platforms, web analytics) into one view. | Phase 2 capability |
| Closed-Loop | Tracking that connects the beginning of a marketing journey (ad impression or click) all the way through to the end result (revenue or sale). Most marketing platforms only track partway. | ROI Reporting |
| Co-op / MDF | Cooperative advertising funds. Money that brand HQ provides to local operators to spend on marketing, often with rules about how it can be used. MDF = Market Development Funds. | Franchise vertical, Phase 3 capability |
| DMP | Distributed Marketing Platform. A software platform that helps multilocation brands manage marketing across all their locations. This is the category Ignition competes in. | Platform-wide |
| Fixed Ops | Automotive term for the service and parts departments at a dealership. Higher margins than vehicle sales but often under-marketed. | Automotive vertical |
| Iggy | Ignition's AI-powered insights agent. Can be used in two modes: proactive alerts (Insights Panel) and conversational Q&A (Ask Iggy). | Iggy AI capability |
| Insight Lifecycle | The tracking states an Iggy insight moves through: New, Acknowledged, In Progress, Resolved, Dismissed. Turns intelligence into accountability. | Iggy AI capability |
| LTO | Limited-Time Offer. A promotion available for a short period. Common in QSR — think seasonal menu items or limited deals. | QSR vertical |
| Multi-Tenant | An architecture where one platform serves multiple separate organizations (brands), each seeing only their own data. Ignition is multi-tenant — each brand's data is isolated. | Platform architecture |
| Notebook (Iggy) | A feature where natural language questions become visual reports with metrics, charts, tables, and insights. Reports are saveable, re-runnable, and exportable as PDF. | Iggy AI capability |
| RBAC | Role-Based Access Control. A system where what you can see and do is determined by your role (e.g., Brand Admin, Regional Manager, Location Operator). | Platform-wide |
| ROI | Return on Investment. In Ignition's context: how much revenue was generated relative to how much was spent on marketing. | ROI Reporting |
| Rooftop | Automotive term for a single dealership location. A dealer group might have 20 "rooftops." | Automotive vertical |
| Through-Channel Marketing | Marketing that flows through multiple levels of an organization — from brand HQ through regional managers to local operators and their end customers. Ignition serves the entire channel, not just one level. | Platform positioning |
| VDP | Vehicle Detail Page. The webpage showing a specific vehicle's details on a dealer website. VDP views are a key automotive marketing metric. | Automotive vertical |

Additional terms should be added as the site evolves. The glossary is a living reference.

**Cross-links:** Standalone page referenced from all other pages via in-line term links where appropriate.

**Word count target:** 500

---

## 5. Content Rules

### Writing Style

1. **Lead with the problem, then the solution.** Every capability page and vertical page opens with the pain the customer feels before describing how Ignition solves it.

2. **Use "you" and "we" language.** "We" = Ironmark. "You" = the internal reader. Never: "the platform enables stakeholders to leverage..." Always: "Ignition shows you which locations are winning and why."

3. **Concrete over abstract.** Instead of "AI-powered insights," write: "Iggy tells a clinic manager their new patient cost is 34% above network average and recommends what top clinics do differently." Use the Location 12 vs. Location 43 pattern to make benefits tangible.

4. **Short paragraphs, scannable structure.** No paragraph longer than 3-4 sentences. Use headers, bullets, bold text, and tables. Every page should be usable in 90 seconds.

5. **Honest about status.** Clearly distinguish live capabilities (green badge) from Phase 2 and Phase 3 capabilities. Use phase labels, not specific quarter-based dates. Internal audiences need accurate information to set customer expectations correctly.

6. **No jargon without explanation.** Terms like "through-channel," "CDP," "closed-loop attribution," and "multi-tenant" should be used but always with a plain-English explanation the first time they appear on a page. The glossary handles canonical definitions.

7. **Vertical-native language.** Each vertical page uses that vertical's terminology. Healthcare says "patients" and "clinics." QSR says "guests" and "stores." Automotive says "rooftops" and "fixed ops." Financial services says "advisors" and "branches." The terminology guide at the bottom of each vertical page is the reference.

### How to Handle "Coming Soon" Capabilities

Coming-soon capabilities live on the Capabilities Overview page, not on individual pages. Each gets:

1. **One-line description** — what it does
2. **3-5 bullet points** — key planned features
3. **Why it matters** — one sentence on strategic importance
4. **Phase label** — "Phase 2 — Activation" or "Phase 3 — Automation" (no specific quarters)
5. **Standard footer line:** "Full details, proof points, and use cases will be added when this capability launches."

Coming-soon items should NOT:
- Promise specific delivery dates or quarters
- Include screenshots or mock-ups
- Overpromise capabilities beyond what the research brief describes

### How to Reference Competitors

- **On the Competitive page:** Name competitors directly — Ansira, SOCi, Evocalize, Pica9. Use the three-state matrix (Strong / Partial / Not Available). Be honest about competitor strengths.
- **On other pages:** Reference competitors generically — "most platforms," "typical DMP competitors," "the status quo." Save head-to-head detail for the competitive page.
- **Never disparage.** State what they do, what they do well, then where Ignition wins. Factual contrast, not trash talk.
- **The real competitor is the status quo.** Agency monthly PDFs are the most common competitive situation. Give this equal or greater weight than named competitors.

### What to Exclude

- **No pricing, revenue projections, ARR targets, deal sizes, or financial details.** Product marketing site, not a financial pitch.
- **No customer stories / case studies.** Proof points (e.g., "TJC, 900+ locations") are included as brief facts, not narratives.
- **No technical architecture details.** No API specs, database schemas, or code references.
- **No internal politics or org chart.** No internal team structures, reporting lines, or personnel.

### Status Indicator System

| Status | Badge Color | Badge Text | Banner Text | Applies To |
|--------|------------|------------|-------------|-----------|
| Live | Green | LIVE | "This capability is live in production." | ROI Reporting, Iggy AI |
| Phase 2 | Amber/Yellow | PHASE 2 | "This capability is in development." | AI Creative, CDP, Campaigns |
| Phase 3 | Gray | PHASE 3 | "This capability is on the roadmap." | Brand Hub, Automation |

Navigation badges: small colored pill next to capability items (LIVE only — future capabilities don't appear individually in nav).
Page banners: colored strip below H1 on capability pages.
Home dashboard: cards use badge color as accent.

### Mobile Considerations

- Content hierarchy on mobile should prioritize: headline, subheadline, first section (the problem), then capabilities/proof points
- Terminology guides on vertical pages may be collapsed by default on mobile viewports
- The sidebar collapses to a hamburger menu (existing pattern — preserve this)

---

## Appendix A: Page Dependency Map

```
Home → all capability pages (via status cards), all section landing pages, /demo-guide
/platform → /capabilities (from phase descriptions), /capabilities/roi-reporting, /capabilities/iggy-ai, /platform/why-ignition
/platform/why-ignition → /competitive, /capabilities/roi-reporting, /capabilities/iggy-ai
/capabilities → /capabilities/roi-reporting, /capabilities/iggy-ai, /platform
/capabilities/roi-reporting → /capabilities/iggy-ai, /capabilities, /competitive
/capabilities/iggy-ai → /capabilities/roi-reporting, /capabilities, /demo-guide
/verticals → all 5 vertical detail pages, /platform
/verticals/* → /capabilities/roi-reporting, /capabilities/iggy-ai, /verticals
/competitive → /capabilities/roi-reporting, /capabilities/iggy-ai, /platform/why-ignition
/demo-guide → /capabilities/roi-reporting, /capabilities/iggy-ai, /competitive, /verticals
/resources/glossary → standalone (referenced inline from all pages)
```

## Appendix B: Implementation Notes

### Page Architecture
- All pages are fully static TSX components in Next.js
- No markdown rendering pipeline — all content is hardcoded in JSX
- Each page is a standalone TSX file at its route path under `src/app/(authenticated)/`
- Example: `/capabilities/roi-reporting` maps to `src/app/(authenticated)/capabilities/roi-reporting/page.tsx`

### Navigation Implementation
- Replace SUMMARY.md-driven nav with a hardcoded nav config (e.g., `src/config/navigation.ts`)
- Config exports an array of sections, each with items that have: label, path, and optional status badge
- Sidebar component reads from this config instead of parsing SUMMARY.md

### Content Pattern
Each page TSX file follows a consistent structure:
1. Status banner (for capability pages only)
2. H1 headline
3. Subheadline
4. Content sections with H2 headings
5. Internal links to related pages (contextual and bottom-of-page)

### What to Keep
- **Authentication system** — password login stays as-is
- **AppShell layout** — sidebar + main content area pattern
- **Brand colors** — teal (#38C6F4), red (#EF462F) accents
- **Responsive layout** — mobile hamburger menu pattern

### What to Remove
- SUMMARY.md parsing logic
- Markdown rendering pipeline (DocumentRenderer, etc.)
- Content sync from external repos
- Category/slug routing (`[...slug]`, `category/[key]`)
- All existing markdown content files

## Appendix C: Phase 2 Backlog

Items deferred from MVP, to be prioritized based on Phase 1 user feedback:

1. **FAQ page** — Common internal questions organized by topic
2. **Quick Reference Card** — Printable one-page summary for meetings
3. **Site-wide search** — Client-side keyword search across page titles, headings, and key terms
4. **Individual "coming soon" capability pages** — Full pages for Phase 2/3 capabilities if demand warrants
5. **Mobile content hierarchy** — Section-specific collapse/expand behavior on mobile
6. **First-visit orientation** — Dismissible tooltip or intro for new users

---

*Approved content plan prepared by the Consolidator for the Ignition Knowledge Base content rebuild pipeline.*

# Ignition Knowledge Base — Content Plan (Draft Requirements)

**Date:** 2026-03-18
**Pipeline Stage:** 02-requirements (PM-A Draft)
**Purpose:** Complete content plan for the Ignition Knowledge Base internal website rebuild. This document provides everything an implementer needs to build every page without additional questions.

---

## Table of Contents

1. [Site Map](#1-site-map)
2. [Navigation Structure](#2-navigation-structure)
3. [Page-by-Page Content Briefs](#3-page-by-page-content-briefs)
4. [Content Principles](#4-content-principles)
5. [Status Indicator System](#5-status-indicator-system)
6. [Glossary Page Specification](#6-glossary-page-specification)

---

## 1. Site Map

### Overview

The site is organized into 5 navigation sections plus the home page. Total: 22 pages (including home). Every page is a fully static TSX component — no markdown rendering, no external content sync.

### Complete Page Inventory

| # | Route Path | Page Title | Section | Purpose | Est. Words |
|---|-----------|------------|---------|---------|-----------|
| 1 | `/` | Home | — | Landing page with platform overview, quick links to all sections, and status dashboard showing what's live vs. coming soon | 400 |
| 2 | `/platform` | What Is Ignition | Platform | The core narrative: what Ignition is, the problem it solves, and why it matters | 600 |
| 3 | `/platform/how-it-works` | How Ignition Works | Platform | The through-channel model explained visually — brand HQ to local operator to customer | 500 |
| 4 | `/platform/why-ignition` | Why Ignition | Platform | Competitive differentiation — why Ignition vs. the status quo or alternatives | 500 |
| 5 | `/capabilities` | Platform Capabilities | Capabilities | Overview of all 7 capability themes with status badges and links to detail pages | 400 |
| 6 | `/capabilities/roi-reporting` | ROI-Based Reporting | Capabilities | Full deep-dive on the live ROI Reporting capability | 700 |
| 7 | `/capabilities/iggy-ai` | Iggy AI Insights Agent | Capabilities | Full deep-dive on the live Iggy AI capability | 700 |
| 8 | `/capabilities/ai-creative` | Dynamic AI Creative | Capabilities | Coming soon page for AI-generated brand-compliant creative | 350 |
| 9 | `/capabilities/cdp` | Customer Data Platform | Capabilities | Coming soon page for unified customer data and segmentation | 350 |
| 10 | `/capabilities/campaigns` | Omni-Channel Campaigns | Capabilities | Coming soon page for unified print + digital campaign management | 350 |
| 11 | `/capabilities/brand-hub` | Distributed Marketing Hub | Capabilities | Coming soon page for the local operator front door and brand asset management | 350 |
| 12 | `/capabilities/automation` | Marketing Automation | Capabilities | Coming soon page for trigger-based workflows and lead nurturing | 350 |
| 13 | `/verticals` | Industries We Serve | Verticals | Overview of target verticals with key stats and links to detail pages | 400 |
| 14 | `/verticals/healthcare` | Healthcare & Chiropractic | Verticals | Vertical-specific value proposition, pain points, and how Ignition addresses them | 500 |
| 15 | `/verticals/qsr` | Quick Service Restaurants | Verticals | Vertical-specific value proposition for QSR/franchise restaurants | 500 |
| 16 | `/verticals/automotive` | Automotive Dealers | Verticals | Vertical-specific value proposition for dealer groups | 500 |
| 17 | `/verticals/financial-services` | Financial Services | Verticals | Vertical-specific value proposition for banks, credit unions, advisory firms | 500 |
| 18 | `/verticals/franchise` | Franchise & Multi-Unit | Verticals | Vertical-specific value proposition for general franchise/multi-unit brands | 500 |
| 19 | `/competitive` | Competitive Positioning | Competitive | How Ignition compares to alternatives — talk tracks and capability comparisons | 600 |
| 20 | `/resources/glossary` | Glossary | Resources | Searchable glossary of platform terms with plain-English definitions | 500 |
| 21 | `/resources/faq` | Frequently Asked Questions | Resources | Common internal questions about Ignition, organized by topic | 500 |
| 22 | `/resources/demo-guide` | Demo Guide | Resources | How to demo Ignition effectively — key flows, talking points, common questions | 600 |

**Total estimated words:** ~10,150

---

## 2. Navigation Structure

The sidebar navigation replaces the old SUMMARY.md-driven nav. It is hardcoded in the application (not generated from files).

### Sidebar Layout

```
HOME (link, not a section)
  Home                              /

PLATFORM (section)
  What Is Ignition                  /platform
  How Ignition Works                /platform/how-it-works
  Why Ignition                      /platform/why-ignition

CAPABILITIES (section)
  Overview                          /capabilities
  ROI-Based Reporting       [LIVE]  /capabilities/roi-reporting
  Iggy AI Insights Agent    [LIVE]  /capabilities/iggy-ai
  Dynamic AI Creative   [COMING]    /capabilities/ai-creative
  Customer Data Platform [COMING]   /capabilities/cdp
  Omni-Channel Campaigns [COMING]   /capabilities/campaigns
  Distributed Marketing Hub [COMING] /capabilities/brand-hub
  Marketing Automation  [COMING]    /capabilities/automation

INDUSTRIES (section)
  Overview                          /verticals
  Healthcare & Chiropractic         /verticals/healthcare
  Quick Service Restaurants         /verticals/qsr
  Automotive Dealers                /verticals/automotive
  Financial Services                /verticals/financial-services
  Franchise & Multi-Unit            /verticals/franchise

COMPETITIVE (section)
  Competitive Positioning           /competitive

RESOURCES (section)
  Glossary                          /resources/glossary
  FAQ                               /resources/faq
  Demo Guide                        /resources/demo-guide
```

### Navigation Behavior

- **Section headers** are non-clickable labels (styled as uppercase, small, gray text)
- **Items** are clickable links
- **Active page** is highlighted (teal text with light teal background, matching current Sidebar.tsx pattern)
- **Status badges** appear inline next to capability items:
  - `LIVE` — small green badge/pill
  - `COMING SOON` — small gray badge/pill
- **All sections expanded by default** (no collapse behavior needed — the nav is short enough)
- **Home link** sits above all sections, styled distinctly (e.g., with a home icon)

---

## 3. Page-by-Page Content Briefs

---

### Page 1: Home (`/`)

**Headline:** Ignition Knowledge Base
**Subheadline:** Everything you need to know about Ironmark's AI-powered distributed marketing platform.

**Sections:**

#### Hero Area
- Headline + subheadline
- One sentence: "Ignition connects brand strategy to local execution for multilocation brands — and proves it works with real revenue data."
- Two prominent buttons: "Explore the Platform" (links to `/platform`) and "See Capabilities" (links to `/capabilities`)

#### Platform Status Dashboard
- Visual card grid showing all 7 capability themes
- Each card shows: theme name, one-line description, status badge (Live / In Development / Planned)
- Cards link to their respective capability pages
- Purpose: instant at-a-glance view of what's live and what's coming

#### Quick Links Grid
- 4 cards linking to key starting points:
  - "What Is Ignition?" — for the overview narrative
  - "Industries We Serve" — for vertical-specific messaging
  - "Competitive Positioning" — for competitive talk tracks
  - "Demo Guide" — for preparing to show the platform

**Tone:** Welcoming, orienting. This is the front door. Assume the reader just got here and needs to know where to go.

---

### Page 2: What Is Ignition (`/platform`)

**Headline:** What Is Ignition?
**Subheadline:** The AI-powered platform that connects brand strategy to local execution — and proves it works.

**Sections:**

#### The Problem We Solve
- Heading: "Multilocation marketing is broken"
- Cover the core problem: brands spend heavily on marketing but can't connect spend to revenue. Print, digital, and local execution are fragmented. Nobody can answer "is our marketing working?" at the location level.
- Use a concrete scenario: "A QSR brand with 400 locations spends $2M on marketing. Their agency sends a monthly PDF with impressions and clicks. But nobody can tell you which locations are profitable and why."

#### What Ignition Does
- Heading: "Ignition bridges the gap"
- Explain the platform in plain language: unified reporting, AI-driven insights, campaign tools across every location
- Emphasize: visibility for brand leaders, simplicity for local operators
- Key phrase to include: "Competitors run marketing. Ignition proves it works."

#### The Transformation Story
- Heading: "From marketing vendor to platform company"
- Explain Ironmark's 30+ year heritage in marketing services
- How Ignition adds an intelligence layer on top of existing relationships
- Position: not starting from scratch — adding technology to trusted relationships

#### Who It's For
- Heading: "Built for the entire channel"
- Brief descriptions of each user level:
  - Brand HQ: network dashboards, compliance, AI insights
  - Regional managers: benchmarks, alerts, monitoring
  - Local operators: campaign kits, AI creative, fund management

**Tone:** Narrative, confident. This is the story page — it should read like a well-crafted product brief, not a feature list.

---

### Page 3: How Ignition Works (`/platform/how-it-works`)

**Headline:** How Ignition Works
**Subheadline:** One platform serving every level of the marketing channel — from brand headquarters to the local storefront.

**Sections:**

#### The Through-Channel Model
- Heading: "Full-channel coverage, not just one layer"
- Explain that most platforms serve only brand HQ or only local operators — Ignition serves both and everything in between
- Visual concept: a vertical flow showing Brand HQ → Regional → Local → Customer, with Ignition capabilities mapped to each level

#### What Each Level Gets
- Heading: "Every level, every capability"
- Three sub-sections (use cards or a visual layout):
  - **Brand HQ:** Network-level dashboards, campaign performance across all locations, AI-powered anomaly detection, compliance tools
  - **Regional Managers:** Location benchmarking, performance alerts, team activity monitoring
  - **Local Operators:** Pre-built campaign kits, AI-generated creative, co-op fund access, simple dashboards

#### The Data Flow
- Heading: "Connected data, not siloed tools"
- Explain how data flows: ad platforms and CRM data flow into Ignition, get unified and enriched, then power dashboards, AI insights, and campaign recommendations
- Emphasize: brands own their data, not their agency

#### The 3 Phases
- Heading: "Intelligence → Activation → Automation"
- Brief explanation of the three compounding phases:
  - Intelligence: See what's happening (ROI Reporting, Iggy AI)
  - Activation: Turn insight into action (AI Creative, Campaigns)
  - Automation: Embed into daily operations (Workflows, Lead Nurturing)

**Tone:** Explanatory, structured. This page helps people understand the architecture without being technical. Use analogies where helpful.

---

### Page 4: Why Ignition (`/platform/why-ignition`)

**Headline:** Why Ignition?
**Subheadline:** What makes Ignition different from every other marketing platform on the market.

**Sections:**

#### The Ignition Difference
- Heading: "Five things no competitor can match"
- Present each differentiator as a brief block:
  1. **Revenue Attribution, Not Vanity Metrics** — Closed-loop from spend to revenue at the location level. Most platforms stop at clicks or leads.
  2. **Conversational AI That Answers Real Questions** — Iggy isn't a chatbot with canned answers. It reasons over live campaign data and recommends actions.
  3. **Print + Digital in One Platform** — Ironmark's production heritage means direct mail, print, and digital campaigns orchestrated together. No pure-digital platform can do this.
  4. **Proprietary Data Assets** — 160M automotive consumer records (AMMS), growing campaign intelligence across verticals. Data that fuels AI models competitors can't replicate.
  5. **Built on Existing Relationships** — Not selling cold. Adding intelligence to brands that already trust Ironmark with their marketing operations.

#### Intelligence Over Execution
- Heading: "We don't just run marketing — we prove it works"
- Explain the positioning: execution platforms (SOCi, Evocalize) do the work; Ignition measures whether it pays off
- The question Ignition answers that others can't: "Which of your 300 locations are profitable, and why?"

#### The Status Quo Is the Real Competitor
- Heading: "Your biggest competitor isn't a platform — it's the monthly PDF"
- Explain that most multilocation brands are still getting static monthly reports from their agency
- Contrast: real-time vs. monthly, revenue vs. clicks, location-level vs. aggregated, interactive vs. static

**Tone:** Confident, assertive. This is the competitive conviction page. Not aggressive or disparaging — but clearly stating why Ignition wins.

---

### Page 5: Platform Capabilities Overview (`/capabilities`)

**Headline:** Platform Capabilities
**Subheadline:** Seven capability themes, three compounding phases — from visibility to intelligence to automation.

**Sections:**

#### The Three Phases
- Brief intro explaining the phased approach:
  - **Phase 1 — Intelligence:** ROI Reporting + Iggy AI (live today)
  - **Phase 2 — Activation:** AI Creative + CDP + Campaigns (in development / planned)
  - **Phase 3 — Automation:** Marketing Hub + Automation (planned)
- Emphasize: each phase compounds — reporting feeds AI, AI feeds creative, creative feeds campaigns, campaigns feed automation

#### Capability Cards Grid
- 7 cards, one per theme, arranged in a grid
- Each card contains:
  - Theme name
  - One-line description (from research brief)
  - Status badge (Live / In Development / Planned)
  - Target user persona (one line)
  - Link to the full capability page
- **Card order:** ROI Reporting, Iggy AI, Dynamic AI Creative, CDP, Campaigns, Brand Hub, Automation

#### What's Live Today
- Brief callout section reinforcing: "ROI-Based Reporting and Iggy AI are live in production. The Joint Chiropractic runs on Ignition today across 900+ locations."

**Tone:** Organized, scannable. This is a navigation page — get people to the detail pages quickly.

---

### Page 6: ROI-Based Reporting (`/capabilities/roi-reporting`)

**Status:** LIVE

**Headline:** ROI-Based Reporting
**Subheadline:** See exactly which locations are making money from marketing — and which aren't.

**Sections:**

#### The Problem
- Heading: "Marketing spend without marketing proof"
- Cover the pain: brands spend millions but can't connect spend to revenue at the location level. Monthly PDFs from agencies show impressions and clicks — not business outcomes. No location-level visibility.

#### What It Does
- Heading: "Unified dashboards connecting spend to revenue"
- Key capabilities presented as benefit blocks:
  - **Automated data ingestion** — Google, Meta, TikTok, LinkedIn pulled in automatically. No spreadsheets, no manual exports.
  - **Closed-loop attribution** — Not just clicks or impressions. Connect upstream ad spend to downstream CRM and POS revenue.
  - **Multi-tenant views** — Network, region, and individual location dashboards in one system. Brand HQ sees the whole picture; franchise operators see their location.
  - **Daily performance metrics** — Campaign performance by platform with 7 timeframe options. Not monthly. Not weekly. Daily.

#### Who It's For
- Heading: "Built for the people asking 'is it working?'"
- Describe target users: Brand CMOs, VPs of Marketing, regional marketing managers, franchise operators
- Use the key question: "Am I making money from marketing?"

#### Why It Matters Strategically
- Heading: "The entry point to the platform"
- Explain: ROI Reporting is fast to deploy, delivers immediate value, and opens the door to the full Ignition platform
- Once reporting lives in Ignition, switching costs increase and the upsell path opens

#### Proof Point
- Heading: "Live in production"
- The Joint Chiropractic: 900+ locations live on Ignition (February 2026)

**Tone:** Confident, concrete. Heavy on the "so what" — not just features, but what they mean for the reader's customer conversations.

---

### Page 7: Iggy AI Insights Agent (`/capabilities/iggy-ai`)

**Status:** LIVE

**Headline:** Iggy AI — Your Intelligent Marketing Analyst
**Subheadline:** Ask questions in plain English. Get answers from live campaign data. No more waiting for reports.

**Sections:**

#### The Problem
- Heading: "Data without intelligence is just noise"
- Cover the pain: dashboards are great, but most marketers don't have time to dig through data. They need someone to tell them what's happening and what to do about it. That's what Iggy does.

#### Two Ways to Use Iggy
- Heading: "Proactive alerts and on-demand answers"
- **Persistent Insights Panel** — Iggy proactively surfaces issues: underperforming locations, budget anomalies, campaign opportunities. No need to ask — the alerts come to you.
- **Ask Iggy Chat** — Type a question in plain English and get an answer grounded in live data. "Which locations are underperforming this month?" "Why did Location 12's cost per lead spike?"

#### How Iggy Thinks
- Heading: "Not a chatbot — a reasoning engine"
- Explain the multi-method health assessment: goal-based analysis, historical trend comparison, vertical benchmarks
- Root cause analysis: Iggy identifies symptoms, generates hypotheses, gathers evidence, and delivers scored recommendations
- Emphasize: this isn't keyword matching or canned responses. Iggy reasons over real data.

#### Iggy Notebook
- Heading: "Turn questions into visual reports"
- Explain: ask a natural language question, get a visual report with metrics, charts, tables, and insights
- Reports are saveable, re-runnable, and PDF-exportable
- Example: "Show me new patient cost by clinic for Q1" produces a formatted report with benchmarks and recommendations

#### Insight Lifecycle
- Heading: "From intelligence to accountability"
- Explain the lifecycle tracking: New → Acknowledged → In Progress → Resolved → Dismissed
- Insights don't just appear and vanish — they're tracked to resolution

#### The Competitive Gap
- Heading: "No competitor has this"
- State directly: no DMP competitor offers conversational AI answering questions from live campaign data
- This is why customers choose Ignition and why they stay

**Tone:** Energized, demonstrative. Iggy is the "wow factor." Write this page like you're excited to show someone something they've never seen.

---

### Page 8: Dynamic AI Creative (`/capabilities/ai-creative`)

**Status:** COMING SOON (In Development — Target Q2-Q4 2026)

**Headline:** Dynamic AI Creative
**Subheadline:** AI-generated, brand-compliant creative — localized automatically for every location.

**Sections:**

#### The Vision
- Heading: "Brand-safe creative at scale, without the agency bottleneck"
- The problem: local operators need marketing creative but lack design skills. Corporate teams need brand-compliant output across hundreds of locations. Agencies can't move fast enough.
- What's coming: AI-generated content within brand guidelines — tone, style, disclaimers enforced as constraints, not suggestions

#### What to Expect
- Heading: "What this capability will deliver"
- Bullet list of planned features:
  - Content generated within brand guidelines with hard compliance constraints
  - Automatic localization (address, phone, local offers, regional messaging)
  - Multi-format output: social posts, email copy, ad headlines, direct mail text, landing page content
  - Compliance audit logging for every asset generated

#### Why It Matters
- Heading: "Three customers asked for this independently"
- Three different customers in three different verticals requested AI creative. It's the revenue accelerator when combined with ROI Reporting.

**Tone:** Forward-looking but honest. Clearly state this is in development. Excite without overpromising.

---

### Page 9: Customer Data Platform (`/capabilities/cdp`)

**Status:** COMING SOON (Planned — Target Q2-Q3 2026)

**Headline:** Customer Data Platform
**Subheadline:** Unified customer data from every source — turning fragmented data into a precision targeting asset.

**Sections:**

#### The Vision
- Heading: "One customer view across every data source"
- The problem: customer data is scattered across ad platforms, GA4, CRM, POS systems. No unified view means no precision targeting.
- What's coming: unified data ingestion, identity resolution, predictive segmentation

#### What to Expect
- Heading: "What this capability will deliver"
- Key planned features:
  - Unified ingestion from ad platforms, GA4, CRM, POS, CSV uploads
  - Identity resolution and hierarchy mapping (Brand → Company → Location)
  - Predictive segments: purchase patterns, churn risk, upsell readiness, geographic
  - Segment activation: email/SMS, paid media, in-store/direct mail

#### Why It Matters
- Heading: "Data as an appreciating asset"
- More data through Ignition increases switching costs. The CDP powers ROI Reporting, AI Insights, Automation, and predictive models.

**Tone:** Strategic, forward-looking. Emphasize the platform compounding effect.

---

### Page 10: Omni-Channel Campaigns (`/capabilities/campaigns`)

**Status:** COMING SOON (Planned — Target Q3-Q4 2026)

**Headline:** Omni-Channel Campaign Management
**Subheadline:** Print and digital campaigns orchestrated from one platform — with unified attribution.

**Sections:**

#### The Vision
- Heading: "One campaign, every channel, one report"
- The problem: campaigns run across Google, Meta, direct mail, and local events — but reporting is siloed by channel. Nobody sees the full picture.
- What's coming: unified campaign management across digital and physical channels

#### What to Expect
- Heading: "What this capability will deliver"
- Key planned features:
  - Campaign kits and libraries with pre-configured packages
  - Unified campaign inventory across Google, Meta, LinkedIn, direct mail
  - Print + digital in one view (Ironmark's production heritage)
  - Cross-channel attribution across digital and physical touchpoints

#### Why It Matters
- Heading: "Print + digital is our unfair advantage"
- No pure-digital DMP can offer unified print + digital campaign management. Ironmark already produces the physical materials — Ignition orchestrates them alongside digital.

**Tone:** Confident about the structural advantage. Print + digital is the moat — make that clear.

---

### Page 11: Distributed Marketing Hub (`/capabilities/brand-hub`)

**Status:** COMING SOON (Planned — Target Q1-Q2 2027)

**Headline:** Distributed Marketing Hub & Brand Assets
**Subheadline:** The front door for local operators — curated programs, brand-safe templates, and AI recommendations.

**Sections:**

#### The Vision
- Heading: "Making marketing as simple as ordering from a menu"
- The problem: franchisees and local operators either go off-brand or don't market at all. No middle ground.
- What's coming: a curated, mobile-first portal where local operators select from pre-approved programs and launch in clicks

#### What to Expect
- Heading: "What this capability will deliver"
- Key planned features:
  - Program and package catalog filterable by objective, budget, channel
  - AI-powered recommendations based on performance gaps and benchmarks
  - Co-op and fund management with eligibility checks and claims workflow
  - Brand asset repository with template locks and localizable fields
  - Mobile-first design for field operators

#### Why It Matters
- Heading: "Converting passive affiliates into active marketers"
- Directly addresses the "local chaos" problem. Makes marketing accessible to people who are operators first and marketers never.

**Tone:** Empathetic toward local operators. They're not lazy — they're busy running a business. This tool meets them where they are.

---

### Page 12: Marketing Automation (`/capabilities/automation`)

**Status:** COMING SOON (Planned — Target Q1-Q2 2027)

**Headline:** Full-Funnel Marketing Automation
**Subheadline:** Trigger-based workflows, lead nurturing, and conversion optimization — embedded into daily operations.

**Sections:**

#### The Vision
- Heading: "Marketing that runs itself — intelligently"
- The problem: marketing stops at the campaign. Leads come in but don't get followed up. Lapsed customers drift away. Nobody has time for manual follow-up across hundreds of locations.
- What's coming: automated workflows triggered by real signals from the CDP

#### What to Expect
- Heading: "What this capability will deliver"
- Key planned features:
  - Trigger framework: new leads, low conversion rates, lapsed customers
  - Pre-defined drip and nurture playbooks
  - Visual journey builder with drag-and-drop workflow design
  - Conversion tools: AI lead capture chatbot, call tracking, appointment schedulers
  - Lightweight CRM for customers without a full CRM system

#### Why It Matters
- Heading: "The final lock-in"
- Once Ignition manages the complete workflow from audience identification through conversion tracking, it becomes the operating system for the brand's marketing function.

**Tone:** Aspirational but grounded. This is the furthest-out capability — focus on the vision without making delivery promises.

---

### Page 13: Industries We Serve Overview (`/verticals`)

**Headline:** Industries We Serve
**Subheadline:** Ignition is purpose-built for multilocation brands. Here's how it works in your vertical.

**Sections:**

#### Vertical Cards Grid
- 5 cards, one per vertical:
  - **Healthcare & Chiropractic** — clinic networks, chiropractic franchises, healthcare systems
  - **Quick Service Restaurants** — QSR franchises, multi-unit restaurant operators
  - **Automotive Dealers** — dealer groups, OEM franchise networks
  - **Financial Services** — banks, credit unions, advisory firms, insurance agencies
  - **Franchise & Multi-Unit** — personal services, retail, home services, and more
- Each card shows: vertical name, 1-2 sentence description, key stat (e.g., market size or location count), link to detail page

#### Why Verticals Matter
- Brief explanation: Ignition isn't one-size-fits-all. Each vertical has specific terminology, compliance requirements, KPIs, and operational patterns. Ignition adapts to each.

**Tone:** Scannable, inviting. Get readers to their vertical quickly.

---

### Page 14: Healthcare & Chiropractic (`/verticals/healthcare`)

**Headline:** Healthcare & Chiropractic
**Subheadline:** From patient acquisition to clinic-level ROI — marketing intelligence for healthcare networks.

**Sections:**

#### Market Context
- Heading: "The opportunity"
- 40,000 enterprise healthcare locations + 70,000 chiropractic clinics
- Franchise chiro segment growing at 28.5% CAGR
- Key stat to highlight visually

#### The Pain Points
- Heading: "What healthcare marketers struggle with"
- Clinic managers are not marketers — wide skill variance across locations
- Fragmented tooling with no hierarchical visibility
- Attribution gaps: media → call → schedule → visit → revenue
- HIPAA/PHI compliance slows speed to market

#### How Ignition Helps
- Heading: "How Ignition solves it"
- Location-level ROI: one source of truth showing new patient cost and channel performance by clinic
- Iggy AI for benchmarking: "Your new patient cost is 34% above network average — here's what top clinics do differently"
- Patient acquisition attribution: campaign spend to call tracking to appointments to new patients
- HIPAA-aware workflows and privacy-first architecture

#### Proof Point
- Heading: "Already in production"
- The Joint Chiropractic: 900+ locations live on Ignition

#### Healthcare Terminology Guide
- Brief table of healthcare-specific terms used in the platform:
  - "New patient cost" (not "cost per lead")
  - "Clinic" (not "location" or "store")
  - "Patient acquisition" (not "lead generation")
  - "Provider" or "practitioner" (not "operator")

**Tone:** Use healthcare language throughout. Patients, clinics, providers — not leads, stores, operators.

---

### Page 15: Quick Service Restaurants (`/verticals/qsr`)

**Headline:** Quick Service Restaurants
**Subheadline:** Store-level campaign performance, LTO execution, and franchise marketing intelligence.

**Sections:**

#### Market Context
- Heading: "The opportunity"
- 204,000 QSR franchise locations — largest addressable segment
- 82% operated by multi-unit franchisees
- +2.2% YoY growth

#### The Pain Points
- Heading: "What QSR marketers struggle with"
- LTO execution is fragmented — corporate doesn't know if stores are running campaigns
- Disconnected data across POS, loyalty, app/web, delivery marketplaces
- Heavy lift to localize creative across hundreds of stores per LTO window
- Co-op/ad fund dollars deployed with no ROI proof

#### How Ignition Helps
- Heading: "How Ignition solves it"
- Campaign performance by location: store-by-store view for every active LTO
- Channel attribution for local marketing: spend connected to traffic and average ticket movement
- Network benchmarking: top-quartile franchisee behavior packaged as recommendations for underperformers

#### Proof Point
- Heading: "In the pipeline"
- Domino's targeted for onboarding. QSR-specific campaign kits designed for the platform.

#### QSR Terminology Guide
- "LTO" (limited-time offer)
- "Store" or "unit" (not "location")
- "Guest count" or "traffic" (not "leads")
- "Average ticket" (not "order value")
- "Franchisee" or "operator"

**Tone:** Use QSR language. Stores, guests, LTOs, tickets — not generic marketing speak.

---

### Page 16: Automotive Dealers (`/verticals/automotive`)

**Headline:** Automotive Dealers
**Subheadline:** Unified sales and service marketing intelligence for dealer groups.

**Sections:**

#### Market Context
- Heading: "The opportunity"
- 18,000 franchised dealership rooftops
- Average revenue per dealership ~$70.8M
- Top 150 dealer groups control 33% of industry revenue

#### The Pain Points
- Heading: "What auto marketers struggle with"
- Each rooftop running its own marketing through its own vendors — no aggregate visibility
- OEM co-op programs are a compliance nightmare; money left on the table annually
- Service marketing (fixed ops) under-leveraged vs. sales despite higher margins
- Siloed systems: DMS, CRM, inventory feeds, websites, call tracking

#### How Ignition Helps
- Heading: "How Ignition solves it"
- AMMS data asset: 160M automotive consumer records enabling segments no competitor can build
- Unified sales + service ROI: spend mapped to VDP views, leads, appointments, and closed repair orders by rooftop
- OEM co-op compliance: pre-approved templates, auto-generated disclaimers, documentation meeting OEM requirements

#### Proof Point
- Heading: "Data already in production"
- AMMS is live and generating value. Channel partners (DealerWing, Dynatron) already white-labeling Ironmark solutions.

#### Automotive Terminology Guide
- "Rooftop" (not "location")
- "Fixed ops" or "service department" (not "after-sales")
- "VDP" (vehicle detail page)
- "DMS" (dealer management system)
- "RO" (repair order)

**Tone:** Automotive industry language. Rooftops, fixed ops, VDPs — this audience knows the terminology and will notice if you get it wrong.

---

### Page 17: Financial Services (`/verticals/financial-services`)

**Headline:** Financial Services
**Subheadline:** Compliant advisor marketing, branch-level attribution, and audit-ready campaign management.

**Sections:**

#### Market Context
- Heading: "The opportunity"
- 98,000 locations (76,000 bank branches + 22,000 credit union offices)
- Excludes ~135K-145K insurance agencies (TAM upside)
- 9-18 month sales cycles; compliance is the gating factor

#### The Pain Points
- Heading: "What financial services marketers struggle with"
- FINRA/SEC/GLBA compliance slows campaigns — fragmented review loops
- Branches and advisors either go rogue or don't market at all
- Hard to scale local advisor marketing while maintaining brand safety and audit readiness
- Can't connect marketing spend to qualified appointments, proposals, or funded accounts

#### How Ignition Helps
- Heading: "How Ignition solves it"
- Pre-approved creative and compliance workflow: advisors deploy from approved libraries without individual reviews
- Branch-level benchmarking: activity rates, campaign participation, pipeline attribution by branch, region, and advisor
- Full audit trail: timestamps, approval records, disclosure versions for every piece of marketing

#### Proof Point
- Heading: "Built for compliance"
- Compliance workflow, pre-approved template libraries, and RBAC built into Ignition MVP. Preferra and Janney in pipeline.

#### Financial Services Terminology Guide
- "Advisor" or "financial advisor" (not "operator" or "agent")
- "Branch" (not "location")
- "AUM" (assets under management)
- "Funded account" (not "conversion")
- "Compliance review" (not "approval")

**Tone:** Conservative, professional, compliance-aware. This audience takes regulatory requirements seriously — so should the content.

---

### Page 18: Franchise & Multi-Unit (`/verticals/franchise`)

**Headline:** Franchise & Multi-Unit Brands
**Subheadline:** Close the gap between your best-performing franchisees and everyone else.

**Sections:**

#### Market Context
- Heading: "The opportunity"
- 647,000 non-QSR franchise locations across personal services, retail, home services
- +2.5% YoY growth
- The broadest segment in the TAM

#### The Pain Points
- Heading: "What franchise marketers struggle with"
- Franchisees either do nothing or go off-brand — no middle ground
- Ad fund contributions collected but ROI impossible to demonstrate
- Best franchisees figured out what works; worst don't know what to run; no scalable way to close the gap

#### How Ignition Helps
- Heading: "How Ignition solves it"
- One-click campaign kits: everything a franchisee needs in a single deployable unit
- Location benchmarking with Iggy recommendations: "You're in the bottom quartile — top performers run two additional campaigns per month"
- Ad fund and co-op visibility: fund spend connected to network-level and location-level outcomes

#### Proof Point
- Heading: "Validated at scale"
- TJC validates the franchise model at 900+ locations. Home Instead, South Moon Under, Madden Plumbing, and others in MVP cohort.

#### Franchise Terminology Guide
- "Franchisee" or "owner-operator"
- "Unit" (not "store" unless QSR)
- "Ad fund" or "brand fund"
- "Co-op" (cooperative advertising)
- "Franchisor" (corporate/brand HQ)

**Tone:** Practical, empathetic. Franchisees are running businesses — marketing is just one of fifty things on their plate. The tone should respect that.

---

### Page 19: Competitive Positioning (`/competitive`)

**Headline:** Competitive Positioning
**Subheadline:** How Ignition compares to the alternatives — and what to say when a prospect brings them up.

**Sections:**

#### The Core Positioning
- Heading: "One line to remember"
- "Competitors run marketing. Ignition proves it works."
- The consistent differentiator: Ignition answers "is my marketing driving revenue at the location level?" when others cannot.

#### Head-to-Head Comparisons
- One section per competitor with consistent structure:

  **Ansira (BrandMuscle + SproutLoud)**
  - What they do: largest enterprise DMP, co-op/MDF fund management, 300+ brands
  - Their strength: co-op fund management (best-in-class), enterprise scale
  - Where we win: no conversational AI, complex and hard to use (G2 reviews), stops at spend-to-lead, no print + digital attribution
  - Talk track: "Ansira manages distribution and co-op well. Can they tell you which of your 500 locations are profitable and why?"

  **SOCi**
  - What they do: local marketing execution at scale, 3M+ locations, autonomous posting and review management
  - Their strength: agentic execution (posts, reviews, listings), 140+ integrations
  - Where we win: shows tasks completed not revenue, no conversational analytics, digital only, execution vs. intelligence
  - Talk track: "SOCi executes marketing. Ignition measures whether it's working. They're execution; we're intelligence."

  **Evocalize**
  - What they do: local digital campaign deployment with pre-configured Blueprints
  - Their strength: local operator simplicity, Facebook/Google/TikTok automation
  - Where we win: spend-to-clicks only, digital only, no AI or root cause analysis, no proprietary data
  - Talk track: "Evocalize tells you Location 12 spent $5,000 and got 200 clicks. Ignition tells you Location 12 generated $47,000 in revenue — and here's why."

  **Pica9**
  - What they do: brand management and template customization for franchise orgs
  - Their strength: template compliance, affordability, accessible to smaller systems
  - Where we win: template tool not analytics platform, no revenue attribution, no AI
  - Talk track: "Pica9 answers 'are my locations using the right assets?' Ignition answers 'are those assets working?'"

  **The Status Quo (Agency Monthly PDF)**
  - What they do: monthly PDF reports with impressions, clicks, spend summaries
  - Their weakness: monthly cadence, spend/click metrics only, no location visibility, no interactivity, agency owns the data
  - Talk track: "Your agency sends you a monthly report that says you spent $200,000 and got 1.2 million impressions. Can they tell you which of your 300 locations are profitable?"

#### Capability Comparison Table
- A visual comparison matrix showing Ignition vs. top 4 named competitors across key capabilities:
  - Location-level ROI reporting
  - Conversational AI insights
  - Print + digital attribution
  - Proprietary data assets
  - Co-op/fund management
  - Brand asset management
  - Campaign automation
- Use checkmarks, partial indicators, and X marks

#### "We Already Use X" — Response Guide
- Brief scripts for when a prospect says "we already use [competitor]"
- Frame as complementary where appropriate, competitive where direct

**Tone:** Factual, not disparaging. State what competitors do well, then state where Ignition wins. Let the reader draw the conclusion. Never badmouth — just contrast.

---

### Page 20: Glossary (`/resources/glossary`)

**Headline:** Glossary
**Subheadline:** Key terms and concepts used across the Ignition platform.

**Sections:**

See [Section 6: Glossary Page Specification](#6-glossary-page-specification) for the full term list and implementation details.

**Tone:** Reference material. Clear, concise definitions. No marketing spin — just accurate explanations.

---

### Page 21: FAQ (`/resources/faq`)

**Headline:** Frequently Asked Questions
**Subheadline:** Common questions about Ignition — from the team, for the team.

**Sections:**

#### General
- "What is Ignition in one sentence?"
- "How is Ignition different from what we already offer clients?"
- "What's live today vs. what's on the roadmap?"
- "Who are our first customers on the platform?"

#### For Sales Conversations
- "How do I explain Ignition to a prospect who isn't technical?"
- "What should I say when a prospect asks about pricing?" (Answer: direct them to leadership — no pricing in this KB)
- "How does Ignition compare to their current agency?"
- "What if the prospect already uses a competitor platform?"

#### About the Product
- "What data sources does Ignition connect to?"
- "How quickly can a new customer get set up?"
- "What does the customer see when they log in?"
- "Can Ignition work alongside their existing tools?"

#### About Iggy AI
- "What kinds of questions can Iggy answer?"
- "How does Iggy know what's happening with a specific campaign?"
- "Can Iggy make changes to campaigns or just recommend them?"
- "How is Iggy different from ChatGPT or other AI tools?"

**Tone:** Conversational, direct. These are the questions people actually ask in meetings and Slack. Answer them plainly.

---

### Page 22: Demo Guide (`/resources/demo-guide`)

**Headline:** Demo Guide
**Subheadline:** How to show Ignition effectively — key flows, talking points, and common questions.

**Sections:**

#### Before the Demo
- Heading: "Preparation checklist"
- Know the prospect's vertical and adjust terminology accordingly
- Know their current marketing setup (agency, in-house, tools)
- Know their location count and structure (corporate → regional → local)
- Have 2-3 specific scenarios ready using their vertical's language

#### The Demo Flow
- Heading: "Recommended demo structure (15-20 minutes)"
- **Open with the problem (2 min):** Mirror their pain — "You have X locations and you can't tell which ones are making money from marketing."
- **Show ROI Dashboard (5 min):** Network view → drill to location → show channel attribution → show daily performance. Let the data speak.
- **Introduce Iggy (5 min):** Show the Insights Panel (proactive alerts) → Ask Iggy a natural language question → Show the Notebook output. This is the "wow moment."
- **Connect to their world (3 min):** Use their vertical terminology. Reference their specific challenges. Show how the dashboard answers their specific question.
- **Close with the roadmap (2 min):** Briefly mention what's coming — AI Creative, CDP, Campaigns. Plant the long-term vision.

#### Key Talking Points
- Heading: "Phrases that land"
- List of proven phrases organized by context:
  - Opening: "Can you tell me which of your [locations/clinics/stores/branches] are profitable from marketing?"
  - Dashboard: "This isn't clicks and impressions — this is revenue."
  - Iggy: "Ask it anything. It's looking at your live data."
  - Close: "This is what's live today. Imagine what happens when AI creative and automation are added."

#### Handling Common Questions During Demos
- "How does the data get in?" — Automated integrations. No manual work.
- "How accurate is the attribution?" — Explain the closed-loop methodology simply.
- "What about our existing tools?" — Ignition complements, doesn't replace. It's the intelligence layer.
- "When can we start?" — Fast onboarding. ROI Reporting can go live in weeks.

**Tone:** Practical, coaching-oriented. This page should feel like a senior colleague walking you through how to run a great demo.

---

## 4. Content Principles

### Writing Rules

1. **Lead with the problem, then the solution.** Every capability page and vertical page opens with the pain the customer feels before describing how Ignition solves it.

2. **Use "you" and "we" language.** "We" = Ironmark. "You" = the internal reader. Never: "the platform enables stakeholders to leverage..." Always: "Ignition shows you which locations are winning and why."

3. **Concrete over abstract.** Instead of "AI-powered insights," write: "Iggy tells a clinic manager their new patient cost is 34% above network average and recommends what top clinics do differently." Use the Location 12 vs. Location 43 pattern to make benefits tangible.

4. **Short paragraphs, scannable structure.** No paragraph longer than 3-4 sentences. Use headers, bullets, bold text, and tables. Every page should be usable in 90 seconds.

5. **Honest about status.** Clearly distinguish live (green badge), in development (yellow badge), and planned (gray badge). Internal audiences need accurate information to set customer expectations.

6. **No jargon without explanation.** Terms like "through-channel," "CDP," "closed-loop attribution," and "multi-tenant" should be used but always with a plain-English explanation the first time they appear on a page. The glossary page handles the canonical definitions.

7. **Vertical-native language.** Each vertical page uses that vertical's terminology. Healthcare says "patients" and "clinics." QSR says "guests" and "stores." Auto says "rooftops" and "fixed ops." The terminology guide at the bottom of each vertical page is the reference.

### What to Exclude

- **No pricing, revenue projections, ARR targets, deal sizes, or financial details.** This is a product marketing site, not a financial pitch.
- **No customer stories / case studies.** Explicitly excluded from scope. Proof points (e.g., "TJC, 900+ locations") are included as brief facts, not narratives.
- **No technical architecture details.** No API specs, database schemas, or code references. If someone needs technical depth, that lives in engineering docs elsewhere.
- **No internal politics or org chart.** Don't reference specific internal team structures, reporting lines, or personnel beyond what's necessary.

### How to Handle "Coming Soon" Capabilities

Each "coming soon" capability page follows a lighter template:

1. **The Vision** — What problem does this solve? (Write as if it exists, but in future tense)
2. **What to Expect** — Bulleted list of planned features (sourced from the research brief)
3. **Why It Matters** — Strategic importance and how it compounds with other capabilities
4. **Status indicator** — Clear banner or badge: "In Development" or "Planned" with target timeframe

Coming soon pages should NOT:
- Promise specific delivery dates (use "Target Q2-Q4 2026" format)
- Include screenshots or mock-ups (nothing to show yet)
- Overpromise capabilities — stick to what the research brief describes

### How to Reference Competitors

- **Use competitor names directly.** This is an internal site — no need to be coy. Ansira, SOCi, Evocalize, Pica9 are named explicitly on the competitive positioning page.
- **On non-competitive pages**, reference competitors generically: "most platforms," "typical DMP competitors," "the status quo." Save the head-to-head for the competitive page.
- **Never disparage.** State what they do, state what they do well, then state where Ignition wins. Factual contrast, not trash talk.
- **The real competitor is the status quo.** Agency monthly PDFs are the most common competitive situation. Give this equal or greater weight than named competitors.

---

## 5. Status Indicator System

Every capability has a status that appears in navigation badges, page banners, and the home dashboard.

| Status | Badge Color | Badge Text | Banner Text | Applies To |
|--------|------------|------------|-------------|-----------|
| Live | Green | LIVE | "This capability is live in production." | ROI Reporting, Iggy AI |
| In Development | Amber/Yellow | IN DEV | "This capability is currently in development. Target: [timeframe]." | Dynamic AI Creative |
| Planned | Gray | PLANNED | "This capability is on the roadmap. Target: [timeframe]." | CDP, Campaigns, Brand Hub, Automation |

### Implementation Notes

- **Navigation:** Small colored pill/badge next to the item name in the sidebar
- **Page banner:** Colored strip at the top of the page content area (below the H1) with status text
- **Home dashboard:** Cards use the badge color as an accent on the card border or header
- **Timeframes:** Display as "Target: Q2-Q4 2026" — never as firm dates

---

## 6. Glossary Page Specification

The glossary page (`/resources/glossary`) is a searchable, alphabetized list of terms. It should support:
- Client-side text filtering (search box at top)
- Alphabetical jump links (A-Z bar)
- Each term has: Term name (bold), plain-English definition, context note (where this term comes up)

### Initial Term List

| Term | Definition | Context |
|------|-----------|---------|
| Attribution | Connecting a marketing action (like an ad click) to a business outcome (like a sale). "Closed-loop attribution" means tracking the full journey from ad spend to revenue. | ROI Reporting, Iggy AI |
| CDP | Customer Data Platform. A system that unifies customer data from multiple sources (CRM, POS, ad platforms, web analytics) into one view. | CDP capability |
| Closed-Loop | Tracking that connects the beginning of a marketing journey (ad impression or click) all the way through to the end result (revenue or sale). Most marketing platforms only track partway. | ROI Reporting |
| Co-op / MDF | Cooperative advertising funds. Money that brand HQ provides to local operators to spend on marketing, often with rules about how it can be used. MDF = Market Development Funds. | Brand Hub, Franchise vertical |
| DMP | Distributed Marketing Platform. A software platform that helps multilocation brands manage marketing across all their locations. This is the category Ignition competes in. | Platform-wide |
| Fixed Ops | Automotive term for the service and parts departments at a dealership. Higher margins than vehicle sales but often under-marketed. | Automotive vertical |
| Iggy | Ignition's AI-powered insights agent. Can be used in two modes: proactive alerts (Insights Panel) and conversational Q&A (Ask Iggy). | Iggy AI capability |
| Insight Lifecycle | The tracking states an Iggy insight moves through: New → Acknowledged → In Progress → Resolved → Dismissed. Turns intelligence into accountability. | Iggy AI capability |
| LTO | Limited-Time Offer. A promotion available for a short period. Common in QSR — think seasonal menu items or limited deals. | QSR vertical |
| Multi-Tenant | An architecture where one platform serves multiple separate organizations (brands), each seeing only their own data. Ignition is multi-tenant — each brand's data is isolated. | Platform architecture |
| Notebook (Iggy) | A feature where natural language questions become visual reports with metrics, charts, tables, and insights. Reports are saveable, re-runnable, and exportable as PDF. | Iggy AI capability |
| RBAC | Role-Based Access Control. A system where what you can see and do is determined by your role (e.g., Brand Admin, Regional Manager, Location Operator). | Platform-wide |
| ROI | Return on Investment. In Ignition's context: how much revenue was generated relative to how much was spent on marketing. | ROI Reporting |
| Rooftop | Automotive term for a single dealership location. A dealer group might have 20 "rooftops." | Automotive vertical |
| Through-Channel Marketing | Marketing that flows through multiple levels of an organization — from brand HQ through regional managers to local operators and their end customers. Ignition serves the entire channel, not just one level. | Platform positioning |
| VDP | Vehicle Detail Page. The webpage showing a specific vehicle's details on a dealer website. VDP views are a key automotive marketing metric. | Automotive vertical |

Additional terms should be added as the site evolves. The glossary should be treated as a living reference.

---

## Appendix A: Page Dependency Map

This shows which pages reference other pages, useful for internal linking during implementation.

```
Home → all capability pages, all section landing pages
/platform → /platform/how-it-works, /capabilities
/platform/how-it-works → /capabilities (phase descriptions)
/platform/why-ignition → /competitive, /capabilities/roi-reporting, /capabilities/iggy-ai
/capabilities → all 7 capability detail pages
/capabilities/roi-reporting → /capabilities/iggy-ai (natural upsell)
/capabilities/iggy-ai → /capabilities/roi-reporting (data source)
/capabilities/ai-creative → /capabilities/roi-reporting (combined value)
/capabilities/cdp → /capabilities/roi-reporting, /capabilities/automation
/capabilities/campaigns → /capabilities/cdp, /capabilities/roi-reporting
/capabilities/brand-hub → /capabilities/campaigns, /capabilities/ai-creative
/capabilities/automation → /capabilities/cdp, /capabilities/brand-hub
/verticals/* → /capabilities/roi-reporting, /capabilities/iggy-ai (proof points)
/competitive → /capabilities/roi-reporting, /capabilities/iggy-ai (proof points)
/resources/demo-guide → /capabilities/roi-reporting, /capabilities/iggy-ai (demo flow)
/resources/glossary → standalone (referenced from all pages)
/resources/faq → /competitive, /capabilities, /resources/demo-guide
```

---

## Appendix B: Implementation Notes for the Builder

### Page Architecture

- All pages are fully static TSX components in Next.js
- No markdown rendering pipeline needed — all content is hardcoded in JSX
- Each page is a standalone TSX file at its route path under `src/app/(authenticated)/`
- Example: `/capabilities/roi-reporting` → `src/app/(authenticated)/capabilities/roi-reporting/page.tsx`

### Navigation Implementation

- Replace the current SUMMARY.md-driven nav with a hardcoded nav config (e.g., `src/config/navigation.ts`)
- The config exports an array of sections, each with items that have: label, path, and optional status badge
- The Sidebar component reads from this config instead of parsing SUMMARY.md

### Content Pattern

Each page TSX file should follow a consistent structure:
1. Status banner (for capability pages)
2. H1 headline
3. Subheadline
4. Content sections with H2 headings
5. Internal links to related pages (bottom of page or contextual)

### What to Keep from the Current Site

- **Authentication system** — password login stays as-is
- **AppShell layout** — sidebar + main content area pattern
- **Brand colors** — teal (#38C6F4), red (#EF462F) accents
- **Responsive layout** — mobile menu pattern

### What to Remove

- SUMMARY.md parsing logic
- Markdown rendering pipeline (DocumentRenderer, etc.)
- Content sync from external repos
- Category/slug routing (`[...slug]`, `category/[key]`)
- All existing markdown content files

---

*Content plan prepared by PM-A for the Ignition Knowledge Base content rebuild pipeline.*

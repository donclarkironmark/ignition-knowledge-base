import type { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, Sparkles, Presentation, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CapabilityCard } from '@/components/ui/CapabilityCard';
import { QuickLinkCard } from '@/components/ui/QuickLinkCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Home' };

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Ignition Insider"
        subtitle="Everything you need to understand, explain, and sell Ironmark's AI-powered distributed marketing platform."
      />

      {/* Hero sentence + CTAs */}
      <p className="text-base text-brand-gray leading-relaxed mb-6 max-w-3xl">
        Ignition turns marketing spend into measurable revenue for multi-location brands. Reporting,
        AI insights, and creative automation that compound — each capability shipped builds on the
        last. Use this site to learn the platform, prepare for customer conversations, and stay
        current on what&apos;s live and what&apos;s next.
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        <Link
          href="/insider"
          className="inline-flex items-center rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Today&apos;s Intel
        </Link>
        <Link
          href="/capabilities/roi-reporting"
          className="inline-flex items-center rounded-md border border-brand-cyan text-brand-cyan px-5 py-2.5 text-sm font-semibold hover:bg-brand-cyan/5 transition-colors"
        >
          See What&apos;s Live
        </Link>
      </div>

      {/* Roadmap */}
      <SectionHeading>Roadmap at a glance</SectionHeading>
      <p className="text-sm text-brand-gray mb-6 max-w-3xl">
        Three compounding phases. Reporting feeds AI. AI feeds creative. Creative feeds campaigns.
        Campaigns feed automation. Each phase makes the next one stronger.
      </p>
      <div className="space-y-4 mb-12">
        {ROADMAP_PHASES.map((phase) => (
          <div
            key={phase.label}
            className={`rounded-lg border bg-white p-5 ${phase.borderClass}`}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
              <h3 className="text-base font-semibold text-foreground">{phase.label}</h3>
              <span className={`text-xs font-semibold uppercase tracking-wider ${phase.tagClass}`}>
                {phase.tag}
              </span>
              <span className="text-xs text-brand-gray">{phase.timeframe}</span>
            </div>
            <p className="text-sm text-brand-gray leading-relaxed mb-3">{phase.summary}</p>
            <ul className="text-sm text-brand-gray space-y-1">
              {phase.themes.map((theme) => (
                <li key={theme} className="flex gap-2">
                  <span className={`shrink-0 ${phase.tagClass}`}>&#8226;</span>
                  <span>{theme}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Capability Status */}
      <SectionHeading>Capability status</SectionHeading>
      <p className="text-sm text-brand-gray mb-4">
        Seven capability themes. Click any card to drop into the deep-dive page.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <CapabilityCard
          title="ROI-Based Reporting"
          description="Unified dashboards connecting marketing spend to revenue at the location level."
          status="live"
          href="/capabilities/roi-reporting"
        />
        <CapabilityCard
          title="Iggy AI Insights"
          description="Conversational AI that surfaces problems and recommends actions from live campaign data."
          status="live"
          href="/capabilities/iggy-ai"
        />
        <CapabilityCard
          title="Campaign Management"
          description="Print and digital orchestrated from one platform with unified attribution."
          status="phase2"
          href="/capabilities/campaign-management"
        />
        <CapabilityCard
          title="Dynamic AI Creative"
          description="AI-generated, brand-compliant creative localized for each location. Active development."
          status="phase2"
          href="/capabilities/dynamic-ai-creative"
        />
        <CapabilityCard
          title="CDP & Audience Builder"
          description="Unified customer data across CRM, POS, web, and ad platforms — turned into activated audiences."
          status="phase2"
          href="/capabilities/cdp"
        />
        <CapabilityCard
          title="Distributed Marketing / DAM"
          description="The front door for local operators — programs, co-op funds, brand-safe templates, asset library."
          status="phase3"
          href="/capabilities/marketing-hub"
        />
        <CapabilityCard
          title="Full-funnel & Automation"
          description="Trigger-based workflows, lead nurturing, and conversion optimization."
          status="phase3"
          href="/capabilities/full-funnel-automation"
        />
      </div>

      {/* Quick Links */}
      <SectionHeading>Quick links</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <QuickLinkCard
          title="Intel & Insights Feed"
          description="Live competitive intelligence — competitor moves, category shifts, and weekly editions for the team."
          href="/insider"
          icon={<Newspaper className="w-6 h-6" />}
        />
        <QuickLinkCard
          title="Iggy AI Insights Agent"
          description="The AI that reasons over live campaign data — proactive alerts, conversational Q&A, and visual reports on demand."
          href="/capabilities/iggy-ai"
          icon={<Sparkles className="w-6 h-6" />}
        />
        <QuickLinkCard
          title="Demo Guide"
          description="How to show Ignition effectively — recommended flow, key talking points, and common questions."
          href="/demo-guide"
          icon={<Presentation className="w-6 h-6" />}
        />
        <QuickLinkCard
          title="Help Guides"
          description="Internal team playbooks — using Ignition Insider, demo walkthroughs, and the admin how-to."
          href="/resources/help-guides"
          icon={<BookOpen className="w-6 h-6" />}
        />
      </div>
    </>
  );
}

const ROADMAP_PHASES = [
  {
    label: 'Phase 1 — Build & Launch',
    tag: 'In market',
    tagClass: 'text-emerald-600',
    borderClass: 'border-brand-border border-l-4 border-l-emerald-500',
    timeframe: 'Q4 2025 – Q4 2026',
    summary:
      'The foundation: visibility into spend and revenue, plus AI that turns that data into action. Two capabilities are live in production today; a third is in active development.',
    themes: [
      'ROI-Based Reporting — live',
      'Iggy AI Insights Agent — live',
      'Dynamic AI Creative — in development',
    ],
  },
  {
    label: 'Phase 2 — Expand & Validate',
    tag: 'Next',
    tagClass: 'text-amber-600',
    borderClass: 'border-brand-border border-l-4 border-l-amber-400',
    timeframe: 'Q3 2026 – Q4 2026',
    summary:
      'Activation. Reporting becomes a data asset; insights become campaigns. Switching costs start to compound as customer data and audience segments accumulate inside Ignition.',
    themes: [
      'Campaign Management',
      'CDP & Audience Builder',
    ],
  },
  {
    label: 'Phase 3 — Scale & Embed',
    tag: 'Later',
    tagClass: 'text-gray-500',
    borderClass: 'border-brand-border border-l-4 border-l-gray-400',
    timeframe: '2027+',
    summary:
      'Operating system. Ignition becomes the daily marketing workspace for the brand and its local operators — the front door, the funnel, and the automation engine.',
    themes: [
      'Distributed Marketing / DAM',
      'Full-funnel & Automation',
    ],
  },
];

import type { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, Swords, Presentation, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CapabilityCard } from '@/components/ui/CapabilityCard';
import { QuickLinkCard } from '@/components/ui/QuickLinkCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Home' };

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Ignition Knowledge Base"
        subtitle="Everything you need to understand, explain, and sell Ironmark's AI-powered distributed marketing platform."
      />

      {/* Hero sentence + CTAs */}
      <p className="text-base text-brand-gray leading-relaxed mb-6 max-w-3xl">
        Ignition connects brand strategy to local execution for multilocation brands — and
        proves it works with real revenue data. Use this site to learn the platform, prepare
        for customer conversations, and stay current on what&apos;s live and what&apos;s
        coming.
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        <Link
          href="/insider"
          className="inline-flex items-center rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Today&apos;s Intel
        </Link>
        <Link
          href="/capabilities"
          className="inline-flex items-center rounded-md border border-brand-cyan text-brand-cyan px-5 py-2.5 text-sm font-semibold hover:bg-brand-cyan/5 transition-colors"
        >
          See What&apos;s Live
        </Link>
      </div>

      {/* What's New */}
      <SectionHeading>What&apos;s New</SectionHeading>
      <div className="mb-12 space-y-4">
        {WHATS_NEW.map((entry) => (
          <div
            key={entry.title}
            className="flex gap-4 rounded-lg border border-brand-border bg-white px-5 py-4"
          >
            <span className="shrink-0 text-xs font-medium text-brand-gray whitespace-nowrap pt-0.5">
              {entry.date}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{entry.title}</p>
              <p className="text-sm text-brand-gray mt-0.5">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Status Dashboard */}
      <SectionHeading>Platform Status</SectionHeading>
      <p className="text-sm text-brand-gray mb-4">
        Seven capability themes across three compounding phases. Here&apos;s where
        everything stands today.
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
          title="Dynamic AI Creative"
          description="AI-generated, brand-compliant creative assets localized for each location."
          status="phase2"
          href="/capabilities#phase-2"
        />
        <CapabilityCard
          title="Customer Data Platform"
          description="Unified customer data from CRM, POS, web analytics, and ad platforms."
          status="phase2"
          href="/capabilities#phase-2"
        />
        <CapabilityCard
          title="Campaign Management"
          description="Print and digital campaigns orchestrated from one platform with unified attribution."
          status="phase2"
          href="/capabilities#phase-2"
        />
        <CapabilityCard
          title="Marketing Hub"
          description="The front door for local operators — curated programs, co-op funds, and brand-safe templates."
          status="phase3"
          href="/capabilities#phase-3"
        />
        <CapabilityCard
          title="Full-Funnel Automation"
          description="Trigger-based workflows, lead nurturing, and conversion optimization."
          status="phase3"
          href="/capabilities#phase-3"
        />
      </div>

      {/* Quick Links */}
      <SectionHeading>Quick Links</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <QuickLinkCard
          title="Intel & Insights Feed"
          description="Live competitive intelligence — competitor moves, category shifts, and weekly editions for the team."
          href="/insider"
          icon={<Newspaper className="w-6 h-6" />}
        />
        <QuickLinkCard
          title="Competitive Positioning"
          description="Head-to-head comparisons, capability matrix, and talk tracks for common competitive situations."
          href="/capabilities/competitive"
          icon={<Swords className="w-6 h-6" />}
        />
        <QuickLinkCard
          title="Demo Guide"
          description="How to show Ignition effectively — recommended flow, key talking points, and common questions."
          href="/demo-guide"
          icon={<Presentation className="w-6 h-6" />}
        />
        <QuickLinkCard
          title="Help Guides"
          description="Internal team playbooks — using this KB, demo walkthroughs, and the Insider admin how-to."
          href="/resources/help-guides"
          icon={<BookOpen className="w-6 h-6" />}
        />
      </div>
    </>
  );
}

const WHATS_NEW = [
  {
    date: 'Feb 2026',
    title: 'The Joint Chiropractic goes live on ROI Reporting',
    description:
      '900+ clinic locations now running on Ignition with daily campaign performance data and real revenue attribution.',
  },
  {
    date: 'Feb 2026',
    title: 'Iggy Notebook launches',
    description:
      'Ask natural language questions and get visual reports with metrics, charts, tables, and insights — saveable and PDF-exportable.',
  },
  {
    date: 'Mar 2026',
    title: "Domino's onboarding begins",
    description:
      'First QSR customer enters onboarding. QSR-specific campaign kits designed for the platform.',
  },
  {
    date: 'Mar 2026',
    title: 'Knowledge Base launched',
    description:
      'Your internal guide to understanding, explaining, and selling Ignition. You\'re looking at it right now.',
  },
];

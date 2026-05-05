import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'ROI-Based Reporting' };

// Supabase-backed pages elsewhere are dynamic; static capability pages can prerender.

export default function RoiReportingPage() {
  return (
    <>
      <PageHeader
        title="ROI-Based Reporting"
        subtitle="See exactly which locations are making money from marketing — and which aren't."
        status="live"
      />

      {/* Section A: Problem */}
      <SectionHeading>Marketing spend without marketing proof</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Multi-location brands spend heavily on marketing, but most cannot connect that spend
        to revenue at the location level. The monthly PDF from the agency shows impressions
        and clicks — not business outcomes. Everything is aggregated at the brand level, so
        nobody can identify which locations are driving returns and which are wasting budget.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        The basic question goes unanswered: <strong className="text-foreground">&ldquo;Is
        this marketing actually working?&rdquo;</strong> Without location-level revenue
        data, the answer is always a guess.
      </p>

      {/* Section B: What It Does */}
      <SectionHeading>Unified dashboards connecting spend to revenue</SectionHeading>
      <div className="space-y-5 mb-8">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-brand-border bg-white p-5">
            <h3 className="text-base font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-sm text-brand-gray leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Section C: Who It's For */}
      <SectionHeading>Built for the people asking &ldquo;is it working?&rdquo;</SectionHeading>
      <ul className="space-y-3 mb-6 text-sm text-brand-gray">
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold shrink-0">&#8226;</span>
          <span><strong className="text-foreground">Brand CMOs and VPs of Marketing</strong> who need to justify spend to the board with real revenue numbers, not engagement metrics</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold shrink-0">&#8226;</span>
          <span><strong className="text-foreground">Regional marketing managers</strong> tracking performance across their territory and identifying which locations need attention</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold shrink-0">&#8226;</span>
          <span><strong className="text-foreground">Franchise and multi-unit operators</strong> who want to know if marketing dollars are paying off at their specific location</span>
        </li>
      </ul>
      <p className="text-sm text-brand-gray leading-relaxed mb-6">
        The common thread: everyone asking &ldquo;am I making money from marketing?&rdquo;
        ROI Reporting gives them the answer with real data, not approximations.
      </p>

      {/* Section D: Strategic Role */}
      <SectionHeading>The entry point to the platform</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        ROI Reporting is fast to deploy and delivers immediate, visible value. There is no
        lengthy integration timeline — data ingestion from ad platforms is automated, and
        dashboards are available from day one.
      </p>
      <p className="text-brand-gray leading-relaxed mb-4">
        Once reporting lives in Ignition, switching costs increase. The data history, the
        benchmarks, the location-level insights — all of it compounds over time. ROI
        Reporting opens the upsell path to Iggy AI, then to Dynamic AI Creative, then to
        the full platform.
      </p>
      <p className="text-sm text-brand-gray leading-relaxed mb-8 italic">
        Think of it as the entry point: easy to sell, fast to deploy, and the foundation
        everything else builds on.
      </p>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/iggy-ai">See how Iggy turns dashboard data into actionable insights</InternalLink>
        <InternalLink href="/resources/competitive">How ROI Reporting compares to alternatives</InternalLink>
        <InternalLink href="/insider">Latest competitive intel on the reporting category</InternalLink>
      </div>
    </>
  );
}

const FEATURES = [
  {
    title: 'Automated Data Ingestion',
    description:
      'Google, Meta, TikTok, and LinkedIn data pulled in automatically. No spreadsheets, no manual exports, no waiting for someone to update a report. The data is there when you need it.',
  },
  {
    title: 'Closed-Loop Attribution',
    description:
      'Not just clicks or impressions. Ignition connects upstream ad spend to downstream CRM and POS revenue. The full journey from marketing dollar to business outcome — the "closed loop" that most platforms cannot close.',
  },
  {
    title: 'Multi-Tenant Views',
    description:
      'Network, region, and individual location dashboards in one system. Brand HQ sees the whole picture. A regional manager sees their territory. A local operator sees their location. Same data, right perspective for each role.',
  },
  {
    title: 'Daily Performance Metrics',
    description:
      'Campaign performance by platform with seven timeframe options. Not monthly. Not weekly. Daily. When something changes, you see it the next morning — not in next month\'s PDF.',
  },
];

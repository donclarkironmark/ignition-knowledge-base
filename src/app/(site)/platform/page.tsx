import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'What Is Ignition' };

export default function WhatIsIgnitionPage() {
  return (
    <>
      <PageHeader
        title="What Is Ignition?"
        subtitle="The AI-powered platform that connects brand strategy to local execution — and proves it works."
      />

      {/* Section A: The Problem */}
      <SectionHeading>Multilocation marketing is broken</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Multilocation brands spend millions on marketing every year, but most of them
        cannot answer one basic question: <strong className="text-foreground">is our
        marketing actually working?</strong>
      </p>
      <p className="text-brand-gray leading-relaxed mb-4">
        Print, digital, and local execution are fragmented across multiple vendors. Data
        lives in silos — the ad platform knows about clicks, the CRM knows about leads, the
        POS knows about revenue, but nobody connects the dots. At the brand level, you get
        aggregated vanity metrics. At the location level, you get nothing.
      </p>
      <div className="rounded-lg border border-brand-border bg-brand-off-white p-5 mb-6 text-sm text-brand-gray leading-relaxed">
        <strong className="text-foreground">Picture this:</strong> A QSR brand with 400
        locations spends $2M on marketing. Their agency sends a monthly PDF with impressions
        and clicks. But nobody can tell you which locations are profitable and why. Nobody
        can tell you which campaigns drove revenue and which were wasted spend. That gap
        between spend and proof is where Ignition lives.
      </div>

      {/* Section B: What Ignition Does */}
      <SectionHeading>Ignition bridges the gap</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Ignition is Ironmark&apos;s AI-powered distributed marketing platform. It connects
        brand strategy to local execution for multilocation brands — franchise networks,
        dealer groups, healthcare systems, and distributed retail operations.
      </p>
      <ul className="space-y-3 mb-6 text-brand-gray text-sm">
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold">&#8226;</span>
          <span><strong className="text-foreground">Unified reporting</strong> connecting marketing spend to actual revenue at the individual location level</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold">&#8226;</span>
          <span><strong className="text-foreground">AI-driven insights</strong> that surface problems and recommend specific actions automatically — no waiting for monthly reports</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold">&#8226;</span>
          <span><strong className="text-foreground">Campaign tools</strong> that work across every location in the network, orchestrating both digital and print</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold">&#8226;</span>
          <span><strong className="text-foreground">Full-channel visibility</strong> for brand leaders with simplicity for local operators who are operators first, not marketers</span>
        </li>
      </ul>
      <p className="text-sm font-semibold text-foreground mb-6 italic">
        Competitors run marketing. Ignition proves it works.
      </p>

      {/* Section C: Through-Channel Model */}
      <SectionHeading>Full-channel coverage, not just one layer</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Most marketing platforms serve only one level of the organization. Analytics
        dashboards serve brand headquarters. Template libraries serve local operators.
        Ignition serves the entire channel — from brand HQ strategy and budget down through
        regional managers to local operators and their end customers.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {CHANNEL_LEVELS.map((level) => (
          <div key={level.name} className="rounded-lg border border-brand-border bg-white p-4">
            <p className="text-sm font-semibold text-brand-cyan mb-1">{level.name}</p>
            <p className="text-sm text-brand-gray">{level.description}</p>
          </div>
        ))}
      </div>

      {/* Section D: Transformation Story */}
      <SectionHeading>From marketing vendor to platform company</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Ironmark has operated as a marketing services provider for over 30 years, serving
        enterprise brands with print production, direct mail, creative services, and
        campaign execution. The company already sits inside the marketing operations of
        multilocation brands — producing their materials, managing their campaigns, handling
        their data.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        Ignition adds an intelligence layer on top of these existing relationships. We are
        not starting from scratch. We are adding technology to trusted relationships that
        already generate value. That foundation of trust is something no pure-tech competitor
        can replicate.
      </p>

      {/* Section E: Three Phases */}
      <SectionHeading>Intelligence, Activation, Automation</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Ignition is built in three compounding phases. Each phase builds on the last —
        reporting feeds AI, AI feeds creative, creative feeds campaigns, campaigns feed
        automation.
      </p>
      <div className="space-y-4 mb-8">
        {PHASES.map((phase) => (
          <div key={phase.name} className={`rounded-lg border-l-4 ${phase.borderColor} border border-brand-border bg-white p-5`}>
            <p className="text-sm font-semibold text-foreground mb-1">{phase.name}</p>
            <p className="text-sm text-brand-gray">{phase.description}</p>
            <p className="text-xs text-brand-gray mt-2 italic">{phase.status}</p>
          </div>
        ))}
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities">See all platform capabilities</InternalLink>
        <InternalLink href="/capabilities/roi-reporting">ROI Reporting details</InternalLink>
        <InternalLink href="/capabilities/iggy-ai">Meet Iggy AI</InternalLink>
        <InternalLink href="/platform/why-ignition">What makes Ignition different</InternalLink>
      </div>
    </>
  );
}

const CHANNEL_LEVELS = [
  {
    name: 'Brand HQ',
    description:
      'Network-level dashboards, campaign performance across all locations, AI-powered anomaly detection, and compliance tools.',
  },
  {
    name: 'Regional Managers',
    description:
      'Location benchmarking, performance alerts, and team activity monitoring across their territory.',
  },
  {
    name: 'Local Operators',
    description:
      'Pre-built campaign kits, AI-generated creative, co-op fund access, and simple dashboards focused on their location.',
  },
  {
    name: 'End Customers',
    description:
      'Localized, brand-compliant marketing that reaches the right audience in the right channel at the right time.',
  },
];

const PHASES = [
  {
    name: 'Phase 1 — Intelligence',
    description:
      'See what is happening. ROI-Based Reporting and Iggy AI give you visibility into campaign performance and location-level revenue attribution.',
    status: 'Live today — ROI Reporting and Iggy AI are in production.',
    borderColor: 'border-l-emerald-500',
  },
  {
    name: 'Phase 2 — Activation',
    description:
      'Turn insight into action. Dynamic AI Creative, Customer Data Platform, and Omni-Channel Campaign Management convert intelligence into execution.',
    status: 'In development — capabilities building on the intelligence foundation.',
    borderColor: 'border-l-amber-400',
  },
  {
    name: 'Phase 3 — Automation',
    description:
      'Embed into daily operations. The Distributed Marketing Hub and Full-Funnel Automation make Ignition the operating system for the brand\'s marketing function.',
    status: 'Planned — the final compounding layer.',
    borderColor: 'border-l-gray-400',
  },
];

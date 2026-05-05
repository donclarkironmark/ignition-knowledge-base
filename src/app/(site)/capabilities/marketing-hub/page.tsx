import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Distributed Marketing / DAM' };

export default function MarketingHubPage() {
  return (
    <>
      <PageHeader
        title="Distributed Marketing / DAM"
        subtitle="The front door for local operators — programs, co-op funds, brand-safe templates, AI recommendations, and the brand asset library that powers it all."
        status="roadmap"
      />

      {/* Section A: Problem */}
      <SectionHeading>Local operators are operators first, marketers never</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        The franchisee, the dealership manager, the clinic owner — the person actually running
        the location — is not a marketer. They&apos;re busy running a business. When brand HQ
        ships a portal full of templates, ads, and approval workflows, most local operators
        ignore it. Adoption stays low; consistency suffers; the network underperforms its
        potential.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        The Marketing Hub is built around the local operator&apos;s actual day. Mobile-first
        because they&apos;re not at a desk. AI-recommended because they shouldn&apos;t have to
        figure out what to run. Co-op funds visible upfront because money is the only thing
        that reliably drives action.
      </p>

      {/* Section B: What It Does */}
      <SectionHeading>Designed for adoption, not just availability</SectionHeading>
      <div className="space-y-5 mb-8">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-brand-border bg-white p-5">
            <h3 className="text-base font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-sm text-brand-gray leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Section C: Strategic Role */}
      <SectionHeading>From platform to operating system</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Phase 1 and 2 build the brand-side platform: reporting, AI, creative, data, campaigns.
        Phase 3 brings the local operator into the same workspace. When franchisees and local
        managers spend their workday inside Ignition — checking what to run, claiming co-op
        funds, downloading approved assets — Ignition becomes the operating system for the
        brand&apos;s local marketing function.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        This is where the network effect compounds. Brand HQ benefits from local-operator
        adoption; local operators benefit from brand-funded programs; the platform learns from
        every interaction. Pure-digital DMPs without distributed marketing roots can&apos;t
        replicate this layer.
      </p>

      {/* Status callout */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-1">Phase 3 — 2027 and beyond</p>
        <p className="text-sm text-gray-600">
          Marketing Hub is committed on the roadmap but is not in active development.
          Position with prospects as part of the platform vision, not a near-term capability.
          Specifics will firm up as Phase 2 capabilities ship.
        </p>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/campaign-management">The campaigns local operators run</InternalLink>
        <InternalLink href="/capabilities/full-funnel-automation">The automation layer for local operations</InternalLink>
        <InternalLink href="/insider">Latest intel on co-op portals and partner-marketing tools</InternalLink>
      </div>
    </>
  );
}

const FEATURES = [
  {
    title: 'Program & Package Catalog',
    description:
      'Curated, brand-approved campaign packages: pick one, localize it, launch it. The local operator never picks creative, audience, or channel mix from scratch — those are brand-safe defaults.',
  },
  {
    title: 'AI Recommendation Engine',
    description:
      'Iggy recommends the next program based on the location\'s performance gaps, co-op fund balance, and seasonal factors. "Run this program, with these dollars, this week" — not a menu of options.',
  },
  {
    title: 'Co-op Fund Management',
    description:
      'Eligibility checks, claims workflow, proof-of-performance, balance tracking. The friction that kills co-op program adoption — invoices, approvals, paperwork — handled inline.',
  },
  {
    title: 'Brand Asset Repository',
    description:
      'Approved assets with template locks: logo placement, color systems, font usage, required disclaimers all enforced. Brand consistency at the asset level, not just the policy level.',
  },
  {
    title: 'Mobile-First',
    description:
      'Most local operators are not at a desk. The Hub is built for the phone in their pocket — quick check-in, quick claim, quick approval.',
  },
];

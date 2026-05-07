import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Campaign Management' };

export default function CampaignManagementPage() {
  return (
    <>
      <PageHeader
        title="Campaign Management"
        subtitle="Print and digital orchestrated from one platform with unified attribution."
        status="phase2"
      />

      {/* Section A: Problem */}
      <SectionHeading>Channels managed in silos, attribution managed in spreadsheets</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Most distributed brands manage paid social in one tool, search in another, email in a
        third, and direct mail in spreadsheets. The brand can&apos;t see the full mix in one
        place; locations can&apos;t coordinate channel timing; agencies stitch reporting
        together monthly. Every channel optimizes itself. Nobody optimizes the customer.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        Campaign Management collapses the orchestration layer into one workspace,
        with the data layer (CDP) feeding audiences and the reporting layer measuring outcomes
        — across paid digital, owned channels, and physical mail.
      </p>

      {/* Section B: What It Does */}
      <SectionHeading>Campaign kits, unified inventory, AI rules</SectionHeading>
      <div className="space-y-5 mb-8">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-brand-border bg-white p-5">
            <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-sm text-brand-gray leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Section C: Strategic Role */}
      <SectionHeading>The unfair advantage: print + digital in one platform</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Most distributed marketing platforms are pure-digital — they can&apos;t touch direct
        mail, in-store collateral, or printed neighborhood drops. Ironmark&apos;s production
        heritage means Ignition treats print as a first-class channel: same audience targeting,
        same attribution, same campaign workspace.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        For verticals where the customer journey crosses physical and digital — automotive,
        financial services, multi-unit franchises — this is the wedge. Pure-digital DMPs cannot
        match it.
      </p>

      {/* Status callout */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 mb-8">
        <p className="text-sm font-semibold text-amber-800 mb-1">Phase 2 — backlog</p>
        <p className="text-sm text-amber-700">
          Campaign Management depends on the CDP being live. Both are Phase 2; campaign work
          starts after the data layer is in production. Position with prospects as the
          near-term complement to ROI Reporting and Dynamic AI Creative.
        </p>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/cdp">The audience layer that feeds campaigns</InternalLink>
        <InternalLink href="/capabilities/dynamic-ai-creative">The creative engine that produces the assets</InternalLink>
        <InternalLink href="/capabilities/full-funnel-automation">Where campaigns become triggered workflows</InternalLink>
      </div>
    </>
  );
}

const FEATURES = [
  {
    title: 'Campaign Kits',
    description:
      'Pre-configured packages with channel mix, creative templates, audience targeting, and budget defaults — proven combinations that any brand or local operator can launch with one click.',
  },
  {
    title: 'Unified Campaign Inventory',
    description:
      'Google Ads, Meta, LinkedIn, TikTok, programmatic display, email, SMS, direct mail, in-store print — all visible in a single inventory view. One workspace, every channel.',
  },
  {
    title: 'CDP-Powered Targeting',
    description:
      'Pull audiences directly from CDP segments. No re-uploading lists per channel; no audience drift between platforms; no rebuilding for every campaign.',
  },
  {
    title: 'AI Automation Rules',
    description:
      'Bid adjustments, budget reallocation between channels, creative rotation — driven by Iggy\'s reasoning over live performance data. Manual intervention for the choices that matter; automated execution for the rest.',
  },
  {
    title: 'Cross-Channel Attribution',
    description:
      'Spend across every channel attributed to the same revenue outcome. The "did Facebook or Google get the credit?" debate disappears — Ignition sees the whole journey.',
  },
];

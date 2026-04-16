import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CapabilityCard } from '@/components/ui/CapabilityCard';
import { InternalLink } from '@/components/ui/InternalLink';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const metadata: Metadata = { title: 'Platform Capabilities' };

export default function CapabilitiesOverviewPage() {
  return (
    <>
      <PageHeader
        title="Platform Capabilities"
        subtitle="Seven capability themes, three compounding phases — from visibility to intelligence to automation."
      />

      {/* Section A: Three Phases */}
      <SectionHeading>Each phase compounds on the last</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Ignition is not a single product release. It is a phased platform where each layer
        builds on the previous one. Reporting feeds AI. AI feeds creative. Creative feeds
        campaigns. Campaigns feed automation. The result is a compounding intelligence system
        that gets more valuable with every customer and every data point.
      </p>
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2 text-sm">
          <StatusBadge status="live" size="md" /> Intelligence — live today
        </div>
        <div className="flex items-center gap-2 text-sm">
          <StatusBadge status="phase2" size="md" /> Activation — in development
        </div>
        <div className="flex items-center gap-2 text-sm">
          <StatusBadge status="phase3" size="md" /> Automation — planned
        </div>
      </div>

      {/* Section B: Live Capabilities */}
      <SectionHeading>What&apos;s live today</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Two capabilities are in production and serving customers. The Joint Chiropractic
        runs on Ignition today across 900+ locations.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <CapabilityCard
          title="ROI-Based Reporting"
          description="Unified dashboards connecting marketing spend to revenue at the location level. Automated data ingestion from Google, Meta, TikTok, and LinkedIn. Daily performance metrics with multi-tenant views."
          status="live"
          href="/capabilities/roi-reporting"
        />
        <CapabilityCard
          title="Iggy AI Insights Agent"
          description="Conversational AI that proactively surfaces issues, answers natural language questions, and recommends actions from live campaign data. Includes the Iggy Notebook for visual reporting."
          status="live"
          href="/capabilities/iggy-ai"
        />
      </div>

      {/* Section C: Phase 2 */}
      <div id="phase-2">
        <SectionHeading>Phase 2 — Activation</SectionHeading>
        <p className="text-brand-gray leading-relaxed mb-4">
          Phase 2 turns intelligence into action. These capabilities are in development and
          build directly on the reporting and AI foundation that is live today.
        </p>
        <div className="space-y-6 mb-10">
          {PHASE_2_CAPABILITIES.map((cap) => (
            <div key={cap.title} className="rounded-lg border border-brand-border border-l-4 border-l-amber-400 bg-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground">{cap.title}</h3>
                <StatusBadge status="phase2" size="sm" />
              </div>
              <p className="text-sm text-brand-gray leading-relaxed mb-3">{cap.summary}</p>
              <ul className="space-y-1.5 text-sm text-brand-gray mb-3">
                {cap.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-amber-400 font-bold shrink-0">&#8226;</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-brand-gray italic">
                Full details, proof points, and use cases will be added when this capability launches.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section D: Phase 3 */}
      <div id="phase-3">
        <SectionHeading>Phase 3 — Automation</SectionHeading>
        <p className="text-brand-gray leading-relaxed mb-4">
          Phase 3 embeds Ignition into daily marketing operations. Once automation is live,
          Ignition becomes the operating system for the brand&apos;s marketing function.
        </p>
        <div className="space-y-6 mb-8">
          {PHASE_3_CAPABILITIES.map((cap) => (
            <div key={cap.title} className="rounded-lg border border-brand-border border-l-4 border-l-gray-400 bg-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground">{cap.title}</h3>
                <StatusBadge status="phase3" size="sm" />
              </div>
              <p className="text-sm text-brand-gray leading-relaxed mb-3">{cap.summary}</p>
              <ul className="space-y-1.5 text-sm text-brand-gray mb-3">
                {cap.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-gray-400 font-bold shrink-0">&#8226;</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-brand-gray italic">
                Full details, proof points, and use cases will be added when this capability launches.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/roi-reporting">ROI Reporting deep-dive</InternalLink>
        <InternalLink href="/capabilities/iggy-ai">Iggy AI deep-dive</InternalLink>
        <InternalLink href="/platform">Learn the full Ignition story</InternalLink>
      </div>
    </>
  );
}

const PHASE_2_CAPABILITIES = [
  {
    title: 'Dynamic AI Creative',
    summary:
      'AI-generated, brand-compliant creative assets localized automatically for each location.',
    bullets: [
      'Content generated within brand guidelines — tone, style, disclaimers enforced as hard constraints',
      'Multi-format output: social posts, email copy, ad headlines, direct mail, landing pages',
      'Localized variations automatically generated with address, phone, local offers, and regional messaging',
      'Three different customers in three different verticals independently requested this capability',
    ],
  },
  {
    title: 'Customer Data Platform (CDP)',
    summary:
      'Unified customer data from CRM, POS, web analytics, and ad platforms — turning fragmented data into a precision targeting asset.',
    bullets: [
      'Identity resolution, hierarchy mapping, and predictive segmentation from unified data sources',
      'Segment activation across channels: email/SMS (94% match), paid media (87%), direct mail (98%)',
      'The CDP makes data an appreciating asset — more data flowing through Ignition increases switching costs',
    ],
  },
  {
    title: 'Omni-Channel Campaign Management',
    summary:
      'Print and digital campaigns orchestrated from one platform with unified attribution.',
    bullets: [
      'Campaign kits and libraries: pre-configured packages with channel mix, creative templates, targeting, and budgets',
      'Unified campaign inventory across Google, Meta, LinkedIn, direct mail — all in one view',
      "Ironmark's print production heritage is the unfair advantage — no pure-digital DMP can match this",
    ],
  },
];

const PHASE_3_CAPABILITIES = [
  {
    title: 'Distributed Marketing Hub & Brand Assets',
    summary:
      'The front door for local operators — curated programs, co-op fund management, brand-safe templates, and AI recommendations.',
    bullets: [
      'Program catalog with AI-powered recommendations based on performance gaps and co-op eligibility',
      'Co-op and fund management: eligibility checks, claims workflow, proof-of-performance',
      'Mobile-first design for franchisees and local operators who are operators first and marketers never',
    ],
  },
  {
    title: 'Full-Funnel Marketing Automation',
    summary:
      'Trigger-based workflows, lead nurturing, and conversion optimization embedded into daily operations.',
    bullets: [
      'Visual journey builder with drag-and-drop workflow designer',
      'Pre-defined drip and nurture playbooks for new leads, abandoned bookings, and win-back campaigns',
      'AI lead capture chatbot, call tracking, and appointment schedulers',
      'The final lock-in — once Ignition manages the complete workflow, it becomes the operating system for marketing',
    ],
  },
];

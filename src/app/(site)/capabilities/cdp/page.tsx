import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Customer Data Platform' };

export default function CdpPage() {
  return (
    <>
      <PageHeader
        title="Customer Data Platform"
        subtitle="Unified customer data from every system that touches a buyer — turned into an audience asset."
        status="phase2"
      />

      {/* Section A: Problem */}
      <SectionHeading>The data exists. It&apos;s just everywhere.</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Every distributed brand already has the raw material for precision marketing — CRM
        records, POS transactions, web analytics, ad-platform audiences, email lists, loyalty
        programs. None of it is connected. The CRM doesn&apos;t know what the POS knows. The
        ad platforms don&apos;t know what the CRM knows. Marketing flies blind despite owning
        the most valuable thing it could possibly own: the customer history.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        Without a CDP, every campaign starts cold. Every audience is rebuilt by hand. Every
        new channel inherits zero context. The data has potential energy but no kinetic energy.
      </p>

      {/* Section B: What It Does */}
      <SectionHeading>From fragmented data to activated audience</SectionHeading>
      <div className="space-y-5 mb-8">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-brand-border bg-white p-5">
            <h3 className="text-base font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-sm text-brand-gray leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Section C: Strategic Role */}
      <SectionHeading>The data gravity moat</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        The reporting layer makes Ignition useful. The CDP makes Ignition expensive to leave.
        Once a brand&apos;s unified customer data lives in Ignition — segments, predictive
        models, identity graphs, source-of-truth lookups — the cost of replacing the platform
        isn&apos;t the software, it&apos;s the asset that has accumulated inside it.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        This is the layer where Ignition stops being a reporting tool and starts being a system
        of record. The data appreciates. The model gets sharper with every campaign. Switching
        means starting over.
      </p>

      {/* Status callout */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 mb-8">
        <p className="text-sm font-semibold text-amber-800 mb-1">Phase 2 — backlog</p>
        <p className="text-sm text-amber-700">
          CDP development begins after the Phase 1 capabilities are stable across the MVP
          cohort. Use directional language with prospects: &ldquo;coming on the platform,&rdquo;
          not a near-term demo. The roadmap commitment is firm; the timing is not yet quarter-
          specific.
        </p>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/roi-reporting">The reporting foundation the CDP builds on</InternalLink>
        <InternalLink href="/capabilities/campaign-management">How the CDP feeds Omni-Channel Campaigns</InternalLink>
        <InternalLink href="/resources/competitive">How a real CDP differs from a "data warehouse"</InternalLink>
      </div>
    </>
  );
}

const FEATURES = [
  {
    title: 'Unified Data Ingestion',
    description:
      'Ad platforms, GA4, CRM, POS, manual CSVs, even print response cards — every customer-touching source merged into a single profile with consistent identity.',
  },
  {
    title: 'Identity Resolution',
    description:
      'Same customer across email, phone, device IDs, loyalty number, and household — resolved to one person without manual stitching. The foundation everything downstream depends on.',
  },
  {
    title: 'Predictive Segmentation',
    description:
      'Out-of-the-box models for churn risk, upsell readiness, lifetime value tier, and lapsed-customer windows. Not just descriptive segments — segments that anticipate the next move.',
  },
  {
    title: 'Network Benchmarks',
    description:
      'Compare a brand\'s segment performance against anonymized peers in the same vertical. The platform learns more with every customer; every customer benefits from the network.',
  },
  {
    title: 'Cross-Channel Activation',
    description:
      'Push segments live to email, SMS, paid social, paid search, programmatic display, and direct mail. Build once, activate everywhere — no audience rebuilds per channel.',
  },
];

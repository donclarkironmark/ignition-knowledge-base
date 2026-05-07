import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Full-funnel & Automation' };

export default function FullFunnelAutomationPage() {
  return (
    <>
      <PageHeader
        title="Full-funnel & Automation"
        subtitle="Trigger-based workflows, lead nurturing, and conversion catalysts embedded into daily operations."
        status="roadmap"
      />

      {/* Section A: Problem */}
      <SectionHeading>Awareness without conversion is just spend</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        The earlier capabilities solve the visibility and acquisition problem: campaigns ship,
        leads come in, dashboards prove the spend was worth it. But for most distributed
        brands, the bottleneck moves downstream — from getting the lead to converting it.
        Inquiries that wait too long for a response. Bookings that never get followed up. Lapsed
        customers that nobody reactivates.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        This is the layer that closes the loop. Triggers fire from the same
        CDP that powers campaigns; workflows execute through the same
        channels that ship the creative; results feed back into the same reports. One platform,
        end to end.
      </p>

      {/* Section B: What It Does */}
      <SectionHeading>From signal to action, automated</SectionHeading>
      <div className="space-y-5 mb-8">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-brand-border bg-white p-5">
            <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-sm text-brand-gray leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Section C: Strategic Role */}
      <SectionHeading>The final lock-in</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Once Ignition manages the complete workflow — from first impression to first
        appointment to repeat purchase to win-back — it stops being a marketing platform and
        starts being the operational system for the marketing function. Switching means
        recreating not just dashboards but every workflow, every trigger, every nurture
        sequence. The cost is no longer software replacement; it&apos;s organizational change.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        This is the capability that closes the upsell ladder. ROI Reporting opens the door;
        Iggy proves the platform thinks; Dynamic AI Creative cuts the production bottleneck;
        CDP turns data into asset; Campaign Management turns asset into action; Marketing Hub
        brings local operators in; the automation layer makes the whole thing run on its own.
      </p>

      {/* Status callout */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-1">Phase 3 — 2027 and beyond</p>
        <p className="text-sm text-gray-600">
          This is the last theme on the public roadmap. It&apos;s
          directionally committed but depends on the data, creative, and campaign layers being
          mature first. Use as platform vision, not near-term scope.
        </p>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/cdp">The triggers come from the CDP</InternalLink>
        <InternalLink href="/capabilities/campaign-management">The actions execute through Campaigns</InternalLink>
        <InternalLink href="/capabilities/marketing-hub">Where local operators run the workflows</InternalLink>
      </div>
    </>
  );
}

const FEATURES = [
  {
    title: 'Trigger Framework',
    description:
      'CDP signals — segment entry, lifecycle stage change, behavior threshold, recency window — fire workflows without manual intervention. The platform reacts to customer behavior in real time.',
  },
  {
    title: 'Drip & Nurture Playbooks',
    description:
      'Pre-built sequences for the workflows every distributed brand needs: new-lead nurture, abandoned-booking recovery, post-purchase loyalty, lapsed-customer win-back. Configure once, run forever.',
  },
  {
    title: 'Visual Journey Builder',
    description:
      'Drag-and-drop workflow designer for the custom sequences brand HQ wants to own. Branching logic, wait steps, channel orchestration — without writing code.',
  },
  {
    title: 'Conversion Catalysts',
    description:
      'AI lead-capture chatbot, call tracking, appointment schedulers, click-to-message — the on-ramp tools that turn an ad click into a conversation. Native to the platform, not bolted-on integrations.',
  },
  {
    title: 'Lightweight CRM',
    description:
      'For brands without a CRM (or with one that doesn\'t talk to marketing), a built-in lead and customer record system. For brands with a CRM, sync, not replacement.',
  },
];

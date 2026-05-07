import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Dynamic AI Creative' };

export default function DynamicAiCreativePage() {
  return (
    <>
      <PageHeader
        title="Dynamic AI Creative"
        subtitle="AI-generated, brand-compliant creative localized automatically for every location."
        status="phase2"
      />

      {/* Section A: Problem */}
      <SectionHeading>One brand, hundreds of locations, one creative bottleneck</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Local marketing creative is the choke point of distributed brands. Brand HQ writes one
        national message; every location needs a localized version with the right address, the
        right hours, the right offer, and the right tone for its market. The result is a queue
        — agencies, designers, weeks of back-and-forth — for assets that lose relevance by the
        time they ship.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        Most distributed marketing tools solve this with templates. Templates work for static
        layouts but break the moment a campaign needs language tuned to a specific market or
        an offer that varies by ZIP code. Dynamic AI Creative replaces the template queue with
        a generation engine.
      </p>

      {/* Section B: What It Does */}
      <SectionHeading>Generation, not assembly</SectionHeading>
      <div className="space-y-5 mb-8">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-brand-border bg-white p-5">
            <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-sm text-brand-gray leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Section C: Brand safety */}
      <SectionHeading>Brand guardrails as hard constraints</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Every output is checked against the brand&apos;s rulebook before it can be used: tone
        of voice, required disclaimers, prohibited claims, font and color systems, logo
        treatment. The model never outputs an asset that violates a brand rule — those outputs
        are rejected and regenerated.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        Every generated asset is logged with the prompt, the brand rules applied, and the
        approver. Compliance is the audit trail.
      </p>

      {/* Section D: Strategic Role */}
      <SectionHeading>The next compounding layer</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Reporting tells you which locations are winning. Iggy tells you why. Dynamic AI
        Creative is the next step: when Iggy spots a problem at Location 12, the platform can
        generate the creative to fix it — sized, localized, and brand-compliant — without a
        single ticket to the design team.
      </p>
      <p className="text-brand-gray leading-relaxed mb-8">
        This is also the capability that opens the door to Phase 2. With AI creative as a
        proven feedback loop, the case for a CDP and orchestrated
        campaigns becomes self-evident — the platform isn&apos;t just measuring
        the work, it&apos;s producing it.
      </p>

      {/* Status callout */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 mb-8">
        <p className="text-sm font-semibold text-amber-800 mb-1">In active development</p>
        <p className="text-sm text-amber-700">
          Dynamic AI Creative is in build through 2026. Use directional language with prospects
          — this is on the near-term roadmap, not a same-day demo. For positioning talk tracks
          before launch, see the Competitive Positioning page.
        </p>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/iggy-ai">How Iggy feeds Dynamic AI Creative</InternalLink>
        <InternalLink href="/capabilities/cdp">The data layer that makes localization sharper</InternalLink>
        <InternalLink href="/insider">Latest competitive intel on the creative-tech category</InternalLink>
      </div>
    </>
  );
}

const FEATURES = [
  {
    title: 'Multi-format Output',
    description:
      'One brief, every channel: social posts, email copy, ad headlines, direct mail variants, landing-page hero copy. The same campaign, sized and worded for the medium it ships in.',
  },
  {
    title: 'Localized at Generation Time',
    description:
      'Address, phone, hours, and local offers are baked in at generation — not stamped on top of a template. Regional voice and seasonal context flex per market without manual tuning.',
  },
  {
    title: 'A/B Variants on Demand',
    description:
      'Need three creative angles for a test? Generate, ship, measure, learn. The cost of trying a new angle drops from "a week of design time" to "ten seconds and a click."',
  },
  {
    title: 'Compliance Audit Logging',
    description:
      'Every generated asset is logged with prompt, brand rules applied, and approver. Defensible audit trail for regulated verticals; visible reasoning for the brand-safety team.',
  },
];

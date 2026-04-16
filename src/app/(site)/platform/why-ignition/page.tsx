import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Why Ignition' };

export default function WhyIgnitionPage() {
  return (
    <>
      <PageHeader
        title="Why Ignition?"
        subtitle="What makes Ignition different from every other marketing platform on the market."
      />

      {/* Section A: Five differentiators */}
      <SectionHeading>Five things no competitor can match</SectionHeading>

      <div className="space-y-6 mb-10">
        {DIFFERENTIATORS.map((d, i) => (
          <div key={d.title} className="rounded-lg border border-brand-border bg-white p-5">
            <p className="text-xs font-bold text-brand-cyan mb-1">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">{d.title}</h3>
            <p className="text-sm text-brand-gray leading-relaxed">{d.description}</p>
          </div>
        ))}
      </div>

      {/* Section B: The Question */}
      <SectionHeading>
        Can you tell me which of your 300 locations are profitable — and why?
      </SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        This is the question that separates Ignition from every alternative on the market.
        Most platforms can tell you what was spent and what was clicked. Some can tell you
        how many leads came in.
      </p>
      <p className="text-brand-gray leading-relaxed mb-4">
        Ignition tells you what made money, where it happened, and why — at the individual
        location level. It connects upstream ad spend through to downstream CRM and POS
        revenue. Not just clicks. Not just leads. Revenue.
      </p>
      <p className="text-brand-gray leading-relaxed mb-8">
        If a prospect&apos;s current tools can answer this question, they probably do not
        need Ignition. If they cannot — and most cannot — nothing else on the market will
        get them there.
      </p>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/competitive">See how we compare head-to-head</InternalLink>
        <InternalLink href="/capabilities/roi-reporting">ROI Reporting in detail</InternalLink>
        <InternalLink href="/capabilities/iggy-ai">Meet Iggy, our AI insights agent</InternalLink>
      </div>
    </>
  );
}

const DIFFERENTIATORS = [
  {
    title: 'Revenue Attribution, Not Vanity Metrics',
    description:
      'Closed-loop tracking from ad spend to actual revenue at the location level. Most platforms stop at clicks or leads. Ignition answers the question that matters: "Did this marketing make money?"',
  },
  {
    title: 'Conversational AI That Answers Real Questions',
    description:
      'Not a chatbot with canned responses. Iggy is an AI agent that reasons over live campaign data, identifies problems, and recommends specific actions. Ask it anything about your campaigns in plain English and get answers grounded in real data.',
  },
  {
    title: 'Print + Digital in One Platform',
    description:
      "Ironmark's 30+ years of print production means direct mail, printed materials, and digital campaigns are orchestrated together in one system. No pure-digital platform can do this — and print remains one of the highest-performing channels for multilocation brands.",
  },
  {
    title: 'Proprietary Data Assets',
    description:
      '160 million automotive consumer records and growing campaign intelligence across verticals. This data fuels AI models and targeting that cannot be replicated by competitors who rely solely on third-party data.',
  },
  {
    title: 'Built on Existing Relationships',
    description:
      'Not selling cold into new accounts. Ignition adds intelligence to brands that already trust Ironmark with their marketing operations. Platform adoption is built on proven relationships, not cold outreach.',
  },
];

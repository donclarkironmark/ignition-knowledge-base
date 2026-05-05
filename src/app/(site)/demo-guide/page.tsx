import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Demo Guide' };

export default function DemoGuidePage() {
  return (
    <>
      <PageHeader
        title="Demo Guide"
        subtitle="How to show Ignition effectively — key flows, talking points, and common questions."
      />

      {/* Section A: Before the Demo */}
      <SectionHeading>Preparation checklist</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        A great demo starts before you open the platform. The more you know about the
        prospect, the more the demo feels like a conversation instead of a presentation.
      </p>
      <div className="space-y-2 mb-8">
        {PREP_ITEMS.map((item) => (
          <div key={item} className="flex gap-3 items-start text-sm">
            <span className="shrink-0 w-5 h-5 rounded border border-brand-border bg-white flex items-center justify-center text-brand-cyan text-xs font-bold mt-0.5">
              &#10003;
            </span>
            <span className="text-brand-gray">{item}</span>
          </div>
        ))}
      </div>

      {/* Section B: Demo Flow */}
      <SectionHeading>Recommended demo structure (15-20 minutes)</SectionHeading>
      <div className="space-y-4 mb-8">
        {DEMO_STEPS.map((step) => (
          <div key={step.title} className="rounded-lg border border-brand-border bg-white p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="shrink-0 w-8 h-8 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center text-sm font-bold">
                {step.time}
              </span>
              <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
            </div>
            <p className="text-sm text-brand-gray leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Section C: Key Talking Points */}
      <SectionHeading>Phrases that land</SectionHeading>
      <p className="text-sm text-brand-gray mb-3">
        These are the lines that resonate most with prospects. Practice them until they feel
        natural.
      </p>
      <div className="space-y-3 mb-8">
        {TALKING_POINTS.map((tp) => (
          <div key={tp.moment} className="flex gap-4 rounded-lg border border-brand-border bg-white px-5 py-3 text-sm">
            <span className="shrink-0 font-medium text-brand-cyan whitespace-nowrap">{tp.moment}</span>
            <p className="text-brand-gray italic">&ldquo;{tp.phrase}&rdquo;</p>
          </div>
        ))}
      </div>

      {/* Section D: Common Questions */}
      <SectionHeading>Questions you will get — and how to answer them</SectionHeading>
      <div className="space-y-4 mb-8">
        {FAQ.map((item) => (
          <div key={item.question} className="rounded-lg border border-brand-border bg-white p-5">
            <p className="text-sm font-semibold text-foreground mb-1">
              &ldquo;{item.question}&rdquo;
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/roi-reporting">Review ROI Reporting before your demo</InternalLink>
        <InternalLink href="/capabilities/iggy-ai">Review Iggy AI before your demo</InternalLink>
        <InternalLink href="/capabilities/competitive">Review competitive positioning</InternalLink>
        <InternalLink href="/insider">Check today&apos;s competitive intel feed</InternalLink>
      </div>
    </>
  );
}

const PREP_ITEMS = [
  "Know the prospect's vertical and adjust your terminology accordingly — use the vertical pages in this Knowledge Base as reference",
  'Know their current marketing setup: agency, in-house team, what tools they use today',
  'Know their location count and structure (corporate, regional, local levels)',
  "Have 2-3 specific scenarios ready using their vertical's language — not generic marketing examples",
  'If you know they use a competitor platform, review the competitive positioning page for talk tracks',
];

const DEMO_STEPS = [
  {
    time: '2m',
    title: 'Open with the problem',
    description:
      'Mirror their pain. "You have X [locations/clinics/stores/branches] and you can\'t tell which ones are making money from marketing." Use their number and their terminology. Let them nod before you show anything.',
  },
  {
    time: '5m',
    title: 'Show the ROI Dashboard',
    description:
      'Start with the network view, then drill into a specific location. Show channel attribution and daily performance. Let the data speak — don\'t over-narrate. Key moment: show them a location type they would recognize.',
  },
  {
    time: '5m',
    title: 'Introduce Iggy',
    description:
      'Show the Insights Panel first (proactive alerts), then ask Iggy a natural language question live. Show the Notebook output. This is the "wow moment" — give it space to land. Let the prospect react before moving on.',
  },
  {
    time: '3m',
    title: 'Connect to their world',
    description:
      'Use their vertical terminology. Reference their specific challenges. Show how the dashboard answers their specific question. This is where preparation pays off — the demo should feel customized, not canned.',
  },
  {
    time: '2m',
    title: 'Close with the roadmap',
    description:
      "Briefly mention what's coming — AI Creative, CDP, Campaign Management. Plant the long-term vision without overpromising. The message: what you just saw is live today, and it is only the beginning.",
  },
];

const TALKING_POINTS = [
  {
    moment: 'Opening',
    phrase: 'Can you tell me which of your [locations/clinics/stores/branches] are profitable from marketing?',
  },
  {
    moment: 'Dashboard',
    phrase: "This isn't clicks and impressions — this is revenue.",
  },
  {
    moment: 'Iggy',
    phrase: "Ask it anything. It's looking at your live data right now.",
  },
  {
    moment: 'Differentiation',
    phrase: 'No other platform in the market can answer that question from live data.',
  },
  {
    moment: 'Close',
    phrase: "This is what's live today. Imagine what happens when AI creative and automation are added.",
  },
];

const FAQ = [
  {
    question: 'How does the data get in?',
    answer:
      'Automated integrations with Google, Meta, TikTok, LinkedIn, and CRM systems. No manual work for the customer. Data flows in automatically, and dashboards are updated daily.',
  },
  {
    question: 'How accurate is the attribution?',
    answer:
      'Closed-loop methodology connecting ad platforms to CRM and POS data. Multi-method validation using goal-based, historical, and benchmark comparisons. This is not modeled or estimated — it is connected data.',
  },
  {
    question: 'What about our existing tools?',
    answer:
      "Ignition complements, it does not replace. It is the intelligence layer that sits on top of whatever they are already running. If they use SOCi for execution, Ignition measures whether that execution is working.",
  },
  {
    question: 'When can we start?',
    answer:
      'Fast onboarding. ROI Reporting can be live in weeks, not months. The data ingestion is automated, so the timeline depends on CRM/POS integration complexity, not on building dashboards from scratch.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Direct them to sales leadership. Pricing discussions happen outside the demo context. Your job is to demonstrate value; pricing is handled in the next conversation.',
  },
];

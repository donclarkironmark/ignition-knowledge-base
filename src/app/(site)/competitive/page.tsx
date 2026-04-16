import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Competitive Positioning' };

export default function CompetitivePage() {
  return (
    <>
      <PageHeader
        title="Competitive Positioning"
        subtitle="How Ignition compares to the alternatives — and what to say when a prospect brings them up."
      />

      {/* Section A: Core Positioning */}
      <SectionHeading>One line to remember</SectionHeading>
      <div className="rounded-lg border-l-4 border-l-brand-red border border-brand-border bg-white p-5 mb-6">
        <p className="text-lg font-semibold text-foreground italic">
          &ldquo;Competitors run marketing. Ignition proves it works.&rdquo;
        </p>
      </div>
      <p className="text-brand-gray leading-relaxed mb-8">
        The consistent differentiator across every competitor matchup: Ignition answers
        &ldquo;is my marketing driving revenue at the location level?&rdquo; when others
        cannot. Every head-to-head conversation comes back to this question.
      </p>

      {/* Section B: Status Quo */}
      <SectionHeading>Your biggest competitor is not a platform — it is the monthly PDF</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Most multilocation brands are not using a competing platform. They are getting
        static monthly reports from their marketing agency. This is the status quo — and it
        is the most common competitive situation you will encounter.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <div className="rounded-lg border border-brand-border bg-white p-4">
          <p className="text-sm font-semibold text-brand-gray mb-2">The Agency Report</p>
          <ul className="space-y-1 text-sm text-brand-gray">
            <li>Monthly cadence (already outdated)</li>
            <li>Spend and click metrics (no revenue)</li>
            <li>Brand-level aggregates (no location visibility)</li>
            <li>No interactivity or drill-down</li>
            <li>Agency owns the data</li>
          </ul>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800 mb-2">Ignition</p>
          <ul className="space-y-1 text-sm text-emerald-700">
            <li>Real-time, daily updates</li>
            <li>Revenue attribution (not just clicks)</li>
            <li>Location-level granularity</li>
            <li>Interactive dashboards + AI insights</li>
            <li>Brand owns the data</li>
          </ul>
        </div>
      </div>
      <div className="rounded-lg border border-brand-border bg-brand-off-white p-4 mb-8 text-sm">
        <strong className="text-foreground">Talk track:</strong>{' '}
        <span className="text-brand-gray">
          &ldquo;Your agency sends you a monthly report that says you spent $200,000 and got
          1.2 million impressions. Can they tell you which of your 300 locations are
          profitable?&rdquo;
        </span>
      </div>

      {/* Section C: Head-to-Head */}
      <SectionHeading>Head-to-head comparisons</SectionHeading>
      <div className="space-y-6 mb-10">
        {COMPETITORS.map((comp) => (
          <div key={comp.name} className="rounded-lg border border-brand-border bg-white p-5">
            <h3 className="text-lg font-semibold text-foreground mb-3">{comp.name}</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-brand-gray mb-1">What they do</p>
                <p className="text-brand-gray">{comp.whatTheyDo}</p>
              </div>
              <div>
                <p className="font-medium text-brand-gray mb-1">Their strength</p>
                <p className="text-brand-gray">{comp.strength}</p>
              </div>
              <div>
                <p className="font-medium text-brand-cyan mb-1">Where we win</p>
                <p className="text-brand-gray">{comp.whereWeWin}</p>
              </div>
              <div className="rounded-md bg-brand-off-white p-3">
                <p className="font-medium text-foreground mb-0.5">Talk track</p>
                <p className="text-brand-gray italic">&ldquo;{comp.talkTrack}&rdquo;</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section D: Capability Matrix */}
      <SectionHeading>Capability comparison matrix</SectionHeading>
      <p className="text-sm text-brand-gray mb-3">
        Honest assessment as of March 2026. Ignition capabilities marked as partial are on
        the platform roadmap.
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b-2 border-brand-border">
              <th className="text-left py-2 pr-4 font-semibold text-foreground">Capability</th>
              <th className="py-2 px-2 text-center font-semibold text-foreground">Ignition</th>
              <th className="py-2 px-2 text-center font-semibold text-foreground">Ansira</th>
              <th className="py-2 px-2 text-center font-semibold text-foreground">SOCi</th>
              <th className="py-2 px-2 text-center font-semibold text-foreground">Evocalize</th>
              <th className="py-2 px-2 text-center font-semibold text-foreground">Pica9</th>
            </tr>
          </thead>
          <tbody className="text-brand-gray">
            {MATRIX_ROWS.map((row) => (
              <tr key={row.capability} className="border-b border-brand-border/50">
                <td className="py-2 pr-4 font-medium text-foreground">{row.capability}</td>
                {row.scores.map((score, i) => (
                  <td key={i} className="py-2 px-2 text-center">
                    {score === 'strong' && <span className="text-emerald-600" title="Strong">&#9679;</span>}
                    {score === 'partial' && <span className="text-amber-500" title="Partial">&#9680;</span>}
                    {score === 'none' && <span className="text-gray-300" title="Not Available">&#9675;</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 text-xs text-brand-gray mb-8">
        <span><span className="text-emerald-600">&#9679;</span> Strong</span>
        <span><span className="text-amber-500">&#9680;</span> Partial / Basic</span>
        <span><span className="text-gray-300">&#9675;</span> Not Available</span>
      </div>

      {/* Section E: Response Guide */}
      <SectionHeading>What to say when a prospect says &ldquo;we already use...&rdquo;</SectionHeading>
      <div className="space-y-3 mb-8">
        {RESPONSES.map((r) => (
          <div key={r.trigger} className="rounded-lg border border-brand-border bg-white p-4 text-sm">
            <p className="font-semibold text-foreground mb-1">&ldquo;{r.trigger}&rdquo;</p>
            <p className="text-brand-gray">{r.response}</p>
          </div>
        ))}
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/roi-reporting">See ROI Reporting in detail</InternalLink>
        <InternalLink href="/capabilities/iggy-ai">See Iggy AI in detail</InternalLink>
        <InternalLink href="/platform/why-ignition">See the five things no competitor can match</InternalLink>
      </div>
    </>
  );
}

const COMPETITORS = [
  {
    name: 'Ansira (BrandMuscle + SproutLoud)',
    whatTheyDo:
      'Largest enterprise distributed marketing platform following their July 2024 merger. Claims 300+ brands and 1.6M active users. Named Strong Performer in Forrester Wave: Partner Marketing Automation Platforms, Q2 2025.',
    strength:
      'Co-op and MDF fund management (best-in-class), creative compliance and DAM, enterprise-scale operations with broad ecosystem integrations.',
    whereWeWin:
      'No conversational AI agent. G2 reviews cite complexity and steep learning curves. Stops at spend-to-lead attribution; Ignition traces through to revenue at the location level. No native print + digital attribution in a single system.',
    talkTrack:
      'Ansira manages distribution and co-op well. Can they tell you which of your 500 locations are profitable and why?',
  },
  {
    name: 'SOCi',
    whatTheyDo:
      'Local marketing execution at scale. Serves 1,000+ brands across 3M+ locations with 200K+ AI "Genius Agents" that autonomously publish posts, respond to reviews, and manage listings.',
    strength:
      'Agentic execution at scale (posts, reviews, listings), 140+ integrations, ISO 42001 certified for AI governance, mature multi-location operations.',
    whereWeWin:
      'Shows tasks completed and engagement metrics, not revenue attribution. No conversational analytics layer for marketers (SOCi Chat is consumer-facing, not analyst-facing). Digital-only with no print or direct mail visibility. Execution-focused versus intelligence-focused.',
    talkTrack:
      "SOCi executes marketing. Ignition measures whether it's working. They're execution; we're intelligence.",
  },
  {
    name: 'Evocalize',
    whatTheyDo:
      'Collaborative marketing platform with pre-configured "Blueprints" for rapid local digital campaign deployment. Partnerships with Mastercard, Kumon, and UberEats.',
    strength:
      'Local operator simplicity, Facebook/Google/TikTok automation, data-triggered campaigns, franchise-scale deployment.',
    whereWeWin:
      'Spend-to-clicks attribution only — cannot trace to revenue. Digital-only with no print, direct mail, or offline media. No conversational AI, no root cause analysis, no proactive alerts. No proprietary data assets.',
    talkTrack:
      "Evocalize tells you Location 12 spent $5,000 and got 200 clicks. Ignition tells you Location 12 generated $47,000 in revenue — and here's why.",
  },
  {
    name: 'Pica9',
    whatTheyDo:
      'Brand management and template customization platform focused on franchise organizations. Most transparent per-location pricing in the market ($2-$50/location/month).',
    strength:
      'Template compliance, affordability, accessible to smaller franchise systems that need brand asset management without enterprise complexity.',
    whereWeWin:
      'Template tool, not an analytics or intelligence platform. No revenue attribution, no AI capabilities, no campaign intelligence. Ignition covers reporting + attribution + AI + creative generation; Pica9 covers template management.',
    talkTrack:
      "Pica9 answers 'are my locations using the right assets?' Ignition answers 'are those assets working?'",
  },
];

const MATRIX_ROWS = [
  { capability: 'Location-level ROI reporting', scores: ['strong', 'none', 'none', 'none', 'none'] as const },
  { capability: 'Conversational AI insights', scores: ['strong', 'none', 'none', 'none', 'none'] as const },
  { capability: 'Print + digital attribution', scores: ['strong', 'none', 'none', 'none', 'none'] as const },
  { capability: 'Proprietary data assets', scores: ['strong', 'none', 'none', 'none', 'none'] as const },
  { capability: 'Co-op / MDF fund management', scores: ['partial', 'strong', 'partial', 'none', 'none'] as const },
  { capability: 'Brand asset management', scores: ['partial', 'strong', 'partial', 'none', 'strong'] as const },
  { capability: 'Campaign execution / automation', scores: ['partial', 'partial', 'strong', 'strong', 'none'] as const },
];

const RESPONSES = [
  {
    trigger: 'We already use Ansira',
    response:
      'Great for co-op management. Ask them to show you location-level revenue attribution. That is where we complement or replace.',
  },
  {
    trigger: 'We already use SOCi',
    response:
      "SOCi handles execution well. Who is measuring whether that execution is actually driving revenue? That is Ignition.",
  },
  {
    trigger: 'We already use Evocalize',
    response:
      'Evocalize automates local ad deployment. But can it tell you which locations are actually profitable? Ignition adds the intelligence layer.',
  },
  {
    trigger: 'We already use Pica9',
    response:
      'Pica9 handles templates and brand compliance. Ignition handles everything from that point forward — attribution, intelligence, and optimization.',
  },
];

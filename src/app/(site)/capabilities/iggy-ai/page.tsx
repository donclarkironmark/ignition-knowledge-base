import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Iggy AI Insights Agent' };

export default function IggyAiPage() {
  return (
    <>
      <PageHeader
        title="Iggy AI — Your Intelligent Marketing Analyst"
        subtitle="Ask questions in plain English. Get answers from live campaign data. No more waiting for reports."
        status="live"
      />

      {/* Section A: Problem */}
      <SectionHeading>Data without intelligence is just noise</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Dashboards are powerful, but most marketers do not have time to dig through them
        every day. They need someone to tell them what is happening and what to do about it.
        Waiting for a monthly report from an analyst is too slow — the opportunity is gone
        by the time you see it.
      </p>
      <p className="text-brand-gray leading-relaxed mb-6">
        That is what Iggy does. Always-on intelligence that surfaces problems and recommends
        actions from your live campaign data. No manual analysis required.
      </p>

      {/* Section B: Two Modes */}
      <SectionHeading>Proactive alerts and on-demand answers</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="rounded-lg border border-brand-border bg-white p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">Persistent Insights Panel</h3>
          <p className="text-sm text-brand-gray leading-relaxed">
            Iggy proactively surfaces issues: underperforming locations, budget anomalies,
            campaign opportunities. You do not need to ask — the alerts come to you. Think
            of it as an always-on analyst watching your data and tapping you on the shoulder
            when something needs attention.
          </p>
        </div>
        <div className="rounded-lg border border-brand-border bg-white p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">Ask Iggy Chat</h3>
          <p className="text-sm text-brand-gray leading-relaxed">
            Type a question in plain English and get an answer grounded in live data.
            &ldquo;Which locations are underperforming this month?&rdquo; &ldquo;Why did
            Location 12&apos;s cost per lead spike?&rdquo; &ldquo;What are top clinics doing
            differently?&rdquo; Iggy finds the answer in your data and explains it clearly.
          </p>
        </div>
      </div>

      {/* Section C: How Iggy Thinks */}
      <SectionHeading>Not a chatbot — a reasoning engine</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Iggy does not match keywords or serve canned responses. It reasons over real data
        using a multi-method approach:
      </p>
      <ul className="space-y-3 mb-6 text-sm text-brand-gray">
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold shrink-0">&#8226;</span>
          <span><strong className="text-foreground">Goal-based analysis (95% confidence)</strong> — How is this location performing against its defined goals?</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold shrink-0">&#8226;</span>
          <span><strong className="text-foreground">Historical trend comparison (85%)</strong> — How does current performance compare to the location&apos;s own history?</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-cyan font-bold shrink-0">&#8226;</span>
          <span><strong className="text-foreground">Vertical benchmarks (75%)</strong> — How does this location compare to similar businesses in the same vertical?</span>
        </li>
      </ul>
      <p className="text-brand-gray leading-relaxed mb-6">
        When Iggy identifies a problem, it performs root cause analysis: identifying symptoms,
        generating hypotheses, gathering evidence, and delivering scored recommendations.
        This is original analysis from your data, not templated advice.
      </p>

      {/* Section D: Iggy Notebook */}
      <SectionHeading>Turn questions into visual reports</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        The Iggy Notebook lets you ask a natural language question and get a full visual
        report in response — metrics, charts, tables, and narrative insights all generated
        from your live data.
      </p>
      <div className="rounded-lg border border-brand-border bg-brand-off-white p-5 mb-6 text-sm text-brand-gray">
        <strong className="text-foreground">Example:</strong> Ask &ldquo;Show me new patient
        cost by clinic for Q1&rdquo; and get a formatted report with per-clinic costs,
        network averages, benchmarks against top performers, and specific recommendations for
        underperforming locations. Save it, re-run it next quarter, or export it as a PDF.
      </div>
      <p className="text-brand-gray leading-relaxed mb-6">
        Notebook turns ad-hoc questions into reusable reporting assets. A question you ask
        once becomes a report you can run again and again.
      </p>

      {/* Section E: Insight Lifecycle */}
      <SectionHeading>From intelligence to accountability</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Insights do not just appear and vanish. Every insight Iggy surfaces moves through
        tracked states:
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {LIFECYCLE_STATES.map((state) => (
          <span
            key={state}
            className="rounded-full border border-brand-border bg-white px-3 py-1 text-xs font-medium text-foreground"
          >
            {state}
          </span>
        ))}
      </div>
      <p className="text-brand-gray leading-relaxed mb-6">
        This lifecycle creates accountability. When Iggy identifies a problem, you can track
        it to resolution. &ldquo;We identified this problem. Did we fix it?&rdquo; No more
        insights that get surfaced, acknowledged, and then forgotten.
      </p>

      {/* Section F: Competitive Gap */}
      <SectionHeading>No competitor has this</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        No distributed marketing platform competitor offers conversational AI answering
        questions from live campaign data. Other platforms have dashboards. Some have basic
        alerts. None of them let you ask a question in plain English and get a data-driven
        answer.
      </p>
      <p className="text-brand-gray leading-relaxed mb-8">
        Iggy is the differentiator that makes customers choose Ignition. And it is the
        capability that makes them stay. The more questions asked, the more insights
        tracked, the more valuable the platform becomes.
      </p>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/roi-reporting">Iggy works on top of your ROI data — see ROI Reporting</InternalLink>
        <InternalLink href="/capabilities/dynamic-ai-creative">What Iggy enables next — Dynamic AI Creative</InternalLink>
        <InternalLink href="/demo-guide">Learn how to demo Iggy effectively</InternalLink>
      </div>
    </>
  );
}

const LIFECYCLE_STATES = ['New', 'Acknowledged', 'In Progress', 'Resolved', 'Dismissed'];

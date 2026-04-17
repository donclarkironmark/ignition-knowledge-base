import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TangoEmbed } from '@/components/ui/TangoEmbed';

export const metadata: Metadata = { title: 'Demo Playbook' };

export default function DemoPlaybookPage() {
  return (
    <>
      <Link
        href="/resources/help-guides"
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-cyan mb-4"
      >
        <ArrowLeft size={14} />
        All guides
      </Link>

      <PageHeader
        title="Demo Playbook"
        subtitle="Step-by-step walkthroughs for each demo flow. Pair with the Demo Guide (flow + talk tracks) under Resources."
      />

      <SectionHeading>Demo environment access</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Before any live demo, confirm the environment is up and your user has
        the right data loaded. The walkthrough below covers login and the
        pre-demo checklist.
      </p>

      <TangoEmbed
        src="https://app.tango.us/app/embed/fc9fd912-7c13-47a4-a5f7-9ed0f443f152"
        title="Add Users in Ironmark DMP"
      />

      <SectionHeading>Flow 1 &mdash; ROI dashboard walkthrough</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        The ROI dashboard is our strongest opener. Show revenue attribution
        before you show campaign setup &mdash; prospects buy outcomes, not tools.
      </p>
      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Demo flow: ROI dashboard"
      />

      <SectionHeading>Flow 2 &mdash; Iggy AI agent</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Iggy turns raw data into a conversation. Demo a question the prospect
        would actually ask about their own data (&ldquo;which locations underperformed
        last month?&rdquo;), not a generic one.
      </p>
      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Demo flow: Iggy AI"
      />

      <SectionHeading>Flow 3 &mdash; Campaign creation (if asked)</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Only go deep on campaign setup if the prospect asks. &ldquo;How do I actually
        launch something&rdquo; is a buyer signal; lead with it and you risk boring
        them with UI clicks.
      </p>
      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Demo flow: Campaign creation"
      />

      <SectionHeading>Troubleshooting during a live demo</SectionHeading>
      <ul className="list-disc pl-6 space-y-2 text-brand-gray text-sm mb-6">
        <li><strong>Data looks stale</strong> &mdash; the demo account refreshes every 24h. If a dashboard is empty, pivot to another flow and log it after the call.</li>
        <li><strong>Iggy is slow</strong> &mdash; the first question after idle can take 10-15s. Ask a throwaway question before joining the call to warm it up.</li>
        <li><strong>Screen freeze</strong> &mdash; don&apos;t apologize profusely. &ldquo;Let me refresh that&rdquo; + reload. Recovery confidence matters more than avoiding the bug.</li>
      </ul>

      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Recovering from a common demo issue"
      />
    </>
  );
}

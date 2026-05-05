import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TangoEmbed } from '@/components/ui/TangoEmbed';

export const metadata: Metadata = { title: 'Using Ignition Insider' };

export default function UsingInsiderPage() {
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
        title="Using Ignition Insider"
        subtitle="The 5-minute tour: login, navigation, capability status, the Intel & Insights feed, and sharing links."
      />

      <SectionHeading>Logging in</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Ignition Insider uses a shared password. There are two levels:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-brand-gray text-sm mb-6">
        <li><strong>Viewer</strong> — read all capability pages and the Intel & Insights feed.</li>
        <li><strong>Admin</strong> — also create, review, and publish posts and editions in the feed. Ask Don for the admin password.</li>
      </ul>

      {/*
        To embed a Tango walkthrough, paste the src from the Tango "Share → Embed"
        dialog. Example (replace with a real Tango URL when recorded):
      */}
      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Walkthrough: Logging in to Ignition Insider"
      />

      <SectionHeading>Navigation</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        The sidebar has three sections, top to bottom:
      </p>
      <ol className="list-decimal pl-6 space-y-2 text-brand-gray text-sm mb-6">
        <li>
          <strong>Intel &amp; Insights</strong> — the live competitive intelligence feed.
          Posts about competitor moves, category shifts, and customer signals; weekly
          editions emailed to subscribers; admin tools for the editorial team.
        </li>
        <li>
          <strong>Capabilities</strong> — one page per Ignition platform theme.
          ROI Reporting and Iggy AI are live today; Campaign Management, Dynamic AI
          Creative, CDP &amp; Audience Builder, Distributed Marketing/DAM, and
          Full-funnel &amp; Automation are on the roadmap.
        </li>
        <li>
          <strong>Resources</strong> — Demo Guide, Glossary, and these Help Guides.
        </li>
      </ol>

      <SectionHeading>Capability status badges</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Each capability page shows a status banner at the top. Three states matter:
      </p>
      <div className="space-y-2 mb-6 text-sm">
        <div className="flex gap-3 items-start">
          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">LIVE</span>
          <span className="text-brand-gray">In production today. Safe to demo and commit to in conversations with prospects.</span>
        </div>
        <div className="flex gap-3 items-start">
          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">PHASE 2</span>
          <span className="text-brand-gray">In active development. Use directional language — &ldquo;coming soon&rdquo; rather than fixed dates.</span>
        </div>
        <div className="flex gap-3 items-start">
          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">ROADMAP</span>
          <span className="text-brand-gray">Committed on the roadmap; timing not yet quarter-locked. Position as part of the platform vision.</span>
        </div>
      </div>
      <p className="text-brand-gray text-sm mb-6">
        Phase labels, not quarter-based timelines — this protects us from credibility risk when dates slip.
      </p>

      <SectionHeading>Sharing links with teammates</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Every page has its own URL. Copy from the address bar and share in Slack
        or email. The link will prompt for the Insider password the first time —
        anyone with the password can view.
      </p>

      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Walkthrough: Sharing an Ignition Insider link"
      />

      <SectionHeading>Who to ask</SectionHeading>
      <ul className="list-disc pl-6 space-y-1 text-brand-gray text-sm mb-6">
        <li><strong>Content corrections or additions</strong> — Don Clark (VP Product).</li>
        <li><strong>Access issues / password resets</strong> — Don or Jordan.</li>
        <li><strong>Bug in the site itself</strong> — mention in #ignition-insider on Slack.</li>
      </ul>
    </>
  );
}

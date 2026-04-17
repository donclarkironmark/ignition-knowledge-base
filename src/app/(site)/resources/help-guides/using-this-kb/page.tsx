import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TangoEmbed } from '@/components/ui/TangoEmbed';

export const metadata: Metadata = { title: 'Using This Knowledge Base' };

export default function UsingThisKbPage() {
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
        title="Using This Knowledge Base"
        subtitle="The 5-minute tour: login, navigation, capability status, Insider, and sharing links."
      />

      <SectionHeading>Logging in</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        The KB uses a shared password. There are two levels:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-brand-gray text-sm mb-6">
        <li><strong>Viewer</strong> — read all static pages and the Insider feed.</li>
        <li><strong>Admin</strong> — also create/edit Insider posts and editions. Ask Don for the admin password.</li>
      </ul>

      {/*
        To embed a Tango walkthrough, paste the src from the Tango "Share → Embed"
        dialog. Example (replace with a real Tango URL when recorded):
      */}
      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Walkthrough: Logging in to the Knowledge Base"
      />

      <SectionHeading>Navigation</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        The sidebar groups content into six sections. Top-to-bottom follows a
        natural sales conversation:
      </p>
      <ol className="list-decimal pl-6 space-y-2 text-brand-gray text-sm mb-6">
        <li><strong>Platform</strong> — what Ignition is and why we built it.</li>
        <li><strong>Capabilities</strong> — the seven platform capabilities, each tagged LIVE / PHASE 2 / PHASE 3.</li>
        <li><strong>Industries</strong> — vertical-specific value props (QSR, Healthcare, Automotive, FinServ, Franchise).</li>
        <li><strong>Competitive</strong> — head-to-head comparisons with the main DMPs.</li>
        <li><strong>Insider</strong> — live competitive intelligence feed backed by Supabase (see the Insider guide).</li>
        <li><strong>Resources</strong> — demo guide, glossary, and these help guides.</li>
      </ol>

      <SectionHeading>Capability status badges</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Each capability shows one of three badges. These reflect real state —
        if a badge says <em>LIVE</em>, the capability is shipping in production:
      </p>
      <div className="space-y-2 mb-6 text-sm">
        <div className="flex gap-3 items-start">
          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">LIVE</span>
          <span className="text-brand-gray">In production today. Safe to demo and commit to in conversations with prospects.</span>
        </div>
        <div className="flex gap-3 items-start">
          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">PHASE 2</span>
          <span className="text-brand-gray">In development. Use directional language — &ldquo;coming soon&rdquo; rather than fixed dates.</span>
        </div>
        <div className="flex gap-3 items-start">
          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">PHASE 3</span>
          <span className="text-brand-gray">On the roadmap. Directionally committed, not scoped or scheduled yet.</span>
        </div>
      </div>
      <p className="text-brand-gray text-sm mb-6">
        Phase labels, not quarter-based timelines — this protects us from credibility risk when dates slip.
      </p>

      <SectionHeading>Sharing links with teammates</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Every page has its own URL. Copy from the address bar and share in Slack
        or email. The link will prompt for the KB password the first time —
        anyone with the password can view.
      </p>

      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Walkthrough: Sharing a KB link"
      />

      <SectionHeading>Who to ask</SectionHeading>
      <ul className="list-disc pl-6 space-y-1 text-brand-gray text-sm mb-6">
        <li><strong>Content corrections or additions</strong> — Don Clark (VP Product).</li>
        <li><strong>Access issues / password resets</strong> — Don or Jordan.</li>
        <li><strong>Bug in the KB site itself</strong> — mention in #ignition-kb on Slack.</li>
      </ul>
    </>
  );
}

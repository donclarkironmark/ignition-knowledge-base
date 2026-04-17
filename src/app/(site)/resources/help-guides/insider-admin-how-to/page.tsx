import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TangoEmbed } from '@/components/ui/TangoEmbed';

export const metadata: Metadata = { title: 'Insider Admin How-To' };

export default function InsiderAdminGuidePage() {
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
        title="Insider Admin How-To"
        subtitle="Create posts, run the review queue, assemble weekly editions, and manage subscribers. Admin login required."
      />

      <SectionHeading>Getting into admin</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        You need the admin password (separate from the viewer password &mdash; ask
        Don). Once logged in with the admin password, visit{' '}
        <Link href="/insider/admin" className="text-brand-cyan hover:underline">
          /insider/admin
        </Link>
        . If you see a dashboard with tabs (All Posts / Review Queue / Editions),
        you&apos;re in.
      </p>

      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Logging in as Insider admin"
      />

      <SectionHeading>Creating a post manually</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        For most posts you&apos;ll draft in the admin UI. Key fields:
      </p>
      <ul className="list-disc pl-6 space-y-1.5 text-brand-gray text-sm mb-4">
        <li><strong>Category</strong> &mdash; <em>competitor</em>, <em>category</em>, <em>customer</em>, or <em>martech</em>. Picks the color + the section a post drops into in the edition.</li>
        <li><strong>Relevance score (1-10)</strong> &mdash; calibrated. 7+ auto-publishes. 8+ AND an alert keyword (acquisition/merger/regulatory/etc.) fires an email alert.</li>
        <li><strong>Source URL + date</strong> &mdash; URL is deduped globally. Date older than 30 days queues for review instead of auto-publishing.</li>
        <li><strong>Tags</strong> &mdash; only values from the seeded vocabulary are accepted. Competitors, signals, verticals, etc. New tag names = rejected with a clear error.</li>
        <li><strong>Body MUST include a &ldquo;So What for Ironmark&rdquo; paragraph</strong> &mdash; the auto-publish check looks for this literal phrase. No &ldquo;So What&rdquo; = auto-queued for review.</li>
      </ul>
      <p className="text-brand-gray leading-relaxed mb-4">
        The &ldquo;Suggest insight&rdquo; button calls GPT-4o-mini to draft a &ldquo;So What&rdquo;
        paragraph from the title/summary/body you&apos;ve entered. Use it as a
        starting point, then sharpen.
      </p>

      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Creating and publishing an Insider post"
      />

      <SectionHeading>Working the review queue</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Posts land in <em>review</em> status when auto-publish criteria aren&apos;t
        met &mdash; typically from the Routine-driven daily competitor scan.
        Review notes explain why (e.g., &ldquo;relevance_score 5 &lt; 7&rdquo;,
        &ldquo;body is missing &apos;So What&apos; section&rdquo;).
      </p>
      <p className="text-brand-gray leading-relaxed mb-3">
        In the review queue you have three actions per post:
      </p>
      <ul className="list-disc pl-6 space-y-1.5 text-brand-gray text-sm mb-4">
        <li><strong>Approve</strong> &mdash; publishes as-is. Use when the Routine nailed it.</li>
        <li><strong>Edit</strong> &mdash; open full edit form, tighten the draft, then publish.</li>
        <li><strong>Return to draft</strong> &mdash; kick it back for later. Nothing is sent, subscribers don&apos;t see it.</li>
      </ul>

      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Running the review queue"
      />

      <SectionHeading>Assembling a weekly edition</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        The Friday Edition Prep Routine drafts a skeleton edition for you.
        From the <em>Editions</em> tab, open the latest draft and review:
      </p>
      <ul className="list-disc pl-6 space-y-1.5 text-brand-gray text-sm mb-4">
        <li>Title, executive summary, data point of the week, coming-up block.</li>
        <li>Which posts are pulled into which section (top_signal / competitor / category / customer / martech / radar).</li>
        <li>Display order within each section.</li>
      </ul>
      <p className="text-brand-gray leading-relaxed mb-3">
        When it reads well, flip the status to <em>published</em>. Next time
        the send-digest cron fires, that edition goes out to all active
        subscribers whose category preferences match at least one post in the
        edition.
      </p>

      <TangoEmbed
        src="https://app.tango.us/app/embed/REPLACE-WITH-TANGO-WORKFLOW-ID"
        title="Assembling and publishing a weekly edition"
      />

      <SectionHeading>Subscribers and email delivery</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Subscribers opt in via the subscribe block on the public Insider feed.
        Each subscription has a HMAC-signed token that controls unsubscribe
        and preference changes &mdash; tokens never expire, so old email links
        keep working.
      </p>
      <ul className="list-disc pl-6 space-y-1.5 text-brand-gray text-sm mb-4">
        <li>Digest emails are deduped per <code>(subscriber, edition)</code>. A subscriber will never receive the same edition twice, even if the cron retries.</li>
        <li>Alert emails are deduped per <code>(subscriber, post)</code> &mdash; one alert per high-relevance post per subscriber.</li>
        <li>If SMTP credentials aren&apos;t configured, sends fail quietly and are logged to the <code>insider_digest_sends</code> / <code>insider_alert_sends</code> tables with status <code>failed</code>.</li>
      </ul>

      <SectionHeading>Hands-off path &mdash; Claude Code Routines</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-3">
        Three Routines run in the background and do most of the authoring work
        for you (details in the Insider admin dashboard &ldquo;How it works&rdquo;
        popover):
      </p>
      <ol className="list-decimal pl-6 space-y-1.5 text-brand-gray text-sm mb-4">
        <li><strong>Daily Competitor Scan</strong> &mdash; every morning, pulls news for each competitor, drafts posts, inserts to <em>review</em>.</li>
        <li><strong>Weekly Category/MarTech Scan</strong> &mdash; Monday morning, broader industry scan.</li>
        <li><strong>Friday Edition Prep</strong> &mdash; assembles draft edition from the week&apos;s published posts for you to review.</li>
      </ol>
      <p className="text-brand-gray leading-relaxed mb-4">
        Routines POST via the <code>INSIDER_SERVICE_TOKEN</code> bearer path &mdash;
        they don&apos;t need admin session cookies. They will never publish a post
        or edition on their own; everything goes into the review queue for you.
      </p>
    </>
  );
}

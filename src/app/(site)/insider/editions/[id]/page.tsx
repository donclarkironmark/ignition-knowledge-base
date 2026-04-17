import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Quote, Telescope, ChevronRight } from 'lucide-react';
import { getEditionById } from '@/lib/insider-edition.service';
import type { InsiderCategory, InsiderEdition, InsiderPost, EditionSection } from '@/config/insider.config';

// Supabase-backed — don't attempt static prerender at build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edition — Ignition Insider',
  robots: { index: false, follow: false },
};

// ── Category display data ─────────────────────────────────────────────────

const CATEGORY_META: Record<InsiderCategory, { label: string; color: string; bg: string; text: string }> = {
  competitor: { label: 'Competitor Watch', color: '#EF462F', bg: 'bg-red-50', text: 'text-red-600' },
  category:   { label: 'Category & Market', color: '#38C6F4', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  customer:   { label: 'Customer Intel', color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  martech:    { label: 'MarTech Radar', color: '#8B5CF6', bg: 'bg-violet-50', text: 'text-violet-600' },
};

const SECTION_META: Record<EditionSection, { label: string; emoji: string; order: number }> = {
  top_signal:  { label: 'Top Signal', emoji: '⚡', order: 0 },
  competitor:  { label: 'Competitor Watch', emoji: '👀', order: 1 },
  category:    { label: 'Category & Market', emoji: '📊', order: 2 },
  customer:    { label: 'Customer Intel', emoji: '🤝', order: 3 },
  martech:     { label: 'MarTech Radar', emoji: '🛰️', order: 4 },
  radar:       { label: 'On the Radar', emoji: '📡', order: 5 },
};

// ── Post mini card for edition view ──────────────────────────────────────

function EditionPostCard({ post }: { post: InsiderPost }) {
  const meta = CATEGORY_META[post.category];
  const relevanceColor =
    post.relevance_score >= 8 ? 'bg-red-500' :
    post.relevance_score >= 6 ? 'bg-amber-400' :
    'bg-slate-300';

  return (
    <Link
      href={`/insider/posts/${post.slug}`}
      className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
    >
      {/* Relevance dot */}
      <div className="mt-1 shrink-0">
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full ${relevanceColor}`}
          title={`Relevance: ${post.relevance_score}/10`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${meta.bg} ${meta.text}`}
          >
            {meta.label}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 group-hover:text-ironmark-red transition-colors text-sm leading-snug">
          {post.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{post.summary}</p>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
          <span>{post.source_name}</span>
          <span>·</span>
          <span>{new Date(post.source_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <ChevronRight size={14} className="text-slate-300 group-hover:text-ironmark-red transition-colors shrink-0 mt-1" />
    </Link>
  );
}

// ── Edition sections ──────────────────────────────────────────────────────

function EditionSections({ edition }: { edition: InsiderEdition }) {
  if (!edition.posts || edition.posts.length === 0) {
    return (
      <p className="text-slate-400 text-sm">No posts in this edition.</p>
    );
  }

  // Group posts by section
  const bySection = new Map<EditionSection, InsiderPost[]>();
  for (const ep of edition.posts) {
    if (!ep.post) { continue; }
    const existing = bySection.get(ep.section) ?? [];
    existing.push(ep.post);
    bySection.set(ep.section, existing);
  }

  // Sort sections by canonical order
  const sortedSections = [...bySection.entries()].sort(
    ([a], [b]) => SECTION_META[a].order - SECTION_META[b].order
  );

  return (
    <div className="space-y-8">
      {sortedSections.map(([section, posts]) => {
        const sm = SECTION_META[section];
        return (
          <section key={section}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{sm.emoji}</span>
              <h2 className="font-veneer text-xl text-slate-900 tracking-wide">{sm.label}</h2>
              <span className="text-xs text-slate-400 ml-1">({posts.length})</span>
            </div>
            <div className="space-y-3">
              {posts.map(post => (
                <EditionPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function EditionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const edition: InsiderEdition | null = await getEditionById(id, false);

  if (!edition) {
    notFound();
  }

  const postCount = edition.posts?.filter(ep => ep.post).length ?? 0;

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/insider/editions"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={14} />
        All editions
      </Link>

      {/* Edition header */}
      <header className="p-6 bg-slate-900 rounded-2xl text-white space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-veneer text-sm tracking-widest text-slate-400 uppercase">
            Edition #{edition.edition_number}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <CalendarDays size={11} />
            {new Date(edition.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {' – '}
            {new Date(edition.week_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="text-xs text-slate-400">{postCount} signals</span>
        </div>

        {edition.title && (
          <h1 className="font-veneer text-3xl tracking-wide leading-tight">
            {edition.title}
          </h1>
        )}

        {edition.executive_summary && (
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            {edition.executive_summary}
          </p>
        )}
      </header>

      {/* Data Point of the Week */}
      {edition.data_point_of_week && (
        <aside className="relative p-6 bg-gradient-to-br from-ironmark-cyan/10 to-blue-50 rounded-xl border border-ironmark-cyan/30">
          <div className="flex items-center gap-2 mb-3">
            <Quote size={16} className="text-ironmark-cyan" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Data Point of the Week
            </span>
          </div>
          <blockquote className="font-veneer text-2xl text-slate-900 tracking-wide leading-snug border-l-4 pl-4"
            style={{ borderColor: '#38C6F4' }}>
            {edition.data_point_of_week}
          </blockquote>
        </aside>
      )}

      {/* Posts by section */}
      <EditionSections edition={edition} />

      {/* Coming up */}
      {edition.coming_up && (
        <aside className="p-5 bg-violet-50 rounded-xl border border-violet-200">
          <div className="flex items-center gap-2 mb-2">
            <Telescope size={16} className="text-violet-600" />
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">
              Coming Up
            </span>
          </div>
          <p className="text-sm text-violet-900 leading-relaxed">
            {edition.coming_up}
          </p>
        </aside>
      )}

      {/* Footer nav */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Link
          href="/insider/editions"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          All editions
        </Link>
        <Link
          href="/insider"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          View all posts
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}

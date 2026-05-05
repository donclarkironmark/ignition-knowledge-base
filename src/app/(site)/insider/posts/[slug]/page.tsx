import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Quote } from 'lucide-react';
import { getPostBySlug } from '@/lib/insider.service';
import type { InsiderCategory, InsiderPost } from '@/config/insider.config';

// Supabase-backed — don't attempt static prerender at build time.
export const dynamic = 'force-dynamic';

// ── Category colors ───────────────────────────────────────────────────────

const CATEGORY_META: Record<InsiderCategory, { label: string; color: string; bg: string; text: string }> = {
  competitor: { label: 'Competitor Watch', color: '#E9472F', bg: 'bg-red-50', text: 'text-red-600' },
  category:   { label: 'Category & Market', color: '#38C6F4', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  customer:   { label: 'Customer Intel', color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  martech:    { label: 'MarTech Radar', color: '#8B5CF6', bg: 'bg-violet-50', text: 'text-violet-600' },
};

const DIMENSION_COLORS: Record<string, string> = {
  cdp:         'bg-blue-50 text-blue-700',
  automation:  'bg-orange-50 text-orange-700',
  campaigns:   'bg-pink-50 text-pink-700',
  storefront:  'bg-indigo-50 text-indigo-700',
  attribution: 'bg-purple-50 text-purple-700',
  dam:         'bg-teal-50 text-teal-700',
  reporting:   'bg-slate-100 text-slate-700',
};

// ── Relevance bar ─────────────────────────────────────────────────────────

function RelevanceBar({ score }: { score: number }) {
  const color =
    score >= 8 ? 'bg-red-500' :
    score >= 6 ? 'bg-amber-400' :
    'bg-slate-300';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 font-medium">Relevance</span>
      <div className="flex gap-0.5">
        {[1,2,3,4,5,6,7,8,9,10].map(i => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-sm transition-colors ${i <= score ? color : 'bg-slate-100'}`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700">{score}/10</span>
    </div>
  );
}

// ── Simple markdown renderer ──────────────────────────────────────────────

function renderMarkdown(md: string): string {
  return md
    // Headers
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-bold mt-4 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-ironmark-red hover:underline">$1</a>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-slate-300 pl-4 italic text-slate-600">$1</blockquote>')
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Wrap in opening paragraph
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, '</p>');
}

// ── generateMetadata ──────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found — Ignition Insider',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${post.title} — Ignition Insider`,
    description: post.summary,
    robots: { index: false, follow: false },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: InsiderPost | null = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const meta = CATEGORY_META[post.category];

  return (
    <article className="space-y-6">
      {/* Back */}
      <Link
        href="/insider"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to feed
      </Link>

      {/* Header */}
      <header className="space-y-4">
        {/* Category badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.text}`}
            style={{ borderLeft: `3px solid ${meta.color}` }}
          >
            {meta.label}
          </span>
          <RelevanceBar score={post.relevance_score} />
        </div>

        {/* Title */}
        <h1 className="font-veneer text-4xl text-slate-900 tracking-wide leading-tight">
          {post.title}
        </h1>

        {/* Summary */}
        <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-slate-200 pl-4">
          {post.summary}
        </p>

        {/* Source attribution */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ExternalLink size={13} />
          <a
            href={post.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ironmark-red hover:underline transition-colors font-medium"
          >
            {post.source_name}
          </a>
          <span>·</span>
          <time dateTime={post.source_date}>
            {new Date(post.source_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
          {post.published_at && (
            <>
              <span>·</span>
              <span className="text-slate-400">
                Published{' '}
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span
              key={tag.id}
              data-testid={`tag-${tag.name}`}
              className="inline-block px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-600 font-medium"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <hr className="border-slate-200" />

      {/* Body */}
      <div
        className="prose prose-slate max-w-none prose-headings:font-veneer prose-headings:tracking-wide prose-a:text-ironmark-red prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
      />

      {/* Editor's Note */}
      {post.admin_commentary && (
        <aside className="rounded-xl bg-amber-50 border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Quote size={16} className="text-amber-600" />
            <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">
              Editor&apos;s Note
            </span>
          </div>
          <blockquote className="text-sm text-amber-900 leading-relaxed italic">
            {post.admin_commentary}
          </blockquote>
        </aside>
      )}

      {/* Metadata chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Competitors mentioned */}
        {post.competitors_mentioned.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Competitors Mentioned
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.competitors_mentioned.map(c => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Customers mentioned */}
        {post.customers_mentioned.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Customers / Prospects
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.customers_mentioned.map(c => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Verticals */}
        {post.verticals.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Verticals
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.verticals.map(v => (
                <span
                  key={v}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ironmark dimensions */}
        {post.ironmark_dimensions.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Ironmark Capabilities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.ironmark_dimensions.map(d => (
                <span
                  key={d}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${DIMENSION_COLORS[d] ?? 'bg-slate-100 text-slate-700'}`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back link */}
      <div className="pt-4 border-t border-slate-200">
        <Link
          href="/insider"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to feed
        </Link>
      </div>
    </article>
  );
}

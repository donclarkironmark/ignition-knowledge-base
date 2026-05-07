'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pin, ExternalLink, ChevronRight, Mail, CheckCircle2 } from 'lucide-react';
import { INSIDER_CATEGORIES, type InsiderPost, type InsiderCategory } from '@/config/insider.config';

// ── Category badge colors ────────────────────────────────────────────────

export const CATEGORY_META: Record<InsiderCategory, { label: string; color: string; bg: string; text: string }> = {
  competitor: { label: 'Competitor Watch', color: '#E9472F', bg: 'bg-red-50', text: 'text-red-600' },
  category:   { label: 'Category & Market', color: '#38C6F4', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  customer:   { label: 'Customer Intel', color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  martech:    { label: 'MarTech Radar', color: '#8B5CF6', bg: 'bg-violet-50', text: 'text-violet-600' },
};

// ── Relevance dot ────────────────────────────────────────────────────────

export function RelevanceDot({ score }: { score: number }) {
  const color =
    score >= 8 ? 'bg-red-500' :
    score >= 6 ? 'bg-amber-400' :
    'bg-slate-300';
  const label = score >= 8 ? 'High' : score >= 6 ? 'Medium' : 'Low';

  return (
    <span className="flex items-center gap-1" title={`Relevance: ${score}/10 (${label})`}>
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-slate-400">{score}/10</span>
    </span>
  );
}

// ── Post card ─────────────────────────────────────────────────────────────

export function PostCard({ post }: { post: InsiderPost }) {
  const meta = CATEGORY_META[post.category];

  return (
    <article
      data-testid={`post-card-${post.slug}`}
      className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-5 flex flex-col gap-3 group"
    >
      {/* Top row: badge + pinned + relevance */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          data-testid={`tag-${post.category}`}
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.bg} ${meta.text}`}
          style={{ borderLeft: `3px solid ${meta.color}` }}
        >
          {meta.label}
        </span>
        <div className="flex items-center gap-3">
          {post.is_pinned && (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
              <Pin size={11} />
              Pinned
            </span>
          )}
          <RelevanceDot score={post.relevance_score} />
        </div>
      </div>

      {/* Title */}
      <Link href={`/insider/posts/${post.slug}`} className="group/title">
        <h2 className="font-veneer text-2xl text-slate-900 group-hover/title:text-ironmark-red transition-colors leading-tight">
          {post.title}
        </h2>
      </Link>

      {/* Summary */}
      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
        {post.summary}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 5).map(tag => (
            <span
              key={tag.id}
              data-testid={`tag-${tag.name}`}
              className="inline-block px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-500 font-medium"
            >
              #{tag.name}
            </span>
          ))}
          {post.tags.length > 5 && (
            <span className="inline-block px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-400">
              +{post.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Footer: source + date + read more */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ExternalLink size={11} />
          <span>{post.source_name}</span>
          <span>·</span>
          <span>{new Date(post.source_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <Link
          href={`/insider/posts/${post.slug}`}
          className="flex items-center gap-0.5 text-xs font-medium text-ironmark-red hover:text-red-700 transition-colors"
        >
          Read <ChevronRight size={12} />
        </Link>
      </div>
    </article>
  );
}

// ── Subscribe form ─────────────────────────────────────────────────────────

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [categories, setCategories] = useState<InsiderCategory[]>(['competitor', 'category', 'customer', 'martech']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function toggleCategory(cat: InsiderCategory) {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (categories.length === 0) {
      setErrorMsg('Select at least one category');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/insider/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, categories }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Subscription failed');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
        <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
        <div>
          <p className="font-semibold text-emerald-800">You&apos;re subscribed!</p>
          <p className="text-sm text-emerald-600 mt-0.5">Check your inbox for a confirmation email.</p>
        </div>
      </div>
    );
  }

  return (
    <form
      data-testid="subscribe-form"
      onSubmit={handleSubmit}
      className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white"
    >
      <div className="flex items-center gap-2 mb-1">
        <Mail size={18} className="text-ironmark-cyan" />
        <h3 className="font-veneer text-xl tracking-wide">Get the Weekly Digest</h3>
      </div>
      <p className="text-sm text-slate-400 mb-5">
        Competitive intelligence delivered every week. Pick your categories.
      </p>

      {/* Category checkboxes */}
      <div className="flex flex-wrap gap-2 mb-5">
        {INSIDER_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            type="button"
            onClick={() => toggleCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              categories.includes(cat.value)
                ? 'border-transparent text-white'
                : 'border-slate-600 text-slate-400 bg-transparent hover:border-slate-400'
            }`}
            style={categories.includes(cat.value) ? { backgroundColor: cat.color } : {}}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Email + submit */}
      <div className="flex gap-2">
        <input
          data-testid="subscribe-email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-ironmark-cyan transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 rounded-lg bg-ironmark-red hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors shrink-0"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>

      {status === 'error' && (
        <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
      )}
    </form>
  );
}

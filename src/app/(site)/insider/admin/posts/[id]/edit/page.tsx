'use client';

import { AdminGuard } from '@/components/AdminGuard';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Pin } from 'lucide-react';
import { toast } from 'sonner';
import { INSIDER_CATEGORIES, VALID_STATUS_TRANSITIONS, type InsiderPost, type InsiderTag, type InsiderCategory, type PostStatus } from '@/config/insider.config';

const IRONMARK_DIMENSIONS = ['cdp', 'automation', 'campaigns', 'storefront', 'attribution', 'dam', 'reporting'];
const VERTICALS = ['qsr', 'healthcare', 'automotive', 'financial-services', 'franchise'];

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Draft',
  review: 'Review',
  published: 'Published',
  archived: 'Archived',
};

const STATUS_COLORS: Record<PostStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  review: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-slate-100 text-slate-400',
};

const TRANSITION_BUTTON_STYLE: Record<PostStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  review: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  published: 'bg-emerald-600 text-white hover:bg-emerald-700',
  archived: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
};

function MultiCheckbox({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              selected.includes(opt)
                ? 'bg-[#E9472F] text-white border-[#E9472F]'
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function TagSelect({
  tags,
  selected,
  onChange,
}: {
  tags: InsiderTag[];
  selected: string[];
  onChange: (names: string[]) => void;
}) {
  function toggle(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter(n => n !== name));
    } else {
      onChange([...selected, name]);
    }
  }

  const grouped = tags.reduce<Record<string, InsiderTag[]>>((acc, tag) => {
    if (!acc[tag.tag_type]) { acc[tag.tag_type] = []; }
    acc[tag.tag_type].push(tag);
    return acc;
  }, {});

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
      {Object.entries(grouped).map(([type, typeTags]) => (
        <div key={type} className="mb-3">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">{type}</div>
          <div className="flex flex-wrap gap-1.5">
            {typeTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggle(tag.name)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                  selected.includes(tag.name)
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-5 h-5 border-2 border-slate-300 border-t-[#E9472F] rounded-full animate-spin" />
    </div>
  );
}

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const router = useRouter();

  const [post, setPost] = useState<InsiderPost | null>(null);
  const [allTags, setAllTags] = useState<InsiderTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [suggestingInsight, setSuggestingInsight] = useState(false);
  const [transitionLoading, setTransitionLoading] = useState<PostStatus | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<InsiderCategory>('competitor');
  const [relevanceScore, setRelevanceScore] = useState(5);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceDate, setSourceDate] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [adminCommentary, setAdminCommentary] = useState('');
  const [ironmarkDimensions, setIronmarkDimensions] = useState<string[]>([]);
  const [competitorsMentioned, setCompetitorsMentioned] = useState('');
  const [customersMentioned, setCustomersMentioned] = useState('');
  const [verticals, setVerticals] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from the list and find by id — no single-post GET endpoint in admin API
      const res = await fetch(`/api/insider/admin/posts?pageSize=50`);
      if (!res.ok) {
        toast.error('Failed to load posts');
        router.push('/insider/admin');
        return;
      }
      const listData = await res.json();
      const allPosts: InsiderPost[] = listData.posts ?? [];
      const data = allPosts.find(p => p.id === postId);

      if (!data) {
        toast.error('Post not found');
        router.push('/insider/admin');
        return;
      }

      setPost(data);
      setTitle(data.title);
      setSummary(data.summary);
      setBody(data.body);
      setCategory(data.category);
      setRelevanceScore(data.relevance_score);
      setSourceUrl(data.source_url);
      setSourceName(data.source_name);
      setSourceDate(data.source_date);
      setSelectedTags(data.tags?.map(t => t.name) ?? []);
      setAdminCommentary(data.admin_commentary ?? '');
      setIronmarkDimensions(data.ironmark_dimensions ?? []);
      setCompetitorsMentioned(data.competitors_mentioned?.join(', ') ?? '');
      setCustomersMentioned(data.customers_mentioned?.join(', ') ?? '');
      setVerticals(data.verticals ?? []);
      setIsPinned(data.is_pinned);

      // Extract unique tags from all posts for the tag selector
      const tagMap = new Map<string, InsiderTag>();
      for (const p of allPosts) {
        for (const t of p.tags ?? []) {
          tagMap.set(t.id, t);
        }
      }
      setAllTags(Array.from(tagMap.values()));
    } catch {
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId, router]);

  useEffect(() => {
    void loadPost();
  }, [loadPost]);

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/insider/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          body: body.trim(),
          category,
          relevance_score: relevanceScore,
          source_url: sourceUrl.trim(),
          source_name: sourceName.trim(),
          source_date: sourceDate,
          tags: selectedTags,
          admin_commentary: adminCommentary.trim() || undefined,
          ironmark_dimensions: ironmarkDimensions,
          competitors_mentioned: competitorsMentioned.split(',').map(s => s.trim()).filter(Boolean),
          customers_mentioned: customersMentioned.split(',').map(s => s.trim()).filter(Boolean),
          verticals,
          is_pinned: isPinned,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to save post');
        return;
      }
      toast.success('Post saved');
      await loadPost();
    } catch {
      toast.error('Failed to save post');
    } finally {
      setSubmitting(false);
    }
  }, [
    postId, title, summary, body, category, relevanceScore,
    sourceUrl, sourceName, sourceDate, selectedTags, adminCommentary,
    ironmarkDimensions, competitorsMentioned, customersMentioned, verticals,
    isPinned, loadPost,
  ]);

  const handleStatusTransition = useCallback(async (newStatus: PostStatus) => {
    setTransitionLoading(newStatus);
    try {
      const res = await fetch(`/api/insider/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to update status');
        return;
      }
      toast.success(`Status updated to ${STATUS_LABELS[newStatus]}`);
      await loadPost();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setTransitionLoading(null);
    }
  }, [postId, loadPost]);

  const handleSuggestInsight = useCallback(async () => {
    if (!body.trim()) {
      toast.error('Add post body before generating insight');
      return;
    }
    setSuggestingInsight(true);
    try {
      const res = await fetch('/api/insider/admin/suggest-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: body.trim(),
          category,
          competitors_mentioned: competitorsMentioned.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to generate insight');
        return;
      }
      const data = await res.json();
      setAdminCommentary(data.suggestion ?? '');
      toast.success('Insight generated — review and edit before saving');
    } catch {
      toast.error('Failed to generate insight');
    } finally {
      setSuggestingInsight(false);
    }
  }, [body, category, competitorsMentioned]);

  const handlePinToggle = useCallback(async () => {
    const newPinned = !isPinned;
    try {
      const res = await fetch(`/api/insider/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pinned: newPinned }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to update pin');
        return;
      }
      setIsPinned(newPinned);
      toast.success(newPinned ? 'Post pinned' : 'Post unpinned');
    } catch {
      toast.error('Failed to update pin');
    }
  }, [postId, isPinned]);

  if (loading) {
    return (
      <AdminGuard>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Spinner />
        </div>
      </AdminGuard>
    );
  }

  if (!post) { return null; }

  const validTransitions = VALID_STATUS_TRANSITIONS[post.status];

  return (
    <AdminGuard>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link href="/insider/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Edit Post</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[post.status]}`}>
                  {STATUS_LABELS[post.status]}
                </span>
                <span className="text-xs text-slate-400">Created {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Pin toggle + status transitions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              data-testid={`pin-toggle-${post.id}`}
              type="button"
              onClick={handlePinToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isPinned
                  ? 'bg-[#E9472F] text-white border-[#E9472F]'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              <Pin size={12} />
              {isPinned ? 'Pinned' : 'Pin'}
            </button>

            {validTransitions.map(targetStatus => (
              <button
                key={targetStatus}
                type="button"
                onClick={() => handleStatusTransition(targetStatus)}
                disabled={transitionLoading !== null}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${TRANSITION_BUTTON_STYLE[targetStatus]}`}
              >
                {transitionLoading === targetStatus ? '...' : `→ ${STATUS_LABELS[targetStatus]}`}
              </button>
            ))}
          </div>
        </div>

        {/* Review notes (if in review) */}
        {post.review_notes && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Review Notes</div>
            <p className="text-sm text-amber-800">{post.review_notes}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title <span className="text-[#E9472F]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Summary <span className="text-[#E9472F]">*</span>
            </label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent resize-none"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Body (Markdown) <span className="text-[#E9472F]">*</span>
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              rows={14}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent resize-y"
            />
          </div>

          {/* Category + Score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category <span className="text-[#E9472F]">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as InsiderCategory)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent bg-white"
              >
                {INSIDER_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Relevance Score: <span className="font-bold text-slate-900">{relevanceScore}</span>/10
                <span className="text-[#E9472F]"> *</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={relevanceScore}
                onChange={e => setRelevanceScore(Number(e.target.value))}
                className="w-full accent-[#E9472F]"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>1 (Low)</span>
                <span className="text-amber-600">7+ auto-publishes</span>
                <span>10 (Critical)</span>
              </div>
            </div>
          </div>

          {/* Source fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Source URL <span className="text-[#E9472F]">*</span>
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Source Name <span className="text-[#E9472F]">*</span>
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={e => setSourceName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent"
              />
            </div>
          </div>

          <div className="sm:w-1/2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Source Date <span className="text-[#E9472F]">*</span>
            </label>
            <input
              type="date"
              value={sourceDate}
              onChange={e => setSourceDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent"
            />
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <TagSelect tags={allTags} selected={selectedTags} onChange={setSelectedTags} />
          )}

          {/* Admin Commentary + Suggest button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Admin Commentary <span className="text-slate-400 font-normal">(&ldquo;So What for Ironmark&rdquo;)</span>
              </label>
              <button
                data-testid="suggest-insight"
                type="button"
                onClick={handleSuggestInsight}
                disabled={suggestingInsight}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                <Sparkles size={12} />
                {suggestingInsight ? 'Generating...' : 'Suggest Insight'}
              </button>
            </div>
            <textarea
              value={adminCommentary}
              onChange={e => setAdminCommentary(e.target.value)}
              rows={4}
              placeholder="Strategic take on what this means for Ironmark..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent resize-none"
            />
          </div>

          {/* Ironmark Dimensions */}
          <MultiCheckbox
            label="Ironmark Dimensions"
            options={IRONMARK_DIMENSIONS}
            selected={ironmarkDimensions}
            onChange={setIronmarkDimensions}
          />

          {/* Verticals */}
          <MultiCheckbox
            label="Verticals"
            options={VERTICALS}
            selected={verticals}
            onChange={setVerticals}
          />

          {/* Competitors / Customers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Competitors Mentioned <span className="text-slate-400 font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={competitorsMentioned}
                onChange={e => setCompetitorsMentioned(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Customers Mentioned <span className="text-slate-400 font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={customersMentioned}
                onChange={e => setCustomersMentioned(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent"
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#E9472F] text-white text-sm font-medium rounded-lg hover:bg-[#d33e29] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/insider/admin"
              className="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}

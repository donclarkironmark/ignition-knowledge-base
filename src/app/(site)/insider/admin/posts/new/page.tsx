'use client';

import { AdminGuard } from '@/components/AdminGuard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { INSIDER_CATEGORIES, type InsiderTag, type InsiderCategory } from '@/config/insider.config';

const IRONMARK_DIMENSIONS = ['cdp', 'automation', 'campaigns', 'storefront', 'attribution', 'dam', 'reporting'];
const VERTICALS = ['qsr', 'healthcare', 'automotive', 'financial-services', 'franchise'];

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

export default function NewPostPage() {
  const router = useRouter();
  const [tags, setTags] = useState<InsiderTag[]>([]);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('/api/insider/admin/posts?pageSize=50');
        if (!res.ok) { return; }
        const data = await res.json();
        const tagMap = new Map<string, InsiderTag>();
        for (const post of (data.posts ?? []) as { tags?: InsiderTag[] }[]) {
          for (const tag of post.tags ?? []) {
            tagMap.set(tag.id, tag);
          }
        }
        setTags(Array.from(tagMap.values()));
      } catch {
        // Tags load is best-effort — form works without them
      }
    }
    void fetchTags();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !body.trim() || !sourceUrl.trim() || !sourceName.trim() || !sourceDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/insider/admin/posts', {
        method: 'POST',
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
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to create post');
        return;
      }

      const result = await res.json();
      if ('action' in result && result.action === 'skipped') {
        toast.warning('Post skipped — duplicate source URL already exists');
        router.push('/insider/admin');
        return;
      }

      toast.success('Post created');
      router.push('/insider/admin');
    } catch {
      toast.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminGuard>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/insider/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">New Post</h1>
            <p className="text-sm text-slate-500 mt-0.5">Create a new intelligence post</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="e.g. SOCi raises $50M Series D to expand AI-driven local marketing"
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
              placeholder="1-2 sentence summary of the signal"
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
              rows={12}
              placeholder="Full analysis in Markdown. Include a ## So What for Ironmark section."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent resize-y"
            />
          </div>

          {/* Category + Relevance Score */}
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
                placeholder="https://techcrunch.com/..."
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
                placeholder="TechCrunch"
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
          {tags.length > 0 && (
            <TagSelect tags={tags} selected={selectedTags} onChange={setSelectedTags} />
          )}

          {/* Admin Commentary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Admin Commentary <span className="text-slate-400 font-normal">(optional &mdash; &ldquo;So What for Ironmark&rdquo;)</span>
            </label>
            <textarea
              value={adminCommentary}
              onChange={e => setAdminCommentary(e.target.value)}
              rows={3}
              placeholder="Editor's strategic take on what this means for Ironmark..."
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
                placeholder="soci, chatmeter, yext"
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
                placeholder="The Joint Chiropractic"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#E9472F] text-white text-sm font-medium rounded-lg hover:bg-[#d33e29] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Post'}
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

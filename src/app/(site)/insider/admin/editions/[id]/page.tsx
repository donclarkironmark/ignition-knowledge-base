'use client';

import { AdminGuard } from '@/components/AdminGuard';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { VALID_EDITION_SECTIONS, type InsiderEdition, type InsiderPost, type EditionSection } from '@/config/insider.config';

const SECTION_LABELS: Record<EditionSection, string> = {
  top_signal: 'Top Signal',
  competitor: 'Competitor Watch',
  category: 'Category & Market',
  customer: 'Customer & Prospect Intel',
  martech: 'MarTech Radar',
  radar: 'On the Radar',
};

type PostAssignment = {
  post_id: string;
  section: EditionSection;
  display_order: number;
};

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-5 h-5 border-2 border-slate-300 border-t-[#E9472F] rounded-full animate-spin" />
    </div>
  );
}

export default function EditionEditorPage() {
  const params = useParams();
  const editionId = params.id as string;

  const [edition, setEdition] = useState<InsiderEdition | null>(null);
  const [publishedPosts, setPublishedPosts] = useState<InsiderPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Edition metadata fields
  const [edTitle, setEdTitle] = useState('');
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [dataPointOfWeek, setDataPointOfWeek] = useState('');
  const [comingUp, setComingUp] = useState('');

  // Post assignments: post_id -> { section, display_order }
  const [assignments, setAssignments] = useState<PostAssignment[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [editionsRes, postsRes] = await Promise.all([
        fetch('/api/insider/admin/editions'),
        fetch('/api/insider/admin/posts?status=published&pageSize=50'),
      ]);

      if (editionsRes.ok) {
        const allEditions: InsiderEdition[] = await editionsRes.json();
        const found = allEditions.find(e => e.id === editionId);
        if (found) {
          setEdition(found);
          setEdTitle(found.title ?? '');
          setExecutiveSummary(found.executive_summary ?? '');
          setDataPointOfWeek(found.data_point_of_week ?? '');
          setComingUp(found.coming_up ?? '');

          // Populate current assignments from edition.posts
          const currentAssignments: PostAssignment[] = (found.posts ?? []).map(ep => ({
            post_id: ep.post_id,
            section: ep.section,
            display_order: ep.display_order,
          }));
          setAssignments(currentAssignments);
        } else {
          toast.error('Edition not found');
        }
      }

      if (postsRes.ok) {
        const data = await postsRes.json();
        setPublishedPosts(data.posts ?? []);
      }
    } catch {
      toast.error('Failed to load edition data');
    } finally {
      setLoading(false);
    }
  }, [editionId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const getAssignment = (postId: string): PostAssignment | undefined =>
    assignments.find(a => a.post_id === postId);

  const handleSectionChange = (postId: string, section: EditionSection | '') => {
    if (!section) {
      // Remove from edition
      setAssignments(prev => prev.filter(a => a.post_id !== postId));
      return;
    }
    const existing = assignments.find(a => a.post_id === postId);
    if (existing) {
      setAssignments(prev =>
        prev.map(a => a.post_id === postId ? { ...a, section: section as EditionSection } : a),
      );
    } else {
      // Add with next display_order
      const maxOrder = assignments.filter(a => a.section === section).length;
      setAssignments(prev => [
        ...prev,
        { post_id: postId, section: section as EditionSection, display_order: maxOrder },
      ]);
    }
  };

  const handleOrderChange = (postId: string, order: number) => {
    setAssignments(prev =>
      prev.map(a => a.post_id === postId ? { ...a, display_order: order } : a),
    );
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/insider/admin/editions/${editionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: edTitle.trim() || undefined,
          executive_summary: executiveSummary.trim() || undefined,
          data_point_of_week: dataPointOfWeek.trim() || undefined,
          coming_up: comingUp.trim() || undefined,
          posts: assignments,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to save edition');
        return;
      }
      toast.success('Edition saved');
      await loadData();
    } catch {
      toast.error('Failed to save edition');
    } finally {
      setSaving(false);
    }
  }, [editionId, edTitle, executiveSummary, dataPointOfWeek, comingUp, assignments, loadData]);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/insider/admin/editions/${editionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: edTitle.trim() || undefined,
          executive_summary: executiveSummary.trim() || undefined,
          data_point_of_week: dataPointOfWeek.trim() || undefined,
          coming_up: comingUp.trim() || undefined,
          posts: assignments,
          status: 'published',
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to publish edition');
        return;
      }
      toast.success('Edition published');
      await loadData();
    } catch {
      toast.error('Failed to publish edition');
    } finally {
      setPublishing(false);
    }
  }, [editionId, edTitle, executiveSummary, dataPointOfWeek, comingUp, assignments, loadData]);

  if (loading) {
    return (
      <AdminGuard>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Spinner />
        </div>
      </AdminGuard>
    );
  }

  if (!edition) { return null; }

  const isPublished = edition.status === 'published';

  // Group assignments by section for display
  const assignedBySection = VALID_EDITION_SECTIONS.reduce<Record<EditionSection, InsiderPost[]>>(
    (acc, section) => {
      const sectionAssignments = assignments
        .filter(a => a.section === section)
        .sort((a, b) => a.display_order - b.display_order);
      acc[section] = sectionAssignments
        .map(a => publishedPosts.find(p => p.id === a.post_id))
        .filter((p): p is InsiderPost => p !== undefined);
      return acc;
    },
    {} as Record<EditionSection, InsiderPost[]>,
  );

  const unassignedPosts = publishedPosts.filter(p => !assignments.some(a => a.post_id === p.id));

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
              <h1 className="text-2xl font-bold text-slate-900">
                Edition #{edition.edition_number}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isPublished ? 'Published' : 'Draft'}
                </span>
                <span className="text-xs text-slate-400">
                  {edition.week_start} – {edition.week_end}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || isPublished}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            {!isPublished && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E9472F] text-white text-sm font-medium rounded-lg hover:bg-[#d33e29] disabled:opacity-50 transition-colors"
              >
                <Globe size={14} />
                {publishing ? 'Publishing...' : 'Publish Edition'}
              </button>
            )}
          </div>
        </div>

        {isPublished && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
            This edition was published on {edition.published_at ? new Date(edition.published_at).toLocaleDateString() : 'unknown date'}.
            Editing is disabled for published editions.
          </div>
        )}

        {/* Edition metadata */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Edition Details</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Edition Title</label>
            <input
              type="text"
              value={edTitle}
              onChange={e => setEdTitle(e.target.value)}
              disabled={isPublished}
              placeholder={`Ignition Insider — Week of ${edition.week_start}`}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Executive Summary</label>
            <textarea
              value={executiveSummary}
              onChange={e => setExecutiveSummary(e.target.value)}
              disabled={isPublished}
              rows={4}
              placeholder="This week's key themes and what they mean for Ironmark..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Data Point of the Week</label>
            <textarea
              value={dataPointOfWeek}
              onChange={e => setDataPointOfWeek(e.target.value)}
              disabled={isPublished}
              rows={2}
              placeholder="A compelling stat or figure from this week's research..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Coming Up</label>
            <textarea
              value={comingUp}
              onChange={e => setComingUp(e.target.value)}
              disabled={isPublished}
              rows={2}
              placeholder="Upcoming events, report drops, or trends to watch..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E9472F] focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>

        {/* Post assignment panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Post Assignments</h2>

          {/* All published posts — assign to sections */}
          {publishedPosts.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No published posts available to assign.</p>
          ) : (
            <div className="space-y-3">
              {publishedPosts.map(post => {
                const assignment = getAssignment(post.id);
                return (
                  <div key={post.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-slate-400">{post.category} · Score: {post.relevance_score}/10</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select
                        value={assignment?.section ?? ''}
                        onChange={e => handleSectionChange(post.id, e.target.value as EditionSection | '')}
                        disabled={isPublished}
                        className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E9472F] bg-white disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="">— Not assigned —</option>
                        {VALID_EDITION_SECTIONS.map(s => (
                          <option key={s} value={s}>{SECTION_LABELS[s]}</option>
                        ))}
                      </select>
                      {assignment && (
                        <input
                          type="number"
                          min={0}
                          value={assignment.display_order}
                          onChange={e => handleOrderChange(post.id, parseInt(e.target.value, 10) || 0)}
                          disabled={isPublished}
                          title="Display order"
                          className="w-14 px-2 py-1 border border-slate-300 rounded text-xs text-slate-700 text-center focus:outline-none focus:ring-1 focus:ring-[#E9472F] disabled:bg-slate-50 disabled:text-slate-400"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Section Preview</h2>
          {VALID_EDITION_SECTIONS.map(section => {
            const sectionPosts = assignedBySection[section] ?? [];
            if (sectionPosts.length === 0) { return null; }
            return (
              <div key={section} className="mb-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {SECTION_LABELS[section]} ({sectionPosts.length})
                </div>
                <ul className="space-y-1">
                  {sectionPosts.map(post => (
                    <li key={post.id} className="text-sm text-slate-700 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#E9472F] text-white text-[9px] flex items-center justify-center flex-shrink-0">
                        {(assignments.find(a => a.post_id === post.id)?.display_order ?? 0) + 1}
                      </span>
                      {post.title}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {unassignedPosts.length > 0 && (
            <p className="text-xs text-slate-400 mt-2">
              {unassignedPosts.length} published post{unassignedPosts.length !== 1 ? 's' : ''} not assigned to this edition.
            </p>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}

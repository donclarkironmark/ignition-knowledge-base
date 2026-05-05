'use client';

import { AdminGuard } from '@/components/AdminGuard';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Archive, Pin, CheckCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { INSIDER_CATEGORIES, VALID_STATUS_TRANSITIONS, type InsiderPost, type InsiderEdition, type PostStatus } from '@/config/insider.config';

type TabId = 'all' | 'review' | 'editions';

const STATUS_COLORS: Record<PostStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  review: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-slate-100 text-slate-400',
};

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Draft',
  review: 'Review',
  published: 'Published',
  archived: 'Archived',
};

function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      data-testid={`status-badge-${status}`}
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const cat = INSIDER_CATEGORIES.find(c => c.value === category);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: `${cat?.color ?? '#707070'}20`, color: cat?.color ?? '#707070' }}
    >
      {cat?.label ?? category}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-5 h-5 border-2 border-slate-300 border-t-[#E9472F] rounded-full animate-spin" />
    </div>
  );
}

export default function InsiderAdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [posts, setPosts] = useState<InsiderPost[]>([]);
  const [reviewPosts, setReviewPosts] = useState<InsiderPost[]>([]);
  const [editions, setEditions] = useState<InsiderEdition[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<PostStatus, number>>({
    draft: 0,
    review: 0,
    published: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [allRes, reviewRes, editionsRes] = await Promise.all([
        fetch('/api/insider/admin/posts?pageSize=50'),
        fetch('/api/insider/admin/posts?status=review&pageSize=50'),
        fetch('/api/insider/admin/editions'),
      ]);

      if (allRes.ok) {
        const data = await allRes.json();
        setPosts(data.posts ?? []);
        // Compute counts from the full list
        const counts: Record<PostStatus, number> = { draft: 0, review: 0, published: 0, archived: 0 };
        for (const post of (data.posts ?? []) as InsiderPost[]) {
          counts[post.status] = (counts[post.status] ?? 0) + 1;
        }
        setStatusCounts(counts);
      }
      if (reviewRes.ok) {
        const data = await reviewRes.json();
        setReviewPosts(data.posts ?? []);
      }
      if (editionsRes.ok) {
        const data = await editionsRes.json();
        setEditions(data ?? []);
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleStatusTransition = useCallback(async (postId: string, newStatus: PostStatus) => {
    setActionLoading(postId);
    try {
      const res = await fetch(`/api/insider/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to update post');
        return;
      }
      toast.success(`Post ${newStatus === 'published' ? 'approved' : 'returned to draft'}`);
      await fetchData();
    } catch {
      toast.error('Failed to update post');
    } finally {
      setActionLoading(null);
    }
  }, [fetchData]);

  const handleArchive = useCallback(async (postId: string, currentStatus: PostStatus) => {
    if (!VALID_STATUS_TRANSITIONS[currentStatus].includes('archived')) {
      toast.error('Cannot archive from current status');
      return;
    }
    setActionLoading(postId);
    try {
      const res = await fetch(`/api/insider/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to archive post');
        return;
      }
      toast.success('Post archived');
      await fetchData();
    } catch {
      toast.error('Failed to archive post');
    } finally {
      setActionLoading(null);
    }
  }, [fetchData]);

  const handlePin = useCallback(async (postId: string, currentlyPinned: boolean) => {
    setActionLoading(postId);
    try {
      const res = await fetch(`/api/insider/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pinned: !currentlyPinned }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to update pin');
        return;
      }
      toast.success(currentlyPinned ? 'Post unpinned' : 'Post pinned');
      await fetchData();
    } catch {
      toast.error('Failed to update pin');
    } finally {
      setActionLoading(null);
    }
  }, [fetchData]);

  const handleCreateEdition = useCallback(async () => {
    const today = new Date();
    const weekStart = today.toISOString().split('T')[0];
    const weekEndDate = new Date(today);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const weekEnd = weekEndDate.toISOString().split('T')[0];

    try {
      const res = await fetch('/api/insider/admin/editions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week_start: weekStart, week_end: weekEnd, posts: [] }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(err.error ?? 'Failed to create edition');
        return;
      }
      const edition: InsiderEdition = await res.json();
      toast.success('Edition created');
      window.location.href = `/insider/admin/editions/${edition.id}`;
    } catch {
      toast.error('Failed to create edition');
    }
  }, []);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'all', label: 'All Posts' },
    { id: 'review', label: `Review Queue${reviewPosts.length > 0 ? ` (${reviewPosts.length})` : ''}` },
    { id: 'editions', label: 'Editions' },
  ];

  return (
    <AdminGuard>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ignition Insider</h1>
            <p className="text-sm text-slate-500 mt-1">Competitive intelligence editorial dashboard</p>
          </div>
          <Link
            href="/insider/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#E9472F] text-white text-sm font-medium rounded-lg hover:bg-[#d33e29] transition-colors"
          >
            <Plus size={16} />
            New Post
          </Link>
        </div>

        {/* Status count cards */}
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {(['draft', 'review', 'published', 'archived'] as PostStatus[]).map(status => (
                <div
                  key={status}
                  data-testid={`status-count-${status}`}
                  className="bg-white rounded-xl border border-slate-200 p-4"
                >
                  <div className="text-2xl font-bold text-slate-900">{statusCounts[status]}</div>
                  <div className="text-xs text-slate-500 mt-0.5 capitalize">{STATUS_LABELS[status]}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200 mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#E9472F] border-b-2 border-[#E9472F] -mb-px'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* All Posts Tab */}
            {activeTab === 'all' && (
              <PostTable
                posts={posts}
                actionLoading={actionLoading}
                onArchive={handleArchive}
                onPin={handlePin}
              />
            )}

            {/* Review Queue Tab */}
            {activeTab === 'review' && (
              <ReviewQueue
                posts={reviewPosts}
                actionLoading={actionLoading}
                onApprove={(id) => handleStatusTransition(id, 'published')}
                onReturnDraft={(id) => handleStatusTransition(id, 'draft')}
              />
            )}

            {/* Editions Tab */}
            {activeTab === 'editions' && (
              <EditionsTab
                editions={editions}
                onCreateEdition={handleCreateEdition}
              />
            )}
          </>
        )}
      </div>
    </AdminGuard>
  );
}

function PostTable({
  posts,
  actionLoading,
  onArchive,
  onPin,
}: {
  posts: InsiderPost[];
  actionLoading: string | null;
  onArchive: (id: string, status: PostStatus) => void;
  onPin: (id: string, pinned: boolean) => void;
}) {
  if (posts.length === 0) {
    return <p className="text-sm text-slate-400 py-8 text-center">No posts yet.</p>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Title</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Category</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Score</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Published</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {posts.map(post => (
            <tr key={post.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {post.is_pinned && <Pin size={12} className="text-[#E9472F] flex-shrink-0" />}
                  <span className="font-medium text-slate-900 line-clamp-1">{post.title}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <CategoryBadge category={post.category} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={post.status} />
              </td>
              <td className="px-4 py-3 text-slate-600">{post.relevance_score}/10</td>
              <td className="px-4 py-3 text-slate-400 text-xs">
                {post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/insider/admin/posts/${post.id}/edit`}
                    className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </Link>
                  <button
                    data-testid={`pin-toggle-${post.id}`}
                    onClick={() => onPin(post.id, post.is_pinned)}
                    disabled={actionLoading === post.id}
                    className={`p-1.5 transition-colors ${post.is_pinned ? 'text-[#E9472F]' : 'text-slate-400 hover:text-slate-700'}`}
                    title={post.is_pinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin size={14} />
                  </button>
                  {VALID_STATUS_TRANSITIONS[post.status].includes('archived') && (
                    <button
                      onClick={() => onArchive(post.id, post.status)}
                      disabled={actionLoading === post.id}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Archive"
                    >
                      <Archive size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReviewQueue({
  posts,
  actionLoading,
  onApprove,
  onReturnDraft,
}: {
  posts: InsiderPost[];
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onReturnDraft: (id: string) => void;
}) {
  if (posts.length === 0) {
    return <p className="text-sm text-slate-400 py-8 text-center">No posts in review queue.</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CategoryBadge category={post.category} />
                <span className="text-xs text-slate-400">Score: {post.relevance_score}/10</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{post.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{post.summary}</p>
              {post.review_notes && (
                <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-700">
                  <span className="font-medium">Review notes:</span> {post.review_notes}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                data-testid={`approve-${post.id}`}
                onClick={() => onApprove(post.id)}
                disabled={actionLoading === post.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <CheckCircle size={13} />
                Approve
              </button>
              <button
                data-testid={`return-draft-${post.id}`}
                onClick={() => onReturnDraft(post.id)}
                disabled={actionLoading === post.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                <RotateCcw size={13} />
                Return to Draft
              </button>
              <Link
                href={`/insider/admin/posts/${post.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors text-center"
              >
                <Edit2 size={13} />
                Edit
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EditionsTab({
  editions,
  onCreateEdition,
}: {
  editions: InsiderEdition[];
  onCreateEdition: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-slate-700">All Editions</h2>
        <button
          onClick={onCreateEdition}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E9472F] text-white text-xs font-medium rounded-lg hover:bg-[#d33e29] transition-colors"
        >
          <Plus size={13} />
          New Edition
        </button>
      </div>

      {editions.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">No editions yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Week</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {editions.map(edition => (
                <tr key={edition.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{edition.edition_number}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {edition.title ?? <span className="text-slate-400 italic">Untitled</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {edition.week_start} – {edition.week_end}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      edition.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {edition.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/insider/admin/editions/${edition.id}`}
                      className="text-xs text-[#E9472F] hover:underline font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

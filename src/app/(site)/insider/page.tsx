'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import { INSIDER_CATEGORIES, POSTS_PER_PAGE, type InsiderPost, type InsiderCategory, type PostListResponse } from '@/config/insider.config';
import { PostCard, SubscribeForm } from './components';

export default function InsiderIndexPage() {
  const [posts, setPosts] = useState<InsiderPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<InsiderCategory | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) { clearTimeout(debounceRef.current); }
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 350);
    return () => {
      if (debounceRef.current) { clearTimeout(debounceRef.current); }
    };
  }, [search]);

  const fetchPosts = useCallback(async (p: number, append = false) => {
    if (append) { setLoadingMore(true); } else { setLoading(true); }

    try {
      const params = new URLSearchParams({ page: String(p), pageSize: String(POSTS_PER_PAGE) });
      if (activeCategory) { params.set('category', activeCategory); }
      if (debouncedSearch) { params.set('search', debouncedSearch); }

      const res = await fetch(`/api/insider/posts?${params}`);
      const data: PostListResponse = await res.json();

      if (append) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setTotal(data.total);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, debouncedSearch]);

  // Refetch when filters or search change
  useEffect(() => {
    setPage(1);
    void fetchPosts(1, false);
  }, [activeCategory, debouncedSearch, fetchPosts]);

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    void fetchPosts(nextPage, true);
  }

  const hasMore = posts.length < total;
  const pinnedPosts = posts.filter(p => p.is_pinned);
  const regularPosts = posts.filter(p => !p.is_pinned);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div>
        <h1 className="font-veneer text-4xl text-slate-900 tracking-wide mb-1">
          Competitive Intelligence Feed
        </h1>
        <p className="text-slate-500 text-sm">
          Signals that matter for Ironmark&apos;s platform play. Updated weekly.
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          <button
            data-testid="filter-all"
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === null
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            All
          </button>
          {INSIDER_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              data-testid={`filter-${cat.value}`}
              onClick={() => setActiveCategory(activeCategory === cat.value ? null : cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === cat.value
                  ? 'text-white border-transparent'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
              style={activeCategory === cat.value ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center shrink-0 w-52 bg-white border border-slate-200 rounded-lg focus-within:border-slate-400 transition-colors">
          <Search size={14} aria-hidden="true" className="ml-3 shrink-0 text-slate-400" />
          <input
            data-testid="search-input"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="flex-1 min-w-0 bg-transparent pl-2 pr-3 py-2 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Post list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 h-40 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-veneer tracking-wide mb-2">No posts found</p>
          <p className="text-sm">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pinnedPosts.map(post => <PostCard key={post.id} post={post} />)}
          {regularPosts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && (
        <div className="flex justify-center">
          <button
            data-testid="load-more"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-400 hover:shadow-sm disabled:opacity-50 transition-all"
          >
            {loadingMore ? 'Loading…' : `Load more (${total - posts.length} remaining)`}
          </button>
        </div>
      )}

      {/* Subscribe */}
      <SubscribeForm />
    </div>
  );
}

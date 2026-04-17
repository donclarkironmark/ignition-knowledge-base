/**
 * GET /api/insider/posts — Public post listing
 *
 * No auth required. Supports pagination, category filter, tag filter, search.
 * Returns only published posts, pinned first.
 * Adds X-Robots-Tag: noindex, nofollow to response.
 */

// @auth public — Ignition Insider is a gated-by-design newsletter. Posts are published intentionally public; RLS enforces status='published' at the DB layer.
import { NextRequest, NextResponse } from 'next/server';
import { getPublicPosts } from '@/lib/insider.service';
import type { InsiderCategory } from '@/config/insider.config';

const ROBOTS_HEADERS = { 'X-Robots-Tag': 'noindex, nofollow' };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10) || 10));
  const category = searchParams.get('category') as InsiderCategory | null;
  const tags = searchParams.getAll('tag').filter(Boolean);
  const search = searchParams.get('search') ?? undefined;

  const result = await getPublicPosts({
    page,
    pageSize,
    category: category ?? undefined,
    tags: tags.length > 0 ? tags : undefined,
    search,
  });

  return NextResponse.json(result, { headers: ROBOTS_HEADERS });
}

/**
 * GET /api/insider/posts/[slug] — Public post detail
 *
 * No auth required. Returns 404 if post not found or not published.
 * Adds X-Robots-Tag: noindex, nofollow to response.
 */

// @auth public — Post detail is intentionally public; RLS enforces status='published' at the DB layer.
import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/insider.service';

const ROBOTS_HEADERS = { 'X-Robots-Tag': 'noindex, nofollow' };

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404, headers: ROBOTS_HEADERS },
    );
  }

  return NextResponse.json(post, { headers: ROBOTS_HEADERS });
}

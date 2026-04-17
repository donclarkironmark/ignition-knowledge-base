/**
 * GET  /api/insider/admin/posts — Admin post listing (secureRoute, admin)
 * POST /api/insider/admin/posts — Create post (dual auth: service token OR admin session)
 *
 * GET: Returns all posts across statuses (filtered by status param if provided).
 * POST: Dual-auth pattern — checks Authorization: Bearer <INSIDER_SERVICE_TOKEN> first,
 *       falls through to secureRoute admin auth if no service token present.
 *       Auto-publishes or queues for review per spec S-39. Fires alert emails if
 *       auto-published and meets alert criteria (S-70, fire-and-forget).
 */

import { NextRequest, NextResponse } from 'next/server';
import { secureRoute } from '@/lib/secure-route';
import { createPost, getAdminPosts, fireAlertEmails, checkAlertCriteria } from '@/lib/insider.service';
import type { CreatePostRequest, PostStatus } from '@/config/insider.config';

// ── GET: Admin post listing ──────────────────────────────────────────────────

export const GET = secureRoute(
  async (request) => {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') as PostStatus | null;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10) || 10));

    const result = await getAdminPosts({
      page,
      pageSize,
      status: status ?? undefined,
    });

    return NextResponse.json(result);
  },
  { require: 'admin' },
);

// ── POST: Create post (dual auth) ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Check service token first (S-68)
  const authHeader = request.headers.get('authorization');
  const serviceToken = process.env.INSIDER_SERVICE_TOKEN;

  if (authHeader && serviceToken && authHeader === `Bearer ${serviceToken}`) {
    return handleCreatePost(request, null);
  }

  // Fall through to secureRoute admin auth
  const secureHandler = secureRoute(
    async (req, ctx) => handleCreatePost(req, ctx.userId),
    { require: 'admin' },
  );

  return secureHandler(request);
}

async function handleCreatePost(
  request: NextRequest,
  createdBy: string | null,
): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const data = body as CreatePostRequest;

  if (
    !data.title ||
    !data.summary ||
    !data.body ||
    !data.category ||
    !data.source_url ||
    !data.source_name ||
    !data.source_date
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const result = await createPost(data, createdBy);

  // Idempotent skip — duplicate source_url
  if ('action' in result) {
    return NextResponse.json(result, { status: 200 });
  }

  const { post, autoPublishResult } = result;

  // Fire alert emails if auto-published and meets alert criteria (fire-and-forget, S-70)
  if (post.status === 'published') {
    checkAlertCriteria(post).then((shouldAlert) => {
      if (shouldAlert) {
        fireAlertEmails(post).catch((err) => {
          console.error('[insider/admin/posts] Alert email dispatch failed:', err);
        });
      }
    }).catch((err) => {
      console.error('[insider/admin/posts] Alert criteria check failed:', err);
    });
  }

  return NextResponse.json(
    { ...post, _autoPublish: autoPublishResult },
    { status: 201 },
  );
}

/**
 * PATCH /api/insider/admin/posts/[id] — Update post
 *
 * secureRoute, require: 'admin'. Validates status transitions.
 * If status transitions to 'published', fires alert check (fire-and-forget, S-70).
 */

import { NextResponse } from 'next/server';
import { secureRoute } from '@/lib/secure-route';
import { updatePost, checkAlertCriteria, fireAlertEmails } from '@/lib/insider.service';
import type { UpdatePostRequest } from '@/config/insider.config';

export const PATCH = secureRoute(
  async (request, _ctx, params) => {
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: 'Missing post id' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const data = body as UpdatePostRequest;

    let post;
    try {
      post = await updatePost(id, data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Update failed';

      // Distinguish 404 vs validation errors
      if (msg.toLowerCase().includes('not found')) {
        return NextResponse.json({ error: msg }, { status: 404 });
      }
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Fire alert check if post was just published (fire-and-forget, S-70)
    if (data.status === 'published') {
      checkAlertCriteria(post).then((shouldAlert) => {
        if (shouldAlert) {
          fireAlertEmails(post).catch((err) => {
            console.error('[insider/admin/posts/[id]] Alert email dispatch failed:', err);
          });
        }
      }).catch((err) => {
        console.error('[insider/admin/posts/[id]] Alert criteria check failed:', err);
      });
    }

    return NextResponse.json(post);
  },
  { require: 'admin' },
);

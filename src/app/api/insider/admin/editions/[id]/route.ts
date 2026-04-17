/**
 * PATCH /api/insider/admin/editions/[id] — Update edition
 *
 * secureRoute, require: 'admin'. If posts array provided, replaces all junction rows.
 * If status transitions to 'published', sets published_at.
 */

import { NextRequest, NextResponse } from 'next/server';
import { secureRoute } from '@/lib/secure-route';
import { updateEdition } from '@/lib/insider-edition.service';
import type { UpdateEditionRequest } from '@/config/insider.config';

export const PATCH = secureRoute(
  async (request: NextRequest, _ctx, params) => {
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: 'Missing edition id' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const data = body as UpdateEditionRequest;

    let edition;
    try {
      edition = await updateEdition(id, data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Update failed';
      if (msg.toLowerCase().includes('not found')) {
        return NextResponse.json({ error: msg }, { status: 404 });
      }
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json(edition);
  },
  { require: 'admin' },
);

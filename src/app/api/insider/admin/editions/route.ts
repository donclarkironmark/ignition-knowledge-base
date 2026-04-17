/**
 * GET  /api/insider/admin/editions — List all editions
 * POST /api/insider/admin/editions — Create edition
 *
 * Both require admin auth via secureRoute.
 */

import { NextResponse } from 'next/server';
import { secureRoute } from '@/lib/secure-route';
import { getAdminEditions, createEdition } from '@/lib/insider-edition.service';
import type { CreateEditionRequest } from '@/config/insider.config';

export const GET = secureRoute(
  async () => {
    const editions = await getAdminEditions();
    return NextResponse.json(editions);
  },
  { require: 'admin' },
);

export const POST = secureRoute(
  async (request) => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const data = body as CreateEditionRequest;

    if (!data.week_start || !data.week_end) {
      return NextResponse.json(
        { error: 'Missing required fields: week_start, week_end' },
        { status: 400 },
      );
    }

    const edition = await createEdition(data);
    return NextResponse.json(edition, { status: 201 });
  },
  { require: 'admin' },
);

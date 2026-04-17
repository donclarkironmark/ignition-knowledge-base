/**
 * GET  /api/insider/admin/editions — List all editions (admin session)
 * POST /api/insider/admin/editions — Create edition (dual auth: service token OR admin session)
 *
 * POST matches the dual-auth pattern used by /api/insider/admin/posts so the
 * Friday edition-prep routine can create draft editions via INSIDER_SERVICE_TOKEN.
 */

import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const serviceToken = process.env.INSIDER_SERVICE_TOKEN;

  if (authHeader && serviceToken && authHeader === `Bearer ${serviceToken}`) {
    return handleCreateEdition(request);
  }

  const secureHandler = secureRoute(
    async (req) => handleCreateEdition(req),
    { require: 'admin' },
  );

  return secureHandler(request);
}

async function handleCreateEdition(request: NextRequest): Promise<NextResponse> {
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
}

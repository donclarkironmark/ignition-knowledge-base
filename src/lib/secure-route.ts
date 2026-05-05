import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { COOKIE_NAME } from '@/lib/auth/session';

// ── Insider admin auth wrapper ───────────────────────────────────────

export interface KbAuthContext {
  role: 'admin';
  userId: null; // Ignition Insider does not use Supabase Auth — no per-user UUIDs
}

type AdminHandler = (
  request: NextRequest,
  ctx: KbAuthContext,
  params?: Record<string, string>,
) => Promise<NextResponse>;

function getSessionSecret(): Uint8Array {
  const secret = process.env.KB_SESSION_SECRET;
  if (!secret) {
    throw new Error('KB_SESSION_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

async function getSessionRole(request: NextRequest): Promise<'viewer' | 'admin' | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) { return null; }

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const role = payload.role;
    if (role === 'admin' || role === 'viewer') { return role; }
    return null;
  } catch {
    return null;
  }
}

/**
 * Wraps an API route handler and enforces that the session JWT carries
 * `role === 'admin'`. Matches the `secureRoute` signature used by the ported
 * Insider code so that route files port verbatim.
 */
export function secureRoute(handler: AdminHandler, options?: { require?: 'admin' }) {
  return async (
    request: NextRequest,
    routeContext?: { params: Promise<Record<string, string>> },
  ) => {
    const role = await getSessionRole(request);

    if (!role) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (options?.require === 'admin' && role !== 'admin') {
      return NextResponse.json({ error: 'Requires admin role' }, { status: 403 });
    }

    try {
      const params = routeContext?.params ? await routeContext.params : undefined;
      return await handler(request, { role: 'admin', userId: null }, params);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Internal server error';
      console.error(`[API ${request.method} ${request.nextUrl.pathname}]`, error);
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  };
}

// ── CRON_SECRET-authenticated routes ─────────────────────────────────

type CronHandler = (request: NextRequest) => Promise<NextResponse>;

function isCronAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) { return false; }

  const authHeader = request.headers.get('authorization');
  const vercelCron = request.headers.get('x-vercel-cron');

  return authHeader === `Bearer ${cronSecret}` || vercelCron === cronSecret;
}

export function cronRoute(handler: CronHandler) {
  return async (request: NextRequest) => {
    if (!isCronAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      return await handler(request);
    } catch (error) {
      console.error(`[CRON ${request.nextUrl.pathname}]`, error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 500 },
      );
    }
  };
}

// ── Server-component helper for admin layouts ────────────────────────

import { cookies } from 'next/headers';

export async function getServerSessionRole(): Promise<'viewer' | 'admin' | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) { return null; }
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const role = payload.role;
    if (role === 'admin' || role === 'viewer') { return role; }
    return null;
  } catch {
    return null;
  }
}

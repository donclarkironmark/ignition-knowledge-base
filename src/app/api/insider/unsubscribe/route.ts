/**
 * GET  /api/insider/unsubscribe?token=<token> — Get subscription preferences
 * POST /api/insider/unsubscribe — Update preferences or unsubscribe all
 *
 * Token-based auth (HMAC). No session required.
 * GET returns masked email + current categories.
 * POST accepts { token, categories?, unsubscribe_all? }.
 * All responses include List-Unsubscribe headers.
 */

// @auth token — HMAC token-based auth (no user session). Token is verified against email in DB.
import { NextRequest, NextResponse } from 'next/server';
import {
  getSubscriptionByToken,
  maskEmail,
  updatePreferences,
  unsubscribeAll,
} from '@/lib/insider-email.service';
import { INSIDER_CATEGORIES, type InsiderCategory } from '@/config/insider.config';

const ROBOTS_HEADERS = { 'X-Robots-Tag': 'noindex, nofollow' };

const VALID_CATEGORIES = new Set<InsiderCategory>(
  INSIDER_CATEGORIES.map((c) => c.value),
);

function listUnsubscribeHeaders(token: string): Record<string, string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const url = `${appUrl}/insider/unsubscribe?token=${encodeURIComponent(token)}`;
  return {
    'List-Unsubscribe': `<${url}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    ...ROBOTS_HEADERS,
  };
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Invalid or expired unsubscribe link' },
      { status: 400, headers: ROBOTS_HEADERS },
    );
  }

  const subscription = await getSubscriptionByToken(token);

  if (!subscription) {
    return NextResponse.json(
      { error: 'Invalid or expired unsubscribe link' },
      { status: 400, headers: ROBOTS_HEADERS },
    );
  }

  return NextResponse.json(
    {
      email: maskEmail(subscription.email),
      categories: subscription.categories,
      is_active: subscription.is_active,
    },
    { headers: listUnsubscribeHeaders(token) },
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: ROBOTS_HEADERS },
    );
  }

  const {
    token,
    categories,
    unsubscribe_all,
  } = body as {
    token?: string;
    categories?: InsiderCategory[];
    unsubscribe_all?: boolean;
  };

  if (!token || typeof token !== 'string') {
    return NextResponse.json(
      { error: 'Invalid or expired unsubscribe link' },
      { status: 400, headers: ROBOTS_HEADERS },
    );
  }

  const subscription = await getSubscriptionByToken(token);

  if (!subscription) {
    return NextResponse.json(
      { error: 'Invalid or expired unsubscribe link' },
      { status: 400, headers: ROBOTS_HEADERS },
    );
  }

  const headers = listUnsubscribeHeaders(token);

  if (unsubscribe_all) {
    await unsubscribeAll(token);
    return NextResponse.json({ message: 'Unsubscribed' }, { headers });
  }

  if (
    !Array.isArray(categories) ||
    categories.length === 0 ||
    !categories.every((c) => VALID_CATEGORIES.has(c))
  ) {
    return NextResponse.json(
      { error: 'Invalid categories' },
      { status: 400, headers },
    );
  }

  await updatePreferences(token, categories);
  return NextResponse.json({ message: 'Preferences updated' }, { headers });
}

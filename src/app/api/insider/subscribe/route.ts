/**
 * POST /api/insider/subscribe — Subscribe to Ignition Insider
 *
 * No auth required. Validates email and categories, upserts subscription,
 * sends confirmation email fire-and-forget.
 */

// @auth public — Subscription endpoint is intentionally open; no session needed to subscribe.
import { NextRequest, NextResponse } from 'next/server';
import { subscribe } from '@/lib/insider-email.service';
import { INSIDER_CATEGORIES, type InsiderCategory, type SubscribeRequest } from '@/config/insider.config';

const ROBOTS_HEADERS = { 'X-Robots-Tag': 'noindex, nofollow' };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_CATEGORIES = new Set<InsiderCategory>(
  INSIDER_CATEGORIES.map((c) => c.value),
);

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

  const { email, categories } = body as Partial<SubscribeRequest>;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400, headers: ROBOTS_HEADERS },
    );
  }

  if (
    !Array.isArray(categories) ||
    categories.length === 0 ||
    !categories.every((c) => VALID_CATEGORIES.has(c as InsiderCategory))
  ) {
    return NextResponse.json(
      { error: 'Invalid categories' },
      { status: 400, headers: ROBOTS_HEADERS },
    );
  }

  const subscription = await subscribe({
    email: email.toLowerCase(),
    categories: categories as InsiderCategory[],
  });

  return NextResponse.json(
    { message: 'Subscribed', email: subscription.email },
    { headers: ROBOTS_HEADERS },
  );
}

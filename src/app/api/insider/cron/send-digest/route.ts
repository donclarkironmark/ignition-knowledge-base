/**
 * POST /api/insider/cron/send-digest — Weekly digest cron job
 *
 * cronRoute (CRON_SECRET). Finds the most recent published edition with no
 * digest_sends records, then sends personalized emails to all active subscribers
 * whose categories overlap with edition posts. Logs sent/failed to digest_sends.
 * Retries once on failure (30s delay). Idempotent — skips already-sent (subscription_id, edition_id) pairs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cronRoute } from '@/lib/secure-route';
import { getUnsentPublishedEdition, getEditionPosts } from '@/lib/insider-edition.service';
import { sendDigestToSubscriber } from '@/lib/insider-email.service';
import type { InsiderSubscription } from '@/config/insider.config';

// Service-role Supabase via the shared helper — RLS is bypassed; auth is
// enforced by cronRoute's CRON_SECRET check.

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getActiveSubscribers(): Promise<InsiderSubscription[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('insider_subscriptions')
    .select('*') // @rows unbounded — cron must process every active subscriber
    .eq('is_active', true);

  if (error) {
    throw new Error(`Failed to fetch active subscribers: ${error.message}`);
  }
  return (data ?? []) as unknown as InsiderSubscription[];
}

async function hasAlreadySent(subscriptionId: string, editionId: string): Promise<boolean> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('insider_digest_sends')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_id', subscriptionId)
    .eq('edition_id', editionId);

  if (error) {
    throw new Error(`Failed to check digest send dedup: ${error.message}`);
  }
  return (count ?? 0) > 0;
}

async function logDigestSend(params: {
  subscriptionId: string;
  editionId: string;
  categoriesSent: string[];
  status: 'sent' | 'failed';
  errorMessage?: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('insider_digest_sends').insert({
    subscription_id: params.subscriptionId,
    edition_id: params.editionId,
    categories_sent: params.categoriesSent,
    status: params.status,
    error_message: params.errorMessage ?? null,
  });

  if (error) {
    // Log but don't throw — duplicate key means it was already sent (idempotency guard)
    if (!error.message.includes('duplicate') && !error.message.includes('unique')) {
      console.error('[send-digest] Failed to log digest send:', error.message);
    }
  }
}

async function sendWithRetry(params: {
  subscriber: InsiderSubscription;
  edition: Parameters<typeof sendDigestToSubscriber>[0]['edition'];
  posts: Parameters<typeof sendDigestToSubscriber>[0]['posts'];
}): Promise<{ status: 'sent' | 'failed'; error?: string }> {
  const result = await sendDigestToSubscriber(params);

  if (result.status === 'sent') {
    return result;
  }

  // Retry once after 30s delay (S-37)
  await new Promise((resolve) => setTimeout(resolve, 30_000));
  return sendDigestToSubscriber(params);
}

// ── Cron handler ──────────────────────────────────────────────────────────────
//
// Both verbs are exported so the endpoint works two ways:
//   - Vercel cron fires HTTP GET on the schedule defined in vercel.json
//   - Manual invocation / Routines may use POST with the CRON_SECRET bearer

const handler = cronRoute(async (_request: NextRequest) => {
  const edition = await getUnsentPublishedEdition();

  if (!edition) {
    return NextResponse.json({ action: 'no_unsent_edition' });
  }

  const allPosts = await getEditionPosts(edition.id);

  if (allPosts.length === 0) {
    return NextResponse.json({ action: 'no_unsent_edition' });
  }

  const subscribers = await getActiveSubscribers();

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    // Dedup check — idempotency guard (S-63)
    const alreadySent = await hasAlreadySent(subscriber.id, edition.id);
    if (alreadySent) {
      skipped++;
      continue;
    }

    // Filter posts by subscriber's category preferences
    const matchingPosts = allPosts.filter((p) =>
      subscriber.categories.includes(p.category),
    );

    if (matchingPosts.length === 0) {
      skipped++;
      continue;
    }

    const result = await sendWithRetry({
      subscriber,
      edition,
      posts: matchingPosts,
    });

    const categoriesSent = [...new Set(matchingPosts.map((p) => p.category))];

    await logDigestSend({
      subscriptionId: subscriber.id,
      editionId: edition.id,
      categoriesSent,
      status: result.status,
      errorMessage: result.error,
    });

    if (result.status === 'sent') {
      sent++;
    } else {
      failed++;
    }
  }

  return NextResponse.json({
    action: 'digest_sent',
    edition_id: edition.id,
    sent,
    skipped,
    failed,
  });
});

export const GET = handler;
export const POST = handler;

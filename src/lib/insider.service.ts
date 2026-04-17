/**
 * insider.service.ts — Core service layer for Ignition Insider.
 *
 * Post CRUD, slug management, tag validation, auto-publish evaluation,
 * alert criteria checking, and alert email dispatch coordination.
 *
 * All Supabase access uses lazy-init clients (no DNS/TLS at module load).
 * Service-role client used for subscription reads to bypass RLS.
 */

import { createClient } from '@/lib/supabase/server';
import {
  AUTO_PUBLISH_MIN_RELEVANCE,
  FLAG_KEYWORDS,
  MAX_PINNED_POSTS,
  MAX_STALE_SOURCE_DAYS,
  POSTS_PER_PAGE,
  VALID_STATUS_TRANSITIONS,
  type CreatePostRequest,
  type InsiderCategory,
  type InsiderPost,
  type InsiderTag,
  type PostListResponse,
  type PostStatus,
  type UpdatePostRequest,
} from '@/config/insider.config';

// Service-role Supabase — auth enforced at the API route layer.

async function getServiceClient() {
  return createClient();
}

// ── Alert keywords (competitor acquisition, ownership change, regulatory) ──

const ALERT_KEYWORDS = [
  'acquisition',
  'acquired',
  'merger',
  'merged',
  'ownership',
  'regulatory',
  'regulation',
  'deadline',
  'mandate',
  'banned',
  'injunction',
];

// ── Slug utilities ────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export async function ensureUniqueSlug(slug: string): Promise<string> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('insider_posts')
    .select('slug')
    .like('slug', `${slug}%`);

  if (!existing || existing.length === 0) {
    return slug;
  }

  const slugSet = new Set((existing as Array<{ slug: string }>).map(r => r.slug));
  if (!slugSet.has(slug)) {
    return slug;
  }

  let counter = 2;
  while (slugSet.has(`${slug}-${counter}`)) {
    counter++;
  }
  return `${slug}-${counter}`;
}

// ── Tag validation ────────────────────────────────────────────────────────

export async function validateTags(tagNames: string[]): Promise<{
  valid: { id: string; name: string }[];
  invalid: string[];
}> {
  if (tagNames.length === 0) {
    return { valid: [], invalid: [] };
  }

  const supabase = await createClient();
  const { data: found } = await supabase
    .from('insider_tags')
    .select('id, name')
    .in('name', tagNames);

  const rows = (found ?? []) as unknown as Array<{ id: string; name: string }>;
  const foundNames = new Set(rows.map(t => t.name));
  const valid = rows.map(t => ({ id: t.id, name: t.name }));
  const invalid = tagNames.filter(name => !foundNames.has(name));

  return { valid, invalid };
}

// ── Auto-publish evaluation ───────────────────────────────────────────────

export async function evaluateAutoPublish(post: {
  relevance_score: number;
  body: string;
  source_date: string;
}): Promise<{ decision: 'auto-publish' | 'queue-for-review'; reason: string }> {
  const reasons: string[] = [];

  if (post.relevance_score < AUTO_PUBLISH_MIN_RELEVANCE) {
    reasons.push(`relevance_score ${post.relevance_score} < ${AUTO_PUBLISH_MIN_RELEVANCE}`);
  }

  const bodyLower = post.body.toLowerCase();
  const flagged = FLAG_KEYWORDS.filter(kw => bodyLower.includes(kw));
  if (flagged.length > 0) {
    reasons.push(`body contains flagged keyword(s): ${flagged.join(', ')}`);
  }

  const sourceDate = new Date(post.source_date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - sourceDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > MAX_STALE_SOURCE_DAYS) {
    reasons.push(`source_date is ${diffDays} days old (max ${MAX_STALE_SOURCE_DAYS})`);
  }

  const hasSoWhat =
    post.body.toLowerCase().includes('so what') ||
    post.body.toLowerCase().includes('## so what') ||
    post.body.toLowerCase().includes('**so what');
  if (!hasSoWhat) {
    reasons.push('body is missing "So What" section');
  }

  if (reasons.length > 0) {
    return { decision: 'queue-for-review', reason: reasons.join('; ') };
  }

  return { decision: 'auto-publish', reason: 'all auto-publish criteria met' };
}

// ── Alert criteria ────────────────────────────────────────────────────────

export async function checkAlertCriteria(post: InsiderPost): Promise<boolean> {
  if (post.relevance_score < 8) {
    return false;
  }

  const bodyLower = post.body.toLowerCase();
  return ALERT_KEYWORDS.some(kw => bodyLower.includes(kw));
}

// ── Alert email dispatch (fire-and-forget) ────────────────────────────────

export async function fireAlertEmails(post: InsiderPost): Promise<void> {
  const service = await getServiceClient();

  const { data: subscribers } = await service
    .from('insider_subscriptions')
    .select('id, email, categories, token, is_active, created_at, updated_at')
    .eq('is_active', true);

  if (!subscribers || subscribers.length === 0) {
    return;
  }

  // Check which subscribers already received this alert (dedup)
  const { data: alreadySent } = await service
    .from('insider_alert_sends')
    .select('subscription_id')
    .eq('post_id', post.id);

  const sentRows = (alreadySent ?? []) as unknown as Array<{ subscription_id: string }>;
  const sentSet = new Set(sentRows.map(r => r.subscription_id));
  type SubscriberRow = {
    id: string;
    email: string;
    categories: InsiderCategory[];
    token: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  const pending = (subscribers as unknown as SubscriberRow[]).filter(s => !sentSet.has(s.id));

  if (pending.length === 0) {
    return;
  }

  // Import dynamically to avoid circular dependency — email service imports nothing from here
  const { sendAlertToSubscriber } = await import('@/lib/insider-email.service');

  await Promise.allSettled(
    pending.map(async (subscriber) => {
      try {
        await sendAlertToSubscriber({ subscriber, post });
        await service
          .from('insider_alert_sends')
          .insert({ subscription_id: subscriber.id, post_id: post.id });
      } catch (err) {
        console.error(`[Insider] Alert send failed for ${subscriber.email}:`, err);
      }
    })
  );
}

// ── Tag join helper ───────────────────────────────────────────────────────

async function attachTags(post: InsiderPost): Promise<InsiderPost> {
  const supabase = await createClient();
  const { data: junctions } = await supabase
    .from('insider_post_tags')
    .select('tag_id, insider_tags(id, name, tag_type)')
    .eq('post_id', post.id);

  type JunctionRow = {
    tag_id: string;
    insider_tags: { id: string; name: string; tag_type: string } | null;
  };
  const tags: InsiderTag[] = ((junctions ?? []) as unknown as JunctionRow[])
    .map(j => j.insider_tags)
    .filter((t): t is InsiderTag => t !== null);

  return { ...post, tags };
}

async function attachTagsBulk(posts: InsiderPost[]): Promise<InsiderPost[]> {
  if (posts.length === 0) {return posts;}

  const supabase = await createClient();
  const ids = posts.map(p => p.id);

  const { data: junctions } = await supabase
    .from('insider_post_tags')
    .select('post_id, insider_tags(id, name, tag_type)')
    .in('post_id', ids);

  const tagsByPost = new Map<string, InsiderTag[]>();
  type BulkJunctionRow = {
    post_id: string;
    insider_tags: { id: string; name: string; tag_type: string } | null;
  };
  for (const j of (junctions ?? []) as unknown as BulkJunctionRow[]) {
    if (!j.insider_tags) {continue;}
    const existing = tagsByPost.get(j.post_id) ?? [];
    existing.push(j.insider_tags as unknown as InsiderTag);
    tagsByPost.set(j.post_id, existing);
  }

  return posts.map(p => ({ ...p, tags: tagsByPost.get(p.id) ?? [] }));
}

// ── createPost ────────────────────────────────────────────────────────────

export async function createPost(
  data: CreatePostRequest,
  createdBy: string | null
): Promise<
  | { post: InsiderPost; autoPublishResult: { decision: string; reason: string } }
  | { action: 'skipped'; reason: 'duplicate_source_url'; source_url: string }
> {
  const supabase = await createClient();

  // Dedup check on source_url (S-64)
  const { data: existing } = await supabase
    .from('insider_posts')
    .select('id')
    .eq('source_url', data.source_url)
    .maybeSingle();

  if (existing) {
    return { action: 'skipped', reason: 'duplicate_source_url', source_url: data.source_url };
  }

  // Tag validation
  const { valid: validTags, invalid: invalidTags } = await validateTags(data.tags ?? []);
  if (invalidTags.length > 0) {
    throw Object.assign(new Error('Unknown tags'), { code: 'UNKNOWN_TAGS', invalid: invalidTags });
  }

  // Generate unique slug
  const baseSlug = generateSlug(data.title);
  const slug = await ensureUniqueSlug(baseSlug);

  // Insert post with draft status
  const { data: inserted, error: insertError } = await supabase
    .from('insider_posts')
    .insert({
      title: data.title,
      slug,
      summary: data.summary,
      body: data.body,
      category: data.category,
      relevance_score: data.relevance_score,
      source_url: data.source_url,
      source_name: data.source_name,
      source_date: data.source_date,
      ironmark_dimensions: data.ironmark_dimensions ?? [],
      competitors_mentioned: data.competitors_mentioned ?? [],
      customers_mentioned: data.customers_mentioned ?? [],
      verticals: data.verticals ?? [],
      admin_commentary: data.admin_commentary ?? null,
      created_by: createdBy,
      status: 'draft',
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to insert post: ${insertError.message}`);
  }

  const insertedRow = inserted as { id: string };

  // Insert tag junction rows
  if (validTags.length > 0) {
    const { error: tagError } = await supabase
      .from('insider_post_tags')
      .insert(validTags.map(t => ({ post_id: insertedRow.id, tag_id: t.id })));

    if (tagError) {
      throw new Error(`Failed to insert post tags: ${tagError.message}`);
    }
  }

  // Auto-publish evaluation (S-39)
  const autoPublishResult = await evaluateAutoPublish({
    relevance_score: data.relevance_score,
    body: data.body,
    source_date: data.source_date,
  });

  let post: InsiderPost;

  if (autoPublishResult.decision === 'auto-publish') {
    const { data: published, error: publishError } = await supabase
      .from('insider_posts')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', insertedRow.id)
      .select()
      .single();

    if (publishError) {
      throw new Error(`Failed to auto-publish post: ${publishError.message}`);
    }
    post = await attachTags(published as unknown as InsiderPost);

    // Alert check fire-and-forget (S-70)
    const meetsAlert = await checkAlertCriteria(post);
    if (meetsAlert) {
      fireAlertEmails(post).catch(err =>
        console.error('[Insider] fireAlertEmails failed:', err)
      );
    }
  } else {
    const { data: queued, error: queueError } = await supabase
      .from('insider_posts')
      .update({ status: 'review', review_notes: autoPublishResult.reason })
      .eq('id', insertedRow.id)
      .select()
      .single();

    if (queueError) {
      throw new Error(`Failed to queue post for review: ${queueError.message}`);
    }
    post = await attachTags(queued as unknown as InsiderPost);
  }

  return { post, autoPublishResult };
}

// ── updatePost ────────────────────────────────────────────────────────────

export async function updatePost(id: string, data: UpdatePostRequest): Promise<InsiderPost> {
  const supabase = await createClient();

  // Fetch current post to validate transitions
  const { data: current, error: fetchError } = await supabase
    .from('insider_posts')
    .select()
    .eq('id', id)
    .single();

  if (fetchError || !current) {
    throw Object.assign(new Error('Post not found'), { code: 'NOT_FOUND' });
  }

  // Validate status transition
  if (data.status && data.status !== current.status) {
    const allowed = VALID_STATUS_TRANSITIONS[current.status as PostStatus];
    if (!allowed.includes(data.status)) {
      throw Object.assign(
        new Error(`Invalid status transition: ${current.status} -> ${data.status}`),
        { code: 'INVALID_TRANSITION' }
      );
    }
  }

  // Validate tags if provided
  let validTags: { id: string; name: string }[] = [];
  if (data.tags !== undefined) {
    const { valid, invalid } = await validateTags(data.tags);
    if (invalid.length > 0) {
      throw Object.assign(new Error('Unknown tags'), { code: 'UNKNOWN_TAGS', invalid });
    }
    validTags = valid;
  }

  // Manage pin limit: if pinning, check and unpin oldest if at limit (S-22)
  if (data.is_pinned === true && !current.is_pinned) {
    const { data: pinned } = await supabase
      .from('insider_posts')
      .select('id, published_at')
      .eq('is_pinned', true)
      .order('published_at', { ascending: true });

    if (pinned && pinned.length >= MAX_PINNED_POSTS) {
      const oldest = pinned[0] as { id: string };
      await supabase
        .from('insider_posts')
        .update({ is_pinned: false })
        .eq('id', oldest.id);
    }
  }

  // Build the update payload
  const updatePayload: Record<string, unknown> = {};
  if (data.title !== undefined) {updatePayload.title = data.title;}
  if (data.summary !== undefined) {updatePayload.summary = data.summary;}
  if (data.body !== undefined) {updatePayload.body = data.body;}
  if (data.category !== undefined) {updatePayload.category = data.category;}
  if (data.relevance_score !== undefined) {updatePayload.relevance_score = data.relevance_score;}
  if (data.source_url !== undefined) {updatePayload.source_url = data.source_url;}
  if (data.source_name !== undefined) {updatePayload.source_name = data.source_name;}
  if (data.source_date !== undefined) {updatePayload.source_date = data.source_date;}
  if (data.ironmark_dimensions !== undefined) {updatePayload.ironmark_dimensions = data.ironmark_dimensions;}
  if (data.competitors_mentioned !== undefined) {updatePayload.competitors_mentioned = data.competitors_mentioned;}
  if (data.customers_mentioned !== undefined) {updatePayload.customers_mentioned = data.customers_mentioned;}
  if (data.verticals !== undefined) {updatePayload.verticals = data.verticals;}
  if (data.status !== undefined) {updatePayload.status = data.status;}
  if (data.is_pinned !== undefined) {updatePayload.is_pinned = data.is_pinned;}
  if (data.admin_commentary !== undefined) {updatePayload.admin_commentary = data.admin_commentary;}
  if (data.review_notes !== undefined) {updatePayload.review_notes = data.review_notes;}

  // Set published_at when transitioning to published
  if (data.status === 'published' && current.status !== 'published') {
    updatePayload.published_at = new Date().toISOString();
  }

  const { data: updated, error: updateError } = await supabase
    .from('insider_posts')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update post: ${updateError.message}`);
  }

  // Replace tag junction rows if tags were provided
  if (data.tags !== undefined) {
    await supabase.from('insider_post_tags').delete().eq('post_id', id);

    if (validTags.length > 0) {
      const { error: tagError } = await supabase
        .from('insider_post_tags')
        .insert(validTags.map(t => ({ post_id: id, tag_id: t.id })));

      if (tagError) {
        throw new Error(`Failed to update post tags: ${tagError.message}`);
      }
    }
  }

  const post = await attachTags(updated as unknown as InsiderPost);

  // Alert check fire-and-forget when transitioning to published (S-70)
  if (data.status === 'published' && current.status !== 'published') {
    const meetsAlert = await checkAlertCriteria(post);
    if (meetsAlert) {
      fireAlertEmails(post).catch(err =>
        console.error('[Insider] fireAlertEmails failed:', err)
      );
    }
  }

  return post;
}

// ── getPublicPosts ────────────────────────────────────────────────────────

export async function getPublicPosts(params: {
  page: number;
  pageSize: number;
  category?: InsiderCategory;
  tags?: string[];
  search?: string;
}): Promise<PostListResponse> {
  const supabase = await createClient();
  const { page, pageSize, category, tags, search } = params;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('insider_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published');

  if (category) {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,body.ilike.%${search}%`);
  }

  // Tag filtering: if tags requested, filter to posts that have those tags
  if (tags && tags.length > 0) {
    const { data: matchingTags } = await supabase
      .from('insider_tags')
      .select('id')
      .in('name', tags);

    const tagIds = ((matchingTags ?? []) as Array<{ id: string }>).map(t => t.id);

    if (tagIds.length > 0) {
      const { data: postIds } = await supabase
        .from('insider_post_tags')
        .select('post_id')
        .in('tag_id', tagIds);

      const ids = ((postIds ?? []) as Array<{ post_id: string }>).map(r => r.post_id);
      if (ids.length === 0) {
        return { posts: [], total: 0, page, pageSize };
      }
      query = query.in('id', ids);
    } else {
      return { posts: [], total: 0, page, pageSize };
    }
  }

  // Pinned first, then by published_at DESC
  // Supabase doesn't support ORDER BY CASE, so we sort client-side after fetch
  // Fetch up to pageSize + offset to handle ordering, but for correct pagination
  // we fetch all matching, sort, then slice. For large datasets this is a limitation
  // documented in the spec as acceptable for v1.
  const { data: allPosts, count, error } = await query
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(`Failed to fetch public posts: ${error.message}`);
  }

  const posts = await attachTagsBulk((allPosts ?? []) as unknown as InsiderPost[]);

  return {
    posts,
    total: count ?? 0,
    page,
    pageSize,
  };
}

// ── getPostBySlug ─────────────────────────────────────────────────────────

export async function getPostBySlug(slug: string): Promise<InsiderPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('insider_posts')
    .select()
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch post by slug: ${error.message}`);
  }

  if (!data) {return null;}

  return attachTags(data as unknown as InsiderPost);
}

// ── getAdminPosts ─────────────────────────────────────────────────────────

export async function getAdminPosts(params: {
  page: number;
  pageSize: number;
  status?: PostStatus;
}): Promise<PostListResponse> {
  const supabase = await createClient();
  const { page, pageSize, status } = params;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('insider_posts')
    .select('*', { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(`Failed to fetch admin posts: ${error.message}`);
  }

  const posts = await attachTagsBulk((data ?? []) as unknown as InsiderPost[]);

  return {
    posts,
    total: count ?? 0,
    page,
    pageSize,
  };
}

// ── getPostCountsByStatus ─────────────────────────────────────────────────

export async function getPostCountsByStatus(): Promise<Record<PostStatus, number>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('insider_posts')
    .select('status');

  if (error) {
    throw new Error(`Failed to fetch post counts: ${error.message}`);
  }

  const counts: Record<PostStatus, number> = {
    draft: 0,
    review: 0,
    published: 0,
    archived: 0,
  };

  for (const row of (data ?? []) as Array<{ status: PostStatus }>) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }

  return counts;
}

// ── Re-export config constants used by API routes ─────────────────────────

export { POSTS_PER_PAGE };

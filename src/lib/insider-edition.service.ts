import { createClient } from '@/lib/supabase/server';
import type {
  InsiderCategory,
  InsiderEdition,
  InsiderEditionPost,
  InsiderPost,
  CreateEditionRequest,
  UpdateEditionRequest,
} from '@/config/insider.config';

// Service-role Supabase — auth is enforced at the API route layer.
// All calls go through the shared `@/lib/supabase/server` helper so the
// loose generic is applied consistently across services.

async function getClient() {
  return createClient();
}

// ── Helpers ──────────────────────────────────────────────────────────

function mapEditionRow(row: Record<string, unknown>): InsiderEdition {
  return {
    id: row.id as string,
    edition_number: row.edition_number as number,
    edition_type: row.edition_type as InsiderEdition['edition_type'],
    week_start: row.week_start as string,
    week_end: row.week_end as string,
    title: row.title as string | null,
    executive_summary: row.executive_summary as string | null,
    data_point_of_week: row.data_point_of_week as string | null,
    coming_up: row.coming_up as string | null,
    status: row.status as InsiderEdition['status'],
    published_at: row.published_at as string | null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

// ── createEdition ────────────────────────────────────────────────────

export async function createEdition(data: CreateEditionRequest): Promise<InsiderEdition> {
  const supabase = await getClient();

  const { data: edition, error } = await supabase
    .from('insider_editions')
    .insert({
      week_start: data.week_start,
      week_end: data.week_end,
      title: data.title ?? null,
      executive_summary: data.executive_summary ?? null,
      data_point_of_week: data.data_point_of_week ?? null,
      coming_up: data.coming_up ?? null,
    })
    .select()
    .single();

  if (error) {throw new Error(`Failed to create edition: ${error.message}`);}

  if (data.posts.length > 0) {
    const junctionRows = data.posts.map(p => ({
      edition_id: edition.id,
      post_id: p.post_id,
      section: p.section,
      display_order: p.display_order,
    }));

    const { error: junctionError } = await supabase
      .from('insider_edition_posts')
      .insert(junctionRows);

    if (junctionError) {throw new Error(`Failed to insert edition posts: ${junctionError.message}`);}
  }

  return mapEditionRow(edition);
}

// ── updateEdition ────────────────────────────────────────────────────

export async function updateEdition(id: string, data: UpdateEditionRequest): Promise<InsiderEdition> {
  const supabase = await getClient();

  const updates: Record<string, unknown> = {};
  if (data.title !== undefined) {updates.title = data.title;}
  if (data.executive_summary !== undefined) {updates.executive_summary = data.executive_summary;}
  if (data.data_point_of_week !== undefined) {updates.data_point_of_week = data.data_point_of_week;}
  if (data.coming_up !== undefined) {updates.coming_up = data.coming_up;}
  if (data.status !== undefined) {
    updates.status = data.status;
    if (data.status === 'published') {
      updates.published_at = new Date().toISOString();
    }
  }

  const { data: edition, error } = await supabase
    .from('insider_editions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {throw new Error(`Failed to update edition: ${error.message}`);}

  if (data.posts !== undefined) {
    const { error: deleteError } = await supabase
      .from('insider_edition_posts')
      .delete()
      .eq('edition_id', id);

    if (deleteError) {throw new Error(`Failed to clear edition posts: ${deleteError.message}`);}

    if (data.posts.length > 0) {
      const junctionRows = data.posts.map(p => ({
        edition_id: id,
        post_id: p.post_id,
        section: p.section,
        display_order: p.display_order,
      }));

      const { error: insertError } = await supabase
        .from('insider_edition_posts')
        .insert(junctionRows);

      if (insertError) {throw new Error(`Failed to insert edition posts: ${insertError.message}`);}
    }
  }

  return mapEditionRow(edition);
}

// ── getPublicEditions ────────────────────────────────────────────────

export async function getPublicEditions(): Promise<InsiderEdition[]> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('insider_editions')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {throw new Error(`Failed to fetch public editions: ${error.message}`);}

  return data.map(mapEditionRow);
}

// ── getEditionById ────────────────────────────────────────────────────

export async function getEditionById(
  id: string,
  includeAllStatuses: boolean,
): Promise<InsiderEdition | null> {
  const supabase = await getClient();

  let query = supabase
    .from('insider_editions')
    .select('*')
    .eq('id', id);

  if (!includeAllStatuses) {
    query = query.eq('status', 'published');
  }

  const { data: edition, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {return null;} // not found
    throw new Error(`Failed to fetch edition: ${error.message}`);
  }

  const { data: junctionRows, error: junctionError } = await supabase
    .from('insider_edition_posts')
    .select('edition_id, post_id, section, display_order')
    .eq('edition_id', id)
    .order('section', { ascending: true })
    .order('display_order', { ascending: true });

  if (junctionError) {throw new Error(`Failed to fetch edition posts: ${junctionError.message}`);}

  const postIds = junctionRows.map(r => r.post_id as string);
  let postMap: Record<string, InsiderPost> = {};

  if (postIds.length > 0) {
    const { data: postRows, error: postsError } = await supabase
      .from('insider_posts')
      .select('*')
      .in('id', postIds);

    if (postsError) {throw new Error(`Failed to fetch posts for edition: ${postsError.message}`);}
    postMap = Object.fromEntries((postRows ?? []).map(p => [p.id as string, p as unknown as InsiderPost]));
  }

  const posts: InsiderEditionPost[] = junctionRows.map(row => ({
    edition_id: row.edition_id as string,
    post_id: row.post_id as string,
    section: row.section as InsiderEditionPost['section'],
    display_order: row.display_order as number,
    post: postMap[row.post_id as string],
  }));

  return { ...mapEditionRow(edition), posts };
}

// ── getAdminEditions ──────────────────────────────────────────────────

export async function getAdminEditions(): Promise<InsiderEdition[]> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('insider_editions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {throw new Error(`Failed to fetch admin editions: ${error.message}`);}

  return data.map(mapEditionRow);
}

// ── getUnsentPublishedEdition ─────────────────────────────────────────
// Find the most recent published edition that has no rows in insider_digest_sends.
// Strategy: fetch published editions ordered by published_at DESC, then check each
// for digest_sends — return the first with none.

export async function getUnsentPublishedEdition(): Promise<InsiderEdition | null> {
  const supabase = await getClient();

  const { data: editions, error } = await supabase
    .from('insider_editions')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {throw new Error(`Failed to fetch published editions: ${error.message}`);}

  for (const edition of editions) {
    const { count, error: countError } = await supabase
      .from('insider_digest_sends')
      .select('*', { count: 'exact', head: true })
      .eq('edition_id', (edition as Record<string, unknown>).id as string);

    if (countError) {throw new Error(`Failed to check digest sends: ${countError.message}`);}

    if (count === 0) {
      return mapEditionRow(edition);
    }
  }

  return null;
}

// ── getEditionPosts ───────────────────────────────────────────────────

export async function getEditionPosts(
  editionId: string,
  categories?: InsiderCategory[],
): Promise<InsiderPost[]> {
  const supabase = await getClient();

  const { data: junctionRows, error } = await supabase
    .from('insider_edition_posts')
    .select('post_id, section, display_order')
    .eq('edition_id', editionId)
    .order('section', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) {throw new Error(`Failed to fetch edition posts: ${error.message}`);}

  const postIds = junctionRows.map(r => r.post_id as string);
  if (postIds.length === 0) {return [];}

  let query = supabase
    .from('insider_posts')
    .select('*')
    .in('id', postIds);

  if (categories && categories.length > 0) {
    query = query.in('category', categories);
  }

  const { data: postRows, error: postsError } = await query;
  if (postsError) {throw new Error(`Failed to fetch posts for edition: ${postsError.message}`);}

  // Restore the section-then-display_order ordering from the junction table
  const orderMap = new Map(
    junctionRows.map((r, i) => [r.post_id as string, i]),
  );
  const posts = (postRows ?? []) as unknown as InsiderPost[];
  posts.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));

  return posts;
}

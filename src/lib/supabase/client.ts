import { createClient as createSupabaseClient } from '@supabase/supabase-js';
export type { User } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client (anon key).
 *
 * Used for client-component reads where the request isn't going through an
 * API route. RLS governs what anon can read.
 */
export const createClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

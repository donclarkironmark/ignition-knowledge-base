import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * The KB does not use Supabase Auth — access control is enforced at the
 * application layer (secureRoute for admin APIs, cronRoute for cron,
 * `.eq('status','published')` filters on public reads). We therefore use a
 * service-role client for all server-side Supabase access. Public read paths
 * MUST filter to `status='published'` explicitly — RLS is not the guardrail.
 *
 * The Database generic below is a loose schema shape — it satisfies
 * Supabase's `GenericSchema` contract while letting the Insider services
 * address tables by string name without generated types. If we generate
 * real Database types later, swap this for the import.
 */

type LooseTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

type LooseDatabase = {
  public: {
    Tables: Record<string, LooseTable>;
    Views: Record<string, { Row: Record<string, unknown>; Relationships: [] }>;
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
    Enums: Record<string, string>;
    CompositeTypes: Record<string, Record<string, unknown>>;
  };
};

type LooseSupabase = SupabaseClient<LooseDatabase>;

let _client: LooseSupabase | null = null;

function getClient(): LooseSupabase {
  if (_client) { return _client; }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  }
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  _client = createSupabaseClient<LooseDatabase>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

/**
 * Server-side Supabase client (service role).
 *
 * Matches the Insider codebase's import signature — returns a promise to
 * stay API-compatible with the original `@supabase/ssr` server helper,
 * even though our implementation is synchronous under the hood.
 */
export async function createClient(): Promise<LooseSupabase> {
  return getClient();
}

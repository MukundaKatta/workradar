import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient as createSSRBrowserClient, createServerClient as createSSRServerClient } from "@supabase/ssr";
import type { Database } from "./types.js";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/**
 * Create a Supabase client for use in the browser (React components).
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from env.
 */
export function createBrowserClient(): SupabaseClient<Database> {
  const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createSSRBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Create a Supabase client for use in server components / API routes.
 * Uses cookie-based auth via the provided cookie store.
 */
export function createServerClient(cookieStore: {
  getAll: () => { name: string; value: string }[];
  set: (name: string, value: string, options: Record<string, unknown>) => void;
}): SupabaseClient<Database> {
  const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createSSRServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll may be called from a Server Component where cookies
          // cannot be set. This is safe to ignore if middleware handles refresh.
        }
      },
    },
  });
}

/**
 * Create a Supabase admin client using the service role key.
 * Only use this in trusted server environments (API routes, workers).
 */
export function createServiceClient(): SupabaseClient<Database> {
  const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

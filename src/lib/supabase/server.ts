import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types';

/**
 * Creates a server-side Supabase client for Server Components,
 * Server Actions, and Route Handlers.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://placeholder.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'placeholder-anon-key';

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options: CookieOptions;
        }>
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be safely ignored when proxy/middleware refreshes sessions.
        }
      },
    },
  });
}

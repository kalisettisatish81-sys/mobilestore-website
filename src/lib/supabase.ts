import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

/**
 * Checks whether Supabase environment variables are provided.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder')
  );
};

// Fallback values prevent module import errors during build or SSR when credentials are not yet populated.
const clientUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
const clientKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key';

/**
 * Shared Supabase client instance for client and server components.
 * Strictly typed with Database schema.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  clientUrl,
  clientKey
);

/**
 * Safe connection test utility for development diagnostics.
 * Never logs credentials or secrets.
 */
export function testSupabaseConnection(): { configured: boolean; message: string } {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      message:
        'Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are currently empty in .env.local. Add your project credentials to connect to your database.',
    };
  }

  return {
    configured: true,
    message: 'Supabase client initialized successfully with project environment variables.',
  };
}

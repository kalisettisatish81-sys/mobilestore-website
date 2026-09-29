import { createClient as createBrowserClient } from '@/lib/supabase/client';

/**
 * Signs in an admin user using email and password in browser context.
 */
export async function signInAdmin(email: string, password: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  return { user: data.user, session: data.session, error: null };
}

/**
 * Signs out the currently authenticated user in browser context.
 */
export async function signOutAdmin() {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}

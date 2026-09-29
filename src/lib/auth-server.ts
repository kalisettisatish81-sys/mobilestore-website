import { createClient as createServerClient } from '@/lib/supabase/server';
import type { AdminUser } from '@/types';

/**
 * Checks whether an authenticated user ID has an authorized admin record.
 * Executes on the server using the server Supabase client.
 */
export async function verifyAdminStatus(userId: string): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    const admin = data as AdminUser;
    return admin.role === 'admin' || admin.role === 'super_admin';
  } catch {
    return false;
  }
}

/**
 * Retrieves the current authenticated user and their admin record on the server.
 */
export async function getAuthenticatedAdmin(): Promise<{
  user: { id: string; email?: string } | null;
  adminProfile: AdminUser | null;
}> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, adminProfile: null };
    }

    const { data: adminProfile } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return {
      user: { id: user.id, email: user.email },
      adminProfile: adminProfile ? (adminProfile as unknown as AdminUser) : null,
    };
  } catch {
    return { user: null, adminProfile: null };
  }
}

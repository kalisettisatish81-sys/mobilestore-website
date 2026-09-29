import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminStatus } from '@/lib/auth-server';
import MobilesManager from '@/components/admin/mobiles/MobilesManager';
import type { Mobile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminMobilesPage() {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // 2. Authorize admin status
  const isAdmin = await verifyAdminStatus(user.id);
  if (!isAdmin) {
    redirect('/admin/login');
  }

  // 3. Fetch current mobile products for initial render
  const { data: mobiles } = await supabase
    .from('mobiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <MobilesManager
        initialMobiles={(mobiles as Mobile[]) || []}
        adminEmail={user.email}
      />
    </main>
  );
}

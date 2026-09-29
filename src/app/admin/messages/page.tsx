import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminStatus } from '@/lib/auth-server';
import MessagesManager from '@/components/admin/messages/MessagesManager';
import AdminNav from '@/components/admin/AdminNav';
import type { ContactMessage } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
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

  // 3. Fetch contact messages
  const { data: messages, error: dbError } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  // 4. Handle database error gracefully without exposing internals
  if (dbError) {
    console.error('Error fetching contact messages:', dbError.message);

    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <AdminNav currentTab="messages" />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-400">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Unable to load contact messages right now.
          </h1>
          <p className="text-xs text-slate-400">
            Please verify your connection and database permissions or try again in a few moments.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              Try Again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <MessagesManager
        initialMessages={(messages as ContactMessage[]) || []}
        adminEmail={user.email}
      />
    </main>
  );
}

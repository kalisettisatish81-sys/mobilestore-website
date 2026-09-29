import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminStatus } from '@/lib/auth-server';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import LogoutButton from '@/components/admin/LogoutButton';
import CloudinaryTestUploader from '@/components/admin/CloudinaryTestUploader';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const isAdmin = await verifyAdminStatus(user.id);
  if (!isAdmin) {
    redirect('/admin/login');
  }

  // Fetch summary counts for mobiles, reviews, and contact messages
  const [mobilesRes, reviewsRes, messagesRes] = await Promise.all([
    supabase.from('mobiles').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
  ]);

  const totalMobiles = mobilesRes.count ?? 0;
  const totalReviews = reviewsRes.count ?? 0;
  const totalMessages = messagesRes.count ?? 0;
  const cloudinaryReady = isCloudinaryConfigured();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-slate-950 text-slate-100">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Admin Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Authenticated as: <span className="text-indigo-400 font-medium">{user.email}</span>
          </p>
        </div>

        {/* Quick Stats & Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          {/* Mobiles Card */}
          <Link
            href="/admin/mobiles"
            className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-indigo-500/40 hover:bg-slate-900"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Mobiles
              </span>
              <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">
                {totalMobiles}
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Total Products &rarr;
              </span>
            </div>
          </Link>

          {/* Reviews Card */}
          <Link
            href="/admin/reviews"
            className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-indigo-500/40 hover:bg-slate-900"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Reviews
              </span>
              <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">
                {totalReviews}
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Total Reviews &rarr;
              </span>
            </div>
          </Link>

          {/* Contact Messages Card */}
          <Link
            href="/admin/messages"
            className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-indigo-500/40 hover:bg-slate-900"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Messages
              </span>
              <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">
                {totalMessages}
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Total Messages &rarr;
              </span>
            </div>
          </Link>
        </div>

        {/* Action Links */}
        <div className="flex flex-col gap-2.5 mb-6">
          <Link
            href="/admin/mobiles"
            className="w-full text-center rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
          >
            Manage Mobiles
          </Link>
          <Link
            href="/admin/reviews"
            className="w-full text-center rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
          >
            Manage Reviews
          </Link>
          <Link
            href="/admin/messages"
            className="w-full text-center rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
          >
            View Messages
          </Link>
        </div>

        <div className="flex justify-center mb-6">
          <LogoutButton />
        </div>

        {/* Development Diagnostic: Cloudinary Upload Foundation Test */}
        <CloudinaryTestUploader isConfigured={cloudinaryReady} />
      </div>
    </main>
  );
}

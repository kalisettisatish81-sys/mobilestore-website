import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminStatus } from '@/lib/auth-server';
import { getAllReviews } from '@/lib/reviews';
import ReviewsManager from '@/components/admin/reviews/ReviewsManager';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
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

  // 3. Fetch reviews for initial render (ordered newest first)
  const reviews = await getAllReviews();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ReviewsManager
        initialReviews={reviews}
        adminEmail={user.email}
      />
    </main>
  );
}


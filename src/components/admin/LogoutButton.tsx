'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOutAdmin } from '@/lib/auth';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      await signOutAdmin();
      router.push('/admin/login');
      router.refresh();
    } catch {
      // Fallback redirect
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={
        className ||
        'inline-flex items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed'
      }
    >
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInAdmin } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (!configured) {
      setErrorMessage(
        'Supabase is not yet configured in .env.local. Please add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await signInAdmin(trimmedEmail, password);

      if (error) {
        setErrorMessage(error);
        return;
      }

      // Successful login -> redirect to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch {
      setErrorMessage('An unexpected error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to access the store administration dashboard.
          </p>
        </div>

        {!configured && (
          <div className="mb-6 rounded-md border border-amber-800/60 bg-amber-950/40 p-4 text-xs text-amber-300">
            <strong>Configuration Notice:</strong> Supabase credentials in{' '}
            <code className="text-amber-200">.env.local</code> are currently empty.
            Authentication requires valid project credentials.
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-md border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={loading}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}

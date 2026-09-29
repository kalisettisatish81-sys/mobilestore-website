'use client';

import { useEffect } from 'react';
import CustomerNavbar from '@/components/customer/Navbar';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MobilesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log safe error telemetry client-side if needed
    console.error('Mobile catalog rendering error:', error.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-rose-900/40 bg-slate-900/80 p-8 text-center backdrop-blur-md shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/60 text-rose-400 mb-4 border border-rose-800/50">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Unable to load mobiles
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            We ran into an unexpected issue while loading the catalog. Please try again.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

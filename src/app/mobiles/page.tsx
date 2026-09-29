import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getVisibleMobiles } from '@/lib/mobiles';
import type { Mobile } from '@/types';
import CustomerNavbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import MobileCatalog from '@/components/customer/MobileCatalog';

export const metadata: Metadata = {
  title: 'Mobiles | Premium Mobile Store',
  description:
    'Explore the latest smartphones from leading brands with premium specifications and competitive prices.',
};

export const dynamic = 'force-dynamic';

function MobileCatalogSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-14 w-full rounded-2xl bg-slate-900/60 border border-slate-800" />
      <div className="h-4 w-28 bg-slate-800 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-4"
          >
            <div className="aspect-square w-full rounded-xl bg-slate-800/70" />
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-slate-800 rounded" />
              <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
            </div>
            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
              <div className="h-6 w-20 bg-slate-800 rounded" />
              <div className="h-6 w-16 bg-slate-800 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function MobilesPage() {
  let mobiles: Mobile[] = [];
  let loadError: string | null = null;

  try {
    mobiles = await getVisibleMobiles();
    if (mobiles.length === 0) {
      loadError = 'No smartphones are currently available. Please check back shortly.';
    }
  } catch (err) {
    console.error('Customer catalog unexpected error:', err);
    loadError = 'Unable to load mobiles right now.';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Customer Navigation Bar */}
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <section className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            PREMIUM MOBILE COLLECTION
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Find Your Perfect Smartphone.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Explore our latest smartphones with powerful performance, stunning displays, and premium designs.
          </p>
        </section>

        {/* Catalog Body: Error State or Product Catalog */}
        {loadError ? (
          <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-8 text-center backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-900/30 text-rose-400 mb-4 border border-rose-800/40">
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
            <h2 className="text-lg font-bold text-white tracking-tight">
              Unable to load mobiles right now.
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
              Please check back in a few moments or try reloading the catalog.
            </p>
            <div className="mt-6">
              <Link
                href="/mobiles"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </Link>
            </div>
          </div>
        ) : (
          <Suspense fallback={<MobileCatalogSkeleton />}>
            <MobileCatalog initialMobiles={mobiles} />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import Link from 'next/link';
import type { Mobile } from '@/types';
import MobileCard from './MobileCard';

interface FeaturedMobilesProps {
  mobiles?: Mobile[];
  hasError?: boolean;
}

export default function FeaturedMobiles({
  mobiles = [],
  hasError = false,
}: FeaturedMobilesProps) {
  // Ensure maximum of 8 visible mobiles, without ever injecting fake items
  const safeMobiles = Array.isArray(mobiles) ? mobiles.slice(0, 8) : [];

  return (
    <section
      aria-labelledby="featured-mobiles-heading"
      className="relative w-full py-16 sm:py-20 lg:py-24 border-b border-slate-800/60 overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/5 blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden="true" />
              FEATURED COLLECTION
            </div>
            <h2
              id="featured-mobiles-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white"
            >
              Latest Smartphones.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              Explore our newest arrivals, selected from the latest products available in our collection.
            </p>
          </div>

          {/* Right side link (visible when products exist and no error) */}
          {!hasError && safeMobiles.length > 0 && (
            <div className="flex-shrink-0">
              <Link
                href="/mobiles"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg py-1 px-2 -ml-2 md:ml-0 transition-colors group"
              >
                <span>View All Mobiles</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Section Body */}
        {hasError ? (
          /* Graceful Error State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 sm:p-12 text-center backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400 mb-4 border border-slate-700/60 shadow-inner">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Featured mobiles are temporarily unavailable.
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
              Please browse our full collection directly or check back shortly.
            </p>
            <div className="mt-6">
              <Link
                href="/mobiles"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
              >
                <span>Browse Mobiles</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ) : safeMobiles.length === 0 ? (
          /* Polished Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 sm:p-12 text-center backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500 mb-4 border border-slate-700/60 shadow-inner">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              No featured mobiles yet.
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
              New smartphones will appear here as they are added to the collection.
            </p>
            <div className="mt-6">
              <Link
                href="/mobiles"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
              >
                <span>Browse Mobiles</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {safeMobiles.map((mobile) => (
                <MobileCard key={mobile.id} mobile={mobile} />
              ))}
            </div>

            {/* Bottom Navigation & Indicator */}
            <div className="mt-12 sm:mt-14 flex flex-col items-center justify-center gap-3 text-center">
              {safeMobiles.length < 8 && (
                <p className="text-xs text-slate-400">
                  Showing all {safeMobiles.length} currently available featured{' '}
                  {safeMobiles.length === 1 ? 'smartphone' : 'smartphones'}.
                </p>
              )}
              <Link
                href="/mobiles"
                className="inline-flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/90 px-8 py-3.5 text-sm font-bold text-white shadow-xl hover:border-slate-600 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-200"
              >
                <span>View All Mobiles</span>
                <span aria-hidden="true" className="text-indigo-400">
                  →
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

import CustomerNavbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';

export default function MobileDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse">
        {/* Navigation & Breadcrumbs Skeleton */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="h-5 w-32 bg-slate-800/80 rounded-lg" />
          <div className="h-4 w-48 bg-slate-800/60 rounded" />
        </div>

        {/* 2-Column Product Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery Placeholder (~55% width) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-slate-900/80 border border-slate-800/80" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-18 w-18 sm:h-20 sm:w-20 rounded-xl bg-slate-900/80 border border-slate-800/80 flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Product Information Placeholder (~45% width) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand & Title */}
            <div className="space-y-3">
              <div className="h-4 w-20 bg-slate-800/80 rounded" />
              <div className="h-9 w-3/4 bg-slate-800 rounded-xl" />
            </div>

            {/* Price & Stock Badge */}
            <div className="py-4 border-y border-slate-800/80 flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-slate-800/60 rounded" />
                <div className="h-8 w-32 bg-slate-800 rounded-lg" />
              </div>
              <div className="h-7 w-24 bg-slate-800/80 rounded-full" />
            </div>

            {/* Specifications Card Skeleton */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 space-y-4">
              <div className="h-5 w-28 bg-slate-800 rounded" />
              <div className="grid grid-cols-2 gap-3.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-950/60 border border-slate-800/60 p-3 space-y-2">
                    <div className="h-3 w-12 bg-slate-800/60 rounded" />
                    <div className="h-4 w-20 bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description Placeholder */}
            <div className="space-y-3 pt-2">
              <div className="h-5 w-36 bg-slate-800 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-800/60 rounded" />
                <div className="h-4 w-5/6 bg-slate-800/60 rounded" />
                <div className="h-4 w-4/6 bg-slate-800/60 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

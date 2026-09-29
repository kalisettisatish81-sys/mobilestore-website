import CustomerNavbar from '@/components/customer/Navbar';

export default function MobilesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-9 w-64 bg-slate-800/80 rounded-xl" />
          <div className="h-5 w-96 max-w-full bg-slate-800/50 rounded-lg" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-5 h-10 bg-slate-800/70 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:col-span-7">
              <div className="h-10 bg-slate-800/70 rounded-xl" />
              <div className="h-10 bg-slate-800/70 rounded-xl" />
              <div className="h-10 bg-slate-800/70 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Counter Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-slate-800/60 rounded" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-4"
            >
              {/* Image Skeleton */}
              <div className="aspect-square w-full rounded-xl bg-slate-800/70" />

              {/* Title & Brand Skeleton */}
              <div className="space-y-2 pt-1">
                <div className="h-5 w-3/4 bg-slate-800/80 rounded" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-slate-800/60 rounded" />
                  <div className="h-5 w-20 bg-slate-800/60 rounded" />
                </div>
              </div>

              {/* Footer Skeleton */}
              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div className="h-6 w-24 bg-slate-800/80 rounded" />
                <div className="h-6 w-20 bg-slate-800/80 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

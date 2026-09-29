export default function AdminMessagesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 animate-pulse">
      {/* Top Navigation Skeleton */}
      <div className="w-full border-b border-slate-800/80 bg-slate-950/80 h-14 mb-8">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex gap-3">
            <div className="h-7 w-20 bg-slate-800 rounded-xl" />
            <div className="h-7 w-20 bg-slate-800 rounded-xl" />
            <div className="h-7 w-20 bg-slate-800 rounded-xl" />
            <div className="h-7 w-20 bg-slate-800 rounded-xl" />
          </div>
          <div className="h-7 w-24 bg-slate-800 rounded-xl" />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 pb-12 sm:px-6 lg:px-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="h-8 w-60 bg-slate-800 rounded-xl" />
            <div className="h-4 w-96 bg-slate-900 rounded-lg" />
          </div>
          <div className="h-9 w-24 bg-slate-800 rounded-xl" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="h-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl" />

        {/* Table / Cards Skeleton */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="h-6 w-full bg-slate-800/70 rounded-lg" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-800/40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

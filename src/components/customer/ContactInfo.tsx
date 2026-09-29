import Link from 'next/link';

/**
 * ContactInfo Component
 * Displays store contact details, operating timings, and a stylized map placeholder.
 * Contains explicit placeholders for address and phone with TODO markers for future real-world configuration.
 */
export default function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email Card */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/90 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Support</h3>
              <span className="inline-block text-[10px] text-emerald-400 font-medium">Quick Response</span>
            </div>
          </div>
          <Link
            href="mailto:support@premiummobilestore.com"
            className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors break-all"
          >
            support@premiummobilestore.com
          </Link>
          <p className="text-xs text-slate-400 mt-1">Our support team responds within 24 hours.</p>
        </div>

        {/* Phone Card */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/90 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 group-hover:scale-110 transition-transform">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Direct Phone</h3>
              <span className="inline-block text-[10px] text-amber-400 font-medium">Configurable</span>
            </div>
          </div>
          {/* TODO: Configure real phone number when store telephony line is activated */}
          <p className="text-sm font-semibold text-white tracking-wider">
            +91 XXXXX XXXXX
          </p>
          <p className="text-xs text-slate-400 mt-1">Toll-free customer assistance line.</p>
        </div>
      </div>

      {/* Store Hours Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Store Hours</h3>
            <span className="text-[10px] text-slate-500 font-medium">Configurable Schedule</span>
          </div>
        </div>

        {/* TODO: Update operating hours when seasonal or holiday schedule changes */}
        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="font-medium text-slate-200">Monday – Saturday</span>
            <span className="text-indigo-300 font-semibold">10:00 AM – 8:00 PM</span>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <span className="font-medium text-slate-200">Sunday</span>
            <span className="text-indigo-300 font-semibold">11:00 AM – 6:00 PM</span>
          </div>
        </div>
      </div>

      {/* Store Location & Map Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Visit Our Store</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Experience the latest smartphones in person at our flagship retail showroom.
            </p>
          </div>
          <span className="rounded-full bg-indigo-950/80 border border-indigo-700/50 px-2.5 py-1 text-[10px] font-semibold text-indigo-300">
            Showroom
          </span>
        </div>

        {/* Store Address Details */}
        {/* ==================================================================== */}
        {/* TODO: Configure actual physical store address once retail lease is finalized */}
        {/* ==================================================================== */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-1 text-xs">
          <p className="font-semibold text-white text-sm">Premium Mobile Store</p>
          <p className="text-slate-300">Store Address</p>
          <p className="text-slate-400">Your complete store address will be configured here</p>
          <p className="text-slate-500 font-medium pt-1">India</p>
        </div>

        {/* Map Container Placeholder */}
        <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 p-6 flex flex-col items-center justify-center text-center min-h-[190px]">
          {/* Subtle grid background pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Map Pin Glow Icon */}
          <div className="relative z-10 mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <h4 className="relative z-10 text-sm font-bold text-white">Store Location</h4>
          <p className="relative z-10 text-xs text-slate-400 max-w-xs mt-1">
            Map location will be configured once the final store address is available.
          </p>

          <div className="relative z-10 mt-4">
            <button
              type="button"
              disabled
              title="Directions will be enabled once physical address coordinates are finalized."
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 cursor-not-allowed opacity-75 shadow-sm"
            >
              <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

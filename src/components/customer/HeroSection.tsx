import Link from 'next/link';
import Hero3DPhone from '@/components/customer/Hero3DPhone';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-20">
      {/* Background Ambient Glow Effects */}
      <div
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[600px] h-[400px] sm:w-[900px] sm:h-[500px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Eyebrow, Heading, Copy, CTAs (~45% on desktop) */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left z-10">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 backdrop-blur-sm shadow-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" aria-hidden="true" />
              PREMIUM MOBILE STORE
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-200 bg-clip-text text-transparent">
                Smartphone.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Explore the latest smartphones with premium design, powerful performance, and the features that matter to you.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/mobiles"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                <span>Explore Mobiles</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500/50 cursor-pointer"
              >
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Quick feature highlights under CTA */}
            <div className="pt-4 grid grid-cols-3 gap-2 border-t border-slate-800/80">
              <div className="text-center lg:text-left">
                <p className="text-lg sm:text-xl font-extrabold text-white">20+</p>
                <p className="text-xs text-slate-400">Flagships</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-lg sm:text-xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400">Authentic</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-lg sm:text-xl font-extrabold text-white">Express</p>
                <p className="text-xs text-slate-400">Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Smartphone (~58% on desktop) */}
          <div className="lg:col-span-7 flex items-center justify-center relative w-full">
            <Hero3DPhone />
          </div>
        </div>
      </div>
    </section>
  );
}

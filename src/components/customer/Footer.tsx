import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* 1. Store / Brand Area */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1 transition"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 transition group-hover:scale-105">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                Premium Mobile Store
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover modern smartphones with premium design, powerful performance, and features that fit your needs.
            </p>
          </div>

          {/* 2. Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-0.5 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/mobiles"
                  className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-0.5 transition-colors"
                >
                  Mobiles
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-0.5 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  id="footer-nav-admin-login"
                  className="text-slate-400 hover:text-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-0.5 transition-colors inline-flex items-center gap-1.5"
                >
                  <svg
                    className="w-3.5 h-3.5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Customer Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-0.5 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/mobiles"
                  className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-0.5 transition-colors"
                >
                  Browse Mobiles
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Store Contact Details (reusing existing configured project info) */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Store Contact
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              <span className="block text-slate-300 font-medium">Physical Location:</span>
              Store address will be configured here, India.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              <span className="block text-slate-300 font-medium">Email Support:</span>
              <Link
                href="mailto:support@premiummobilestore.com"
                className="text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
              >
                support@premiummobilestore.com
              </Link>
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              <span className="block text-slate-300 font-medium">Phone:</span>
              <span className="text-slate-300 font-mono text-xs">+91 XXXXX XXXXX</span>
            </p>
            <p className="text-xs text-slate-500 pt-1">
              Mon – Sat: 10:00 AM – 8:00 PM
            </p>
          </div>
        </div>

        {/* Footer Bottom / Copyright & Admin Portal */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Premium Mobile Store. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="text-slate-500 text-xs hidden sm:inline">
              Authentic Smartphones &amp; Accessories
            </span>
            <span className="text-slate-800 hidden sm:inline" aria-hidden="true">•</span>
            <Link
              href="/admin/login"
              id="footer-bottom-admin-login"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-800/90 bg-slate-900/80 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm"
              title="Store Owner &amp; Administrator Login"
            >
              <svg
                className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="font-medium">Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

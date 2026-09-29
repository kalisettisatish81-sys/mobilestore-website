'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CustomerNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Mobiles', href: '/mobiles' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1 transition"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 text-white transition group-hover:scale-105">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition">
            Premium Mobile Store
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-1.5 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'bg-slate-800 text-indigo-400 font-semibold shadow-inner'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1.5"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center rounded-xl px-4 py-3 text-base font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'bg-slate-800/90 text-indigo-400 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

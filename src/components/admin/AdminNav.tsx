'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

interface AdminNavProps {
  currentTab?: 'dashboard' | 'mobiles' | 'reviews' | 'messages';
}

export default function AdminNav({ currentTab }: AdminNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/admin',
      active: currentTab === 'dashboard' || pathname === '/admin',
    },
    {
      id: 'mobiles',
      label: 'Mobiles',
      href: '/admin/mobiles',
      active: currentTab === 'mobiles' || pathname.startsWith('/admin/mobiles'),
    },
    {
      id: 'reviews',
      label: 'Reviews',
      href: '/admin/reviews',
      active: currentTab === 'reviews' || pathname.startsWith('/admin/reviews'),
    },
    {
      id: 'messages',
      label: 'Messages',
      href: '/admin/messages',
      active: currentTab === 'messages' || pathname.startsWith('/admin/messages'),
    },
  ];

  return (
    <div className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition ${
                  item.active
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Quick Actions (Storefront & Logout) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <span>View Store &rarr;</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

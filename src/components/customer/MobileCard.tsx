'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Mobile } from '@/types';
import { formatPrice } from '@/utils';
import { getProductCardImageUrl } from '@/utils/cloudinary';

interface MobileCardProps {
  mobile: Mobile;
}

export default function MobileCard({ mobile }: MobileCardProps) {
  const [imageError, setImageError] = useState(false);
  const primaryImage = mobile.images?.[0];

  // Stock Status styling
  const stockConfig = {
    'In Stock': {
      dot: 'bg-emerald-400',
      badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    },
    'Limited Stock': {
      dot: 'bg-amber-400',
      badge: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
    },
    'Out of Stock': {
      dot: 'bg-rose-400',
      badge: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
    },
  }[mobile.stock_status] || {
    dot: 'bg-slate-400',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <Link
      href={`/mobiles/${mobile.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/60 flex items-center justify-center">
        {primaryImage && !imageError ? (
          <Image
            src={getProductCardImageUrl(primaryImage)}
            alt={`${mobile.brand} ${mobile.name}`}
            fill
            unoptimized
            onError={() => setImageError(true)}
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-600">
            <svg
              className="h-12 w-12 text-slate-700 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[11px] font-medium text-slate-500">
              Image preview unavailable
            </span>
          </div>
        )}

        {/* Brand Tag Overlay */}
        <span className="absolute top-3 left-3 rounded-md bg-slate-950/85 px-2.5 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur-md border border-slate-800">
          {mobile.brand}
        </span>
      </div>

      {/* Content Details */}
      <div className="flex flex-1 flex-col pt-4">
        {/* Mobile Name */}
        <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-300 transition-colors">
          {mobile.name}
        </h3>

        {/* Specifications: RAM & Storage */}
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/60">
            {mobile.ram} RAM
          </span>
          <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/60">
            {mobile.storage} Storage
          </span>
        </div>

        {/* Description Snippet (if available) */}
        {mobile.description && (
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {mobile.description}
          </p>
        )}

        {/* Footer: Price & Stock Status */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800/60">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Price
            </span>
            <span className="text-lg font-extrabold text-white tracking-tight">
              {formatPrice(mobile.price)}
            </span>
          </div>

          {/* Stock Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${stockConfig.badge}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${stockConfig.dot}`}
              aria-hidden="true"
            />
            {mobile.stock_status}
          </span>
        </div>
      </div>
    </Link>
  );
}

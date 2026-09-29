'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Mobile } from '@/types';
import MobileCard from './MobileCard';
import MobileFilters from './MobileFilters';

interface MobileCatalogProps {
  initialMobiles?: Mobile[];
}

const STANDARD_RAM_OPTIONS = ['4GB', '6GB', '8GB', '12GB', '16GB', '24GB'];
const STANDARD_STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];

/**
 * Helper to sort capacity strings (e.g. 4GB, 6GB, 8GB, 12GB, 16GB, 64GB, 128GB, 256GB, 512GB, 1TB)
 * Safe against undefined, null, non-strings, or malformed inputs.
 */
function parseCapacityInMB(capacity?: string | null): number {
  if (!capacity || typeof capacity !== 'string') return 0;
  const clean = capacity.trim().toUpperCase();
  const numeric = parseFloat(clean.replace(/[^0-9.]/g, '')) || 0;
  if (clean.includes('TB')) {
    return numeric * 1024 * 1024;
  }
  if (clean.includes('GB')) {
    return numeric * 1024;
  }
  if (clean.includes('MB')) {
    return numeric;
  }
  return numeric;
}

export default function MobileCatalog({ initialMobiles = [] }: MobileCatalogProps) {
  const searchParams = useSearchParams();

  // Initialize state from URL search params if present
  const initialSearch = searchParams.get('search') || '';
  const initialRam = searchParams.get('ram') || 'ALL';
  const initialStorage = searchParams.get('storage') || 'ALL';
  const initialSort = searchParams.get('sort') || 'newest';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [ramFilter, setRamFilter] = useState(initialRam);
  const [storageFilter, setStorageFilter] = useState(initialStorage);
  const [sortBy, setSortBy] = useState(initialSort);

  // Sync state changes with URL query parameters for shareability
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (ramFilter !== 'ALL') params.set('ram', ramFilter);
    if (storageFilter !== 'ALL') params.set('storage', storageFilter);
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState(null, '', newUrl);
  }, [searchTerm, ramFilter, storageFilter, sortBy]);

  // Sync browser back/forward navigation
  useEffect(() => {
    function handlePopState() {
      const params = new URLSearchParams(window.location.search);
      setSearchTerm(params.get('search') || '');
      setRamFilter(params.get('ram') || 'ALL');
      setStorageFilter(params.get('storage') || 'ALL');
      setSortBy(params.get('sort') || 'newest');
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Guard against non-array or undefined inputs
  const safeMobiles = useMemo(() => {
    return Array.isArray(initialMobiles) ? initialMobiles : [];
  }, [initialMobiles]);

  // Combine standard RAM options with any existing database values
  const availableRams = useMemo(() => {
    const rams = new Set<string>(STANDARD_RAM_OPTIONS);
    for (const mobile of safeMobiles) {
      if (mobile?.ram && typeof mobile.ram === 'string' && mobile.ram.trim()) {
        rams.add(mobile.ram.trim());
      }
    }
    return Array.from(rams).sort(
      (a, b) => parseCapacityInMB(a) - parseCapacityInMB(b)
    );
  }, [safeMobiles]);

  // Combine standard Storage options with any existing database values
  const availableStorages = useMemo(() => {
    const storages = new Set<string>(STANDARD_STORAGE_OPTIONS);
    for (const mobile of safeMobiles) {
      if (mobile?.storage && typeof mobile.storage === 'string' && mobile.storage.trim()) {
        storages.add(mobile.storage.trim());
      }
    }
    return Array.from(storages).sort(
      (a, b) => parseCapacityInMB(a) - parseCapacityInMB(b)
    );
  }, [safeMobiles]);

  // Combined Token Search, Multi-Filter, and Sorting logic
  const filteredAndSortedMobiles = useMemo(() => {
    const trimmedQuery = searchTerm.trim().toLowerCase();
    const searchTokens = trimmedQuery.split(/\s+/).filter(Boolean);

    // 1. Filtering
    const filtered = safeMobiles.filter((mobile) => {
      if (!mobile) return false;

      // Multi-attribute token search (matches name, brand, ram, storage)
      if (searchTokens.length > 0) {
        const searchableContent = `${mobile.brand || ''} ${mobile.name || ''} ${mobile.ram || ''} ${mobile.storage || ''}`.toLowerCase();
        const matchesAll = searchTokens.every((token) =>
          searchableContent.includes(token)
        );
        if (!matchesAll) return false;
      }

      // RAM condition
      if (ramFilter !== 'ALL') {
        const itemRam = (mobile.ram || '').trim().toLowerCase();
        if (itemRam !== ramFilter.trim().toLowerCase()) return false;
      }

      // Storage condition
      if (storageFilter !== 'ALL') {
        const itemStorage = (mobile.storage || '').trim().toLowerCase();
        if (itemStorage !== storageFilter.trim().toLowerCase()) return false;
      }

      return true;
    });

    // 2. Sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }
      if (sortBy === 'price-desc') {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }
      // 'newest' (default) orders by creation date descending
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [safeMobiles, searchTerm, ramFilter, storageFilter, sortBy]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
      ramFilter !== 'ALL' ||
      storageFilter !== 'ALL' ||
      sortBy !== 'newest'
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setRamFilter('ALL');
    setStorageFilter('ALL');
    setSortBy('newest');
    window.history.replaceState(null, '', window.location.pathname);
  };

  const count = filteredAndSortedMobiles.length;
  const countLabel =
    count === 0
      ? 'No mobiles found'
      : count === 1
      ? '1 mobile'
      : `${count} mobiles`;

  return (
    <div className="space-y-8">
      {/* Search and Filters Control Center */}
      <section aria-labelledby="catalog-filters-heading">
        <h2 id="catalog-filters-heading" className="sr-only">
          Filter and Search Mobiles
        </h2>
        <MobileFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          ramFilter={ramFilter}
          onRamChange={setRamFilter}
          storageFilter={storageFilter}
          onStorageChange={setStorageFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availableRams={availableRams}
          availableStorages={availableStorages}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </section>

      {/* Result Status & Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-slate-300">
          {countLabel}
        </p>

        {hasActiveFilters && count > 0 && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Product Cards Grid or Polished Empty State */}
      {count > 0 ? (
        <section aria-label="Mobile Product Catalog">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMobiles.map((mobile) => (
              <MobileCard key={mobile.id} mobile={mobile} />
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center backdrop-blur-sm">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            No mobiles found
          </h3>
          <p className="mt-2 text-sm text-slate-400 max-w-sm">
            Try changing your search or filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

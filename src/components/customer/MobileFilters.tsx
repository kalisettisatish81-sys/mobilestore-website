'use client';

interface MobileFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  ramFilter: string;
  onRamChange: (value: string) => void;
  storageFilter: string;
  onStorageChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  availableRams: string[];
  availableStorages: string[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function MobileFilters({
  searchTerm,
  onSearchChange,
  ramFilter,
  onRamChange,
  storageFilter,
  onStorageChange,
  sortBy,
  onSortChange,
  availableRams,
  availableStorages,
  onClearFilters,
  hasActiveFilters,
}: MobileFiltersProps) {
  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm shadow-xl">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
        {/* Search Bar (Spans 5 cols on lg) */}
        <div className="lg:col-span-5">
          <label htmlFor="mobile-search-input" className="sr-only">
            Search mobiles by name or brand
          </label>
          <div className="relative">
            {/* Search Icon */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              id="mobile-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search mobiles..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />

            {/* Clear Search Button */}
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Dropdowns (Spans 7 cols on lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:col-span-7">
          {/* RAM Filter */}
          <div>
            <label htmlFor="ram-filter-select" className="sr-only">
              Filter by RAM
            </label>
            <select
              id="ram-filter-select"
              value={ramFilter}
              onChange={(e) => onRamChange(e.target.value)}
              aria-label="Filter by RAM"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 px-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
            >
              <option value="ALL">All RAM</option>
              {availableRams.map((ram) => (
                <option key={ram} value={ram}>
                  {ram}
                </option>
              ))}
            </select>
          </div>

          {/* Storage Filter */}
          <div>
            <label htmlFor="storage-filter-select" className="sr-only">
              Filter by Storage
            </label>
            <select
              id="storage-filter-select"
              value={storageFilter}
              onChange={(e) => onStorageChange(e.target.value)}
              aria-label="Filter by Storage"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 px-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
            >
              <option value="ALL">All Storage</option>
              {availableStorages.map((storage) => (
                <option key={storage} value={storage}>
                  {storage}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label htmlFor="sort-by-select" className="sr-only">
              Sort mobiles
            </label>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort mobiles"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 px-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Tags & Reset */}
      {hasActiveFilters && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-400">
            <span>Filtered by:</span>
            {searchTerm.trim() && (
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-950/80 px-2 py-0.5 text-indigo-300 border border-indigo-800/60">
                &ldquo;{searchTerm.trim()}&rdquo;
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="hover:text-white"
                  aria-label="Remove search filter"
                >
                  &times;
                </button>
              </span>
            )}
            {ramFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-950/80 px-2 py-0.5 text-indigo-300 border border-indigo-800/60">
                {ramFilter}
                <button
                  type="button"
                  onClick={() => onRamChange('ALL')}
                  className="hover:text-white"
                  aria-label="Remove RAM filter"
                >
                  &times;
                </button>
              </span>
            )}
            {storageFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-950/80 px-2 py-0.5 text-indigo-300 border border-indigo-800/60">
                {storageFilter}
                <button
                  type="button"
                  onClick={() => onStorageChange('ALL')}
                  className="hover:text-white"
                  aria-label="Remove Storage filter"
                >
                  &times;
                </button>
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-slate-300 border border-slate-700">
                Sort: {sortBy === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

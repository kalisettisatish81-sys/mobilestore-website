'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Mobile, StockStatus } from '@/types';
import { formatPrice } from '@/utils';
import { getProductThumbnailUrl } from '@/utils/cloudinary';
import MobileFormModal from './MobileFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  createMobileAction,
  updateMobileAction,
  toggleMobileVisibilityAction,
  deleteMobileAction,
  getMobilesAction,
} from '@/app/admin/mobiles/actions';
import AdminNav from '@/components/admin/AdminNav';

interface MobilesManagerProps {
  initialMobiles: Mobile[];
  adminEmail?: string;
}

export default function MobilesManager({
  initialMobiles,
  adminEmail,
}: MobilesManagerProps) {
  const [mobiles, setMobiles] = useState<Mobile[]>(initialMobiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'ALL' | StockStatus>('ALL');
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | 'VISIBLE' | 'HIDDEN'>('ALL');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMobile, setEditingMobile] = useState<Mobile | null>(null);

  const [deletingMobile, setDeletingMobile] = useState<Mobile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper to re-fetch mobiles from server
  async function refreshMobiles() {
    const res = await getMobilesAction();
    if (res.success && res.data) {
      setMobiles(res.data);
    }
  }

  // Open modal for Create
  function handleOpenCreate() {
    setEditingMobile(null);
    setIsFormOpen(true);
  }

  // Open modal for Edit
  function handleOpenEdit(mobile: Mobile) {
    setEditingMobile(mobile);
    setIsFormOpen(true);
  }

  // Open modal for Delete
  function handleOpenDelete(mobile: Mobile) {
    setDeletingMobile(mobile);
  }

  // Confirm Delete
  async function handleConfirmDelete() {
    if (!deletingMobile) return;
    setDeleteLoading(true);

    try {
      const res = await deleteMobileAction(deletingMobile.id);
      if (!res.success) {
        setAlert({ type: 'error', text: res.error || 'Unable to delete mobile right now. Please try again.' });
        return;
      }

      setMobiles((prev) => prev.filter((m) => m.id !== deletingMobile.id));
      setAlert({
        type: 'success',
        text: `Mobile "${deletingMobile.name}" deleted successfully.`,
      });
      setDeletingMobile(null);
    } catch {
      setAlert({ type: 'error', text: 'Unable to delete mobile right now. Please try again.' });
    } finally {
      setDeleteLoading(false);
    }
  }

  // Toggle Visibility (Hide / Show)
  async function handleToggleVisibility(mobile: Mobile) {
    setToggleLoadingId(mobile.id);
    const newHiddenState = !mobile.is_hidden;

    try {
      const res = await toggleMobileVisibilityAction(mobile.id, newHiddenState);
      if (!res.success) {
        setAlert({ type: 'error', text: res.error || 'Failed to update visibility.' });
        return;
      }

      setMobiles((prev) =>
        prev.map((m) => (m.id === mobile.id ? { ...m, is_hidden: newHiddenState } : m))
      );
      setAlert({
        type: 'success',
        text: `Mobile "${mobile.name}" visibility updated (${newHiddenState ? 'Hidden' : 'Visible'}).`,
      });
    } catch {
      setAlert({ type: 'error', text: 'Unable to update visibility. Please try again.' });
    } finally {
      setToggleLoadingId(null);
    }
  }

  // Filtered and searched mobiles (Name + Brand)
  const filteredMobiles = mobiles.filter((m) => {
    const trimmedQuery = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !trimmedQuery ||
      m.name.toLowerCase().includes(trimmedQuery) ||
      m.brand.toLowerCase().includes(trimmedQuery);

    const matchesStock = stockFilter === 'ALL' || m.stock_status === stockFilter;

    const matchesVisibility =
      visibilityFilter === 'ALL' ||
      (visibilityFilter === 'VISIBLE' && !m.is_hidden) ||
      (visibilityFilter === 'HIDDEN' && m.is_hidden);

    return matchesSearch && matchesStock && matchesVisibility;
  });

  function formatDate(dateStr: string) {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <>
      <AdminNav currentTab="mobiles" />
      <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-white transition">
              Admin Dashboard
            </Link>
            <span>/</span>
            <span className="text-indigo-400">Mobile Management</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Mobile Management
            </h1>
            <span className="rounded-full bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
              {mobiles.length} {mobiles.length === 1 ? 'Mobile' : 'Mobiles'}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Manage your mobile inventory, pricing, visibility, images, and stock status.
            {adminEmail && (
              <span className="ml-2 text-xs text-slate-500">
                Logged in as {adminEmail}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            &larr; Dashboard
          </Link>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            + Add Mobile
          </button>
        </div>
      </div>

      {/* Alert Notification Banner */}
      {alert && (
        <div
          className={`mb-6 flex items-center justify-between rounded-xl border p-4 text-sm transition animate-in fade-in duration-150 ${
            alert.type === 'success'
              ? 'border-emerald-800/80 bg-emerald-950/40 text-emerald-300'
              : 'border-rose-800/80 bg-rose-950/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{alert.type === 'success' ? '✓' : '⚠'}</span>
            <span>{alert.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlert(null)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        {/* Search Input: Name & Brand */}
        <div className="sm:col-span-6">
          <label htmlFor="search-mobiles" className="sr-only">
            Search mobiles...
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search-mobiles"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mobiles..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Stock Filter */}
        <div className="sm:col-span-3">
          <label htmlFor="stock-filter" className="sr-only">
            Filter by stock status
          </label>
          <select
            id="stock-filter"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as 'ALL' | StockStatus)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
          >
            <option value="ALL">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Limited Stock">Limited Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Visibility Filter */}
        <div className="sm:col-span-3">
          <label htmlFor="visibility-filter" className="sr-only">
            Filter by visibility
          </label>
          <select
            id="visibility-filter"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value as 'ALL' | 'VISIBLE' | 'HIDDEN')}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
          >
            <option value="ALL">All Visibility</option>
            <option value="VISIBLE">Visible</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 mb-4">
        <p className="text-xs font-semibold text-slate-400">
          Showing {filteredMobiles.length} of {mobiles.length} mobiles
        </p>
        {(searchTerm || stockFilter !== 'ALL' || visibilityFilter !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStockFilter('ALL');
              setVisibilityFilter('ALL');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Main Content: Empty State, Table, or Cards */}
      {mobiles.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center backdrop-blur-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 mb-4 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            No mobiles in inventory
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
            Add your first mobile to start building the catalog.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            + Add Mobile
          </button>
        </div>
      ) : filteredMobiles.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-sm">
          No mobiles match your active search or filter criteria.{' '}
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStockFilter('ALL');
              setVisibilityFilter('ALL');
            }}
            className="text-indigo-400 underline hover:text-indigo-300 ml-1"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Product Image</th>
                  <th scope="col" className="px-5 py-3.5">Mobile Name</th>
                  <th scope="col" className="px-4 py-3.5">Brand</th>
                  <th scope="col" className="px-4 py-3.5">Price</th>
                  <th scope="col" className="px-4 py-3.5">RAM</th>
                  <th scope="col" className="px-4 py-3.5">Storage</th>
                  <th scope="col" className="px-4 py-3.5">Stock Status</th>
                  <th scope="col" className="px-4 py-3.5">Visibility</th>
                  <th scope="col" className="px-4 py-3.5">Created Date</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMobiles.map((mobile) => {
                  const coverImage = mobile.images?.[0];
                  const isToggleLoading = toggleLoadingId === mobile.id;

                  return (
                    <tr
                      key={mobile.id}
                      className="transition-colors hover:bg-slate-800/40 text-slate-200"
                    >
                      {/* Product Image */}
                      <td className="px-5 py-4">
                        <div className="relative h-12 w-12 flex-shrink-0 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden flex items-center justify-center">
                          {coverImage ? (
                            <Image
                              src={getProductThumbnailUrl(coverImage)}
                              alt={mobile.name}
                              fill
                              unoptimized
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-600">
                              No img
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Mobile Name */}
                      <td className="px-5 py-4 font-bold text-white max-w-xs truncate">
                        {mobile.name}
                      </td>

                      {/* Brand */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700/60">
                          {mobile.brand}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 whitespace-nowrap font-extrabold text-white">
                        {formatPrice(mobile.price)}
                      </td>

                      {/* RAM */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-300">
                        {mobile.ram}
                      </td>

                      {/* Storage */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-300">
                        {mobile.storage}
                      </td>

                      {/* Stock Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            mobile.stock_status === 'In Stock'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                              : mobile.stock_status === 'Limited Stock'
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              mobile.stock_status === 'In Stock'
                                ? 'bg-emerald-400'
                                : mobile.stock_status === 'Limited Stock'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          {mobile.stock_status}
                        </span>
                      </td>

                      {/* Visibility */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            mobile.is_hidden
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              mobile.is_hidden ? 'bg-slate-500' : 'bg-indigo-400'
                            }`}
                          />
                          {mobile.is_hidden ? 'Hidden' : 'Visible'}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-400">
                        {formatDate(mobile.created_at)}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(mobile)}
                            className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(mobile)}
                            disabled={isToggleLoading}
                            title={mobile.is_hidden ? 'Make visible in store' : 'Hide from store'}
                            className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-40"
                          >
                            {isToggleLoading
                              ? '...'
                              : mobile.is_hidden
                              ? 'Show'
                              : 'Hide'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(mobile)}
                            className="rounded-lg border border-rose-900/40 bg-rose-950/30 px-2.5 py-1 text-xs font-medium text-rose-400 hover:bg-rose-900/60 hover:text-rose-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (< md) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredMobiles.map((mobile) => {
              const coverImage = mobile.images?.[0];
              const isToggleLoading = toggleLoadingId === mobile.id;

              return (
                <div
                  key={mobile.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden flex items-center justify-center">
                      {coverImage ? (
                        <Image
                          src={getProductThumbnailUrl(coverImage)}
                          alt={mobile.name}
                          fill
                          unoptimized
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-600">
                          No img
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700/60">
                          {mobile.brand}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            mobile.stock_status === 'In Stock'
                              ? 'bg-emerald-950 text-emerald-400'
                              : mobile.stock_status === 'Limited Stock'
                              ? 'bg-amber-950 text-amber-400'
                              : 'bg-rose-950 text-rose-400'
                          }`}
                        >
                          {mobile.stock_status}
                        </span>
                      </div>
                      <h4 className="font-bold text-white truncate text-base">
                        {mobile.name}
                      </h4>
                      <p className="text-sm font-extrabold text-white">
                        {formatPrice(mobile.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex gap-2">
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                        {mobile.ram}
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                        {mobile.storage}
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                        {mobile.is_hidden ? 'Hidden' : 'Visible'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {formatDate(mobile.created_at)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(mobile)}
                      className="rounded-xl border border-slate-700 bg-slate-800/80 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition text-center"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(mobile)}
                      disabled={isToggleLoading}
                      className="rounded-xl border border-slate-700 bg-slate-800/80 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition text-center disabled:opacity-40"
                    >
                      {isToggleLoading ? '...' : mobile.is_hidden ? 'Show' : 'Hide'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(mobile)}
                      className="rounded-xl border border-rose-900/50 bg-rose-950/40 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-900/60 hover:text-rose-200 transition text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Mobile Modal */}
      <MobileFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={(msg) => {
          setAlert({ type: 'success', text: msg });
          refreshMobiles();
        }}
        initialMobile={editingMobile}
        createAction={createMobileAction}
        updateAction={updateMobileAction}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingMobile)}
        mobileName={deletingMobile?.name || ''}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingMobile(null)}
      />
    </div>
    </>
  );
}

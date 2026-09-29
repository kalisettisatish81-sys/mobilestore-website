'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Review } from '@/types';
import ReviewFormModal from './ReviewFormModal';
import DeleteReviewConfirmModal from './DeleteReviewConfirmModal';
import {
  createReviewAction,
  updateReviewAction,
  deleteReviewAction,
  getReviewsAction,
} from '@/app/admin/reviews/actions';
import AdminNav from '@/components/admin/AdminNav';

interface ReviewsManagerProps {
  initialReviews: Review[];
  adminEmail?: string;
}

export default function ReviewsManager({
  initialReviews,
  adminEmail,
}: ReviewsManagerProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'ALL' | '5' | '4' | '3' | '2' | '1'>('ALL');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper to re-fetch reviews
  async function refreshReviews() {
    const res = await getReviewsAction();
    if (res.success && res.data) {
      setReviews(res.data);
    }
  }

  // Open modal for Create
  function handleOpenCreate() {
    setEditingReview(null);
    setIsFormOpen(true);
  }

  // Open modal for Edit
  function handleOpenEdit(review: Review) {
    setEditingReview(review);
    setIsFormOpen(true);
  }

  // Open modal for Delete
  function handleOpenDelete(review: Review) {
    setDeletingReview(review);
  }

  // Confirm Delete
  async function handleConfirmDelete() {
    if (!deletingReview) return;
    setDeleteLoading(true);

    try {
      const res = await deleteReviewAction(deletingReview.id);
      if (!res.success) {
        setAlert({ type: 'error', text: res.error || 'Failed to delete review.' });
        return;
      }

      setReviews((prev) => prev.filter((r) => r.id !== deletingReview.id));
      setAlert({
        type: 'success',
        text: `Review from "${deletingReview.customer_name}" deleted successfully.`,
      });
      setDeletingReview(null);
    } catch {
      setAlert({ type: 'error', text: 'An unexpected error occurred while deleting.' });
    } finally {
      setDeleteLoading(false);
    }
  }

  // Combined Search and Filter logic
  const filteredReviews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return reviews
      .filter((review) => {
        // Search condition (customer name or review text)
        if (query) {
          const nameMatch = (review.customer_name || '').toLowerCase().includes(query);
          const textMatch = (review.review_text || '').toLowerCase().includes(query);
          if (!nameMatch && !textMatch) return false;
        }

        // Rating condition
        if (ratingFilter !== 'ALL') {
          if (review.rating !== Number(ratingFilter)) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [reviews, searchTerm, ratingFilter]);

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            fill={star <= rating ? 'currentColor' : 'none'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        ))}
        <span className="ml-1 text-xs font-semibold text-slate-300">
          {rating}.0
        </span>
      </div>
    );
  }

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
      <AdminNav currentTab="reviews" />
      <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-white transition">
              Admin Dashboard
            </Link>
            <span>/</span>
            <span className="text-indigo-400">Customer Reviews</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Reviews
            </h1>
            <span className="rounded-full bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Manage customer reviews displayed across your store.
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
            + Add Review
          </button>
        </div>
      </div>

      {/* Alert Banner */}
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

      {/* Search and Filter Controls */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        {/* Search */}
        <div className="sm:col-span-3">
          <label htmlFor="search-reviews" className="sr-only">
            Search reviews
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search-reviews"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name or review text..."
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

        {/* Rating Filter */}
        <div>
          <label htmlFor="rating-filter" className="sr-only">
            Filter by rating
          </label>
          <select
            id="rating-filter"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as typeof ratingFilter)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 mb-4">
        <p className="text-xs font-semibold text-slate-400">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </p>
        {(searchTerm || ratingFilter !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setRatingFilter('ALL');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Review List: Desktop Table + Mobile Stacked Cards */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table View (Hidden on sm and below) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Rating</th>
                  <th scope="col" className="px-6 py-4">Review Text</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                      {review.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="line-clamp-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
                        {review.review_text}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(review.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(review)}
                          className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(review)}
                          className="rounded-lg border border-rose-900/40 bg-rose-950/30 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-900/60 hover:text-rose-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View (Shown on sm and below) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">
                    {review.customer_name}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {formatDate(review.created_at)}
                  </span>
                </div>

                <div>{renderStars(review.rating)}</div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {review.review_text}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(review)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(review)}
                    className="flex-1 rounded-xl border border-rose-900/50 bg-rose-950/40 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-900/60 hover:text-rose-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500 mb-4 border border-slate-700/60 shadow-inner">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            No customer reviews found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-sm">
            {searchTerm || ratingFilter !== 'ALL'
              ? 'No reviews match your current filter or search criteria.'
              : 'Start by creating your first verified customer review.'}
          </p>
          <div className="mt-5">
            {searchTerm || ratingFilter !== 'ALL' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setRatingFilter('ALL');
                }}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add First Review
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <ReviewFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={(msg) => {
          setAlert({ type: 'success', text: msg });
          refreshReviews();
        }}
        initialReview={editingReview}
        createAction={createReviewAction}
        updateAction={updateReviewAction}
      />

      {/* Delete Confirmation Modal */}
      <DeleteReviewConfirmModal
        isOpen={Boolean(deletingReview)}
        customerName={deletingReview?.customer_name || ''}
        reviewPreview={deletingReview?.review_text}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingReview(null)}
      />
    </div>
    </>
  );
}

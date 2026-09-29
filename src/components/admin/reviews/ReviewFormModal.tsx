'use client';

import { useState, useEffect } from 'react';
import type { Review, ReviewInput } from '@/types';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialReview?: Review | null;
  createAction: (input: ReviewInput) => Promise<{ success: boolean; error?: string }>;
  updateAction: (
    id: string,
    input: Partial<ReviewInput>
  ) => Promise<{ success: boolean; error?: string }>;
}

interface ReviewFormInnerProps {
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialReview?: Review | null;
  createAction: (input: ReviewInput) => Promise<{ success: boolean; error?: string }>;
  updateAction: (
    id: string,
    input: Partial<ReviewInput>
  ) => Promise<{ success: boolean; error?: string }>;
}

function ReviewFormInner({
  onClose,
  onSuccess,
  initialReview,
  createAction,
  updateAction,
}: ReviewFormInnerProps) {
  const isEditing = Boolean(initialReview);

  const [customerName, setCustomerName] = useState(initialReview?.customer_name || '');
  const [rating, setRating] = useState<number>(initialReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState(initialReview?.review_text || '');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitting, onClose]);

  const ratingLabels: Record<number, string> = {
    1: '1 Star - Poor',
    2: '2 Stars - Fair',
    3: '3 Stars - Good',
    4: '4 Stars - Very Good',
    5: '5 Stars - Excellent',
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = customerName.trim();
    const trimmedText = reviewText.trim();

    // Client-side validation
    if (!trimmedName) {
      setErrorMessage('Customer Name is required.');
      return;
    }
    if (trimmedName.length > 100) {
      setErrorMessage('Customer Name cannot exceed 100 characters.');
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      setErrorMessage('Please select a rating between 1 and 5 stars.');
      return;
    }
    if (!trimmedText) {
      setErrorMessage('Review text is required.');
      return;
    }
    if (trimmedText.length > 2000) {
      setErrorMessage('Review text cannot exceed 2000 characters.');
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing && initialReview) {
        const res = await updateAction(initialReview.id, {
          customer_name: trimmedName,
          rating,
          review_text: trimmedText,
        });

        if (!res.success) {
          setErrorMessage(res.error || 'Failed to update review.');
          return;
        }

        onSuccess(`Review from "${trimmedName}" updated successfully.`);
      } else {
        const res = await createAction({
          customer_name: trimmedName,
          rating,
          review_text: trimmedText,
        });

        if (!res.success) {
          setErrorMessage(res.error || 'Failed to create review.');
          return;
        }

        onSuccess(`Review from "${trimmedName}" added successfully.`);
      }

      onClose();
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-7 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
        <div>
          <h2 id="review-modal-title" className="text-xl font-bold text-white tracking-tight">
            {isEditing ? 'Edit Customer Review' : 'Add Customer Review'}
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {isEditing
              ? 'Update customer feedback and rating details.'
              : 'Add verified customer review and rating.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close dialog"
          className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 rounded-xl border border-rose-800/80 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Name */}
        <div>
          <label htmlFor="customer_name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Customer Name <span className="text-rose-400">*</span>
          </label>
          <input
            id="customer_name"
            type="text"
            required
            maxLength={100}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            disabled={submitting}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50"
          />
        </div>

        {/* Star Rating Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Rating (1–5 Stars) <span className="text-rose-400">*</span>
            </label>
            <span
              id="rating-label-live"
              aria-live="polite"
              className="text-xs font-bold text-amber-400"
            >
              Rating: {hoverRating || rating} out of 5 stars
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 focus:outline-none"
              role="radiogroup"
              aria-labelledby="rating-label-live"
              tabIndex={0}
              onKeyDown={(e) => {
                if (submitting) return;
                if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  setRating((prev) => Math.min(5, prev + 1));
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  setRating((prev) => Math.max(1, prev - 1));
                }
              }}
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const activeRating = hoverRating !== null ? hoverRating : rating;
                const isFilled = star <= activeRating;

                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={rating === star}
                    disabled={submitting}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    aria-label={`Rating: ${star} out of 5 stars`}
                    className="p-1 rounded-md transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                  >
                    <svg
                      className={`w-7 h-7 transition-colors ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      fill={isFilled ? 'currentColor' : 'none'}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-slate-400 font-medium">
              ({ratingLabels[hoverRating || rating]})
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="review_text" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Review Text <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-slate-500">
              {reviewText.length} / 2000
            </span>
          </div>
          <textarea
            id="review_text"
            required
            rows={4}
            maxLength={2000}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Detailed customer experience, feedback, or review..."
            disabled={submitting}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition resize-y disabled:opacity-50 leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Save Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialReview,
  createAction,
  updateAction,
}: ReviewFormModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <ReviewFormInner
        key={initialReview?.id || 'new-review'}
        onClose={onClose}
        onSuccess={onSuccess}
        initialReview={initialReview}
        createAction={createAction}
        updateAction={updateAction}
      />
    </div>
  );
}

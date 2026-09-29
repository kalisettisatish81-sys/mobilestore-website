'use client';

import { useEffect } from 'react';

interface DeleteReviewConfirmModalProps {
  isOpen: boolean;
  customerName: string;
  reviewPreview?: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteReviewConfirmModal({
  isOpen,
  customerName,
  reviewPreview,
  loading,
  onConfirm,
  onCancel,
}: DeleteReviewConfirmModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen && !loading) {
        onCancel();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-review-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3.5 text-rose-400 mb-4">
          <div className="rounded-xl bg-rose-950/80 p-3 border border-rose-800/60 shrink-0">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div>
            <h3 id="delete-review-title" className="text-lg font-bold text-white tracking-tight">
              Delete Customer Review
            </h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-3">
          Are you sure you want to permanently delete the review from{' '}
          <strong className="text-white font-semibold">&ldquo;{customerName}&rdquo;</strong>?
        </p>

        {reviewPreview && (
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-400 italic line-clamp-3">
            &ldquo;{reviewPreview}&rdquo;
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deleting...
              </>
            ) : (
              'Delete Review'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

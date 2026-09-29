'use client';

import { useEffect } from 'react';
import type { ContactMessage } from '@/types';

interface DeleteMessageConfirmModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteMessageConfirmModal({
  message,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteMessageConfirmModalProps) {
  // Keyboard Escape listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isDeleting && isOpen) {
        onCancel();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !message) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-message-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Warning Icon & Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 id="delete-message-title" className="text-lg font-bold text-white tracking-tight">
              Delete this message?
            </h2>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              This action permanently removes this customer message from the database.
            </p>
          </div>
        </div>

        {/* Message Snippet Card */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs space-y-1">
          <p className="text-slate-300 font-semibold truncate">
            From: <span className="text-white">{message.name}</span>{' '}
            <span className="text-slate-500 font-normal">({message.email})</span>
          </p>
          <p className="text-slate-400 truncate">
            Subject: <span className="text-slate-200">{message.subject}</span>
          </p>
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Deleting...
              </>
            ) : (
              'Delete Message'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import type { ContactMessage } from '@/types';
import { formatDateTime } from '@/utils';

interface MessageDetailsModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteRequest: (message: ContactMessage) => void;
}

export default function MessageDetailsModal({
  message,
  isOpen,
  onClose,
  onDeleteRequest,
}: MessageDetailsModalProps) {
  // Keyboard Escape listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !message) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-modal-title"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 id="message-modal-title" className="text-base font-bold text-white tracking-tight">
                Customer Message Details
              </h2>
              <span className="text-[11px] text-slate-400">
                Received on {formatDateTime(message.created_at)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close message details"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Customer Information Section */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Full Name</span>
                <span className="font-semibold text-white text-sm">{message.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Email Address</span>
                <a
                  href={`mailto:${message.email}`}
                  className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition break-all"
                  title="Click to compose email"
                >
                  {message.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Phone Number</span>
                {message.phone ? (
                  <a
                    href={`tel:${message.phone.replace(/\s+/g, '')}`}
                    className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition font-mono"
                    title="Click to call"
                  >
                    {message.phone}
                  </a>
                ) : (
                  <span className="text-slate-500 italic">Not provided</span>
                )}
              </div>
            </div>
          </div>

          {/* Subject & Full Message Section */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Subject
              </span>
              <p className="text-base font-bold text-white bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                {message.subject}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Message Content
              </span>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
                {message.message}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/60">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDeleteRequest(message);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-800/80 bg-rose-950/30 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 hover:text-white transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Message
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import type { ContactMessage } from '@/types';
import { formatDateTime } from '@/utils';
import AdminNav from '@/components/admin/AdminNav';
import MessageDetailsModal from './MessageDetailsModal';
import DeleteMessageConfirmModal from './DeleteMessageConfirmModal';
import {
  deleteContactMessageAction,
  getContactMessagesAction,
} from '@/app/admin/messages/actions';

interface MessagesManagerProps {
  initialMessages: ContactMessage[];
  adminEmail?: string;
}

export default function MessagesManager({
  initialMessages,
  adminEmail,
}: MessagesManagerProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Re-fetch helper
  async function refreshMessages() {
    const res = await getContactMessagesAction();
    if (res.success && res.data) {
      setMessages(res.data);
    }
  }

  // Filter messages based on search term
  const filteredMessages = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return messages;

    return messages.filter((msg) => {
      const name = msg.name.toLowerCase();
      const email = msg.email.toLowerCase();
      const phone = (msg.phone || '').toLowerCase();
      const subject = msg.subject.toLowerCase();
      const body = msg.message.toLowerCase();

      return (
        name.includes(term) ||
        email.includes(term) ||
        phone.includes(term) ||
        subject.includes(term) ||
        body.includes(term)
      );
    });
  }, [messages, searchTerm]);

  // Handle delete execution
  async function handleConfirmDelete() {
    if (!deletingMessage) return;

    setIsDeleting(true);
    setAlert(null);

    try {
      const result = await deleteContactMessageAction(deletingMessage.id);

      if (!result.success) {
        setAlert({
          type: 'error',
          text: result.error || 'Unable to delete message right now. Please try again.',
        });
        return;
      }

      setAlert({
        type: 'success',
        text: 'Message deleted successfully.',
      });

      // Update state locally
      setMessages((prev) => prev.filter((m) => m.id !== deletingMessage.id));
      setDeletingMessage(null);
    } catch {
      setAlert({
        type: 'error',
        text: 'Unable to delete message right now. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  // Helper for message preview truncation
  function getMessagePreview(text: string, maxLength = 65): string {
    if (!text) return '';
    const singleLine = text.replace(/\s+/g, ' ').trim();
    if (singleLine.length <= maxLength) return singleLine;
    return `${singleLine.slice(0, maxLength)}...`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Unified Admin Navigation */}
      <AdminNav currentTab="messages" />

      <div className="w-full max-w-7xl mx-auto px-4 pb-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Contact Messages
              </h1>
              <span className="rounded-full bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Messages submitted by customers through the store contact form.
              {adminEmail && (
                <span className="ml-2 text-xs text-slate-500">
                  Logged in as {adminEmail}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshMessages}
              title="Refresh messages list"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Alert Notification Banner */}
        {alert && (
          <div
            role="status"
            aria-live="polite"
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

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-9 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search query"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Empty State: Initial Messages is Empty */}
        {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-white">No Contact Messages</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Customer messages submitted through the contact form will appear here.
            </p>
          </div>
        )}

        {/* Empty Search State */}
        {messages.length > 0 && filteredMessages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-300">
              No messages match &ldquo;{searchTerm}&rdquo;
            </p>
            <p className="text-xs text-slate-500">
              Try searching with another keyword or clear the search query.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="inline-flex rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Desktop Data Grid Table */}
        {filteredMessages.length > 0 && (
          <div className="hidden md:block rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Customer</th>
                    <th scope="col" className="px-5 py-3.5">Email</th>
                    <th scope="col" className="px-5 py-3.5">Phone</th>
                    <th scope="col" className="px-5 py-3.5">Subject</th>
                    <th scope="col" className="px-5 py-3.5">Message Preview</th>
                    <th scope="col" className="px-5 py-3.5 whitespace-nowrap">Date</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                        {msg.name}
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-slate-300 whitespace-nowrap">
                        <a
                          href={`mailto:${msg.email}`}
                          className="hover:text-indigo-400 hover:underline transition"
                          title="Click to compose email"
                        >
                          {msg.email}
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {msg.phone || <span className="text-slate-600">—</span>}
                      </td>

                      {/* Subject */}
                      <td className="px-5 py-4 font-medium text-slate-200 max-w-xs truncate">
                        {msg.subject}
                      </td>

                      {/* Message Preview */}
                      <td className="px-5 py-4 text-slate-400 max-w-sm">
                        <span className="line-clamp-1 italic text-slate-400">
                          &ldquo;{getMessagePreview(msg.message, 60)}&rdquo;
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap text-[11px]">
                        {formatDateTime(msg.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingMessage(msg)}
                            className="rounded-lg bg-indigo-600/15 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300 transition cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingMessage(msg)}
                            className="rounded-lg bg-rose-600/15 border border-rose-500/30 px-2.5 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-600/30 hover:text-rose-300 transition cursor-pointer"
                            title="Delete message"
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
          </div>
        )}

        {/* Mobile Stacked Message Cards (< md) */}
        {filteredMessages.length > 0 && (
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg space-y-3"
              >
                {/* Header Row: Name & Date */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{msg.name}</h3>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-indigo-400 hover:underline break-all"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">
                    {formatDateTime(msg.created_at)}
                  </span>
                </div>

                {/* Subject & Preview */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 space-y-1">
                  <span className="text-xs font-semibold text-slate-200 block truncate">
                    {msg.subject}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-2">
                    &ldquo;{getMessagePreview(msg.message, 120)}&rdquo;
                  </p>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setViewingMessage(msg)}
                    className="flex-1 rounded-xl bg-indigo-600/20 border border-indigo-500/30 py-2.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-600/30 transition text-center"
                  >
                    View Full Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingMessage(msg)}
                    className="rounded-xl bg-rose-600/20 border border-rose-500/30 px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-600/30 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      <MessageDetailsModal
        message={viewingMessage}
        isOpen={Boolean(viewingMessage)}
        onClose={() => setViewingMessage(null)}
        onDeleteRequest={(msg) => setDeletingMessage(msg)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteMessageConfirmModal
        message={deletingMessage}
        isOpen={Boolean(deletingMessage)}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingMessage(null)}
      />
    </div>
  );
}

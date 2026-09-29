'use client';

import { useState } from 'react';
import { submitContactMessageAction } from '@/app/contact/actions';
import type { ContactMessageInput } from '@/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,25}$/;

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactMessageInput>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactMessageInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear inline error on change
    if (fieldErrors[name as keyof ContactMessageInput]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  }

  function validateClient(): boolean {
    const errors: Partial<Record<keyof ContactMessageInput, string>> = {};

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errors.name = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (trimmedName.length > 100) {
      errors.name = 'Name cannot exceed 100 characters.';
    }

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = 'Please provide a valid email address.';
    }

    const trimmedPhone = (formData.phone || '').trim();
    if (trimmedPhone && !PHONE_REGEX.test(trimmedPhone)) {
      errors.phone = 'Please provide a valid phone number (e.g. +91 98765 43210).';
    }

    const trimmedSubject = formData.subject.trim();
    if (!trimmedSubject) {
      errors.subject = 'Subject is required.';
    } else if (trimmedSubject.length < 3) {
      errors.subject = 'Subject must be at least 3 characters.';
    } else if (trimmedSubject.length > 150) {
      errors.subject = 'Subject cannot exceed 150 characters.';
    }

    const trimmedMessage = formData.message.trim();
    if (!trimmedMessage) {
      errors.message = 'Message is required.';
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters.';
    } else if (trimmedMessage.length > 2000) {
      errors.message = 'Message cannot exceed 2000 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    if (!validateClient()) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitContactMessageAction({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (!result.success) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setServerError(result.error || 'Unable to send your message right now. Please try again.');
        return;
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setFieldErrors({});
    } catch {
      setServerError('Unable to send your message right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setIsSuccess(false);
    setServerError(null);
    setFieldErrors({});
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Send Us a Message</h2>
        <p className="text-xs text-slate-400 mt-1">
          Fill out the form below and our customer support team will get back to you promptly.
        </p>
      </div>

      {/* Success State Notification */}
      {isSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-emerald-800/80 bg-emerald-950/40 p-6 text-center space-y-4 animate-in fade-in duration-200"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-md shadow-emerald-500/10">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-300">Your message has been sent successfully.</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
              Thank you for reaching out to Premium Mobile Store! Our team has received your message and will review it shortly.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            <span>&larr;</span> Send Another Message
          </button>
        </div>
      )}

      {/* Active Contact Form */}
      {!isSuccess && (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* General Server Error Banner */}
          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-rose-800/80 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex items-center gap-2.5"
            >
              <svg className="h-4 w-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                required
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                disabled={submitting}
                placeholder="e.g. John Doe"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.name)}
                className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition disabled:opacity-50 ${
                  fieldErrors.name
                    ? 'border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-[11px] text-rose-400 font-medium">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                required
                maxLength={254}
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
                placeholder="you@example.com"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.email)}
                className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition disabled:opacity-50 ${
                  fieldErrors.email
                    ? 'border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-[11px] text-rose-400 font-medium">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          {/* Row 2: Phone & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Phone Number
                </label>
                <span className="text-[10px] text-slate-500">(Optional)</span>
              </div>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                maxLength={25}
                value={formData.phone || ''}
                onChange={handleChange}
                disabled={submitting}
                placeholder="+91 98765 43210"
                aria-invalid={Boolean(fieldErrors.phone)}
                className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition disabled:opacity-50 ${
                  fieldErrors.phone
                    ? 'border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-[11px] text-rose-400 font-medium">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Subject <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                required
                maxLength={150}
                value={formData.subject}
                onChange={handleChange}
                disabled={submitting}
                placeholder="e.g. Inquiry regarding iPhone 16 Pro"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.subject)}
                className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition disabled:opacity-50 ${
                  fieldErrors.subject
                    ? 'border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {fieldErrors.subject && (
                <p className="mt-1 text-[11px] text-rose-400 font-medium">{fieldErrors.subject}</p>
              )}
            </div>
          </div>

          {/* Row 3: Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Message <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[10px] ${formData.message.length > 1900 ? 'text-amber-400 font-medium' : 'text-slate-500'}`}>
                {formData.message.length} / 2000
              </span>
            </div>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              maxLength={2000}
              value={formData.message}
              onChange={handleChange}
              disabled={submitting}
              placeholder="How can we assist you with our flagship mobile inventory or order queries? Please provide as much detail as needed..."
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.message)}
              className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition resize-y disabled:opacity-50 ${
                fieldErrors.message
                  ? 'border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {fieldErrors.message && (
              <p className="mt-1 text-[11px] text-rose-400 font-medium">{fieldErrors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 transition cursor-pointer"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

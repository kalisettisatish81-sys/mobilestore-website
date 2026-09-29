'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { Mobile, MobileInput, StockStatus } from '@/types';
import { getProductThumbnailUrl } from '@/utils/cloudinary';

interface MobileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialMobile?: Mobile | null;
  createAction: (input: MobileInput) => Promise<{ success: boolean; error?: string }>;
  updateAction: (
    id: string,
    input: Partial<MobileInput>
  ) => Promise<{ success: boolean; error?: string }>;
}

const STOCK_STATUS_OPTIONS: StockStatus[] = [
  'In Stock',
  'Limited Stock',
  'Out of Stock',
];

const COMMON_BRANDS = [
  'Apple',
  'Samsung',
  'Google',
  'OnePlus',
  'Xiaomi',
  'Sony',
  'Motorola',
  'Nothing',
  'Realme',
  'Vivo',
  'Oppo',
  'Asus',
];

const COMMON_RAM_OPTIONS = ['4GB', '6GB', '8GB', '12GB', '16GB', '24GB'];
const COMMON_STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface FormInnerProps {
  initialMobile?: Mobile | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  createAction: (input: MobileInput) => Promise<{ success: boolean; error?: string }>;
  updateAction: (
    id: string,
    input: Partial<MobileInput>
  ) => Promise<{ success: boolean; error?: string }>;
}

function MobileFormInner({
  initialMobile,
  onClose,
  onSuccess,
  createAction,
  updateAction,
}: FormInnerProps) {
  const isEditing = Boolean(initialMobile);

  const [name, setName] = useState(initialMobile?.name || '');
  const [brand, setBrand] = useState(initialMobile?.brand || '');
  const [price, setPrice] = useState(initialMobile ? String(initialMobile.price) : '');
  const [ram, setRam] = useState(initialMobile?.ram || '8GB');
  const [storage, setStorage] = useState(initialMobile?.storage || '256GB');
  const [stockStatus, setStockStatus] = useState<StockStatus>(
    initialMobile?.stock_status || 'In Stock'
  );
  const [isVisible, setIsVisible] = useState<boolean>(
    initialMobile ? !initialMobile.is_hidden : true
  );
  const [description, setDescription] = useState(initialMobile?.description || '');
  const [images, setImages] = useState<string[]>(initialMobile?.images || []);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting && !uploading) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitting, uploading, onClose]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);

    const availableSlots = MAX_IMAGES - images.length;
    if (availableSlots <= 0) {
      setUploadError(`Maximum of ${MAX_IMAGES} images reached.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);

    // Validate selected files
    for (const file of filesToUpload) {
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        setUploadError(
          `"${file.name}" is an unsupported format. Only JPEG, JPG, PNG, and WEBP are allowed.`
        );
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`"${file.name}" exceeds the 10 MB maximum size limit.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    setUploading(true);

    try {
      const newlyUploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/cloudinary/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Failed to upload "${file.name}"`);
        }

        if (data.url && !images.includes(data.url) && !newlyUploadedUrls.includes(data.url)) {
          newlyUploadedUrls.push(data.url);
        }
      }

      setImages((prev) => [...prev, ...newlyUploadedUrls]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Image upload failed. Please try again.';
      setUploadError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleRemoveImage(indexToRemove: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function handleMoveImage(index: number, direction: 'left' | 'right') {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setImages((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('Please enter a product name.');
      return;
    }
    if (trimmedName.length > 100) {
      setFormError('Product name cannot exceed 100 characters.');
      return;
    }

    const trimmedBrand = brand.trim();
    if (!trimmedBrand) {
      setFormError('Please enter or select a brand.');
      return;
    }
    if (trimmedBrand.length > 50) {
      setFormError('Brand cannot exceed 50 characters.');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0 || price === '') {
      setFormError('Please enter a valid price greater than or equal to 0.');
      return;
    }

    const trimmedRam = ram.trim();
    if (!trimmedRam) {
      setFormError('RAM specification is required.');
      return;
    }

    const trimmedStorage = storage.trim();
    if (!trimmedStorage) {
      setFormError('Storage specification is required.');
      return;
    }

    if (description.trim().length > 2000) {
      setFormError('Description cannot exceed 2000 characters.');
      return;
    }

    if (images.length === 0) {
      setFormError('Please upload at least 1 product image (maximum 5).');
      return;
    }

    if (images.length > MAX_IMAGES) {
      setFormError(`Product cannot exceed ${MAX_IMAGES} images.`);
      return;
    }

    setSubmitting(true);

    try {
      const payload: MobileInput = {
        name: trimmedName,
        brand: trimmedBrand,
        description: description.trim() || null,
        price: numPrice,
        ram: trimmedRam,
        storage: trimmedStorage,
        stock_status: stockStatus,
        is_hidden: !isVisible,
        images,
      };

      if (isEditing && initialMobile) {
        const result = await updateAction(initialMobile.id, payload);
        if (!result.success) {
          setFormError(result.error || 'Unable to save mobile right now. Please try again.');
          return;
        }
        onSuccess(`Product "${trimmedName}" updated successfully.`);
      } else {
        const result = await createAction(payload);
        if (!result.success) {
          setFormError(result.error || 'Unable to save mobile right now. Please try again.');
          return;
        }
        onSuccess(`Product "${trimmedName}" created successfully.`);
      }

      onClose();
    } catch {
      setFormError('Unable to save mobile right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {isEditing ? 'Edit Mobile' : 'Add Mobile'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEditing
              ? 'Update specifications, pricing, visibility, and product images.'
              : 'Add a new mobile to your inventory with specifications and images.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={submitting || uploading}
          aria-label="Close modal"
          className="text-slate-400 hover:text-white transition rounded-lg p-1.5 hover:bg-slate-800 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form Error Banner */}
      {formError && (
        <div className="mx-6 mt-4 rounded-xl border border-rose-800/80 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formError}</span>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Row 1: Name and Brand */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mobile-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Mobile Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="mobile-name"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Galaxy S24 Ultra"
              disabled={submitting}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition"
            />
          </div>

          <div>
            <label htmlFor="mobile-brand" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Brand <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                id="mobile-brand"
                type="text"
                required
                maxLength={50}
                list="brand-suggestions"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Samsung"
                disabled={submitting}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition"
              />
              <datalist id="brand-suggestions">
                {COMMON_BRANDS.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* Row 2: Price (₹), RAM, Storage, Stock Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="mobile-price" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Price (₹) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-semibold">
                ₹
              </span>
              <input
                id="mobile-price"
                type="number"
                step="1"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49999"
                disabled={submitting}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-8 pr-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mobile-ram" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              RAM <span className="text-rose-400">*</span>
            </label>
            <input
              id="mobile-ram"
              type="text"
              required
              list="ram-suggestions"
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              placeholder="e.g. 8GB"
              disabled={submitting}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition"
            />
            <datalist id="ram-suggestions">
              {COMMON_RAM_OPTIONS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="mobile-storage" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Storage <span className="text-rose-400">*</span>
            </label>
            <input
              id="mobile-storage"
              type="text"
              required
              list="storage-suggestions"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              placeholder="e.g. 256GB"
              disabled={submitting}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition"
            />
            <datalist id="storage-suggestions">
              {COMMON_STORAGE_OPTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="mobile-stock-status" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Stock Status <span className="text-rose-400">*</span>
            </label>
            <select
              id="mobile-stock-status"
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as StockStatus)}
              disabled={submitting}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition cursor-pointer"
            >
              {STOCK_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Visibility Toggle */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-center justify-between">
          <div>
            <label htmlFor="mobile-visibility" className="text-sm font-semibold text-white cursor-pointer">
              Visible to customers
            </label>
            <p className="text-xs text-slate-400 mt-0.5">
              When enabled, customers can discover and view this product on the public store catalog.
            </p>
          </div>
          <div className="flex items-center">
            <input
              id="mobile-visibility"
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              disabled={submitting}
              className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
            />
          </div>
        </div>

        {/* Row 4: Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="mobile-description" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Description <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <span className="text-[11px] text-slate-500">
              {description.length} / 2000
            </span>
          </div>
          <textarea
            id="mobile-description"
            rows={3}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key features, display resolution, camera sensors, battery specs..."
            disabled={submitting}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition resize-y"
          />
        </div>

        {/* Row 5: Cloudinary Product Image Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Product Images <span className="text-rose-400">* (1–5 Required)</span>
            </label>
            <span className="text-xs text-slate-400">
              {images.length} of {MAX_IMAGES} uploaded
            </span>
          </div>

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="rounded-xl border border-rose-800/80 bg-rose-950/40 p-2.5 text-xs text-rose-300 flex items-center justify-between">
              <span>{uploadError}</span>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>
          )}

          {/* Uploaded Thumbnails Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {images.map((url, idx) => (
                <div
                  key={url}
                  className="group relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden aspect-square flex flex-col items-center justify-center shadow-md"
                >
                  <Image
                    src={getProductThumbnailUrl(url)}
                    alt={`Product image ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  {/* Primary Image Badge */}
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 rounded-md bg-indigo-600/90 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider shadow">
                      Primary
                    </span>
                  )}

                  {/* Image Controls Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'left')}
                        title="Move image left (towards primary)"
                        className="rounded bg-slate-800 p-1 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                      >
                        &larr;
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'right')}
                        title="Move image right"
                        className="rounded bg-slate-800 p-1 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                      >
                        &rarr;
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      disabled={submitting}
                      title="Remove image"
                      className="rounded bg-rose-600 p-1 text-white hover:bg-rose-500 transition disabled:opacity-30"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* File Upload Trigger */}
          {images.length < MAX_IMAGES && (
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                id="mobile-image-upload"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                disabled={uploading || submitting}
                className="hidden"
              />
              <label
                htmlFor="mobile-image-upload"
                className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-slate-200 cursor-pointer transition hover:border-indigo-500 hover:bg-slate-900 hover:text-white ${
                  uploading || submitting ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Uploading to Cloudinary...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload Images (JPEG, PNG, WEBP, max 10MB)
                  </>
                )}
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {MAX_IMAGES - images.length} remaining
              </span>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting || uploading}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving Mobile...
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Add Mobile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function MobileFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialMobile,
  createAction,
  updateAction,
}: MobileFormModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <MobileFormInner
        key={initialMobile?.id || 'new-mobile'}
        initialMobile={initialMobile}
        onClose={onClose}
        onSuccess={onSuccess}
        createAction={createAction}
        updateAction={updateAction}
      />
    </div>
  );
}

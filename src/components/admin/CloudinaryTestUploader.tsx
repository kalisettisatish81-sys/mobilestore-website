'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CloudinaryUploadResult } from '@/types';
import { getProductThumbnailUrl } from '@/utils/cloudinary';

interface CloudinaryTestUploaderProps {
  isConfigured: boolean;
}

export default function CloudinaryTestUploader({
  isConfigured,
}: CloudinaryTestUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CloudinaryUploadResult | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed.');
        return;
      }

      setResult({
        url: data.url,
        publicId: data.publicId,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      });
    } catch {
      setError('Network error occurred while uploading.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-5 text-left text-xs">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-slate-200">
          Cloudinary Storage Diagnostic (Dev Only)
        </span>
        <span
          className={`rounded px-2 py-0.5 font-medium ${
            isConfigured
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : 'bg-amber-950 text-amber-400 border border-amber-800'
          }`}
        >
          {isConfigured ? 'Configured' : 'Credentials Missing'}
        </span>
      </div>

      <p className="text-slate-400 mb-4">
        Destination Folder: <code className="text-indigo-300">premium-mobile-store/mobiles</code>{' '}
        | Formats: JPEG, PNG, WEBP | Max: 10 MB
      </p>

      {error && (
        <div className="mb-3 rounded border border-rose-800/60 bg-rose-950/40 p-2.5 text-rose-300">
          {error}
        </div>
      )}

      {result && (
        <div className="mb-4 rounded border border-emerald-800/60 bg-emerald-950/30 p-3 text-emerald-300">
          <p className="font-semibold mb-2">✓ Upload Succeeded</p>
          <div className="flex items-center gap-3">
            <Image
              src={getProductThumbnailUrl(result.url)}
              alt="Uploaded preview"
              width={64}
              height={64}
              unoptimized
              className="rounded border border-emerald-700 object-cover"
            />
            <div className="overflow-hidden text-[11px] text-slate-300 space-y-0.5">
              <p className="truncate">
                <span className="text-slate-400">Public ID:</span> {result.publicId}
              </p>
              <p>
                <span className="text-slate-400">Resolution:</span> {result.width}x
                {result.height} ({result.format.toUpperCase()})
              </p>
              <p>
                <span className="text-slate-400">Size:</span> {(result.bytes / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleUpload} className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={loading || !isConfigured}
          className="rounded border border-slate-700 bg-slate-800/60 px-2 py-1.5 text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-slate-700 file:px-2 file:py-1 file:text-xs file:text-white hover:file:bg-slate-600 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !file || !isConfigured}
          className="self-start rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading to Cloudinary...' : 'Test Upload'}
        </button>
      </form>
    </div>
  );
}

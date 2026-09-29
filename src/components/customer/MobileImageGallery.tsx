'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getProductDetailImageUrl, getProductThumbnailUrl } from '@/utils/cloudinary';

interface MobileImageGalleryProps {
  images?: string[];
  title: string;
}

export default function MobileImageGallery({ images = [], title }: MobileImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Clean image list filtering out empty or invalid items
  const validImages = Array.isArray(images)
    ? images.filter((img) => typeof img === 'string' && img.trim().length > 0)
    : [];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const markImageFailed = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const currentImage = validImages[selectedIndex];
  const isCurrentFailed = failedImages[selectedIndex];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Stage */}
      <div className="relative aspect-square w-full rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-8 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-sm">
        {currentImage && !isCurrentFailed ? (
          <Image
            src={getProductDetailImageUrl(currentImage)}
            alt={`${title} - View ${selectedIndex + 1}`}
            fill
            priority
            unoptimized
            onError={() => markImageFailed(selectedIndex)}
            className="object-contain p-4 sm:p-6 transition-all duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-600">
            <svg
              className="h-16 w-16 text-slate-700 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-slate-500">
              Image preview unavailable
            </span>
          </div>
        )}

        {/* Previous Button (if multiple images) */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 border border-slate-700/80 text-white shadow-lg backdrop-blur-md hover:bg-slate-800 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Button (if multiple images) */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 border border-slate-700/80 text-white shadow-lg backdrop-blur-md hover:bg-slate-800 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Image Index Counter Badge */}
        {validImages.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-800 backdrop-blur-md">
            {selectedIndex + 1} / {validImages.length}
          </span>
        )}
      </div>

      {/* Thumbnails Navigation Row (if multiple images) */}
      {validImages.length > 1 && (
        <div
          className="flex items-center gap-3 overflow-x-auto py-1 px-0.5 scrollbar-none"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {validImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            const hasFailed = failedImages[idx];

            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`View photo ${idx + 1} of ${validImages.length}`}
                onClick={() => setSelectedIndex(idx)}
                className={`relative h-18 w-18 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-slate-950/90 p-1 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800/80 hover:border-slate-700 opacity-60 hover:opacity-100'
                }`}
              >
                {!hasFailed ? (
                  <Image
                    src={getProductThumbnailUrl(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    unoptimized
                    onError={() => markImageFailed(idx)}
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

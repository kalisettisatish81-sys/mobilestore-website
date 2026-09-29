import type { CloudinaryTransformationOptions } from '@/types';

/**
 * Injects transformation parameters into a Cloudinary delivery URL.
 * Preserves the original image asset while generating an on-the-fly optimized derivative.
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options: CloudinaryTransformationOptions = {}
): string {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const parts: string[] = [];

  // Format and Quality optimizations
  const format = options.format || 'auto';
  const quality = options.quality || 'auto';
  parts.push(`f_${format}`, `q_${quality}`);

  // Dimensions & Cropping
  if (options.crop) {
    parts.push(`c_${options.crop}`);
  }
  if (options.width) {
    parts.push(`w_${options.width}`);
  }
  if (options.height) {
    parts.push(`h_${options.height}`);
  }

  const transformationString = parts.join(',');

  // Replace /upload/ with /upload/<transformations>/
  return url.replace('/upload/', `/upload/${transformationString}/`);
}

/**
 * Generates an optimized square thumbnail for admin tables and previews (200x200).
 */
export function getProductThumbnailUrl(url: string): string {
  return getOptimizedCloudinaryUrl(url, {
    width: 200,
    height: 200,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Generates an optimized medium image for product catalog cards (600x600).
 */
export function getProductCardImageUrl(url: string): string {
  return getOptimizedCloudinaryUrl(url, {
    width: 600,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Generates an optimized high-resolution image for product detail views (max width 1200).
 */
export function getProductDetailImageUrl(url: string): string {
  return getOptimizedCloudinaryUrl(url, {
    width: 1200,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  });
}

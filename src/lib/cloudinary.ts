import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import type { CloudinaryUploadResult } from '@/types';

export const CLOUDINARY_MOBILES_FOLDER = 'premium-mobile-store/mobiles';

/**
 * Checks whether required Cloudinary credentials are set in environment variables.
 * Safe to call on server. Never returns secret keys.
 */
export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  return Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    !cloudName.includes('placeholder')
  );
}

/**
 * Configures and returns the Cloudinary SDK instance.
 * Server-only execution.
 */
function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });
  return cloudinary;
}

/**
 * Uploads an image buffer to Cloudinary in the designated folder.
 * Returns public ID and secure URL.
 */
export async function uploadImageToCloudinary(
  buffer: Buffer,
  options?: {
    folder?: string;
    publicId?: string;
  }
): Promise<CloudinaryUploadResult> {
  const cld = configureCloudinary();
  const folder = options?.folder || CLOUDINARY_MOBILES_FOLDER;

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cld.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        public_id: options?.publicId,
        overwrite: true,
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error || !result) {
          return reject(
            new Error(error?.message || 'Cloudinary upload stream failed')
          );
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Server-side utility to delete an existing image from Cloudinary by public ID.
 * Admin-only operation.
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<{ success: boolean; result?: string; error?: string }> {
  try {
    const cld = configureCloudinary();
    const result = await cld.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to delete image from Cloudinary';
    return {
      success: false,
      error: message,
    };
  }
}

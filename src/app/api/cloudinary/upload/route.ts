import { NextResponse, type NextRequest } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { verifyAdminStatus } from '@/lib/auth-server';
import {
  isCloudinaryConfigured,
  uploadImageToCloudinary,
  CLOUDINARY_MOBILES_FOLDER,
} from '@/lib/cloudinary';

// 10 MB limit for mobile product images
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export async function POST(request: NextRequest) {
  try {
    console.log('Cloudinary upload started');

    // 1. Authenticate user via Supabase session
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to upload images.' },
        { status: 401 }
      );
    }

    // 2. Authorize admin status
    const isAdmin = await verifyAdminStatus(user.id);
    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            'Forbidden: Administrator authorization required to upload product images.',
        },
        { status: 403 }
      );
    }

    console.log('Authenticated admin verified');

    // 3. Verify Cloudinary environment configuration
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            'Cloudinary is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local.',
        },
        { status: 503 }
      );
    }

    // 4. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          error: 'Bad Request: "file" form field containing an image is required.',
        },
        { status: 400 }
      );
    }

    // 5. Validate file size
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Bad Request: The uploaded file is empty.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error:
            'Payload Too Large: File size exceeds the maximum allowed limit of 10 MB.',
        },
        { status: 400 }
      );
    }

    // 6. Validate file format
    const mimeType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    const isAllowedMime = ALLOWED_MIME_TYPES.includes(mimeType);
    const isAllowedExt = ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!isAllowedMime && !isAllowedExt) {
      return NextResponse.json(
        {
          error:
            'Unsupported Media Type: Only JPEG, JPG, PNG, and WEBP formats are allowed.',
        },
        { status: 400 }
      );
    }

    console.log(`Uploading file: ${mimeType}, ${file.size} bytes`);

    // 7. Upload to Cloudinary using server-side SDK signing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImageToCloudinary(buffer, {
      folder: CLOUDINARY_MOBILES_FOLDER,
    });

    console.log('Cloudinary upload successful');

    // 8. Return response without exposing secrets
    return NextResponse.json(
      {
        success: true,
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
      { status: 201 }
    );
  } catch (error) {
    // Sanitize error logging - never expose secrets or full internal stack traces to client
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';

    console.error('Cloudinary upload failed:', errorMessage);

    return NextResponse.json(
      {
        error: 'Image upload failed. Please verify Cloudinary credentials and try again.',
      },
      { status: 500 }
    );
  }
}

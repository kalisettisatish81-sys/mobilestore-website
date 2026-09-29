'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { verifyAdminStatus } from '@/lib/auth-server';
import type { Review, ReviewInput, Database } from '@/types';
import { mergeReviews } from '@/lib/reviews';
import { DEFAULT_REVIEWS } from '@/data/defaultReviews';

type ActionResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

/**
 * Validates admin authentication and authorization.
 */
async function checkAdminAuth(): Promise<{
  authorized: boolean;
  userId?: string;
  error?: string;
}> {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false, error: 'Unauthorized: Please log in as an administrator.' };
  }

  const isAdmin = await verifyAdminStatus(user.id);
  if (!isAdmin) {
    return {
      authorized: false,
      error: 'Forbidden: You do not have permission to manage customer reviews.',
    };
  }

  return { authorized: true, userId: user.id };
}

/**
 * Validates review input fields according to schema constraints.
 */
function validateReviewInput(input: Partial<ReviewInput>, isPartial = false): string | null {
  // Customer Name validation
  if (!isPartial || input.customer_name !== undefined) {
    const name = input.customer_name?.trim();
    if (!name) return 'Customer Name is required.';
    if (name.length > 100) return 'Customer Name cannot exceed 100 characters.';
  }

  // Rating validation
  if (!isPartial || input.rating !== undefined) {
    if (input.rating === undefined || input.rating === null) {
      return 'Rating is required.';
    }
    const rating = Number(input.rating);
    if (isNaN(rating) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return 'Rating must be a whole number between 1 and 5 stars.';
    }
  }

  // Review Text validation
  if (!isPartial || input.review_text !== undefined) {
    const text = input.review_text?.trim();
    if (!text) return 'Review text is required.';
    if (text.length > 2000) return 'Review text cannot exceed 2000 characters.';
  }

  return null;
}

/**
 * Fetches all customer reviews for admin management, ordered newest first.
 */
export async function getReviewsAction(): Promise<ActionResult<Review[]>> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: true, data: DEFAULT_REVIEWS };
    }

    const reviews = mergeReviews((data as Review[]) || []);
    return { success: true, data: reviews };
  } catch {
    return { success: true, data: DEFAULT_REVIEWS };
  }
}


/**
 * Creates a new customer review in Supabase.
 */
export async function createReviewAction(input: ReviewInput): Promise<ActionResult<Review>> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  const validationError = validateReviewInput(input, false);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        customer_name: input.customer_name.trim(),
        rating: Math.round(Number(input.rating)),
        review_text: input.review_text.trim(),
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: 'Unable to create review. Please try again.' };
    }

    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true, data: data as Review };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to create review.';
    return { success: false, error: message };
  }
}

/**
 * Updates an existing customer review.
 */
export async function updateReviewAction(
  id: string,
  input: Partial<ReviewInput>
): Promise<ActionResult<Review>> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  if (!id) {
    return { success: false, error: 'Review ID is required.' };
  }

  const validationError = validateReviewInput(input, true);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = await createServerClient();

    const updatePayload: Database['public']['Tables']['reviews']['Update'] = {};
    if (input.customer_name !== undefined) {
      updatePayload.customer_name = input.customer_name.trim();
    }
    if (input.rating !== undefined) {
      updatePayload.rating = Math.round(Number(input.rating));
    }
    if (input.review_text !== undefined) {
      updatePayload.review_text = input.review_text.trim();
    }

    const { data, error } = await supabase
      .from('reviews')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      return { success: false, error: 'Unable to update review. Please try again.' };
    }

    if (!data) {
      // If review originated from DEFAULT_REVIEWS and is not yet in DB, insert it with the updated fields
      const defaultItem = DEFAULT_REVIEWS.find((r) => r.id === id);
      if (defaultItem) {
        const { data: inserted, error: insertError } = await supabase
          .from('reviews')
          .insert({
            id: defaultItem.id,
            customer_name:
              input.customer_name !== undefined ? input.customer_name.trim() : defaultItem.customer_name,
            rating:
              input.rating !== undefined ? Math.round(Number(input.rating)) : defaultItem.rating,
            review_text:
              input.review_text !== undefined ? input.review_text.trim() : defaultItem.review_text,
            created_at: defaultItem.created_at,
          })
          .select()
          .single();

        if (insertError || !inserted) {
          return { success: false, error: 'Unable to update review in database.' };
        }
        revalidatePath('/admin/reviews');
        revalidatePath('/');
        return { success: true, data: inserted as Review };
      }
      return { success: false, error: 'Review not found.' };
    }

    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true, data: data as Review };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to update review.';
    return { success: false, error: message };
  }
}


/**
 * Deletes a customer review from Supabase.
 */
export async function deleteReviewAction(id: string): Promise<ActionResult<{ id: string }>> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  if (!id) {
    return { success: false, error: 'Review ID is required.' };
  }

  try {
    const supabase = await createServerClient();
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: 'Unable to delete review. Please try again.' };
    }

    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true, data: { id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to delete review.';
    return { success: false, error: message };
  }
}

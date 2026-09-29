import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabase as publicSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Review } from '@/types';
import { DEFAULT_REVIEWS } from '@/data/defaultReviews';

export interface PublicReviewsResult {
  success: boolean;
  reviews: Review[];
  error?: string;
}

/**
 * Merges Supabase customer reviews with default curated reviews.
 * Database items overlay defaults if they share an ID or customer name.
 */
export function mergeReviews(dbReviews: Review[]): Review[] {
  const map = new Map<string, Review>();

  // 1. Add default curated reviews
  for (const r of DEFAULT_REVIEWS) {
    map.set(r.id, r);
  }

  // 2. Overlay database reviews (overriding defaults if matching ID or customer name)
  for (const dbReview of dbReviews) {
    const existingKey = Array.from(map.entries()).find(
      ([, item]) => item.customer_name.toLowerCase() === dbReview.customer_name.toLowerCase()
    )?.[0];

    if (existingKey) {
      map.delete(existingKey);
    }
    map.set(dbReview.id, dbReview);
  }

  // Return list sorted newest first
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Fetches customer reviews visible to public users, ordered newest first.
 * Gracefully merges with default curated reviews when database is empty or unavailable.
 */
export async function getPublicReviews(): Promise<PublicReviewsResult> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, reviews: DEFAULT_REVIEWS };
    }

    let supabase;
    try {
      supabase = await createServerClient();
    } catch {
      supabase = publicSupabase;
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Public reviews fetch error; using default reviews:', error.message);
      return {
        success: true,
        reviews: DEFAULT_REVIEWS,
      };
    }

    return {
      success: true,
      reviews: mergeReviews((data as Review[]) || []),
    };
  } catch (err) {
    console.warn('Public reviews unexpected error; falling back to default reviews:', err);
    return {
      success: true,
      reviews: DEFAULT_REVIEWS,
    };
  }
}

/**
 * Retrieves all reviews for admin management.
 */
export async function getAllReviews(): Promise<Review[]> {
  try {
    if (!isSupabaseConfigured()) {
      return DEFAULT_REVIEWS;
    }

    let supabase;
    try {
      supabase = await createServerClient();
    } catch {
      supabase = publicSupabase;
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return DEFAULT_REVIEWS;
    }

    return mergeReviews(data as Review[]);
  } catch (err) {
    console.error('Error fetching all reviews:', err);
    return DEFAULT_REVIEWS;
  }
}


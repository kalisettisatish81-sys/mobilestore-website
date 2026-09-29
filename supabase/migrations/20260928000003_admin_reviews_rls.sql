-- ====================================================================
-- PREMIUM MOBILE STORE - ADMIN REVIEWS RLS POLICIES
-- Migration: 20260928000003_admin_reviews_rls.sql
-- Description: Establishes Row Level Security policies for reviews table.
--              Public can read reviews.
--              Only authenticated administrators can create, update, or delete reviews.
-- ====================================================================

-- 1. Ensure Row Level Security is enabled
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 2. SELECT: Public and anonymous users can view reviews
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
CREATE POLICY "Public can view reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

-- 3. SELECT: Authenticated administrators can view all reviews
DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
CREATE POLICY "Admins can view all reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- 4. INSERT: Only authenticated administrators can create reviews
DROP POLICY IF EXISTS "Admins can insert reviews" ON reviews;
CREATE POLICY "Admins can insert reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- 5. UPDATE: Only authenticated administrators can update reviews
DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;
CREATE POLICY "Admins can update reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 6. DELETE: Only authenticated administrators can delete reviews
DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;
CREATE POLICY "Admins can delete reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (is_admin());

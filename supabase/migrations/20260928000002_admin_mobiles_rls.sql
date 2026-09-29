-- ====================================================================
-- PREMIUM MOBILE STORE - ADMIN MOBILES RLS POLICIES
-- Migration: 20260928000002_admin_mobiles_rls.sql
-- Description: Establishes full CRUD Row Level Security policies for
--              authenticated administrators on the mobiles table.
-- ====================================================================

-- 1. SELECT: Admins can view all mobiles (including hidden ones)
DROP POLICY IF EXISTS "Admins can view all mobiles" ON mobiles;
CREATE POLICY "Admins can view all mobiles"
  ON mobiles
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- 2. INSERT: Admins can create new mobile products
DROP POLICY IF EXISTS "Admins can insert mobiles" ON mobiles;
CREATE POLICY "Admins can insert mobiles"
  ON mobiles
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- 3. UPDATE: Admins can update mobile products (details, stock, visibility, images)
DROP POLICY IF EXISTS "Admins can update mobiles" ON mobiles;
CREATE POLICY "Admins can update mobiles"
  ON mobiles
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 4. DELETE: Admins can delete mobile products
DROP POLICY IF EXISTS "Admins can delete mobiles" ON mobiles;
CREATE POLICY "Admins can delete mobiles"
  ON mobiles
  FOR DELETE
  TO authenticated
  USING (is_admin());

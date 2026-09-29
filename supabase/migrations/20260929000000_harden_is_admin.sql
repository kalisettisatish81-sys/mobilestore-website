-- ====================================================================
-- PREMIUM MOBILE STORE - HARDEN is_admin() FUNCTION
-- Migration: 20260929000000_harden_is_admin.sql
-- Description: Hardens the SECURITY DEFINER is_admin() helper function
--              by explicitly setting search_path to public and using
--              fully qualified table references to mitigate search path
--              mutation vulnerabilities.
-- ====================================================================

-- 1. HARDEN FUNCTION: public.is_admin()
-- Explicitly defines search_path = public and references public.admin_users
-- Preserves existing authorization logic and full RLS compatibility
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE id = auth.uid()
  );
END;
$$;

-- 2. PERMISSIONS
-- Explicitly grant execution rights to authenticated users and service_role
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

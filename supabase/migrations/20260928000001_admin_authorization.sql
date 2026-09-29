-- ====================================================================
-- PREMIUM MOBILE STORE - ADMIN AUTHORIZATION FOUNDATION
-- Migration: 20260928000001_admin_authorization.sql
-- Description: Creates admin_users table linked to auth.users,
--              establishes RLS, and creates is_admin() helper function.
-- ====================================================================

-- 1. TABLE: ADMIN_USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  CONSTRAINT check_admin_role CHECK (role IN ('admin', 'super_admin')),
  CONSTRAINT check_admin_email_not_empty CHECK (trim(email) <> '')
);

-- 2. INDEXES
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES
-- Authenticated users can only read their own admin record to verify their permissions
DROP POLICY IF EXISTS "Admins can view their own record" ON admin_users;
CREATE POLICY "Admins can view their own record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 5. HELPER FUNCTION: is_admin()
-- Returns true if the currently authenticated user exists in admin_users
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- INSTRUCTIONS FOR FIRST ADMIN SETUP:
-- 1. Create a user in Supabase Dashboard under Authentication > Users
-- 2. Run the following SQL query in SQL Editor (replace with the user's UUID and email):
--
-- INSERT INTO admin_users (id, email, role)
-- VALUES ('<USER_UUID>', '<USER_EMAIL>', 'admin');
-- ====================================================================

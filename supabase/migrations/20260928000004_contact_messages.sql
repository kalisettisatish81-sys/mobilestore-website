-- ====================================================================
-- PREMIUM MOBILE STORE - CONTACT MESSAGES SCHEMA & RLS
-- Migration: 20260928000004_contact_messages.sql
-- Description: Creates contact_messages table and Row Level Security policies.
--              Public and anonymous users may INSERT contact inquiries.
--              Only authenticated administrators may SELECT, UPDATE, or DELETE messages.
-- ====================================================================

-- 1. Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  CONSTRAINT check_contact_name_not_empty CHECK (trim(name) <> ''),
  CONSTRAINT check_contact_email_not_empty CHECK (trim(email) <> ''),
  CONSTRAINT check_contact_subject_not_empty CHECK (trim(subject) <> ''),
  CONSTRAINT check_contact_message_not_empty CHECK (trim(message) <> '')
);

-- 2. Indexes for administrative queries and chronological sorting
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 4. INSERT POLICY: Anonymous and public users may INSERT contact messages
DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
CREATE POLICY "Public can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 5. SELECT POLICY: Only authenticated administrators can view/read contact messages
DROP POLICY IF EXISTS "Admins can view contact messages" ON contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- 6. UPDATE POLICY: Only authenticated administrators can update contact messages
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 7. DELETE POLICY: Only authenticated administrators can delete contact messages
DROP POLICY IF EXISTS "Admins can delete contact messages" ON contact_messages;
CREATE POLICY "Admins can delete contact messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (is_admin());

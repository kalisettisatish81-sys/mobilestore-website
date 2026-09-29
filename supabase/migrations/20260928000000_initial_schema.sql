-- ====================================================================
-- PREMIUM MOBILE STORE - SUPABASE DATABASE SCHEMA MIGRATION
-- Migration: 20260928000000_initial_schema.sql
-- Description: Creates mobiles and reviews tables, constraints,
--              indexes, updated_at trigger, and Row Level Security policies.
-- ====================================================================

-- 1. EXTENSIONS
-- UUID generator is natively available in PostgreSQL 13+ (gen_random_uuid())
-- but ensure pgcrypto is available as a fallback.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. TABLE: MOBILES
-- ====================================================================
CREATE TABLE IF NOT EXISTS mobiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  ram TEXT NOT NULL,
  storage TEXT NOT NULL,
  images TEXT[] NOT NULL,
  stock_status TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  -- CONSTRAINTS
  CONSTRAINT check_mobile_price CHECK (price >= 0),
  CONSTRAINT check_mobile_images_count CHECK (cardinality(images) >= 1 AND cardinality(images) <= 5),
  CONSTRAINT check_mobile_stock_status CHECK (stock_status IN ('In Stock', 'Limited Stock', 'Out of Stock')),
  CONSTRAINT check_mobile_name_not_empty CHECK (trim(name) <> ''),
  CONSTRAINT check_mobile_brand_not_empty CHECK (trim(brand) <> ''),
  CONSTRAINT check_mobile_ram_not_empty CHECK (trim(ram) <> ''),
  CONSTRAINT check_mobile_storage_not_empty CHECK (trim(storage) <> '')
);

-- ====================================================================
-- 3. TABLE: REVIEWS
-- ====================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  review_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  -- CONSTRAINTS
  CONSTRAINT check_review_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT check_review_customer_name_not_empty CHECK (trim(customer_name) <> ''),
  CONSTRAINT check_review_text_not_empty CHECK (trim(review_text) <> '')
);

-- ====================================================================
-- 4. INDEXES
-- ====================================================================
-- Mobiles search and filtering indexes
CREATE INDEX IF NOT EXISTS idx_mobiles_brand ON mobiles(brand);
CREATE INDEX IF NOT EXISTS idx_mobiles_name ON mobiles(name);
CREATE INDEX IF NOT EXISTS idx_mobiles_ram ON mobiles(ram);
CREATE INDEX IF NOT EXISTS idx_mobiles_storage ON mobiles(storage);
CREATE INDEX IF NOT EXISTS idx_mobiles_price ON mobiles(price);
CREATE INDEX IF NOT EXISTS idx_mobiles_created_at ON mobiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mobiles_is_hidden ON mobiles(is_hidden);
CREATE INDEX IF NOT EXISTS idx_mobiles_stock_status ON mobiles(stock_status);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- ====================================================================
-- 5. AUTOMATIC UPDATED_AT TRIGGER
-- ====================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_mobiles_updated_at ON mobiles;
CREATE TRIGGER trigger_update_mobiles_updated_at
  BEFORE UPDATE ON mobiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ====================================================================
ALTER TABLE mobiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 7. RLS POLICIES (PUBLIC CUSTOMER ACCESS)
-- ====================================================================

-- Mobiles: Customers can only view visible (non-hidden) mobiles
DROP POLICY IF EXISTS "Public can view visible mobiles" ON mobiles;
CREATE POLICY "Public can view visible mobiles"
  ON mobiles
  FOR SELECT
  TO public
  USING (is_hidden = false);

-- Reviews: Customers can read all reviews
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
CREATE POLICY "Public can view reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

-- NOTE: No INSERT, UPDATE, or DELETE policies are granted to the public or anon roles.
-- Writes are denied by default under RLS.
-- Admin authentication and write policies will be configured in a subsequent step.

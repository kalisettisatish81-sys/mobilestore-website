-- ====================================================================
-- PREMIUM MOBILE STORE - SEED AUTHENTIC CUSTOMER REVIEWS
-- Migration: 20260929000002_seed_reviews.sql
-- Description: Seeds 12 realistic and diverse verified customer reviews
--              covering top smartphone brands (Apple, Samsung, OnePlus, Google,
--              Vivo, Nothing, Xiaomi, iQOO, Motorola) with ratings and feedback.
--              Uses ON CONFLICT (id) DO NOTHING so it is completely safe to run.
-- ====================================================================

INSERT INTO public.reviews (id, customer_name, rating, review_text, created_at)
VALUES
  (
    '22222222-2222-4222-8222-222222222201',
    'Rahul Sharma',
    5,
    'Upgraded to the iPhone 16 Pro Max from my older 13 Pro. The camera control button and battery endurance are unbelievable. Genuine product with sealed Apple warranty.',
    '2026-09-28 14:30:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'Priya Nair',
    5,
    'Purchased the Samsung Galaxy S25 Ultra in Titanium Black. The anti-reflective screen outdoors in direct sunlight is a game changer. Super fast next-day delivery!',
    '2026-09-28 11:15:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    'Ankit Verma',
    5,
    'OnePlus 13 delivers incredible flagship performance. 100W charging fills the 6000mAh battery in under 30 minutes! Truly impressed by Premium Mobile Store’s customer service.',
    '2026-09-27 18:45:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    'Sneha Patel',
    4,
    'Got the Google Pixel 9 Pro. The camera quality in low-light night photography is unmatched. Sleek compact size that easily fits in one hand.',
    '2026-09-27 09:20:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    'Vikramaditya Das',
    5,
    'Bought the Vivo X200 Pro specifically for the 200MP ZEISS telephoto lens. Concert photos look like they were taken with a professional DSLR. 10/10 purchase.',
    '2026-09-26 16:10:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222206',
    'Aarav Mehta',
    5,
    'The transparent design and Glyph lighting on the Nothing Phone (2) always turns heads. Extremely clean software with zero bloatware and smooth 120Hz LTPO display.',
    '2026-09-26 12:00:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222207',
    'Divya Sundaram',
    4,
    'First time ordering from this store and I was worried about transit safety. The phone arrived in heavy bubble-wrapped secure packaging with zero issues. Great customer support team!',
    '2026-09-25 15:40:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222208',
    'Rohan Kulkarni',
    5,
    'Galaxy Z Fold 6 is worth every rupee. Reading PDFs and multitasking with split screens while traveling for work has doubled my productivity. Outstanding build quality.',
    '2026-09-25 10:25:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222209',
    'Kavita Reddy',
    5,
    'Xiaomi 14 Ultra photography is on another level. The stepless variable aperture gives real optical depth of field. Prompt delivery and authentic GST invoice provided.',
    '2026-09-24 17:50:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222210',
    'Mohammed Zaid',
    4,
    'iQOO 13 is a pure gaming beast. Zero thermal throttling even during extended 120fps sessions. Excellent purchase experience and very fast shipping.',
    '2026-09-24 13:15:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222211',
    'Tanvi Joshi',
    5,
    'Smooth checkout, polite customer support, and 100% genuine brand warranty. Upgraded to the iPhone 16 in Pink and love the vibrant pastel finish!',
    '2026-09-23 19:00:00+00'
  ),
  (
    '22222222-2222-4222-8222-222222222212',
    'Arjun Singhania',
    5,
    'Motorola Edge 50 Ultra has the most luxurious wooden back texture. Feels warmer and more premium than cold glass. Highly recommend this store.',
    '2026-09-23 11:30:00+00'
  )
ON CONFLICT (id) DO NOTHING;

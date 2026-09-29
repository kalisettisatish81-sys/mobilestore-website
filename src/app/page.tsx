import type { Metadata } from 'next';
import { getUniqueBrands, getFeaturedMobiles } from '@/lib/mobiles';
import { getPublicReviews } from '@/lib/reviews';
import type { Mobile, Review } from '@/types';
import CustomerNavbar from '@/components/customer/Navbar';
import HeroSection from '@/components/customer/HeroSection';
import BrandMarquee from '@/components/customer/BrandMarquee';
import FeaturedMobiles from '@/components/customer/FeaturedMobiles';
import CustomerReviews from '@/components/customer/CustomerReviews';
import Footer from '@/components/customer/Footer';

export const metadata: Metadata = {
  title: 'Premium Mobile Store | Find Your Perfect Smartphone',
  description:
    'Explore premium smartphones with powerful performance, modern design, and flexible options.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let brands: string[] = [];
  let featuredMobiles: Mobile[] = [];
  let customerReviews: Review[] = [];
  let featuredError = false;
  let reviewsError = false;

  // 1. Fetch Unique Brands from visible products
  try {
    brands = await getUniqueBrands();
  } catch (err) {
    console.error('Unexpected error loading brands for marquee:', err);
  }

  // 2. Fetch Featured Mobiles (Only visible, newest first, max 8)
  try {
    featuredMobiles = await getFeaturedMobiles();
    if (featuredMobiles.length === 0) {
      featuredError = true;
    }
  } catch (err) {
    console.error('Unexpected error loading featured mobiles:', err);
    featuredError = true;
  }

  // 3. Fetch Customer Reviews (Only public-readable, newest first, max 12)
  try {
    const reviewsResult = await getPublicReviews();
    if (reviewsResult.success && reviewsResult.reviews.length > 0) {
      customerReviews = reviewsResult.reviews.slice(0, 12);
    } else {
      reviewsError = true;
    }
  } catch (err) {
    console.error('Unexpected error loading customer reviews:', err);
    reviewsError = true;
  }


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden">
      {/* 1. Navbar */}
      <CustomerNavbar />

      <main className="flex-1 w-full">
        {/* 2. Premium Hero Section */}
        <HeroSection />

        {/* 3. Infinite Horizontal Brand Marquee */}
        <BrandMarquee brands={brands} />

        {/* 4. Featured Mobiles Section */}
        <FeaturedMobiles mobiles={featuredMobiles} hasError={featuredError} />

        {/* 5. Customer Reviews Section */}
        <CustomerReviews reviews={customerReviews} hasError={reviewsError} />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}

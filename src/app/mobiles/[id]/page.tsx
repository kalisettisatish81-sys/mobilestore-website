import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMobileById } from '@/lib/mobiles';
import type { Mobile } from '@/types';
import { formatPrice } from '@/utils';
import CustomerNavbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import MobileImageGallery from '@/components/customer/MobileImageGallery';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: 'Mobile Not Found | Premium Mobile Store',
    };
  }

  try {
    const mobile = await getMobileById(id);

    if (!mobile) {
      return {
        title: 'Mobile Not Found | Premium Mobile Store',
        description: 'The requested smartphone could not be found or is no longer available.',
      };
    }

    const title = `${mobile.name} | Premium Mobile Store`;
    const description = `Buy ${mobile.name} with ${mobile.ram} RAM and ${mobile.storage} storage at Premium Mobile Store.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: mobile.images?.[0] ? [{ url: mobile.images[0] }] : [],
      },
    };
  } catch {
    return {
      title: 'Mobiles | Premium Mobile Store',
    };
  }
}

export default async function MobileDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let mobile: Mobile | null = null;

  try {
    mobile = await getMobileById(id);
  } catch (err) {
    console.error('Error fetching mobile details:', err);
  }

  if (!mobile || mobile.is_hidden) {
    notFound();
  }

  // Stock Status configuration
  const stockConfig = {
    'In Stock': {
      dot: 'bg-emerald-400',
      badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    },
    'Limited Stock': {
      dot: 'bg-amber-400',
      badge: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
    },
    'Out of Stock': {
      dot: 'bg-rose-400',
      badge: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
    },
  }[mobile.stock_status] || {
    dot: 'bg-slate-400',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Customer Navbar */}
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation & Breadcrumbs */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/mobiles"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Mobiles</span>
            </Link>

            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/mobiles" className="hover:text-white transition-colors">
                Mobiles
              </Link>
              <span>/</span>
              <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                {mobile.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Product Details Section (Desktop ~55% gallery, ~45% info) */}
        <section aria-labelledby="product-details-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <h2 id="product-details-heading" className="sr-only">
            {mobile.name} Details
          </h2>

          {/* Left Column: Image Gallery (~55% width) */}
          <div className="lg:col-span-7 w-full">
            <MobileImageGallery
              images={mobile.images}
              title={`${mobile.brand} ${mobile.name}`}
            />
          </div>

          {/* Right Column: Product Information (~45% width) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Brand & Name */}
            <div className="space-y-2">
              <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-400">
                {mobile.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {mobile.name}
              </h1>
            </div>

            {/* Price & Stock Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800/80">
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">
                  Price
                </span>
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {formatPrice(mobile.price)}
                </span>
              </div>

              {/* Stock Status Badge */}
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-semibold ${stockConfig.badge}`}
              >
                <span className={`h-2 w-2 rounded-full ${stockConfig.dot}`} aria-hidden="true" />
                {mobile.stock_status}
              </div>
            </div>

            {/* Product Specifications Card */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm space-y-4">
              <h2 className="text-base font-bold text-white tracking-tight">
                Specifications
              </h2>
              <dl className="grid grid-cols-2 gap-3.5 text-sm">
                <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-3.5">
                  <dt className="text-xs font-medium text-slate-400">Brand</dt>
                  <dd className="mt-1 font-semibold text-white">{mobile.brand}</dd>
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-3.5">
                  <dt className="text-xs font-medium text-slate-400">RAM</dt>
                  <dd className="mt-1 font-semibold text-white">{mobile.ram} RAM</dd>
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-3.5">
                  <dt className="text-xs font-medium text-slate-400">Storage</dt>
                  <dd className="mt-1 font-semibold text-white">{mobile.storage} Storage</dd>
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-3.5">
                  <dt className="text-xs font-medium text-slate-400">Availability</dt>
                  <dd className="mt-1 font-semibold text-white flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${stockConfig.dot}`} aria-hidden="true" />
                    {mobile.stock_status}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Product Overview / Description */}
            <div className="space-y-3 pt-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Product Overview
              </h2>
              {mobile.description && mobile.description.trim() ? (
                <div className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                  {mobile.description}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No detailed description available for this product.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Customer Footer */}
      <Footer />
    </div>
  );
}

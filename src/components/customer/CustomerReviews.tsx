import type { Review } from '@/types';

interface CustomerReviewsProps {
  reviews?: Review[];
  hasError?: boolean;
}

export default function CustomerReviews({
  reviews = [],
  hasError = false,
}: CustomerReviewsProps) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  function renderStars(rating: number) {
    const safeRating = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));
    return (
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={`${safeRating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= safeRating
                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]'
                : 'text-slate-700 fill-none'
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        ))}
        <span className="sr-only">{safeRating} out of 5 stars</span>
      </div>
    );
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  // Construct duplicated items sequence for seamless infinite marquee loop
  const minCards = 8;
  const repeatCount = safeReviews.length > 0 ? Math.max(1, Math.ceil(minCards / safeReviews.length)) : 1;
  const baseSequence: Review[] = [];
  for (let i = 0; i < repeatCount; i++) {
    baseSequence.push(...safeReviews);
  }
  const marqueeReviews = [...baseSequence, ...baseSequence];

  return (
    <section
      aria-labelledby="customer-reviews-heading"
      className="relative w-full py-16 sm:py-20 lg:py-24 overflow-hidden bg-slate-950"
    >
      {/* Subtle ambient glow effect */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/5 blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden="true" />
            WHAT OUR CUSTOMERS SAY
          </div>
          <h2
            id="customer-reviews-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white"
          >
            Trusted by Smartphone Buyers.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Real experiences from customers who explored our mobile collection.
          </p>
        </div>
      </div>

      {/* Body Container: Error State, Empty State, or Infinite Marquee */}
      {hasError ? (
        /* Graceful Error State */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 sm:p-12 text-center backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400 mb-4 border border-slate-700/60 shadow-inner">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Customer reviews are temporarily unavailable.
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
              Please check back shortly.
            </p>
          </div>
        </div>
      ) : safeReviews.length === 0 ? (
        /* Polished Empty State */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 sm:p-12 text-center backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500 mb-4 border border-slate-700/60 shadow-inner">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Customer reviews are coming soon.
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
              Be among the first customers to share your experience.
            </p>
          </div>
        </div>
      ) : (
        /* Infinite Horizontal Marquee */
        <div className="relative w-full overflow-hidden mt-10 sm:mt-12">
          {/* Edge Gradient Masks for Smooth Fade */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24 lg:w-36 bg-gradient-to-r from-slate-950 to-transparent motion-reduce:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24 lg:w-36 bg-gradient-to-l from-slate-950 to-transparent motion-reduce:hidden"
            aria-hidden="true"
          />

          {/* Marquee Track */}
          <div
            className="animate-reviews-marquee flex items-stretch gap-6 py-4 motion-reduce:animate-none motion-reduce:transform-none motion-reduce:overflow-x-auto motion-reduce:w-auto motion-reduce:px-4 motion-reduce:pb-6"
            tabIndex={0}
            aria-label="Customer reviews marquee"
          >
            {marqueeReviews.map((review, index) => {
              const initials = review.customer_name
                ? review.customer_name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'U';

              const formattedDate = formatDate(review.created_at);

              return (
                <article
                  key={`${review.id}-${index}`}
                  className="group flex flex-col justify-between w-[280px] sm:w-[340px] md:w-[380px] shrink-0 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm shadow-xl shadow-indigo-500/5 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:scale-[1.01]"
                >
                  <div>
                    {/* Card Header: Avatar, Name & Stars */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-xs font-bold text-white shadow-md shadow-indigo-500/20"
                          aria-hidden="true"
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                            {review.customer_name}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400">
                            <svg
                              className="w-3 h-3 shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            Customer Review
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">{renderStars(review.rating)}</div>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic whitespace-normal">
                      &ldquo;{review.review_text}&rdquo;
                    </p>
                  </div>

                  {/* Card Footer: Date */}
                  {formattedDate && (
                    <div className="mt-5 pt-3.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Customer Review</span>
                      <time dateTime={review.created_at}>{formattedDate}</time>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

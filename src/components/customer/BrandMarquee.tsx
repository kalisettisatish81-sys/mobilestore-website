interface BrandMarqueeProps {
  brands?: string[];
}

export default function BrandMarquee({ brands = [] }: BrandMarqueeProps) {
  // If no brands are available from the database, show a graceful fallback message
  if (!brands || brands.length === 0) {
    return (
      <section
        aria-label="Featured Smartphone Brands"
        className="w-full border-y border-slate-800/80 bg-slate-950/60 py-6 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            Explore authentic smartphones from leading global brands in our catalog.
          </p>
        </div>
      </section>
    );
  }

  // Ensure enough items in the sequence to span large viewports smoothly
  const minItems = 12;
  const repeatCount = Math.max(1, Math.ceil(minItems / brands.length));
  const baseSequence: string[] = [];
  for (let i = 0; i < repeatCount; i++) {
    baseSequence.push(...brands);
  }
  // Duplicate baseSequence to enable seamless 50% translateX infinite looping
  const marqueeItems = [...baseSequence, ...baseSequence];

  return (
    <section
      aria-label="Featured Smartphone Brands"
      className="relative w-full overflow-hidden border-y border-slate-800/80 bg-slate-950/60 py-5 sm:py-6 backdrop-blur-sm motion-reduce:overflow-x-auto"
    >
      {/* Edge Gradient Masks for Smooth In/Out Fading */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-slate-950 to-transparent motion-reduce:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-slate-950 to-transparent motion-reduce:hidden"
        aria-hidden="true"
      />

      {/* Marquee Track */}
      <div className="animate-marquee flex items-center gap-8 sm:gap-12 motion-reduce:animate-none motion-reduce:transform-none motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-4">
        {marqueeItems.map((brand, index) => (
          <div
            key={`${brand}-${index}`}
            className="flex items-center gap-8 sm:gap-12 flex-shrink-0"
          >
            <span className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-slate-300 hover:text-white transition-colors cursor-default select-none">
              {brand}
            </span>
            <span className="text-indigo-400/60 text-xs sm:text-sm select-none" aria-hidden="true">
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

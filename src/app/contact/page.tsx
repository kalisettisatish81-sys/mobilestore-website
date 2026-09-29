import type { Metadata } from 'next';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import ContactInfo from '@/components/customer/ContactInfo';
import ContactForm from '@/components/customer/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | Premium Mobile Store',
  description:
    'Contact Premium Mobile Store for mobile product questions, store information, and customer support.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero / Header Section */}
        <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 py-16 sm:py-20 lg:py-24">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              GET IN TOUCH
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              We&apos;re Here to Help.
            </h1>

            {/* Supporting Text */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
              Have a question about a mobile, an order, or our store? Reach out to us and our team will be happy to help.
            </p>
          </div>
        </section>

        {/* Contact Content Grid: Left (Info + Location) & Right (Form) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Contact Details, Hours & Store Location Map */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <ContactInfo />
            </div>

            {/* Right Column: Contact Message Submission Form */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

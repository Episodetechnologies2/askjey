import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Header />
      <main className="pt-32 pb-20">
        <section className="container mx-auto max-w-4xl px-6">
          <h1 className="font-display text-4xl font-bold uppercase text-white">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-white/60">Effective Date: March 3, 2026</p>

          <div className="mt-10 space-y-8 text-white/80">
            <section>
              <h2 className="font-display text-2xl font-bold text-white">1. Acceptance</h2>
              <p className="mt-3 leading-relaxed">
                By accessing or using this website, you agree to these Terms of
                Service. If you do not agree, please do not use this website.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                2. Services and Content
              </h2>
              <p className="mt-3 leading-relaxed">
                This website provides information about Ask Jey Anand, including
                professional services, mentorship programs, media, articles, and booking
                options. Content is provided for general informational purposes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">3. Booking Terms</h2>
              <p className="mt-3 leading-relaxed">
                Booking requests may be processed through third-party platforms such as
                Calendly. Session confirmation, rescheduling, and cancellation are
                subject to platform availability and communication between parties.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                4. Intellectual Property
              </h2>
              <p className="mt-3 leading-relaxed">
                All website content, including text, branding, visuals, and materials,
                is owned by or licensed to Ask Jey Anand unless otherwise stated. You
                may not copy, reproduce, or distribute content without permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                5. Acceptable Use
              </h2>
              <p className="mt-3 leading-relaxed">You agree not to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                <li>Use the website for unlawful or harmful activity.</li>
                <li>Attempt unauthorized access to systems or data.</li>
                <li>Upload or transmit malicious code.</li>
                <li>Misrepresent your identity or submit false information.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                6. Third-Party Links
              </h2>
              <p className="mt-3 leading-relaxed">
                This website may contain links to third-party websites and services. We
                are not responsible for their content, policies, or practices.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                7. Disclaimer of Warranties
              </h2>
              <p className="mt-3 leading-relaxed">
                The website and all content are provided on an "as is" and "as
                available" basis without warranties of any kind, express or implied.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                8. Limitation of Liability
              </h2>
              <p className="mt-3 leading-relaxed">
                To the maximum extent permitted by law, Ask Jey Anand is not liable for
                indirect, incidental, special, or consequential damages arising from use
                of this website or related services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                9. Changes to Terms
              </h2>
              <p className="mt-3 leading-relaxed">
                We may update these Terms of Service at any time. Continued use of the
                website after updates constitutes acceptance of the revised terms.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer ctaText={{ line1: "Let's Build", line2: "Something Epic." }} />
    </div>
  );
}



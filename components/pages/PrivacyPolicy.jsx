import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Header />
      <main className="pt-32 pb-20">
        <section className="container mx-auto max-w-4xl px-6">
          <h1 className="font-display text-4xl font-bold uppercase text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-white/60">Effective Date: March 3, 2026</p>

          <div className="mt-10 space-y-8 text-white/80">
            <section>
              <h2 className="font-display text-2xl font-bold text-white">1. Overview</h2>
              <p className="mt-3 leading-relaxed">
                This Privacy Policy explains how Ask Jey Anand collects, uses, stores,
                and protects your information when you use this website and related
                services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                2. Information We Collect
              </h2>
              <p className="mt-3 leading-relaxed">
                We may collect personal information such as your name, email address,
                phone number, company details, and message content when you submit
                forms or contact us.
              </p>
              <p className="mt-3 leading-relaxed">
                We may also collect limited technical information such as browser type,
                device data, pages visited, and approximate location for analytics and
                security.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                3. How We Use Information
              </h2>
              <p className="mt-3 leading-relaxed">Your information may be used to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                <li>Respond to your inquiries and provide requested services.</li>
                <li>Schedule sessions and manage communication.</li>
                <li>Improve website performance and user experience.</li>
                <li>Send updates, subject to your communication preferences.</li>
                <li>Comply with legal obligations and enforce our policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                4. Third-Party Services
              </h2>
              <p className="mt-3 leading-relaxed">
                We may use trusted third-party platforms such as Calendly for booking
                and other service providers for communication or analytics. Their data
                practices are governed by their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                5. Cookies and Tracking
              </h2>
              <p className="mt-3 leading-relaxed">
                This website may use cookies or similar technologies to understand
                traffic patterns, remember user preferences, and optimize performance.
                You can manage cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">6. Data Security</h2>
              <p className="mt-3 leading-relaxed">
                We take reasonable technical and organizational measures to protect your
                data. However, no online transmission or storage method can be
                guaranteed as fully secure.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">7. Data Retention</h2>
              <p className="mt-3 leading-relaxed">
                We retain personal information only as long as required for business,
                legal, or operational purposes, and then delete or anonymize it where
                possible.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">8. Your Rights</h2>
              <p className="mt-3 leading-relaxed">
                You may request access, correction, or deletion of your personal
                information by contacting us through the Contact page.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-white">
                9. Policy Updates
              </h2>
              <p className="mt-3 leading-relaxed">
                We may update this Privacy Policy from time to time. Updated versions
                will be posted on this page with a revised effective date.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer ctaText={{ line1: "Let's Build", line2: "Something Epic." }} />
    </div>
  );
}



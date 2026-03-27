import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy - CarMogger" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto prose-invert">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Privacy Policy</h1>
          <p className="text-sm text-[var(--grey-500)] mb-10">Last updated: 27 March 2026</p>

          <div className="space-y-8 text-[var(--grey-300)] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-3">1. Overview</h2>
              <p>CarMogger (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This policy explains how we collect, use, and protect your information when you use carmogger.com. We comply with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">2. Information We Collect</h2>
              <p><strong>Account information:</strong> Email address, username, display name, and Google account information if you sign in with Google.</p>
              <p className="mt-2"><strong>Car images:</strong> Photos you upload for rating. These are processed by our AI and stored to display on your profile and leaderboards.</p>
              <p className="mt-2"><strong>Usage data:</strong> IP address (hashed for privacy), page views, interactions with leaderboards and profiles, XP events, and session information.</p>
              <p className="mt-2"><strong>Payment data:</strong> Payment information is processed directly by Stripe. We do not store credit card numbers. We retain Stripe customer IDs and transaction records.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">3. How We Use Your Information</h2>
              <p>We use your information to: provide and improve the CarMogger platform; process AI car ratings; maintain leaderboards and league standings; track XP and progression; process payments; send service-related communications; prevent fraud and abuse; comply with legal obligations.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">4. AI Processing</h2>
              <p>Your uploaded car images are sent to Google Gemini AI for analysis. This processing occurs on Google&apos;s servers. The AI identifies vehicle details and generates scores. We store the AI-generated analysis results alongside your images. Google&apos;s data processing is governed by their privacy policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">5. Data Sharing</h2>
              <p>We do not sell your personal information. We share data with: <strong>Stripe</strong> for payment processing; <strong>Google</strong> for AI image analysis and OAuth authentication; <strong>Vercel</strong> for hosting; <strong>Neon</strong> for database services. We may disclose information if required by law or to protect our rights.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">6. Public Information</h2>
              <p>Your username, car images, CarMog scores, league status, level, and profile information are publicly visible on the platform and leaderboards. If you use the embed feature, your score and car information will be displayed on external sites.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">7. Cookies</h2>
              <p>We use essential cookies for authentication and session management. We do not use third-party advertising cookies. You can control cookies through your browser settings, though disabling essential cookies may affect platform functionality.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">8. Data Retention</h2>
              <p>We retain your account and car data for as long as your account is active. View data is aggregated daily and individual view records are retained for 90 days. You can request deletion of your account and associated data at any time.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">9. Data Security</h2>
              <p>We implement industry-standard security measures including encrypted connections (HTTPS/TLS), hashed IP addresses for view tracking, secure authentication tokens, and database encryption at rest. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">10. Your Rights</h2>
              <p>Under the Australian Privacy Principles, you have the right to: access the personal information we hold about you; request correction of inaccurate information; request deletion of your personal information; lodge a complaint with the Office of the Australian Information Commissioner (OAIC) if you believe we have breached the APPs.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">11. Children</h2>
              <p>CarMogger is not intended for children under 13. We do not knowingly collect information from children under 13. If we become aware that we have collected such information, we will delete it promptly.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">12. Contact</h2>
              <p>For privacy inquiries, data access requests, or complaints, contact us at hello@carmogger.com. We will respond within 30 days as required by the Australian Privacy Act.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

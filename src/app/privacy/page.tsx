import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy - CarMogger" };

const cardStyle: React.CSSProperties = { borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 32 };

export default function PrivacyPage() {
  const sections = [
    { title: "1. Overview", body: 'CarMogger ("we", "us", "our") respects your privacy. This policy explains how we collect, use, and protect your information when you use carmogger.com. We comply with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).' },
    { title: "2. Information We Collect", body: "Account information: Email address, username, display name, and Google account information if you sign in with Google.\n\nCar images: Photos you upload for rating. These are processed by our AI and stored to display on your profile and leaderboards.\n\nUsage data: IP address (hashed for privacy), page views, interactions with leaderboards and profiles, XP events, and session information.\n\nPayment data: Payment information is processed directly by Stripe. We do not store credit card numbers. We retain Stripe customer IDs and transaction records." },
    { title: "3. How We Use Your Information", body: "We use your information to: provide and improve the CarMogger platform; process AI car ratings; maintain leaderboards and league standings; track XP and progression; process payments; send service-related communications; prevent fraud and abuse; comply with legal obligations." },
    { title: "4. AI Processing", body: "Your uploaded car images are sent to Google Gemini AI for analysis. This processing occurs on Google's servers. The AI identifies vehicle details and generates scores. We store the AI-generated analysis results alongside your images. Google's data processing is governed by their privacy policy." },
    { title: "5. Data Sharing", body: "We do not sell your personal information. We share data with: Stripe for payment processing; Google for AI image analysis and OAuth authentication; Vercel for hosting; Neon for database services. We may disclose information if required by law or to protect our rights." },
    { title: "6. Public Information", body: "Your username, car images, Mog Scores, league status, level, and profile information are publicly visible on the platform and leaderboards. If you use the embed feature, your score and car information will be displayed on external sites." },
    { title: "7. Cookies", body: "We use essential cookies for authentication and session management. We do not use third-party advertising cookies. You can control cookies through your browser settings, though disabling essential cookies may affect platform functionality." },
    { title: "8. Data Retention", body: "We retain your account and car data for as long as your account is active. View data is aggregated daily and individual view records are retained for 90 days. You can request deletion of your account and associated data at any time." },
    { title: "9. Data Security", body: "We implement industry-standard security measures including encrypted connections (HTTPS/TLS), hashed IP addresses for view tracking, secure authentication tokens, and database encryption at rest. However, no method of transmission over the internet is 100% secure." },
    { title: "10. Your Rights", body: "Under the Australian Privacy Principles, you have the right to: access the personal information we hold about you; request correction of inaccurate information; request deletion of your personal information; lodge a complaint with the Office of the Australian Information Commissioner (OAIC) if you believe we have breached the APPs." },
    { title: "11. Children", body: "CarMogger is not intended for children under 13. We do not knowingly collect information from children under 13. If we become aware that we have collected such information, we will delete it promptly." },
    { title: "12. Contact", body: "For privacy inquiries, data access requests, or complaints, contact us at hello@carmogger.com. We will respond within 30 days as required by the Australian Privacy Act." },
  ];

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ width: "100%", paddingTop: 120, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="ctr" style={{ textAlign: "center", position: "relative" }}>
          <p className="fade-up d1 mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>[ Legal ]</p>
          <h1 className="fade-up d2" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.05 }}>
            Privacy Policy
          </h1>
          <p className="fade-up d3 mono" style={{ marginTop: 16, fontSize: 12, color: "#52525b" }}>Last updated: 27 March 2026</p>
        </div>
      </section>

      <section style={{ width: "100%", paddingBottom: 80 }}>
        <div className="ctr">
          <div style={{ ...cardStyle, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {sections.map((s) => (
                <div key={s.title}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 12 }}>{s.title}</h2>
                  <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, whiteSpace: "pre-line" }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

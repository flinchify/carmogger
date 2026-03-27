"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function CheckIcon({ pop }: { pop: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={pop ? "#3b82f6" : "#52525b"} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M5 12H19" />
    </svg>
  );
}

interface Tier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  cta: string;
  popular: boolean;
  features: { label: string; included: boolean }[];
}

const TIERS: Tier[] = [
  {
    name: "Free", monthlyPrice: 0, yearlyPrice: 0,
    description: "Get started and see what your car scores.",
    cta: "Get Started Free", popular: false,
    features: [
      { label: "1 active car profile", included: true },
      { label: "3 analyses per month", included: true },
      { label: "Public page", included: true },
      { label: "Basic score (no full breakdown)", included: true },
      { label: "Share card with watermark", included: true },
      { label: "Leaderboard preview", included: true },
      { label: "7-day basic analytics", included: true },
      { label: "Instagram bio link", included: true },
      { label: "Full metric breakdown", included: false },
      { label: "Compare mode", included: false },
      { label: "Profile theme customization", included: false },
      { label: "Priority processing", included: false },
    ],
  },
  {
    name: "Pro", monthlyPrice: 15, yearlyPrice: 120,
    description: "For serious builders. Full access to every tool.",
    cta: "Subscribe Pro", popular: true,
    features: [
      { label: "5 active car profiles", included: true },
      { label: "30 analyses per month", included: true },
      { label: "Public page", included: true },
      { label: "Full metric breakdown", included: true },
      { label: "No watermark on shares", included: true },
      { label: "Full leaderboard access", included: true },
      { label: "90-day analytics", included: true },
      { label: "Instagram bio link", included: true },
      { label: "Compare mode", included: true },
      { label: "Profile theme customization", included: true },
      { label: "Priority processing", included: true },
      { label: "HireACreator sync", included: true },
    ],
  },
  {
    name: "Elite", monthlyPrice: 39, yearlyPrice: 349,
    description: "For influencers and media. Maximum exposure.",
    cta: "Subscribe Elite", popular: false,
    features: [
      { label: "Unlimited car profiles", included: true },
      { label: "100 analyses per month", included: true },
      { label: "Public page", included: true },
      { label: "Full metric breakdown", included: true },
      { label: "No watermark on shares", included: true },
      { label: "Full leaderboard access", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Instagram bio link", included: true },
      { label: "Compare mode", included: true },
      { label: "Verified badge", included: true },
      { label: "Sponsor/media kit exports", included: true },
      { label: "Featured discovery placement", included: true },
    ],
  },
];

const ADDONS = [
  { name: "10 Extra Analyses", price: "$8", description: "One-time top-up" },
  { name: "50 Extra Analyses", price: "$25", description: "One-time top-up" },
  { name: "Custom Share Card Pack", price: "$9", description: "One-time purchase" },
];

const cardStyle: React.CSSProperties = { borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 20 };

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero header */}
      <section style={{ width: "100%", paddingTop: 120, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="ctr" style={{ textAlign: "center", position: "relative" }}>
          <p className="fade-up d1 mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>[ Pricing ]</p>
          <h1 className="fade-up d2" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.05 }}>
            Simple pricing.
          </h1>
          <p className="fade-up d3" style={{ marginTop: 16, fontSize: 14, color: "#a1a1aa", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            Start free. Upgrade when you need more power.
          </p>
        </div>
      </section>

      {/* Toggle */}
      <section style={{ width: "100%", paddingBottom: 40 }}>
        <div className="ctr" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: !annual ? "white" : "#52525b" }}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            style={{ position: "relative", width: 48, height: 24, borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", padding: 0 }}
          >
            <div style={{ position: "absolute", top: 2, width: 20, height: 20, borderRadius: 10, background: "#3b82f6", transition: "left 0.2s", left: annual ? 26 : 2 }} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 500, color: annual ? "white" : "#52525b" }}>
            Annual
            <span className="mono" style={{ marginLeft: 8, fontSize: 10, color: "#34d399", textTransform: "uppercase" }}>Save 20%+</span>
          </span>
        </div>
      </section>

      {/* Pricing cards */}
      <section style={{ width: "100%", paddingBottom: 80 }}>
        <div className="ctr">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 64 }}>
            {TIERS.map((tier) => {
              const price = annual ? tier.yearlyPrice : tier.monthlyPrice;
              const period = annual ? "/yr" : "/mo";
              return (
                <div key={tier.name} style={{ borderRadius: 12, border: tier.popular ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.07)", background: "#111114", padding: 20, position: "relative" }}>
                  {tier.popular && (
                    <p className="mono" style={{ fontSize: 10, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Most Popular</p>
                  )}
                  <p style={{ fontSize: 15, fontWeight: 600, color: "white" }}>{tier.name}</p>
                  <p style={{ fontSize: 12, color: "#52525b", marginTop: 4, marginBottom: 16 }}>{tier.description}</p>
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: "white", fontFamily: "Outfit, sans-serif" }}>{price === 0 ? "$0" : `$${price}`}</span>
                    {price > 0 && <span style={{ fontSize: 13, color: "#3f3f46" }}>{period}</span>}
                    {annual && tier.monthlyPrice > 0 && (
                      <p style={{ fontSize: 11, color: "#52525b", marginTop: 4 }}>${Math.round(tier.yearlyPrice / 12)}/mo billed annually</p>
                    )}
                  </div>
                  <Link href={tier.name === "Free" ? "/rate" : "#"} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 36, borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none", background: tier.popular ? "#3b82f6" : "#19191d", color: tier.popular ? "white" : "#a1a1aa", border: tier.popular ? "none" : "1px solid rgba(255,255,255,0.07)" }}>
                    {tier.cta}
                  </Link>
                  <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                    {tier.features.map((f) => (
                      <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: f.included ? "#a1a1aa" : "#3f3f46" }}>
                        {f.included ? <CheckIcon pop={tier.popular} /> : <DashIcon />}
                        {f.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add-ons */}
          <div>
            <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ Add-ons ]</p>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800, color: "white", marginBottom: 8, textAlign: "center" }}>Need more?</h2>
            <p style={{ fontSize: 13, color: "#52525b", marginBottom: 32, textAlign: "center" }}>Top up anytime.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
              {ADDONS.map((addon) => (
                <div key={addon.name} style={{ ...cardStyle, textAlign: "center" }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4 }}>{addon.name}</h3>
                  <p style={{ fontSize: 24, fontWeight: 800, color: "#3b82f6", fontFamily: "Outfit, sans-serif", marginBottom: 4 }}>{addon.price}</p>
                  <p className="mono" style={{ fontSize: 11, color: "#52525b" }}>{addon.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 64, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#52525b" }}>All plans include access to the CarMogger community. Cancel anytime.</p>
            <p style={{ fontSize: 13, color: "#52525b", marginTop: 4 }}>Questions? Reach out at support@carmogger.com</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

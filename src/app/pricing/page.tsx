"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const TIERS = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Get started with basic car rating",
    cta: "Get Started",
    highlighted: false,
    features: [
      { text: "1 active car profile", included: true },
      { text: "3 analyses per month", included: true },
      { text: "Public CarMog page", included: true },
      { text: "Basic score (no full breakdown)", included: true },
      { text: "Share card with watermark", included: true },
      { text: "Leaderboard preview", included: true },
      { text: "7-day basic analytics", included: true },
      { text: "Instagram bio link", included: true },
      { text: "Full metric breakdown", included: false },
      { text: "Compare mode", included: false },
      { text: "Profile customization", included: false },
      { text: "Priority processing", included: false },
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 15,
    yearlyPrice: 120,
    description: "For serious car enthusiasts",
    cta: "Upgrade to Pro",
    highlighted: true,
    features: [
      { text: "5 active car profiles", included: true },
      { text: "30 analyses per month", included: true },
      { text: "Public CarMog page", included: true },
      { text: "Full metric breakdown", included: true },
      { text: "No watermark on share cards", included: true },
      { text: "Full leaderboard access", included: true },
      { text: "90-day analytics", included: true },
      { text: "Instagram bio link", included: true },
      { text: "Compare mode", included: true },
      { text: "Profile theme customization", included: true },
      { text: "Priority processing", included: true },
      { text: "HireACreator sync", included: true },
    ],
  },
  {
    name: "Elite",
    monthlyPrice: 39,
    yearlyPrice: 349,
    description: "For builders, creators, and dealers",
    cta: "Go Elite",
    highlighted: false,
    features: [
      { text: "Unlimited car profiles", included: true },
      { text: "100 analyses per month", included: true },
      { text: "Public CarMog page", included: true },
      { text: "Full metric breakdown", included: true },
      { text: "No watermark on share cards", included: true },
      { text: "Full leaderboard access", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Instagram bio link", included: true },
      { text: "Compare mode", included: true },
      { text: "Profile theme customization", included: true },
      { text: "Priority processing", included: true },
      { text: "Verified badge", included: true },
      { text: "Sponsor/media kit exports", included: true },
      { text: "Featured discovery placement", included: true },
      { text: "Webhook/API access (coming soon)", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

const ADDONS = [
  {
    name: "10 Extra Analyses",
    price: 8,
    description: "One-time top-up. Use them anytime.",
  },
  {
    name: "50 Extra Analyses",
    price: 25,
    description: "Bulk pack. Best value for power users.",
  },
  {
    name: "Custom Share Card Pack",
    price: 9,
    description: "Premium share card designs. One-time purchase.",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  useScrollReveal();

  return (
    <>
      <Particles />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 scroll-reveal">
            <h1 className="text-4xl sm:text-5xl font-black mb-3">
              Simple <span className="text-[var(--accent)]">pricing</span>
            </h1>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              Start free. Upgrade when you need more analyses, profiles, and features.
            </p>
          </div>

          {/* Monthly/Yearly toggle */}
          <div className="flex items-center justify-center gap-4 mb-12 scroll-reveal">
            <span className={`text-sm font-medium transition-colors ${!yearly ? "text-white" : "text-[var(--text-muted)]"}`}>
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-14 h-7 rounded-full bg-[var(--bg-card)] border border-[var(--border)] transition-all press-effect"
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-[var(--accent)] transition-all duration-300 ${
                  yearly ? "left-[calc(100%-1.625rem)]" : "left-0.5"
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? "text-white" : "text-[var(--text-muted)]"}`}>
              Yearly
            </span>
            {yearly && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                Save up to 25%
              </span>
            )}
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20 scroll-reveal">
            {TIERS.map((tier) => {
              const price = yearly ? tier.yearlyPrice : tier.monthlyPrice;
              const perMonth = yearly && tier.yearlyPrice > 0 ? Math.round(tier.yearlyPrice / 12) : tier.monthlyPrice;

              return (
                <div
                  key={tier.name}
                  className={`relative rounded-3xl p-6 sm:p-8 transition-all ${
                    tier.highlighted
                      ? "bg-[var(--bg-card)] border-2 border-blue-500/30 ring-1 ring-blue-500/10"
                      : "bg-[var(--bg-card)] border border-[var(--border)]"
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--accent)] text-white text-xs font-bold">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-black mb-1">{tier.name}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{tier.description}</p>
                  </div>

                  <div className="mb-6">
                    {price === 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">$0</span>
                        <span className="text-sm text-[var(--text-muted)]">/mo</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black">${price}</span>
                          <span className="text-sm text-[var(--text-muted)]">/{yearly ? "yr" : "mo"}</span>
                        </div>
                        {yearly && (
                          <p className="text-xs text-[var(--text-muted)] mt-1">${perMonth}/mo billed annually</p>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all press-effect ${
                      tier.highlighted
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 shadow-lg shadow-blue-500/25 btn-shine"
                        : "bg-white/[0.04] border border-[var(--border)] text-white hover:bg-white/[0.08] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    {tier.cta}
                  </button>

                  <div className="mt-8 space-y-3">
                    {tier.features.map((feature) => (
                      <div key={feature.text} className="flex items-start gap-3">
                        {feature.included ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" className="shrink-0 mt-0.5">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="shrink-0 mt-0.5 opacity-40">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        )}
                        <span className={`text-sm ${feature.included ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)] opacity-50"}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add-ons */}
          <div className="max-w-3xl mx-auto scroll-reveal">
            <h2 className="text-2xl font-black text-center mb-2">Add-ons</h2>
            <p className="text-sm text-[var(--text-muted)] text-center mb-8">
              Need more? Top up anytime, no subscription required.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {ADDONS.map((addon) => (
                <div
                  key={addon.name}
                  className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all"
                >
                  <h4 className="font-bold mb-1">{addon.name}</h4>
                  <p className="text-2xl font-black text-[var(--accent)] mb-2">${addon.price}</p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{addon.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ section */}
          <div className="max-w-2xl mx-auto mt-20 text-center scroll-reveal">
            <h2 className="text-2xl font-black mb-3">Questions?</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              All plans include your public CarMog profile and Instagram bio link.
              Upgrade or downgrade anytime. No contracts, no hidden fees.
              Need something custom? Reach out at{" "}
              <a href="mailto:hello@carmogger.com" className="text-[var(--accent)] hover:underline">hello@carmogger.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

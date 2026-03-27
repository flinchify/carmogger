"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 8H12" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface Tier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  cta: string;
  ctaStyle: string;
  popular: boolean;
  features: { label: string; included: boolean }[];
}

const TIERS: Tier[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Get started and see what your car scores.",
    cta: "Get Started Free",
    ctaStyle: "bg-white/[0.06] border border-[var(--border)] text-white hover:bg-white/[0.1]",
    popular: false,
    features: [
      { label: "1 active car profile", included: true },
      { label: "3 analyses per month", included: true },
      { label: "Public CarMog page", included: true },
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
    name: "Pro",
    monthlyPrice: 15,
    yearlyPrice: 120,
    description: "For serious builders. Full access to every tool.",
    cta: "Subscribe Pro",
    ctaStyle: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 shadow-lg shadow-blue-500/25",
    popular: true,
    features: [
      { label: "5 active car profiles", included: true },
      { label: "30 analyses per month", included: true },
      { label: "Public CarMog page", included: true },
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
    name: "Elite",
    monthlyPrice: 39,
    yearlyPrice: 349,
    description: "For influencers and media. Maximum exposure.",
    cta: "Subscribe Elite",
    ctaStyle: "bg-white/[0.06] border border-[var(--border)] text-white hover:bg-white/[0.1]",
    popular: false,
    features: [
      { label: "Unlimited car profiles", included: true },
      { label: "100 analyses per month", included: true },
      { label: "Public CarMog page", included: true },
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

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  useScrollReveal();

  return (
    <>
      <Particles />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12 scroll-reveal">
            <h1 className="text-4xl sm:text-5xl font-black mb-3">
              Simple <span className="text-[var(--accent)]">pricing</span>
            </h1>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          {/* Monthly / Annual toggle */}
          <div className="flex items-center justify-center gap-4 mb-12 scroll-reveal">
            <span className={`text-sm font-medium transition-colors ${!annual ? "text-white" : "text-[var(--text-muted)]"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-7 rounded-full bg-[var(--bg-card)] border border-[var(--border)] transition-colors press-effect"
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-[var(--accent)] transition-all duration-300 ${annual ? "left-[30px]" : "left-0.5"}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? "text-white" : "text-[var(--text-muted)]"}`}>
              Annual
              <span className="ml-1.5 text-[10px] font-bold text-emerald-400 uppercase">Save 20%+</span>
            </span>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {TIERS.map((tier) => {
              const price = annual ? tier.yearlyPrice : tier.monthlyPrice;
              const period = annual ? "/yr" : "/mo";
              return (
                <div
                  key={tier.name}
                  className={`scroll-reveal rounded-[20px] p-8 border transition-all relative ${tier.popular ? "bg-[var(--bg-card)] border-blue-500/30 shadow-lg shadow-blue-500/5" : "bg-[var(--bg-card)] border-[var(--border)]"}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-black mb-1">{tier.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-4">{tier.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black">{price === 0 ? "$0" : `$${price}`}</span>
                      {price > 0 && <span className="text-sm text-[var(--text-muted)]">{period}</span>}
                    </div>
                    {annual && tier.monthlyPrice > 0 && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">${Math.round(tier.yearlyPrice / 12)}/mo billed annually</p>
                    )}
                  </div>
                  <Link
                    href={tier.name === "Free" ? "/rate" : "#"}
                    className={`block w-full py-3 rounded-xl text-sm font-bold text-center transition-all press-effect ${tier.ctaStyle}`}
                  >
                    {tier.cta}
                  </Link>
                  <div className="mt-8 space-y-3">
                    {tier.features.map((f) => (
                      <div key={f.label} className="flex items-center gap-3">
                        {f.included ? <CheckIcon /> : <DashIcon />}
                        <span className={`text-sm ${f.included ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"}`}>{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add-ons */}
          <div className="scroll-reveal">
            <h2 className="text-2xl font-black text-center mb-2">Add-ons</h2>
            <p className="text-sm text-[var(--text-muted)] text-center mb-8">Need more? Top up anytime.</p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {ADDONS.map((addon) => (
                <div key={addon.name} className="rounded-[20px] bg-[var(--bg-card)] border border-[var(--border)] p-6 text-center hover:border-[var(--border-hover)] transition-all">
                  <h3 className="font-bold text-sm mb-1">{addon.name}</h3>
                  <p className="text-2xl font-black text-[var(--accent)] mb-1">{addon.price}</p>
                  <p className="text-xs text-[var(--text-muted)]">{addon.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-reveal mt-16 text-center">
            <p className="text-[var(--text-muted)] text-sm">All plans include access to the CarMogger community. Cancel anytime.</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Questions? Reach out at support@carmogger.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

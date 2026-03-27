import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    ratingsPerMonth: 2,
    features: [
      "2 ratings per month",
      "Basic profile page",
      "Leaderboard access",
      "League placement",
    ],
  },
  pro: {
    name: "Pro",
    price: 4.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    ratingsPerMonth: Infinity,
    features: [
      "Unlimited ratings",
      "Priority AI analysis",
      "Embeddable widget",
      "Profile customization",
      "Animated league badge",
      "Early access to features",
    ],
  },
} as const;

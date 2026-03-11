/**
 * Homestead Hub — Stripe Product & Price Configuration
 * All subscription tiers are defined here for centralized access.
 */

export const PRODUCTS = {
  homesteader: {
    name: "The Homesteader",
    description: "Full access to all Homestead Hub features: unlimited AI assistant, complete barter board, skill guides, community profiles, hunting calendar, and land access database.",
    monthlyPrice: 700, // in cents = $7.00
    yearlyPrice: 6000, // in cents = $60.00 (saves $24)
    features: [
      "Unlimited AI Homestead Assistant",
      "Full Barter & Trade Board — post and browse unlimited listings",
      "Complete Skill Library with downloadable guides",
      "Homesteader Community Profile",
      "Interactive Map — find homesteaders near you",
      "Hunting Season Calendar — all 50 states",
      "Land Access Database — trusts, conservation, ag programs",
      "Priority support",
    ],
  },
} as const;

// These price IDs will be created in Stripe dashboard or via API.
// For now we create them dynamically on checkout.
export const PLAN_INTERVAL = {
  monthly: "month",
  yearly: "year",
} as const;

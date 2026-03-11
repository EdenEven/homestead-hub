import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import {
  updateUserStripe,
  getProfileByUserId,
  upsertProfile,
  getAllPublicProfiles,
  getBarterListings,
  createBarterListing,
  deleteBarterListing,
  getUserById,
} from "./db";
import { callDataApi } from "./_core/dataApi";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ---- AI Chat ----
  ai: router({
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `You are the Homestead Hub AI Assistant — a knowledgeable, friendly, and practical guide for self-reliant living and homesteading. You help people with:

- Butchering and meat processing (livestock and wild game)
- Foraging wild edibles and medicinal plants
- Building structures, fences, barns, and off-grid shelters
- Food preservation: canning, smoking, fermenting, dehydrating, root cellaring
- Gardening: planting calendars, companion planting, soil health, seed saving
- Hunting and gaming: seasons, licensing, field dressing, ethical harvest
- Animal husbandry: chickens, goats, pigs, cattle — care, breeding, health
- Water systems: rainwater collection, well drilling, filtration, gray water
- Solar energy: small-scale solar setup, battery banks, off-grid power
- Land access: land trusts, conservation programs, agricultural land
- Barter and trade in resilient local economies
- Community building and connecting with other homesteaders

You give practical, no-nonsense advice grounded in real homesteading experience. You are encouraging, clear, and never condescending. When safety is important (like foraging or butchering), you always mention it. Keep answers focused and actionable. You speak like a trusted neighbor who has been homesteading for 20 years.`;

        const result = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...input.messages,
          ],
        });

        const content = result.choices[0]?.message?.content;
        const text = typeof content === "string"
          ? content
          : Array.isArray(content)
          ? content.map((c) => ("text" in c ? c.text : "")).join("")
          : "";

        return { reply: text };
      }),
  }),

  // ---- Subscriptions / Stripe ----
  subscription: router({
    createCheckout: protectedProcedure
      .input(z.object({
        interval: z.enum(["month", "year"]).default("month"),
      }))
      .mutation(async ({ ctx, input }) => {
        const origin = ctx.req.headers.origin as string || "https://www.a1homesteadhub.com";
        const priceAmount = input.interval === "month" ? 700 : 6000; // cents

        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          customer_email: ctx.user.email || undefined,
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: {
                name: "The Homesteader — A1 Homestead Hub",
                description: "Full access: unlimited AI assistant, barter board, skill guides, community, hunting calendar & more.",
              },
              unit_amount: priceAmount,
              recurring: { interval: input.interval },
            },
            quantity: 1,
          }],
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
          allow_promotion_codes: true,
          success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/pricing`,
        });

        return { checkoutUrl: session.url };
      }),

    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      return {
        status: user?.subscriptionStatus || "none",
        isActive: user?.subscriptionStatus === "active" || user?.subscriptionStatus === "trialing",
        stripeCustomerId: user?.stripeCustomerId,
      };
    }),

    cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      if (!user?.stripeSubscriptionId) throw new Error("No active subscription found");

      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      return { success: true, message: "Subscription will cancel at end of billing period." };
    }),
  }),

  // ---- Profiles ----
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getProfileByUserId(ctx.user.id);
    }),

    getPublic: publicProcedure.query(async () => {
      return getAllPublicProfiles();
    }),

    save: protectedProcedure
      .input(z.object({
        displayName: z.string().max(100).optional(),
        bio: z.string().max(1000).optional(),
        location: z.string().max(200).optional(),
        state: z.string().max(50).optional(),
        skills: z.string().optional(),
        websiteUrl: z.string().url().optional().or(z.literal("")),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await upsertProfile({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  // ---- Barter & Trade ----
  barter: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => {
        return getBarterListings(input.category);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(3).max(200),
        description: z.string().min(10).max(2000),
        category: z.enum([
          "food-produce", "skills-labor", "animals-livestock",
          "seeds-plants", "tools-equipment", "goods-crafts", "land-space", "other"
        ]),
        offeringType: z.enum(["offer", "request"]).default("offer"),
        location: z.string().max(200).optional(),
        state: z.string().max(50).optional(),
        contactMethod: z.string().max(200).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await createBarterListing({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteBarterListing(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ---- Commodities Ticker ----
  commodities: router({
    getPrices: publicProcedure.query(async () => {
      const symbols = [
        { symbol: "ZC=F", name: "Corn", unit: "/bu" },
        { symbol: "ZW=F", name: "Wheat", unit: "/bu" },
        { symbol: "ZS=F", name: "Soybeans", unit: "/bu" },
        { symbol: "LE=F", name: "Live Cattle", unit: "/cwt" },
        { symbol: "HE=F", name: "Lean Hogs", unit: "/cwt" },
        { symbol: "LBS=F", name: "Lumber", unit: "/mbf" },
        { symbol: "GC=F", name: "Gold", unit: "/oz" },
        { symbol: "SI=F", name: "Silver", unit: "/oz" },
        { symbol: "CL=F", name: "Crude Oil", unit: "/bbl" },
        { symbol: "NG=F", name: "Nat Gas", unit: "/mmbtu" },
        { symbol: "KC=F", name: "Coffee", unit: "/lb" },
        { symbol: "SB=F", name: "Sugar", unit: "/lb" },
      ];

      const results = await Promise.allSettled(
        symbols.map(async (item) => {
          try {
            const res = await callDataApi("YahooFinance/get_stock_chart", {
              query: {
                symbol: item.symbol,
                region: "US",
                interval: "1d",
                range: "2d",
                includeAdjustedClose: false,
              },
            });
            const data = res as any;
            const meta = data?.chart?.result?.[0]?.meta;
            if (!meta) return null;
            const price: number = meta.regularMarketPrice ?? 0;
            const prevClose: number = meta.chartPreviousClose ?? meta.previousClose ?? price;
            const change = price - prevClose;
            const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
            return {
              symbol: item.symbol,
              name: item.name,
              price,
              change,
              changePercent,
              unit: item.unit,
            };
          } catch {
            return null;
          }
        })
      );

      type CommodityResult = { symbol: string; name: string; price: number; change: number; changePercent: number; unit: string };
      return results
        .filter((r): r is PromiseFulfilledResult<CommodityResult> =>
          r.status === "fulfilled" && r.value !== null
        )
        .map((r) => r.value);
    }),
  }),
});

export type AppRouter = typeof appRouter;

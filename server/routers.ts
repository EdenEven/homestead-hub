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
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
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

  // ---- Commodities Ticker (Stooq — free, no API key required) ----
  commodities: router({
    // Helper: fetch one symbol from Stooq CSV
    getPrices: publicProcedure.query(async () => {
      const symbols = [
        { symbol: "zc.f", name: "Corn", unit: "/bu" },
        { symbol: "zw.f", name: "Wheat", unit: "/bu" },
        { symbol: "zs.f", name: "Soybeans", unit: "/bu" },
        { symbol: "le.f", name: "Live Cattle", unit: "/cwt" },
        { symbol: "he.f", name: "Lean Hogs", unit: "/cwt" },
        { symbol: "gc.f", name: "Gold", unit: "/oz" },
        { symbol: "si.f", name: "Silver", unit: "/oz" },
        { symbol: "cl.f", name: "Crude Oil", unit: "/bbl" },
        { symbol: "ng.f", name: "Nat Gas", unit: "/mmbtu" },
      ];

      const fetchStooq = async (sym: string) => {
        const url = `https://stooq.com/q/l/?s=${sym}&f=sd2t2ohlcv&h&e=csv`;
        const res = await fetch(url, { headers: { "User-Agent": "A1HomesteadHub/1.0" } });
        if (!res.ok) return null;
        const text = await res.text();
        const lines = text.trim().split("\n");
        if (lines.length < 2) return null;
        const cols = lines[1].split(",");
        // CSV: Symbol,Date,Time,Open,High,Low,Close,Volume
        const open = parseFloat(cols[3]);
        const close = parseFloat(cols[6]);
        if (isNaN(close) || close === 0) return null;
        const change = close - open;
        const changePercent = open !== 0 ? (change / open) * 100 : 0;
        return { close, change, changePercent };
      };

      const results = await Promise.allSettled(
        symbols.map(async (item) => {
          try {
            const data = await fetchStooq(item.symbol);
            if (!data) return null;
            return {
              symbol: item.symbol.toUpperCase(),
              name: item.name,
              price: data.close,
              change: data.change,
              changePercent: data.changePercent,
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

    // DOW + NASDAQ + S&P 500 indices via Stooq
    getIndices: publicProcedure.query(async () => {
      const indices = [
        { symbol: "^dji", name: "DOW" },
        { symbol: "^ndx", name: "NASDAQ" },
        { symbol: "^spx", name: "S&P 500" },
      ];

      const fetchStooq = async (sym: string) => {
        const url = `https://stooq.com/q/l/?s=${encodeURIComponent(sym)}&f=sd2t2ohlcv&h&e=csv`;
        const res = await fetch(url, { headers: { "User-Agent": "A1HomesteadHub/1.0" } });
        if (!res.ok) return null;
        const text = await res.text();
        const lines = text.trim().split("\n");
        if (lines.length < 2) return null;
        const cols = lines[1].split(",");
        const open = parseFloat(cols[3]);
        const close = parseFloat(cols[6]);
        if (isNaN(close) || close === 0) return null;
        const change = close - open;
        const changePercent = open !== 0 ? (change / open) * 100 : 0;
        return { close, change, changePercent };
      };

      const results = await Promise.allSettled(
        indices.map(async (item) => {
          try {
            const data = await fetchStooq(item.symbol);
            if (!data) return null;
            return { symbol: item.symbol.toUpperCase(), name: item.name, price: data.close, change: data.change, changePercent: data.changePercent };
          } catch {
            return null;
          }
        })
      );

      type IndexResult = { symbol: string; name: string; price: number; change: number; changePercent: number };
      return results
        .filter((r): r is PromiseFulfilledResult<IndexResult> =>
          r.status === "fulfilled" && r.value !== null
        )
        .map((r) => r.value);
    }),
  }),

  // ---- Blog / From the Field ----
  blog: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getBlogPosts(input.limit ?? 20);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getBlogPostBySlug(input.slug);
        if (!post) throw new Error("Post not found");
        return post;
      }),

    create: protectedProcedure
      .input(z.object({
        slug: z.string().min(3).max(200),
        title: z.string().min(3).max(300),
        subtitle: z.string().max(400).optional(),
        author: z.string().max(100).optional(),
        category: z.string().max(100).optional(),
        content: z.string().min(10),
        excerpt: z.string().max(500).optional(),
        heroImageUrl: z.string().optional(),
        audioUrl: z.string().optional(),
        pdfUrl: z.string().optional(),
        pdfTitle: z.string().max(200).optional(),
        tags: z.string().optional(),
        isFree: z.boolean().default(true),
        isPublished: z.boolean().default(true),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        await createBlogPost(input);
        return { success: true };
      }),
  }),

  // ---- Weather (NOAA — no API key required) ----
  weather: router({
    // Get NOAA grid point from lat/lon
    getGridPoint: publicProcedure
      .input(z.object({ lat: z.number(), lon: z.number() }))
      .query(async ({ input }) => {
        const res = await fetch(
          `https://api.weather.gov/points/${input.lat.toFixed(4)},${input.lon.toFixed(4)}`,
          { headers: { "User-Agent": "A1HomesteadHub/1.0 (a1homesteadhub.com)" } }
        );
        if (!res.ok) throw new Error("NOAA grid point lookup failed");
        const data = await res.json() as any;
        const props = data.properties;
        return {
          forecastUrl: props.forecast as string,
          hourlyUrl: props.forecastHourly as string,
          countyZone: props.county as string,
          city: props.relativeLocation?.properties?.city as string,
          state: props.relativeLocation?.properties?.state as string,
        };
      }),

    // Get 7-day forecast from NOAA forecast URL
    getForecast: publicProcedure
      .input(z.object({ forecastUrl: z.string().url() }))
      .query(async ({ input }) => {
        const res = await fetch(input.forecastUrl, {
          headers: { "User-Agent": "A1HomesteadHub/1.0 (a1homesteadhub.com)" },
        });
        if (!res.ok) throw new Error("NOAA forecast fetch failed");
        const data = await res.json() as any;
        const periods = data.properties?.periods ?? [];
        return periods.slice(0, 14).map((p: any) => ({
          name: p.name as string,
          temperature: p.temperature as number,
          temperatureUnit: p.temperatureUnit as string,
          shortForecast: p.shortForecast as string,
          detailedForecast: p.detailedForecast as string,
          windSpeed: p.windSpeed as string,
          windDirection: p.windDirection as string,
          icon: p.icon as string,
          isDaytime: p.isDaytime as boolean,
          probabilityOfPrecipitation: p.probabilityOfPrecipitation?.value as number | null,
        }));
      }),

    // Get active weather alerts for a county zone
    getAlerts: publicProcedure
      .input(z.object({ lat: z.number(), lon: z.number() }))
      .query(async ({ input }) => {
        const res = await fetch(
          `https://api.weather.gov/alerts/active?point=${input.lat.toFixed(4)},${input.lon.toFixed(4)}&status=actual`,
          { headers: { "User-Agent": "A1HomesteadHub/1.0 (a1homesteadhub.com)" } }
        );
        if (!res.ok) return [];
        const data = await res.json() as any;
        const features = data.features ?? [];
        return features.slice(0, 20).map((f: any) => ({
          id: f.id as string,
          event: f.properties.event as string,
          headline: f.properties.headline as string,
          severity: f.properties.severity as string,
          urgency: f.properties.urgency as string,
          description: f.properties.description as string,
          instruction: f.properties.instruction as string,
          effective: f.properties.effective as string,
          expires: f.properties.expires as string,
          areaDesc: f.properties.areaDesc as string,
        }));
      }),

    // Get nationwide active alerts (for the alert ticker)
    getNationwideAlerts: publicProcedure.query(async () => {
      const res = await fetch(
        "https://api.weather.gov/alerts/active",
        { headers: { "User-Agent": "A1HomesteadHub/1.0 (a1homesteadhub.com)" } }
      );
      if (!res.ok) return [];
      const data = await res.json() as any;
      const features = data.features ?? [];
      return features.slice(0, 50).map((f: any) => ({
        id: f.id as string,
        event: f.properties.event as string,
        headline: f.properties.headline as string,
        severity: f.properties.severity as string,
        areaDesc: f.properties.areaDesc as string,
        effective: f.properties.effective as string,
        expires: f.properties.expires as string,
      }));
    }),
  }),
});

export type AppRouter = typeof appRouter;

import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  addEmailSubscriber,
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
  getActiveAnnouncement,
  createAnnouncement,
  clearAnnouncement,
  savePushSubscription,
  deletePushSubscription,
} from "./db";
import { callDataApi } from "./_core/dataApi";
import { storagePut } from "./storage";

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
        const systemPrompt = `You are the Homestead Hub AI Assistant — a knowledgeable, friendly, and practical guide for self-reliant living and homesteading. You help people with general topics including:

- Butchering and meat processing (livestock and wild game) — general technique and process questions
- General foraging education: seasons, regions, ethics of wild harvest, how to use field guides
- Building structures, fences, barns, and off-grid shelters
- Gardening: planting calendars, companion planting, soil health, seed saving
- Hunting and gaming: seasons, licensing, field dressing, ethical harvest
- Animal husbandry: chickens, goats, pigs, cattle — care, breeding, health
- Water systems: rainwater collection, well drilling, filtration, gray water
- Solar energy: small-scale solar setup, battery banks, off-grid power
- Land access: land trusts, conservation programs, agricultural land
- Barter and trade in resilient local economies
- Community building and connecting with other homesteaders

=== ABSOLUTE SAFETY RULES — NEVER VIOLATE THESE ===

1. PLANT AND MUSHROOM IDENTIFICATION: You must NEVER attempt to identify a specific wild plant, mushroom, or fungus from a description, photo description, or any other input. Misidentification of wild plants and mushrooms can cause serious injury or death. If anyone asks you to identify a plant or mushroom, you must respond with this exact message:

   "I'm not able to identify specific wild plants or mushrooms — this is a firm safety boundary, not a limitation I can work around. Misidentification can be fatal. For plant and mushroom ID, please consult a certified local naturalist, a regional field guide specific to your area, or take a hands-on foraging class with an expert. I'm happy to discuss general foraging principles, seasons, and ethics instead."

2. FOOD PRESERVATION SAFETY (CANNING, BOTULISM RISK): You must NEVER provide specific processing times, pressure levels, pH requirements, or safety parameters for home canning — especially for low-acid foods (meats, vegetables, beans, fish). These values are life-critical and must come only from tested, authoritative sources. If anyone asks for canning safety specifics, you must respond with:

   "For canning safety — especially processing times, pressure levels, and low-acid foods — I always defer to the authoritative tested sources: the USDA Complete Guide to Home Canning (free at nchfp.uga.edu) and the Ball Blue Book. Botulism from improperly canned food is odorless, tasteless, and can be fatal. Please do not rely on AI or internet recipes for these specifics. I'm happy to discuss general canning concepts, equipment, or point you to the right USDA resource."

3. MEDICAL AND VETERINARY ADVICE: You must NEVER diagnose illness in humans or animals, recommend specific medications or dosages, or advise on treating serious injuries. Always recommend consulting a licensed professional.

4. LEGAL ADVICE: You must NEVER provide specific legal advice on land rights, hunting regulations, or other legal matters. Always recommend consulting the relevant state agency or a licensed attorney.

=== END SAFETY RULES ===

For all other topics, you give practical, no-nonsense advice grounded in real homesteading experience. You are encouraging, clear, and never condescending. Keep answers focused and actionable. You speak like a trusted neighbor who has been homesteading for 20 years — one who knows when to say "go ask an expert" and means it.`;

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

  // ---- Email List / Community Signup ----
  community: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        firstName: z.string().max(100).optional(),
        source: z.string().max(100).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          await addEmailSubscriber({
            email: input.email.toLowerCase().trim(),
            firstName: input.firstName?.trim(),
            source: input.source || "welcome-popup",
          });
          return { success: true, message: "Welcome to the community!" };
        } catch (err: any) {
          // Duplicate email — treat as success so we don't leak info
          if (err?.message?.includes("Duplicate") || err?.code === "ER_DUP_ENTRY") {
            return { success: true, message: "You're already on the list!" };
          }
          throw err;
        }
      }),
  }),

  // ---- Profiles ----
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getProfileByUserId(ctx.user.id);
      return profile ?? null;
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
        avatarUrl: z.string().url().optional().or(z.literal("")),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await upsertProfile({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    uploadAvatar: protectedProcedure
      .input(z.object({
        // base64-encoded image data
        dataBase64: z.string(),
        mimeType: z.string().regex(/^image\/(jpeg|png|webp|gif)$/),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        if (buffer.byteLength > 5 * 1024 * 1024) {
          throw new Error("Avatar image must be under 5 MB");
        }
        const ext = input.mimeType.split("/")[1];
        const key = `avatars/user-${ctx.user.id}-${Date.now()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        // Save to profile immediately
        await upsertProfile({ userId: ctx.user.id, avatarUrl: url });
        return { avatarUrl: url };
      }),
  }),

  // ---- Barter & Trade ----
  barter: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => {
        return getBarterListings(input.category);
      }),

    // Anyone can post — no login required (guest posting with optional email)
    create: publicProcedure
      .input(z.object({
        title: z.string().min(3).max(200),
        offering: z.string().min(3).max(1000),
        seeking: z.string().min(3).max(1000),
        category: z.enum([
          "food-produce", "skills-labor", "animals-livestock",
          "seeds-plants", "tools-equipment", "goods-crafts", "land-space", "other"
        ]),
        location: z.string().max(200).optional(),
        state: z.string().max(50).optional(),
        posterName: z.string().max(100).optional(),
        posterEmail: z.string().email().max(320).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // If logged in, use their user ID; otherwise use 0 as guest
        const userId = (ctx as any).user?.id ?? 0;
        await createBarterListing({
          userId,
          title: input.title,
          description: `${input.offering} | Seeking: ${input.seeking}`,
          offering: input.offering,
          seeking: input.seeking,
          category: input.category,
          location: input.location,
          state: input.state,
          posterName: input.posterName,
          posterEmail: input.posterEmail,
          offeringType: "offer",
          isActive: true,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const isAdmin = ctx.user.role === "admin";
        await deleteBarterListing(input.id, ctx.user.id, isAdmin);
        return { success: true };
      }),
  }),

  // ---- Commodities Ticker (Stooq — free, no API key required) ----
  commodities: router({
    // Helper: fetch one symbol from Stooq CSV
    getPrices: publicProcedure.query(async () => {
      const symbols = [
        { symbol: "zc.f", name: "Corn", unit: "/bu", divisor: 1 },
        { symbol: "zw.f", name: "Wheat", unit: "/bu", divisor: 1 },
        { symbol: "zs.f", name: "Soybeans", unit: "/bu", divisor: 1 },
        { symbol: "le.f", name: "Live Cattle", unit: "/cwt", divisor: 1 },
        { symbol: "he.f", name: "Lean Hogs", unit: "/cwt", divisor: 1 },
        { symbol: "gc.f", name: "Gold", unit: "/oz", divisor: 1 },
        // Stooq reports silver futures (SI.F) in cents per troy oz — divide by 100 to get dollars
        { symbol: "si.f", name: "Silver", unit: "/oz", divisor: 100 },
        { symbol: "cl.f", name: "Crude Oil", unit: "/bbl", divisor: 1 },
        { symbol: "ng.f", name: "Nat Gas", unit: "/mmbtu", divisor: 1 },
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
            const d = item.divisor ?? 1;
            return {
              symbol: item.symbol.toUpperCase(),
              name: item.name,
              price: data.close / d,
              change: data.change / d,
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

<<<<<<< Updated upstream
  // ---- ElevenLabs Text-to-Speech ----
  // Proxies TTS requests through the server so the API key stays secure.
  // Affiliate link: https://try.elevenlabs.io/lhgu4tpm0stc
  tts: router({
    speak: publicProcedure
      .input(z.object({
        text: z.string().min(1).max(5000),
        voiceId: z.string().default("EXAVITQu4vr4xnSDxMaL"), // Sarah — clear, reassuring
        modelId: z.string().default("eleven_flash_v2_5"),    // Flash: low latency
      }))
      .mutation(async ({ input, ctx }) => {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
          throw new Error("ElevenLabs API key not configured on server.");
        }

        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${input.voiceId}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              "Content-Type": "application/json",
              "Accept": "audio/mpeg",
            },
            body: JSON.stringify({
              text: input.text,
              model_id: input.modelId,
              voice_settings: {
                stability: 0.50,
                similarity_boost: 0.80,
                style: 0.20,
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`ElevenLabs API error ${response.status}: ${errBody}`);
        }

        // Convert audio buffer to base64 so it can be sent over tRPC JSON
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString("base64");

        return {
          audioBase64: base64Audio,
          mimeType: "audio/mpeg" as const,
          voiceId: input.voiceId,
          affiliateLink: "https://try.elevenlabs.io/lhgu4tpm0stc",
        };
=======
  // ---- Notifications ----
  notifications: router({
    // Get the current active sitewide announcement (public)
    getAnnouncement: publicProcedure.query(async () => {
      return getActiveAnnouncement();
    }),

    // Admin: set a new sitewide announcement
    setAnnouncement: protectedProcedure
      .input(z.object({
        message: z.string().min(1).max(500),
        linkUrl: z.string().optional(),
        linkText: z.string().max(100).optional(),
        type: z.enum(["info", "success", "warning", "alert"]).default("info"),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        await createAnnouncement({
          message: input.message,
          linkUrl: input.linkUrl ?? null,
          linkText: input.linkText ?? null,
          type: input.type,
          isActive: true,
          createdBy: ctx.user.id,
        });
        return { success: true };
      }),

    // Admin: clear/dismiss the sitewide announcement
    clearAnnouncement: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin only");
      await clearAnnouncement();
      return { success: true };
    }),

    // Save a browser push subscription
    subscribePush: publicProcedure
      .input(z.object({
        endpoint: z.string(),
        p256dh: z.string(),
        auth: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await savePushSubscription({
          endpoint: input.endpoint,
          p256dh: input.p256dh,
          auth: input.auth,
          userId: ctx.user?.id ?? null,
        });
        return { success: true };
      }),

    // Unsubscribe from push notifications
    unsubscribePush: publicProcedure
      .input(z.object({ endpoint: z.string() }))
      .mutation(async ({ input }) => {
        await deletePushSubscription(input.endpoint);
        return { success: true };
>>>>>>> Stashed changes
      }),
  }),
});
export type AppRouter = typeof appRouter;

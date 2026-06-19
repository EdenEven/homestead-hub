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
  getSchoolCourses,
  getSchoolCourseById,
  createSchoolCourse,
  updateSchoolCourse,
  deleteSchoolCourse,
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  getQuizByLessonId,
  getQuizQuestions,
  createQuiz,
  createQuizQuestion,
  getStudentsByParent,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getLessonProgress,
  markLessonComplete,
  getGradesByStudent,
  createGradeEntry,
  deleteGradeEntry,
  createStudyGuide,
  getStudyGuidesByCourse,
  getStudyGuideById,
  deleteStudyGuide,
  getTutorSession,
  upsertTutorSession,
  isUserPro,
  getProSubscription,
  upsertProSubscription,
  saveElevenLabsKey,
  getElevenLabsKey,
  clearElevenLabsKey,
  getLatestSkillTip,
  getSkillTips,
  getHomesteadFeed,
  getCourseExpansions,
  createPartnerApplication,
  getPartnerApplications,
  updatePartnerApplicationStatus,
  getUpcomingEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addToOfflineKitWaitlist,
  getOfflineKitWaitlist,
  getSiteStats,
  getSocialQueueItems,
  createSocialQueueItem,
  updateSocialQueueItem,
  deleteSocialQueueItem,
  getSocialQueueItemById,
} from "./db";
import { skills as serverSkills, renderSkillToMarkdown } from "./skillsData";
import { notifyOwner } from "./_core/notification";
import { sendWelcomeEmail, sendPartnerApplicationEmail } from "./email";
import { callDataApi } from "./_core/dataApi";
import { storagePut } from "./storage";
import { sendPushToAll } from "./webpush";
import { transcribeAudio } from "./_core/voiceTranscription";
import { generateImage } from "./_core/imageGeneration";
import { TRPCError } from "@trpc/server";
import { socialQueueRouter } from "./routers/socialQueue";
import Stripe from "stripe";

export const appRouter = router({
  system: systemRouter,

  // ---- Stripe Checkout ----
  stripe: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({
        billingPeriod: z.enum(["monthly", "yearly"]),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      }))
      .mutation(async ({ ctx, input }) => {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) throw new Error("Stripe is not configured.");

        // Resolve price ID server-side so keys never touch the browser
        const priceId = input.billingPeriod === "monthly"
          ? process.env.STRIPE_PRICE_PRO_MONTHLY
          : process.env.STRIPE_PRICE_PRO_YEARLY;

        if (!priceId) {
          throw new Error(`Stripe price ID for ${input.billingPeriod} plan is not configured. Please set STRIPE_PRICE_PRO_${input.billingPeriod.toUpperCase()} in your environment.`);
        }

        const stripeClient = new Stripe(stripeSecretKey, {
          apiVersion: "2026-02-25.clover" as any,
        });
        const session = await stripeClient.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          metadata: { user_id: String(ctx.user.id) },
        });
        return { url: session.url };
      }),
  }),

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
          // Send welcome email — fire-and-forget, don't block the response
          sendWelcomeEmail(input.email.toLowerCase().trim(), input.firstName).catch(
            (e) => console.error("[Email] Welcome email failed:", e)
          );
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
        // Notify push subscribers about the new barter listing (fire-and-forget)
        sendPushToAll({
          title: "New Barter Listing on A1 Homestead Hub",
          body: input.title,
          url: "https://a1homesteadhub.com/barter",
        }).catch((e) => console.warn("[Push] barter notification failed:", e));
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
    // Commodity futures via Yahoo Finance Data API
    getPrices: publicProcedure.query(async () => {
      const symbols = [
        { symbol: "ZC=F", name: "Corn", unit: "/bu" },
        { symbol: "ZW=F", name: "Wheat", unit: "/bu" },
        { symbol: "ZS=F", name: "Soybeans", unit: "/bu" },
        { symbol: "LE=F", name: "Live Cattle", unit: "/cwt" },
        { symbol: "HE=F", name: "Lean Hogs", unit: "/cwt" },
        { symbol: "GC=F", name: "Gold", unit: "/oz" },
        { symbol: "SI=F", name: "Silver", unit: "/oz" },
        { symbol: "CL=F", name: "Crude Oil", unit: "/bbl" },
        { symbol: "NG=F", name: "Nat Gas", unit: "/mmbtu" },
      ];

      const fetchYahoo = async (sym: string) => {
        try {
          const res = await callDataApi("YahooFinance/get_stock_chart", {
            query: { symbol: sym, region: "US", interval: "1d", range: "5d" },
          }) as any;
          const result = res?.chart?.result?.[0];
          if (!result) return null;
          const meta = result.meta;
          const price = meta?.regularMarketPrice;
          const prevClose = meta?.chartPreviousClose ?? meta?.previousClose;
          if (!price || !prevClose) return null;
          const change = price - prevClose;
          const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
          return { price, change, changePercent };
        } catch {
          return null;
        }
      };

      const results = await Promise.allSettled(
        symbols.map(async (item) => {
          const data = await fetchYahoo(item.symbol);
          if (!data) return null;
          return {
            symbol: item.symbol,
            name: item.name,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            unit: item.unit,
          };
        })
      );

      type CommodityResult = { symbol: string; name: string; price: number; change: number; changePercent: number; unit: string };
      return results
        .filter((r): r is PromiseFulfilledResult<CommodityResult> =>
          r.status === "fulfilled" && r.value !== null
        )
        .map((r) => r.value);
    }),

    // DOW + NASDAQ + S&P 500 indices via Yahoo Finance Data API
    getIndices: publicProcedure.query(async () => {
      const indices = [
        { symbol: "^DJI", name: "DOW" },
        { symbol: "^IXIC", name: "NASDAQ" },
        { symbol: "^GSPC", name: "S&P 500" },
      ];

      const fetchYahoo = async (sym: string) => {
        try {
          const res = await callDataApi("YahooFinance/get_stock_chart", {
            query: { symbol: sym, region: "US", interval: "1d", range: "5d" },
          }) as any;
          const result = res?.chart?.result?.[0];
          if (!result) return null;
          const meta = result.meta;
          const price = meta?.regularMarketPrice;
          const prevClose = meta?.chartPreviousClose ?? meta?.previousClose;
          if (!price || !prevClose) return null;
          const change = price - prevClose;
          const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
          return { price, change, changePercent };
        } catch {
          return null;
        }
      };

      const results = await Promise.allSettled(
        indices.map(async (item) => {
          const data = await fetchYahoo(item.symbol);
          if (!data) return null;
          return { symbol: item.symbol, name: item.name, price: data.price, change: data.change, changePercent: data.changePercent };
        })
      );

      type IndexResult = { symbol: string; name: string; price: number; change: number; changePercent: number };
      return results
        .filter((r): r is PromiseFulfilledResult<IndexResult> =>
          r.status === "fulfilled" && r.value !== null
        )
        .map((r) => r.value);
    }),

    // Historical OHLC data for a given symbol and range
    getHistory: publicProcedure
      .input(z.object({
        symbol: z.string(),
        range: z.enum(["1W", "1M", "3M", "1Y"]),
      }))
      .query(async ({ input }) => {
        const rangeMap: Record<string, { range: string; interval: string }> = {
          "1W": { range: "5d",  interval: "1h" },
          "1M": { range: "1mo", interval: "1d" },
          "3M": { range: "3mo", interval: "1d" },
          "1Y": { range: "1y",  interval: "1wk" },
        };
        const { range, interval } = rangeMap[input.range];
        const res = await callDataApi("YahooFinance/get_stock_chart", {
          query: { symbol: input.symbol, region: "US", interval, range },
        }) as any;
        const result = res?.chart?.result?.[0];
        if (!result) return { symbol: input.symbol, points: [], meta: null };
        const meta = result.meta;
        const timestamps: number[] = result.timestamp ?? [];
        const quotes = result.indicators?.quote?.[0] ?? {};
        const points = timestamps.map((ts: number, i: number) => ({
          ts: ts * 1000,
          open:  quotes.open?.[i]  ?? null,
          high:  quotes.high?.[i]  ?? null,
          low:   quotes.low?.[i]   ?? null,
          close: quotes.close?.[i] ?? null,
          volume: quotes.volume?.[i] ?? null,
        })).filter((p: any) => p.close !== null);
        return {
          symbol: input.symbol,
          name: meta?.longName ?? meta?.shortName ?? input.symbol,
          currency: meta?.currency ?? "USD",
          currentPrice: meta?.regularMarketPrice ?? null,
          prevClose: meta?.chartPreviousClose ?? null,
          points,
        };
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

  // ---- ElevenLabs BYOK Key Management ----
  // Users bring their own ElevenLabs API key (via affiliate link) for Pro voice features.
  // Keys are stored server-side and never exposed to the browser.
  elevenLabs: router({
    // Save or update the user's ElevenLabs API key (validates before saving)
    saveKey: protectedProcedure
      .input(z.object({ key: z.string().min(10).max(255) }))
      .mutation(async ({ ctx, input }) => {
        // Validate the key with a minimal TTS call before saving
        const testResponse = await fetch(
          "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
          {
            method: "POST",
            headers: {
              "xi-api-key": input.key,
              "Content-Type": "application/json",
              "Accept": "audio/mpeg",
            },
            body: JSON.stringify({
              text: "Hi",
              model_id: "eleven_flash_v2_5",
              voice_settings: { stability: 0.5, similarity_boost: 0.8 },
            }),
          }
        );
        if (!testResponse.ok) {
          if (testResponse.status === 401) {
            throw new Error("Invalid API key — please check and try again.");
          }
          throw new Error(`ElevenLabs returned ${testResponse.status} — please try again.`);
        }
        await saveElevenLabsKey(ctx.user.id, input.key);
        return { success: true };
      }),

    // Check if the current user has a key saved (returns boolean, not the key itself)
    hasKey: protectedProcedure.query(async ({ ctx }) => {
      const key = await getElevenLabsKey(ctx.user.id);
      return { hasKey: !!key };
    }),

    // Remove the saved key
    removeKey: protectedProcedure.mutation(async ({ ctx }) => {
      await clearElevenLabsKey(ctx.user.id);
      return { success: true };
    }),

    // TTS using the user's own key (Pro feature)
    speak: protectedProcedure
      .input(z.object({
        text: z.string().min(1).max(5000),
        voiceId: z.string().default("EXAVITQu4vr4xnSDxMaL"), // Sarah — warm, clear
        modelId: z.string().default("eleven_flash_v2_5"),    // Flash: ultra-low latency
      }))
      .mutation(async ({ ctx, input }) => {
        const apiKey = await getElevenLabsKey(ctx.user.id);
        if (!apiKey) {
          throw new Error("NO_KEY"); // Frontend catches this to show setup modal
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
          if (response.status === 401) throw new Error("INVALID_KEY");
          throw new Error(`ElevenLabs API error ${response.status}: ${errBody}`);
        }
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString("base64");
        return {
          audioBase64: base64Audio,
          mimeType: "audio/mpeg" as const,
          voiceId: input.voiceId,
        };
      }),
  }),

  // ---- ElevenLabs Text-to-Speech (legacy public route for blog/skills audio player) ----
  tts: router({
    speak: publicProcedure
      .input(z.object({
        text: z.string().min(1).max(5000),
        voiceId: z.string().default("EXAVITQu4vr4xnSDxMaL"),
        modelId: z.string().default("eleven_flash_v2_5"),
      }))
      .mutation(async ({ input }) => {
        const apiKey = process.env.Eleven_Labs_Api_key;
        if (!apiKey) throw new Error("ElevenLabs API key not configured on server.");
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
              voice_settings: { stability: 0.50, similarity_boost: 0.80, style: 0.20, use_speaker_boost: true },
            }),
          }
        );
        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`ElevenLabs API error ${response.status}: ${errBody}`);
        }
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString("base64");
        return { audioBase64: base64Audio, mimeType: "audio/mpeg" as const, voiceId: input.voiceId, affiliateLink: "https://try.elevenlabs.io/lhgu4tpm0stc" };
      }),
  }),

  // ---- Voice Transcription (Whisper) ----
  voice: router({
    /**
     * Upload a base64-encoded audio blob to S3 and return the URL.
     * Called first; then the URL is passed to `transcribe`.
     */
    uploadAudio: protectedProcedure
      .input(
        z.object({
          dataBase64: z.string(),
          mimeType: z.enum(["audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        if (buffer.byteLength > 16 * 1024 * 1024) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Audio must be under 16 MB" });
        }
        const ext = input.mimeType.split("/")[1].split(";")[0]; // e.g. "webm"
        const key = `voice-qa/user-${ctx.user.id}-${Date.now()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        return { audioUrl: url };
      }),

    /**
     * Transcribe an audio file URL to text using Whisper.
     * The client uploads audio to S3 first, then passes the URL here.
     * Protected so only logged-in users can call it.
     */
    transcribe: protectedProcedure
      .input(
        z.object({
          audioUrl: z.string().url(),
          language: z.string().optional(),
          prompt: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: input.language,
          prompt: input.prompt ?? "Transcribe the homesteader's question accurately.",
        });
        if ("error" in result) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
        }
        return { text: result.text, language: result.language, duration: result.duration };
      }),
  }),

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
      }),
  }),

  // ---- The Schoolhouse ----
  schoolhouse: router({
    // Courses
    getCourses: publicProcedure.query(async () => {
      return getSchoolCourses();
    }),

    getCourse: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getSchoolCourseById(input.id);
      }),

    createCourse: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(300),
        description: z.string().min(1),
        subject: z.string().min(1).max(100),
        gradeMin: z.number().min(0).max(12),
        gradeMax: z.number().min(0).max(12),
        coverImageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await createSchoolCourse({
          ...input,
          coverImageUrl: input.coverImageUrl ?? null,
          createdBy: ctx.user.id,
          isPrebuilt: false,
          isPublished: true,
        });
        return { id };
      }),

    updateCourse: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(300).optional(),
        description: z.string().optional(),
        subject: z.string().optional(),
        gradeMin: z.number().min(0).max(12).optional(),
        gradeMax: z.number().min(0).max(12).optional(),
        coverImageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateSchoolCourse(id, data);
        return { success: true };
      }),

    deleteCourse: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteSchoolCourse(input.id);
        return { success: true };
      }),

    // Lessons
    getLessons: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return getLessonsByCourse(input.courseId);
      }),

    getLesson: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getLessonById(input.id);
      }),

    createLesson: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string().min(1).max(300),
        objective: z.string().optional(),
        content: z.string().optional(),
        videoUrl: z.string().optional(),
        materials: z.string().optional(),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        const id = await createLesson({
          ...input,
          objective: input.objective ?? null,
          content: input.content ?? null,
          videoUrl: input.videoUrl ?? null,
          materials: input.materials ?? null,
        });
        return { id };
      }),

    updateLesson: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        objective: z.string().optional(),
        content: z.string().optional(),
        videoUrl: z.string().optional(),
        materials: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateLesson(id, data);
        return { success: true };
      }),

    deleteLesson: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteLesson(input.id);
        return { success: true };
      }),

    // Quiz
    getQuiz: publicProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input }) => {
        const quiz = await getQuizByLessonId(input.lessonId);
        if (!quiz) return null;
        const questions = await getQuizQuestions(quiz.id);
        return { ...quiz, questions };
      }),

    createQuiz: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        title: z.string().min(1).max(300),
        questions: z.array(z.object({
          question: z.string().min(1),
          optionA: z.string().min(1),
          optionB: z.string().min(1),
          optionC: z.string().optional(),
          optionD: z.string().optional(),
          correctAnswer: z.enum(["A", "B", "C", "D"]),
          sortOrder: z.number().default(0),
        })),
      }))
      .mutation(async ({ input }) => {
        const quizId = await createQuiz({ lessonId: input.lessonId, title: input.title });
        for (const q of input.questions) {
          await createQuizQuestion({
            quizId,
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC ?? null,
            optionD: q.optionD ?? null,
            correctAnswer: q.correctAnswer,
            sortOrder: q.sortOrder,
          });
        }
        return { quizId };
      }),

    // Students
    getStudents: protectedProcedure.query(async ({ ctx }) => {
      return getStudentsByParent(ctx.user.id);
    }),

    createStudent: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        gradeLevel: z.number().min(0).max(12),
        avatarUrl: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await createStudent({
          parentUserId: ctx.user.id,
          name: input.name,
          gradeLevel: input.gradeLevel,
          avatarUrl: input.avatarUrl ?? null,
          notes: input.notes ?? null,
        });
        return { id };
      }),

    updateStudent: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        gradeLevel: z.number().min(0).max(12).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const student = await getStudentById(input.id);
        if (!student || student.parentUserId !== ctx.user.id) throw new Error("Not authorized");
        const { id, ...data } = input;
        await updateStudent(id, data);
        return { success: true };
      }),

    deleteStudent: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const student = await getStudentById(input.id);
        if (!student || student.parentUserId !== ctx.user.id) throw new Error("Not authorized");
        await deleteStudent(input.id);
        return { success: true };
      }),

    // Progress
    getProgress: protectedProcedure
      .input(z.object({ studentId: z.number(), courseId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const student = await getStudentById(input.studentId);
        if (!student || student.parentUserId !== ctx.user.id) throw new Error("Not authorized");
        return getLessonProgress(input.studentId, input.courseId);
      }),

    markComplete: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        lessonId: z.number(),
        quizScore: z.number().min(0).max(100).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const student = await getStudentById(input.studentId);
        if (!student || student.parentUserId !== ctx.user.id) throw new Error("Not authorized");
        await markLessonComplete({
          studentId: input.studentId,
          lessonId: input.lessonId,
          isCompleted: true,
          quizScore: input.quizScore ?? null,
          completedAt: new Date(),
        });
        return { success: true };
      }),

    // Grades
    getGrades: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ ctx, input }) => {
        const student = await getStudentById(input.studentId);
        if (!student || student.parentUserId !== ctx.user.id) throw new Error("Not authorized");
        return getGradesByStudent(input.studentId);
      }),

    addGrade: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        courseId: z.number(),
        subject: z.string().min(1).max(100),
        assignmentTitle: z.string().min(1).max(300),
        grade: z.string().min(1).max(10),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const student = await getStudentById(input.studentId);
        if (!student || student.parentUserId !== ctx.user.id) throw new Error("Not authorized");
        await createGradeEntry({
          studentId: input.studentId,
          courseId: input.courseId,
          subject: input.subject,
          assignmentTitle: input.assignmentTitle,
          grade: input.grade,
          notes: input.notes ?? null,
        });
        return { success: true };
      }),

    deleteGrade: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteGradeEntry(input.id);
        return { success: true };
      }),

    // ---- Study Guides ----

    generateStudyGuide: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        studentId: z.number().optional(),
        gradeLevel: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Fetch course and its lessons
        const course = await getSchoolCourseById(input.courseId);
        if (!course) throw new Error("Course not found");
        const lessons = await getLessonsByCourse(input.courseId);

        const gradeLabel = input.gradeLevel
          ? `Grade ${input.gradeLevel}`
          : course.gradeMin && course.gradeMax
            ? `Grades ${course.gradeMin}–${course.gradeMax}`
            : "All grades";

        const lessonSummaries = lessons
          .map((l, i) => `Lesson ${i + 1}: ${l.title}\n${l.content?.slice(0, 400) ?? ""}...`)
          .join("\n\n");

        const prompt = `You are an expert homeschool curriculum designer. Create a comprehensive, engaging study guide for the following course.

Course: ${course.title}
Subject: ${course.subject}
Grade Level: ${gradeLabel}
Description: ${course.description}

Lessons covered:
${lessonSummaries}

Create a study guide in Markdown format that includes:
1. **Course Overview** — a brief, encouraging introduction for the student
2. **Key Vocabulary** — 8–12 important terms with clear, age-appropriate definitions
3. **Core Concepts** — the main ideas from each lesson, explained clearly
4. **Study Questions** — 10 review questions (mix of recall, comprehension, and application)
5. **Hands-On Activities** — 3–5 practical activities the student can do at home on the homestead
6. **Further Exploration** — 3 suggestions for going deeper (books, experiments, real-world practice)
7. **Quick Reference Checklist** — a checklist of skills/concepts the student should be able to demonstrate

Write in a warm, encouraging tone appropriate for ${gradeLabel}. Use the homestead context throughout — connect concepts to real farm and self-reliant living skills.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are an expert homeschool curriculum designer specializing in homesteading, STEM, and self-reliant living education. Always write in Markdown format." },
            { role: "user", content: prompt },
          ],
        });

        const rawContent = response.choices[0]?.message?.content ?? "";
        const content = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
        const title = `Study Guide: ${course.title} (${gradeLabel})`;

        const id = await createStudyGuide({
          courseId: input.courseId,
          studentId: input.studentId ?? null,
          createdByUserId: ctx.user.id,
          title,
          content,
          gradeLevel: input.gradeLevel ?? null,
        });

        return { id, title, content };
      }),

    getStudyGuides: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getStudyGuidesByCourse(input.courseId, ctx.user.id);
      }),

    getStudyGuide: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const guide = await getStudyGuideById(input.id);
        if (!guide || guide.createdByUserId !== ctx.user.id) throw new Error("Not found");
        return guide;
      }),

    deleteStudyGuide: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteStudyGuide(input.id, ctx.user.id);
        return { success: true };
      }),

    generateCourse: protectedProcedure
      .input(z.object({
        prompt: z.string().min(10).max(1000),
        gradeLevel: z.string().optional(),
        subject: z.string().optional(),
        lessonCount: z.number().min(2).max(10).default(5),
      }))
      .mutation(async ({ ctx, input }) => {
        const gradeLabel = input.gradeLevel ?? "K-8";
        const subjectLabel = input.subject ?? "Homesteading & STEM";
        const systemPrompt = `You are an expert homeschool curriculum designer specializing in homesteading, self-reliant living, and STEM education. You create engaging, practical, hands-on courses for homeschool families. Always respond with valid JSON only — no markdown fences, no extra text.`;
        const userPrompt = `Create a complete homeschool course based on this description:
"${input.prompt}"

Grade Level: ${gradeLabel}
Subject Area: ${subjectLabel}
Number of Lessons: ${input.lessonCount}

Return a JSON object with this exact structure:
{
  "title": "Course title (concise, engaging)",
  "description": "2-3 sentence course overview for parents",
  "gradeRange": "e.g. Grades 3-6",
  "subject": "subject category",
  "estimatedWeeks": 4,
  "lessons": [
    {
      "title": "Lesson title",
      "content": "Full lesson in Markdown (400-600 words). Include: learning objectives, key concepts, real homestead examples, hands-on activity, and a fun fact.",
      "sortOrder": 1,
      "quiz": {
        "title": "Quiz title",
        "questions": [
          {
            "question": "Question text?",
            "optionA": "Option A",
            "optionB": "Option B",
            "optionC": "Option C",
            "optionD": "Option D",
            "correctAnswer": "A",
            "explanation": "Why this is correct"
          }
        ]
      }
    }
  ]
}

Each lesson must have exactly 3 quiz questions. Make content practical, warm, and grounded in real homestead skills.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });

        const rawContent = response.choices[0]?.message?.content ?? "{}";
        const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
        // Strip markdown fences if present
        const cleaned = contentStr.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
        let courseData: any;
        try {
          courseData = JSON.parse(cleaned);
        } catch {
          throw new Error("AI returned invalid JSON. Please try again.");
        }

        // Parse gradeLevel string (e.g. "K-2", "3-5", "9-12") into gradeMin/gradeMax integers
        // K=0, 1st=1 ... 12th=12
        const parseGradeRange = (gl: string): { gradeMin: number; gradeMax: number } => {
          const parts = gl.replace(/[^0-9K\-]/gi, "").split("-");
          const toInt = (s: string) => s.toUpperCase() === "K" ? 0 : parseInt(s, 10) || 0;
          const min = toInt(parts[0] ?? "0");
          const max = parts.length > 1 ? toInt(parts[1]) : min;
          return { gradeMin: Math.min(min, max), gradeMax: Math.max(min, max) };
        };
        const { gradeMin, gradeMax } = parseGradeRange(gradeLabel);

        const courseId = await createSchoolCourse({
          title: courseData.title,
          description: courseData.description,
          gradeMin,
          gradeMax,
          subject: courseData.subject ?? subjectLabel,
          isPublished: false,
          createdBy: ctx.user.id,
        });

        for (const lesson of (courseData.lessons ?? [])) {
          const lessonId = await createLesson({
            courseId,
            title: lesson.title,
            content: lesson.content,
            videoUrl: null,
            sortOrder: lesson.sortOrder ?? 1,
          });
          if (lesson.quiz && Array.isArray(lesson.quiz.questions) && lesson.quiz.questions.length > 0) {
            const quizId = await createQuiz({ lessonId, title: lesson.quiz.title ?? `Quiz: ${lesson.title}` });
            for (const q of lesson.quiz.questions) {
              await createQuizQuestion({
                quizId,
                question: q.question,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC ?? null,
                optionD: q.optionD ?? null,
                correctAnswer: q.correctAnswer,
                sortOrder: 1,
              });
            }
          }
        }

        return {
          courseId,
          title: courseData.title,
          description: courseData.description,
          lessonCount: (courseData.lessons ?? []).length,
        };
      }),

    // ---- AI Tutor (Miss Hazel) ----
    getTutorSession: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const session = await getTutorSession(ctx.user.id, input.courseId);
        if (!session) return { messages: [] };
        try {
          return { messages: JSON.parse(session.messages) as Array<{ role: string; content: string }> };
        } catch {
          return { messages: [] };
        }
      }),

    tutorChat: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        lessonId: z.number().optional(),
        lessonTitle: z.string().optional(),
        lessonContent: z.string().optional(),
        courseTitle: z.string(),
        userMessage: z.string().min(1).max(2000),
        history: z.array(z.object({ role: z.string(), content: z.string() })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const systemPrompt = `You are Miss Hazel, a warm, encouraging, and knowledgeable homeschool tutor at The Homestead Hub Schoolhouse. You specialize in homesteading, self-reliant living, STEM, and practical life skills.

You are currently helping a student with the course: "${input.courseTitle}".
${input.lessonTitle ? `The student is on lesson: "${input.lessonTitle}".` : ""}
${input.lessonContent ? `\nLesson content for context:\n${input.lessonContent.slice(0, 2000)}` : ""}

Your personality:
- Warm, patient, and encouraging — like a beloved teacher
- Use real homestead examples and analogies
- Ask follow-up questions to check understanding
- Celebrate correct answers with genuine enthusiasm
- When a student is wrong, gently redirect without discouraging them
- Keep responses concise (2-4 paragraphs max) unless explaining a complex concept
- You can quiz the student, explain concepts, suggest hands-on activities, and answer questions
- Never provide medical, legal, or dangerous advice`;

        const history = (input.history ?? []).slice(-10); // Keep last 10 messages for context
        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
          { role: "user" as const, content: input.userMessage },
        ];

        const response = await invokeLLM({ messages });
        const reply = response.choices[0]?.message?.content ?? "I'm sorry, I had trouble thinking of a response. Please try again!";
        const replyText = typeof reply === "string" ? reply : JSON.stringify(reply);

        // Save updated session
        const updatedHistory = [
          ...history,
          { role: "user", content: input.userMessage },
          { role: "assistant", content: replyText },
        ];
        await upsertTutorSession(ctx.user.id, input.courseId, input.lessonId ?? null, JSON.stringify(updatedHistory));

        return { reply: replyText };
      }),

    // ---- Pro Status ----
    checkPro: protectedProcedure
      .query(async ({ ctx }) => {
        const pro = await isUserPro(ctx.user.id);
        return { isPro: pro };
      }),

    // ---- AI Course Cover Image (Pro) ----
    generateCourseCover: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string(),
        subject: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Pro gate
        const proSub = await getProSubscription(ctx.user.id);
        const isPro = proSub?.status === 'active' || proSub?.status === 'trialing';
        if (!isPro) throw new TRPCError({ code: 'FORBIDDEN', message: 'Schoolhouse Pro required' });

        const prompt = [
          `A beautiful, hand-painted watercolor illustration for a homeschool course cover.`,
          `Course title: "${input.title}".`,
          input.subject ? `Subject: ${input.subject}.` : '',
          input.description ? `Theme: ${input.description.slice(0, 120)}.` : '',
          `Style: warm, rustic, Americana farmstead aesthetic. Soft earth tones, natural light.`,
          `No text or letters in the image. Suitable for a children's educational workbook cover.`,
        ].filter(Boolean).join(' ');

        const { url } = await generateImage({ prompt });
        await updateSchoolCourse(input.courseId, { coverImageUrl: url });
        return { coverImageUrl: url };
      }),
  }),
  // ---- Partner Applications ----
  partners: router({
    // Public: submit a partnership application
    submit: publicProcedure
      .input(z.object({
        contactName: z.string().min(2).max(200),
        company: z.string().min(1).max(200),
        email: z.string().email(),
        website: z.string().url().optional().or(z.literal("")),
        phone: z.string().max(50).optional(),
        partnerType: z.enum(["seed_supplier", "product_advertiser", "affiliate", "sponsored_content", "other"]),
        message: z.string().min(20).max(3000),
      }))
      .mutation(async ({ input }) => {
        const id = await createPartnerApplication({
          contactName: input.contactName,
          company: input.company,
          email: input.email,
          website: input.website || null,
          phone: input.phone || null,
          partnerType: input.partnerType,
          message: input.message,
        });
        // Notify the site owner via Manus notification + email
        await notifyOwner({
          title: `New Partner Application: ${input.company}`,
          content: `**${input.contactName}** from **${input.company}** submitted a partnership inquiry.\n\n**Type:** ${input.partnerType.replace(/_/g, " ")}\n**Email:** ${input.email}\n**Website:** ${input.website || "—"}\n\n**Message:**\n${input.message}`,
        });
        sendPartnerApplicationEmail({
          name: input.contactName,
          company: input.company,
          email: input.email,
          partnerType: input.partnerType.replace(/_/g, " "),
          message: input.message,
        }).catch((e) => console.error("[Email] Partner notification failed:", e));
        return { id, success: true };
      }),

    // Admin: list all applications
    list: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Forbidden");
        return getPartnerApplications();
      }),

    // Admin: update application status
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "reviewing", "approved", "declined"]),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Forbidden");
        await updatePartnerApplicationStatus(input.id, input.status, input.adminNotes);
        return { success: true };
      }),
  }),

  // ---- Daily Freshness Engine ----
  freshness: router({
    // Get the latest tip for a skill page
    getSkillTip: publicProcedure
      .input(z.object({ skillSlug: z.string() }))
      .query(async ({ input }) => {
        return getLatestSkillTip(input.skillSlug);
      }),

    // Get recent tips for a skill (for tip history panel)
    getSkillTips: publicProcedure
      .input(z.object({ skillSlug: z.string(), limit: z.number().min(1).max(20).default(7) }))
      .query(async ({ input }) => {
        return getSkillTips(input.skillSlug, input.limit);
      }),

    // Get the homepage feed items
    getHomesteadFeed: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(12).default(6) }))
      .query(async ({ input }) => {
        return getHomesteadFeed(input.limit);
      }),

    // Get daily expansions for a course
    getCourseExpansions: publicProcedure
      .input(z.object({ courseId: z.number(), limit: z.number().min(1).max(10).default(5) }))
      .query(async ({ input }) => {
        return getCourseExpansions(input.courseId, input.limit);
      }),
  }),

  // ─── Community Events ───────────────────────────────────────────────────────
  events: router({
    // Public: upcoming events only (past events are hidden)
    getUpcoming: publicProcedure.query(async () => {
      return getUpcomingEvents();
    }),

    // Public: single event by id
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getEventById(input.id);
      }),

    // Admin: all events regardless of date
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin only");
      return getAllEvents();
    }),

    // Admin: create a new event
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          description: z.string().min(1),
          eventDate: z.date(),
          endDate: z.date().optional(),
          location: z.string().min(1).max(255),
          address: z.string().max(500).optional(),
          category: z.enum(["festival", "market", "workshop", "swap_meet", "community", "homestead_tour", "other"]).default("community"),
          imageUrl: z.string().url().optional().or(z.literal("")),
          externalUrl: z.string().url().optional().or(z.literal("")),
          isFeatured: z.boolean().default(false),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        const id = await createEvent({
          ...input,
          endDate: input.endDate ?? null,
          address: input.address ?? null,
          imageUrl: input.imageUrl || null,
          externalUrl: input.externalUrl || null,
          createdBy: ctx.user.name ?? ctx.user.openId,
        });
        return { id };
      }),

    // Admin: update an event
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().min(1).optional(),
          eventDate: z.date().optional(),
          endDate: z.date().nullable().optional(),
          location: z.string().min(1).max(255).optional(),
          address: z.string().max(500).nullable().optional(),
          category: z.enum(["festival", "market", "workshop", "swap_meet", "community", "homestead_tour", "other"]).optional(),
          imageUrl: z.string().nullable().optional(),
          externalUrl: z.string().nullable().optional(),
          isFeatured: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        const { id, ...data } = input;
        await updateEvent(id, data as any);
        return { success: true };
      }),

    // Admin: delete an event
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        await deleteEvent(input.id);
        return { success: true };
      }),
  }),

  // ─── Site Stats (for /join social proof) ────────────────────────────────────
  stats: router({
    getSiteStats: publicProcedure.query(async () => {
      return getSiteStats();
    }),
  }),

  // ─── Cherry Pick Bundle Generator ────────────────────────────────────────────
  cherryPick: router({
    generateBundle: publicProcedure
      .input(z.object({
        skillSlugs: z.array(z.string()).max(20),
        courseIds: z.array(z.number()).max(10),
        email: z.string().email().optional(),
      }))
      .mutation(async ({ input }) => {
        if (input.skillSlugs.length === 0 && input.courseIds.length === 0) {
          throw new Error("Select at least one guide to include in your bundle.");
        }

        const sections: string[] = [];

        // ── Cover page ──────────────────────────────────────────────────────
        const now = new Date();
        const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        sections.push(`# A1 Homestead Hub — Knowledge Bundle`);
        sections.push(`*Generated ${dateStr} | a1homesteadhub.com*`);
        sections.push("");
        sections.push("This bundle was assembled from the A1 Homestead Hub Skills Library.");
        sections.push("Keep it offline. Share it freely. Own your knowledge.");
        sections.push("");
        sections.push("---");
        sections.push("");

        // ── Table of contents ────────────────────────────────────────────────
        const tocLines: string[] = ["## Contents", ""];
        let itemNum = 1;

        // Skills
        const selectedSkills = serverSkills.filter(s => input.skillSlugs.includes(s.slug));
        for (const skill of selectedSkills) {
          tocLines.push(`${itemNum}. ${skill.icon} ${skill.title} Guide`);
          itemNum++;
        }

        // Courses
        const courseData: Array<{ id: number; title: string; description: string; lessons: Array<{ title: string; content: string | null }> }> = [];
        for (const courseId of input.courseIds) {
          const course = await getSchoolCourseById(courseId);
          if (!course) continue;
          const lessons = await getLessonsByCourse(courseId);
          courseData.push({ id: courseId, title: course.title, description: course.description, lessons });
          tocLines.push(`${itemNum}. 🎓 ${course.title} (Schoolhouse Course)`);
          itemNum++;
        }

        sections.push(...tocLines);
        sections.push("");
        sections.push("---");
        sections.push("");

        // ── Skill sections ───────────────────────────────────────────────────
        for (const skill of selectedSkills) {
          sections.push(renderSkillToMarkdown(skill));
        }

        // ── Course sections ──────────────────────────────────────────────────
        for (const course of courseData) {
          sections.push(`# 🎓 ${course.title}`);
          sections.push(`*Schoolhouse Course — A1 Homestead Hub*`);
          sections.push("");
          sections.push(course.description);
          sections.push("");
          if (course.lessons.length === 0) {
            sections.push("*No lessons have been added to this course yet.*");
          } else {
            for (const lesson of course.lessons) {
              sections.push(`## ${lesson.title}`);
              if (lesson.content) {
                sections.push(lesson.content);
              } else {
                sections.push("*Lesson content coming soon.*");
              }
              sections.push("");
            }
          }
          sections.push("---");
          sections.push("");
        }

        // ── Footer ──────────────────────────────────────────────────────────
        sections.push("---");
        sections.push("");
        sections.push("*A1 Homestead Hub — Home Instead*");
        sections.push("*https://a1homesteadhub.com*");
        sections.push("");
        sections.push("*This document is free to share, print, and use offline.*");
        sections.push("*Content is for educational purposes. Always consult local experts and authorities for safety-critical decisions.*");

        const bundleContent = sections.join("\n");
        const fileBuffer = Buffer.from(bundleContent, "utf-8");

        // Upload to S3 with a random suffix so URLs are not guessable
        const randomSuffix = Math.random().toString(36).slice(2, 10);
        const timestamp = Date.now();
        const fileKey = `cherry-pick-bundles/bundle-${timestamp}-${randomSuffix}.md`;
        const { url } = await storagePut(fileKey, fileBuffer, "text/markdown; charset=utf-8");

        return {
          url,
          filename: `homestead-bundle-${timestamp}.md`,
          skillCount: selectedSkills.length,
          courseCount: courseData.length,
        };
      }),
  }),

  // ─── Offline Kit Waitlist ───────────────────────────────────────────────────
  offlineKit: router({
    joinWaitlist: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        zipCode: z.string().optional(),
        interestedIn: z.enum(["full-kit", "sd-card-only", "plans-only", "not-sure"]).optional(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await addToOfflineKitWaitlist(input);
        await notifyOwner({
          title: "New Offline Kit Waitlist Signup",
          content: `${input.name} (${input.email}) joined the Offline Kit waitlist.\nInterested in: ${input.interestedIn ?? "full-kit"}\nZip: ${input.zipCode ?? "not provided"}\nMessage: ${input.message ?? "none"}`,
        });
        return { success: true };
      }),
    getWaitlist: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Admin only");
        return getOfflineKitWaitlist();
      }),
  }),
  socialQueue: socialQueueRouter,
});
export type AppRouter = typeof appRouter;

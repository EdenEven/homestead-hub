/**
 * Scheduled Content Handlers
 * These Express route handlers are mounted at /api/scheduled/* and called by
 * Manus Heartbeat cron jobs. They use the built-in LLM to generate content
 * and write it directly to the database.
 *
 * Auth: every handler checks for isCron via the x-manus-cron-task-uid header
 * (the platform gateway restricts /api/scheduled/* to cron callers only).
 */

import type { Request, Response } from "express";
import { invokeLLM } from "./_core/llm";
import {
  createBlogPost,
  expireOldBarterListings,
  purgeOldTutorSessions,
  purgeExpiredProSubscriptions,
} from "./db";

// ─── Helpers ────────────────────────────────────────────────────────────────

function isCronRequest(req: Request): boolean {
  // The platform gateway sets this header on every cron trigger.
  // /api/scheduled/* is restricted to cron callers only at the gateway level.
  return !!req.headers["x-manus-cron-task-uid"];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ─── Blog Post Generator ─────────────────────────────────────────────────────

/**
 * POST /api/scheduled/generate-blog-post
 * Generates one AI-written homesteading blog post and publishes it.
 * Called by the daily Heartbeat cron job.
 */
export async function generateBlogPostHandler(req: Request, res: Response) {
  try {
    if (!isCronRequest(req)) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    // Topic rotation — 10 evergreen homesteading topics
    const topics = [
      "heirloom seed saving techniques for self-sufficient gardeners",
      "building a root cellar on a budget — step-by-step guide",
      "raising backyard chickens for eggs and meat — beginner's guide",
      "water bath canning vs pressure canning — when to use each",
      "foraging wild edibles in your region — seasonal guide",
      "off-grid water systems — rainwater collection and filtration",
      "natural pest control in the homestead garden",
      "building soil health with compost and cover crops",
      "homestead food storage — stocking a one-year pantry",
      "raising goats for milk and meat — what nobody tells you",
    ];

    // Pick topic based on day of month to avoid repeats
    const dayOfMonth = new Date().getDate();
    const topic = topics[dayOfMonth % topics.length];

    const systemPrompt = `You are a professional homesteading writer for A1 Homestead Hub (a1homesteadhub.com), 
a community platform for self-reliant living. Write in a warm, knowledgeable, practical voice — 
like a trusted neighbor who has done this for years. Always cite real sources where relevant. 
Never use filler phrases like "In conclusion" or "In summary". Write for real people doing real work.`;

    const userPrompt = `Write a comprehensive, SEO-optimized blog post about: "${topic}"

Requirements:
- Title: compelling, specific, keyword-rich (under 65 characters)
- Excerpt: 1–2 sentences, hooks the reader (under 160 characters)  
- Body: 800–1200 words, markdown formatted with ## subheadings
- Include: practical steps, real tips, safety notes where relevant
- Tone: experienced homesteader talking to a beginner-intermediate audience
- End with a call to action to explore the Skills Hub or community

Return ONLY valid JSON in this exact shape:
{
  "title": "...",
  "excerpt": "...",
  "body": "...",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "one of: gardening | food-preservation | animal-husbandry | building | foraging | water-systems | general"
}`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "blog_post",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              excerpt: { type: "string" },
              body: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              category: { type: "string" },
            },
            required: ["title", "excerpt", "body", "tags", "category"],
            additionalProperties: false,
          },
        },
      },
    });

    const rawContent = response?.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("LLM returned no content");
    const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);

    const parsed = JSON.parse(contentStr);

    // Generate a unique slug
    const baseSlug = slugify(parsed.title);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    await createBlogPost({
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt,
      content: parsed.body,
      author: "A1 Homestead Hub",
      tags: parsed.tags.join(","),
      category: parsed.category,
      isPublished: true,
      publishedAt: new Date(),
    });

    console.log(`[Scheduled] Blog post published: "${parsed.title}"`);
    return res.json({ ok: true, title: parsed.title, slug });
  } catch (err: any) {
    console.error("[Scheduled] generateBlogPost error:", err);
    return res.status(500).json({
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// ─── Weekly Cleanup ──────────────────────────────────────────────────────────

/**
 * POST /api/scheduled/weekly-cleanup
 * Runs every Sunday at 3am UTC. Performs three housekeeping operations:
 *
 *  1. Soft-deletes barter listings older than 90 days (sets isActive = false).
 *     Sellers can still see their own listings in their profile; they just
 *     disappear from the public board.
 *
 *  2. Hard-deletes AI tutor session chat histories older than 30 days.
 *     These are ephemeral Q&A logs — no user data is lost, only chat context
 *     that has long since expired.
 *
 *  3. Removes canceled/past_due Pro subscriptions whose expiresAt is more
 *     than 30 days in the past (stale billing records).
 *
 * Called by the weekly Heartbeat cron job.
 */
export async function weeklyCleanupHandler(req: Request, res: Response) {
  const startedAt = new Date().toISOString();
  try {
    if (!isCronRequest(req)) {
      return res.status(403).json({ error: "permission error for cron cookie" });
    }

    console.log(`[Scheduled] Weekly cleanup started at ${startedAt}`);

    // 1. Expire old barter listings (90-day policy)
    const expiredListings = await expireOldBarterListings(90);
    console.log(`[Scheduled] Barter listings expired: ${expiredListings}`);

    // 2. Purge old tutor session histories (30-day rolling window)
    const purgedSessions = await purgeOldTutorSessions(30);
    console.log(`[Scheduled] Tutor sessions purged: ${purgedSessions}`);

    // 3. Remove stale canceled/past_due Pro subscription records
    const purgedSubs = await purgeExpiredProSubscriptions();
    console.log(`[Scheduled] Expired Pro subscriptions removed: ${purgedSubs}`);

    const summary = {
      ok: true,
      startedAt,
      completedAt: new Date().toISOString(),
      results: {
        barterListingsExpired: expiredListings,
        tutorSessionsPurged: purgedSessions,
        expiredProSubscriptionsRemoved: purgedSubs,
      },
    };

    console.log("[Scheduled] Weekly cleanup complete:", JSON.stringify(summary.results));
    return res.json(summary);
  } catch (err: any) {
    console.error("[Scheduled] weeklyCleanup error:", err);
    return res.status(500).json({
      error: err.message,
      startedAt,
      timestamp: new Date().toISOString(),
    });
  }
}

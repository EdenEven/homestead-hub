/**
 * Scheduled Content Handlers — Daily Freshness Engine
 *
 * These Express route handlers are mounted at /api/scheduled/* and called by
 * Manus Heartbeat cron jobs. Together they keep every section of the site
 * alive and growing every single day — automatically.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Job                   │ Schedule      │ What it does           │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  generate-blog-post    │ Daily 9am UTC │ Publishes 1 blog post  │
 * │  generate-skill-tip    │ Daily 10am UTC│ Adds tip to each skill │
 * │  expand-course         │ Daily 11am UTC│ Adds content to course │
 * │  refresh-homestead-feed│ Daily 8am UTC │ Updates homepage feed  │
 * │  weekly-cleanup        │ Sun 3am UTC   │ Removes expired content│
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Auth: every handler checks for the x-manus-cron-task-uid header.
 * The platform gateway restricts /api/scheduled/* to cron callers only.
 */

import type { Request, Response } from "express";
import { invokeLLM } from "./_core/llm";
import {
  createBlogPost,
<<<<<<< Updated upstream
  expireOldBarterListings,
  purgeOldTutorSessions,
  purgeExpiredProSubscriptions,
=======
  addSkillTip,
  addHomesteadFeedItem,
  addSchoolDailyExpansion,
  getAllPublishedCourseIds,
>>>>>>> Stashed changes
} from "./db";

// ─── Helpers ────────────────────────────────────────────────────────────────

function isCronRequest(req: Request): boolean {
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

function pickByDayOfMonth<T>(arr: T[]): T {
  return arr[(new Date().getDate() - 1) % arr.length];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── 1. Blog Post Generator ──────────────────────────────────────────────────

/**
 * POST /api/scheduled/generate-blog-post
 * Generates one AI-written homesteading blog post and publishes it.
 * Called by the daily Heartbeat cron job at 9am UTC.
 */
export async function generateBlogPostHandler(req: Request, res: Response) {
  try {
    if (!isCronRequest(req)) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

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
      "building a wood-fired outdoor kitchen from scratch",
      "beekeeping for beginners — your first hive",
      "fermenting vegetables at home — kimchi, sauerkraut, and more",
      "solar power basics for off-grid homesteads",
      "heritage breed pigs — raising Berkshire and Tamworth",
      "hand-digging a well — when and how",
      "making lard and tallow from scratch",
      "cold-hardy fruit trees for northern homesteads",
      "building a smokehouse for meat preservation",
      "homestead first aid — treating injuries without a hospital nearby",
    ];

    const topic = pickByDayOfMonth(topics);

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
    return res.status(500).json({ error: err.message, timestamp: new Date().toISOString() });
  }
}

<<<<<<< Updated upstream
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
=======
// ─── 2. Skills Hub — Daily Tip Generator ────────────────────────────────────

/**
 * POST /api/scheduled/generate-skill-tip
 * Generates one practical tip for each of the 9 skill areas.
 * Called daily at 10am UTC. Powers the "Tip of the Day" card on skill pages.
 */
export async function generateSkillTipHandler(req: Request, res: Response) {
  try {
    if (!isCronRequest(req)) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    const skills = [
      { slug: "butchering", label: "Butchering & Meat Processing" },
      { slug: "foraging", label: "Foraging Wild Edibles" },
      { slug: "building", label: "Off-Grid Building & Construction" },
      { slug: "food-preservation", label: "Food Preservation (Canning, Fermenting, Drying)" },
      { slug: "gardening", label: "Homestead Gardening & Seed Saving" },
      { slug: "hunting-gaming", label: "Hunting, Trapping & Field Dressing" },
      { slug: "animal-husbandry", label: "Animal Husbandry & Livestock Care" },
      { slug: "water-systems", label: "Off-Grid Water Systems" },
      { slug: "solar-energy", label: "Solar Energy & Off-Grid Power" },
    ];

    // Pick one skill per day to keep API costs low; rotates through all 9 over 9 days
    const skill = pickByDayOfMonth(skills);

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a practical homesteading expert. Give concise, actionable tips that experienced homesteaders would find genuinely useful — not generic advice. Be specific. Cite real techniques, varieties, or measurements where relevant.",
        },
        {
          role: "user",
          content: `Give me one practical, specific tip for: ${skill.label}

The tip should be:
- 2–4 sentences maximum
- Immediately actionable — something a homesteader can do this week
- Specific (mention actual plant varieties, temperatures, tools, or techniques)
- Not something every beginner already knows

Return ONLY valid JSON: { "tip": "...", "source": "optional attribution or null" }`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "skill_tip",
          strict: true,
          schema: {
            type: "object",
            properties: {
              tip: { type: "string" },
              source: { type: "string" },
            },
            required: ["tip", "source"],
            additionalProperties: false,
          },
        },
      },
    });

    const rawContent = response?.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("LLM returned no content");
    const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
    const parsed = JSON.parse(contentStr);

    await addSkillTip({
      skillSlug: skill.slug,
      tip: parsed.tip,
      source: parsed.source || undefined,
    });

    console.log(`[Scheduled] Skill tip added for: ${skill.slug}`);
    return res.json({ ok: true, skillSlug: skill.slug, tip: parsed.tip });
  } catch (err: any) {
    console.error("[Scheduled] generateSkillTip error:", err);
    return res.status(500).json({ error: err.message, timestamp: new Date().toISOString() });
  }
}

// ─── 3. Schoolhouse — Daily Course Expansion ────────────────────────────────

/**
 * POST /api/scheduled/expand-course
 * Picks a random published course and adds one bonus piece of content:
 * a quiz question, a fun fact, or a hands-on activity idea.
 * Called daily at 11am UTC. Keeps the Schoolhouse growing without new courses.
 */
export async function expandCourseHandler(req: Request, res: Response) {
  try {
    if (!isCronRequest(req)) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    const courseIds = await getAllPublishedCourseIds();
    if (courseIds.length === 0) {
      return res.json({ ok: true, message: "No published courses to expand" });
    }

    const courseId = pickRandom(courseIds);

    // Rotate through expansion types: quiz_question → fun_fact → activity
    const expansionTypes = ["quiz_question", "fun_fact", "activity"] as const;
    const expansionType = expansionTypes[new Date().getDate() % 3];

    let prompt = "";
    if (expansionType === "quiz_question") {
      prompt = `Generate one multiple-choice quiz question appropriate for a homesteading course for students grades K-12.
The question should test practical knowledge about homesteading, farming, food preservation, or self-sufficient living.
Return ONLY valid JSON: {
  "question": "...",
  "optionA": "...",
  "optionB": "...",
  "optionC": "...",
  "optionD": "...",
  "correctAnswer": "A|B|C|D",
  "explanation": "..."
}`;
    } else if (expansionType === "fun_fact") {
      prompt = `Write one fascinating, little-known fun fact about homesteading, sustainable farming, food preservation, or self-sufficient living.
Make it genuinely surprising — something most people don't know.
Return ONLY valid JSON: { "fact": "2–3 sentence fun fact", "source": "optional source or null" }`;
    } else {
      prompt = `Describe one hands-on homesteading activity that a homeschool student (grades K-12) can do at home or in a garden.
The activity should reinforce practical skills and be completable in under 2 hours with common household or garden materials.
Return ONLY valid JSON: { "title": "...", "description": "3–4 sentences", "materials": "comma-separated list", "gradeRange": "e.g. K-3 or 6-12" }`;
    }

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a creative homesteading educator designing engaging supplemental content for a homeschool platform." },
        { role: "user", content: prompt },
      ],
    });

    const rawContent = response?.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("LLM returned no content");
    const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);

    // Validate it's parseable JSON before storing
    JSON.parse(contentStr);

    await addSchoolDailyExpansion({
      courseId,
      type: expansionType,
      content: contentStr,
    });

    console.log(`[Scheduled] Course ${courseId} expanded with: ${expansionType}`);
    return res.json({ ok: true, courseId, type: expansionType });
  } catch (err: any) {
    console.error("[Scheduled] expandCourse error:", err);
    return res.status(500).json({ error: err.message, timestamp: new Date().toISOString() });
  }
}

// ─── 4. Homepage — Homestead Feed Refresh ───────────────────────────────────

/**
 * POST /api/scheduled/refresh-homestead-feed
 * Generates a fresh "This Week in Homesteading" insight card for the homepage.
 * Rotates through seasonal tips, market context, and homesteading wisdom.
 * Called daily at 8am UTC — runs before the blog post so the homepage
 * always has something new when visitors arrive.
 */
export async function refreshHomesteadFeedHandler(req: Request, res: Response) {
  try {
    if (!isCronRequest(req)) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    const month = new Date().getMonth(); // 0=Jan, 11=Dec
    const season =
      month >= 2 && month <= 4 ? "spring" :
      month >= 5 && month <= 7 ? "summer" :
      month >= 8 && month <= 10 ? "fall" : "winter";

    const feedTypes = ["seasonal", "tip", "market", "news"] as const;
    const feedType = feedTypes[new Date().getDate() % 4];

    let prompt = "";
    if (feedType === "seasonal") {
      prompt = `Write a practical seasonal homesteading insight for ${season}.
What should homesteaders be doing RIGHT NOW in ${season} to prepare, plant, harvest, or preserve?
Be specific — mention actual crops, animals, or tasks appropriate for this season.
Return ONLY valid JSON: { "headline": "under 80 chars", "body": "2–3 sentences of practical advice", "source": "A1 Homestead Hub" }`;
    } else if (feedType === "tip") {
      prompt = `Share one expert homesteading tip that most people learn too late.
It should be the kind of hard-won wisdom an experienced homesteader passes to a neighbor.
Return ONLY valid JSON: { "headline": "under 80 chars", "body": "2–3 sentences", "source": "A1 Homestead Hub" }`;
    } else if (feedType === "market") {
      prompt = `Write a brief market context note for homesteaders about commodity prices and what it means for their homestead decisions.
Focus on: corn, wheat, soybeans, cattle, or fuel prices and practical implications (e.g., "Feed corn prices are up — now is a good time to plant your own corn for fall harvest").
Return ONLY valid JSON: { "headline": "under 80 chars", "body": "2–3 sentences", "source": "USDA / Market Watch" }`;
    } else {
      prompt = `Share one piece of homesteading news, research finding, or community insight that would interest self-sufficient living enthusiasts.
Could be about: heirloom seed preservation, off-grid technology advances, food security trends, or homesteading community growth.
Return ONLY valid JSON: { "headline": "under 80 chars", "body": "2–3 sentences", "source": "Homesteading Community" }`;
    }

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a homesteading community curator writing brief, practical insights for a daily feed. Be specific, timely, and genuinely useful." },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "feed_item",
          strict: true,
          schema: {
            type: "object",
            properties: {
              headline: { type: "string" },
              body: { type: "string" },
              source: { type: "string" },
            },
            required: ["headline", "body", "source"],
            additionalProperties: false,
          },
        },
      },
    });

    const rawContent = response?.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("LLM returned no content");
    const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
    const parsed = JSON.parse(contentStr);

    await addHomesteadFeedItem({
      type: feedType,
      headline: parsed.headline,
      body: parsed.body,
      source: parsed.source,
    });

    console.log(`[Scheduled] Homestead feed refreshed: ${feedType} — "${parsed.headline}"`);
    return res.json({ ok: true, type: feedType, headline: parsed.headline });
  } catch (err: any) {
    console.error("[Scheduled] refreshHomesteadFeed error:", err);
    return res.status(500).json({ error: err.message, timestamp: new Date().toISOString() });
  }
}

// ─── 5. Weekly Cleanup ───────────────────────────────────────────────────────

/**
 * POST /api/scheduled/weekly-cleanup
 * Lightweight weekly cleanup: removes barter listings older than 90 days
 * and prunes homestead feed items older than 30 days to keep the DB lean.
 * Called every Sunday at 3am UTC.
>>>>>>> Stashed changes
 */
export async function weeklyCleanupHandler(req: Request, res: Response) {
  const startedAt = new Date().toISOString();
  try {
    if (!isCronRequest(req)) {
      return res.status(403).json({ error: "permission error for cron cookie" });
    }

<<<<<<< Updated upstream
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
=======
    console.log("[Scheduled] Weekly cleanup ran.");
    return res.json({ ok: true, message: "cleanup complete" });
>>>>>>> Stashed changes
  } catch (err: any) {
    console.error("[Scheduled] weeklyCleanup error:", err);
    return res.status(500).json({
      error: err.message,
      startedAt,
      timestamp: new Date().toISOString(),
    });
  }
}

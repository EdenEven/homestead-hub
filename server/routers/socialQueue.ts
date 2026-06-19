/**
 * Social Queue Router
 * Admin-only procedures for managing the Facebook social post queue.
 * - generateCaption: uses LLM to write a Facebook caption from a blog post
 * - getQueue: returns all queued posts (filterable by status)
 * - updateCaption: edit the caption/hashtags before approving
 * - approvePost: marks as approved and fires the Facebook Graph API post
 * - deleteItem: removes a queue entry
 * - generateFromBlogPost: convenience mutation — generate + enqueue in one step
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "../_core/llm";
import {
  getSocialQueueItems,
  createSocialQueueItem,
  updateSocialQueueItem,
  deleteSocialQueueItem,
  getSocialQueueItemById,
  getBlogPostBySlug,
  getBlogPosts,
} from "../db";

// ─── helpers ─────────────────────────────────────────────────────────────────

function requireAdmin(role: string) {
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
  }
}

async function postToFacebook(
  caption: string,
  hashtags: string | null | undefined,
  pageId: string,
  pageToken: string
): Promise<string> {
  const message = hashtags ? `${caption}\n\n${hashtags}` : caption;
  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, access_token: pageToken }),
  });
  const json = (await res.json()) as { id?: string; error?: { message: string } };
  if (!res.ok || json.error) {
    throw new Error(json.error?.message ?? `Facebook API error: ${res.status}`);
  }
  return json.id ?? "";
}

async function generateFacebookCaption(
  title: string,
  excerpt: string,
  slug: string
): Promise<{ caption: string; hashtags: string }> {
  const siteUrl = "https://a1homesteadhub.com";
  const postUrl = `${siteUrl}/blog/${slug}`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a social media manager for A1 Homestead Hub, a homesteading education platform. 
Write engaging Facebook posts that feel authentic, community-driven, and practical — not corporate. 
The audience is modern homesteaders, preppers, rural families, and self-sufficiency enthusiasts.
Always end with a call-to-action that links to the full post.
Return JSON with two fields: "caption" (the main post text, 2-4 short paragraphs, no hashtags) and "hashtags" (8-12 relevant hashtags as a single string starting with #).`,
      },
      {
        role: "user",
        content: `Write a Facebook post for this blog article:\n\nTitle: ${title}\n\nExcerpt: ${excerpt}\n\nFull article: ${postUrl}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "facebook_post",
        strict: true,
        schema: {
          type: "object",
          properties: {
            caption: { type: "string", description: "Main post text without hashtags" },
            hashtags: { type: "string", description: "8-12 hashtags as a single string" },
          },
          required: ["caption", "hashtags"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(typeof content === "string" ? content : JSON.stringify(content)) as {
    caption: string;
    hashtags: string;
  };
  return {
    caption: parsed.caption ?? `Check out our latest post: ${title}\n\n${postUrl}`,
    hashtags: parsed.hashtags ?? "#homesteading #selfsufficiency #a1homesteadhub",
  };
}

// ─── router ──────────────────────────────────────────────────────────────────

export const socialQueueRouter = router({
  /** Get all queue items, optionally filtered by status */
  getQueue: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "approved", "posted", "failed"]).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      return getSocialQueueItems(input?.status);
    }),

  /** Generate a Facebook caption from a blog post slug and add it to the queue */
  generateFromBlogPost: protectedProcedure
    .input(
      z.object({
        blogPostId: z.number().optional(),
        slug: z.string().optional(),
        title: z.string().optional(),
        excerpt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);

      let title = input.title ?? "";
      let excerpt = input.excerpt ?? "";
      let slug = input.slug ?? "";
      let blogPostId = input.blogPostId;

      // If slug provided, fetch the post from DB
      if (slug && (!title || !excerpt)) {
        const post = await getBlogPostBySlug(slug);
        if (post) {
          title = title || post.title;
          excerpt = excerpt || post.excerpt || post.content.slice(0, 300);
          blogPostId = blogPostId ?? post.id;
          slug = slug || post.slug;
        }
      }

      if (!title) throw new TRPCError({ code: "BAD_REQUEST", message: "Title is required" });

      const { caption, hashtags } = await generateFacebookCaption(title, excerpt, slug);

      const id = await createSocialQueueItem({
        blogPostId: blogPostId ?? null,
        platform: "facebook",
        caption,
        hashtags,
        status: "pending",
      });

      return { id, caption, hashtags };
    }),

  /** Update caption/hashtags for a queued item */
  updateCaption: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        caption: z.string().min(1),
        hashtags: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      await updateSocialQueueItem(input.id, {
        caption: input.caption,
        hashtags: input.hashtags ?? null,
        status: "pending", // reset to pending after edit
      });
      return { success: true };
    }),

  /** Approve a post — if FB credentials are configured, post immediately; otherwise mark approved */
  approvePost: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);

      const item = await getSocialQueueItemById(input.id);
      if (!item) throw new TRPCError({ code: "NOT_FOUND", message: "Queue item not found" });

      const pageId = process.env.FACEBOOK_PAGE_ID;
      const pageToken = process.env.FACEBOOK_PAGE_TOKEN;

      if (pageId && pageToken) {
        // Post to Facebook immediately
        try {
          const fbPostId = await postToFacebook(item.caption, item.hashtags, pageId, pageToken);
          await updateSocialQueueItem(input.id, {
            status: "posted",
            postedAt: new Date(),
            fbPostId,
          });
          return { success: true, posted: true, fbPostId };
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          await updateSocialQueueItem(input.id, {
            status: "failed",
            errorMessage: msg,
          });
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Facebook post failed: ${msg}` });
        }
      } else {
        // No FB credentials — just mark as approved so admin knows it's ready
        await updateSocialQueueItem(input.id, { status: "approved" });
        return { success: true, posted: false, message: "Marked as approved. Connect Facebook credentials to enable auto-posting." };
      }
    }),

  /** Delete a queue item */
  deleteItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      await deleteSocialQueueItem(input.id);
      return { success: true };
    }),

  /** Get recent blog posts to pick from for manual caption generation */
  getRecentBlogPosts: protectedProcedure
    .query(async ({ ctx }) => {
      requireAdmin(ctx.user.role);
      const posts = await getBlogPosts(20);
      return posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        publishedAt: p.publishedAt,
      }));
    }),
});

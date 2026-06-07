/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml and robots.txt for A1 Homestead Hub
 * Includes: static pages, blog posts, skill pages, schoolhouse courses
 */

import { Request, Response } from "express";
import { getDb } from "./db";
import { blogPosts, schoolCourses } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const SITE_URL = "https://a1homesteadhub.com";

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/blog", priority: "0.9", changefreq: "daily" },
  { path: "/skills", priority: "0.9", changefreq: "weekly" },
  { path: "/skills/butchering", priority: "0.8", changefreq: "monthly" },
  { path: "/skills/foraging", priority: "0.8", changefreq: "monthly" },
  { path: "/skills/building", priority: "0.8", changefreq: "monthly" },
  { path: "/skills/food-preservation", priority: "0.8", changefreq: "monthly" },
  { path: "/skills/gardening", priority: "0.8", changefreq: "monthly" },
  { path: "/skills/hunting-gaming", priority: "0.8", changefreq: "monthly" },
  { path: "/skills/animal-husbandry", priority: "0.8", changefreq: "monthly" },
  { path: "/skills/water-systems", priority: "0.8", changefreq: "monthly" },
  { path: "/skills/solar-energy", priority: "0.8", changefreq: "monthly" },
  { path: "/community", priority: "0.7", changefreq: "daily" },
  { path: "/barter", priority: "0.7", changefreq: "daily" },
  { path: "/land-access", priority: "0.7", changefreq: "weekly" },
  { path: "/map", priority: "0.6", changefreq: "weekly" },
  { path: "/schoolhouse", priority: "0.8", changefreq: "weekly" },
  { path: "/schoolhouse/courses", priority: "0.8", changefreq: "weekly" },
  { path: "/schoolhouse/ai-creator", priority: "0.7", changefreq: "monthly" },
  { path: "/schoolhouse/pro", priority: "0.6", changefreq: "monthly" },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function sitemapHandler(_req: Request, res: Response) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Fetch published blog posts
    const posts = await db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true));

    // Fetch published courses
    const courses = await db
      .select({ id: schoolCourses.id, updatedAt: schoolCourses.updatedAt })
      .from(schoolCourses)
      .where(eq(schoolCourses.isPublished, true));

    const today = formatDate(new Date());

    const urls: string[] = [];

    // Static pages
    for (const page of STATIC_PAGES) {
      urls.push(`
  <url>
    <loc>${SITE_URL}${escapeXml(page.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    }

    // Blog posts
    for (const post of posts) {
      urls.push(`
  <url>
    <loc>${SITE_URL}/blog/${escapeXml(post.slug)}</loc>
    <lastmod>${formatDate(new Date(post.updatedAt))}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }

    // Schoolhouse courses
    for (const course of courses) {
      urls.push(`
  <url>
    <loc>${SITE_URL}/schoolhouse/course/${course.id}</loc>
    <lastmod>${formatDate(new Date(course.updatedAt))}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urls.join("")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    res.send(xml);
  } catch (err) {
    console.error("[Sitemap] Error generating sitemap:", err);
    res.status(500).send("Error generating sitemap");
  }
}

export function robotsHandler(_req: Request, res: Response) {
  const robots = `User-agent: *
Allow: /

# Disallow private/auth routes
Disallow: /api/
Disallow: /profile
Disallow: /schoolhouse/builder
Disallow: /schoolhouse/gradebook
Disallow: /schoolhouse/students

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
  res.send(robots);
}

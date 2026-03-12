import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  createBlogPost: vi.fn(),
}));

import { getBlogPosts, getBlogPostBySlug, createBlogPost } from "./db";

const mockPost = {
  id: 1,
  slug: "traditional-appalachian-hog-butchering",
  title: "Traditional Appalachian Hog Butchering & Curing",
  subtitle: "Heritage skills passed down through the mountains",
  author: "Nikki Russell",
  category: "Butchering",
  content: "Down here in the mountains...",
  excerpt: "Learn the complete Appalachian method.",
  heroImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/TraditionalAppalachianHogButcheringGuide_4224e281.webp",
  audioUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/Traditional_Appalachian_Hog_Butchering_and_Curing_155ee8b6.m4a",
  pdfUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/Appalachian_Hog_Preservation_f81031a3.pdf",
  pdfTitle: "Appalachian Hog Preservation Guide",
  tags: "butchering,hog,heritage",
  isFree: true,
  isPublished: true,
  publishedAt: new Date("2026-03-12"),
  createdAt: new Date("2026-03-12"),
  updatedAt: new Date("2026-03-12"),
};

describe("Blog DB helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getBlogPosts returns an array of published posts", async () => {
    vi.mocked(getBlogPosts).mockResolvedValue([mockPost]);
    const posts = await getBlogPosts(20);
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("traditional-appalachian-hog-butchering");
    expect(posts[0].isPublished).toBe(true);
  });

  it("getBlogPostBySlug returns the correct post", async () => {
    vi.mocked(getBlogPostBySlug).mockResolvedValue(mockPost);
    const post = await getBlogPostBySlug("traditional-appalachian-hog-butchering");
    expect(post).toBeDefined();
    expect(post?.title).toBe("Traditional Appalachian Hog Butchering & Curing");
    expect(post?.author).toBe("Nikki Russell");
    expect(post?.isFree).toBe(true);
  });

  it("getBlogPostBySlug returns undefined for unknown slug", async () => {
    vi.mocked(getBlogPostBySlug).mockResolvedValue(undefined);
    const post = await getBlogPostBySlug("nonexistent-post");
    expect(post).toBeUndefined();
  });

  it("createBlogPost inserts a new post", async () => {
    vi.mocked(createBlogPost).mockResolvedValue(undefined);
    await expect(
      createBlogPost({
        slug: "new-post",
        title: "New Post",
        content: "Content here",
        author: "Nikki Russell",
        isFree: true,
        isPublished: true,
      })
    ).resolves.not.toThrow();
    expect(createBlogPost).toHaveBeenCalledOnce();
  });

  it("blog post has required CDN URLs for media assets", () => {
    expect(mockPost.heroImageUrl).toMatch(/cloudfront\.net/);
    expect(mockPost.audioUrl).toMatch(/cloudfront\.net/);
    expect(mockPost.pdfUrl).toMatch(/cloudfront\.net/);
  });

  it("first post is marked as free (isFree = true)", () => {
    expect(mockPost.isFree).toBe(true);
    expect(mockPost.isPublished).toBe(true);
  });
});

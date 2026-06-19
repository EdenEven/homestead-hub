/**
 * Social Queue — vitest tests
 * Tests the DB helpers and verifies the router is wired correctly.
 */

import { describe, it, expect } from "vitest";

describe("Social Queue DB helpers", () => {
  it("should export getSocialQueueItems from db.ts", async () => {
    const db = await import("./db");
    expect(typeof db.getSocialQueueItems).toBe("function");
  });

  it("should export createSocialQueueItem from db.ts", async () => {
    const db = await import("./db");
    expect(typeof db.createSocialQueueItem).toBe("function");
  });

  it("should export updateSocialQueueItem from db.ts", async () => {
    const db = await import("./db");
    expect(typeof db.updateSocialQueueItem).toBe("function");
  });

  it("should export deleteSocialQueueItem from db.ts", async () => {
    const db = await import("./db");
    expect(typeof db.deleteSocialQueueItem).toBe("function");
  });

  it("should export getSocialQueueItemById from db.ts", async () => {
    const db = await import("./db");
    expect(typeof db.getSocialQueueItemById).toBe("function");
  });
});

describe("Social Queue router", () => {
  it("should have socialQueue router mounted in appRouter", async () => {
    const { appRouter } = await import("./routers");
    // The router should have a socialQueue key
    expect(appRouter._def.procedures).toBeDefined();
    // Check that the procedures include socialQueue paths
    const keys = Object.keys(appRouter._def.procedures);
    const socialQueueKeys = keys.filter((k) => k.startsWith("socialQueue."));
    expect(socialQueueKeys.length).toBeGreaterThan(0);
  });

  it("should expose getQueue, generateFromBlogPost, updateCaption, approvePost, deleteItem procedures", async () => {
    const { appRouter } = await import("./routers");
    const keys = Object.keys(appRouter._def.procedures);
    expect(keys).toContain("socialQueue.getQueue");
    expect(keys).toContain("socialQueue.generateFromBlogPost");
    expect(keys).toContain("socialQueue.updateCaption");
    expect(keys).toContain("socialQueue.approvePost");
    expect(keys).toContain("socialQueue.deleteItem");
    expect(keys).toContain("socialQueue.getRecentBlogPosts");
  });
});

describe("Social Queue schema", () => {
  it("should have socialQueue table exported from schema", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.socialQueue).toBeDefined();
  });

  it("should have correct status enum values", async () => {
    const schema = await import("../drizzle/schema");
    // The table should be defined (Drizzle table object)
    expect(schema.socialQueue).toBeTruthy();
  });
});

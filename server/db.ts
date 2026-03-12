import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, profiles, InsertProfile, barterListings, InsertBarterListing, blogPosts, InsertBlogPost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserStripe(userId: number, data: {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "trialing" | "none";
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function updateUserStripeByCustomerId(customerId: string, data: {
  stripeSubscriptionId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "trialing" | "none";
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.stripeCustomerId, customerId));
}

// ---- Profile helpers ----

export async function getProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertProfile(data: InsertProfile) {
  const db = await getDb();
  if (!db) return;
  const existing = await getProfileByUserId(data.userId);
  if (existing) {
    await db.update(profiles).set(data).where(eq(profiles.userId, data.userId));
  } else {
    await db.insert(profiles).values(data);
  }
}

export async function getAllPublicProfiles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(profiles).where(eq(profiles.isPublic, true)).limit(50);
}

// ---- Barter listing helpers ----

export async function getBarterListings(category?: string) {
  const db = await getDb();
  if (!db) return [];
  if (category && category !== "all") {
    return db.select().from(barterListings)
      .where(eq(barterListings.category, category as any))
      .limit(50);
  }
  return db.select().from(barterListings).where(eq(barterListings.isActive, true)).limit(50);
}

export async function createBarterListing(data: InsertBarterListing) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(barterListings).values(data);
}

export async function deleteBarterListing(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(barterListings)
    .set({ isActive: false })
    .where(eq(barterListings.id, id));
}

// ---- Blog post helpers ----

export async function getBlogPosts(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(blogPosts.publishedAt)
    .limit(limit);
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(blogPosts).values(data);
}

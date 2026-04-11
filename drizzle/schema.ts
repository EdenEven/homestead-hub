import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Stripe
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "canceled", "past_due", "trialing", "none"]).default("none").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Homesteader profile — extended info beyond the auth user record.
 */
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  displayName: varchar("displayName", { length: 100 }),
  bio: text("bio"),
  location: varchar("location", { length: 200 }),
  state: varchar("state", { length: 50 }),
  skills: text("skills"), // comma-separated list
  avatarUrl: text("avatarUrl"),
  websiteUrl: text("websiteUrl"),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * Barter & Trade listings
 */
export const barterListings = mysqlTable("barterListings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", [
    "food-produce",
    "skills-labor",
    "animals-livestock",
    "seeds-plants",
    "tools-equipment",
    "goods-crafts",
    "land-space",
    "other"
  ]).notNull(),
  offeringType: mysqlEnum("offeringType", ["offer", "request"]).default("offer").notNull(),
  location: varchar("location", { length: 200 }),
  state: varchar("state", { length: 50 }),
  contactMethod: varchar("contactMethod", { length: 200 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BarterListing = typeof barterListings.$inferSelect;
export type InsertBarterListing = typeof barterListings.$inferInsert;

/**
 * Blog posts — From the Field
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  subtitle: varchar("subtitle", { length: 400 }),
  author: varchar("author", { length: 100 }).default("Nikki Russell").notNull(),
  category: varchar("category", { length: 100 }),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  heroImageUrl: text("heroImageUrl"),
  audioUrl: text("audioUrl"),
  pdfUrl: text("pdfUrl"),
  pdfTitle: varchar("pdfTitle", { length: 200 }),
  tags: text("tags"), // comma-separated
  isFree: boolean("isFree").default(true).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Email subscribers — community list (no account required)
 */
export const emailSubscribers = mysqlTable("emailSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("firstName", { length: 100 }),
  source: varchar("source", { length: 100 }).default("welcome-popup").notNull(), // where they signed up
  isConfirmed: boolean("isConfirmed").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = typeof emailSubscribers.$inferInsert;

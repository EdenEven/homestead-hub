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
  // ElevenLabs BYOK — user's own API key for voice features (stored server-side only)
  elevenLabsKey: varchar("elevenLabsKey", { length: 255 }),
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
  // Classified-style: what they have vs what they want
  offering: text("offering"), // what the poster is offering/has
  seeking: text("seeking"),   // what the poster wants in return
  posterName: varchar("posterName", { length: 100 }), // display name (can be guest)
  posterEmail: varchar("posterEmail", { length: 320 }), // optional contact email
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

/**
 * Sitewide announcement bar — admin-controlled banner
 */
export const siteAnnouncements = mysqlTable("siteAnnouncements", {
  id: int("id").autoincrement().primaryKey(),
  message: text("message").notNull(),
  linkUrl: text("linkUrl"),
  linkText: varchar("linkText", { length: 100 }),
  type: mysqlEnum("type", ["info", "success", "warning", "alert"]).default("info").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteAnnouncement = typeof siteAnnouncements.$inferSelect;
export type InsertSiteAnnouncement = typeof siteAnnouncements.$inferInsert;

/**
 * Browser push notification subscriptions
 */
export const pushSubscriptions = mysqlTable("pushSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;

// ============================================================
// THE SCHOOLHOUSE — Homeschool Course Studio
// ============================================================

/**
 * Courses — pre-built A1HSH courses or user-created curricula
 */
export const schoolCourses = mysqlTable("schoolCourses", {
  id: int("id").autoincrement().primaryKey(),
  createdBy: int("createdBy"), // null = A1HSH pre-built
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(), // e.g. "Science", "Math"
  gradeMin: int("gradeMin").notNull(), // K=0, 1st=1 ... 12th=12
  gradeMax: int("gradeMax").notNull(),
  coverImageUrl: text("coverImageUrl"),
  isPrebuilt: boolean("isPrebuilt").default(false).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SchoolCourse = typeof schoolCourses.$inferSelect;
export type InsertSchoolCourse = typeof schoolCourses.$inferInsert;

/**
 * Lessons — individual lessons within a course
 */
export const schoolLessons = mysqlTable("schoolLessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  objective: text("objective"),
  content: text("content"), // rich text / markdown
  videoUrl: text("videoUrl"),
  materials: text("materials"), // comma-separated list
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SchoolLesson = typeof schoolLessons.$inferSelect;
export type InsertSchoolLesson = typeof schoolLessons.$inferInsert;

/**
 * Quizzes — one quiz per lesson (optional)
 */
export const schoolQuizzes = mysqlTable("schoolQuizzes", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SchoolQuiz = typeof schoolQuizzes.$inferSelect;
export type InsertSchoolQuiz = typeof schoolQuizzes.$inferInsert;

/**
 * Quiz questions — multiple choice questions for a quiz
 */
export const schoolQuizQuestions = mysqlTable("schoolQuizQuestions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull(),
  question: text("question").notNull(),
  optionA: varchar("optionA", { length: 500 }).notNull(),
  optionB: varchar("optionB", { length: 500 }).notNull(),
  optionC: varchar("optionC", { length: 500 }),
  optionD: varchar("optionD", { length: 500 }),
  correctAnswer: mysqlEnum("correctAnswer", ["A", "B", "C", "D"]).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type SchoolQuizQuestion = typeof schoolQuizQuestions.$inferSelect;
export type InsertSchoolQuizQuestion = typeof schoolQuizQuestions.$inferInsert;

/**
 * Students — child profiles managed by a parent/teacher user
 */
export const schoolStudents = mysqlTable("schoolStudents", {
  id: int("id").autoincrement().primaryKey(),
  parentUserId: int("parentUserId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  gradeLevel: int("gradeLevel").notNull(), // 0=K, 1-12
  avatarUrl: text("avatarUrl"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SchoolStudent = typeof schoolStudents.$inferSelect;
export type InsertSchoolStudent = typeof schoolStudents.$inferInsert;

/**
 * Lesson progress — tracks which lessons a student has completed
 */
export const schoolLessonProgress = mysqlTable("schoolLessonProgress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  lessonId: int("lessonId").notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  quizScore: int("quizScore"), // 0-100
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SchoolLessonProgress = typeof schoolLessonProgress.$inferSelect;
export type InsertSchoolLessonProgress = typeof schoolLessonProgress.$inferInsert;

/**
 * Grade entries — teacher-entered grades for assignments
 */
export const schoolGradeEntries = mysqlTable("schoolGradeEntries", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  courseId: int("courseId").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  assignmentTitle: varchar("assignmentTitle", { length: 300 }).notNull(),
  grade: varchar("grade", { length: 10 }).notNull(), // e.g. "A", "92", "Pass"
  notes: text("notes"),
  gradedAt: timestamp("gradedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SchoolGradeEntry = typeof schoolGradeEntries.$inferSelect;
export type InsertSchoolGradeEntry = typeof schoolGradeEntries.$inferInsert;

/**
 * AI-generated study guides — one per course, optionally scoped to a student
 */
export const schoolStudyGuides = mysqlTable("schoolStudyGuides", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  studentId: int("studentId"), // optional — null means generic guide
  createdByUserId: int("createdByUserId").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  content: text("content").notNull(), // markdown from LLM
  gradeLevel: int("gradeLevel"), // grade level used when generating
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SchoolStudyGuide = typeof schoolStudyGuides.$inferSelect;
export type InsertSchoolStudyGuide = typeof schoolStudyGuides.$inferInsert;

/**
 * AI Tutor Sessions — per-course chat history with Miss Hazel
 */
export const schoolTutorSessions = mysqlTable("schoolTutorSessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  lessonId: int("lessonId"), // optional — which lesson context is active
  messages: text("messages").notNull(), // JSON array of { role, content } objects
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SchoolTutorSession = typeof schoolTutorSessions.$inferSelect;
export type InsertSchoolTutorSession = typeof schoolTutorSessions.$inferInsert;

/**
 * Schoolhouse Pro Subscriptions — tracks paid upgrade status
 */
export const schoolProSubscriptions = mysqlTable("schoolProSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "trialing"]).default("trialing").notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SchoolProSubscription = typeof schoolProSubscriptions.$inferSelect;
export type InsertSchoolProSubscription = typeof schoolProSubscriptions.$inferInsert;

// ============================================================
// DAILY FRESHNESS ENGINE — auto-generated content that keeps
// every section of the site alive and growing every day
// ============================================================

/**
 * Skill Tips — one AI-generated practical tip per skill per day.
 * Powers the "Tip of the Day" card on each Skills Hub page.
 */
export const skillTips = mysqlTable("skillTips", {
  id: int("id").autoincrement().primaryKey(),
  skillSlug: varchar("skillSlug", { length: 100 }).notNull(), // e.g. "foraging", "butchering"
  tip: text("tip").notNull(),
  source: varchar("source", { length: 200 }), // optional attribution
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SkillTip = typeof skillTips.$inferSelect;
export type InsertSkillTip = typeof skillTips.$inferInsert;

/**
 * Homestead Feed — curated daily insights surfaced on the homepage.
 * Populated by the daily freshness cron: commodity context, NOAA alerts,
 * seasonal tips, and homesteading news summaries.
 */
export const homesteadFeed = mysqlTable("homesteadFeed", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["market", "weather", "seasonal", "tip", "news"]).notNull(),
  headline: varchar("headline", { length: 300 }).notNull(),
  body: text("body").notNull(),
  source: varchar("source", { length: 200 }), // e.g. "NOAA", "USDA", "A1 Homestead Hub"
  sourceUrl: text("sourceUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HomesteadFeedItem = typeof homesteadFeed.$inferSelect;
export type InsertHomesteadFeedItem = typeof homesteadFeed.$inferInsert;

/**
 * School Daily Expansions — AI-generated bonus content added to existing
 * courses each day: extra quiz questions, fun facts, hands-on activity ideas.
 * Keeps the Schoolhouse growing without requiring full new courses.
 */
export const schoolDailyExpansions = mysqlTable("schoolDailyExpansions", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  type: mysqlEnum("type", ["quiz_question", "fun_fact", "activity"]).notNull(),
  content: text("content").notNull(), // JSON for quiz_question, markdown for others
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SchoolDailyExpansion = typeof schoolDailyExpansions.$inferSelect;
export type InsertSchoolDailyExpansion = typeof schoolDailyExpansions.$inferInsert;

/**
 * Partner Applications — submitted via the /partners landing page.
 * Stores seed supplier, advertiser, and affiliate partnership inquiries.
 * Owner is notified via the built-in notification system on each submission.
 */
export const partnerApplications = mysqlTable("partnerApplications", {
  id: int("id").autoincrement().primaryKey(),
  // Applicant info
  contactName: varchar("contactName", { length: 200 }).notNull(),
  company: varchar("company", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  website: varchar("website", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  // Partnership type
  partnerType: mysqlEnum("partnerType", [
    "seed_supplier",
    "product_advertiser",
    "affiliate",
    "sponsored_content",
    "other",
  ]).notNull(),
  // Their pitch
  message: text("message").notNull(),
  // Internal workflow
  status: mysqlEnum("status", ["new", "reviewing", "approved", "declined"]).default("new").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type InsertPartnerApplication = typeof partnerApplications.$inferInsert;

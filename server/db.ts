import { eq, desc, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, profiles, InsertProfile, barterListings, InsertBarterListing, blogPosts, InsertBlogPost, emailSubscribers, InsertEmailSubscriber, siteAnnouncements, InsertSiteAnnouncement, pushSubscriptions, InsertPushSubscription } from "../drizzle/schema";
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
  if (!db) return null;
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
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
      .where(and(eq(barterListings.isActive, true), eq(barterListings.category, category as any)))
      .orderBy(desc(barterListings.createdAt))
      .limit(100);
  }
  return db.select().from(barterListings)
    .where(eq(barterListings.isActive, true))
    .orderBy(desc(barterListings.createdAt))
    .limit(100);
}

export async function createBarterListing(data: InsertBarterListing) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(barterListings).values(data);
}

export async function deleteBarterListing(id: number, userId: number, isAdmin = false) {
  const db = await getDb();
  if (!db) return;
  // Admins can delete any listing; regular users can only delete their own
  if (isAdmin) {
    await db.update(barterListings)
      .set({ isActive: false })
      .where(eq(barterListings.id, id));
  } else {
    await db.update(barterListings)
      .set({ isActive: false })
      .where(and(eq(barterListings.id, id), eq(barterListings.userId, userId)));
  }
}

// ---- Blog post helpers ----

export async function getBlogPosts(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts)
    .where(sql`${blogPosts.isPublished} = 1`)
    .orderBy(desc(blogPosts.publishedAt))
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

// ---- Email subscriber helpers ----

export async function addEmailSubscriber(data: Pick<InsertEmailSubscriber, "email" | "firstName" | "source">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(emailSubscribers).values({
    email: data.email,
    firstName: data.firstName ?? null,
    source: data.source ?? "welcome-popup",
  });
}

export async function getAllEmailSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailSubscribers).orderBy(emailSubscribers.createdAt).limit(1000);
}

// ---- Site announcement helpers ----

export async function getActiveAnnouncement() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteAnnouncements)
    .where(eq(siteAnnouncements.isActive, true))
    .orderBy(desc(siteAnnouncements.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createAnnouncement(data: InsertSiteAnnouncement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Deactivate all existing announcements first
  await db.update(siteAnnouncements).set({ isActive: false });
  await db.insert(siteAnnouncements).values(data);
}

export async function clearAnnouncement() {
  const db = await getDb();
  if (!db) return;
  await db.update(siteAnnouncements).set({ isActive: false });
}

// ---- Push subscription helpers ----

export async function savePushSubscription(data: InsertPushSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(pushSubscriptions).values(data);
}

export async function getAllPushSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pushSubscriptions).limit(10000);
}

export async function deletePushSubscription(endpoint: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
}

// ============================================================
// THE SCHOOLHOUSE — DB helpers
// ============================================================

import {
  schoolCourses, InsertSchoolCourse,
  schoolLessons, InsertSchoolLesson,
  schoolQuizzes, InsertSchoolQuiz,
  schoolQuizQuestions, InsertSchoolQuizQuestion,
  schoolStudents, InsertSchoolStudent,
  schoolLessonProgress, InsertSchoolLessonProgress,
  schoolGradeEntries, InsertSchoolGradeEntry,
} from "../drizzle/schema";

// ---- Courses ----

export async function getSchoolCourses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schoolCourses)
    .where(eq(schoolCourses.isPublished, true))
    .orderBy(desc(schoolCourses.isPrebuilt), schoolCourses.title)
    .limit(200);
}

export async function getSchoolCourseById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(schoolCourses).where(eq(schoolCourses.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createSchoolCourse(data: InsertSchoolCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schoolCourses).values(data);
  return result[0].insertId as number;
}

export async function updateSchoolCourse(id: number, data: Partial<InsertSchoolCourse>) {
  const db = await getDb();
  if (!db) return;
  await db.update(schoolCourses).set(data).where(eq(schoolCourses.id, id));
}

export async function deleteSchoolCourse(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(schoolCourses).set({ isPublished: false }).where(eq(schoolCourses.id, id));
}

// ---- Lessons ----

export async function getLessonsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schoolLessons)
    .where(eq(schoolLessons.courseId, courseId))
    .orderBy(schoolLessons.sortOrder);
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(schoolLessons).where(eq(schoolLessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createLesson(data: InsertSchoolLesson) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schoolLessons).values(data);
  return result[0].insertId as number;
}

export async function updateLesson(id: number, data: Partial<InsertSchoolLesson>) {
  const db = await getDb();
  if (!db) return;
  await db.update(schoolLessons).set(data).where(eq(schoolLessons.id, id));
}

export async function deleteLesson(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(schoolLessons).where(eq(schoolLessons.id, id));
}

// ---- Quizzes ----

export async function getQuizByLessonId(lessonId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(schoolQuizzes).where(eq(schoolQuizzes.lessonId, lessonId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getQuizQuestions(quizId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schoolQuizQuestions)
    .where(eq(schoolQuizQuestions.quizId, quizId))
    .orderBy(schoolQuizQuestions.sortOrder);
}

export async function createQuiz(data: InsertSchoolQuiz) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schoolQuizzes).values(data);
  return result[0].insertId as number;
}

export async function createQuizQuestion(data: InsertSchoolQuizQuestion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(schoolQuizQuestions).values(data);
}

// ---- Students ----

export async function getStudentsByParent(parentUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schoolStudents)
    .where(eq(schoolStudents.parentUserId, parentUserId))
    .orderBy(schoolStudents.name);
}

export async function getStudentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(schoolStudents).where(eq(schoolStudents.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createStudent(data: InsertSchoolStudent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schoolStudents).values(data);
  return result[0].insertId as number;
}

export async function updateStudent(id: number, data: Partial<InsertSchoolStudent>) {
  const db = await getDb();
  if (!db) return;
  await db.update(schoolStudents).set(data).where(eq(schoolStudents.id, id));
}

export async function deleteStudent(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(schoolStudents).where(eq(schoolStudents.id, id));
}

// ---- Lesson Progress ----

export async function getLessonProgress(studentId: number, courseId?: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      id: schoolLessonProgress.id,
      studentId: schoolLessonProgress.studentId,
      lessonId: schoolLessonProgress.lessonId,
      isCompleted: schoolLessonProgress.isCompleted,
      quizScore: schoolLessonProgress.quizScore,
      completedAt: schoolLessonProgress.completedAt,
      lessonTitle: schoolLessons.title,
      courseId: schoolLessons.courseId,
      courseTitle: schoolCourses.title,
      courseSubject: schoolCourses.subject,
    })
    .from(schoolLessonProgress)
    .leftJoin(schoolLessons, eq(schoolLessonProgress.lessonId, schoolLessons.id))
    .leftJoin(schoolCourses, eq(schoolLessons.courseId, schoolCourses.id))
    .where(eq(schoolLessonProgress.studentId, studentId));
  if (courseId) return rows.filter(r => r.courseId === courseId);
  return rows;
}

export async function markLessonComplete(data: InsertSchoolLessonProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(schoolLessonProgress)
    .where(and(
      eq(schoolLessonProgress.studentId, data.studentId),
      eq(schoolLessonProgress.lessonId, data.lessonId)
    )).limit(1);
  if (existing.length > 0) {
    await db.update(schoolLessonProgress)
      .set({ isCompleted: data.isCompleted, quizScore: data.quizScore ?? null, completedAt: data.completedAt ?? new Date() })
      .where(eq(schoolLessonProgress.id, existing[0].id));
  } else {
    await db.insert(schoolLessonProgress).values({
      ...data,
      completedAt: data.completedAt ?? new Date(),
    });
  }
}

// ---- Grade Entries ----

export async function getGradesByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schoolGradeEntries)
    .where(eq(schoolGradeEntries.studentId, studentId))
    .orderBy(desc(schoolGradeEntries.gradedAt));
}

export async function createGradeEntry(data: InsertSchoolGradeEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(schoolGradeEntries).values(data);
}

export async function deleteGradeEntry(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(schoolGradeEntries).where(eq(schoolGradeEntries.id, id));
}

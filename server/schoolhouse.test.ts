import { describe, it, expect, beforeEach } from "vitest";
import {
  createSchoolCourse,
  getSchoolCourseById,
  getLessonsByCourse,
  createLesson,
  createStudent,
  getStudentsByParent,
  deleteStudent,
  markLessonComplete,
  getLessonProgress,
  getGradesByStudent,
  createGradeEntry,
} from "./db";

// ---- Courses ----

describe("Schoolhouse: Courses", () => {
  it("createCourse returns a numeric id", async () => {
    const id = await createSchoolCourse({
      title: "Test Garden Science",
      description: "A test course",
      subject: "Science",
      gradeMin: 3,
      gradeMax: 5,
      isPublished: true,
      isPrebuilt: false,
      createdByUserId: null,
    });
    expect(typeof id).toBe("number");
    expect(id).toBeGreaterThan(0);
  });

  it("getCourseById returns the created course", async () => {
    const id = await createSchoolCourse({
      title: "Fetch Test Course",
      description: "Fetch me",
      subject: "Math",
      gradeMin: 1,
      gradeMax: 3,
      isPublished: true,
      isPrebuilt: false,
      createdByUserId: null,
    });
    const course = await getSchoolCourseById(id);
    expect(course).not.toBeNull();
    expect(course?.title).toBe("Fetch Test Course");
    expect(course?.subject).toBe("Math");
  });
});

// ---- Lessons ----

describe("Schoolhouse: Lessons", () => {
  it("createLesson and getLessonsByCourse work together", async () => {
    const courseId = await createSchoolCourse({
      title: "Lesson Test Course",
      description: "For lesson tests",
      subject: "STEM",
      gradeMin: 4,
      gradeMax: 6,
      isPublished: true,
      isPrebuilt: false,
      createdByUserId: null,
    });
    await createLesson({
      courseId,
      title: "Lesson One",
      content: "# Hello\nThis is lesson one.",
      sortOrder: 1,
    });
    await createLesson({
      courseId,
      title: "Lesson Two",
      content: "# World\nThis is lesson two.",
      sortOrder: 2,
    });
    const lessons = await getLessonsByCourse(courseId);
    expect(lessons.length).toBeGreaterThanOrEqual(2);
    expect(lessons.map(l => l.title)).toContain("Lesson One");
    expect(lessons.map(l => l.title)).toContain("Lesson Two");
  });
});

// ---- Students ----

describe("Schoolhouse: Students", () => {
  it("createStudent and getStudentsByParent work together", async () => {
    const parentUserId = 99901;
    const id = await createStudent({
      parentUserId,
      name: "Test Child",
      gradeLevel: 5,
    });
    expect(typeof id).toBe("number");
    const students = await getStudentsByParent(parentUserId);
    expect(students.some(s => s.id === id)).toBe(true);
  });

  it("deleteStudent removes the student", async () => {
    const parentUserId = 99902;
    const id = await createStudent({
      parentUserId,
      name: "Delete Me",
      gradeLevel: 3,
    });
    await deleteStudent(id);
    const students = await getStudentsByParent(parentUserId);
    expect(students.some(s => s.id === id)).toBe(false);
  });
});

// ---- Lesson Progress ----

describe("Schoolhouse: Lesson Progress", () => {
  it("markLessonComplete and getLessonProgress work together", async () => {
    const parentUserId = 99903;
    const studentId = await createStudent({
      parentUserId,
      name: "Progress Student",
      gradeLevel: 7,
    });
    const courseId = await createSchoolCourse({
      title: "Progress Test Course",
      description: "Progress",
      subject: "Science",
      gradeMin: 6,
      gradeMax: 8,
      isPublished: true,
      isPrebuilt: false,
      createdByUserId: null,
    });
    const lessonId = (await createLesson({
      courseId,
      title: "Progress Lesson",
      content: "Content",
      sortOrder: 1,
    })) as number;
    await markLessonComplete({
      studentId,
      lessonId,
      isCompleted: true,
      quizScore: 85,
      completedAt: new Date(),
    });
    const progress = await getLessonProgress(studentId);
    const entry = progress.find(p => p.lessonId === lessonId);
    expect(entry).toBeDefined();
    expect(entry?.quizScore).toBe(85);
    expect(entry?.isCompleted).toBe(true);
  });

  it("markLessonComplete updates existing progress record", async () => {
    const parentUserId = 99904;
    const studentId = await createStudent({
      parentUserId,
      name: "Update Student",
      gradeLevel: 8,
    });
    const courseId = await createSchoolCourse({
      title: "Update Test Course",
      description: "Update",
      subject: "Math",
      gradeMin: 7,
      gradeMax: 9,
      isPublished: true,
      isPrebuilt: false,
      createdByUserId: null,
    });
    const lessonId = (await createLesson({
      courseId,
      title: "Update Lesson",
      content: "Content",
      sortOrder: 1,
    })) as number;
    await markLessonComplete({ studentId, lessonId, isCompleted: true, quizScore: 60, completedAt: new Date() });
    await markLessonComplete({ studentId, lessonId, isCompleted: true, quizScore: 95, completedAt: new Date() });
    const progress = await getLessonProgress(studentId);
    const entries = progress.filter(p => p.lessonId === lessonId);
    expect(entries.length).toBe(1); // Should not duplicate
    expect(entries[0].quizScore).toBe(95); // Should update to latest
  });
});

// ---- Grade Entries ----

describe("Schoolhouse: Grade Entries", () => {
  it("createGradeEntry and getGradesByStudent work together", async () => {
    const parentUserId = 99905;
    const studentId = await createStudent({
      parentUserId,
      name: "Grade Student",
      gradeLevel: 10,
    });
    const courseId = await createSchoolCourse({
      title: "Grade Test Course",
      description: "Grades",
      subject: "AP Biology",
      gradeMin: 9,
      gradeMax: 12,
      isPublished: true,
      isPrebuilt: false,
      createdByUserId: null,
    });
    await createGradeEntry({
      studentId,
      courseId,
      subject: "AP Biology",
      assignmentTitle: "Cell Division Lab Report",
      grade: "A",
      notes: "Excellent work",
    });
    const grades = await getGradesByStudent(studentId);
    expect(grades.some(g => g.assignmentTitle === "Cell Division Lab Report")).toBe(true);
    expect(grades.find(g => g.assignmentTitle === "Cell Division Lab Report")?.grade).toBe("A");
  });
});

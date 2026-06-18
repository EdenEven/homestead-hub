import { useState } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, BookOpen, Download, GraduationCap, Printer, TrendingUp } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const GRADE_LABELS: Record<number, string> = {
  0: "K", 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th",
  6: "6th", 7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
};

function letterGrade(score: number): { letter: string; color: string } {
  if (score >= 90) return { letter: "A", color: "text-emerald-600" };
  if (score >= 80) return { letter: "B", color: "text-blue-600" };
  if (score >= 70) return { letter: "C", color: "text-amber-600" };
  if (score >= 60) return { letter: "D", color: "text-orange-600" };
  return { letter: "F", color: "text-red-600" };
}

export default function SchoolGradebook() {
  const { user, loading } = useAuth();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const preselectedStudentId = params.get("student") ? parseInt(params.get("student")!) : null;

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(preselectedStudentId);

  const { data: students = [] } = trpc.schoolhouse.getStudents.useQuery();
  const { data: grades = [] } = trpc.schoolhouse.getProgress.useQuery(
    { studentId: selectedStudentId! },
    { enabled: !!selectedStudentId }
  );
  const { data: courses = [] } = trpc.schoolhouse.getCourses.useQuery();

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Group grades by course
  const gradesByCourse: Record<number, typeof grades> = {};
  for (const g of grades) {
    const cid = g.courseId ?? 0;
    if (!gradesByCourse[cid]) gradesByCourse[cid] = [];
    gradesByCourse[cid].push(g);
  }

  const courseAverage = (courseGrades: typeof grades) => {
    const scored = courseGrades.filter(g => g.quizScore !== null);
    if (!scored.length) return null;
    return Math.round(scored.reduce((sum, g) => sum + (g.quizScore ?? 0), 0) / scored.length);
  };

  const overallAverage = () => {
    const scored = grades.filter(g => g.quizScore !== null);
    if (!scored.length) return null;
    return Math.round(scored.reduce((sum, g) => sum + (g.quizScore ?? 0), 0) / scored.length);
  };

  function exportCSV() {
    if (!selectedStudent || grades.length === 0) return;
    const rows: string[][] = [
      ["Student", "Course", "Lesson", "Quiz Score", "Letter Grade", "Completed", "Date"],
    ];
    for (const g of grades) {
      const course = courses.find(c => c.id === g.courseId);
      const score = g.quizScore ?? "";
      const letter = typeof score === "number" ? letterGrade(score).letter : "";
      rows.push([
        selectedStudent.name,
        course?.title ?? `Course ${g.courseId}`,
        g.lessonTitle ?? `Lesson ${g.lessonId}`,
        String(score),
        letter,
        g.isCompleted ? "Yes" : "No",
        g.completedAt ? new Date(g.completedAt).toLocaleDateString() : "",
      ]);
    }
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gradebook-${selectedStudent.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return null;
  if (!user) {
    return (
      <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
        <Navigation />
        <div className="container py-20 text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-[oklch(0.55_0.05_50)] opacity-40" />
          <h2 className="text-xl font-bold text-[oklch(0.25_0.05_50)] mb-2">Sign in to view grades</h2>
          <a href={getLoginUrl()} className="inline-block bg-[oklch(0.35_0.08_50)] text-white px-6 py-3 rounded-lg font-semibold mt-4">Sign In</a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
      <Navigation />

      <div className="container pt-6 pb-2">
        <Link href="/schoolhouse">
          <button className="flex items-center gap-1.5 text-sm text-[oklch(0.45_0.05_50)] hover:text-[oklch(0.35_0.08_50)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to The Schoolhouse
          </button>
        </Link>
      </div>

      <div className="container py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[oklch(0.25_0.05_50)]">Grade Book</h1>
            <p className="text-sm text-[oklch(0.45_0.05_50)] mt-0.5">Track quiz scores and lesson completion.</p>
          </div>
          {selectedStudent && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                disabled={grades.length === 0}
                className="flex items-center gap-2 text-sm border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] px-3 py-2 rounded-lg hover:bg-[oklch(0.96_0.02_80)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Export grades as CSV"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 text-sm border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] px-3 py-2 rounded-lg hover:bg-[oklch(0.96_0.02_80)] transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Report
              </button>
            </div>
          )}
        </div>

        {/* Student selector */}
        {students.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-10 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-[oklch(0.75_0.05_50)]" />
            <p className="text-[oklch(0.45_0.05_50)] font-medium">No students yet.</p>
            <Link href="/schoolhouse/students">
              <button className="mt-4 text-sm text-[oklch(0.35_0.08_50)] underline">Add a student first</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {students.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStudentId === s.id
                      ? "bg-[oklch(0.35_0.08_50)] text-white"
                      : "bg-white border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] hover:border-[oklch(0.65_0.08_50)]"
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-[oklch(0.88_0.05_80)] text-[oklch(0.35_0.08_50)] text-xs font-bold flex items-center justify-center">
                    {s.name.charAt(0)}
                  </span>
                  {s.name}
                  <span className="text-xs opacity-70">Gr. {GRADE_LABELS[s.gradeLevel ?? 0]}</span>
                </button>
              ))}
            </div>

            {selectedStudent && (
              <>
                {/* Summary card */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-4 text-center">
                    <div className="text-3xl font-bold text-[oklch(0.25_0.05_50)]">{grades.length}</div>
                    <div className="text-xs text-[oklch(0.55_0.05_50)] mt-1">Lessons Completed</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-4 text-center">
                    <div className="text-3xl font-bold text-[oklch(0.25_0.05_50)]">
                      {Object.keys(gradesByCourse).length}
                    </div>
                    <div className="text-xs text-[oklch(0.55_0.05_50)] mt-1">Courses Started</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-4 text-center">
                    {overallAverage() !== null ? (
                      <>
                        <div className={`text-3xl font-bold ${letterGrade(overallAverage()!).color}`}>
                          {letterGrade(overallAverage()!).letter}
                        </div>
                        <div className="text-xs text-[oklch(0.55_0.05_50)] mt-1">Overall Average ({overallAverage()}%)</div>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-[oklch(0.75_0.05_50)]">—</div>
                        <div className="text-xs text-[oklch(0.55_0.05_50)] mt-1">No quiz scores yet</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Grades by course */}
                {grades.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-10 text-center">
                    <TrendingUp className="w-10 h-10 mx-auto mb-3 text-[oklch(0.75_0.05_50)]" />
                    <p className="text-[oklch(0.45_0.05_50)]">No grades recorded yet for {selectedStudent.name}.</p>
                    <Link href="/schoolhouse">
                      <button className="mt-3 text-sm text-[oklch(0.35_0.08_50)] underline">Start a course</button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(gradesByCourse).map(([courseIdStr, courseGrades]) => {
                      const cId = parseInt(courseIdStr);
                      const course = courses.find(c => c.id === cId);
                      const avg = courseAverage(courseGrades);
                      return (
                        <div key={cId} className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] overflow-hidden">
                          <div className="px-5 py-4 border-b border-[oklch(0.93_0.02_80)] flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-[oklch(0.25_0.05_50)]">{course?.title ?? `Course #${cId}`}</h3>
                              <p className="text-xs text-[oklch(0.55_0.05_50)]">{course?.subject}</p>
                            </div>
                            {avg !== null && (
                              <div className="text-right">
                                <div className={`text-xl font-bold ${letterGrade(avg).color}`}>{letterGrade(avg).letter}</div>
                                <div className="text-xs text-[oklch(0.55_0.05_50)]">{avg}% avg</div>
                              </div>
                            )}
                          </div>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-[oklch(0.97_0.01_80)]">
                                <th className="text-left px-5 py-2 text-xs font-semibold text-[oklch(0.55_0.05_50)] uppercase tracking-wide">Lesson</th>
                                <th className="text-center px-5 py-2 text-xs font-semibold text-[oklch(0.55_0.05_50)] uppercase tracking-wide">Score</th>
                                <th className="text-center px-5 py-2 text-xs font-semibold text-[oklch(0.55_0.05_50)] uppercase tracking-wide">Grade</th>
                                <th className="text-right px-5 py-2 text-xs font-semibold text-[oklch(0.55_0.05_50)] uppercase tracking-wide">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[oklch(0.95_0.01_80)]">
                              {courseGrades.map(g => (
                                <tr key={g.id} className="hover:bg-[oklch(0.98_0.01_80)]">
                                  <td className="px-5 py-3 text-[oklch(0.35_0.05_50)]">{g.lessonTitle ?? `Lesson #${g.lessonId}`}</td>
                                  <td className="px-5 py-3 text-center text-[oklch(0.45_0.05_50)]">
                                    {g.quizScore !== null ? `${g.quizScore}%` : "—"}
                                  </td>
                                  <td className="px-5 py-3 text-center">
                                    {g.quizScore !== null ? (
                                      <span className={`font-bold ${letterGrade(g.quizScore).color}`}>
                                        {letterGrade(g.quizScore).letter}
                                      </span>
                                    ) : "—"}
                                  </td>
                                  <td className="px-5 py-3 text-right text-[oklch(0.55_0.05_50)] text-xs">
                                    {g.completedAt ? new Date(g.completedAt).toLocaleDateString() : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

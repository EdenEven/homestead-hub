import { useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, ChevronDown, Printer, Youtube, Package } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import ReactMarkdown from "react-markdown";

const GRADE_LABELS: Record<number, string> = {
  0: "K", 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th",
  6: "6th", 7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
};

function gradeRange(min: number, max: number) {
  if (min === max) return `Grade ${GRADE_LABELS[min]}`;
  return `Grades ${GRADE_LABELS[min]}–${GRADE_LABELS[max]}`;
}

export default function SchoolCourse() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "0");
  const { user } = useAuth();

  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const { data: course, isLoading: courseLoading } = trpc.schoolhouse.getCourse.useQuery({ id: courseId });
  const { data: lessons = [], isLoading: lessonsLoading } = trpc.schoolhouse.getLessons.useQuery({ courseId });
  const { data: students = [] } = trpc.schoolhouse.getStudents.useQuery(undefined, { enabled: !!user });

  const activeLesson = lessons.find(l => l.id === activeLessonId) ?? lessons[0] ?? null;
  const { data: quiz } = trpc.schoolhouse.getQuiz.useQuery(
    { lessonId: activeLesson?.id ?? 0 },
    { enabled: !!activeLesson }
  );

  const markComplete = trpc.schoolhouse.markComplete.useMutation();

  function handleQuizSubmit(studentId: number) {
    if (!quiz) return;
    let correct = 0;
    for (const q of quiz.questions) {
      if (quizAnswers[q.id] === q.correctAnswer) correct++;
    }
    const score = Math.round((correct / quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    markComplete.mutate({
      studentId,
      lessonId: activeLesson!.id,
      quizScore: score,
    });
  }

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
        <Navigation />
        <div className="container py-20 text-center text-[oklch(0.55_0.05_50)]">Loading course...</div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
        <Navigation />
        <div className="container py-20 text-center">
          <p className="text-lg text-[oklch(0.45_0.05_50)]">Course not found.</p>
          <Link href="/schoolhouse"><button className="mt-4 text-[oklch(0.35_0.08_50)] underline">Back to Schoolhouse</button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentLesson = activeLesson ?? (lessons.length > 0 ? lessons[0] : null);

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
      <Navigation />

      {/* Breadcrumb */}
      <div className="container pt-6 pb-2">
        <Link href="/schoolhouse">
          <button className="flex items-center gap-1.5 text-sm text-[oklch(0.45_0.05_50)] hover:text-[oklch(0.35_0.08_50)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to The Schoolhouse
          </button>
        </Link>
      </div>

      {/* Course header */}
      <div className="bg-[oklch(0.25_0.05_50)] text-white">
        <div className="container py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[oklch(0.75_0.15_80)] text-sm font-semibold mb-1">{course.subject}</div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-white/70 max-w-2xl text-sm leading-relaxed">{course.description}</p>
              <div className="mt-3 text-sm text-white/60">
                {gradeRange(course.gradeMin, course.gradeMax)} · {lessons.length} Lessons
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout: sidebar + content */}
      <div className="container py-8">
        <div className="flex gap-6 flex-col lg:flex-row">

          {/* Lesson sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] overflow-hidden sticky top-4">
              <div className="px-4 py-3 border-b border-[oklch(0.88_0.03_80)] bg-[oklch(0.96_0.02_80)]">
                <h2 className="font-semibold text-[oklch(0.25_0.05_50)] text-sm">Course Lessons</h2>
              </div>
              <ul className="divide-y divide-[oklch(0.93_0.02_80)]">
                {lessons.map((lesson, idx) => (
                  <li key={lesson.id}>
                    <button
                      onClick={() => {
                        setActiveLessonId(lesson.id);
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                        setQuizScore(null);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[oklch(0.96_0.02_80)] transition-colors ${
                        currentLesson?.id === lesson.id ? "bg-[oklch(0.93_0.04_80)]" : ""
                      }`}
                    >
                      <span className="shrink-0 w-6 h-6 rounded-full bg-[oklch(0.88_0.04_80)] text-[oklch(0.35_0.08_50)] text-xs font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-[oklch(0.35_0.05_50)] leading-snug">{lesson.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Lesson content */}
          <main className="flex-1 min-w-0">
            {currentLesson ? (
              <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] overflow-hidden">
                {/* Lesson header */}
                <div className="px-6 py-5 border-b border-[oklch(0.88_0.03_80)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[oklch(0.25_0.05_50)]">{currentLesson.title}</h2>
                      {currentLesson.objective && (
                        <p className="mt-1 text-sm text-[oklch(0.45_0.05_50)] italic">
                          <strong>Objective:</strong> {currentLesson.objective}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="shrink-0 flex items-center gap-1.5 text-sm text-[oklch(0.45_0.05_50)] hover:text-[oklch(0.35_0.08_50)] border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-1.5 hover:bg-[oklch(0.96_0.02_80)] transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>

                  {/* Materials */}
                  {currentLesson.materials && (
                    <div className="mt-3 flex items-start gap-2 bg-[oklch(0.96_0.02_80)] rounded-lg p-3">
                      <Package className="w-4 h-4 text-[oklch(0.45_0.08_80)] mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-[oklch(0.35_0.05_50)] uppercase tracking-wide">Materials Needed: </span>
                        <span className="text-sm text-[oklch(0.45_0.05_50)]">{currentLesson.materials}</span>
                      </div>
                    </div>
                  )}

                  {/* Video embed */}
                  {currentLesson.videoUrl && (
                    <div className="mt-3">
                      <a href={currentLesson.videoUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium">
                        <Youtube className="w-4 h-4" />
                        Watch Lesson Video
                      </a>
                    </div>
                  )}
                </div>

                {/* Lesson body — markdown */}
                <div className="px-6 py-6 prose prose-sm max-w-none prose-headings:text-[oklch(0.25_0.05_50)] prose-p:text-[oklch(0.35_0.05_50)] prose-li:text-[oklch(0.35_0.05_50)] prose-strong:text-[oklch(0.25_0.05_50)] prose-blockquote:border-[oklch(0.75_0.15_80)] prose-blockquote:text-[oklch(0.45_0.05_50)] prose-code:bg-[oklch(0.93_0.02_80)] prose-code:text-[oklch(0.35_0.08_50)] prose-code:px-1 prose-code:rounded">
                  {currentLesson.content ? (
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  ) : (
                    <p className="text-[oklch(0.55_0.05_50)] italic">Lesson content coming soon.</p>
                  )}
                </div>

                {/* Quiz section */}
                {quiz && quiz.questions.length > 0 && (
                  <div className="border-t border-[oklch(0.88_0.03_80)] px-6 py-6">
                    <h3 className="font-bold text-[oklch(0.25_0.05_50)] text-lg mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[oklch(0.55_0.15_80)]" />
                      {quiz.title}
                    </h3>

                    {quizSubmitted ? (
                      <div className={`rounded-xl p-5 text-center ${quizScore! >= 80 ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
                        <div className="text-4xl font-bold mb-2">{quizScore}%</div>
                        <div className={`font-semibold ${quizScore! >= 80 ? "text-emerald-700" : "text-amber-700"}`}>
                          {quizScore! >= 80 ? "Great work! Lesson complete." : "Good effort! Review the lesson and try again."}
                        </div>
                        {quizScore! < 80 && (
                          <button
                            onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(null); }}
                            className="mt-3 text-sm text-amber-700 underline"
                          >
                            Retake Quiz
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {quiz.questions.map((q, qi) => (
                          <div key={q.id} className="bg-[oklch(0.97_0.01_80)] rounded-xl p-4">
                            <p className="font-medium text-[oklch(0.25_0.05_50)] mb-3">{qi + 1}. {q.question}</p>
                            <div className="space-y-2">
                              {(["A", "B", "C", "D"] as const).map(opt => {
                                const text = opt === "A" ? q.optionA : opt === "B" ? q.optionB : opt === "C" ? q.optionC : q.optionD;
                                if (!text) return null;
                                return (
                                  <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                                    quizAnswers[q.id] === opt
                                      ? "border-[oklch(0.55_0.15_80)] bg-[oklch(0.93_0.05_80)]"
                                      : "border-[oklch(0.88_0.03_80)] bg-white hover:border-[oklch(0.75_0.10_80)]"
                                  }`}>
                                    <input
                                      type="radio"
                                      name={`q-${q.id}`}
                                      value={opt}
                                      checked={quizAnswers[q.id] === opt}
                                      onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                      className="sr-only"
                                    />
                                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                                      quizAnswers[q.id] === opt
                                        ? "border-[oklch(0.55_0.15_80)] bg-[oklch(0.55_0.15_80)] text-white"
                                        : "border-[oklch(0.75_0.05_80)] text-[oklch(0.55_0.05_50)]"
                                    }`}>{opt}</span>
                                    <span className="text-sm text-[oklch(0.35_0.05_50)]">{text}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        {/* Submit — if logged in with students, pick student; else just score */}
                        {students.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {students.map(s => (
                              <button
                                key={s.id}
                                disabled={Object.keys(quizAnswers).length < quiz.questions.length}
                                onClick={() => handleQuizSubmit(s.id)}
                                className="px-5 py-2.5 bg-[oklch(0.35_0.08_50)] text-white rounded-lg text-sm font-semibold hover:bg-[oklch(0.28_0.07_50)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                Submit for {s.name}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            disabled={Object.keys(quizAnswers).length < quiz.questions.length}
                            onClick={() => {
                              let correct = 0;
                              for (const q of quiz.questions) {
                                if (quizAnswers[q.id] === q.correctAnswer) correct++;
                              }
                              setQuizScore(Math.round((correct / quiz.questions.length) * 100));
                              setQuizSubmitted(true);
                            }}
                            className="px-5 py-2.5 bg-[oklch(0.35_0.08_50)] text-white rounded-lg text-sm font-semibold hover:bg-[oklch(0.28_0.07_50)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Check My Answers
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation between lessons */}
                <div className="border-t border-[oklch(0.88_0.03_80)] px-6 py-4 flex justify-between items-center">
                  {lessons.indexOf(currentLesson) > 0 ? (
                    <button
                      onClick={() => {
                        const idx = lessons.indexOf(currentLesson);
                        setActiveLessonId(lessons[idx - 1].id);
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                        setQuizScore(null);
                      }}
                      className="flex items-center gap-1.5 text-sm text-[oklch(0.45_0.05_50)] hover:text-[oklch(0.35_0.08_50)]"
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous Lesson
                    </button>
                  ) : <div />}
                  {lessons.indexOf(currentLesson) < lessons.length - 1 ? (
                    <button
                      onClick={() => {
                        const idx = lessons.indexOf(currentLesson);
                        setActiveLessonId(lessons[idx + 1].id);
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                        setQuizScore(null);
                      }}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[oklch(0.35_0.08_50)] hover:text-[oklch(0.25_0.05_50)]"
                    >
                      Next Lesson <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                      <CheckCircle className="w-4 h-4" /> Course Complete!
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-12 text-center text-[oklch(0.55_0.05_50)]">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No lessons available yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

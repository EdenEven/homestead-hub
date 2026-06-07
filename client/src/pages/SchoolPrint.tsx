/**
 * SchoolPrint — Printable Lesson Packet
 * A clean, branded, print-ready page for a full course.
 * Accessed at /schoolhouse/course/:id/print
 * Uses @media print CSS to hide UI chrome and show only lesson content.
 */
import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Printer } from "lucide-react";

const GRADE_LABELS: Record<number, string> = {
  0: "K", 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th",
  6: "6th", 7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
};

function gradeRange(min: number, max: number) {
  if (min === max) return `Grade ${GRADE_LABELS[min]}`;
  return `Grades ${GRADE_LABELS[min]}–${GRADE_LABELS[max]}`;
}

export default function SchoolPrint() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "0");

  const { data: course, isLoading: courseLoading } = trpc.schoolhouse.getCourse.useQuery({ id: courseId });
  const { data: lessons = [], isLoading: lessonsLoading } = trpc.schoolhouse.getLessons.useQuery({ courseId });

  // Auto-trigger print dialog after content loads
  useEffect(() => {
    if (!courseLoading && !lessonsLoading && course && lessons.length > 0) {
      const timer = setTimeout(() => window.print(), 800);
      return () => clearTimeout(timer);
    }
  }, [courseLoading, lessonsLoading, course, lessons.length]);

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading lesson packet…</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Screen-only controls */}
      <div className="print:hidden bg-[oklch(0.25_0.06_50)] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href={`/schoolhouse/course/${courseId}`}>
          <button className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/70">Print-ready lesson packet</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[oklch(0.68_0.12_65)] hover:bg-[oklch(0.60_0.12_65)] text-[oklch(0.18_0.06_145)] font-bold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Print content */}
      <div className="max-w-[8.5in] mx-auto px-8 py-8 bg-white" id="print-content">

        {/* Cover page */}
        <div className="print-page border-b-4 border-[oklch(0.45_0.08_60)] pb-10 mb-10">
          {/* Header brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-[oklch(0.25_0.06_50)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <div className="font-bold text-[oklch(0.25_0.06_50)] text-lg leading-none">The Homestead Hub</div>
              <div className="text-xs text-[oklch(0.55_0.05_50)] uppercase tracking-widest">Schoolhouse — Lesson Packet</div>
            </div>
          </div>

          {/* Course title block */}
          <div className="bg-[oklch(0.96_0.03_80)] rounded-2xl p-8 text-center">
            <div className="text-sm font-semibold text-[oklch(0.55_0.08_80)] uppercase tracking-widest mb-3">{course.subject}</div>
            <h1 className="text-4xl font-bold text-[oklch(0.20_0.05_50)] mb-4 leading-tight">{course.title}</h1>
            <p className="text-[oklch(0.45_0.05_50)] text-base max-w-2xl mx-auto leading-relaxed">{course.description}</p>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-[oklch(0.55_0.05_50)]">
              <span><strong>Grade Level:</strong> {gradeRange(course.gradeMin, course.gradeMax)}</span>
              <span>·</span>
              <span><strong>Lessons:</strong> {lessons.length}</span>
              <span>·</span>
              <span><strong>Printed:</strong> {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Table of contents */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-[oklch(0.25_0.05_50)] mb-4 border-b border-[oklch(0.88_0.03_80)] pb-2">Table of Contents</h2>
            <ol className="space-y-2">
              {lessons.map((lesson, idx) => (
                <li key={lesson.id} className="flex items-center gap-3 text-sm text-[oklch(0.35_0.05_50)]">
                  <span className="w-7 h-7 rounded-full bg-[oklch(0.88_0.04_80)] text-[oklch(0.35_0.08_50)] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{lesson.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Lessons */}
        {lessons.map((lesson, idx) => (
          <LessonSection key={lesson.id} lesson={lesson} index={idx + 1} courseId={courseId} />
        ))}

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-[oklch(0.88_0.03_80)] text-center text-xs text-[oklch(0.65_0.03_80)]">
          <p>Generated by The Homestead Hub Schoolhouse · a1homesteadhub.com</p>
          <p className="mt-1">Free for personal homeschool use. Please do not redistribute commercially.</p>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { font-size: 11pt; }
          #print-content { max-width: 100%; padding: 0.5in; }
          .print-page { page-break-after: always; }
          .lesson-section { page-break-before: always; }
          .lesson-section:first-of-type { page-break-before: avoid; }
          h1, h2, h3 { page-break-after: avoid; }
          .quiz-section { page-break-inside: avoid; }
        }
      `}</style>
    </>
  );
}

function LessonSection({ lesson, index, courseId }: { lesson: any; index: number; courseId: number }) {
  const { data: quiz } = trpc.schoolhouse.getQuiz.useQuery(
    { lessonId: lesson.id },
    { enabled: !!lesson.id }
  );

  return (
    <div className="lesson-section mb-12">
      {/* Lesson header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-[oklch(0.25_0.06_50)] text-white font-bold text-lg flex items-center justify-center shrink-0">
          {index}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[oklch(0.20_0.05_50)] leading-tight">{lesson.title}</h2>
          {lesson.objective && (
            <p className="text-sm text-[oklch(0.50_0.05_50)] mt-1 italic">
              <strong>Learning Objective:</strong> {lesson.objective}
            </p>
          )}
        </div>
      </div>

      {/* Materials */}
      {lesson.materials && (
        <div className="mb-4 bg-[oklch(0.96_0.02_80)] rounded-xl p-4 border-l-4 border-[oklch(0.68_0.12_65)]">
          <p className="text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1">Materials Needed</p>
          <p className="text-sm text-[oklch(0.45_0.05_50)]">{lesson.materials}</p>
        </div>
      )}

      {/* Lesson content */}
      <div className="prose prose-sm max-w-none prose-headings:text-[oklch(0.20_0.05_50)] prose-p:text-[oklch(0.30_0.04_50)] prose-li:text-[oklch(0.30_0.04_50)] prose-strong:text-[oklch(0.20_0.05_50)] prose-blockquote:border-[oklch(0.68_0.12_65)] prose-blockquote:text-[oklch(0.40_0.05_50)] mb-6">
        {lesson.content ? (
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        ) : (
          <p className="text-[oklch(0.55_0.05_50)] italic">Lesson content not available.</p>
        )}
      </div>

      {/* Quiz */}
      {quiz && quiz.questions.length > 0 && (
        <div className="quiz-section bg-[oklch(0.97_0.01_80)] rounded-2xl border border-[oklch(0.88_0.03_80)] p-6 mt-4">
          <h3 className="font-bold text-[oklch(0.25_0.05_50)] text-base mb-4 flex items-center gap-2">
            <span className="text-lg">📝</span> {quiz.title}
          </h3>
          <div className="space-y-5">
            {quiz.questions.map((q: any, qi: number) => (
              <div key={q.id} className="bg-white rounded-xl p-4 border border-[oklch(0.88_0.03_80)]">
                <p className="font-medium text-[oklch(0.25_0.05_50)] mb-3 text-sm">{qi + 1}. {q.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {([
                    { key: "A", text: q.optionA },
                    { key: "B", text: q.optionB },
                    { key: "C", text: q.optionC },
                    { key: "D", text: q.optionD },
                  ] as const).filter(o => o.text).map(o => (
                    <div key={o.key} className="flex items-start gap-2 text-sm text-[oklch(0.35_0.05_50)]">
                      <span className="w-6 h-6 rounded-full border-2 border-[oklch(0.75_0.05_80)] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {o.key}
                      </span>
                      <span>{o.text}</span>
                    </div>
                  ))}
                </div>
                {/* Answer key line — hidden on screen, shown on print */}
                <div className="mt-3 pt-3 border-t border-dashed border-[oklch(0.88_0.03_80)] text-xs text-[oklch(0.65_0.03_80)]">
                  Answer: ___
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="mt-10 border-b border-dashed border-[oklch(0.88_0.03_80)]" />
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Plus, Trash2, Save, BookOpen, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const GRADE_LABELS: Record<number, string> = {
  0: "K", 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th",
  6: "6th", 7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
};

const SUBJECTS = [
  "Science", "Mathematics", "Language Arts", "History + Social Studies",
  "Life Skills", "Art", "Music", "Physical Education", "Bible / Faith Studies",
  "Science + Life Skills", "Chemistry + Home Economics", "Language Arts + Science", "Other"
];

interface LessonDraft {
  title: string;
  objective: string;
  content: string;
  videoUrl: string;
  materials: string;
}

const emptyLesson = (): LessonDraft => ({
  title: "", objective: "", content: "", videoUrl: "", materials: "",
});

export default function SchoolBuilder() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  const [step, setStep] = useState<"course" | "lessons" | "done">("course");
  const [courseId, setCourseId] = useState<number | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<number>(0);

  // Course form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [gradeMin, setGradeMin] = useState(0);
  const [gradeMax, setGradeMax] = useState(5);

  // Lessons
  const [lessons, setLessons] = useState<LessonDraft[]>([emptyLesson()]);

  const createCourse = trpc.schoolhouse.createCourse.useMutation();
  const createLesson = trpc.schoolhouse.createLesson.useMutation();

  if (loading) return null;
  if (!user) {
    return (
      <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
        <Navigation />
        <div className="container py-20 text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-[oklch(0.55_0.05_50)] opacity-40" />
          <h2 className="text-xl font-bold text-[oklch(0.25_0.05_50)] mb-2">Sign in to build courses</h2>
          <p className="text-[oklch(0.45_0.05_50)] mb-6">The Course Builder is available to all Hub members.</p>
          <a href={getLoginUrl()}
            className="inline-block bg-[oklch(0.35_0.08_50)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[oklch(0.28_0.07_50)] transition-colors">
            Sign In
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  async function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault();
    const result = await createCourse.mutateAsync({ title, description, subject, gradeMin, gradeMax });
    setCourseId(result.id);
    setStep("lessons");
  }

  async function handleSaveLessons(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) return;
    for (let i = 0; i < lessons.length; i++) {
      const l = lessons[i];
      if (!l.title.trim()) continue;
      await createLesson.mutateAsync({
        courseId,
        title: l.title,
        objective: l.objective || undefined,
        content: l.content || undefined,
        videoUrl: l.videoUrl || undefined,
        materials: l.materials || undefined,
        sortOrder: i + 1,
      });
    }
    setStep("done");
  }

  function updateLesson(idx: number, field: keyof LessonDraft, value: string) {
    setLessons(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  }

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
      <Navigation />

      <div className="container pt-6 pb-2">
        <Link href="/schoolhouse">
          <button className="flex items-center gap-1.5 text-sm text-[oklch(0.45_0.05_50)] hover:text-[oklch(0.35_0.08_50)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to The Schoolhouse
          </button>
        </Link>
      </div>

      <div className="container py-6 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[oklch(0.25_0.05_50)]">Course Builder Studio</h1>
          <p className="text-[oklch(0.45_0.05_50)] mt-1">Create your own homestead curriculum — lessons, materials, and quizzes all in one place.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {["Course Details", "Add Lessons", "Published!"].map((label, idx) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                (step === "course" && idx === 0) || (step === "lessons" && idx === 1) || (step === "done" && idx === 2)
                  ? "bg-[oklch(0.35_0.08_50)] text-white"
                  : idx < (step === "lessons" ? 1 : step === "done" ? 2 : 0)
                  ? "bg-emerald-500 text-white"
                  : "bg-[oklch(0.88_0.03_80)] text-[oklch(0.55_0.05_50)]"
              }`}>
                {idx + 1}
              </div>
              <span className={`text-sm font-medium ${
                (step === "course" && idx === 0) || (step === "lessons" && idx === 1) || (step === "done" && idx === 2)
                  ? "text-[oklch(0.25_0.05_50)]"
                  : "text-[oklch(0.55_0.05_50)]"
              }`}>{label}</span>
              {idx < 2 && <div className="w-8 h-px bg-[oklch(0.88_0.03_80)]" />}
            </div>
          ))}
        </div>

        {/* Step 1: Course details */}
        {step === "course" && (
          <form onSubmit={handleCreateCourse} className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Course Title *</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Backyard Chickens 101"
                className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Description *</label>
              <textarea
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="What will students learn? What makes this course special?"
                className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Subject Area *</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Grade Level (Min)</label>
                <select
                  value={gradeMin}
                  onChange={e => setGradeMin(Number(e.target.value))}
                  className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                >
                  {Object.entries(GRADE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Grade Level (Max)</label>
                <select
                  value={gradeMax}
                  onChange={e => setGradeMax(Number(e.target.value))}
                  className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                >
                  {Object.entries(GRADE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={createCourse.isPending}
              className="w-full bg-[oklch(0.35_0.08_50)] text-white py-3 rounded-lg font-semibold hover:bg-[oklch(0.28_0.07_50)] disabled:opacity-50 transition-colors"
            >
              {createCourse.isPending ? "Creating..." : "Create Course & Add Lessons →"}
            </button>
          </form>
        )}

        {/* Step 2: Add lessons */}
        {step === "lessons" && (
          <form onSubmit={handleSaveLessons} className="space-y-4">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedLesson(expandedLesson === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[oklch(0.97_0.01_80)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[oklch(0.88_0.04_80)] text-[oklch(0.35_0.08_50)] text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-[oklch(0.25_0.05_50)]">
                      {lesson.title || `Lesson ${idx + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setLessons(prev => prev.filter((_, i) => i !== idx)); }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {expandedLesson === idx ? <ChevronUp className="w-4 h-4 text-[oklch(0.55_0.05_50)]" /> : <ChevronDown className="w-4 h-4 text-[oklch(0.55_0.05_50)]" />}
                  </div>
                </button>

                {expandedLesson === idx && (
                  <div className="px-5 pb-5 space-y-4 border-t border-[oklch(0.93_0.02_80)]">
                    <div className="pt-4">
                      <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Lesson Title *</label>
                      <input
                        required
                        value={lesson.title}
                        onChange={e => updateLesson(idx, "title", e.target.value)}
                        placeholder="e.g. Choosing the Right Breed"
                        className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Learning Objective</label>
                      <input
                        value={lesson.objective}
                        onChange={e => updateLesson(idx, "objective", e.target.value)}
                        placeholder="Students will be able to..."
                        className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Lesson Content (Markdown supported)</label>
                      <textarea
                        value={lesson.content}
                        onChange={e => updateLesson(idx, "content", e.target.value)}
                        rows={6}
                        placeholder="Write your lesson content here. Use ## for headings, **bold**, - for bullet points..."
                        className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)] resize-y font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">YouTube Video URL (optional)</label>
                      <input
                        value={lesson.videoUrl}
                        onChange={e => updateLesson(idx, "videoUrl", e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Materials Needed (optional)</label>
                      <input
                        value={lesson.materials}
                        onChange={e => updateLesson(idx, "materials", e.target.value)}
                        placeholder="e.g. Notebook, pencil, magnifying glass"
                        className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => { setLessons(prev => [...prev, emptyLesson()]); setExpandedLesson(lessons.length); }}
              className="w-full border-2 border-dashed border-[oklch(0.80_0.05_80)] text-[oklch(0.45_0.08_80)] py-3 rounded-xl text-sm font-semibold hover:border-[oklch(0.65_0.10_80)] hover:text-[oklch(0.35_0.08_50)] transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Another Lesson
            </button>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createLesson.isPending}
                className="flex-1 bg-[oklch(0.35_0.08_50)] text-white py-3 rounded-lg font-semibold hover:bg-[oklch(0.28_0.07_50)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {createLesson.isPending ? "Saving..." : "Save All Lessons & Publish"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Done */}
        {step === "done" && (
          <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[oklch(0.25_0.05_50)] mb-2">Course Published!</h2>
            <p className="text-[oklch(0.45_0.05_50)] mb-6">Your course is now live in The Schoolhouse and available to all Hub members.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/schoolhouse/course/${courseId}`}>
                <button className="px-6 py-3 bg-[oklch(0.35_0.08_50)] text-white rounded-lg font-semibold hover:bg-[oklch(0.28_0.07_50)] transition-colors">
                  View My Course
                </button>
              </Link>
              <button
                onClick={() => { setStep("course"); setCourseId(null); setTitle(""); setDescription(""); setLessons([emptyLesson()]); }}
                className="px-6 py-3 border border-[oklch(0.88_0.03_80)] text-[oklch(0.35_0.05_50)] rounded-lg font-semibold hover:bg-[oklch(0.96_0.02_80)] transition-colors"
              >
                Build Another Course
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

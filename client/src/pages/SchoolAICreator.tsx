import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getLoginUrl } from "@/const";
import {
  Sparkles, BookOpen, GraduationCap, ChevronRight,
  Loader2, CheckCircle, AlertCircle, Wand2, ArrowRight,
  Lightbulb, Clock, Layers, ImageIcon
} from "lucide-react";
import { toast } from "sonner";

const GRADE_OPTIONS = [
  { value: "K-2", label: "K–2nd Grade (Ages 5–8)" },
  { value: "3-5", label: "3rd–5th Grade (Ages 8–11)" },
  { value: "6-8", label: "6th–8th Grade (Ages 11–14)" },
  { value: "9-10", label: "9th–10th Grade (Ages 14–16)" },
  { value: "11-12", label: "11th–12th Grade / AP Prep (Ages 16–18)" },
];

const SUBJECT_OPTIONS = [
  "Homesteading & Self-Reliant Living",
  "STEM & Science",
  "Animal Husbandry",
  "Gardening & Botany",
  "Food Science & Preservation",
  "Building & Engineering",
  "Environmental Science",
  "Math Through Farming",
  "History & Heritage",
  "Health & Nutrition",
];

const LESSON_COUNT_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 10];

const EXAMPLE_PROMPTS = [
  "Teach my 7-year-old how to raise backyard chickens — from choosing breeds to collecting eggs",
  "A course on heirloom seed saving for middle schoolers, including plant biology and seed storage",
  "AP-level environmental science focused on soil health, composting, and sustainable farming",
  "How to build a raised garden bed — math, measurements, wood selection, and planting",
  "Water systems for off-grid living: rainwater collection, filtration, and gray water basics",
  "Goat care 101 for kids — feeding, health, milking, and basic veterinary knowledge",
];

type GenerateResult = {
  courseId: number;
  title: string;
  description: string;
  lessonCount: number;
};

export default function SchoolAICreator() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const [prompt, setPrompt] = useState("");
  const [gradeLevel, setGradeLevel] = useState("3-5");
  const [subject, setSubject] = useState("Homesteading & Self-Reliant Living");
  const [lessonCount, setLessonCount] = useState(5);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  const generateCoverMutation = trpc.schoolhouse.generateCourseCover.useMutation({
    onSuccess: (data) => {
      setCoverImageUrl(data.coverImageUrl ?? null);
      toast.success('Course cover generated!');
    },
    onError: (err) => {
      if (err.message === 'Schoolhouse Pro required') {
        toast.error('Upgrade to Schoolhouse Pro to generate course covers.');
      } else {
        toast.error('Cover generation failed. Please try again.');
      }
    },
  });
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateMutation = trpc.schoolhouse.generateCourse.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim() || prompt.trim().length < 10) return;
    setResult(null);
    setError(null);
    generateMutation.mutate({
      prompt: prompt.trim(),
      gradeLevel,
      subject,
      lessonCount,
    });
  };

  const isGenerating = generateMutation.isPending;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[oklch(0.97_0.02_80)]">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <GraduationCap className="w-16 h-16 text-[oklch(0.65_0.12_80)] mb-4" />
          <h2 className="text-2xl font-bold text-[oklch(0.25_0.05_50)] mb-2">Sign In to Use the AI Course Creator</h2>
          <p className="text-[oklch(0.55_0.05_50)] mb-6 max-w-md">Create a free account to generate unlimited custom homeschool courses powered by AI.</p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 bg-[oklch(0.55_0.15_80)] hover:bg-[oklch(0.48_0.15_80)] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Sign In Free <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.02_80)]">
      <Navigation />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[oklch(0.28_0.06_50)] to-[oklch(0.35_0.08_60)] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4 text-[oklch(0.85_0.15_80)]" />
            AI-Powered Curriculum Builder
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Describe It.<br />
            <span className="text-[oklch(0.85_0.15_80)]">AI Builds the Course.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Tell the AI what you want to teach — grade level, topic, how many lessons — and it writes the full course for you. Lessons, quizzes, activities, all of it. Ready to use in minutes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Lightbulb, step: "1", title: "Describe Your Course", desc: "Type what you want to teach in plain language. No curriculum experience needed." },
            { icon: Wand2, step: "2", title: "AI Builds It", desc: "The AI writes full lessons, activities, and quizzes tailored to your grade level." },
            { icon: BookOpen, step: "3", title: "Teach It Today", desc: "Your course is saved to The Schoolhouse and ready to use immediately." },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-6 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[oklch(0.93_0.05_80)] flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-[oklch(0.55_0.12_80)]" />
              </div>
              <div className="text-xs font-bold text-[oklch(0.65_0.08_80)] uppercase tracking-wider mb-1">Step {step}</div>
              <h3 className="font-bold text-[oklch(0.25_0.05_50)] mb-1">{title}</h3>
              <p className="text-sm text-[oklch(0.55_0.05_50)]">{desc}</p>
            </div>
          ))}
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] shadow-sm overflow-hidden mb-8">
          <div className="bg-[oklch(0.96_0.03_80)] px-6 py-4 border-b border-[oklch(0.88_0.03_80)]">
            <h2 className="font-bold text-[oklch(0.25_0.05_50)] text-lg flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[oklch(0.55_0.12_80)]" />
              Create Your Course
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-2">
                Describe what you want to teach <span className="text-red-500">*</span>
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. Teach my 8-year-old how to raise backyard chickens — from choosing breeds to collecting eggs and basic health care"
                rows={4}
                className="w-full border border-[oklch(0.85_0.03_80)] rounded-xl px-4 py-3 text-sm text-[oklch(0.25_0.05_50)] placeholder-[oklch(0.70_0.03_80)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.12_80)] resize-none"
                disabled={isGenerating}
              />
              <p className="text-xs text-[oklch(0.60_0.04_80)] mt-1">{prompt.length}/1000 characters</p>
            </div>

            {/* Example prompts */}
            <div>
              <p className="text-xs font-semibold text-[oklch(0.55_0.05_50)] uppercase tracking-wider mb-2">Try one of these:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex)}
                    disabled={isGenerating}
                    className="text-xs bg-[oklch(0.95_0.03_80)] hover:bg-[oklch(0.90_0.05_80)] text-[oklch(0.40_0.05_50)] px-3 py-1.5 rounded-full border border-[oklch(0.88_0.03_80)] transition-colors text-left"
                  >
                    {ex.length > 60 ? ex.slice(0, 60) + "…" : ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Options row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Grade Level</label>
                <select
                  value={gradeLevel}
                  onChange={e => setGradeLevel(e.target.value)}
                  disabled={isGenerating}
                  className="w-full border border-[oklch(0.85_0.03_80)] rounded-xl px-3 py-2.5 text-sm text-[oklch(0.25_0.05_50)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.12_80)] bg-white"
                >
                  {GRADE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">Subject Area</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  disabled={isGenerating}
                  className="w-full border border-[oklch(0.85_0.03_80)] rounded-xl px-3 py-2.5 text-sm text-[oklch(0.25_0.05_50)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.12_80)] bg-white"
                >
                  {SUBJECT_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[oklch(0.35_0.05_50)] mb-1.5">
                  <Layers className="inline w-3.5 h-3.5 mr-1" />
                  Number of Lessons
                </label>
                <select
                  value={lessonCount}
                  onChange={e => setLessonCount(Number(e.target.value))}
                  disabled={isGenerating}
                  className="w-full border border-[oklch(0.85_0.03_80)] rounded-xl px-3 py-2.5 text-sm text-[oklch(0.25_0.05_50)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.12_80)] bg-white"
                >
                  {LESSON_COUNT_OPTIONS.map(n => (
                    <option key={n} value={n}>{n} lessons</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time estimate */}
            <div className="flex items-center gap-2 text-sm text-[oklch(0.55_0.05_50)] bg-[oklch(0.96_0.02_80)] rounded-xl px-4 py-3">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Generation takes <strong>30–60 seconds</strong> depending on lesson count. The AI writes full lesson content and quizzes — this is not a quick summary.</span>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || prompt.trim().length < 10}
              className="w-full flex items-center justify-center gap-3 bg-[oklch(0.45_0.12_50)] hover:bg-[oklch(0.38_0.12_50)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-md"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Building your course… this takes about 30–60 seconds
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Course with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generating progress */}
        {isGenerating && (
          <div className="bg-[oklch(0.96_0.04_80)] border border-[oklch(0.88_0.06_80)] rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-5 h-5 text-[oklch(0.55_0.12_80)] animate-spin" />
              <span className="font-semibold text-[oklch(0.35_0.05_50)]">AI is building your course…</span>
            </div>
            <div className="space-y-2 text-sm text-[oklch(0.50_0.05_50)]">
              {[
                "Designing course structure and learning objectives",
                `Writing ${lessonCount} full lessons with homestead examples`,
                "Creating quiz questions for each lesson",
                "Adding hands-on activities and fun facts",
                "Saving everything to your Schoolhouse",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.10_80)]" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700 mb-1">Generation failed</p>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={handleGenerate}
                className="mt-3 text-sm font-medium text-red-700 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Success result */}
        {result && (
          <div className="bg-white rounded-2xl border-2 border-[oklch(0.70_0.15_145)] shadow-lg overflow-hidden mb-8">
            <div className="bg-[oklch(0.92_0.08_145)] px-6 py-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-[oklch(0.45_0.15_145)]" />
              <div>
                <p className="font-bold text-[oklch(0.25_0.08_145)] text-lg">Course Created!</p>
                <p className="text-sm text-[oklch(0.40_0.08_145)]">Saved to your Schoolhouse and ready to use</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[oklch(0.25_0.05_50)] mb-2">{result.title}</h3>
              <p className="text-[oklch(0.50_0.05_50)] mb-4">{result.description}</p>
              <div className="flex items-center gap-4 text-sm text-[oklch(0.55_0.05_50)] mb-6">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {result.lessonCount} lessons with quizzes
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Grade {gradeLevel}
                </span>
              </div>
              {/* AI Cover Image (Pro) */}
              {coverImageUrl ? (
                <div className="mb-5 rounded-xl overflow-hidden border border-[oklch(0.88_0.03_80)]">
                  <img src={coverImageUrl} alt="Course cover" className="w-full h-48 object-cover" />
                  <p className="text-xs text-center text-[oklch(0.55_0.05_50)] py-2 bg-[oklch(0.97_0.01_80)]">AI-generated course cover · saved to your course</p>
                </div>
              ) : (
                <div className="mb-5">
                  <button
                    onClick={() => generateCoverMutation.mutate({
                      courseId: result.courseId,
                      title: result.title,
                      subject,
                      description: result.description,
                    })}
                    disabled={generateCoverMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[oklch(0.75_0.08_80)] text-[oklch(0.45_0.08_80)] hover:border-[oklch(0.55_0.12_80)] hover:text-[oklch(0.35_0.12_80)] hover:bg-[oklch(0.97_0.02_80)] font-semibold py-3 rounded-xl transition-all"
                  >
                    {generateCoverMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Generating cover…</>
                    ) : (
                      <><ImageIcon className="w-4 h-4" /> Generate AI Cover Image <span className="text-xs bg-[oklch(0.75_0.15_80)] text-[oklch(0.25_0.05_50)] px-1.5 py-0.5 rounded-full font-bold ml-1">Pro</span></>
                    )}
                  </button>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/schoolhouse/course/${result.courseId}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[oklch(0.45_0.12_50)] hover:bg-[oklch(0.38_0.12_50)] text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Open Course <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/schoolhouse")}
                  className="flex-1 flex items-center justify-center gap-2 border border-[oklch(0.85_0.03_80)] text-[oklch(0.45_0.05_50)] hover:bg-[oklch(0.96_0.02_80)] font-semibold py-3 rounded-xl transition-colors"
                >
                  Back to Schoolhouse
                </button>
                <button
                  onClick={() => { setResult(null); setPrompt(""); setCoverImageUrl(null); }}
                  className="flex-1 flex items-center justify-center gap-2 border border-[oklch(0.85_0.03_80)] text-[oklch(0.45_0.05_50)] hover:bg-[oklch(0.96_0.02_80)] font-semibold py-3 rounded-xl transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Another
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

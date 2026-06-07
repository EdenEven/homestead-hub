import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, GraduationCap, Users, Pencil, ChevronRight, Star, Sprout, Sparkles } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const GRADE_LABELS: Record<number, string> = {
  0: "K", 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th",
  6: "6th", 7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
};

const SUBJECT_COLORS: Record<string, string> = {
  "Science + Life Skills": "bg-emerald-100 text-emerald-800",
  "Mathematics": "bg-blue-100 text-blue-800",
  "History + Social Studies": "bg-amber-100 text-amber-800",
  "Language Arts + Science": "bg-purple-100 text-purple-800",
  "Chemistry + Home Economics": "bg-rose-100 text-rose-800",
};

const SUBJECT_ICONS: Record<string, string> = {
  "Science + Life Skills": "🌱",
  "Mathematics": "📐",
  "History + Social Studies": "📜",
  "Language Arts + Science": "📓",
  "Chemistry + Home Economics": "🫙",
};

function gradeRange(min: number, max: number) {
  if (min === max) return `Grade ${GRADE_LABELS[min]}`;
  return `Grades ${GRADE_LABELS[min]}–${GRADE_LABELS[max]}`;
}

export default function Schoolhouse() {
  const { user } = useAuth();
  const [gradeFilter, setGradeFilter] = useState<"all" | "k5" | "6-8" | "9-12">("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const { data: courses = [], isLoading } = trpc.schoolhouse.getCourses.useQuery();

  const subjects = Array.from(new Set(courses.map(c => c.subject)));

  const filtered = courses.filter(c => {
    const gradeOk = gradeFilter === "all"
      ? true
      : gradeFilter === "k5" ? c.gradeMin <= 5
      : gradeFilter === "6-8" ? c.gradeMax >= 6 && c.gradeMin <= 8
      : c.gradeMax >= 9;
    const subjectOk = subjectFilter === "all" || c.subject === subjectFilter;
    return gradeOk && subjectOk;
  });

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-[oklch(0.25_0.05_50)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="container py-16 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[oklch(0.75_0.15_80)] rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-[oklch(0.25_0.05_50)]" />
            </div>
            <span className="text-[oklch(0.75_0.15_80)] font-semibold tracking-wide uppercase text-sm">A1 Homestead Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            The Schoolhouse
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mb-8">
            Homeschool curriculum rooted in real life. Courses built around the homestead — 
            science, math, history, and language arts through the lens of living close to the land.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[oklch(0.75_0.15_80)]" />
              <span>{courses.length} Courses Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[oklch(0.75_0.15_80)]" />
              <span>K–12 Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[oklch(0.75_0.15_80)]" />
              <span>Free for Hub Members</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick nav cards */}
      <section className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/schoolhouse/students">
            <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-[oklch(0.93_0.05_80)] rounded-lg flex items-center justify-center group-hover:bg-[oklch(0.75_0.15_80)] transition-colors">
                <Users className="w-6 h-6 text-[oklch(0.35_0.08_50)]" />
              </div>
              <div>
                <div className="font-semibold text-[oklch(0.25_0.05_50)]">My Students</div>
                <div className="text-sm text-[oklch(0.45_0.05_50)]">Manage student profiles</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[oklch(0.55_0.05_50)] ml-auto" />
            </div>
          </Link>
          <Link href="/schoolhouse/gradebook">
            <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-[oklch(0.93_0.05_80)] rounded-lg flex items-center justify-center group-hover:bg-[oklch(0.75_0.15_80)] transition-colors">
                <BookOpen className="w-6 h-6 text-[oklch(0.35_0.08_50)]" />
              </div>
              <div>
                <div className="font-semibold text-[oklch(0.25_0.05_50)]">Grade Book</div>
                <div className="text-sm text-[oklch(0.45_0.05_50)]">Track grades & progress</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[oklch(0.55_0.05_50)] ml-auto" />
            </div>
          </Link>
          {user && (
            <Link href="/schoolhouse/builder">
              <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 bg-[oklch(0.93_0.05_80)] rounded-lg flex items-center justify-center group-hover:bg-[oklch(0.75_0.15_80)] transition-colors">
                  <Pencil className="w-6 h-6 text-[oklch(0.35_0.08_50)]" />
                </div>
                <div>
                  <div className="font-semibold text-[oklch(0.25_0.05_50)]">Course Builder</div>
                  <div className="text-sm text-[oklch(0.45_0.05_50)]">Create your own courses</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[oklch(0.55_0.05_50)] ml-auto" />
              </div>
            </Link>
          )}
          {user && (
            <Link href="/schoolhouse/ai-creator">
              <div className="bg-gradient-to-br from-[oklch(0.28_0.06_50)] to-[oklch(0.38_0.08_65)] rounded-xl border border-[oklch(0.45_0.08_60)] p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[oklch(0.85_0.15_80)]" />
                </div>
                <div>
                  <div className="font-semibold text-white">AI Course Creator</div>
                  <div className="text-sm text-white/75">Describe it — AI builds it</div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/60 ml-auto" />
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="container pb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-[oklch(0.45_0.05_50)]">Grade Level:</span>
          {(["all", "k5", "6-8", "9-12"] as const).map(g => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                gradeFilter === g
                  ? "bg-[oklch(0.35_0.08_50)] text-white"
                  : "bg-white border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] hover:border-[oklch(0.55_0.08_50)]"
              }`}
            >
              {g === "all" ? "All Grades" : g === "k5" ? "K–5" : g === "6-8" ? "6th–8th" : "9th–12th"}
            </button>
          ))}
          <span className="text-sm font-medium text-[oklch(0.45_0.05_50)] ml-4">Subject:</span>
          <button
            onClick={() => setSubjectFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              subjectFilter === "all"
                ? "bg-[oklch(0.35_0.08_50)] text-white"
                : "bg-white border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] hover:border-[oklch(0.55_0.08_50)]"
            }`}
          >
            All Subjects
          </button>
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSubjectFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                subjectFilter === s
                  ? "bg-[oklch(0.35_0.08_50)] text-white"
                  : "bg-white border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] hover:border-[oklch(0.55_0.08_50)]"
              }`}
            >
              {SUBJECT_ICONS[s] || "📚"} {s}
            </button>
          ))}
        </div>
      </section>

      {/* Course grid */}
      <section className="container pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] h-64 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[oklch(0.55_0.05_50)]">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No courses match those filters.</p>
            <p className="text-sm mt-1">Try adjusting the grade level or subject.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <Link key={course.id} href={`/schoolhouse/course/${course.id}`}>
                <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full flex flex-col">
                  {/* Card header */}
                  <div className="bg-[oklch(0.25_0.05_50)] p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 text-6xl opacity-10 leading-none mt-2 mr-2">
                      {SUBJECT_ICONS[course.subject] || "📚"}
                    </div>
                    <div className="text-4xl mb-3">{SUBJECT_ICONS[course.subject] || "📚"}</div>
                    {course.isPrebuilt && (
                      <span className="inline-flex items-center gap-1 bg-[oklch(0.75_0.15_80)] text-[oklch(0.25_0.05_50)] text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                        <Star className="w-3 h-3" /> A1HSH Curated
                      </span>
                    )}
                    <h3 className="text-white font-bold text-lg leading-snug">{course.title}</h3>
                  </div>
                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${SUBJECT_COLORS[course.subject] || "bg-gray-100 text-gray-700"}`}>
                        {course.subject}
                      </span>
                      <span className="text-xs text-[oklch(0.55_0.05_50)] font-medium">
                        {gradeRange(course.gradeMin, course.gradeMax)}
                      </span>
                    </div>
                    <p className="text-sm text-[oklch(0.45_0.05_50)] leading-relaxed flex-1 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="mt-4 flex items-center text-[oklch(0.35_0.08_50)] text-sm font-semibold">
                      <span>Open Course</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

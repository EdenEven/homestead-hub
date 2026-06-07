import { useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, ChevronDown, Printer, Youtube, Package, Sparkles, Trash2, ChevronUp, FileText, Loader2, Share2, GraduationCap, MessageCircle, X, Volume2, VolumeX, Pause, Play } from "lucide-react";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { useAuth } from "@/_core/hooks/useAuth";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import ElevenLabsSetupModal from "@/components/ElevenLabsSetupModal";

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

  // Patreon share modal
  const [patreonShareText, setPatreonShareText] = useState<string | null>(null);
  const [patreonShareCopied, setPatreonShareCopied] = useState(false);

  function openPatreonShare(text: string) {
    setPatreonShareText(text);
    setPatreonShareCopied(false);
  }

  function copyAndOpenPatreon() {
    if (!patreonShareText) return;
    navigator.clipboard.writeText(patreonShareText).then(() => {
      setPatreonShareCopied(true);
      setTimeout(() => {
        window.open("https://www.patreon.com/posts/create", "_blank");
        setPatreonShareText(null);
      }, 800);
    });
  }

  // Tutor state
  const [showTutor, setShowTutor] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<Message[]>([]);
  const [tutorInitialized, setTutorInitialized] = useState(false);

  const tutorChatMutation = trpc.schoolhouse.tutorChat.useMutation({
    onSuccess: (data) => {
      setTutorMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    },
    onError: () => {
      setTutorMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I had a little trouble there. Could you try asking again?" }]);
    },
  });

  function handleTutorSend(content: string) {
    if (!course) return;
    const newMsg: Message = { role: "user", content };
    const updatedHistory = [...tutorMessages, newMsg];
    setTutorMessages(updatedHistory);
    tutorChatMutation.mutate({
      courseId,
      courseTitle: course.title,
      lessonId: currentLesson?.id,
      lessonTitle: currentLesson?.title,
      lessonContent: currentLesson?.content ?? undefined,
      userMessage: content,
      history: tutorMessages.map(m => ({ role: m.role, content: m.content })),
    });
  }

  function openTutor() {
    if (!tutorInitialized && course) {
      setTutorMessages([{
        role: "assistant",
        content: `Hello! I'm **Miss Hazel**, your personal tutor for *${course.title}*. 🌾\n\nI'm here to help you understand the lessons, answer your questions, and quiz you when you're ready. What would you like to explore today?`,
      }]);
      setTutorInitialized(true);
    }
    setShowTutor(true);
  }

  // Voice / ElevenLabs state
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: hasKeyData, refetch: refetchHasKey } = trpc.elevenLabs.hasKey.useQuery(
    undefined,
    { enabled: !!user }
  );
  const hasElevenLabsKey = hasKeyData?.hasKey ?? false;

  const speakMutation = trpc.elevenLabs.speak.useMutation({
    onSuccess: (data) => {
      // Stop any current audio
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      // Decode base64 and play
      const byteChars = atob(data.audioBase64);
      const bytes = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
      const blob = new Blob([bytes], { type: data.mimeType });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setIsPlayingAudio(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setIsPlayingAudio(false); };
      audio.play();
      setIsPlayingAudio(true);
    },
    onError: (err) => {
      setIsPlayingAudio(false);
      if (err.message === 'NO_KEY' || err.message === 'INVALID_KEY') {
        setShowVoiceSetup(true);
      } else {
        toast.error('Voice playback failed. Please try again.');
      }
    },
  });

  function handleReadAloud() {
    if (!currentLesson?.content) return;
    if (isPlayingAudio) {
      audioRef.current?.pause();
      setIsPlayingAudio(false);
      return;
    }
    if (!user) { toast.error('Sign in to use voice features.'); return; }
    if (!hasElevenLabsKey) { setShowVoiceSetup(true); return; }
    // Strip markdown for cleaner TTS
    const plainText = (currentLesson.content || '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 4500);
    speakMutation.mutate({ text: plainText });
  }

  // Study guide state
  const [showGuidePanel, setShowGuidePanel] = useState(false);
  const [activeGuideId, setActiveGuideId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>(undefined);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number | undefined>(undefined);

  const { data: course, isLoading: courseLoading } = trpc.schoolhouse.getCourse.useQuery({ id: courseId });
  const { data: lessons = [], isLoading: lessonsLoading } = trpc.schoolhouse.getLessons.useQuery({ courseId });
  const { data: students = [] } = trpc.schoolhouse.getStudents.useQuery(undefined, { enabled: !!user });

  const activeLesson = lessons.find(l => l.id === activeLessonId) ?? lessons[0] ?? null;
  const { data: quiz } = trpc.schoolhouse.getQuiz.useQuery(
    { lessonId: activeLesson?.id ?? 0 },
    { enabled: !!activeLesson }
  );

  const markComplete = trpc.schoolhouse.markComplete.useMutation();

  // Study guides
  const utils = trpc.useUtils();
  const { data: studyGuides = [], refetch: refetchGuides } = trpc.schoolhouse.getStudyGuides.useQuery(
    { courseId },
    { enabled: !!user && courseId > 0 }
  );
  const generateGuide = trpc.schoolhouse.generateStudyGuide.useMutation({
    onSuccess: (data) => {
      refetchGuides();
      setActiveGuideId(data.id);
      setShowGuidePanel(true);
      toast.success("Study guide generated!");
    },
    onError: () => toast.error("Failed to generate study guide. Please try again."),
  });
  const deleteGuide = trpc.schoolhouse.deleteStudyGuide.useMutation({
    onSuccess: () => {
      refetchGuides();
      setActiveGuideId(null);
      toast.success("Study guide deleted.");
    },
  });

  const activeGuide = studyGuides.find(g => g.id === activeGuideId) ?? null;

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
            {/* Share to Patreon */}
            <button
              onClick={() => openPatreonShare(
                `🌾 New Course Alert on The Homestead Hub Schoolhouse!\n\n📚 ${course.title}\n\n${course.description}\n\nGrades: ${gradeRange(course.gradeMin, course.gradeMax)} · ${lessons.length} Lessons\n\nFree to access at:\nhttps://www.a1homesteadhub.com/schoolhouse/${course.id}\n\n#Homesteading #Homeschool #SelfReliant #A1HomesteadHub`
              )}
              className="shrink-0 flex items-center gap-2 bg-[oklch(0.55_0.18_25)] hover:bg-[oklch(0.48_0.18_25)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share to Patreon
            </button>
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
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Read-aloud button (Pro voice feature) */}
                      {user && (
                        <button
                          onClick={handleReadAloud}
                          disabled={speakMutation.isPending}
                          title={hasElevenLabsKey ? (isPlayingAudio ? 'Pause Miss Hazel' : 'Listen to this lesson') : 'Connect ElevenLabs to enable voice'}
                          className={`flex items-center gap-1.5 text-sm border rounded-lg px-3 py-1.5 transition-colors ${
                            isPlayingAudio
                              ? 'bg-[oklch(0.93_0.04_80)] border-[oklch(0.75_0.08_80)] text-[oklch(0.35_0.08_80)]'
                              : 'text-[oklch(0.45_0.05_50)] hover:text-[oklch(0.35_0.08_50)] border-[oklch(0.88_0.03_80)] hover:bg-[oklch(0.96_0.02_80)]'
                          }`}
                        >
                          {speakMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isPlayingAudio ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                          {speakMutation.isPending ? 'Loading…' : isPlayingAudio ? 'Pause' : 'Listen'}
                        </button>
                      )}
                      <a
                        href={`/schoolhouse/course/${courseId}/print`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-[oklch(0.45_0.05_50)] hover:text-[oklch(0.35_0.08_50)] border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-1.5 hover:bg-[oklch(0.96_0.02_80)] transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                        Print Packet
                      </a>
                    </div>
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

      {/* Study Guide Panel */}
      {user && (
        <div className="border-t border-[oklch(0.88_0.03_80)] bg-[oklch(0.97_0.01_80)]">
          <div className="container py-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowGuidePanel(p => !p)}
                className="flex items-center gap-2 font-bold text-[oklch(0.25_0.05_50)] text-lg hover:text-[oklch(0.35_0.08_50)] transition-colors"
              >
                <FileText className="w-5 h-5 text-[oklch(0.55_0.15_80)]" />
                AI Study Guides
                {studyGuides.length > 0 && (
                  <span className="ml-1 text-xs font-semibold bg-[oklch(0.88_0.05_80)] text-[oklch(0.35_0.08_50)] rounded-full px-2 py-0.5">{studyGuides.length}</span>
                )}
                {showGuidePanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Generate button */}
              <button
                disabled={generateGuide.isPending}
                onClick={() => {
                  if (!user) { toast.error("Sign in to generate a study guide."); return; }
                  generateGuide.mutate({
                    courseId,
                    studentId: selectedStudentId,
                    gradeLevel: selectedGradeLevel ?? course?.gradeMin,
                  });
                  setShowGuidePanel(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[oklch(0.55_0.15_80)] text-white rounded-xl text-sm font-semibold hover:bg-[oklch(0.48_0.13_80)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {generateGuide.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating&hellip;</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Study Guide</>
                )}
              </button>
            </div>

            {/* Options row — student + grade selector */}
            {showGuidePanel && (
              <div className="flex flex-wrap gap-3 mb-4">
                {students.length > 0 && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-[oklch(0.45_0.05_50)] uppercase tracking-wide">For student:</label>
                    <select
                      value={selectedStudentId ?? ""}
                      onChange={e => setSelectedStudentId(e.target.value ? Number(e.target.value) : undefined)}
                      className="text-sm border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-1.5 bg-white text-[oklch(0.25_0.05_50)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                    >
                      <option value="">Any student</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name} (Grade {s.gradeLevel})</option>)}
                    </select>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[oklch(0.45_0.05_50)] uppercase tracking-wide">Grade level:</label>
                  <select
                    value={selectedGradeLevel ?? ""}
                    onChange={e => setSelectedGradeLevel(e.target.value ? Number(e.target.value) : undefined)}
                    className="text-sm border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-1.5 bg-white text-[oklch(0.25_0.05_50)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                  >
                    <option value="">Use course default</option>
                    {Array.from({ length: 13 }, (_, i) => (
                      <option key={i} value={i}>{i === 0 ? "Kindergarten" : `Grade ${i}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Panel body */}
            {showGuidePanel && (
              <div className="flex gap-4 flex-col md:flex-row">
                {/* Saved guides list */}
                <div className="md:w-64 shrink-0">
                  {studyGuides.length === 0 ? (
                    <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-5 text-center">
                      {generateGuide.isPending ? (
                        <div className="flex flex-col items-center gap-3 py-4">
                          <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.55_0.15_80)]" />
                          <p className="text-sm text-[oklch(0.45_0.05_50)]">The AI is writing your study guide&hellip;<br /><span className="text-xs">This takes about 15–30 seconds.</span></p>
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-8 h-8 mx-auto mb-2 text-[oklch(0.75_0.15_80)]" />
                          <p className="text-sm text-[oklch(0.45_0.05_50)]">No study guides yet.<br />Click &ldquo;Generate Study Guide&rdquo; to create one.</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {studyGuides.map(g => (
                        <li key={g.id}>
                          <button
                            onClick={() => setActiveGuideId(g.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                              activeGuideId === g.id
                                ? "bg-[oklch(0.93_0.05_80)] border-[oklch(0.65_0.15_80)] text-[oklch(0.25_0.05_50)] font-semibold"
                                : "bg-white border-[oklch(0.88_0.03_80)] text-[oklch(0.35_0.05_50)] hover:border-[oklch(0.75_0.10_80)]"
                            }`}
                          >
                            <div className="font-medium leading-snug">{g.title}</div>
                            <div className="text-xs text-[oklch(0.55_0.05_50)] mt-0.5">{new Date(g.createdAt).toLocaleDateString()}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Guide content */}
                <div className="flex-1 min-w-0">
                  {generateGuide.isPending && !activeGuide ? (
                    <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-10 flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-[oklch(0.55_0.15_80)]" />
                      <div className="text-center">
                        <p className="font-semibold text-[oklch(0.25_0.05_50)]">Generating your study guide&hellip;</p>
                        <p className="text-sm text-[oklch(0.45_0.05_50)] mt-1">The AI is reading all the lessons and building a comprehensive guide. This usually takes 15–30 seconds.</p>
                      </div>
                    </div>
                  ) : activeGuide ? (
                    <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] overflow-hidden">
                      <div className="px-6 py-4 border-b border-[oklch(0.88_0.03_80)] flex items-center justify-between gap-4">
                        <h3 className="font-bold text-[oklch(0.25_0.05_50)] text-base leading-snug">{activeGuide.title}</h3>
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <button
                            onClick={() => window.print()}
                            className="flex items-center gap-1.5 text-sm text-[oklch(0.45_0.05_50)] hover:text-[oklch(0.35_0.08_50)] border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-1.5 hover:bg-[oklch(0.96_0.02_80)] transition-colors"
                          >
                            <Printer className="w-4 h-4" /> Print
                          </button>
                          <button
                            onClick={() => openPatreonShare(
                              `📚 Just generated a new AI study guide for our homeschool!\n\n"${activeGuide.title}"\n\nThe Homestead Hub Schoolhouse AI builds custom study guides for every course — vocabulary, key concepts, review questions, hands-on activities, and more. Free for all Hub members!\n\nGenerate yours at:\nhttps://www.a1homesteadhub.com/schoolhouse/${course.id}\n\n#Homeschool #HomesteadHub #STEMEducation #A1HomesteadHub`
                            )}
                            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[oklch(0.55_0.18_25)] hover:bg-[oklch(0.48_0.18_25)] rounded-lg px-3 py-1.5 transition-colors"
                          >
                            <Share2 className="w-4 h-4" /> Share to Patreon
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this study guide?")) deleteGuide.mutate({ id: activeGuide.id });
                            }}
                            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="px-6 py-6 prose prose-sm max-w-none prose-headings:text-[oklch(0.25_0.05_50)] prose-p:text-[oklch(0.35_0.05_50)] prose-li:text-[oklch(0.35_0.05_50)] prose-strong:text-[oklch(0.25_0.05_50)] prose-blockquote:border-[oklch(0.75_0.15_80)] prose-code:bg-[oklch(0.93_0.02_80)] prose-code:text-[oklch(0.35_0.08_50)] prose-code:px-1 prose-code:rounded">
                        <ReactMarkdown>{activeGuide.content}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-10 text-center text-[oklch(0.55_0.05_50)]">
                      <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Select a study guide from the list, or generate a new one.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Miss Hazel AI Tutor — floating button + slide-up panel */}
      {user && course && (
        <>
          {/* Floating Tutor Button */}
          {!showTutor && (
            <button
              onClick={openTutor}
              className="fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-[oklch(0.28_0.06_50)] hover:bg-[oklch(0.35_0.08_60)] text-white font-bold px-5 py-3 rounded-full shadow-xl transition-all hover:scale-105 border-2 border-[oklch(0.55_0.12_80)]"
            >
              <GraduationCap className="w-5 h-5 text-[oklch(0.85_0.15_80)]" />
              Ask Miss Hazel
            </button>
          )}

          {/* Tutor Panel */}
          {showTutor && (
            <div className="fixed bottom-0 right-0 left-0 md:left-auto md:right-6 md:bottom-6 md:w-[420px] z-50 flex flex-col bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-[oklch(0.88_0.03_80)] overflow-hidden" style={{ maxHeight: "75vh" }}>
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[oklch(0.25_0.06_50)] text-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[oklch(0.68_0.12_65)] flex items-center justify-center text-[oklch(0.18_0.06_145)] font-bold text-sm">H</div>
                  <div>
                    <div className="font-bold text-sm">Miss Hazel</div>
                    <div className="text-xs text-white/70">Your Schoolhouse Tutor</div>
                  </div>
                </div>
                <button onClick={() => setShowTutor(false)} className="text-white/70 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Lesson context badge */}
              {currentLesson && (
                <div className="px-4 py-2 bg-[oklch(0.95_0.03_80)] border-b border-[oklch(0.88_0.03_80)] text-xs text-[oklch(0.45_0.05_50)] flex items-center gap-1.5 shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                  Currently on: <span className="font-semibold text-[oklch(0.35_0.05_50)]">{currentLesson.title}</span>
                </div>
              )}
              {/* Chat */}
              <div className="flex-1 overflow-hidden">
                <AIChatBox
                  messages={tutorMessages}
                  onSendMessage={handleTutorSend}
                  isLoading={tutorChatMutation.isPending}
                  placeholder="Ask Miss Hazel anything about this lesson…"
                  height="100%"
                  suggestedPrompts={[
                    "Can you explain this lesson in simpler terms?",
                    "Quiz me on what I just learned!",
                    "What's a hands-on activity for this topic?",
                    "Why is this important for homesteading?",
                  ]}
                />
              </div>
            </div>
          )}
        </>
      )}

      <Footer />

      {/* ElevenLabs BYOK Setup Modal */}
      {showVoiceSetup && (
        <ElevenLabsSetupModal
          onClose={() => setShowVoiceSetup(false)}
          onSuccess={() => {
            setShowVoiceSetup(false);
            refetchHasKey();
            toast.success("Miss Hazel's voice is ready! Hit Listen on any lesson.");
          }}
        />
      )}

      {/* Patreon Share Modal */}
      {patreonShareText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPatreonShareText(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[oklch(0.88_0.03_80)] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[oklch(0.25_0.05_50)] text-lg">Share to Patreon</h3>
                <p className="text-sm text-[oklch(0.55_0.05_50)] mt-0.5">Copy this post, then paste it into your Patreon editor.</p>
              </div>
              <button onClick={() => setPatreonShareText(null)} className="text-[oklch(0.55_0.05_50)] hover:text-[oklch(0.35_0.05_50)] text-xl font-bold leading-none">&times;</button>
            </div>
            <div className="px-6 py-4">
              <textarea
                readOnly
                value={patreonShareText}
                className="w-full h-52 text-sm text-[oklch(0.25_0.05_50)] bg-[oklch(0.97_0.01_80)] border border-[oklch(0.88_0.03_80)] rounded-xl p-4 resize-none focus:outline-none font-mono leading-relaxed"
              />
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={copyAndOpenPatreon}
                className="flex-1 flex items-center justify-center gap-2 bg-[oklch(0.55_0.18_25)] hover:bg-[oklch(0.48_0.18_25)] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {patreonShareCopied ? (
                  <><CheckCircle className="w-4 h-4" /> Copied! Opening Patreon...</>
                ) : (
                  <><Share2 className="w-4 h-4" /> Copy &amp; Open Patreon</>
                )}
              </button>
              <button
                onClick={() => setPatreonShareText(null)}
                className="px-5 py-3 rounded-xl border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] hover:bg-[oklch(0.96_0.02_80)] transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

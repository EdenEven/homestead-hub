import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Plus, Trash2, User, GraduationCap } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const GRADE_LABELS: Record<number, string> = {
  0: "K", 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th",
  6: "6th", 7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
};

export default function SchoolStudents() {
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: students = [], refetch } = trpc.schoolhouse.getStudents.useQuery();
  const addStudent = trpc.schoolhouse.createStudent.useMutation({ onSuccess: () => { refetch(); setName(""); setShowForm(false); } });
  const removeStudent = trpc.schoolhouse.deleteStudent.useMutation({ onSuccess: () => { refetch(); setDeleteConfirm(null); } });

  if (loading) return null;
  if (!user) {
    return (
      <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
        <Navigation />
        <div className="container py-20 text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-[oklch(0.55_0.05_50)] opacity-40" />
          <h2 className="text-xl font-bold text-[oklch(0.25_0.05_50)] mb-2">Sign in to manage students</h2>
          <a href={getLoginUrl()} className="inline-block bg-[oklch(0.35_0.08_50)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[oklch(0.28_0.07_50)] transition-colors mt-4">Sign In</a>
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

      <div className="container py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[oklch(0.25_0.05_50)]">My Students</h1>
            <p className="text-sm text-[oklch(0.45_0.05_50)] mt-0.5">Add your children to track their progress and grades.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[oklch(0.35_0.08_50)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[oklch(0.28_0.07_50)] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {/* Add student form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-5 mb-5">
            <h3 className="font-semibold text-[oklch(0.25_0.05_50)] mb-4">New Student Profile</h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[oklch(0.45_0.05_50)] mb-1">Student Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Emma"
                  className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-semibold text-[oklch(0.45_0.05_50)] mb-1">Grade Level</label>
                <select
                  value={gradeLevel}
                  onChange={e => setGradeLevel(Number(e.target.value))}
                  className="w-full border border-[oklch(0.88_0.03_80)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.15_80)]"
                >
                  {Object.entries(GRADE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { if (name.trim()) addStudent.mutate({ name: name.trim(), gradeLevel }); }}
                disabled={!name.trim() || addStudent.isPending}
                className="px-4 py-2 bg-[oklch(0.35_0.08_50)] text-white rounded-lg text-sm font-semibold hover:bg-[oklch(0.28_0.07_50)] disabled:opacity-50 transition-colors"
              >
                {addStudent.isPending ? "Saving..." : "Save Student"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] rounded-lg text-sm hover:bg-[oklch(0.96_0.02_80)] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Student list */}
        {students.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-12 text-center">
            <User className="w-10 h-10 mx-auto mb-3 text-[oklch(0.75_0.05_50)]" />
            <p className="text-[oklch(0.45_0.05_50)] font-medium">No students yet.</p>
            <p className="text-sm text-[oklch(0.55_0.05_50)] mt-1">Add your first student to start tracking their progress.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[oklch(0.88_0.05_80)] flex items-center justify-center text-[oklch(0.35_0.08_50)] font-bold text-sm">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-[oklch(0.25_0.05_50)]">{s.name}</div>
                    <div className="text-xs text-[oklch(0.55_0.05_50)]">Grade {GRADE_LABELS[s.gradeLevel ?? 0] ?? s.gradeLevel}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/schoolhouse/gradebook?student=${s.id}`}>
                    <button className="text-xs text-[oklch(0.45_0.08_80)] hover:text-[oklch(0.35_0.08_50)] font-medium px-3 py-1.5 border border-[oklch(0.88_0.03_80)] rounded-lg hover:bg-[oklch(0.96_0.02_80)] transition-colors">
                      View Grades
                    </button>
                  </Link>
                  {deleteConfirm === s.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600">Remove?</span>
                      <button onClick={() => removeStudent.mutate({ id: s.id })} className="text-xs text-red-600 font-semibold hover:text-red-800">Yes</button>
                      <button onClick={() => setDeleteConfirm(null)} className="text-xs text-[oklch(0.55_0.05_50)] hover:text-[oklch(0.35_0.05_50)]">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(s.id)} className="p-1.5 text-[oklch(0.65_0.05_50)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

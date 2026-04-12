/*
 * Community Page — Homestead Hub
 * Real homesteader profiles from the database
 * Visitors can browse and sign in to create their own profile
 */

import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapPin, Users, Search, UserPlus, Leaf } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const SKILL_COLORS: Record<string, string> = {
  "Butchering": "oklch(0.38 0.10 25)",
  "Foraging": "oklch(0.32 0.08 145)",
  "Building": "oklch(0.35 0.06 55)",
  "Food Preservation": "oklch(0.45 0.10 65)",
  "Gardening": "oklch(0.38 0.09 140)",
  "Hunting": "oklch(0.30 0.07 50)",
  "Animal Husbandry": "oklch(0.42 0.08 80)",
  "Water Systems": "oklch(0.40 0.10 220)",
  "Solar Energy": "oklch(0.50 0.12 65)",
  "Beekeeping": "oklch(0.55 0.12 70)",
  "Herbalism": "oklch(0.35 0.08 150)",
  "Woodworking": "oklch(0.38 0.07 50)",
  "Fermentation": "oklch(0.42 0.09 30)",
  "Seed Saving": "oklch(0.40 0.09 135)",
  "Permaculture": "oklch(0.36 0.10 145)",
};

function getSkillColor(skill: string) {
  for (const key of Object.keys(SKILL_COLORS)) {
    if (skill.toLowerCase().includes(key.toLowerCase())) return SKILL_COLORS[key];
  }
  return "oklch(0.35 0.06 55)";
}

function MemberCard({ member }: { member: { displayName: string | null; bio: string | null; location: string | null; state: string | null; skills: string | null; avatarUrl: string | null; websiteUrl: string | null } }) {
  const skills = member.skills ? member.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
  const initials = (member.displayName || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="rounded-2xl overflow-hidden transition-all hover:shadow-lg"
      style={{ background: "white", border: "1px solid oklch(0.88 0.03 80)" }}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.displayName || "Member"}
                className="w-14 h-14 rounded-full object-cover"
                style={{ border: "2px solid oklch(0.85 0.05 80)" }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
                style={{ background: "oklch(0.38 0.09 140)" }}>
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight mb-0.5"
              style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
              {member.displayName || "Homesteader"}
            </h3>
            {(member.location || member.state) && (
              <p className="text-sm flex items-center gap-1 mb-2"
                style={{ color: "oklch(0.50 0.04 80)" }}>
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {[member.location, member.state].filter(Boolean).join(", ")}
              </p>
            )}
            {member.bio && (
              <p className="text-sm leading-relaxed mb-3 line-clamp-3"
                style={{ color: "oklch(0.40 0.03 65)" }}>
                {member.bio}
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {skills.slice(0, 5).map(skill => (
              <span key={skill}
                className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ background: getSkillColor(skill) }}>
                {skill}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: "oklch(0.92 0.03 80)", color: "oklch(0.45 0.04 50)" }}>
                +{skills.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Website link */}
        {member.websiteUrl && (
          <a href={member.websiteUrl} target="_blank" rel="noopener noreferrer"
            className="mt-3 text-xs inline-block hover:underline"
            style={{ color: "oklch(0.45 0.10 220)" }}>
            {member.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        )}
      </div>
    </div>
  );
}

function EmptyState({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="col-span-2 text-center py-16">
      <Leaf className="w-12 h-12 mx-auto mb-4" style={{ color: "oklch(0.55 0.08 140)" }} />
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.30 0.06 50)" }}>
        Be the First to Join
      </h3>
      <p className="mb-6 max-w-sm mx-auto" style={{ color: "oklch(0.50 0.04 80)" }}>
        No public profiles yet. Create yours and start building the community directory.
      </p>
      {isAuthenticated ? (
        <Link href="/profile">
          <button className="px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: "oklch(0.38 0.09 140)" }}>
            Create My Profile
          </button>
        </Link>
      ) : (
        <a href={getLoginUrl()}>
          <button className="px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: "oklch(0.38 0.09 140)" }}>
            Sign In & Create Profile
          </button>
        </a>
      )}
    </div>
  );
}

export default function Community() {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const { isAuthenticated } = useAuth();

  const { data: profiles = [], isLoading } = trpc.profile.getPublic.useQuery();

  const allSkills = ["All Skills", "Butchering", "Foraging", "Building", "Food Preservation",
    "Gardening", "Hunting", "Animal Husbandry", "Water Systems", "Solar Energy",
    "Beekeeping", "Herbalism", "Woodworking", "Fermentation", "Seed Saving", "Permaculture"];

  const filtered = profiles.filter(m => {
    const name = m.displayName || "";
    const loc = [m.location, m.state].filter(Boolean).join(" ");
    const bio = m.bio || "";
    const skills = m.skills || "";
    const matchSearch = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      loc.toLowerCase().includes(search.toLowerCase()) ||
      bio.toLowerCase().includes(search.toLowerCase()) ||
      skills.toLowerCase().includes(search.toLowerCase());
    const matchSkill = skillFilter === "All Skills" ||
      skills.toLowerCase().includes(skillFilter.toLowerCase());
    return matchSearch && matchSkill;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.97 0.01 80)" }}>
      <Navigation />

      {/* Hero */}
      <section className="py-16 relative overflow-hidden"
        style={{ background: "oklch(0.22 0.06 145)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.68 0.12 65) 0%, transparent 60%)" }} />
        <div className="container relative">
          <p className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.68 0.12 65)" }}>
            Your People Are Out There
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.96 0.02 85)" }}>
            Homesteader Connect
          </h1>
          <p className="text-lg max-w-2xl mb-8"
            style={{ color: "oklch(0.78 0.02 85)" }}>
            Find like-minded homesteaders in your region. Share skills, trade goods, offer mentorship, and build the community you'll need when it matters most.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.96 0.02 85)" }}>
                {isLoading ? "..." : profiles.length}
              </p>
              <p className="text-sm" style={{ color: "oklch(0.65 0.02 85)" }}>
                <Users className="w-3 h-3 inline mr-1" />Community Members
              </p>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.96 0.02 85)" }}>
                {isLoading ? "..." : new Set(profiles.map(p => p.state).filter(Boolean)).size || 0}
              </p>
              <p className="text-sm" style={{ color: "oklch(0.65 0.02 85)" }}>
                <MapPin className="w-3 h-3 inline mr-1" />States Represented
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-5 border-b sticky top-0 z-10"
        style={{ background: "white", borderColor: "oklch(0.88 0.03 80)" }}>
        <div className="container flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "oklch(0.55 0.03 65)" }} />
            <input
              type="text"
              placeholder="Search by name, location, skill, or bio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border outline-none"
              style={{ borderColor: "oklch(0.82 0.04 80)", background: "oklch(0.98 0.01 80)" }}
            />
          </div>
          <select
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-xl border outline-none"
            style={{ borderColor: "oklch(0.82 0.04 80)", background: "oklch(0.98 0.01 80)", color: "oklch(0.35 0.04 50)" }}
          >
            {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-12 flex-1">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-2xl p-6 animate-pulse"
                  style={{ background: "white", border: "1px solid oklch(0.88 0.03 80)" }}>
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full" style={{ background: "oklch(0.88 0.03 80)" }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-40 rounded" style={{ background: "oklch(0.88 0.03 80)" }} />
                      <div className="h-4 w-28 rounded" style={{ background: "oklch(0.88 0.03 80)" }} />
                      <div className="h-4 w-full rounded" style={{ background: "oklch(0.88 0.03 80)" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filtered.length > 0 && (
                <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.04 80)" }}>
                  Showing {filtered.length} homesteader{filtered.length !== 1 ? "s" : ""}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.length > 0
                  ? filtered.map((member, i) => <MemberCard key={i} member={member} />)
                  : <EmptyState isAuthenticated={isAuthenticated} />
                }
              </div>
            </>
          )}

          {/* Join CTA */}
          <div className="mt-14 rounded-2xl p-8 text-center"
            style={{ background: "oklch(0.22 0.06 145)" }}>
            <UserPlus className="w-10 h-10 mx-auto mb-4" style={{ color: "oklch(0.68 0.12 65)" }} />
            <h2 className="text-3xl font-black mb-3"
              style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.96 0.02 85)" }}>
              Add Your Homestead to the Directory
            </h2>
            <p className="text-base mb-6 max-w-xl mx-auto"
              style={{ color: "oklch(0.72 0.02 85)" }}>
              Share your skills, location, and story. Connect with homesteaders near you. Your knowledge is valuable — put it on the map.
            </p>
            {isAuthenticated ? (
              <Link href="/profile">
                <button className="px-8 py-3 font-bold rounded-xl transition-all hover:opacity-90"
                  style={{ background: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)" }}>
                  Create / Edit My Profile
                </button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <button className="px-8 py-3 font-bold rounded-xl transition-all hover:opacity-90"
                  style={{ background: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)" }}>
                  Sign In & Create Profile
                </button>
              </a>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

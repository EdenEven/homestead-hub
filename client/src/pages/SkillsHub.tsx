/*
 * Skills Hub Page — Homestead Hub
 * Design: Rugged Americana Craft
 * Grid of all 9 skill modules with filtering
 */

import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { skills } from "@/lib/skillsData";
import { ArrowRight, Search } from "lucide-react";

const SKILLS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/skills-collage-KwZPrPQKyyFRcZtTBfbfuA.webp";

const difficultyColors: Record<string, string> = {
  Beginner: "oklch(0.38 0.09 140)",
  Intermediate: "oklch(0.45 0.10 65)",
  Advanced: "oklch(0.38 0.12 25)",
};

export default function SkillsHub() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");

  const filtered = skills.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.tagline.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || s.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <Navigation />

      {/* Hero Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${SKILLS_IMG})` }} />
        <div className="absolute inset-0" style={{ background: "oklch(0.15 0.06 145 / 0.88)" }} />
        <div className="relative container">
          <p className="section-label mb-3">10 Core Modules</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
            The Skills Hub
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Practical, no-nonsense guides built for real homesteaders. From butchering your first chicken to wiring a solar array — every skill you need to live self-reliantly.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-40 py-4 border-b" style={{ backgroundColor: "oklch(0.93 0.025 80)", borderColor: "oklch(0.82 0.03 75)" }}>
        <div className="container flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "oklch(0.55 0.03 65)" }} />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-sm border"
              style={{
                backgroundColor: "oklch(0.98 0.01 85)",
                borderColor: "oklch(0.82 0.03 75)",
                color: "oklch(0.18 0.06 145)",
                fontFamily: "'Source Serif 4', Georgia, serif",
                outline: "none",
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Beginner", "Intermediate", "Advanced"].map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className="px-3 py-1.5 text-sm font-semibold rounded-sm transition-all"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  backgroundColor: filter === d ? "oklch(0.22 0.06 145)" : "oklch(0.98 0.01 85)",
                  color: filter === d ? "oklch(0.96 0.025 85)" : "oklch(0.35 0.03 65)",
                  border: `1px solid ${filter === d ? "oklch(0.22 0.06 145)" : "oklch(0.82 0.03 75)"}`,
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-12">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.35 0.03 65)" }}>No skills found</p>
              <p className="text-sm" style={{ color: "oklch(0.55 0.03 65)" }}>Try a different search term or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((skill) => (
                <Link
                  key={skill.slug}
                  href={`/skills/${skill.slug}`}
                  className="skill-card block rounded-sm overflow-hidden group"
                  style={{ border: "1px solid oklch(0.82 0.03 75)", backgroundColor: "oklch(0.98 0.01 85)" }}
                >
                  <div className="h-2" style={{ backgroundColor: skill.color }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{skill.icon}</span>
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-sm"
                        style={{
                          backgroundColor: `${difficultyColors[skill.difficulty]}22`,
                          color: difficultyColors[skill.difficulty],
                          fontFamily: "'Source Serif 4', Georgia, serif",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {skill.difficulty}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                      {skill.title}
                    </h2>
                    <p className="text-sm italic mb-3" style={{ color: "oklch(0.45 0.04 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                      {skill.tagline}
                    </p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.42 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                      {skill.intro.slice(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        ⏱ {skill.timeToLearn}
                      </span>
                      <span className="text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: skill.color, fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Learn More <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

/*
 * Skill Detail Page — Homestead Hub
 * Design: Rugged Americana Craft
 * Full skill guide with steps, tips, safety notes, and resources
 */

import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getSkillBySlug } from "@/lib/skillsData";
import { ArrowLeft, AlertTriangle, Lightbulb, ExternalLink, Clock, BookOpen } from "lucide-react";
import ElevenLabsAudioPlayer from "@/components/ElevenLabsAudioPlayer";

interface Props {
  params: { slug: string };
}

export default function SkillDetail({ params }: Props) {
  const skill = getSkillBySlug(params.slug);

  if (!skill) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🌾</p>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              Skill Not Found
            </h1>
            <p className="mb-6" style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              This skill guide doesn't exist yet — but it might soon.
            </p>
            <Link href="/skills" className="inline-flex items-center gap-2 px-5 py-2 font-bold rounded-sm" style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Skills Hub
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <Navigation />

      {/* Header */}
      <section className="py-12 border-b" style={{ backgroundColor: skill.bgColor, borderColor: "oklch(0.82 0.03 75)" }}>
        <div className="container">
          <Link href="/skills" className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity" style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            <ArrowLeft className="w-3 h-3" /> Back to Skills Hub
          </Link>
          <div className="flex items-start gap-4">
            <span className="text-6xl">{skill.icon}</span>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="section-label">{skill.difficulty}</span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  <Clock className="w-3 h-3" /> {skill.timeToLearn}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                {skill.title}
              </h1>
              <p className="text-lg italic" style={{ color: "oklch(0.38 0.04 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                {skill.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* ElevenLabs Audio Player */}
            <ElevenLabsAudioPlayer
              title={`${skill.title} — Full Skill Guide`}
              text={[
                skill.title + ". " + skill.tagline + ". ",
                skill.intro + " ",
                skill.steps.map((s, i) => `Step ${i + 1}: ${s.title}. ${s.desc}`).join(" "),
                skill.seasonalNotes ? " Seasonal notes: " + skill.seasonalNotes : "",
                skill.tips.map(t => t.label + ": " + t.text).join(" "),
              ].join(" ")}
            />

            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                Overview
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.30 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                {skill.intro}
              </p>
            </div>

            {/* Steps */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                Step-by-Step Guide
              </h2>
              <div className="space-y-4">
                {skill.steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-5 rounded-sm"
                    style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm text-sm font-black"
                      style={{ backgroundColor: skill.color, color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Notes */}
            {skill.seasonalNotes && (
              <div className="p-5 rounded-sm" style={{ backgroundColor: "oklch(0.95 0.02 140)", border: "1px solid oklch(0.78 0.04 140)" }}>
                <h3 className="font-bold mb-2 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.22 0.07 140)" }}>
                  🌿 Seasonal Notes
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.28 0.05 140)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {skill.seasonalNotes}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <div className="p-5 rounded-sm" style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                <Lightbulb className="w-4 h-4" style={{ color: "oklch(0.68 0.12 65)" }} />
                Pro Tips
              </h3>
              <div className="space-y-4">
                {skill.tips.map((tip, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold mb-1" style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {tip.label}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                      {tip.text}
                    </p>
                    {i < skill.tips.length - 1 && <div className="rope-divider mt-3" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Notes */}
            {skill.safetyNotes && (
              <div className="p-5 rounded-sm" style={{ backgroundColor: "oklch(0.97 0.02 25)", border: "1px solid oklch(0.78 0.06 25)" }}>
                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.30 0.10 25)" }}>
                  <AlertTriangle className="w-4 h-4" />
                  Safety Notes
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.30 0.08 25)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {skill.safetyNotes}
                </p>
              </div>
            )}

            {/* Resources */}
            <div className="p-5 rounded-sm" style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                <BookOpen className="w-4 h-4" style={{ color: "oklch(0.32 0.08 145)" }} />
                Resources & Links
              </h3>
              <div className="space-y-3">
                {skill.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 group hover:opacity-80 transition-opacity"
                  >
                    <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: "oklch(0.32 0.08 145)" }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "oklch(0.32 0.08 145)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        {r.title}
                      </p>
                      <p className="text-xs capitalize" style={{ color: "oklch(0.55 0.03 65)" }}>{r.type}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Related Skills */}
            <div className="p-5 rounded-sm" style={{ backgroundColor: "oklch(0.22 0.06 145)" }}>
              <h3 className="font-bold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
                Explore More Skills
              </h3>
              <Link
                href="/skills"
                className="block text-center py-2 rounded-sm font-bold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                View All Skills →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

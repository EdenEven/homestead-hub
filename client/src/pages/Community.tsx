/*
 * Community Page — Homestead Hub
 * Design: Rugged Americana Craft
 * Find and connect with homesteaders in your region
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapPin, Users, MessageSquare, Star, Search } from "lucide-react";
import { toast } from "sonner";

const COMMUNITY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/barter-trade-3QymJoA3SDb8yHv3z9pTvD.webp";

const members = [
  { id: 1, name: "Ruth & Dale Harmon", location: "Ozark Mountains, AR", skills: ["Butchering", "Animal Husbandry", "Food Preservation"], bio: "Third-generation homesteaders raising heritage breed pigs, chickens, and a large market garden. Willing to mentor beginners.", avatar: "🧑‍🌾", rating: 4.9, trades: 34 },
  { id: 2, name: "Maria Sandoval", location: "Hill Country, TX", skills: ["Foraging", "Herbal Medicine", "Gardening"], bio: "Herbalist and wild food educator. Runs seasonal foraging walks and teaches medicinal plant identification.", avatar: "👩‍🌾", rating: 5.0, trades: 28 },
  { id: 3, name: "James & Carol Whitfield", location: "Appalachian Mountains, TN", skills: ["Building", "Solar Energy", "Water Systems"], bio: "Built our off-grid cabin from scratch. Specialize in timber framing, rainwater systems, and small solar installs.", avatar: "👨‍🔧", rating: 4.8, trades: 51 },
  { id: 4, name: "Pastor Ben Okafor", location: "Rural Georgia", skills: ["Gardening", "Food Preservation", "Community Building"], bio: "Running a community garden that feeds 40 families. Teaching food sovereignty and preservation to inner-city youth.", avatar: "👨‍🌾", rating: 5.0, trades: 19 },
  { id: 5, name: "Sarah & Tom Briggs", location: "Pacific Northwest, OR", skills: ["Foraging", "Hunting & Gaming", "Animal Husbandry"], bio: "Hunting and foraging family with 12 acres. We raise goats, keep bees, and hunt elk every fall.", avatar: "👩‍🌾", rating: 4.7, trades: 42 },
  { id: 6, name: "Frank Delacroix", location: "Louisiana Bayou", skills: ["Fishing", "Food Preservation", "Building"], bio: "Cajun homesteader with deep knowledge of bayou ecology, crawfish farming, and traditional preservation methods.", avatar: "🧑‍🌾", rating: 4.9, trades: 37 },
  { id: 7, name: "Abigail & Noah Yoder", location: "Lancaster County, PA", skills: ["Animal Husbandry", "Gardening", "Building"], bio: "Amish-background family sharing traditional farming wisdom. Specialize in draft horses, heritage seeds, and hand tools.", avatar: "👩‍🌾", rating: 5.0, trades: 63 },
  { id: 8, name: "Mike Tanner", location: "Montana High Plains", skills: ["Hunting & Gaming", "Butchering", "Solar Energy"], bio: "Former military, now full-time homesteader. Teaches field dressing, firearms safety, and off-grid power systems.", avatar: "👨‍🔧", rating: 4.8, trades: 29 },
];

const allSkills = ["All Skills", "Butchering", "Foraging", "Building", "Food Preservation", "Gardening", "Hunting & Gaming", "Animal Husbandry", "Water Systems", "Solar Energy", "Herbal Medicine", "Community Building"];

export default function Community() {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All Skills");

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.location.toLowerCase().includes(search.toLowerCase()) || m.bio.toLowerCase().includes(search.toLowerCase());
    const matchSkill = skillFilter === "All Skills" || m.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()));
    return matchSearch && matchSkill;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${COMMUNITY_IMG})` }} />
        <div className="absolute inset-0" style={{ background: "oklch(0.12 0.04 55 / 0.85)" }} />
        <div className="relative container">
          <p className="section-label mb-3">Your People Are Out There</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
            Homesteader Connect
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Find like-minded homesteaders in your region. Share skills, trade goods, offer mentorship, and build the community you'll need when it matters most.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 border-b" style={{ backgroundColor: "oklch(0.22 0.06 145)", borderColor: "oklch(0.28 0.06 145)" }}>
        <div className="container">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: <Users className="w-5 h-5" />, value: "2,847", label: "Active Members" },
              { icon: <MapPin className="w-5 h-5" />, value: "48", label: "States Represented" },
              { icon: <MessageSquare className="w-5 h-5" />, value: "12,400+", label: "Trades Completed" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div style={{ color: "oklch(0.68 0.12 65)" }}>{stat.icon}</div>
                <p className="text-2xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "oklch(0.65 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-6 border-b" style={{ backgroundColor: "oklch(0.93 0.025 80)", borderColor: "oklch(0.82 0.03 75)" }}>
        <div className="container flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "oklch(0.55 0.03 65)" }} />
            <input
              type="text"
              placeholder="Search by name, location, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-sm border"
              style={{ backgroundColor: "oklch(0.98 0.01 85)", borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif", outline: "none" }}
            />
          </div>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-sm border"
            style={{ backgroundColor: "oklch(0.98 0.01 85)", borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif", outline: "none" }}
          >
            {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-12">
        <div className="container">
          <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Showing {filtered.length} homesteaders
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((member) => (
              <div
                key={member.id}
                className="skill-card p-6 rounded-sm"
                style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{member.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                          {member.name}
                        </h3>
                        <p className="text-sm flex items-center gap-1" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                          <MapPin className="w-3 h-3" /> {member.location}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 text-sm font-bold" style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Playfair Display', Georgia, serif" }}>
                          <Star className="w-3 h-3 fill-current" /> {member.rating}
                        </div>
                        <p className="text-xs" style={{ color: "oklch(0.55 0.03 65)" }}>{member.trades} trades</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mt-2 mb-3" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.skills.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded-sm"
                          style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => toast.success(`Message sent to ${member.name}!`, { description: "They'll be notified and can respond through the community board." })}
                      className="text-sm font-bold px-4 py-2 rounded-sm transition-all hover:opacity-90"
                      style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Join CTA */}
          <div className="mt-12 p-8 rounded-sm text-center" style={{ backgroundColor: "oklch(0.22 0.06 145)" }}>
            <h2 className="text-3xl font-black mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
              Add Your Homestead to the Map
            </h2>
            <p className="text-base mb-6 max-w-xl mx-auto" style={{ color: "oklch(0.72 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Join thousands of homesteaders sharing skills, trading goods, and building community. Your knowledge is valuable — share it.
            </p>
            <button
              onClick={() => toast.info("Profile creation coming soon!", { description: "We're building out full user accounts. Check back soon." })}
              className="px-8 py-3 font-bold rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Create Your Profile
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

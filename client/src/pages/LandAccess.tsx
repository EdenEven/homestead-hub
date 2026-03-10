/*
 * Land Access Page — Homestead Hub
 * Design: Rugged Americana Craft
 * Land trusts, conservation programs, agricultural land opportunities
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ExternalLink, MapPin, TreePine, Sprout, Shield, DollarSign } from "lucide-react";

const LAND_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/land-access-Yd5NbuEXUP6AZmM6oxzigS.webp";

type LandCategory = "All" | "Land Trusts" | "Conservation" | "Agricultural Programs" | "Government Programs" | "Lease & Manage";

const programs = [
  {
    id: 1,
    name: "Land Trust Alliance",
    category: "Land Trusts",
    description: "The national umbrella organization for land trusts across America. Find a local land trust in your region that may offer affordable access to protected farmland.",
    url: "https://landtrustalliance.org/",
    icon: <TreePine className="w-5 h-5" />,
    color: "oklch(0.32 0.08 145)",
    details: ["Find local land trusts by state", "Conservation easements that keep land affordable", "Stewardship opportunities on protected land", "Connects landowners with conservation buyers"],
    states: "All 50 states",
  },
  {
    id: 2,
    name: "Homestead Community Land Trust",
    category: "Land Trusts",
    description: "Makes homeownership permanently affordable by separating land ownership from home ownership. The CLT retains ownership of the land while you own the home.",
    url: "https://www.homesteadclt.org/",
    icon: <Shield className="w-5 h-5" />,
    color: "oklch(0.40 0.10 220)",
    details: ["Permanently affordable homeownership", "Land remains in trust — home prices stay accessible", "Equity building for low-to-moderate income families", "Long-term community stability"],
    states: "Pacific Northwest focus",
  },
  {
    id: 3,
    name: "USDA Farm Service Agency — Farm Loans",
    category: "Government Programs",
    description: "The FSA provides direct and guaranteed loans to help farmers and ranchers who cannot obtain commercial credit. Beginning farmer programs have favorable terms.",
    url: "https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/",
    icon: <DollarSign className="w-5 h-5" />,
    color: "oklch(0.45 0.10 65)",
    details: ["Beginning Farmer Direct Loans up to $600,000", "Microloan program for small operations (up to $50,000)", "Down Payment Loan Program for land purchase", "Emergency loan programs for disaster-affected farms"],
    states: "All 50 states",
  },
  {
    id: 4,
    name: "USDA Natural Resources Conservation Service",
    category: "Conservation",
    description: "NRCS provides technical and financial assistance to help farmers, ranchers, and forest landowners conserve natural resources. Multiple programs offer payments for conservation practices.",
    url: "https://www.nrcs.usda.gov/programs-initiatives",
    icon: <Sprout className="w-5 h-5" />,
    color: "oklch(0.38 0.09 140)",
    details: ["Environmental Quality Incentives Program (EQIP)", "Conservation Stewardship Program (CSP)", "Agricultural Conservation Easement Program (ACEP)", "Payments for implementing conservation practices"],
    states: "All 50 states",
  },
  {
    id: 5,
    name: "American Farmland Trust",
    category: "Conservation",
    description: "Works to protect farmland from development and keep it in agricultural use. Connects farmers with land access programs and advocates for farmland protection policies.",
    url: "https://farmland.org/",
    icon: <TreePine className="w-5 h-5" />,
    color: "oklch(0.32 0.08 145)",
    details: ["Farmland protection advocacy", "Farmer training and education programs", "Land access resources for beginning farmers", "Farmland finder tools and databases"],
    states: "National organization",
  },
  {
    id: 6,
    name: "National Young Farmers Coalition",
    category: "Agricultural Programs",
    description: "Advocates for young and beginning farmers on land access, student debt, healthcare, and climate change. Connects young farmers with land access resources.",
    url: "https://www.youngfarmers.org/",
    icon: <Sprout className="w-5 h-5" />,
    color: "oklch(0.38 0.09 140)",
    details: ["Land access resources and guides", "Farmer-to-farmer land matching programs", "Policy advocacy for beginning farmers", "Community of 100,000+ young farmers"],
    states: "National organization",
  },
  {
    id: 7,
    name: "Agrarian Trust",
    category: "Land Trusts",
    description: "Focuses specifically on keeping farmland affordable and accessible for the next generation of farmers through agrarian commons and land access programs.",
    url: "https://agrariantrust.org/",
    icon: <Shield className="w-5 h-5" />,
    color: "oklch(0.40 0.10 220)",
    details: ["Agrarian commons model for shared farmland", "Land access for beginning and BIPOC farmers", "Farmer training and mentorship", "Long-term land tenure security"],
    states: "Multiple states",
  },
  {
    id: 8,
    name: "USDA Beginning Farmer and Rancher Development Program",
    category: "Government Programs",
    description: "Provides grants to organizations that offer education, mentoring, and technical assistance to beginning farmers and ranchers, including land access education.",
    url: "https://www.nifa.usda.gov/grants/programs/beginning-farmer-rancher-development-program-bfrdp",
    icon: <DollarSign className="w-5 h-5" />,
    color: "oklch(0.45 0.10 65)",
    details: ["Training programs for new farmers", "Financial literacy and business planning", "Land access education and resources", "Connects beginners with experienced mentors"],
    states: "All 50 states",
  },
  {
    id: 9,
    name: "Farmers Market Coalition — Land Lease Programs",
    category: "Lease & Manage",
    description: "Many municipalities and counties offer lease programs for city-owned agricultural land. Farmers markets and local food councils often coordinate these programs.",
    url: "https://farmersmarketcoalition.org/",
    icon: <MapPin className="w-5 h-5" />,
    color: "oklch(0.35 0.06 55)",
    details: ["Municipal land lease opportunities", "Community garden and urban farm programs", "Incubator farm programs for beginning farmers", "Short-term leases to build experience"],
    states: "Check your municipality",
  },
  {
    id: 10,
    name: "The Conservation Fund",
    category: "Conservation",
    description: "Works to protect land and water resources across America. Offers conservation easements and works with landowners to protect agricultural land while allowing continued farming.",
    url: "https://www.conservationfund.org/",
    icon: <TreePine className="w-5 h-5" />,
    color: "oklch(0.32 0.08 145)",
    details: ["Conservation easements for working farms", "Land protection with continued agricultural use", "Tax benefits for landowners", "Long-term stewardship support"],
    states: "National organization",
  },
];

const categories: LandCategory[] = ["All", "Land Trusts", "Conservation", "Agricultural Programs", "Government Programs", "Lease & Manage"];

export default function LandAccess() {
  const [activeCategory, setActiveCategory] = useState<LandCategory>("All");

  const filtered = programs.filter((p) => activeCategory === "All" || p.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${LAND_IMG})` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, oklch(0.12 0.06 145 / 0.92) 0%, oklch(0.12 0.06 145 / 0.5) 60%, transparent 100%)" }} />
        <div className="relative container">
          <p className="section-label mb-3">The Land is Waiting</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
            Land Access Resources
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            There are more paths to land than most people realize. From community land trusts to conservation programs, government loans to lease opportunities — we've gathered the resources to help you find your ground.
          </p>
        </div>
      </section>

      {/* Intro Cards */}
      <section className="py-12" style={{ backgroundColor: "oklch(0.22 0.06 145)" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🏡", title: "Land Trusts", desc: "Community land trusts separate land ownership from home ownership, keeping land permanently affordable for stewards who manage and protect it." },
              { icon: "🌾", title: "Conservation Programs", desc: "Federal and state conservation programs pay landowners and farmers to implement sustainable practices — and can provide access to protected agricultural land." },
              { icon: "📋", title: "Government Programs", desc: "USDA and state agencies offer loans, grants, and technical assistance specifically designed to help beginning farmers access land and capital." },
            ].map((card) => (
              <div key={card.title} className="p-5 rounded-sm" style={{ backgroundColor: "oklch(0.28 0.07 145)" }}>
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-4 border-b" style={{ backgroundColor: "oklch(0.93 0.025 80)", borderColor: "oklch(0.82 0.03 75)" }}>
        <div className="container flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="px-3 py-1.5 text-sm font-semibold rounded-sm transition-all"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                backgroundColor: activeCategory === c ? "oklch(0.22 0.06 145)" : "oklch(0.98 0.01 85)",
                color: activeCategory === c ? "oklch(0.96 0.025 85)" : "oklch(0.35 0.03 65)",
                border: `1px solid ${activeCategory === c ? "oklch(0.22 0.06 145)" : "oklch(0.82 0.03 75)"}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((program) => (
              <div
                key={program.id}
                className="skill-card rounded-sm overflow-hidden"
                style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}
              >
                <div className="h-1.5" style={{ backgroundColor: program.color }} />
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-sm flex-shrink-0" style={{ backgroundColor: `${program.color}22`, color: program.color }}>
                      {program.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                          {program.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${program.color}22`, color: program.color, fontFamily: "'Source Serif 4', Georgia, serif" }}>
                          {program.category}
                        </span>
                      </div>
                      <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        <MapPin className="w-3 h-3" /> {program.states}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.35 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {program.description}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {program.details.map((d, i) => (
                      <li key={i} className="text-xs flex items-start gap-2" style={{ color: "oklch(0.42 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        <span style={{ color: program.color }}>▸</span> {d}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={program.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:opacity-80"
                    style={{ color: program.color, fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Visit Resource <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.93 0.025 80)" }}>
        <div className="container text-center">
          <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
            Know of a Resource We're Missing?
          </h2>
          <p className="text-base mb-6 max-w-xl mx-auto" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Land access programs vary widely by state and region. If you know of a local land trust, conservation program, or agricultural opportunity not listed here, share it with the community.
          </p>
          <a
            href="/community"
            className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Share in the Community
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

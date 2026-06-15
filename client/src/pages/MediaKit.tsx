/*
 * Media Kit — A1 Homestead Hub
 * Design: Rugged Americana Craft — consistent with site-wide style
 *
 * Sections:
 *  1. Cover / Hero — brand identity, tagline, quick-facts bar
 *  2. Platform Overview — what the site is and why it matters
 *  3. Audience Profile — demographics, psychographics, buying behavior
 *  4. Content Reach — sections, daily freshness engine, SEO footprint
 *  5. Ad Formats & Placements — visual grid of available placements
 *  6. Pricing Philosophy — transparent, no rate card, apply-based
 *  7. Brand Standards — logo usage, color palette, tone of voice
 *  8. Contact / Apply CTA
 */

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import {
  Sprout,
  Users,
  BookOpen,
  BarChart3,
  Repeat2,
  MapPin,
  Globe,
  Mail,
  Leaf,
  TrendingUp,
  Star,
  FileText,
  Megaphone,
  Image,
  PenLine,
  LayoutGrid,
  Rss,
  CheckCircle2,
  Download,
} from "lucide-react";

// ─── Brand Colors (for the palette section) ──────────────────────────────────
const BRAND_COLORS = [
  { name: "Forest Green", hex: "#1a3d2b", oklch: "oklch(0.18 0.06 145)", role: "Primary — headers, nav, hero backgrounds" },
  { name: "Harvest Amber", hex: "#c8820a", oklch: "oklch(0.68 0.12 65)", role: "Accent — CTAs, highlights, badges" },
  { name: "Parchment", hex: "#f5efe0", oklch: "oklch(0.96 0.025 85)", role: "Background — page canvas, cards" },
  { name: "Bark Brown", hex: "#5c3d1e", oklch: "oklch(0.35 0.06 55)", role: "Secondary — subheadings, borders" },
  { name: "Sage", hex: "#4a7c59", oklch: "oklch(0.42 0.08 145)", role: "Supporting — skill tags, tips, success states" },
];

// ─── Platform Stats ───────────────────────────────────────────────────────────
const PLATFORM_STATS = [
  { icon: <Globe className="w-5 h-5" />, value: "a1homesteadhub.com", label: "Live Domain" },
  { icon: <Rss className="w-5 h-5" />, value: "Daily", label: "New Content Published" },
  { icon: <BookOpen className="w-5 h-5" />, value: "9 Skill Areas", label: "Deep Content Library" },
  { icon: <Users className="w-5 h-5" />, value: "K–12", label: "Homeschool Curriculum" },
  { icon: <Repeat2 className="w-5 h-5" />, value: "Active", label: "Barter & Trade Board" },
  { icon: <MapPin className="w-5 h-5" />, value: "Nationwide", label: "Land Access Map" },
  { icon: <BarChart3 className="w-5 h-5" />, value: "Live", label: "Commodity Market Ticker" },
  { icon: <Sprout className="w-5 h-5" />, value: "2025", label: "Founded" },
];

// ─── Content Sections ─────────────────────────────────────────────────────────
const CONTENT_SECTIONS = [
  { emoji: "🔪", title: "Butchering", desc: "Processing livestock and wild game from harvest to table." },
  { emoji: "🌿", title: "Foraging", desc: "Wild edibles and medicinal plants by season and region." },
  { emoji: "🪵", title: "Building", desc: "Off-grid shelters, barns, fences, and outbuildings." },
  { emoji: "🫙", title: "Food Preservation", desc: "Canning, smoking, fermenting, dehydrating, root cellaring." },
  { emoji: "🌱", title: "Gardening", desc: "Heirloom seeds, companion planting, soil health, seed saving." },
  { emoji: "🦌", title: "Hunting & Fishing", desc: "Seasons, licensing, field dressing, ethical harvest." },
  { emoji: "🐓", title: "Animal Husbandry", desc: "Chickens, goats, pigs, cattle — care, breeding, health." },
  { emoji: "💧", title: "Water Systems", desc: "Rainwater collection, wells, filtration, gray water." },
  { emoji: "⚡", title: "Energy & Tools", desc: "Solar, generators, hand tools, off-grid power systems." },
  { emoji: "📚", title: "The Schoolhouse", desc: "K–12 STEM and AP-prep homeschool curriculum with AI tutor." },
  { emoji: "🗺️", title: "Land Access", desc: "Nationwide map connecting land seekers to landowners." },
  { emoji: "🔄", title: "Barter & Trade", desc: "Community board for trading goods, skills, and services." },
];

// ─── Ad Formats ───────────────────────────────────────────────────────────────
const AD_FORMATS = [
  {
    icon: <PenLine className="w-6 h-6" />,
    title: "Sponsored Blog Post",
    desc: "800–1,200 word article written in our voice, SEO-optimized, permanently indexed. Clearly labeled 'Sponsored' per FTC guidelines.",
    ideal: "Brand storytelling, product launches, seasonal campaigns",
    color: "oklch(0.32 0.08 145)",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Sponsored Skill Guide Section",
    desc: "A branded 'Resources' or 'Recommended Tools' section added to one of our 9 skill pages. Contextual placement with high dwell time.",
    ideal: "Tools, equipment, supplies directly related to the skill",
    color: "oklch(0.45 0.10 65)",
  },
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: "Featured Barter Listing",
    desc: "Pinned, highlighted listing on the Barter & Trade board. Reaches homesteaders actively looking to buy, sell, or trade.",
    ideal: "Products, seeds, livestock, equipment, services",
    color: "oklch(0.40 0.10 220)",
  },
  {
    icon: <Rss className="w-6 h-6" />,
    title: "Daily Feed Mention",
    desc: "Your product or brand mentioned in the 'This Week in Homesteading' homepage feed. Rotates daily, seen by every homepage visitor.",
    ideal: "Seasonal promotions, new product announcements",
    color: "oklch(0.50 0.12 30)",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Schoolhouse Lesson Sponsor",
    desc: "A sponsored resource section added to a homeschool course. Reaches parents actively investing in their children's education.",
    ideal: "Curriculum publishers, educational tools, homeschool supplies",
    color: "oklch(0.38 0.09 140)",
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: "Affiliate Integration",
    desc: "Tracked affiliate links woven naturally into relevant evergreen content. Pay per conversion — no upfront cost.",
    ideal: "Online retailers, subscription boxes, digital products",
    color: "oklch(0.35 0.06 55)",
  },
];

// ─── Audience Demographics ────────────────────────────────────────────────────
const AUDIENCE_FACTS = [
  { label: "Primary Age Range", value: "28–55" },
  { label: "Geography", value: "Rural & Suburban USA" },
  { label: "Household Type", value: "Families, homesteaders, preppers" },
  { label: "Education", value: "Mix — many college-educated, many trade-skilled" },
  { label: "Income", value: "Above average — they invest in quality" },
  { label: "Device Split", value: "Mobile-first, desktop for research" },
  { label: "Engagement Style", value: "Deep readers — high dwell time" },
  { label: "Purchase Behavior", value: "Research-first, brand-loyal buyers" },
];

// ─── Tone of Voice ────────────────────────────────────────────────────────────
const TONE_WORDS = [
  { word: "Honest", desc: "We do not oversell. Our audience trusts us because we tell them the truth — including when a product is not right for them." },
  { word: "Practical", desc: "Every piece of content has to be actionable. Theory without application does not belong here." },
  { word: "Rooted", desc: "We write from lived experience, not a content brief. The homestead lifestyle is not a trend for us — it is a legacy." },
  { word: "Respectful", desc: "Our audience is skilled, self-reliant, and independent. We never talk down to them." },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MediaKit() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <Navigation />

      {/* ── COVER / HERO ── */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(160deg, oklch(0.18 0.06 145) 0%, oklch(0.22 0.07 145) 50%, oklch(0.28 0.06 55) 100%)",
          borderBottom: "4px solid oklch(0.68 0.12 65)",
        }}
      >
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Brand mark */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div
                className="flex items-center justify-center w-24 h-24 rounded-sm"
                style={{ backgroundColor: "oklch(0.68 0.12 65)" }}
              >
                <Leaf className="w-14 h-14" style={{ color: "oklch(0.18 0.06 145)" }} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "oklch(0.68 0.12 65)" }}>
                  Media Kit
                </p>
                <p className="text-xs" style={{ color: "oklch(0.60 0.02 85)" }}>
                  2025 – 2026
                </p>
              </div>
            </div>

            {/* Headline */}
            <div className="flex-1 text-center md:text-left">
              <h1
                className="text-5xl md:text-6xl font-black mb-3 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}
              >
                A1 Homestead Hub
              </h1>
              <p
                className="text-xl mb-2"
                style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
              >
                "Where Self-Reliant Living Is Built, Taught, and Traded."
              </p>
              <p
                className="text-base max-w-xl leading-relaxed"
                style={{ color: "oklch(0.75 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                A1 Homestead Hub is a full-stack homesteading platform — skills library, homeschool curriculum,
                barter network, land access map, and community directory — built for families who are serious
                about self-reliant living.
              </p>
            </div>
          </div>

          {/* Quick-facts bar */}
          <div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px rounded-sm overflow-hidden"
            style={{ border: "1px solid oklch(0.35 0.07 145)" }}
          >
            {PLATFORM_STATS.slice(0, 8).map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-5 px-3 text-center"
                style={{ backgroundColor: "oklch(0.22 0.07 145)" }}
              >
                <span style={{ color: "oklch(0.68 0.12 65)" }}>{stat.icon}</span>
                <p
                  className="text-sm font-black mt-2 mb-0.5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.60 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM OVERVIEW ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.98 0.01 85)" }}>
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-2 text-center">Platform Overview</p>
            <h2
              className="text-4xl font-black mb-6 text-center"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
            >
              What A1 Homestead Hub Is
            </h2>
            <div className="space-y-5" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: "oklch(0.32 0.04 65)" }}>
              <p className="text-base leading-relaxed">
                A1 Homestead Hub is not a blog. It is a living platform — a comprehensive resource for
                homesteaders who are actively building self-reliant lives. The site combines a deep skills
                library, a K–12 homeschool curriculum with AI tutoring, a community barter board, a land
                access map, and a real-time commodity market ticker into a single destination.
              </p>
              <p className="text-base leading-relaxed">
                The platform is powered by a daily content automation engine that publishes new blog posts,
                skill tips, course expansions, and homestead feed updates every single day — without human
                intervention. This means Google sees a site that is always fresh, always relevant, and always
                growing. It also means your brand placement lives in an environment that is actively indexed
                and trafficked, not a static page that was last updated six months ago.
              </p>
              <p className="text-base leading-relaxed">
                A1 Homestead Hub was founded by Nikki Russell — journalist, photographer, and lifelong
                homesteader. The site is built on the principle that self-reliant living is not a trend; it
                is a legacy. That conviction shapes every piece of content, every partnership decision, and
                every product recommendation on the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE PROFILE ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
        <div className="container">
          <p className="section-label mb-2 text-center">Audience Profile</p>
          <h2
            className="text-4xl font-black mb-10 text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
          >
            Who We Reach
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: "Who They Are",
                icon: "👤",
                body: "Homesteaders, preppers, homeschool families, small-scale farmers, and back-to-the-land enthusiasts. Predominantly rural and suburban, ages 28–55, with above-average household income and a strong preference for quality over price.",
              },
              {
                title: "What They Buy",
                icon: "🛒",
                body: "Heirloom seeds, canning equipment, livestock supplies, off-grid tools, water filtration systems, homeschool curricula, hand tools, and long-term food storage. They research before they buy, and they buy to last.",
              },
              {
                title: "Why They Trust Us",
                icon: "🤝",
                body: "A1 Homestead Hub is built by a homesteader, for homesteaders. The founder does not recommend products she would not use herself. Our audience knows that — and it makes every placement worth more than a standard banner ad.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-6 rounded-sm"
                style={{ backgroundColor: "oklch(0.99 0.005 85)", border: "1px solid oklch(0.82 0.03 75)" }}
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h4
                  className="font-bold mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
                >
                  {card.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          {/* Demographics table */}
          <div
            className="rounded-sm overflow-hidden"
            style={{ border: "1px solid oklch(0.82 0.03 75)" }}
          >
            <div
              className="px-6 py-4"
              style={{ backgroundColor: "oklch(0.22 0.06 145)" }}
            >
              <h3
                className="font-bold text-lg"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}
              >
                Audience At a Glance
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {AUDIENCE_FACTS.map((fact, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-4"
                  style={{
                    backgroundColor: i % 2 === 0 ? "oklch(0.99 0.005 85)" : "oklch(0.97 0.01 85)",
                    borderBottom: "1px solid oklch(0.90 0.02 85)",
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: "oklch(0.50 0.05 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
                  >
                    {fact.label}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.22 0.06 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT REACH ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.98 0.01 85)" }}>
        <div className="container">
          <p className="section-label mb-2 text-center">Content Reach</p>
          <h2
            className="text-4xl font-black mb-4 text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
          >
            12 Content Verticals, Updated Daily
          </h2>
          <p
            className="text-base text-center max-w-xl mx-auto mb-10"
            style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Every section of the platform is a potential placement surface. Content is generated and updated
            daily by our automated freshness engine — meaning your brand appears alongside content that is
            always current and always relevant.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {CONTENT_SECTIONS.map((section, i) => (
              <div
                key={i}
                className="p-4 rounded-sm"
                style={{ backgroundColor: "oklch(0.96 0.025 85)", border: "1px solid oklch(0.82 0.03 75)" }}
              >
                <div className="text-3xl mb-2">{section.emoji}</div>
                <h4
                  className="font-bold text-sm mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
                >
                  {section.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.50 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {section.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Daily freshness engine callout */}
          <div
            className="p-8 rounded-sm"
            style={{ backgroundColor: "oklch(0.22 0.06 145)" }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <Rss className="w-10 h-10" style={{ color: "oklch(0.68 0.12 65)" }} />
              </div>
              <div>
                <h3
                  className="text-xl font-black mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}
                >
                  The Daily Freshness Engine
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "oklch(0.75 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}
                >
                  A1 Homestead Hub runs an automated content engine that publishes new material across the
                  platform every single day — without manual intervention. This is not scheduled social posts
                  or recycled content. It is genuinely new, AI-generated homesteading content that keeps
                  every section of the site fresh and indexed.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { time: "8:00 AM UTC", job: "Homepage 'This Week in Homesteading' feed refreshed (6 new cards)" },
                    { time: "9:00 AM UTC", job: "New blog post published (800–1,200 words, SEO-optimized)" },
                    { time: "10:00 AM UTC", job: "Skill tip added to one rotating skill page" },
                    { time: "11:00 AM UTC", job: "Bonus lesson or quiz question added to a Schoolhouse course" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-sm"
                      style={{ backgroundColor: "oklch(0.28 0.06 145)" }}
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.68 0.12 65)" }} />
                      <div>
                        <p className="text-xs font-bold" style={{ color: "oklch(0.68 0.12 65)" }}>{item.time}</p>
                        <p className="text-xs" style={{ color: "oklch(0.75 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>{item.job}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AD FORMATS ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
        <div className="container">
          <p className="section-label mb-2 text-center">Advertising Formats</p>
          <h2
            className="text-4xl font-black mb-4 text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
          >
            Available Placements
          </h2>
          <p
            className="text-base text-center max-w-xl mx-auto mb-10"
            style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            We do not sell banner impressions. Every placement is contextual, relevant, and reviewed by the
            founder before it goes live. These are the formats we currently offer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AD_FORMATS.map((fmt, i) => (
              <div
                key={i}
                className="p-6 rounded-sm flex flex-col"
                style={{ backgroundColor: "oklch(0.99 0.005 85)", border: `2px solid ${fmt.color}22` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span style={{ color: fmt.color }}>{fmt.icon}</span>
                  <h4
                    className="font-bold"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
                  >
                    {fmt.title}
                  </h4>
                </div>
                <p
                  className="text-sm leading-relaxed mb-4 flex-1"
                  style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
                >
                  {fmt.desc}
                </p>
                <div
                  className="px-3 py-2 rounded-sm"
                  style={{ backgroundColor: `${fmt.color}15` }}
                >
                  <p className="text-xs" style={{ color: fmt.color, fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    <strong>Ideal for:</strong> {fmt.ideal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PHILOSOPHY ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.98 0.01 85)" }}>
        <div className="container max-w-3xl">
          <p className="section-label mb-2 text-center">Pricing</p>
          <h2
            className="text-4xl font-black mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
          >
            No Rate Card. Here's Why.
          </h2>
          <div className="space-y-5" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: "oklch(0.32 0.04 65)" }}>
            <p className="text-base leading-relaxed">
              We do not publish a rate card because every partnership is different. A seed supplier placing
              a contextual link in a gardening skill guide is a different value proposition than a sponsored
              blog post that ranks on Google for five years. Pricing those the same way would be dishonest
              to both parties.
            </p>
            <p className="text-base leading-relaxed">
              What we can tell you is this: we are early-stage and transparent about it. Early partners get
              the best placement, the most founder attention, and the lowest rates — before traffic scales.
              If you want to be in front of homesteaders from day one, the cost of entry is lower right now
              than it will ever be again.
            </p>
            <p className="text-base leading-relaxed">
              We also offer affiliate arrangements for brands that prefer to pay on performance. No upfront
              cost, commission on sales only, and long-term evergreen placement in content that keeps
              getting indexed.
            </p>
          </div>

          <div
            className="mt-8 p-6 rounded-sm"
            style={{ backgroundColor: "oklch(0.96 0.025 85)", border: "2px solid oklch(0.68 0.12 65)" }}
          >
            <div className="flex items-start gap-4">
              <Star className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: "oklch(0.68 0.12 65)" }} />
              <div>
                <h4
                  className="font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
                >
                  Founding Partner Advantage
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
                >
                  The first 10 brands to partner with A1 Homestead Hub receive founding partner status —
                  permanent recognition on the Partners page, priority placement as the audience grows, and
                  rates locked at launch pricing. This is not a sales tactic. It is a genuine acknowledgment
                  that early partners take a bet on us, and we intend to honor that.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND STANDARDS ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
        <div className="container">
          <p className="section-label mb-2 text-center">Brand Standards</p>
          <h2
            className="text-4xl font-black mb-10 text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
          >
            Our Voice & Visual Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Color Palette */}
            <div>
              <h3
                className="font-bold text-lg mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
              >
                Brand Color Palette
              </h3>
              <div className="space-y-3">
                {BRAND_COLORS.map((color, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: color.oklch, border: "1px solid oklch(0.82 0.03 75)" }}
                    />
                    <div>
                      <p
                        className="font-bold text-sm"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
                      >
                        {color.name}
                      </p>
                      <p className="text-xs" style={{ color: "oklch(0.50 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        {color.hex} · {color.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tone of Voice */}
            <div>
              <h3
                className="font-bold text-lg mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}
              >
                Tone of Voice
              </h3>
              <div className="space-y-4">
                {TONE_WORDS.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-sm"
                    style={{ backgroundColor: "oklch(0.99 0.005 85)", border: "1px solid oklch(0.82 0.03 75)" }}
                  >
                    <p
                      className="font-black text-base mb-1"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.42 0.08 145)" }}
                    >
                      {item.word}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Typography note */}
              <div className="mt-5 p-4 rounded-sm" style={{ backgroundColor: "oklch(0.96 0.025 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "oklch(0.50 0.05 65)" }}>Typography</p>
                <p className="text-sm" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  <strong style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Playfair Display</strong> — headlines, navigation, brand voice<br />
                  <strong style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>Source Serif 4</strong> — body copy, descriptions, long-form content
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT / APPLY CTA ── */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, oklch(0.18 0.06 145) 0%, oklch(0.28 0.08 145) 60%, oklch(0.35 0.06 55) 100%)",
        }}
      >
        <div className="container text-center max-w-2xl">
          <Mail className="w-12 h-12 mx-auto mb-5" style={{ color: "oklch(0.68 0.12 65)" }} />
          <h2
            className="text-4xl font-black mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}
          >
            Ready to Partner?
          </h2>
          <p
            className="text-base mb-8 leading-relaxed"
            style={{ color: "oklch(0.75 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Every partnership inquiry goes directly to the founder. No ticketing system, no virtual
            assistant. Submit the application and expect a personal response within 3–5 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/partners#apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: "oklch(0.68 0.12 65)",
                color: "oklch(0.18 0.06 145)",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1rem",
              }}
            >
              Apply to Partner →
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: "transparent",
                color: "oklch(0.96 0.025 85)",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1rem",
                border: "2px solid oklch(0.50 0.04 85)",
              }}
            >
              View Partnership Tiers
            </Link>
          </div>
          <p
            className="mt-8 text-xs"
            style={{ color: "oklch(0.55 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            A1 Homestead Hub · a1homesteadhub.com · Founded 2025 by Nikki Russell
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/*
 * Home Page — Homestead Hub
 * Design: Rugged Americana Craft
 * Full-bleed hero, staggered skills grid, community teaser, CTA sections
 */

import { useEffect, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, BookOpen, Calendar, Headphones, FileText, MapPin, Repeat2, TreePine, Users, Sparkles, TrendingUp, CloudSun, Leaf, Newspaper } from "lucide-react";
import { trpc } from "@/lib/trpc";

// ─── This Week in Homesteading — Live Daily Feed ─────────────────────────────

const FEED_ICONS: Record<string, React.ReactNode> = {
  market: <TrendingUp className="w-5 h-5" />,
  weather: <CloudSun className="w-5 h-5" />,
  seasonal: <Leaf className="w-5 h-5" />,
  tip: <Sparkles className="w-5 h-5" />,
  news: <Newspaper className="w-5 h-5" />,
};

const FEED_COLORS: Record<string, { bg: string; border: string; icon: string; label: string }> = {
  market:   { bg: "oklch(0.97 0.02 65)",  border: "oklch(0.82 0.06 65)",  icon: "oklch(0.55 0.12 65)",  label: "Market Watch" },
  weather:  { bg: "oklch(0.97 0.02 220)", border: "oklch(0.80 0.06 220)", icon: "oklch(0.50 0.12 220)", label: "Weather & Climate" },
  seasonal: { bg: "oklch(0.96 0.03 140)", border: "oklch(0.78 0.07 140)", icon: "oklch(0.45 0.12 140)", label: "Seasonal" },
  tip:      { bg: "oklch(0.96 0.03 145)", border: "oklch(0.78 0.07 145)", icon: "oklch(0.42 0.12 145)", label: "Homestead Tip" },
  news:     { bg: "oklch(0.97 0.01 75)",  border: "oklch(0.82 0.03 75)",  icon: "oklch(0.45 0.05 75)",  label: "Community" },
};

function HomesteadFeed() {
  const { data: items, isLoading } = trpc.freshness.getHomesteadFeed.useQuery({ limit: 6 });

  if (isLoading) {
    return (
      <section className="py-16" style={{ backgroundColor: "oklch(0.98 0.01 85)" }}>
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6" style={{ color: "oklch(0.52 0.12 140)" }} />
            <h2 className="text-3xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              This Week in Homesteading
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-5 rounded-sm animate-pulse" style={{ backgroundColor: "oklch(0.93 0.02 85)", height: "140px" }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="py-16" style={{ backgroundColor: "oklch(0.98 0.01 85)" }}>
      <div className="container">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" style={{ color: "oklch(0.52 0.12 140)" }} />
            <h2 className="text-3xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              This Week in Homesteading
            </h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "oklch(0.88 0.05 140)", color: "oklch(0.28 0.08 140)" }}>
            Updated Daily
          </span>
        </div>
        <p className="mb-8 text-sm" style={{ color: "oklch(0.50 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          Fresh insights, seasonal tips, and market context — generated every morning for the homesteading community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const colors = FEED_COLORS[item.type] ?? FEED_COLORS.tip;
            return (
              <div
                key={item.id}
                className="p-5 rounded-sm"
                style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: colors.icon }}>{FEED_ICONS[item.type]}</span>
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: colors.icon }}>
                    {colors.label}
                  </span>
                </div>
                <h3 className="font-bold mb-2 text-sm leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                  {item.headline}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {item.body}
                </p>
                {item.source && (
                  <p className="text-xs mt-3 opacity-60" style={{ color: "oklch(0.45 0.03 65)" }}>
                    — {item.source}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const SITE_URL = "https://a1homesteadhub.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "A1 Homestead Hub",
  "url": SITE_URL,
  "logo": `${SITE_URL}/favicon.ico`,
  "description": "A1 Homestead Hub is a self-reliant living community offering homesteading skills, AI-powered homeschool courses, barter & trade, land access resources, and community connection for homesteaders across America.",
  "sameAs": [
    "https://www.facebook.com/a1homesteadhub"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": SITE_URL
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does A1 Homestead Hub partner with ElevenLabs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. A1 Homestead Hub is an official ElevenLabs affiliate partner. The Schoolhouse Pro tier integrates ElevenLabs AI voice technology to power Miss Hazel, our AI voice tutor. Miss Hazel reads lessons aloud and responds to student questions in a warm, natural voice."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI Course Creator work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Describe any course topic in plain English, pick a grade level (K–2 through 11–12/AP), choose a subject, and the AI generates a complete curriculum: lesson content, hands-on activities, vocabulary, fun facts, and quiz questions — all in under 60 seconds."
      }
    },
    {
      "@type": "Question",
      "name": "What is Miss Hazel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Miss Hazel is the AI tutor built into The Schoolhouse. She knows the content of every lesson and can explain concepts, quiz students, and answer homesteading questions. Free users get text chat; Schoolhouse Pro subscribers activate her ElevenLabs voice."
      }
    },
    {
      "@type": "Question",
      "name": "Is A1 Homestead Hub free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — the Skills Hub, community, barter board, blog, and basic AI Course Creator are all free. Schoolhouse Pro ($9/month or $79/year) unlocks ElevenLabs voice features, unlimited AI course generation, and AI-generated course cover images."
      }
    },
    {
      "@type": "Question",
      "name": "What homesteading skills does the Skills Hub cover?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Butchering, foraging, building, food preservation (canning, smoking, fermenting, dehydrating), gardening and seed saving, hunting and game processing, animal husbandry, water systems, solar energy, and herbal medicine."
      }
    }
  ]
};

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/hero-homestead-LxdjGSkwEZ2SSqHyG2V4jA.webp";
const SKILLS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/skills-collage-KwZPrPQKyyFRcZtTBfbfuA.webp";
const BARTER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/barter-trade-3QymJoA3SDb8yHv3z9pTvD.webp";
const LAND_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/land-access-Yd5NbuEXUP6AZmM6oxzigS.webp";

const skills = [
  { slug: "butchering", title: "Butchering", icon: "🔪", desc: "Process livestock and wild game with confidence. Step-by-step guides from harvest to table.", color: "oklch(0.38 0.12 25)" },
  { slug: "foraging", title: "Foraging", icon: "🌿", desc: "Identify wild edibles and medicinal plants by season and region. Nature's grocery store.", color: "oklch(0.32 0.08 145)" },
  { slug: "building", title: "Building", icon: "🪵", desc: "Construct shelters, fences, barns, and outbuildings. Practical off-grid construction skills.", color: "oklch(0.35 0.06 55)" },
  { slug: "food-preservation", title: "Food Preservation", icon: "🫙", desc: "Canning, smoking, fermenting, dehydrating, and root cellaring. Never waste a harvest.", color: "oklch(0.45 0.10 65)" },
  { slug: "gardening", title: "Gardening", icon: "🌱", desc: "Planting calendars, companion planting, soil health, and seed saving for every climate.", color: "oklch(0.38 0.09 140)" },
  { slug: "hunting-gaming", title: "Hunting & Gaming", icon: "🦌", desc: "Hunting seasons by state, licensing, field dressing, and ethical harvest practices.", color: "oklch(0.30 0.07 50)" },
  { slug: "animal-husbandry", title: "Animal Husbandry", icon: "🐓", desc: "Chickens, goats, pigs, and cattle — care, breeding, health, and sustainable management.", color: "oklch(0.42 0.08 80)" },
  { slug: "water-systems", title: "Water Systems", icon: "💧", desc: "Rainwater collection, well drilling, filtration systems, and gray water management.", color: "oklch(0.40 0.10 220)" },
  { slug: "solar-energy", title: "Solar Energy", icon: "☀️", desc: "Small-scale solar setup, battery banks, and off-grid power for your homestead.", color: "oklch(0.65 0.14 80)" },
];

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Find Your People",
    desc: "Connect with intentional living folks in your region. The Alaskan off-grid family and the suburban backyard gardener are both here.",
    href: "/community",
    cta: "Find Your People",
  },
  {
    icon: <Repeat2 className="w-6 h-6" />,
    title: "Barter & Trade Board",
    desc: "Trade seeds, skills, tools, and time. A parallel economy that runs on trust, not just dollars.",
    href: "/barter",
    cta: "Start Trading",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Map Explorer",
    desc: "Find land, water sources, homesteader communities, and terrain data near you — on your phone, in the field.",
    href: "/map",
    cta: "Open the Map",
  },
  {
    icon: <TreePine className="w-6 h-6" />,
    title: "Land Access",
    desc: "Land trusts, conservation programs, and agricultural opportunities. You don't need 40 acres to start — you need a plan.",
    href: "/land-access",
    cta: "Find Land",
  },
];

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const children = el.querySelectorAll(".fade-in-up");
    children.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FromTheFieldTeaser() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ limit: 3 });

  return (
    <section className="py-20" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5" style={{ color: "oklch(0.55 0.10 145)" }} />
              <p className="section-label">The Homestead Journal</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              From the Field
            </h2>
            <p className="mt-3 text-lg max-w-xl" style={{ color: "oklch(0.35 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Real knowledge from real homesteaders. Heritage skills, honest stories, and practical wisdom — straight from the land.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-sm transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Read All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Post cards */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-sm overflow-hidden animate-pulse" style={{ background: "oklch(0.90 0.02 80)", height: 320 }} />
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-12 rounded-sm" style={{ background: "oklch(0.93 0.02 80)" }}>
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: "oklch(0.40 0.08 145)" }} />
            <p className="font-semibold" style={{ color: "oklch(0.45 0.04 80)" }}>First posts coming soon — check back shortly.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article
                  className="group rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "white", border: "1px solid oklch(0.88 0.03 80)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                >
                  {/* Hero image */}
                  {post.heroImageUrl ? (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={post.heroImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-44 flex items-center justify-center" style={{ background: "oklch(0.25 0.07 145)" }}>
                      <BookOpen className="w-10 h-10 opacity-30" style={{ color: "oklch(0.75 0.12 80)" }} />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Category */}
                    {post.category && (
                      <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full inline-block mb-2"
                        style={{ background: "oklch(0.92 0.04 145)", color: "oklch(0.30 0.08 145)" }}>
                        {post.category}
                      </span>
                    )}

                    <h3 className="text-lg font-bold mb-2 leading-snug group-hover:underline"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.22 0.06 50)" }}>
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-sm mb-3 line-clamp-2" style={{ color: "oklch(0.45 0.04 80)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        {post.excerpt}
                      </p>
                    )}

                    {/* Media badges */}
                    <div className="flex items-center gap-3 mb-3">
                      {post.audioUrl && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.45 0.08 220)" }}>
                          <Headphones className="w-3 h-3" /> Podcast
                        </span>
                      )}
                      {post.pdfUrl && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.45 0.08 25)" }}>
                          <FileText className="w-3 h-3" /> PDF Guide
                        </span>
                      )}
                    </div>

                    {/* Author + date */}
                    <div className="flex items-center gap-2 pt-3 border-t text-xs" style={{ borderColor: "oklch(0.90 0.02 80)", color: "oklch(0.55 0.04 80)" }}>
                      <span>{post.author}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const skillsRef = useFadeIn();
  const featuresRef = useFadeIn();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navigation />

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.12 0.05 145 / 0.92) 0%, oklch(0.12 0.05 145 / 0.5) 50%, transparent 100%)" }} />

        <div className="relative container pb-16 pt-32">
          <div className="max-w-2xl">
            <p className="section-label mb-4">Home Instead — Intentional Living for 2026</p>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
              The Homestead Hub
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              You still have a smartphone. You still live in 2026. You just decided that Walmart, McDonald's, and a fragile supply chain aren't the only answer. Home Instead is the choice to know how to feed yourself, build what you need, and connect with people who think the same way.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/skills"
                className="inline-flex items-center gap-2 px-6 py-3 font-bold text-base rounded-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Explore Skills Hub <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 px-6 py-3 font-bold text-base rounded-sm border-2 transition-all hover:bg-white/10"
                style={{ borderColor: "oklch(0.82 0.02 85)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS GRID ── */}
      <section className="py-20" style={{ backgroundColor: "oklch(0.96 0.025 85)" }} ref={skillsRef}>
        <div className="container">
          <div className="mb-12">
            <p className="section-label mb-2">10 Core Modules</p>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              The Skills Hub
            </h2>
            <p className="mt-4 text-lg max-w-2xl" style={{ color: "oklch(0.35 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Practical, no-nonsense guides built for real homesteaders. Each module covers everything from beginner basics to advanced techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill, i) => (
              <Link
                key={skill.slug}
                href={`/skills/${skill.slug}`}
                className={`skill-card fade-in-up block rounded-sm overflow-hidden group`}
                style={{
                  transitionDelay: `${i * 60}ms`,
                  border: "1px solid oklch(0.82 0.03 75)",
                  backgroundColor: "oklch(0.98 0.01 85)",
                }}
              >
                <div className="h-2" style={{ backgroundColor: skill.color }} />
                <div className="p-5">
                  <div className="text-3xl mb-3">{skill.icon}</div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                    {skill.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.42 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {skill.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: skill.color, fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Learn More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              View All Skills <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SKILLS COLLAGE BREAK ── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SKILLS_IMG})` }}
        />
        <div className="absolute inset-0" style={{ background: "oklch(0.15 0.06 145 / 0.82)" }} />
        <div className="relative container text-center">
          <p className="section-label mb-3" style={{ color: "oklch(0.68 0.12 65)" }}>The Home Instead Creed</p>
          <blockquote className="text-3xl md:text-5xl font-black italic leading-tight max-w-3xl mx-auto" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
            "Your home is not a liability. It is the answer."
          </blockquote>
          <p className="mt-6 text-base" style={{ color: "oklch(0.72 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            You have a smartphone and a Raspberry Pi and a seed catalog. You live in 2026. You just choose differently.
          </p>
        </div>
      </section>

      {/* ── COMMUNITY FEATURES ── */}
      <section className="py-20" style={{ backgroundColor: "oklch(0.93 0.025 80)" }} ref={featuresRef}>
        <div className="container">
          <div className="mb-12">
            <p className="section-label mb-2">More Than a Guide</p>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              A Living Community
            </h2>
            <p className="mt-4 text-lg max-w-2xl" style={{ color: "oklch(0.35 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              The Homestead Hub is more than a skills library. It's a network of people building resilient lives — together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <Link
                key={f.href}
                href={f.href}
                className={`skill-card fade-in-up group flex gap-5 p-6 rounded-sm`}
                style={{
                  transitionDelay: `${i * 80}ms`,
                  backgroundColor: "oklch(0.98 0.01 85)",
                  border: "1px solid oklch(0.82 0.03 75)",
                }}
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-sm" style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.68 0.12 65)" }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "oklch(0.42 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {f.desc}
                  </p>
                  <span className="text-sm font-bold flex items-center gap-1" style={{ color: "oklch(0.32 0.08 145)", fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {f.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BARTER SECTION ── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BARTER_IMG})` }}
        />
        <div className="absolute inset-0" style={{ background: "oklch(0.12 0.04 55 / 0.80)" }} />
        <div className="relative container">
          <div className="max-w-xl">
            <p className="section-label mb-3">When the Dollar Fails</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
              Barter & Trade in a Resilient Economy
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Post what you have. Find what you need. Trade skills, goods, and labor in a community that values real work over paper promises. Eggs for honey. Labor for lumber. Knowledge for knowledge.
            </p>
            <Link
              href="/barter"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Open the Trade Board <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LAND ACCESS SECTION ── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${LAND_IMG})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, oklch(0.12 0.06 145 / 0.90) 0%, oklch(0.12 0.06 145 / 0.40) 60%, transparent 100%)" }} />
        <div className="relative container">
          <div className="max-w-xl">
            <p className="section-label mb-3">The Land is Waiting</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
              Find Land to Manage, Protect & Grow
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              From community land trusts to conservation easements and agricultural programs — there are more paths to land than you think. We connect you with the resources to find, access, and steward the land you need.
            </p>
            <Link
              href="/land-access"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Explore Land Access <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── THIS WEEK IN HOMESTEADING — Daily AI Feed ── */}
      <HomesteadFeed />

      {/* ── FROM THE FIELD TEASER ── */}
      <FromTheFieldTeaser />

      {/* ── FINAL CTA ── */}
      <section className="py-20" style={{ backgroundColor: "oklch(0.22 0.06 145)" }}>
        <div className="container text-center">
          <p className="section-label mb-3" style={{ color: "oklch(0.68 0.12 65)" }}>Ready to Start?</p>
          <h2 className="text-4xl md:text-5xl font-black mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
            Your Homestead Journey Begins Here
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: "oklch(0.72 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Whether you have 10 acres or a balcony garden, the skills you learn here will serve you for life. Start with one skill. Build from there.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-sm border-2 transition-all hover:bg-white/10"
              style={{ borderColor: "oklch(0.68 0.12 65)", color: "oklch(0.68 0.12 65)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Explore the Map
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold font-serif text-center mb-2" style={{ color: "oklch(0.18 0.06 145)" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm">
            Everything you need to know about A1 Homestead Hub
          </p>
          <div className="space-y-4">
            {[
              {
                q: "Does A1 Homestead Hub partner with ElevenLabs?",
                a: "Yes. A1 Homestead Hub is an official ElevenLabs affiliate partner. The Schoolhouse Pro tier integrates ElevenLabs AI voice technology to power Miss Hazel, our AI voice tutor. Miss Hazel reads lessons aloud and responds to student questions in a warm, natural voice."
              },
              {
                q: "How does the AI Course Creator work?",
                a: "Describe any course topic in plain English, pick a grade level (K–2 through 11–12/AP), choose a subject, and the AI generates a complete curriculum: lesson content, hands-on activities, vocabulary, fun facts, and quiz questions — all in under 60 seconds."
              },
              {
                q: "What is Miss Hazel?",
                a: "Miss Hazel is the AI tutor built into The Schoolhouse. She knows the content of every lesson and can explain concepts, quiz students, and answer homesteading questions. Free users get text chat; Schoolhouse Pro subscribers activate her ElevenLabs voice."
              },
              {
                q: "Is A1 Homestead Hub free to use?",
                a: "Yes — the Skills Hub, community, barter board, blog, and basic AI Course Creator are all free. Schoolhouse Pro ($9/month or $79/year) unlocks ElevenLabs voice features, unlimited AI course generation, and AI-generated course cover images."
              },
              {
                q: "What homesteading skills does the Skills Hub cover?",
                a: "Butchering, foraging, building, food preservation (canning, smoking, fermenting, dehydrating), gardening and seed saving, hunting and game processing, animal husbandry, water systems, solar energy, and herbal medicine."
              },
              {
                q: "What grade levels does The Schoolhouse support?",
                a: "The Schoolhouse supports K\u20132, 3\u20135, 6\u20138, 9\u201310, and 11\u201312/AP grade levels. The AI Course Creator generates homestead-integrated STEM curriculum for any level, including AP content for high school students."
              },
              {
                q: "Does A1 Homestead Hub have live market data?",
                a: "Yes. A live scrolling commodity ticker shows real-time prices for corn, wheat, soybeans, cattle, lean hogs, coffee, sugar, gold, and silver, plus DOW Jones, S&P 500, and NASDAQ indices. Click any ticker item to open a detailed historical price chart."
              },
              {
                q: "What is the Barter & Trade board?",
                a: "The Barter & Trade board is a free classifieds-style marketplace for homesteaders to list goods, skills, and services for trade or sale. Post livestock, produce, tools, seeds, or homestead services and connect with others in your area."
              },
            ].map((item, i) => (
              <details key={i} className="group bg-[#FAF1DF] rounded-xl border border-amber-200">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[#123E16] list-none">
                  {item.q}
                  <span className="ml-4 shrink-0 text-amber-600 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-5 pb-5 text-gray-700 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/features" className="text-sm font-semibold text-[#123E16] underline underline-offset-2 hover:text-amber-700 transition-colors">
              View full platform documentation →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

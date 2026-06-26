/*
 * /join — Subscriber Conversion Landing Page
 * Dedicated destination for Facebook campaign traffic
 * Goal: convert visitors into registered email subscribers
 */

import { useState, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Sprout,
  BookOpen,
  Users,
  Repeat2,
  MapPin,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Leaf,
  Shield,
  Zap,
  ChevronDown,
  FileText,
  GraduationCap,
  Newspaper,
} from "lucide-react";

// ─── Value Propositions ───────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    icon: <Sprout className="w-6 h-6" />,
    title: "9 Deep Skill Libraries",
    desc: "Butchering, foraging, building, food preservation, gardening, hunting, animal husbandry, water systems, and off-grid energy — each written like your most knowledgeable neighbor sat down and told you everything they know.",
    color: "oklch(0.38 0.09 140)",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Full Homeschool Curriculum",
    desc: "K–8 STEM with a homesteading lens, 9th–12th AP prep, AI course creator, and Miss Hazel — an AI tutor who reads lessons aloud, answers questions, and guides students through the material.",
    color: "oklch(0.45 0.10 65)",
  },
  {
    icon: <Repeat2 className="w-6 h-6" />,
    title: "Barter & Trade Board",
    desc: "Post goods, skills, and services. Browse what your community has to offer. Direct exchange — no fees, no middleman, no algorithm deciding who sees your listing.",
    color: "oklch(0.38 0.12 25)",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Land Access Map",
    desc: "Find land available to lease or share in your region. Post land you're willing to steward. Connect directly with landowners. The barrier to homesteading is often land — this is where that changes.",
    color: "oklch(0.40 0.10 220)",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Live Market Ticker",
    desc: "Real-time commodity prices — corn, wheat, cattle, hogs, milk, eggs, soybeans, coffee, and more — plus DOW, NASDAQ, and S&P 500. Click any commodity for a 30-day price chart.",
    color: "oklch(0.42 0.08 80)",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Directory",
    desc: "Find homesteaders near you by location, skills, and interests. Create a profile. Connect directly. This is how local homestead networks actually get built — one real connection at a time.",
    color: "oklch(0.35 0.06 55)",
  },
];

// ─── What You Get section ─────────────────────────────────────────────────────

const PERKS = [
  "Daily blog post — new homesteading content every morning",
  "Tip of the Day on every skill page — updated automatically",
  "Community events calendar — local fairs, markets, and gatherings",
  "Free e-book: The A1 Homestead Starter Guide",
  "Weekly digest of new courses and skill content",
  "Early access to new features as they launch",
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. Creating an account, reading all skill libraries, browsing the barter board, using the land access map, and accessing the community directory are all completely free. The Schoolhouse Pro tier ($9/month) unlocks advanced AI tutor features and unlimited course creation — but the core platform has no cost.",
  },
  {
    q: "Do I need to be an experienced homesteader?",
    a: "No. The skill libraries start from the beginning and build progressively. The homeschool curriculum is designed for families at every stage. The community directory includes people who are just starting out alongside people who have been doing this for decades.",
  },
  {
    q: "What happens after I sign up?",
    a: "You'll receive a welcome email with your free e-book and a tour of the platform. After that, you'll get a weekly digest of new content. You can unsubscribe at any time — no questions asked.",
  },
  {
    q: "How often is new content added?",
    a: "Every single day. The platform runs an automated content engine that publishes a new blog post, adds a skill tip to a rotating skill page, expands a course with new material, and refreshes the homepage feed — all before 11am UTC daily.",
  },
];

// ─── Social Proof Section ─────────────────────────────────────────────────────

function SocialProofSection() {
  const { data: stats } = trpc.stats.getSiteStats.useQuery();

  // Platform stats — real DB counts where available, otherwise honest platform facts
  const statCards = [
    {
      icon: <Users className="w-6 h-6" />,
      value: stats?.subscribers != null ? `${stats.subscribers.toLocaleString()}+` : "Growing",
      label: "Community Members",
      sub: "Homesteaders who joined the list",
      color: "oklch(0.38 0.09 140)",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      value: "9",
      label: "Skill Libraries",
      sub: "Butchering, foraging, building, and 6 more",
      color: "oklch(0.45 0.10 65)",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      value: stats?.courses != null && stats.courses > 0 ? `${stats.courses}` : "K–12",
      label: stats?.courses != null && stats.courses > 0 ? "Courses Available" : "Grade Coverage",
      sub: "Homeschool STEM + AP prep curriculum",
      color: "oklch(0.52 0.16 260)",
    },
    {
      icon: <Newspaper className="w-6 h-6" />,
      value: stats?.blogPosts != null ? `${stats.blogPosts}+` : "Daily",
      label: "Blog Posts",
      sub: "New homesteading content every morning",
      color: "oklch(0.40 0.10 220)",
    },
  ];

  return (
    <section
      className="py-16"
      style={{
        background: "linear-gradient(180deg, oklch(0.13 0.05 145) 0%, oklch(0.15 0.06 140) 100%)",
        borderTop: "1px solid oklch(0.24 0.06 145)",
        borderBottom: "1px solid oklch(0.24 0.06 145)",
      }}
    >
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "oklch(0.68 0.12 65)" }}
            >
              By the Numbers
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.88 0.02 85)" }}
            >
              A Platform That's Already Working
            </h2>
            <p
              className="mt-3 text-sm max-w-xl mx-auto"
              style={{ color: "oklch(0.58 0.04 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              Real numbers. No inflated claims. This is where the platform stands today.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-sm p-5 text-center"
                style={{
                  backgroundColor: "oklch(0.17 0.06 145)",
                  border: "1px solid oklch(0.26 0.06 145)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: card.color + "33", color: card.color }}
                >
                  {card.icon}
                </div>
                <div
                  className="text-2xl font-black mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.88 0.02 85)" }}
                >
                  {card.value}
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: "oklch(0.68 0.12 65)" }}
                >
                  {card.label}
                </div>
                <div className="text-xs" style={{ color: "oklch(0.52 0.03 85)" }}>
                  {card.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Platform trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: <Shield className="w-4 h-4" />, text: "Free forever — no paywall on core content" },
              { icon: <Zap className="w-4 h-4" />, text: "Updated automatically every day" },
              { icon: <CheckCircle2 className="w-4 h-4" />, text: "No ads, no tracking, no algorithm" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.58 0.04 85)" }}>
                <span style={{ color: "oklch(0.68 0.12 65)" }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b cursor-pointer"
      style={{ borderColor: "oklch(0.28 0.06 145)" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between py-4 gap-4">
        <p className="text-base font-semibold" style={{ color: "oklch(0.88 0.02 85)", fontFamily: "'Playfair Display', Georgia, serif" }}>
          {q}
        </p>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: "oklch(0.68 0.12 65)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      {open && (
        <p className="pb-4 text-sm leading-relaxed" style={{ color: "oklch(0.68 0.04 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Join() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const subscribe = trpc.community.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    subscribe.mutate({ email: email.trim(), firstName: firstName.trim() || undefined, source: "facebook-campaign" });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.12 0.04 145)" }}>
      <Navigation />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.14 0.06 145) 0%, oklch(0.18 0.08 140) 50%, oklch(0.16 0.05 145) 100%)",
          borderBottom: "1px solid oklch(0.28 0.06 145)",
        }}
      >
        {/* Decorative grain overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: "oklch(0.22 0.08 140)", color: "oklch(0.68 0.12 65)", border: "1px solid oklch(0.35 0.10 140)" }}>
              <Leaf className="w-3 h-3" />
              Free to Join — No Credit Card
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.92 0.03 85)" }}
            >
              The Knowledge Your{" "}
              <span style={{ color: "oklch(0.68 0.12 65)" }}>Grandparents Had</span>{" "}
              — Built for Today
            </h1>

            <p
              className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
              style={{ color: "oklch(0.70 0.03 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              A1 Homestead Hub is a free platform for self-reliant living — skill libraries, homeschool curriculum, barter board, land access map, community directory, and daily content that updates itself every morning.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToForm}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-sm font-bold text-base transition-all hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: "oklch(0.68 0.12 65)",
                  color: "oklch(0.12 0.04 145)",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  boxShadow: "0 4px 20px oklch(0.68 0.12 65 / 0.3)",
                }}
              >
                Join Free — Get the E-Book
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-sm font-semibold text-base transition-all hover:opacity-80"
                style={{
                  border: "1px solid oklch(0.35 0.07 145)",
                  color: "oklch(0.78 0.02 85)",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                Explore the Platform First
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              {[
                { icon: <Shield className="w-4 h-4" />, text: "No spam, ever" },
                { icon: <Zap className="w-4 h-4" />, text: "New content daily" },
                { icon: <CheckCircle2 className="w-4 h-4" />, text: "Unsubscribe anytime" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm" style={{ color: "oklch(0.58 0.04 85)" }}>
                  <span style={{ color: "oklch(0.68 0.12 65)" }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What You Get ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.14 0.05 145)" }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.88 0.02 85)" }}
            >
              Everything in One Place. All Free.
            </h2>
            <p className="text-center mb-12 text-sm" style={{ color: "oklch(0.58 0.04 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Six interconnected systems that work together — not six separate websites you have to manage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {VALUE_PROPS.map((vp) => (
                <div
                  key={vp.title}
                  className="rounded-sm p-5 transition-all hover:translate-y-[-2px]"
                  style={{
                    backgroundColor: "oklch(0.17 0.06 145)",
                    border: "1px solid oklch(0.26 0.06 145)",
                    boxShadow: "0 2px 12px oklch(0.08 0.04 145 / 0.5)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center mb-4"
                    style={{ backgroundColor: vp.color + "33", color: vp.color }}
                  >
                    {vp.icon}
                  </div>
                  <h3
                    className="text-base font-bold mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.88 0.02 85)" }}
                  >
                    {vp.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.62 0.03 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {vp.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof / Platform Stats ── */}
      <SocialProofSection />

      {/* ── Email Capture Form ── */}
      <section
        ref={formRef}
        className="py-20"
        style={{
          background: "linear-gradient(180deg, oklch(0.14 0.05 145) 0%, oklch(0.16 0.07 140) 100%)",
          borderTop: "1px solid oklch(0.26 0.06 145)",
          borderBottom: "1px solid oklch(0.26 0.06 145)",
        }}
      >
        <div className="container">
          <div className="max-w-lg mx-auto">
            {submitted ? (
              /* Success State */
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: "oklch(0.32 0.09 140)", color: "oklch(0.68 0.12 65)" }}
                >
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.88 0.02 85)" }}
                >
                  Welcome to the Community
                </h2>
                <p className="mb-6 text-sm leading-relaxed" style={{ color: "oklch(0.65 0.03 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  Your free e-book is on its way to your inbox. Check your spam folder if you don't see it within a few minutes.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-bold text-sm transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "oklch(0.68 0.12 65)",
                    color: "oklch(0.12 0.04 145)",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Explore the Platform
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              /* Form State */
              <>
                <div className="text-center mb-8">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold uppercase tracking-widest"
                    style={{ backgroundColor: "oklch(0.22 0.08 140)", color: "oklch(0.68 0.12 65)", border: "1px solid oklch(0.35 0.10 140)" }}
                  >
                    <Star className="w-3 h-3" />
                    Free Starter Pack
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.88 0.02 85)" }}
                  >
                    Join Free. Get the E-Book.
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.62 0.03 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    Enter your email and we'll send you <strong style={{ color: "oklch(0.78 0.04 85)" }}>The A1 Homestead Starter Guide</strong> — a practical introduction to self-reliant living, free, immediately.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "oklch(0.58 0.04 85)" }}>
                      First Name (optional)
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="What should we call you?"
                      className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all"
                      style={{
                        backgroundColor: "oklch(0.20 0.06 145)",
                        border: "1px solid oklch(0.32 0.07 145)",
                        color: "oklch(0.88 0.02 85)",
                        fontFamily: "'Source Serif 4', Georgia, serif",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "oklch(0.68 0.12 65)")}
                      onBlur={(e) => (e.target.style.borderColor = "oklch(0.32 0.07 145)")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "oklch(0.58 0.04 85)" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all"
                      style={{
                        backgroundColor: "oklch(0.20 0.06 145)",
                        border: "1px solid oklch(0.32 0.07 145)",
                        color: "oklch(0.88 0.02 85)",
                        fontFamily: "'Source Serif 4', Georgia, serif",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "oklch(0.68 0.12 65)")}
                      onBlur={(e) => (e.target.style.borderColor = "oklch(0.32 0.07 145)")}
                    />
                  </div>

                  {error && (
                    <p className="text-sm" style={{ color: "oklch(0.65 0.18 25)" }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={subscribe.isPending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-sm font-bold text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                    style={{
                      backgroundColor: "oklch(0.68 0.12 65)",
                      color: "oklch(0.12 0.04 145)",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      boxShadow: "0 4px 20px oklch(0.68 0.12 65 / 0.3)",
                    }}
                  >
                    {subscribe.isPending ? (
                      "Joining..."
                    ) : (
                      <>
                        Join Free — Send My E-Book
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs" style={{ color: "oklch(0.45 0.03 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    No spam. No selling your data. Unsubscribe anytime with one click.{" "}
                    <a href="/privacy-policy" className="underline hover:opacity-80" style={{ color: "oklch(0.60 0.06 145)" }}>Privacy Policy</a>
                  </p>
                </form>

                {/* Perks list */}
                <div
                  className="mt-8 p-5 rounded-sm"
                  style={{ backgroundColor: "oklch(0.17 0.06 145)", border: "1px solid oklch(0.26 0.06 145)" }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "oklch(0.68 0.12 65)" }}>
                    What you get as a member
                  </p>
                  <div className="space-y-2.5">
                    {PERKS.map((perk) => (
                      <div key={perk} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.58 0.12 140)" }} />
                        <p className="text-sm" style={{ color: "oklch(0.72 0.03 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                          {perk}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.14 0.05 145)" }}>
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-2xl font-bold text-center mb-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.88 0.02 85)" }}
            >
              Questions
            </h2>
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, oklch(0.16 0.07 140) 0%, oklch(0.14 0.05 145) 100%)",
          borderTop: "1px solid oklch(0.26 0.06 145)",
        }}
      >
        <div className="container text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.92 0.03 85)" }}
          >
            This is a Legacy Project.
          </h2>
          <p
            className="text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ color: "oklch(0.65 0.03 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Built to last longer than any of us. The knowledge that belongs to all of us — written down, searchable, and free.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm font-bold text-base transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: "oklch(0.68 0.12 65)",
              color: "oklch(0.12 0.04 145)",
              fontFamily: "'Playfair Display', Georgia, serif",
              boxShadow: "0 4px 20px oklch(0.68 0.12 65 / 0.3)",
            }}
          >
            Join Free Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

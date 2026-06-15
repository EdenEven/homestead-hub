/*
 * Partners & Advertisers — A1 Homestead Hub
 * Design: Rugged Americana Craft — consistent with site-wide style
 *
 * Sections:
 *  1. Hero — "Grow With Us" headline + value proposition
 *  2. Media Kit — audience stats, content categories, reach
 *  3. Partnership Tiers — Seed Supplier / Advertiser / Affiliate / Sponsored Content
 *  4. Why Partner — trust signals, daily freshness engine, community depth
 *  5. Application Form — public form, stores to DB, notifies owner
 *  6. FAQ
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Sprout,
  BarChart3,
  Users,
  BookOpen,
  Repeat2,
  MapPin,
  CheckCircle2,
  Mail,
  Globe,
  Phone,
  ChevronDown,
  ChevronUp,
  Leaf,
  TrendingUp,
  Star,
  Handshake,
} from "lucide-react";

// ─── Media Kit Stats ──────────────────────────────────────────────────────────

const MEDIA_STATS = [
  { icon: <Users className="w-6 h-6" />, value: "Growing Daily", label: "Active Homesteaders", sub: "Real community members, not bots" },
  { icon: <BookOpen className="w-6 h-6" />, value: "9 Skill Areas", label: "Deep Content Library", sub: "Butchering, foraging, building, and more" },
  { icon: <Sprout className="w-6 h-6" />, value: "K–12 Courses", label: "Homeschool Curriculum", sub: "STEM + AP prep for homestead families" },
  { icon: <BarChart3 className="w-6 h-6" />, value: "Daily Updates", label: "Fresh Content Every Day", sub: "AI-powered, always relevant" },
  { icon: <Repeat2 className="w-6 h-6" />, value: "Barter Board", label: "Active Trade Network", sub: "Real goods, real neighbors" },
  { icon: <MapPin className="w-6 h-6" />, value: "Land Access Map", label: "Nationwide Coverage", sub: "Connecting land seekers to landowners" },
];

const CONTENT_CATEGORIES = [
  { emoji: "🌱", label: "Heirloom Seeds & Gardening" },
  { emoji: "🫙", label: "Food Preservation & Canning" },
  { emoji: "🐓", label: "Animal Husbandry" },
  { emoji: "🪵", label: "Off-Grid Building" },
  { emoji: "💧", label: "Water Systems" },
  { emoji: "🌿", label: "Foraging & Wild Edibles" },
  { emoji: "🔪", label: "Butchering & Processing" },
  { emoji: "🦌", label: "Hunting & Fishing" },
  { emoji: "📚", label: "Homeschool STEM + AP" },
];

// ─── Partnership Tiers ────────────────────────────────────────────────────────

const TIERS = [
  {
    icon: <Sprout className="w-7 h-7" />,
    type: "seed_supplier" as const,
    title: "Seed Supplier Partner",
    tagline: "Put your seeds in front of homesteaders who are actively planting.",
    color: "oklch(0.32 0.08 145)",
    bg: "oklch(0.96 0.03 140)",
    border: "oklch(0.78 0.07 140)",
    perks: [
      "Featured placement in the Skills Hub gardening section",
      "Dedicated supplier spotlight blog post (AI-written, reviewed by you)",
      "Product links in relevant skill guides and lesson plans",
      "Seasonal seed-saving tips co-branded with your catalog",
      "Banner placement on the Barter Board",
    ],
    ideal: "Heirloom seed companies, nurseries, Azure Standard-style co-ops, seed libraries",
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    type: "product_advertiser" as const,
    title: "Product Advertiser",
    tagline: "Reach an audience that buys tools, supplies, and homestead essentials.",
    color: "oklch(0.45 0.10 65)",
    bg: "oklch(0.97 0.02 65)",
    border: "oklch(0.82 0.06 65)",
    perks: [
      "Banner and card placements across the site",
      "Product mentions in daily AI-generated blog posts",
      "Featured listing in the Barter Board sponsor section",
      "Inclusion in the weekly homestead feed digest",
      "Contextual placement in relevant skill and course pages",
    ],
    ideal: "Homestead tools, canning supplies, water filtration, solar equipment, livestock supplies",
  },
  {
    icon: <Handshake className="w-7 h-7" />,
    type: "affiliate" as const,
    title: "Affiliate Partner",
    tagline: "Pay only for results. We drive traffic; you pay per conversion.",
    color: "oklch(0.40 0.10 220)",
    bg: "oklch(0.97 0.02 220)",
    border: "oklch(0.80 0.06 220)",
    perks: [
      "Affiliate links woven naturally into relevant content",
      "Tracked links with transparent reporting",
      "No upfront cost — commission on sales only",
      "Long-term content placement (evergreen articles)",
      "Ideal for subscription boxes, online stores, digital products",
    ],
    ideal: "Online retailers, subscription boxes, digital course creators, equipment rentals",
  },
  {
    icon: <Star className="w-7 h-7" />,
    type: "sponsored_content" as const,
    title: "Sponsored Content",
    tagline: "Your story, told in our voice, to an audience that trusts us.",
    color: "oklch(0.50 0.12 30)",
    bg: "oklch(0.97 0.02 30)",
    border: "oklch(0.82 0.06 30)",
    perks: [
      "Full sponsored blog post (800–1,200 words, SEO-optimized)",
      "Sponsored Schoolhouse lesson or skill guide section",
      "Social media amplification (Facebook + future channels)",
      "Permanent placement on the site — not a time-limited ad",
      "Clearly labeled 'Sponsored' per FTC guidelines",
    ],
    ideal: "Brands with a story to tell — heritage seed companies, family farms, rural lifestyle brands",
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How large is your audience right now?",
    a: "A1 Homestead Hub launched in 2025 and is in active growth. We are transparent: we are building the audience alongside the platform. Early partners get the best placement and the lowest rates — before traffic scales. If you want to be in front of homesteaders from day one, now is the time.",
  },
  {
    q: "Do you accept any product category?",
    a: "No. We only partner with brands that genuinely serve the homesteading lifestyle. We will not promote products that conflict with self-reliant, sustainable living. If you sell heirloom seeds, quality tools, livestock supplies, off-grid equipment, or homeschool resources, you are a natural fit.",
  },
  {
    q: "How does the application process work?",
    a: "Submit the form below. We review every application personally — no automated rejections. If there is a fit, we will respond within 3–5 business days with a proposal. If we are not the right match, we will tell you that too.",
  },
  {
    q: "Is there a minimum commitment?",
    a: "No. We offer both one-time placements (sponsored posts, single-season campaigns) and ongoing partnerships. We would rather start small and grow the relationship than lock anyone into a contract.",
  },
  {
    q: "Can I see where my content will appear before committing?",
    a: "Yes. We will walk you through the exact placement — the page, the section, the context — before you commit to anything. No surprises.",
  },
];

// ─── Application Form ─────────────────────────────────────────────────────────

const PARTNER_TYPE_LABELS: Record<string, string> = {
  seed_supplier: "Seed Supplier",
  product_advertiser: "Product Advertiser",
  affiliate: "Affiliate Partner",
  sponsored_content: "Sponsored Content",
  other: "Other / Not Sure Yet",
};

function ApplicationForm({ defaultType }: { defaultType?: string }) {
  type PartnerType = "seed_supplier" | "product_advertiser" | "affiliate" | "sponsored_content" | "other";
  const [form, setForm] = useState<{
    contactName: string;
    company: string;
    email: string;
    website: string;
    phone: string;
    partnerType: PartnerType;
    message: string;
  }>({
    contactName: "",
    company: "",
    email: "",
    website: "",
    phone: "",
    partnerType: (defaultType as PartnerType) ?? "seed_supplier",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = trpc.partners.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message),
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "partnerType") {
      setForm(prev => ({ ...prev, partnerType: value as PartnerType }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    submit.mutate(form);
  }

  if (submitted) {
    return (
      <div className="text-center py-16 px-6">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-5" style={{ color: "oklch(0.52 0.12 140)" }} />
        <h3 className="text-3xl font-black mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
          Application Received
        </h3>
        <p className="text-lg max-w-md mx-auto" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          Thank you for reaching out. We review every application personally and will be in touch within 3–5 business days.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "2px",
    border: "1px solid oklch(0.78 0.04 75)",
    backgroundColor: "oklch(0.99 0.005 85)",
    color: "oklch(0.18 0.06 145)",
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "0.95rem",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "0.78rem",
    fontWeight: "700",
    letterSpacing: "0.07em",
    textTransform: "uppercase" as const,
    color: "oklch(0.45 0.05 65)",
    fontFamily: "'Source Serif 4', Georgia, serif",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label style={labelStyle}>Your Name *</label>
          <input
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            required
            placeholder="Jane Smith"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Company / Brand *</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            placeholder="Heirloom Seed Co."
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email Address *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="jane@yourcompany.com"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Phone (optional)</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="(555) 000-0000"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Website (optional)</label>
          <input
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            placeholder="https://yourcompany.com"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Partnership Type *</label>
          <select
            name="partnerType"
            value={form.partnerType}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            {Object.entries(PARTNER_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Tell Us About Your Brand & What You're Looking For *</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          minLength={20}
          rows={6}
          placeholder="Describe your products, your target customer, and what kind of partnership you have in mind. The more detail you give us, the better we can match you to the right placement."
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.03 65)" }}>
          Minimum 20 characters · {form.message.length}/3000
        </p>
      </div>

      {error && (
        <p className="text-sm p-3 rounded-sm" style={{ backgroundColor: "oklch(0.96 0.03 25)", color: "oklch(0.35 0.10 25)", border: "1px solid oklch(0.80 0.07 25)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submit.isPending}
        className="w-full py-4 font-black text-lg rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
        style={{
          backgroundColor: "oklch(0.22 0.06 145)",
          color: "oklch(0.96 0.025 85)",
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
      >
        {submit.isPending ? "Submitting…" : "Submit Partnership Application →"}
      </button>

      <p className="text-xs text-center" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
        We review every application personally. No automated responses. No spam. Just a real conversation.
      </p>
    </form>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ border: "1px solid oklch(0.82 0.03 75)" }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-black/5"
        style={{ backgroundColor: open ? "oklch(0.96 0.03 140)" : "oklch(0.99 0.005 85)" }}
      >
        <span className="font-bold pr-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
          {q}
        </span>
        {open
          ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.45 0.07 145)" }} />
          : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.45 0.07 145)" }} />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 pt-3" style={{ backgroundColor: "oklch(0.98 0.01 85)" }}>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(0.35 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Partners() {
  const [selectedTierType, setSelectedTierType] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <Navigation />

      {/* ── HERO ── */}
      <section
        className="py-20 border-b"
        style={{
          background: "linear-gradient(135deg, oklch(0.18 0.06 145) 0%, oklch(0.28 0.08 145) 60%, oklch(0.35 0.06 55) 100%)",
          borderColor: "oklch(0.30 0.06 145)",
        }}
      >
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-widest"
            style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)" }}>
            <Leaf className="w-3 h-3" /> Partner With A1 Homestead Hub
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
            Grow With Us
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: "oklch(0.78 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            A1 Homestead Hub is where serious homesteaders come to learn, trade, and build self-reliant lives.
            If your products or services serve that mission, we want to talk.
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Apply to Partner →
          </a>
        </div>
      </section>

      {/* ── MEDIA KIT ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.98 0.01 85)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Media Kit</p>
            <h2 className="text-4xl font-black mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              Who We Reach
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Our audience is not casual browsers. They are homesteaders actively building self-reliant lives —
              people who buy seeds, tools, and supplies because they need them, not because they saw an ad.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {MEDIA_STATS.map((stat, i) => (
              <div key={i} className="p-5 rounded-sm text-center" style={{ backgroundColor: "oklch(0.96 0.025 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
                <div className="flex justify-center mb-3" style={{ color: "oklch(0.42 0.10 145)" }}>
                  {stat.icon}
                </div>
                <p className="text-xl font-black mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                  {stat.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "oklch(0.45 0.05 65)" }}>
                  {stat.label}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Content Categories */}
          <div className="p-8 rounded-sm" style={{ backgroundColor: "oklch(0.22 0.06 145)" }}>
            <h3 className="text-xl font-black mb-5 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
              Content Categories
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {CONTENT_CATEGORIES.map((cat, i) => (
                <div key={i} className="text-center p-3 rounded-sm" style={{ backgroundColor: "oklch(0.28 0.06 145)" }}>
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <p className="text-xs font-medium leading-tight" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {cat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Audience Profile */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Who They Are", body: "Homesteaders, preppers, homeschool families, small-scale farmers, and back-to-the-land enthusiasts. Predominantly rural and suburban, ages 28–55, with above-average household income and a strong preference for quality over price." },
              { title: "What They Buy", body: "Heirloom seeds, canning equipment, livestock supplies, off-grid tools, water filtration, homeschool curricula, hand tools, and food storage. They research before they buy and they buy to last." },
              { title: "Why They Trust Us", body: "A1 Homestead Hub is built by a homesteader, for homesteaders. We do not recommend products we would not use ourselves. Our audience knows that — and it makes every placement worth more than a banner ad." },
            ].map((card, i) => (
              <div key={i} className="p-6 rounded-sm" style={{ backgroundColor: "oklch(0.96 0.025 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
                <h4 className="font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                  {card.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERSHIP TIERS ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Partnership Options</p>
            <h2 className="text-4xl font-black mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              How We Work Together
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Every partnership is custom. These tiers describe the most common arrangements —
              but if you have something else in mind, tell us in the application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.type}
                className="p-7 rounded-sm"
                style={{ backgroundColor: tier.bg, border: `2px solid ${tier.border}` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span style={{ color: tier.color }}>{tier.icon}</span>
                  <h3 className="text-xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                    {tier.title}
                  </h3>
                </div>
                <p className="text-sm italic mb-5" style={{ color: "oklch(0.38 0.04 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {tier.tagline}
                </p>
                <ul className="space-y-2 mb-5">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "oklch(0.28 0.04 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                      {perk}
                    </li>
                  ))}
                </ul>
                <p className="text-xs mb-4" style={{ color: "oklch(0.50 0.04 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  <strong>Ideal for:</strong> {tier.ideal}
                </p>
                <a
                  href="#apply"
                  onClick={() => setSelectedTierType(tier.type)}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: tier.color, color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Apply for This Tier →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.98 0.01 85)" }}>
        <div className="container">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Why A1 Homestead Hub</p>
            <h2 className="text-3xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              A Platform That's Always Growing
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌱",
                title: "Content That Never Goes Stale",
                body: "Our AI-powered daily freshness engine publishes new blog posts, skill tips, and homestead insights every single day. Your placement lives in a site that Google sees as active and authoritative — not a static brochure.",
              },
              {
                icon: "🤝",
                title: "Built on Trust, Not Traffic",
                body: "We are early-stage and transparent about it. What we offer is something most large platforms cannot: a founder who personally reviews every partnership, an audience that is genuinely engaged, and placements that are contextually relevant — not just banner slots.",
              },
              {
                icon: "📚",
                title: "Homeschool Families Are Buyers",
                body: "The Schoolhouse serves K–12 homeschool families with STEM and AP-prep courses. These are households that actively invest in their children's education and their homestead. Seed suppliers, curriculum publishers, and educational tool makers have a direct line to this audience.",
              },
            ].map((card, i) => (
              <div key={i} className="p-6 rounded-sm" style={{ backgroundColor: "oklch(0.96 0.025 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
                <div className="text-4xl mb-4">{card.icon}</div>
                <h4 className="font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                  {card.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section id="apply" className="py-16" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Get Started</p>
            <h2 className="text-4xl font-black mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              Apply to Partner
            </h2>
            <p className="text-base" style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Tell us about your brand. We read every application and respond personally.
            </p>
          </div>
          <div className="p-8 rounded-sm" style={{ backgroundColor: "oklch(0.99 0.005 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
            <ApplicationForm defaultType={selectedTierType} />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16" style={{ backgroundColor: "oklch(0.98 0.01 85)" }}>
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-black mb-8 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
            Common Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
          <div className="mt-10 p-6 rounded-sm text-center" style={{ backgroundColor: "oklch(0.22 0.06 145)" }}>
            <Mail className="w-8 h-8 mx-auto mb-3" style={{ color: "oklch(0.68 0.12 65)" }} />
            <p className="font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
              Want more detail before applying?
            </p>
            <p className="text-sm mb-4" style={{ color: "oklch(0.72 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Review our full Media Kit — audience profile, content reach, ad formats, brand standards, and pricing philosophy.
            </p>
            <Link
              href="/media-kit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.18 0.06 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              View Media Kit →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

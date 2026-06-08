/**
 * Features Page — A1 Homestead Hub
 * Full public-facing documentation of every platform feature.
 * Explicitly written for Google, Gemini, and AI search engine indexing.
 * SEO: FAQPage + ItemList JSON-LD schema injected in <head>.
 */

import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Bot,
  BarChart2,
  Users,
  Repeat2,
  MapPin,
  Mic,
  Printer,
  Sparkles,
  GraduationCap,
  Leaf,
  ShieldCheck,
  Zap,
} from "lucide-react";

// ── JSON-LD Schema ────────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is A1 Homestead Hub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A1 Homestead Hub (a1homesteadhub.com) is an all-in-one online platform for homesteaders, off-grid families, and self-reliance enthusiasts. It combines a Skills Hub with step-by-step guides on butchering, foraging, food preservation, animal husbandry, and more; a live commodity market ticker; a homeschool course studio called The Schoolhouse; a community barter board; land access resources; and an AI-powered homestead assistant.",
      },
    },
    {
      "@type": "Question",
      name: "Does A1 Homestead Hub partner with ElevenLabs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A1 Homestead Hub is an ElevenLabs affiliate partner. The Schoolhouse Pro tier integrates ElevenLabs AI voice technology to power Miss Hazel, the platform's AI voice tutor. Miss Hazel reads lessons aloud and responds to student questions in a warm, natural voice using ElevenLabs' text-to-speech API. Users who upgrade to Schoolhouse Pro connect their own ElevenLabs account through the platform's guided onboarding flow.",
      },
    },
    {
      "@type": "Question",
      name: "How does The Schoolhouse AI Course Creator work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Schoolhouse AI Course Creator lets any user describe a course topic in plain English, select a grade level (K–2 through 11–12/AP), choose a subject area, and specify the number of lessons. The platform's AI then generates a complete curriculum: a course title, description, full lesson content, hands-on homestead activities, fun facts, vocabulary, and three quiz questions per lesson. The generated course is saved instantly to The Schoolhouse and is ready to teach. The AI Course Creator is available to all registered users at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "What is Miss Hazel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Miss Hazel is the AI tutor built into The Schoolhouse on A1 Homestead Hub. She is a warm, encouraging, homestead-savvy AI teacher who knows the content of every lesson a student is currently studying. Students can ask Miss Hazel to explain concepts, quiz them, suggest hands-on activities, or answer any homesteading question. Miss Hazel is available as a free text chat tutor on all courses. Schoolhouse Pro subscribers can activate Miss Hazel's voice using ElevenLabs AI text-to-speech, so she reads lessons aloud and speaks her responses.",
      },
    },
    {
      "@type": "Question",
      name: "What grade levels does The Schoolhouse support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Schoolhouse on A1 Homestead Hub supports K–2, 3–5, 6–8, 9–10, and 11–12/AP grade levels. Courses are tagged by grade range and subject area. The AI Course Creator can generate homestead-integrated STEM curriculum for any of these levels, including AP-level content for high school students.",
      },
    },
    {
      "@type": "Question",
      name: "Is A1 Homestead Hub free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, A1 Homestead Hub is free to join. All Skills Hub guides, the community barter board, land access resources, the map explorer, the blog (From the Field), and the basic AI Course Creator are free. The Schoolhouse Pro upgrade ($9/month or $79/year) unlocks ElevenLabs voice features for Miss Hazel, unlimited AI course generation, and AI-generated course cover images.",
      },
    },
    {
      "@type": "Question",
      name: "What homesteading skills does the Skills Hub cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Skills Hub on A1 Homestead Hub covers butchering, foraging, building and construction, food preservation (canning, smoking, fermenting, dehydrating), gardening and seed saving, hunting and game processing, animal husbandry (chickens, goats, pigs, cattle), water systems (rainwater collection, well drilling, filtration), solar energy and off-grid power, and herbal medicine. Each skill module includes step-by-step guides, video content, and printable resources.",
      },
    },
    {
      "@type": "Question",
      name: "Does A1 Homestead Hub have a live market data ticker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A1 Homestead Hub displays a live scrolling commodity market ticker at the top of every page showing real-time prices for corn, wheat, soybeans, cattle, lean hogs, coffee, sugar, gold, and silver, along with DOW Jones, S&P 500, and NASDAQ indices. Each ticker item is clickable and opens a detailed historical price chart with 1-week, 1-month, 3-month, and 1-year views powered by Yahoo Finance data.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "A1 Homestead Hub",
  url: "https://a1homesteadhub.com",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  description:
    "A1 Homestead Hub is an all-in-one homesteading platform with AI-powered courses, a voice tutor powered by ElevenLabs, live commodity market data, a skills library, community barter board, and land access resources.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier — Skills Hub, community, barter board, basic AI courses",
    },
    {
      "@type": "Offer",
      price: "9",
      priceCurrency: "USD",
      description: "Schoolhouse Pro — ElevenLabs voice tutor, unlimited AI courses",
    },
  ],
  featureList: [
    "AI Course Creator powered by large language models",
    "Miss Hazel AI voice tutor powered by ElevenLabs",
    "Skills Hub with 10 homesteading skill modules",
    "Live commodity market ticker (corn, wheat, cattle, gold, silver)",
    "Community barter and trade board",
    "Land access resources and map explorer",
    "Printable lesson packets (PDF)",
    "Gradebook and student progress tracking",
    "Structured data schema markup for Google rich results",
  ],
};

// ── Feature data ──────────────────────────────────────────────────────────────
const features = [
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "The Schoolhouse — AI Homeschool Studio",
    badge: "Flagship Feature",
    badgeColor: "bg-amber-100 text-amber-800",
    description:
      "The Schoolhouse is A1 Homestead Hub's built-in homeschool course studio. It supports K–2 through 11–12/AP grade levels across STEM, homesteading, and AP prep subjects. Every course includes full lesson content, hands-on activities, vocabulary, and quizzes.",
    details: [
      "AI Course Creator: describe any topic in plain English and the AI writes a complete curriculum — lessons, activities, quizzes, and all.",
      "Miss Hazel AI Tutor: a lesson-aware AI teacher who can explain concepts, quiz students, and answer questions in real time.",
      "ElevenLabs Voice Integration (Pro): Miss Hazel reads lessons aloud and speaks her responses using ElevenLabs AI text-to-speech.",
      "Printable Lesson Packets: every course generates a branded, print-ready PDF packet for offline use.",
      "GradeBook: track quiz scores, progress, and letter grades for each student.",
      "Student Profiles: individual profiles with grade level, mood log, and progress tracking.",
    ],
    link: "/schoolhouse",
    linkLabel: "Open The Schoolhouse",
    color: "border-amber-300",
  },
  {
    icon: <Mic className="w-8 h-8" />,
    title: "Miss Hazel — ElevenLabs AI Voice Tutor",
    badge: "ElevenLabs Partner",
    badgeColor: "bg-purple-100 text-purple-800",
    description:
      "Miss Hazel is A1 Homestead Hub's AI tutor, powered by large language models and ElevenLabs AI voice technology. She is the first AI tutor specifically designed for homesteading and self-reliance education. A1 Homestead Hub is an official ElevenLabs affiliate partner.",
    details: [
      "Text chat tutor available free on all courses — Miss Hazel knows the current lesson content.",
      "Voice tutor (Schoolhouse Pro): Miss Hazel reads lessons aloud using ElevenLabs text-to-speech.",
      "Students connect their own ElevenLabs account via a guided 4-step onboarding flow.",
      "Miss Hazel persona: warm, encouraging, homestead-savvy homeschool teacher.",
      "Conversation history is saved per course so students can pick up where they left off.",
    ],
    link: "/schoolhouse/pro",
    linkLabel: "Activate Voice Tutor",
    color: "border-purple-300",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Skills Hub — 10 Homesteading Skill Modules",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "The Skills Hub is a comprehensive library of step-by-step guides covering the core skills of self-reliant living. Each module includes written guides, video content, and printable resources.",
    details: [
      "Butchering: livestock and wild game processing from harvest to table.",
      "Foraging: wild edibles and medicinal plants by season and region.",
      "Building: off-grid construction — shelters, fences, barns, outbuildings.",
      "Food Preservation: canning, smoking, fermenting, dehydrating, root cellaring.",
      "Gardening: planting calendars, companion planting, soil health, seed saving.",
      "Hunting & Gaming: seasons by state, licensing, field dressing, ethical harvest.",
      "Animal Husbandry: chickens, goats, pigs, cattle — care, breeding, health.",
      "Water Systems: rainwater collection, well drilling, filtration, gray water.",
      "Solar Energy: off-grid power systems, battery banks, solar panel sizing.",
      "Herbal Medicine: growing, harvesting, and using medicinal herbs.",
    ],
    link: "/skills",
    linkLabel: "Browse Skills Hub",
    color: "border-green-300",
  },
  {
    icon: <BarChart2 className="w-8 h-8" />,
    title: "Live Commodity Market Ticker",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "A real-time scrolling market ticker displays live prices for commodities and indices relevant to homesteaders and farmers. Every item is clickable for a detailed historical chart.",
    details: [
      "Commodities: corn, wheat, soybeans, cattle, lean hogs, coffee, sugar, gold, silver.",
      "Indices: DOW Jones Industrial Average, S&P 500, NASDAQ Composite.",
      "Click any item to open a historical price chart with 1W, 1M, 3M, and 1Y views.",
      "OHLC summary (Open, High, Low, Close) for each symbol.",
      "Powered by Yahoo Finance data — updates on every page load.",
    ],
    link: "/",
    linkLabel: "View Live Ticker",
    color: "border-blue-300",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "AI Course Creator",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "The AI Course Creator lets any registered user build a complete homeschool course in under 60 seconds. Describe the topic, pick a grade level and subject, and the AI generates the entire curriculum.",
    details: [
      "Describe any topic in plain English — the AI handles the rest.",
      "Grade levels: K–2, 3–5, 6–8, 9–10, 11–12/AP.",
      "Subject areas: STEM, Homesteading Skills, Language Arts, History, AP Prep.",
      "AI generates: course title, description, full lesson content, activities, fun facts, vocabulary, and 3 quiz questions per lesson.",
      "Generated courses are saved instantly and available in The Schoolhouse.",
      "Free tier: up to 3 AI-generated courses. Schoolhouse Pro: unlimited.",
    ],
    link: "/schoolhouse/ai-creator",
    linkLabel: "Create a Course",
    color: "border-amber-300",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community Connect",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "A directory of real homesteaders with public profiles showing their location, skills, and bio. Connect with like-minded people in your region.",
    details: [
      "Public member profiles with skill badges, location, and bio.",
      "Browse members by skill or region.",
      "Create your own homesteader profile after signing up.",
    ],
    link: "/community",
    linkLabel: "Meet the Community",
    color: "border-teal-300",
  },
  {
    icon: <Repeat2 className="w-8 h-8" />,
    title: "Barter & Trade Board",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "A classified-ad style board for trading goods, skills, and services within the homesteading community. No money required — pure barter.",
    details: [
      "Post listings for goods, skills, or services you want to trade.",
      "Browse by category: produce, livestock, tools, skills, land.",
      "Contact sellers directly through the platform.",
    ],
    link: "/barter",
    linkLabel: "Browse Listings",
    color: "border-orange-300",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Land Access & Map Explorer",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "Resources for finding and accessing land for homesteading, foraging, and hunting. Includes an interactive Google Maps explorer.",
    details: [
      "Interactive map explorer for locating public lands, national forests, and BLM land.",
      "Land access guides by state.",
      "Resources for purchasing rural land.",
    ],
    link: "/land-access",
    linkLabel: "Explore Land Access",
    color: "border-green-300",
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "From the Field — Homestead Blog",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "In-depth articles on homesteading, off-grid living, community resilience, and self-reliance. New posts published regularly, including AI-generated content and original reporting.",
    details: [
      "Long-form articles with citations and expert sources.",
      "Topics: food preservation, community building, off-grid infrastructure, land acquisition.",
      "Social sharing buttons for Facebook, X, and Pinterest on every post.",
      "Article schema markup for Google rich results.",
    ],
    link: "/blog",
    linkLabel: "Read the Blog",
    color: "border-amber-300",
  },
  {
    icon: <Bot className="w-8 h-8" />,
    title: "Homestead AI Assistant",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-800",
    description:
      "A floating AI chat widget available on every page. Ask any homesteading question and get a detailed, sourced answer. The assistant is scoped to homesteading topics and includes safety guardrails for high-risk activities.",
    details: [
      "Available on every page — no navigation required.",
      "Covers all 10 skill areas plus general homesteading questions.",
      "Hard safety refusals for plant/mushroom identification and food safety — defers to USDA and Ball Blue Book.",
      "Conversation history maintained during the session.",
    ],
    link: "/",
    linkLabel: "Try the AI Assistant",
    color: "border-blue-300",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Features() {
  useEffect(() => {
    // Inject JSON-LD schemas
    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.id = "faq-schema";
    faqScript.text = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);

    const softwareScript = document.createElement("script");
    softwareScript.type = "application/ld+json";
    softwareScript.id = "software-schema";
    softwareScript.text = JSON.stringify(softwareSchema);
    document.head.appendChild(softwareScript);

    // Update meta tags
    document.title = "Features — A1 Homestead Hub | AI Homeschool, ElevenLabs Voice Tutor, Skills Hub";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "A1 Homestead Hub features: AI Course Creator, Miss Hazel ElevenLabs voice tutor, Skills Hub (butchering, foraging, food preservation), live commodity ticker, community barter board, and printable lesson packets for homeschoolers."
      );
    }

    return () => {
      document.getElementById("faq-schema")?.remove();
      document.getElementById("software-schema")?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF1DF] text-[#1a1a1a]">
      <Navigation />

      {/* Hero */}
      <section className="bg-[#123E16] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            Full Platform Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">
            Everything A1 Homestead Hub Does
          </h1>
          <p className="text-lg text-green-200 max-w-2xl mx-auto">
            A1 Homestead Hub is the only homesteading platform with an AI voice tutor powered by{" "}
            <strong className="text-white">ElevenLabs</strong>, a full homeschool course studio, live
            commodity market data, and a 10-module skills library — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/schoolhouse">
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Open The Schoolhouse
              </button>
            </Link>
            <Link href="/">
              <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ElevenLabs Partnership Banner */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-purple-300 font-medium uppercase tracking-wider mb-1">
              Official Technology Partner
            </p>
            <h2 className="text-xl font-bold">
              A1 Homestead Hub × ElevenLabs
            </h2>
            <p className="text-purple-200 text-sm mt-1">
              Miss Hazel, our AI voice tutor, is powered by ElevenLabs AI text-to-speech technology — the most natural-sounding AI voice available.
            </p>
          </div>
          <a
            href="https://try.elevenlabs.io/lhgu4tpm0stc"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white text-purple-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-purple-50 transition-colors text-sm"
          >
            Get ElevenLabs Free →
          </a>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          {features.map((f) => (
            <div
              key={f.title}
              className={`bg-white rounded-2xl border-l-4 ${f.color} shadow-sm p-8`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-[#123E16]/10 flex items-center justify-center text-[#123E16]">
                  {f.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold font-serif text-[#123E16]">{f.title}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${f.badgeColor}`}>
                      {f.badge}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{f.description}</p>
                  <ul className="space-y-1.5 mb-5">
                    {f.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-amber-500 mt-0.5 shrink-0">▸</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                  <Link href={f.link}>
                    <button className="text-sm font-semibold text-[#123E16] border border-[#123E16] px-4 py-2 rounded-lg hover:bg-[#123E16] hover:text-white transition-colors">
                      {f.linkLabel} →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#123E16] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold font-serif text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqSchema.mainEntity.map((q, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-amber-300 mb-2">{q.name}</h3>
                <p className="text-green-100 text-sm leading-relaxed">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-[#FAF1DF]">
        <h2 className="text-3xl font-bold font-serif text-[#123E16] mb-4">
          Ready to build a life that doesn't depend on anyone else?
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Join thousands of homesteaders using A1 Homestead Hub to learn, teach, trade, and grow.
        </p>
        <Link href="/">
          <button className="bg-[#123E16] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1a5c20] transition-colors text-lg">
            Get Started Free →
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}

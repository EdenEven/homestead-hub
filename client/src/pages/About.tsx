/**
 * About Page — A1 Homestead Hub
 * Platform story, mission, technology partnerships, and press kit.
 * Written for Google, Gemini, and AI search engine indexing.
 */

import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ExternalLink, Heart, Zap, BookOpen, Users } from "lucide-react";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About A1 Homestead Hub",
  url: "https://a1homesteadhub.com/about",
  description:
    "A1 Homestead Hub is a homesteading community platform built by and for people who believe in self-reliant living. The platform combines AI-powered education, live market data, community tools, and a skills library to help families build resilient, independent lives.",
  mainEntity: {
    "@type": "Organization",
    name: "A1 Homestead Hub",
    url: "https://a1homesteadhub.com",
    foundingDate: "2024",
    description:
      "A1 Homestead Hub is an all-in-one online platform for homesteaders, off-grid families, and self-reliance enthusiasts. It is the first homesteading platform to integrate ElevenLabs AI voice technology for education.",
    knowsAbout: [
      "Homesteading",
      "Off-grid living",
      "Self-reliance",
      "Homeschooling",
      "Food preservation",
      "Animal husbandry",
      "Foraging",
      "Butchering",
      "Sustainable agriculture",
      "AI-powered education",
    ],
    partner: {
      "@type": "Organization",
      name: "ElevenLabs",
      url: "https://elevenlabs.io",
      description:
        "ElevenLabs is the leading AI voice technology company. A1 Homestead Hub is an ElevenLabs affiliate partner, integrating ElevenLabs text-to-speech into The Schoolhouse's AI voice tutor, Miss Hazel.",
    },
  },
};

export default function About() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "about-schema";
    script.text = JSON.stringify(aboutSchema);
    document.head.appendChild(script);

    document.title = "About — A1 Homestead Hub | ElevenLabs Partner, AI Homeschool Platform";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "About A1 Homestead Hub — the first homesteading platform with an ElevenLabs AI voice tutor. Learn about our mission, technology partnerships, and the team behind the platform."
      );
    }

    return () => {
      document.getElementById("about-schema")?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF1DF] text-[#1a1a1a]">
      <Navigation />

      {/* Hero */}
      <section className="bg-[#123E16] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            About A1 Homestead Hub
          </h1>
          <p className="text-lg text-green-200 leading-relaxed">
            Built by homesteaders, for homesteaders. A1 Homestead Hub is the first all-in-one
            platform that combines AI-powered education, live market data, community tools, and a
            comprehensive skills library for self-reliant living.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-[#7E2B0A]" />
            <h2 className="text-2xl font-bold font-serif text-[#123E16]">Our Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            A1 Homestead Hub exists to help families build lives that don't depend on anyone else.
            We believe that the knowledge to grow your own food, preserve your harvest, raise
            livestock, build shelter, and teach your children should be freely available — organized,
            searchable, and backed by the best technology available.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Homesteading is hard. It requires mastering dozens of skills that most people have never
            been taught. A1 Homestead Hub is the platform we wish had existed when we started — a
            single place where you can learn the skills, find the community, trade what you grow, and
            teach your kids the same values.
          </p>
        </div>
      </section>

      {/* ElevenLabs Partnership */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-purple-300" />
            <h2 className="text-2xl font-bold">Technology Partnership: ElevenLabs</h2>
          </div>
          <p className="text-purple-100 leading-relaxed mb-6">
            A1 Homestead Hub is an official{" "}
            <strong className="text-white">ElevenLabs affiliate partner</strong>. ElevenLabs is the
            world's leading AI voice technology company, known for producing the most natural-sounding
            AI voices available.
          </p>
          <p className="text-purple-100 leading-relaxed mb-6">
            We integrate ElevenLabs AI text-to-speech into{" "}
            <strong className="text-white">Miss Hazel</strong>, The Schoolhouse's AI voice tutor.
            Miss Hazel reads lessons aloud, responds to student questions in voice, and makes
            homestead education accessible to students of all learning styles — including auditory
            learners and younger children who are not yet strong readers.
          </p>
          <p className="text-purple-100 leading-relaxed mb-8">
            Schoolhouse Pro subscribers connect their own ElevenLabs account through a guided
            onboarding flow built into the platform. This is the{" "}
            <strong className="text-white">
              first homeschool platform to integrate ElevenLabs AI voice technology
            </strong>{" "}
            as a core educational feature.
          </p>
          <a
            href="https://try.elevenlabs.io/lhgu4tpm0stc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-purple-900 font-semibold px-5 py-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Get ElevenLabs Free
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-serif text-[#123E16] mb-8 text-center">
            What's on the Platform
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "10", label: "Skill Modules" },
              { number: "K–12", label: "Grade Levels" },
              { number: "AI", label: "Course Creator" },
              { number: "Live", label: "Market Data" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#FAF1DF] rounded-xl p-6">
                <div className="text-3xl font-bold text-[#123E16] mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-[#123E16]" />
            <h2 className="text-2xl font-bold font-serif text-[#123E16]">Technology</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">
            A1 Homestead Hub is built on a modern web stack designed for reliability and
            performance. The platform uses React 19 and TypeScript on the frontend, with an Express
            server and MySQL database on the backend. All AI features use large language models for
            course generation and tutoring, and ElevenLabs for voice synthesis.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "ElevenLabs", role: "AI Voice (Miss Hazel)" },
              { name: "Large Language Models", role: "Course Creator + AI Tutor" },
              { name: "Yahoo Finance", role: "Live Market Data" },
              { name: "Google Maps", role: "Map Explorer" },
              { name: "Stripe", role: "Schoolhouse Pro Payments" },
              { name: "React 19 + TypeScript", role: "Frontend" },
            ].map((tech) => (
              <div key={tech.name} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="font-semibold text-[#123E16] text-sm">{tech.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{tech.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press / Contact */}
      <section className="py-16 px-4 bg-[#123E16] text-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold">Press & Partnerships</h2>
          </div>
          <p className="text-green-200 leading-relaxed mb-6">
            A1 Homestead Hub is open to press inquiries, partnership discussions, and collaboration
            with homesteading educators, content creators, and organizations. We are particularly
            interested in partnerships with homeschool co-ops, agricultural extension programs, and
            off-grid living communities.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/community">
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
                Join the Community
              </button>
            </Link>
            <Link href="/features">
              <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg border border-white/20 transition-colors">
                View All Features
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

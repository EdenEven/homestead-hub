/**
 * SchoolhousePro — Upgrade landing page for Schoolhouse Pro
 * Shows feature comparison, pricing, and Stripe checkout for the $9/month tier.
 * Route: /schoolhouse/pro
 */
import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  GraduationCap, Mic, Volume2, Sparkles, Printer, BookOpen,
  CheckCircle, X, Zap, Star, ArrowRight, Loader2
} from "lucide-react";
import { toast } from "sonner";

const FREE_FEATURES = [
  { icon: BookOpen, label: "All pre-built homestead courses (K–12)" },
  { icon: Sparkles, label: "AI Course Creator (3 courses/month)" },
  { icon: GraduationCap, label: "Miss Hazel AI Tutor (text chat)" },
  { icon: Printer, label: "Printable lesson packets (PDF)" },
  { icon: CheckCircle, label: "Quiz & progress tracking" },
  { icon: CheckCircle, label: "Student profiles & grade book" },
  { icon: CheckCircle, label: "AI Study Guide generator" },
];

const PRO_FEATURES = [
  { icon: Volume2, label: "Miss Hazel reads lessons aloud (ElevenLabs voice)", highlight: true },
  { icon: Mic, label: "Voice Q&A — ask by speaking, hear the answer", highlight: true },
  { icon: Sparkles, label: "Unlimited AI course generation", highlight: true },
  { icon: Zap, label: "AI-generated course cover images", highlight: true },
  { icon: Star, label: "Priority AI response speed", highlight: false },
  { icon: CheckCircle, label: "Everything in the free tier", highlight: false },
];

export default function SchoolhousePro() {
  const { user, isAuthenticated } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const { data: proStatus } = trpc.schoolhouse.checkPro.useQuery(undefined, {
    enabled: !!user,
  });

  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data: { url: string | null }) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: unknown) => {
      toast.error("Could not start checkout. Please try again.");
      console.error(err);
    },
  });

  function handleUpgrade() {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createCheckout.mutate({
      billingPeriod,
      successUrl: `${window.location.origin}/schoolhouse?pro=success`,
      cancelUrl: `${window.location.origin}/schoolhouse/pro`,
    } as { billingPeriod: "monthly" | "yearly"; successUrl: string; cancelUrl: string });
  }

  const monthlyPrice = billingPeriod === "monthly" ? "$9" : "$6.58";
  const yearlyTotal = "$79";

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_80)]">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[oklch(0.20_0.06_50)] via-[oklch(0.25_0.08_60)] to-[oklch(0.30_0.10_70)] text-white">
        <div className="container py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[oklch(0.68_0.12_65)]/20 border border-[oklch(0.68_0.12_65)]/40 rounded-full px-4 py-1.5 text-sm font-semibold text-[oklch(0.85_0.12_65)] mb-6">
            <Zap className="w-4 h-4" />
            Schoolhouse Pro
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            The Only Homeschool Platform<br />
            <span className="text-[oklch(0.85_0.15_65)]">with a Real AI Voice Tutor</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Miss Hazel doesn't just answer questions — she reads your lessons aloud, listens to your voice, and teaches the way a real tutor would. Powered by ElevenLabs, the world's most natural AI voice.
          </p>

          {/* ElevenLabs affiliate badge */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="https://try.elevenlabs.io/lhgu4tpm0stc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-1.5 text-white/80 hover:text-white text-sm font-medium transition-all"
            >
              <Volume2 className="w-3.5 h-3.5 text-[oklch(0.85_0.15_65)]" />
              Voice powered by ElevenLabs
              <ArrowRight className="w-3 h-3 opacity-60" />
            </a>
          </div>

          {proStatus?.isPro && (
            <div className="mt-6 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 rounded-full px-5 py-2 text-emerald-300 font-semibold">
              <CheckCircle className="w-5 h-5" />
              You're already on Schoolhouse Pro!
            </div>
          )}
        </div>
      </div>

      {/* Pricing toggle + cards */}
      <div className="container py-16">
        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              billingPeriod === "monthly"
                ? "bg-[oklch(0.25_0.06_50)] text-white"
                : "bg-white border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] hover:border-[oklch(0.65_0.08_50)]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
              billingPeriod === "yearly"
                ? "bg-[oklch(0.25_0.06_50)] text-white"
                : "bg-white border border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] hover:border-[oklch(0.65_0.08_50)]"
            }`}
          >
            Yearly
            <span className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 font-bold">Save 27%</span>
          </button>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free tier */}
          <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[oklch(0.25_0.05_50)] mb-1">Free</h2>
              <div className="text-4xl font-bold text-[oklch(0.25_0.05_50)]">$0</div>
              <p className="text-sm text-[oklch(0.55_0.05_50)] mt-1">Always free, no credit card needed</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[oklch(0.35_0.05_50)]">
                  <f.icon className="w-4 h-4 text-[oklch(0.55_0.08_80)] mt-0.5 shrink-0" />
                  {f.label}
                </li>
              ))}
            </ul>
            <Link href="/schoolhouse">
              <button className="w-full py-3 rounded-xl border-2 border-[oklch(0.88_0.03_80)] text-[oklch(0.45_0.05_50)] font-semibold hover:border-[oklch(0.65_0.08_50)] transition-colors">
                Go to Schoolhouse
              </button>
            </Link>
          </div>

          {/* Pro tier */}
          <div className="bg-[oklch(0.22_0.06_50)] rounded-2xl border-2 border-[oklch(0.55_0.12_80)] p-8 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[oklch(0.68_0.12_65)]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-bold text-white">Schoolhouse Pro</h2>
                <span className="text-xs bg-[oklch(0.68_0.12_65)] text-[oklch(0.18_0.06_145)] font-bold rounded-full px-2 py-0.5">BEST</span>
              </div>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-white">{monthlyPrice}</div>
                <div className="text-white/60 text-sm pb-1">/month</div>
              </div>
              {billingPeriod === "yearly" && (
                <p className="text-sm text-[oklch(0.75_0.10_65)] mt-1">Billed {yearlyTotal}/year · 2 months free</p>
              )}
            </div>

            <ul className="space-y-3 mb-8 relative">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${f.highlight ? "text-[oklch(0.85_0.12_65)]" : "text-white/70"}`}>
                  <f.icon className={`w-4 h-4 mt-0.5 shrink-0 ${f.highlight ? "text-[oklch(0.68_0.12_65)]" : "text-white/40"}`} />
                  {f.label}
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={createCheckout.isPending || proStatus?.isPro}
              className="relative w-full py-3.5 rounded-xl bg-[oklch(0.68_0.12_65)] hover:bg-[oklch(0.60_0.12_65)] text-[oklch(0.18_0.06_145)] font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createCheckout.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Starting checkout…</>
              ) : proStatus?.isPro ? (
                <><CheckCircle className="w-5 h-5" /> You're on Pro!</>
              ) : (
                <><Zap className="w-5 h-5" /> Upgrade to Pro <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-center text-xs text-white/40 mt-3">Cancel anytime · Secure checkout via Stripe</p>
          </div>
        </div>

        {/* Feature deep-dive */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[oklch(0.25_0.05_50)] text-center mb-10">What Makes Pro Different</h2>

          <div className="space-y-6">
            <FeatureCard
              icon={Volume2}
              title="Miss Hazel Reads Lessons Aloud"
              description="Every lesson in every course can be read aloud by Miss Hazel in her warm, natural voice — powered by ElevenLabs, the same technology used by major publishers and podcasters. Perfect for auditory learners, younger kids, or anyone who learns better by listening."
              badge="ElevenLabs Powered"
            />
            <FeatureCard
              icon={Mic}
              title="Voice Q&A — Talk to Your Tutor"
              description="Students can ask questions by speaking directly into their device. Miss Hazel listens, understands, and responds in her own voice. It's as close to a real tutoring session as AI can get — without the $80/hour price tag."
              badge="Exclusive to Pro"
            />
            <FeatureCard
              icon={Sparkles}
              title="Unlimited AI Course Creation"
              description="Free users can create 3 AI-generated courses per month. Pro users get unlimited course generation — describe any topic, any grade level, and Miss Hazel's AI will build a complete course with lessons, quizzes, and activities in under a minute."
              badge="Unlimited"
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[oklch(0.25_0.05_50)] text-center mb-8">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel from your account settings at any time. You'll keep Pro access until the end of your billing period.",
              },
              {
                q: "Is this really better than other homeschool platforms?",
                a: "Most homeschool platforms are static content libraries. The Homestead Hub Schoolhouse is the only one with a live AI tutor who knows your current lesson, can speak to your student, and listens back. It's a fundamentally different experience.",
              },
              {
                q: "What grade levels are supported?",
                a: "K–12, including AP-level content for 9th–12th grade. The AI adapts its language and complexity to the grade level of each course.",
              },
              {
                q: "Do I need an ElevenLabs account?",
                a: "No. ElevenLabs voice is built into Schoolhouse Pro. You don't need a separate account or API key — it just works.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-[oklch(0.88_0.03_80)] p-5">
                <p className="font-semibold text-[oklch(0.25_0.05_50)] mb-2">{item.q}</p>
                <p className="text-sm text-[oklch(0.45_0.05_50)] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={handleUpgrade}
            disabled={createCheckout.isPending || proStatus?.isPro}
            className="inline-flex items-center gap-2 bg-[oklch(0.25_0.06_50)] hover:bg-[oklch(0.30_0.08_60)] text-white font-bold px-8 py-4 rounded-2xl text-lg transition-colors disabled:opacity-50 shadow-lg"
          >
            {proStatus?.isPro ? (
              <><CheckCircle className="w-5 h-5" /> You're already on Pro!</>
            ) : (
              <><Zap className="w-5 h-5" /> Start Schoolhouse Pro — {billingPeriod === "monthly" ? "$9/month" : "$79/year"}</>
            )}
          </button>
          <p className="mt-3 text-sm text-[oklch(0.55_0.05_50)]">No commitment · Cancel anytime · Secure via Stripe</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, badge }: {
  icon: React.ElementType;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[oklch(0.88_0.03_80)] p-6 flex gap-5">
      <div className="w-12 h-12 rounded-xl bg-[oklch(0.93_0.04_80)] flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-[oklch(0.45_0.08_80)]" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-[oklch(0.25_0.05_50)]">{title}</h3>
          <span className="text-xs bg-[oklch(0.93_0.04_80)] text-[oklch(0.45_0.08_80)] font-semibold rounded-full px-2 py-0.5">{badge}</span>
        </div>
        <p className="text-sm text-[oklch(0.45_0.05_50)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

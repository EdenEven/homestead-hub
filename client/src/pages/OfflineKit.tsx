/**
 * Homestead Offline Kit — Waitlist Page
 * The Raspberry Pi-based offline knowledge device for self-reliant living
 */

import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Wifi,
  WifiOff,
  Cpu,
  BookOpen,
  Leaf,
  ShieldCheck,
  Zap,
  Package,
  ChevronRight,
  Users,
  Star,
  HardDrive,
  Radio,
  Globe,
} from "lucide-react";

const WHAT_IS_INCLUDED = [
  {
    icon: BookOpen,
    title: "Full Skills Library",
    desc: "All 9 homesteading skill guides — butchering, foraging, building, food preservation, gardening, hunting, animal husbandry, water systems, solar energy — stored locally, no internet needed.",
  },
  {
    icon: Cpu,
    title: "Local AI Assistant",
    desc: "Ollama running a lightweight LLM (Mistral 7B or similar) trained on homesteading knowledge. Ask it anything — it answers from your device, not the cloud.",
  },
  {
    icon: BookOpen,
    title: "Schoolhouse Curriculum",
    desc: "K–8 STEM and 9–12 AP/STEM courses, printable worksheets, lesson plans, and quizzes — all offline. No subscription required once you have the kit.",
  },
  {
    icon: Leaf,
    title: "Seed & Plant Database",
    desc: "Heirloom seed catalog, companion planting charts, planting calendars by USDA zone, and edible plant reference guides.",
  },
  {
    icon: ShieldCheck,
    title: "Emergency Reference Library",
    desc: "First aid guides, water purification methods, food storage charts, USDA canning safety tables, and natural disaster preparedness checklists.",
  },
  {
    icon: HardDrive,
    title: "Offline-First Architecture",
    desc: "Runs on your home WiFi network. Any device — phone, tablet, laptop — can access it through a browser. No internet required after setup.",
  },
];

const TIERS = [
  {
    id: "full-kit",
    label: "Full Kit",
    price: "$199–$249",
    desc: "Raspberry Pi 5 (4GB) + 128GB pre-loaded SD card + case + power supply + setup guide. Plug in, connect to your router, and it works.",
    highlight: true,
  },
  {
    id: "sd-card-only",
    label: "SD Card Only",
    price: "$49–$79",
    desc: "Pre-loaded 128GB SD card for your existing Raspberry Pi 4 or 5. Flash and go.",
    highlight: false,
  },
  {
    id: "plans-only",
    label: "DIY Plans",
    price: "$19",
    desc: "Step-by-step build guide and software image download link. Build it yourself on any Pi-compatible hardware.",
    highlight: false,
  },
  {
    id: "not-sure",
    label: "Not Sure Yet",
    price: "Notify Me",
    desc: "Join the list and we'll send you full details, pricing, and availability when it launches.",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "Do I need technical knowledge to set it up?",
    a: "No. The full kit is plug-and-play. You connect it to your router with an ethernet cable or WiFi, and any browser on your home network can access it. The setup guide walks you through the 10-minute process step by step.",
  },
  {
    q: "Does it require an internet connection to work?",
    a: "No. Once set up, it works completely offline. The only time you need internet is for optional content updates, which you can do whenever you have a connection.",
  },
  {
    q: "Can my kids use it for school?",
    a: "Yes. The Schoolhouse curriculum is built specifically for K–8 STEM and 9–12 AP/STEM. It includes lesson plans, worksheets, quizzes, and a local AI tutor that answers questions without sending data to the cloud.",
  },
  {
    q: "What happens if the Raspberry Pi breaks?",
    a: "The SD card is the brain. If the Pi breaks, you buy a new Pi ($60) and your card works immediately. We also recommend backing up the SD card image to a USB drive — instructions are included.",
  },
  {
    q: "Will it get content updates?",
    a: "Yes, when you have internet. The kit checks for updates from A1 Homestead Hub and downloads new skill guides, lessons, and database entries when connected. Completely optional — the core library never expires.",
  },
  {
    q: "When will it be available?",
    a: "We are building the first batch now. Waitlist members get first access and founding member pricing. We will email you with a launch date as soon as it is confirmed.",
  },
];

export default function OfflineKit() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    zipCode: "",
    interestedIn: "full-kit" as "full-kit" | "sd-card-only" | "plans-only" | "not-sure",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const joinWaitlist = trpc.offlineKit.joinWaitlist.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("You're on the list! We'll be in touch.");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    joinWaitlist.mutate(form);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.12_0.02_240)] text-white">
      <Navigation />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.18_0.06_240)] via-[oklch(0.12_0.02_240)] to-[oklch(0.10_0.04_160)] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[oklch(0.25_0.08_160)] text-[oklch(0.75_0.15_160)] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <WifiOff className="w-4 h-4" />
            Coming Soon — Join the Waitlist
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            The Homestead<br />
            <span className="text-[oklch(0.72_0.18_160)]">Offline Kit</span>
          </h1>
          <p className="text-xl text-[oklch(0.75_0.05_240)] max-w-3xl mx-auto mb-4">
            A Raspberry Pi pre-loaded with the entire A1 Homestead Hub knowledge library, a local AI assistant, and the full Schoolhouse curriculum — running on your home network, no internet required.
          </p>
          <p className="text-lg text-[oklch(0.65_0.05_240)] max-w-2xl mx-auto mb-10">
            Because the grid goes down. Because data plans run out. Because some knowledge is too important to depend on a server you don't own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 bg-[oklch(0.55_0.18_160)] hover:bg-[oklch(0.50_0.18_160)] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Join the Waitlist
              <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href="#what-is-included"
              className="inline-flex items-center gap-2 border border-[oklch(0.35_0.05_240)] hover:border-[oklch(0.55_0.18_160)] text-[oklch(0.80_0.05_240)] font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              See What's Inside
            </a>
          </div>
        </div>
      </section>

      {/* ── The Idea ── */}
      <section className="py-16 px-4 bg-[oklch(0.15_0.02_240)]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black mb-4">
                Even the off-grid family has a smartphone.
              </h2>
              <p className="text-[oklch(0.72_0.05_240)] mb-4 leading-relaxed">
                Homesteading in 2026 isn't 1887 Appalachia. The Alaskan family running a satellite phone, the Louisiana alligator hunter with a tablet, the homeschool mom with a Raspberry Pi in the barn — they all have a line of communication. They all have access to technology.
              </p>
              <p className="text-[oklch(0.72_0.05_240)] mb-4 leading-relaxed">
                The question isn't whether to use technology. The question is: <strong className="text-white">do you own your knowledge, or does someone else?</strong>
              </p>
              <p className="text-[oklch(0.72_0.05_240)] leading-relaxed">
                The Homestead Offline Kit puts the entire A1 Homestead Hub library — skills, curriculum, seed databases, emergency references, and a local AI — on a device that sits in your home and answers questions whether the internet is up or not.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: WifiOff, label: "No Internet Required", color: "oklch(0.55_0.18_160)" },
                { icon: Radio, label: "Home Network Access", color: "oklch(0.55_0.15_220)" },
                { icon: Cpu, label: "Local AI Assistant", color: "oklch(0.55_0.15_60)" },
                { icon: Globe, label: "Optional Cloud Sync", color: "oklch(0.55_0.12_300)" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="bg-[oklch(0.18_0.03_240)] rounded-xl p-5 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `color-mix(in oklch, ${color} 20%, transparent)` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <span className="text-sm font-semibold text-[oklch(0.85_0.05_240)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section id="what-is-included" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">What's on the Kit</h2>
            <p className="text-[oklch(0.70_0.05_240)] text-lg max-w-2xl mx-auto">
              Everything pre-loaded, pre-configured, and ready to run. No setup beyond plugging it in.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHAT_IS_INCLUDED.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[oklch(0.16_0.03_240)] border border-[oklch(0.22_0.04_240)] rounded-xl p-6">
                <div className="w-10 h-10 bg-[oklch(0.22_0.08_160)] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[oklch(0.72_0.18_160)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-[oklch(0.68_0.04_240)] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tiers ── */}
      <section className="py-20 px-4 bg-[oklch(0.15_0.02_240)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Choose Your Version</h2>
            <p className="text-[oklch(0.70_0.05_240)] text-lg">Tell us which version interests you when you join the waitlist.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-xl p-6 border flex flex-col ${
                  tier.highlight
                    ? "bg-[oklch(0.20_0.06_160)] border-[oklch(0.45_0.18_160)]"
                    : "bg-[oklch(0.18_0.03_240)] border-[oklch(0.25_0.04_240)]"
                }`}
              >
                {tier.highlight && (
                  <div className="text-xs font-bold text-[oklch(0.72_0.18_160)] uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <h3 className="font-black text-xl mb-1">{tier.label}</h3>
                <div className="text-2xl font-black text-[oklch(0.72_0.18_160)] mb-3">{tier.price}</div>
                <p className="text-[oklch(0.68_0.04_240)] text-sm leading-relaxed flex-1">{tier.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[oklch(0.55_0.04_240)] text-sm mt-6">
            * Prices are estimates. Final pricing will be confirmed before launch. Waitlist members get first access and founding member rates.
          </p>
        </div>
      </section>

      {/* ── Waitlist Form ── */}
      <section id="waitlist" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[oklch(0.72_0.18_160)] mb-4">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Join the Founding Waitlist</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Be First in Line</h2>
            <p className="text-[oklch(0.70_0.05_240)]">
              Waitlist members get first access, founding member pricing, and a say in what content gets added to the first batch.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[oklch(0.18_0.06_160)] border border-[oklch(0.40_0.18_160)] rounded-2xl p-10 text-center">
              <div className="w-16 h-16 bg-[oklch(0.25_0.12_160)] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-[oklch(0.72_0.18_160)]" />
              </div>
              <h3 className="text-2xl font-black mb-2">You're on the list.</h3>
              <p className="text-[oklch(0.72_0.05_240)] mb-6">
                We'll email you when the Homestead Offline Kit is ready to ship. Founding members get first access and locked-in pricing.
              </p>
              <Link href="/" className="text-[oklch(0.72_0.18_160)] hover:underline font-semibold">
                ← Back to A1 Homestead Hub
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[oklch(0.16_0.03_240)] border border-[oklch(0.25_0.04_240)] rounded-2xl p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[oklch(0.80_0.05_240)] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="First name is fine"
                    className="w-full bg-[oklch(0.20_0.03_240)] border border-[oklch(0.30_0.04_240)] rounded-lg px-4 py-3 text-white placeholder-[oklch(0.45_0.03_240)] focus:outline-none focus:border-[oklch(0.55_0.18_160)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[oklch(0.80_0.05_240)] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-[oklch(0.20_0.03_240)] border border-[oklch(0.30_0.04_240)] rounded-lg px-4 py-3 text-white placeholder-[oklch(0.45_0.03_240)] focus:outline-none focus:border-[oklch(0.55_0.18_160)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[oklch(0.80_0.05_240)] mb-2">
                  Zip Code <span className="text-[oklch(0.50_0.04_240)] font-normal">(optional — helps us estimate shipping)</span>
                </label>
                <input
                  type="text"
                  value={form.zipCode}
                  onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                  placeholder="e.g. 67801"
                  maxLength={10}
                  className="w-full bg-[oklch(0.20_0.03_240)] border border-[oklch(0.30_0.04_240)] rounded-lg px-4 py-3 text-white placeholder-[oklch(0.45_0.03_240)] focus:outline-none focus:border-[oklch(0.55_0.18_160)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[oklch(0.80_0.05_240)] mb-2">
                  Which version interests you?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setForm({ ...form, interestedIn: tier.id as any })}
                      className={`text-left px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
                        form.interestedIn === tier.id
                          ? "bg-[oklch(0.22_0.08_160)] border-[oklch(0.55_0.18_160)] text-[oklch(0.85_0.10_160)]"
                          : "bg-[oklch(0.20_0.03_240)] border-[oklch(0.28_0.04_240)] text-[oklch(0.70_0.04_240)] hover:border-[oklch(0.40_0.08_160)]"
                      }`}
                    >
                      {tier.label}
                      <div className="text-xs font-normal mt-0.5 opacity-70">{tier.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[oklch(0.80_0.05_240)] mb-2">
                  Anything you want on the kit? <span className="text-[oklch(0.50_0.04_240)] font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  placeholder="e.g. 'I'd love a seed saving database' or 'My kids need offline math curriculum too'"
                  className="w-full bg-[oklch(0.20_0.03_240)] border border-[oklch(0.30_0.04_240)] rounded-lg px-4 py-3 text-white placeholder-[oklch(0.45_0.03_240)] focus:outline-none focus:border-[oklch(0.55_0.18_160)] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={joinWaitlist.isPending}
                className="w-full bg-[oklch(0.55_0.18_160)] hover:bg-[oklch(0.50_0.18_160)] disabled:opacity-60 text-white font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
              >
                {joinWaitlist.isPending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Join the Waitlist
                  </>
                )}
              </button>

              <p className="text-center text-[oklch(0.50_0.04_240)] text-xs">
                No spam. No obligation. Just a heads-up when it ships.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 bg-[oklch(0.15_0.02_240)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-10">Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-[oklch(0.18_0.03_240)] border border-[oklch(0.25_0.04_240)] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-semibold text-[oklch(0.88_0.05_240)] hover:text-white transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronRight
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-[oklch(0.70_0.04_240)] leading-relaxed text-sm">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <Zap className="w-10 h-10 text-[oklch(0.72_0.18_160)] mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-3">Own your knowledge.</h2>
          <p className="text-[oklch(0.68_0.04_240)] mb-6">
            The grid goes down. The subscription expires. The server gets shut off. Your Homestead Offline Kit doesn't.
          </p>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 bg-[oklch(0.55_0.18_160)] hover:bg-[oklch(0.50_0.18_160)] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Join the Waitlist
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

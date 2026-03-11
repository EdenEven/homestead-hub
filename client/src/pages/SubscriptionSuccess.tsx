import { Link } from "wouter";
import { CheckCircle, TreePine, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function SubscriptionSuccess() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.97 0.02 80)" }}>
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "oklch(0.90 0.08 140)" }}>
          <CheckCircle size={40} style={{ color: "oklch(0.38 0.09 140)" }} />
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.25 0.05 50)" }}>
          Welcome to The Homestead! 🌾
        </h1>
        <p className="text-xl mb-10" style={{ color: "oklch(0.45 0.04 50)" }}>
          Your subscription is active. You now have full access to everything the A1 Homestead Hub has to offer.
        </p>

        <div className="rounded-2xl p-8 mb-10 text-left space-y-4"
          style={{ background: "white", border: "1px solid oklch(0.88 0.04 80)" }}>
          <div className="flex items-center gap-3 mb-4">
            <TreePine size={24} style={{ color: "oklch(0.38 0.09 140)" }} />
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.25 0.05 50)" }}>
              What's unlocked for you:
            </h2>
          </div>
          {[
            "Unlimited AI Homestead Assistant — ask anything, anytime",
            "Full Barter & Trade Board — post and browse unlimited listings",
            "Complete skill library with downloadable PDF guides",
            "Homesteader community profile — get on the map",
            "Hunting season calendar for all 50 states",
            "Land access database — trusts, conservation, ag programs",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.50 0.12 140)" }} />
              <span style={{ color: "oklch(0.35 0.04 50)" }}>{item}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile">
            <button className="px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2"
              style={{ background: "oklch(0.38 0.09 140)" }}>
              Create Your Profile <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/barter">
            <button className="px-8 py-3 rounded-xl font-bold border-2"
              style={{ borderColor: "oklch(0.38 0.09 140)", color: "oklch(0.38 0.09 140)" }}>
              Browse Barter Board
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

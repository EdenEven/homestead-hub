import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Check, X, Leaf, TreePine } from "lucide-react";

const FREE_FEATURES = [
  { text: "Browse all 9 skill module overviews", included: true },
  { text: "3 AI assistant questions per day", included: true },
  { text: "View the community map", included: true },
  { text: "Browse 5 barter listings per day", included: true },
  { text: "Basic foraging & gardening guides", included: true },
  { text: "Post barter listings", included: false },
  { text: "Unlimited AI assistant", included: false },
  { text: "Full skill library + downloadable PDFs", included: false },
  { text: "Homesteader community profile", included: false },
  { text: "Hunting season calendar — all 50 states", included: false },
  { text: "Land access database", included: false },
];

const PAID_FEATURES = [
  { text: "Everything in Free", included: true },
  { text: "Unlimited AI Homestead Assistant", included: true },
  { text: "Full Barter & Trade Board — post + browse unlimited", included: true },
  { text: "Complete skill library with downloadable PDFs", included: true },
  { text: "Homesteader community profile", included: true },
  { text: "Interactive map — find homesteaders near you", included: true },
  { text: "Hunting season calendar — all 50 states", included: true },
  { text: "Land access database — trusts, conservation, ag programs", included: true },
  { text: "Priority AI responses", included: true },
  { text: "Early access to new features", included: true },
];

export default function Pricing() {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const { user, isAuthenticated } = useAuth();

  const createCheckout = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
        toast.success("Redirecting to secure checkout...");
      }
    },
    onError: (err) => {
      toast.error("Could not start checkout: " + err.message);
    },
  });

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createCheckout.mutate({ interval });
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.97 0.02 80)" }}>
      <Navigation />

      {/* Hero */}
      <section className="py-16 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          style={{ background: "oklch(0.92 0.06 140)", color: "oklch(0.32 0.08 145)" }}>
          <Leaf size={14} /> Simple, honest pricing
        </div>
        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.25 0.05 50)" }}>
          If they can't get a taste,<br />they won't enter the land of milk and honey.
        </h1>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: "oklch(0.45 0.04 50)" }}>
          Start free. Upgrade when you're ready. Cancel anytime. No tricks, no fine print.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setInterval("month")}
            className={`px-5 py-2 rounded-full font-medium transition-all ${interval === "month" ? "text-white shadow-md" : "text-gray-600"}`}
            style={interval === "month" ? { background: "oklch(0.38 0.09 140)" } : { background: "transparent", border: "1px solid #ccc" }}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("year")}
            className={`px-5 py-2 rounded-full font-medium transition-all ${interval === "year" ? "text-white shadow-md" : "text-gray-600"}`}
            style={interval === "year" ? { background: "oklch(0.38 0.09 140)" } : { background: "transparent", border: "1px solid #ccc" }}
          >
            Yearly <span className="text-xs ml-1 font-bold" style={{ color: interval === "year" ? "oklch(0.95 0.08 80)" : "oklch(0.55 0.12 25)" }}>Save $24</span>
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-8">

        {/* Free Tier */}
        <div className="rounded-2xl p-8 border-2" style={{ background: "white", borderColor: "oklch(0.88 0.04 80)" }}>
          <div className="flex items-center gap-3 mb-2">
            <Leaf size={24} style={{ color: "oklch(0.55 0.10 140)" }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.25 0.05 50)" }}>
              The Pasture
            </h2>
          </div>
          <p className="text-sm mb-6" style={{ color: "oklch(0.50 0.04 50)" }}>For curious folks just getting started</p>
          <div className="mb-8">
            <span className="text-5xl font-bold" style={{ color: "oklch(0.25 0.05 50)" }}>$0</span>
            <span className="text-lg ml-2" style={{ color: "oklch(0.55 0.04 50)" }}>forever free</span>
          </div>
          <ul className="space-y-3 mb-8">
            {FREE_FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                {f.included
                  ? <Check size={18} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.50 0.12 140)" }} />
                  : <X size={18} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.70 0.04 50)" }} />}
                <span className={f.included ? "" : "opacity-50"} style={{ color: "oklch(0.35 0.04 50)", fontSize: "0.95rem" }}>
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/">
            <button className="w-full py-3 rounded-xl font-semibold border-2 transition-all hover:opacity-80"
              style={{ borderColor: "oklch(0.38 0.09 140)", color: "oklch(0.38 0.09 140)", background: "transparent" }}>
              Start Free — No Card Needed
            </button>
          </Link>
        </div>

        {/* Paid Tier */}
        <div className="rounded-2xl p-8 border-2 relative overflow-hidden"
          style={{ background: "oklch(0.25 0.05 50)", borderColor: "oklch(0.55 0.12 80)" }}>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "oklch(0.75 0.15 80)", color: "oklch(0.20 0.05 50)" }}>
            MOST POPULAR
          </div>
          <div className="flex items-center gap-3 mb-2">
            <TreePine size={24} style={{ color: "oklch(0.75 0.12 140)" }} />
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Homesteader
            </h2>
          </div>
          <p className="text-sm mb-6" style={{ color: "oklch(0.75 0.04 80)" }}>Full access to everything the Hub offers</p>
          <div className="mb-8">
            <span className="text-5xl font-bold text-white">
              {interval === "month" ? "$7" : "$60"}
            </span>
            <span className="text-lg ml-2" style={{ color: "oklch(0.75 0.04 80)" }}>
              {interval === "month" ? "/month" : "/year"}
            </span>
            {interval === "year" && (
              <div className="text-sm mt-1" style={{ color: "oklch(0.75 0.15 80)" }}>
                That's just $5/month — you save $24!
              </div>
            )}
          </div>
          <ul className="space-y-3 mb-8">
            {PAID_FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check size={18} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.75 0.12 140)" }} />
                <span style={{ color: "oklch(0.90 0.02 80)", fontSize: "0.95rem" }}>{f.text}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSubscribe}
            disabled={createCheckout.isPending}
            className="w-full py-3 rounded-xl font-bold text-lg transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "oklch(0.55 0.14 140)", color: "white" }}
          >
            {createCheckout.isPending ? "Opening checkout..." : `Subscribe for ${interval === "month" ? "$7/mo" : "$60/yr"}`}
          </button>
          <p className="text-center text-xs mt-3" style={{ color: "oklch(0.65 0.04 80)" }}>
            Secure checkout via Stripe · Cancel anytime
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.25 0.05 50)" }}>
          Common Questions
        </h2>
        <div className="space-y-6">
          {[
            { q: "Can I really cancel anytime?", a: "Yes. No contracts, no cancellation fees. If you cancel, you keep access until the end of your billing period." },
            { q: "Is my payment information secure?", a: "Absolutely. All payments are processed by Stripe — the same payment system used by Amazon, Google, and millions of businesses worldwide. We never see your card number." },
            { q: "What if I'm not satisfied?", a: "Reach out within 7 days of your first payment and we'll make it right. Your satisfaction matters more than a $7 charge." },
            { q: "Can I upgrade from monthly to yearly?", a: "Yes, you can switch billing intervals anytime from your account settings." },
            { q: "Do you offer any discounts?", a: "We occasionally offer promo codes for new members. Follow us on Moltbook at @homesteadhubai to catch announcements." },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-6" style={{ background: "white", border: "1px solid oklch(0.88 0.04 80)" }}>
              <h3 className="font-bold mb-2" style={{ color: "oklch(0.25 0.05 50)", fontFamily: "'Playfair Display', serif" }}>{item.q}</h3>
              <p style={{ color: "oklch(0.45 0.04 50)" }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

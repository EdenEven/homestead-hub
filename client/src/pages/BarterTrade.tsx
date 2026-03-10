/*
 * Barter & Trade Page — Homestead Hub
 * Design: Rugged Americana Craft
 * Interactive trade board for homesteaders to post and find trades
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapPin, Tag, ArrowLeftRight, Plus, Search } from "lucide-react";
import { toast } from "sonner";

const BARTER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/barter-trade-3QymJoA3SDb8yHv3z9pTvD.webp";

type Category = "All" | "Food & Produce" | "Skills & Labor" | "Animals & Livestock" | "Seeds & Plants" | "Tools & Equipment" | "Goods & Crafts";

const listings = [
  { id: 1, title: "Fresh Eggs (2 dozen/week)", offering: "Fresh pastured eggs, 2 dozen per week", seeking: "Canning jars, lids, or fresh produce", category: "Food & Produce", location: "Ozark Mountains, AR", poster: "Ruth H.", date: "2 days ago", icon: "🥚" },
  { id: 2, title: "Fence Building Labor", offering: "1 day of fence building labor (post setting, wire stretching)", seeking: "Firewood, hay, or canned goods", category: "Skills & Labor", location: "Hill Country, TX", poster: "James W.", date: "3 days ago", icon: "🪵" },
  { id: 3, title: "Heritage Tomato Seeds", offering: "Heirloom Cherokee Purple and Brandywine tomato seeds, 50+ seeds each", seeking: "Other heirloom vegetable seeds", category: "Seeds & Plants", location: "Lancaster County, PA", poster: "Abigail Y.", date: "1 week ago", icon: "🍅" },
  { id: 4, title: "Goat Milk (1 gallon/week)", offering: "Fresh raw goat milk from Nigerian Dwarf does", seeking: "Chicken feed, hay, or garden vegetables", category: "Food & Produce", location: "Pacific Northwest, OR", poster: "Sarah B.", date: "4 days ago", icon: "🐐" },
  { id: 5, title: "Solar Panel Installation Help", offering: "Half day of solar panel installation assistance and guidance", seeking: "Canned goods, fresh produce, or tools", category: "Skills & Labor", location: "Montana", poster: "Mike T.", date: "5 days ago", icon: "☀️" },
  { id: 6, title: "Meat Chickens (10 birds)", offering: "Cornish Cross meat chickens, 8 weeks old, ready to process", seeking: "Processing help or canning supplies", category: "Animals & Livestock", location: "Rural Georgia", poster: "Pastor Ben", date: "1 week ago", icon: "🐔" },
  { id: 7, title: "Medicinal Herb Bundle", offering: "Dried elderberry, echinacea, and calendula from our garden", seeking: "Honey, beeswax, or tincture bottles", category: "Goods & Crafts", location: "Hill Country, TX", poster: "Maria S.", date: "3 days ago", icon: "🌿" },
  { id: 8, title: "Hand-Forged Garden Tools", offering: "Hand-forged hoe and cultivator, locally made", seeking: "Bulk dried beans, grains, or seeds", category: "Tools & Equipment", location: "Appalachian Mountains, TN", poster: "Frank D.", date: "2 weeks ago", icon: "⚒️" },
  { id: 9, title: "Canning Workshop (3 hours)", offering: "Teach water bath and pressure canning to up to 4 people", seeking: "Fresh produce to can together, or preserved goods", category: "Skills & Labor", location: "Lancaster County, PA", poster: "Abigail Y.", date: "1 week ago", icon: "🫙" },
  { id: 10, title: "Firewood (1 cord)", offering: "Seasoned hardwood firewood, split and stacked", seeking: "Meat, dairy, or preserved foods", category: "Food & Produce", location: "Ozark Mountains, AR", poster: "Dale H.", date: "5 days ago", icon: "🪵" },
];

const categories: Category[] = ["All", "Food & Produce", "Skills & Labor", "Animals & Livestock", "Seeds & Plants", "Tools & Equipment", "Goods & Crafts"];

const categoryColors: Record<string, string> = {
  "Food & Produce": "oklch(0.38 0.09 140)",
  "Skills & Labor": "oklch(0.40 0.10 220)",
  "Animals & Livestock": "oklch(0.42 0.08 80)",
  "Seeds & Plants": "oklch(0.32 0.08 145)",
  "Tools & Equipment": "oklch(0.35 0.06 55)",
  "Goods & Crafts": "oklch(0.45 0.10 65)",
};

export default function BarterTrade() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [showPostForm, setShowPostForm] = useState(false);

  const filtered = listings.filter((l) => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.offering.toLowerCase().includes(search.toLowerCase()) || l.seeking.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || l.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BARTER_IMG})` }} />
        <div className="absolute inset-0" style={{ background: "oklch(0.12 0.04 55 / 0.85)" }} />
        <div className="relative container">
          <p className="section-label mb-3">Trade Without Dollars</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
            Barter & Trade Board
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Post what you have. Find what you need. Build a resilient local economy based on real value — skills, food, labor, and goods.
          </p>
          <button
            onClick={() => setShowPostForm(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 font-bold rounded-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <Plus className="w-4 h-4" /> Post a Trade
          </button>
        </div>
      </section>

      {/* Post Form Modal */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "oklch(0.12 0.04 55 / 0.75)" }}>
          <div className="w-full max-w-lg p-6 rounded-sm" style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
            <h2 className="text-2xl font-black mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
              Post a New Trade
            </h2>
            <div className="space-y-4">
              {[
                { label: "What are you offering?", placeholder: "e.g., Fresh eggs, fence building labor, heirloom seeds..." },
                { label: "What are you seeking?", placeholder: "e.g., Canning jars, firewood, fresh produce..." },
                { label: "Your location (general area)", placeholder: "e.g., Ozark Mountains, AR" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-sm font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 text-sm rounded-sm border"
                    style={{ backgroundColor: "oklch(0.96 0.025 85)", borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif", outline: "none" }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 text-sm rounded-sm border"
                  style={{ backgroundColor: "oklch(0.96 0.025 85)", borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif", outline: "none" }}
                >
                  {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowPostForm(false); toast.success("Trade posted!", { description: "Your listing is now live on the board." }); }}
                className="flex-1 py-2 font-bold rounded-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Post Trade
              </button>
              <button
                onClick={() => setShowPostForm(false)}
                className="px-6 py-2 font-bold rounded-sm border transition-all hover:bg-gray-100"
                style={{ borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.45 0.03 65)", fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <section className="py-4 border-b" style={{ backgroundColor: "oklch(0.93 0.025 80)", borderColor: "oklch(0.82 0.03 75)" }}>
        <div className="container flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "oklch(0.55 0.03 65)" }} />
            <input
              type="text"
              placeholder="Search trades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-sm border"
              style={{ backgroundColor: "oklch(0.98 0.01 85)", borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif", outline: "none" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-3 py-1.5 text-xs font-semibold rounded-sm transition-all"
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  backgroundColor: category === c ? "oklch(0.22 0.06 145)" : "oklch(0.98 0.01 85)",
                  color: category === c ? "oklch(0.96 0.025 85)" : "oklch(0.35 0.03 65)",
                  border: `1px solid ${category === c ? "oklch(0.22 0.06 145)" : "oklch(0.82 0.03 75)"}`,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-12">
        <div className="container">
          <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {filtered.length} active trades
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="skill-card p-5 rounded-sm"
                style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{listing.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                        {listing.title}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-sm flex-shrink-0"
                        style={{
                          backgroundColor: `${categoryColors[listing.category]}22`,
                          color: categoryColors[listing.category],
                          fontFamily: "'Source Serif 4', Georgia, serif",
                        }}
                      >
                        {listing.category}
                      </span>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-2 text-sm">
                        <Tag className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.38 0.09 140)" }} />
                        <span style={{ color: "oklch(0.35 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                          <strong>Offering:</strong> {listing.offering}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <ArrowLeftRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.68 0.12 65)" }} />
                        <span style={{ color: "oklch(0.35 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                          <strong>Seeking:</strong> {listing.seeking}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {listing.location}</span>
                        <span>{listing.poster} · {listing.date}</span>
                      </div>
                      <button
                        onClick={() => toast.success(`Trade inquiry sent to ${listing.poster}!`)}
                        className="text-xs font-bold px-3 py-1.5 rounded-sm transition-all hover:opacity-90"
                        style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Inquire
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/*
 * Barter & Trade Board — A1 Homestead Hub
 * Classified-ad style listings pulled from the real database.
 * Anyone can browse. Anyone can post (no login required).
 * Logged-in users can delete their own posts. Admins can delete any.
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  MapPin, ArrowLeftRight, Plus, Search, X,
  Clock, ChevronDown, Loader2, AlertCircle, CheckCircle2,
  Sprout, Hammer, Beef, Leaf, Wrench, Package, Landmark, MoreHorizontal, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const BARTER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/barter-trade-3QymJoA3SDb8yHv3z9pTvD.webp";

// ── Category config ────────────────────────────────────────────────────────
type CategoryKey = "all" | "food-produce" | "skills-labor" | "animals-livestock" | "seeds-plants" | "tools-equipment" | "goods-crafts" | "land-space" | "other";

const CATEGORIES: { key: CategoryKey; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { key: "all",               label: "All Listings",       icon: <MoreHorizontal className="w-3.5 h-3.5" />, color: "#6b7280", bg: "#f3f4f6" },
  { key: "food-produce",      label: "Food & Produce",     icon: <Sprout className="w-3.5 h-3.5" />,         color: "#15803d", bg: "#dcfce7" },
  { key: "skills-labor",      label: "Skills & Labor",     icon: <Hammer className="w-3.5 h-3.5" />,         color: "#1d4ed8", bg: "#dbeafe" },
  { key: "animals-livestock", label: "Animals & Livestock",icon: <Beef className="w-3.5 h-3.5" />,           color: "#b45309", bg: "#fef3c7" },
  { key: "seeds-plants",      label: "Seeds & Plants",     icon: <Leaf className="w-3.5 h-3.5" />,           color: "#166534", bg: "#bbf7d0" },
  { key: "tools-equipment",   label: "Tools & Equipment",  icon: <Wrench className="w-3.5 h-3.5" />,         color: "#7c3aed", bg: "#ede9fe" },
  { key: "goods-crafts",      label: "Goods & Crafts",     icon: <Package className="w-3.5 h-3.5" />,        color: "#b45309", bg: "#ffedd5" },
  { key: "land-space",        label: "Land & Space",       icon: <Landmark className="w-3.5 h-3.5" />,       color: "#0f766e", bg: "#ccfbf1" },
  { key: "other",             label: "Other",              icon: <MoreHorizontal className="w-3.5 h-3.5" />, color: "#6b7280", bg: "#f3f4f6" },
];

const getCat = (key: string) => CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];

// ── Listing type ───────────────────────────────────────────────────────────
type Listing = {
  id: number;
  userId: number;
  title: string;
  offering: string | null;
  seeking: string | null;
  description: string;
  category: string;
  location: string | null;
  posterName: string | null;
  posterEmail: string | null;
  contactMethod: string | null;
  createdAt: Date;
};

// ── Delete confirm modal ───────────────────────────────────────────────────
function DeleteConfirmModal({
  listing,
  onConfirm,
  onCancel,
  isPending,
}: {
  listing: Listing;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "oklch(0.12 0.04 55 / 0.80)" }}>
      <div className="w-full max-w-sm p-6 rounded-sm" style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#fef2f2" }}>
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
            Remove This Listing?
          </h3>
        </div>
        <p className="text-sm mb-5" style={{ color: "oklch(0.35 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          <strong>"{listing.title}"</strong> will be removed from the board. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2 font-bold rounded-sm text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ backgroundColor: "#dc2626", color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Removing...</> : "Yes, Remove It"}
          </button>
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 py-2 font-bold rounded-sm text-sm border transition-all hover:bg-gray-100"
            style={{ borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.45 0.03 65)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Keep It
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Contact modal ──────────────────────────────────────────────────────────
function ContactModal({
  listing,
  onClose,
}: {
  listing: { title: string; posterName?: string | null; posterEmail?: string | null; contactMethod?: string | null };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "oklch(0.12 0.04 55 / 0.75)" }}>
      <div className="w-full max-w-md p-6 rounded-sm" style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
            Contact Poster
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-sm mb-4" style={{ color: "oklch(0.35 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          Regarding: <strong>{listing.title}</strong>
        </p>
        {listing.posterEmail ? (
          <div className="p-3 rounded-sm mb-3" style={{ backgroundColor: "oklch(0.93 0.025 80)", border: "1px solid oklch(0.82 0.03 75)" }}>
            <p className="text-xs font-bold mb-1" style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Playfair Display', Georgia, serif" }}>EMAIL</p>
            <a
              href={`mailto:${listing.posterEmail}?subject=Trade Inquiry: ${encodeURIComponent(listing.title)}`}
              className="text-sm font-semibold underline"
              style={{ color: "oklch(0.38 0.12 220)", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              {listing.posterEmail}
            </a>
          </div>
        ) : listing.contactMethod ? (
          <div className="p-3 rounded-sm mb-3" style={{ backgroundColor: "oklch(0.93 0.025 80)", border: "1px solid oklch(0.82 0.03 75)" }}>
            <p className="text-xs font-bold mb-1" style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Playfair Display', Georgia, serif" }}>CONTACT INFO</p>
            <p className="text-sm" style={{ color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif" }}>{listing.contactMethod}</p>
          </div>
        ) : (
          <p className="text-sm italic mb-3" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            No contact info provided. Reply to this listing via the community forum.
          </p>
        )}
        <button
          onClick={onClose}
          className="w-full py-2 font-bold rounded-sm text-sm"
          style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Post form modal ────────────────────────────────────────────────────────
function PostFormModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: "",
    offering: "",
    seeking: "",
    category: "food-produce" as Exclude<CategoryKey, "all">,
    location: "",
    posterName: "",
    posterEmail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = trpc.barter.create.useMutation({
    onSuccess: () => {
      toast.success("Trade posted!", { description: "Your listing is now live on the board." });
      onSuccess();
      onClose();
    },
    onError: (err) => {
      toast.error("Failed to post trade", { description: err.message });
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim() || form.title.trim().length < 3) e.title = "Give your listing a short title (3+ characters)";
    if (!form.offering.trim() || form.offering.trim().length < 3) e.offering = "Describe what you're offering";
    if (!form.seeking.trim() || form.seeking.trim().length < 3) e.seeking = "Describe what you want in return";
    if (form.posterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.posterEmail)) e.posterEmail = "Enter a valid email address";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    createMutation.mutate({
      title: form.title.trim(),
      offering: form.offering.trim(),
      seeking: form.seeking.trim(),
      category: form.category,
      location: form.location.trim() || undefined,
      posterName: form.posterName.trim() || undefined,
      posterEmail: form.posterEmail.trim() || undefined,
    });
  };

  const field = (key: keyof typeof form, label: string, placeholder: string, multiline = false) => (
    <div>
      <label className="block text-xs font-bold mb-1 uppercase tracking-wide" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.35 0.03 65)" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2 text-sm rounded-sm border resize-none"
          style={{ backgroundColor: "oklch(0.96 0.025 85)", borderColor: errors[key] ? "#dc2626" : "oklch(0.82 0.03 75)", color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif", outline: "none" }}
        />
      ) : (
        <input
          type={key === "posterEmail" ? "email" : "text"}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2 text-sm rounded-sm border"
          style={{ backgroundColor: "oklch(0.96 0.025 85)", borderColor: errors[key] ? "#dc2626" : "oklch(0.82 0.03 75)", color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif", outline: "none" }}
        />
      )}
      {errors[key] && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ backgroundColor: "oklch(0.12 0.04 55 / 0.80)" }}>
      <div className="w-full max-w-lg my-8 p-6 rounded-sm" style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
            Post a New Trade
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          {field("title", "Listing Title *", "e.g., Fresh Eggs for Canning Jars")}
          {field("offering", "What I Have (Offering) *", "Describe what you're trading, giving, or offering...", true)}
          {field("seeking", "What I Want (Seeking) *", "What would you like in return? Be specific...", true)}

          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wide" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.35 0.03 65)" }}>
              Category *
            </label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Exclude<CategoryKey, "all"> }))}
                className="w-full px-3 py-2 text-sm rounded-sm border appearance-none pr-8"
                style={{ backgroundColor: "oklch(0.96 0.025 85)", borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif", outline: "none" }}
              >
                {CATEGORIES.filter((c) => c.key !== "all").map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "oklch(0.55 0.03 65)" }} />
            </div>
          </div>

          {field("location", "Your General Location", "e.g., Ozark Mountains, AR  or  Hill Country, TX")}

          <div className="border-t pt-3" style={{ borderColor: "oklch(0.88 0.02 75)" }}>
            <p className="text-xs mb-3" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Optional — helps interested traders reach you directly.
            </p>
            {field("posterName", "Your Name (optional)", "First name or handle")}
            {field("posterEmail", "Your Email (optional)", "Interested parties will email you directly")}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex-1 py-2.5 font-bold rounded-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : "Post My Trade"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 font-bold rounded-sm border transition-all hover:bg-gray-100"
            style={{ borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.45 0.03 65)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Listing card ───────────────────────────────────────────────────────────
function ListingCard({
  listing,
  onContact,
  onDelete,
  canDelete,
}: {
  listing: Listing;
  onContact: (l: Listing) => void;
  onDelete: (l: Listing) => void;
  canDelete: boolean;
}) {
  const cat = getCat(listing.category);
  const timeAgo = formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true });
  const hasContact = !!(listing.posterEmail || listing.contactMethod);

  return (
    <article
      className="rounded-sm overflow-hidden transition-shadow hover:shadow-md"
      style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.85 0.025 75)" }}
    >
      {/* Category bar */}
      <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: cat.bg, borderBottom: `1px solid oklch(0.85 0.025 75)` }}>
        <div className="flex items-center gap-2">
          <span style={{ color: cat.color }}>{cat.icon}</span>
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: cat.color, fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {cat.label}
          </span>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(listing)}
            title="Remove listing"
            className="p-1 rounded transition-all hover:bg-red-100 group"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400 group-hover:text-red-600" />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-black text-base mb-3 leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
          {listing.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex gap-2.5">
            <span className="flex-shrink-0 mt-0.5 w-16 text-xs font-bold uppercase tracking-wide" style={{ color: "#15803d", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              I Have:
            </span>
            <p className="text-sm leading-snug" style={{ color: "oklch(0.28 0.04 145)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              {listing.offering || listing.description}
            </p>
          </div>
          {listing.seeking && (
            <div className="flex gap-2.5">
              <span className="flex-shrink-0 mt-0.5 w-16 text-xs font-bold uppercase tracking-wide" style={{ color: "#b45309", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                I Want:
              </span>
              <p className="text-sm leading-snug" style={{ color: "oklch(0.28 0.04 145)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                {listing.seeking}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-3" style={{ borderTop: "1px solid oklch(0.90 0.02 75)" }}>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {listing.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {listing.location}
              </span>
            )}
            {listing.posterName && <span>{listing.posterName}</span>}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeAgo}
            </span>
          </div>
          <button
            onClick={() => onContact(listing)}
            className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: hasContact ? "oklch(0.22 0.06 145)" : "oklch(0.93 0.025 80)",
              color: hasContact ? "oklch(0.96 0.025 85)" : "oklch(0.45 0.03 65)",
              fontFamily: "'Playfair Display', Georgia, serif",
              border: hasContact ? "none" : "1px solid oklch(0.82 0.03 75)",
            }}
          >
            {hasContact ? "Contact" : "Inquire"}
          </button>
        </div>
      </div>
    </article>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function BarterTrade() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryKey>("all");
  const [showPostForm, setShowPostForm] = useState(false);
  const [contactListing, setContactListing] = useState<Listing | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);

  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

  const { data: listings = [], isLoading, refetch, error } = trpc.barter.list.useQuery(
    { category: category === "all" ? undefined : category },
    { refetchOnWindowFocus: false }
  );

  const deleteMutation = trpc.barter.delete.useMutation({
    onSuccess: () => {
      toast.success("Listing removed.", { description: "The trade has been taken off the board." });
      setDeleteTarget(null);
      refetch();
    },
    onError: (err) => {
      toast.error("Could not remove listing", { description: err.message });
      setDeleteTarget(null);
    },
  });

  // Determine if the current user can delete a given listing
  const canDeleteListing = (listing: Listing) => {
    if (!isAuthenticated) return false;
    if (isAdmin) return true;
    // Users can delete their own listings (userId matches)
    return user?.id === listing.userId;
  };

  const filtered = listings.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      (l.offering ?? "").toLowerCase().includes(q) ||
      (l.seeking ?? "").toLowerCase().includes(q) ||
      (l.location ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BARTER_IMG})` }} />
        <div className="absolute inset-0" style={{ background: "oklch(0.12 0.04 55 / 0.82)" }} />
        <div className="relative container">
          <p className="section-label mb-3">Trade Without Dollars</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
            Barter & Trade Board
          </h1>
          <p className="text-lg max-w-2xl mb-6" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Post what you have. Find what you need. Build a resilient local economy based on real value — skills, food, labor, and goods.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPostForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <Plus className="w-4 h-4" /> Post a Trade
            </button>
            <div
              className="inline-flex items-center gap-2 px-4 py-3 rounded-sm text-sm"
              style={{ backgroundColor: "oklch(0.98 0.01 85 / 0.15)", color: "oklch(0.92 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif", border: "1px solid oklch(0.82 0.02 85 / 0.3)" }}
            >
              <CheckCircle2 className="w-4 h-4" /> Free to browse & post — no account required
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-0 z-30 py-3 border-b shadow-sm" style={{ backgroundColor: "oklch(0.93 0.025 80)", borderColor: "oklch(0.82 0.03 75)" }}>
        <div className="container space-y-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "oklch(0.55 0.03 65)" }} />
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-sm border"
              style={{ backgroundColor: "oklch(0.98 0.01 85)", borderColor: "oklch(0.82 0.03 75)", color: "oklch(0.18 0.06 145)", fontFamily: "'Source Serif 4', Georgia, serif", outline: "none" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-all"
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  backgroundColor: category === c.key ? c.color : "oklch(0.98 0.01 85)",
                  color: category === c.key ? "#fff" : "oklch(0.35 0.03 65)",
                  border: `1px solid ${category === c.key ? c.color : "oklch(0.82 0.03 75)"}`,
                }}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-10 flex-1">
        <div className="container">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              {isLoading ? "Loading..." : `${filtered.length} active listing${filtered.length !== 1 ? "s" : ""}${search ? ` matching "${search}"` : ""}`}
            </p>
            <button
              onClick={() => setShowPostForm(true)}
              className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <Plus className="w-3.5 h-3.5" /> New Listing
            </button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "oklch(0.55 0.03 65)" }} />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-sm mb-6" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">Could not load listings. Please try refreshing the page.</p>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: "oklch(0.45 0.03 65)" }} />
              <h3 className="text-xl font-black mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.35 0.03 65)" }}>
                {search ? "No listings match your search" : "No listings yet — be the first!"}
              </h3>
              <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                {search ? "Try different keywords or clear the search." : "Post what you have and start the trade board."}
              </p>
              {!search && (
                <button
                  onClick={() => setShowPostForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  <Plus className="w-4 h-4" /> Post the First Trade
                </button>
              )}
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing as Listing}
                  onContact={setContactListing}
                  onDelete={setDeleteTarget}
                  canDelete={canDeleteListing(listing as Listing)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 border-t" style={{ backgroundColor: "oklch(0.93 0.025 80)", borderColor: "oklch(0.82 0.03 75)" }}>
        <div className="container">
          <h2 className="text-2xl font-black mb-6 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
            How the Trade Board Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Post What You Have", desc: "List your goods, skills, or labor. No account needed — just fill out the form." },
              { step: "2", title: "Browse & Find", desc: "Filter by category, search by keyword, and find exactly what your homestead needs." },
              { step: "3", title: "Connect & Trade", desc: "Click Contact to reach the poster directly. Work out the details between yourselves." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-black text-lg"
                  style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {s.step}
                </div>
                <h3 className="font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>{s.title}</h3>
                <p className="text-sm" style={{ color: "oklch(0.45 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      {showPostForm && (
        <PostFormModal onClose={() => setShowPostForm(false)} onSuccess={() => refetch()} />
      )}
      {contactListing && (
        <ContactModal listing={contactListing} onClose={() => setContactListing(null)} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          listing={deleteTarget}
          onConfirm={() => deleteMutation.mutate({ id: deleteTarget.id })}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

/**
 * Cherry Pick Your Knowledge — Offline PDF Bundle Builder
 * Users select the skill guides, school modules, and reference docs they want
 * and download a curated offline markdown bundle (real S3 file, not a placeholder).
 */

import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Download,
  Check,
  BookOpen,
  Leaf,
  Hammer,
  Flame,
  Sprout,
  Target,
  Feather,
  Droplets,
  Sun,
  GraduationCap,
  ShieldAlert,
  Wheat,
  ChevronRight,
  Package,
  FileText,
  Loader2,
} from "lucide-react";

type BundleItem = {
  id: string;
  category: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  pages: number;
  color: string;
  // For skill items: the skill slug. For course items: the course DB id (stored as string).
  skillSlug?: string;
  courseId?: number;
};

const BUNDLE_ITEMS: BundleItem[] = [
  // Skills — slugs match the server-side skillsData.ts
  { id: "butchering", category: "Skills", title: "Butchering Guide", desc: "Processing livestock and wild game from harvest to table.", icon: Flame, pages: 22, color: "oklch(0.55_0.18_25)", skillSlug: "butchering" },
  { id: "foraging", category: "Skills", title: "Foraging Guide", desc: "Wild edibles and medicinal plants by season and region.", icon: Leaf, pages: 28, color: "oklch(0.50_0.15_145)", skillSlug: "foraging" },
  { id: "building", category: "Skills", title: "Building Guide", desc: "Shelters, fences, barns, and off-grid construction.", icon: Hammer, pages: 30, color: "oklch(0.48_0.10_55)", skillSlug: "building" },
  { id: "food-preservation", category: "Skills", title: "Food Preservation Guide", desc: "Canning, smoking, fermenting, dehydrating, root cellaring.", icon: Package, pages: 35, color: "oklch(0.55_0.14_65)", skillSlug: "food-preservation" },
  { id: "gardening", category: "Skills", title: "Gardening Guide", desc: "Planting calendars, companion planting, soil health, seed saving.", icon: Sprout, pages: 32, color: "oklch(0.50_0.14_140)", skillSlug: "gardening" },
  { id: "hunting", category: "Skills", title: "Hunting & Gaming Guide", desc: "Seasons, licensing, field dressing, ethical harvest.", icon: Target, pages: 20, color: "oklch(0.45_0.10_50)", skillSlug: "hunting-gaming" },
  { id: "animal-husbandry", category: "Skills", title: "Animal Husbandry Guide", desc: "Chickens, goats, pigs, cattle — care, breeding, health.", icon: Feather, pages: 38, color: "oklch(0.52_0.12_80)", skillSlug: "animal-husbandry" },
  { id: "water-systems", category: "Skills", title: "Water Systems Guide", desc: "Rainwater collection, wells, filtration, gray water.", icon: Droplets, pages: 24, color: "oklch(0.50_0.14_220)", skillSlug: "water-systems" },
  { id: "solar", category: "Skills", title: "Solar Energy Guide", desc: "Small-scale solar, battery banks, off-grid power.", icon: Sun, pages: 26, color: "oklch(0.60_0.16_80)", skillSlug: "solar-energy" },
  // Reference
  { id: "seed-catalog", category: "Reference", title: "Heirloom Seed Catalog", desc: "200+ heirloom varieties with planting guides and saving instructions.", icon: Wheat, pages: 44, color: "oklch(0.55_0.14_100)", skillSlug: "seed-catalog" },
  { id: "emergency-prep", category: "Reference", title: "Emergency Preparedness", desc: "First aid, water purification, food storage, disaster checklists.", icon: ShieldAlert, pages: 30, color: "oklch(0.50_0.16_20)", skillSlug: "emergency-prep" },
  // Schoolhouse
  { id: "k8-stem", category: "Schoolhouse", title: "K–8 STEM Curriculum", desc: "Science, math, and nature study lessons for grades K–8.", icon: GraduationCap, pages: 80, color: "oklch(0.52_0.16_260)", skillSlug: "k8-stem" },
  { id: "912-stem", category: "Schoolhouse", title: "9–12 AP/STEM Curriculum", desc: "Advanced biology, chemistry, physics, and environmental science.", icon: BookOpen, pages: 90, color: "oklch(0.50_0.14_290)", skillSlug: "912-stem" },
];

// Skill slugs that actually exist in the server-side skills data
const REAL_SKILL_SLUGS = new Set([
  "butchering", "foraging", "building", "food-preservation",
  "gardening", "hunting-gaming", "animal-husbandry", "water-systems", "solar-energy",
]);

const CATEGORIES = ["Skills", "Reference", "Schoolhouse"];

export default function CherryPick() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const generateBundle = trpc.cherryPick.generateBundle.useMutation({
    onSuccess: (data) => {
      // Trigger a real file download via a temporary anchor element
      const a = document.createElement("a");
      a.href = data.url;
      a.download = data.filename;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      const parts: string[] = [];
      if (data.skillCount > 0) parts.push(`${data.skillCount} skill guide${data.skillCount > 1 ? "s" : ""}`);
      if (data.courseCount > 0) parts.push(`${data.courseCount} course${data.courseCount > 1 ? "s" : ""}`);
      toast.success(`Bundle downloaded: ${parts.join(" + ")}. Open it in any markdown viewer or text editor.`, { duration: 8000 });
    },
    onError: (err) => {
      toast.error(err.message || "Bundle generation failed. Please try again.");
    },
  });

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = (category: string) => {
    const ids = BUNDLE_ITEMS.filter((i) => i.category === category).map((i) => i.id);
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const clearAll = () => setSelected(new Set());

  const totalPages = BUNDLE_ITEMS.filter((i) => selected.has(i.id)).reduce((sum, i) => sum + i.pages, 0);

  const handleDownload = () => {
    if (selected.size === 0) {
      toast.error("Select at least one guide to download.");
      return;
    }

    // Separate selected items into skill slugs (real ones only) vs course IDs
    const selectedItems = BUNDLE_ITEMS.filter((i) => selected.has(i.id));
    const skillSlugs = selectedItems
      .filter((i) => i.skillSlug && REAL_SKILL_SLUGS.has(i.skillSlug))
      .map((i) => i.skillSlug as string);
    const courseIds = selectedItems
      .filter((i) => i.courseId !== undefined)
      .map((i) => i.courseId as number);

    if (skillSlugs.length === 0 && courseIds.length === 0) {
      toast.info("The selected items are reference placeholders — full content is coming soon. Try selecting from the Skills section for an immediate download.", { duration: 6000 });
      return;
    }

    generateBundle.mutate({ skillSlugs, courseIds });
  };

  const isLoading = generateBundle.isPending;

  return (
    <div className="min-h-screen bg-[oklch(0.12_0.02_240)] text-white">
      <Navigation />

      {/* ── Hero ── */}
      <section className="pt-24 pb-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[oklch(0.22_0.08_80)] text-[oklch(0.78_0.16_80)] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Download className="w-4 h-4" />
            Offline Markdown Bundles — Free
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Cherry Pick Your Knowledge
          </h1>
          <p className="text-xl text-[oklch(0.72_0.05_240)] max-w-2xl mx-auto mb-4">
            Select the guides you want. Download them as a single offline text bundle. No account required.
          </p>
          <p className="text-[oklch(0.60_0.04_240)]">
            Because you should own your knowledge — not rent it from a server.
          </p>
          <p className="text-xs text-[oklch(0.50_0.04_240)] mt-2">
            Bundles download as Markdown (.md) — readable in any text editor, browser, or markdown app.
          </p>
        </div>
      </section>

      {/* ── Builder ── */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Sticky summary bar */}
          <div className="sticky top-16 z-20 bg-[oklch(0.16_0.04_240)] border border-[oklch(0.28_0.06_240)] rounded-xl px-6 py-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-black text-[oklch(0.78_0.16_80)]">{selected.size}</div>
                <div className="text-xs text-[oklch(0.55_0.04_240)]">guides selected</div>
              </div>
              <div className="w-px h-10 bg-[oklch(0.28_0.04_240)]" />
              <div className="text-center">
                <div className="text-2xl font-black text-[oklch(0.78_0.16_80)]">{totalPages}</div>
                <div className="text-xs text-[oklch(0.55_0.04_240)]">est. pages</div>
              </div>
              {selected.size > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-[oklch(0.55_0.04_240)] hover:text-[oklch(0.75_0.04_240)] transition-colors ml-2"
                >
                  Clear all
                </button>
              )}
            </div>
            <button
              onClick={handleDownload}
              disabled={selected.size === 0 || isLoading}
              className="flex items-center gap-2 bg-[oklch(0.55_0.18_80)] hover:bg-[oklch(0.50_0.18_80)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Building bundle...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Bundle
                </>
              )}
            </button>
          </div>

          {/* Category sections */}
          {CATEGORIES.map((cat) => {
            const items = BUNDLE_ITEMS.filter((i) => i.category === cat);
            const allSelected = items.every((i) => selected.has(i.id));
            return (
              <div key={cat} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-black text-[oklch(0.88_0.05_240)]">{cat}</h2>
                    {cat === "Reference" && (
                      <p className="text-xs text-[oklch(0.50_0.04_240)] mt-0.5">Full content coming soon — these will be included in future bundle updates</p>
                    )}
                    {cat === "Schoolhouse" && (
                      <p className="text-xs text-[oklch(0.50_0.04_240)] mt-0.5">Schoolhouse course bundles available once courses are published in the Course Library</p>
                    )}
                  </div>
                  <button
                    onClick={() => allSelected ? items.forEach((i) => toggle(i.id)) : selectAll(cat)}
                    className="text-sm text-[oklch(0.60_0.12_160)] hover:text-[oklch(0.75_0.15_160)] font-semibold transition-colors"
                  >
                    {allSelected ? "Deselect all" : "Select all"}
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selected.has(item.id);
                    const isReal = item.skillSlug && REAL_SKILL_SLUGS.has(item.skillSlug);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`text-left rounded-xl border p-5 transition-all ${
                          isSelected
                            ? "bg-[oklch(0.18_0.05_160)] border-[oklch(0.50_0.18_160)] shadow-lg shadow-[oklch(0.50_0.18_160)]/10"
                            : "bg-[oklch(0.16_0.03_240)] border-[oklch(0.24_0.04_240)] hover:border-[oklch(0.38_0.08_160)]"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `color-mix(in oklch, ${item.color} 20%, transparent)` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: item.color }} />
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[oklch(0.55_0.18_160)] border-[oklch(0.55_0.18_160)]"
                              : "border-[oklch(0.35_0.04_240)]"
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </div>
                        <h3 className="font-bold text-sm mb-1 text-[oklch(0.90_0.05_240)]">{item.title}</h3>
                        <p className="text-xs text-[oklch(0.62_0.04_240)] leading-relaxed mb-3">{item.desc}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-[oklch(0.52_0.04_240)]">
                            <FileText className="w-3 h-3" />
                            {item.pages} pages
                          </div>
                          {!isReal && (
                            <span className="text-xs text-[oklch(0.50_0.08_60)] bg-[oklch(0.20_0.04_60)] px-2 py-0.5 rounded-full">
                              Coming soon
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-12 px-4 bg-[oklch(0.14_0.02_240)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-black mb-6 text-[oklch(0.88_0.05_240)]">How Your Bundle Works</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { step: "1", title: "Select Your Guides", desc: "Check any combination of skill guides from the library above." },
              { step: "2", title: "Click Download", desc: "Your bundle is assembled on our server and downloaded as a Markdown file." },
              { step: "3", title: "Read Anywhere", desc: "Open in any text editor, Obsidian, Notion, or a free Markdown viewer. Works fully offline." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[oklch(0.55_0.18_80)] text-white font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <div className="font-bold text-sm text-[oklch(0.88_0.05_240)] mb-1">{s.title}</div>
                  <div className="text-xs text-[oklch(0.62_0.04_240)] leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offline Kit CTA ── */}
      <section className="py-16 px-4 bg-[oklch(0.15_0.02_240)]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[oklch(0.18_0.05_160)] border border-[oklch(0.35_0.15_160)] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-black mb-2">Want everything, offline, forever?</h3>
              <p className="text-[oklch(0.70_0.05_240)] text-sm leading-relaxed">
                The Homestead Offline Kit is a Raspberry Pi pre-loaded with the entire library — skills, curriculum, seed databases, and a local AI assistant — running on your home network with no internet required.
              </p>
            </div>
            <Link
              href="/offline-kit"
              className="flex-shrink-0 flex items-center gap-2 bg-[oklch(0.55_0.18_160)] hover:bg-[oklch(0.50_0.18_160)] text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Learn More
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

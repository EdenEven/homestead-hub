/*
 * Footer — Homestead Hub
 * Design: Rugged Americana Craft — deep forest green, parchment text
 */

import { Link } from "wouter";
import { Leaf, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "oklch(0.15 0.05 145)", color: "oklch(0.82 0.02 85)" }}>
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-sm" style={{ backgroundColor: "oklch(0.68 0.12 65)" }}>
                <Leaf className="w-4 h-4" style={{ color: "oklch(0.15 0.05 145)" }} />
              </div>
              <span className="font-bold text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
                The Homestead Hub
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Building self-reliant communities one skill at a time. Knowledge is the most valuable resource you can own.
            </p>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-bold text-sm mb-4 tracking-widest uppercase" style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Skills Hub
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              {[
                { label: "Butchering", slug: "butchering" },
                { label: "Foraging", slug: "foraging" },
                { label: "Building", slug: "building" },
                { label: "Food Preservation", slug: "food-preservation" },
                { label: "Gardening", slug: "gardening" },
              ].map((s) => (
                <li key={s.slug}>
                  <Link href={`/skills/${s.slug}`} className="hover:text-amber-400 transition-colors" style={{ color: "oklch(0.65 0.02 85)" }}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Skills */}
          <div>
            <h4 className="font-bold text-sm mb-4 tracking-widest uppercase" style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              More Skills
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              {[
                { label: "Hunting & Gaming", slug: "hunting-gaming" },
                { label: "Animal Husbandry", slug: "animal-husbandry" },
                { label: "Water Systems", slug: "water-systems" },
                { label: "Solar Energy", slug: "solar-energy" },
              ].map((s) => (
                <li key={s.slug}>
                  <Link href={`/skills/${s.slug}`} className="hover:text-amber-400 transition-colors" style={{ color: "oklch(0.65 0.02 85)" }}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-bold text-sm mb-4 tracking-widest uppercase" style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Community
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              {[
                { label: "Find Homesteaders", href: "/community" },
                { label: "Barter & Trade", href: "/barter" },
                { label: "Land Access", href: "/land-access" },
                { label: "Map Explorer", href: "/map" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-amber-400 transition-colors" style={{ color: "oklch(0.65 0.02 85)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rope divider */}
        <div className="rope-divider my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: "oklch(0.5 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          <p>© {new Date().getFullYear()} The Homestead Hub. Built for the self-reliant.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 inline" style={{ color: "oklch(0.68 0.12 65)" }} /> for homesteaders everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}

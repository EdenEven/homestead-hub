/*
 * Footer — Homestead Hub
 * Design: Rugged Americana Craft — deep forest green, parchment text
 */

import { Link } from "wouter";
import { Leaf, Heart } from "lucide-react";

const FACEBOOK_URL = "https://www.facebook.com/a1homesteadhub";

// Facebook SVG icon (official shape, no external dependency needed)
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

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
            <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.65 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Building self-reliant communities one skill at a time. Knowledge is the most valuable resource you can own.
            </p>

            {/* Social — Facebook */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Follow Us
              </p>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-sm font-semibold text-sm transition-all hover:opacity-90 group"
                style={{
                  backgroundColor: "#1877F2",
                  color: "#fff",
                  fontFamily: "'Source Serif 4', Georgia, serif",
                }}
                aria-label="Follow A1 Homestead Hub on Facebook"
              >
                <FacebookIcon className="w-4 h-4 flex-shrink-0" />
                <span>A1 Homestead Hub</span>
              </a>
            </div>
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

            {/* Facebook CTA in community column */}
            <div className="mt-6 p-3 rounded-sm" style={{ backgroundColor: "oklch(0.20 0.05 145)", border: "1px solid oklch(0.28 0.05 145)" }}>
              <p className="text-xs mb-2" style={{ color: "oklch(0.65 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Join our growing community of homesteaders on Facebook.
              </p>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:opacity-80"
                style={{ color: "#5B9BD5", fontFamily: "'Source Serif 4', Georgia, serif" }}
                aria-label="Like our Facebook page"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
                Like our page →
              </a>
            </div>
          </div>
        </div>

        {/* Rope divider */}
        <div className="rope-divider my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: "oklch(0.5 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          <p>© {new Date().getFullYear()} The Homestead Hub. Built for the self-reliant.</p>
          <div className="flex items-center gap-4">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-blue-400"
              style={{ color: "oklch(0.5 0.02 85)" }}
              aria-label="Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              Facebook
            </a>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 inline" style={{ color: "oklch(0.68 0.12 65)" }} /> for homesteaders everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*
 * Navigation — Homestead Hub
 * Design: Rugged Americana Craft
 * Deep forest green header, Playfair Display nav links, amber accent
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Leaf } from "lucide-react";

const navLinks: { label: string; href: string; highlight?: boolean }[] = [
  { label: "Skills Hub", href: "/skills" },
  { label: "From the Field", href: "/blog" },
  { label: "Community", href: "/community" },
  { label: "Barter & Trade", href: "/barter" },
  { label: "Land Access", href: "/land-access" },
  { label: "Map Explorer", href: "/map" },
  { label: "Pricing", href: "/pricing", highlight: true },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "oklch(0.18 0.06 145)", borderBottom: "1px solid oklch(0.28 0.06 145)" }}>
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-sm" style={{ backgroundColor: "oklch(0.68 0.12 65)" }}>
            <Leaf className="w-5 h-5" style={{ color: "oklch(0.18 0.06 145)" }} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
              The Homestead Hub
            </span>
            <span className="text-xs tracking-widest uppercase" style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Self-Reliant Living
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location === link.href || location.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link px-3 py-2 rounded-sm text-sm transition-all"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: link.highlight && !isActive ? "oklch(0.68 0.12 65)" : isActive ? "oklch(0.68 0.12 65)" : "oklch(0.82 0.02 85)",
                  backgroundColor: isActive ? "oklch(0.25 0.07 145)" : link.highlight ? "oklch(0.25 0.08 65 / 0.25)" : "transparent",
                  fontWeight: isActive || link.highlight ? "700" : "600",
                  border: link.highlight && !isActive ? "1px solid oklch(0.68 0.12 65 / 0.4)" : "1px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/community"
            className="px-4 py-2 text-sm font-semibold rounded-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: "oklch(0.68 0.12 65)",
              color: "oklch(0.18 0.06 145)",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            Join the Community
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-sm"
          style={{ color: "oklch(0.82 0.02 85)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: "oklch(0.20 0.06 145)", borderColor: "oklch(0.28 0.06 145)" }}>
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="nav-link px-3 py-3 rounded-sm text-base transition-all"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: isActive ? "oklch(0.68 0.12 65)" : "oklch(0.82 0.02 85)",
                    backgroundColor: isActive ? "oklch(0.25 0.07 145)" : "transparent",
                    fontWeight: isActive ? "700" : "600",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/community"
              onClick={() => setMenuOpen(false)}
              className="mt-2 px-4 py-3 text-sm font-semibold rounded-sm text-center transition-all"
              style={{
                backgroundColor: "oklch(0.68 0.12 65)",
                color: "oklch(0.18 0.06 145)",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Join the Community
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

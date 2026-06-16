/*
 * Navigation — Homestead Hub
 * Design: Rugged Americana Craft
 * Grouped dropdown mega-menu — 5 top-level categories, each with a hover panel.
 * Mobile: accordion-style expand/collapse per category.
 */

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Leaf,
  User,
  ChevronDown,
  BookOpen,
  Rss,
  Users,
  Repeat2,
  MapPin,
  Map,
  LayoutGrid,
  GraduationCap,
  Sparkles,
  Star,
  Info,
  Handshake,
  FileText,
  BarChart3,
  Film,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

// ─── Nav Structure ────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  desc: string;
  highlight?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Learn",
    items: [
      {
        label: "Skills Hub",
        href: "/skills",
        icon: <BookOpen className="w-4 h-4" />,
        desc: "9 deep skill libraries — butchering, foraging, building, and more",
      },
      {
        label: "From the Field",
        href: "/blog",
        icon: <Rss className="w-4 h-4" />,
        desc: "Daily homesteading blog — new post published every morning",
      },
    ],
  },
  {
    label: "Schoolhouse",
    items: [
      {
        label: "Course Library",
        href: "/schoolhouse",
        icon: <GraduationCap className="w-4 h-4" />,
        desc: "K–12 STEM and AP-prep homeschool curriculum with AI tutor",
        highlight: true,
      },
      {
        label: "AI Course Creator",
        href: "/schoolhouse/ai-creator",
        icon: <Sparkles className="w-4 h-4" />,
        desc: "Generate a full course in minutes with AI — any subject, any grade",
        highlight: true,
      },
      {
        label: "Schoolhouse Pro",
        href: "/schoolhouse/pro",
        icon: <Star className="w-4 h-4" />,
        desc: "Unlock read-aloud, voice tutor, and unlimited course creation",
        highlight: true,
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        label: "Find Homesteaders",
        href: "/community",
        icon: <Users className="w-4 h-4" />,
        desc: "Browse member profiles and connect with homesteaders near you",
      },
      {
        label: "Barter & Trade",
        href: "/barter",
        icon: <Repeat2 className="w-4 h-4" />,
        desc: "Post and browse trades — goods, skills, and services",
      },
      {
        label: "Land Access",
        href: "/land-access",
        icon: <MapPin className="w-4 h-4" />,
        desc: "Find land to lease, share, or steward across the country",
      },
      {
        label: "Map Explorer",
        href: "/map",
        icon: <Map className="w-4 h-4" />,
        desc: "Interactive map of homesteaders, land listings, and resources",
      },
    ],
  },
  {
    label: "Features",
    items: [
      {
        label: "Platform Overview",
        href: "/features",
        icon: <LayoutGrid className="w-4 h-4" />,
        desc: "Everything A1 Homestead Hub offers — all in one place",
      },
      {
        label: "Market Ticker",
        href: "/#ticker",
        icon: <BarChart3 className="w-4 h-4" />,
        desc: "Live commodity prices — corn, wheat, cattle, gold, and more",
      },
      {
        label: "The Film",
        href: "/film",
        icon: <Film className="w-4 h-4" />,
        desc: "SVG cinematic scenes — a full day on the homestead, trailer, and seed tutorial",
        highlight: true,
      },
    ],
  },
  {
    label: "About",
    items: [
      {
        label: "Our Story",
        href: "/about",
        icon: <Info className="w-4 h-4" />,
        desc: "Why A1 Homestead Hub was built and who is behind it",
      },
      {
        label: "Partner With Us",
        href: "/partners",
        icon: <Handshake className="w-4 h-4" />,
        desc: "Seed suppliers, advertisers, and affiliate partners — apply here",
      },
      {
        label: "Media Kit",
        href: "/media-kit",
        icon: <FileText className="w-4 h-4" />,
        desc: "Audience profile, content reach, ad formats, and brand standards",
      },
    ],
  },
];

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────

function DesktopDropdown({ group, location }: { group: NavGroup; location: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGroupActive = group.items.some(
    (item) => location === item.href || location.startsWith(item.href.split("#")[0] + "/")
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        className="flex items-center gap-1 px-3 py-2 rounded-sm text-sm font-semibold transition-all"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: isGroupActive ? "oklch(0.68 0.12 65)" : "oklch(0.82 0.02 85)",
          backgroundColor: isGroupActive ? "oklch(0.25 0.07 145)" : open ? "oklch(0.25 0.07 145)" : "transparent",
        }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {group.label}
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1 rounded-sm shadow-xl z-50 min-w-[260px]"
          style={{
            backgroundColor: "oklch(0.20 0.06 145)",
            border: "1px solid oklch(0.30 0.07 145)",
            boxShadow: "0 8px 32px oklch(0.08 0.04 145 / 0.8)",
          }}
        >
          {/* Group label */}
          <div
            className="px-4 py-2 border-b"
            style={{ borderColor: "oklch(0.28 0.06 145)" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              {group.label}
            </p>
          </div>

          {/* Items */}
          <div className="py-2">
            {group.items.map((item) => {
              const isActive = location === item.href || location.startsWith(item.href.split("#")[0] + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 transition-all group"
                  style={{
                    backgroundColor: isActive ? "oklch(0.26 0.08 145)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "oklch(0.24 0.07 145)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <span
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: item.highlight ? "oklch(0.68 0.12 65)" : isActive ? "oklch(0.68 0.12 65)" : "oklch(0.55 0.04 145)" }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <p
                      className="text-sm font-semibold leading-tight mb-0.5"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: item.highlight ? "oklch(0.68 0.12 65)" : isActive ? "oklch(0.68 0.12 65)" : "oklch(0.88 0.02 85)",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-xs leading-snug"
                      style={{ color: "oklch(0.58 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mobile Accordion Group ───────────────────────────────────────────────────

function MobileGroup({
  group,
  location,
  onNavigate,
}: {
  group: NavGroup;
  location: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isGroupActive = group.items.some(
    (item) => location === item.href || location.startsWith(item.href.split("#")[0] + "/")
  );

  return (
    <div style={{ borderBottom: "1px solid oklch(0.26 0.06 145)" }}>
      {/* Group trigger */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-left"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: isGroupActive || open ? "oklch(0.68 0.12 65)" : "oklch(0.82 0.02 85)",
          backgroundColor: open ? "oklch(0.22 0.07 145)" : "transparent",
        }}
        onClick={() => setOpen(!open)}
      >
        {group.label}
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Items */}
      {open && (
        <div style={{ backgroundColor: "oklch(0.16 0.05 145)" }}>
          {group.items.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 px-6 py-3 text-sm transition-all"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: item.highlight ? "oklch(0.68 0.12 65)" : isActive ? "oklch(0.68 0.12 65)" : "oklch(0.75 0.02 85)",
                  backgroundColor: isActive ? "oklch(0.22 0.07 145)" : "transparent",
                  fontWeight: isActive ? "700" : "600",
                }}
              >
                <span style={{ color: item.highlight ? "oklch(0.68 0.12 65)" : "oklch(0.50 0.04 145)" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Navigation ──────────────────────────────────────────────────────────

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "oklch(0.18 0.06 145)", borderBottom: "1px solid oklch(0.28 0.06 145)" }}
    >
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-sm"
            style={{ backgroundColor: "oklch(0.68 0.12 65)" }}
          >
            <Leaf className="w-5 h-5" style={{ color: "oklch(0.18 0.06 145)" }} />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}
            >
              The Homestead Hub
            </span>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              Self-Reliant Living
            </span>
          </div>
        </Link>

        {/* Desktop Nav — grouped dropdowns */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_GROUPS.map((group) => (
            <DesktopDropdown key={group.label} group={group} location={location} />
          ))}
        </nav>

        {/* Auth CTA */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-sm transition-all hover:opacity-90"
                style={{
                  backgroundColor: "oklch(0.25 0.07 145)",
                  color: "oklch(0.82 0.02 85)",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  border: "1px solid oklch(0.35 0.07 145)",
                }}
              >
                <User className="w-3.5 h-3.5" />
                {user?.name?.split(" ")[0] || "My Profile"}
              </Link>
              <button
                onClick={() => logout()}
                className="px-3 py-2 text-xs font-semibold rounded-sm transition-all hover:opacity-70"
                style={{ color: "oklch(0.60 0.02 85)" }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <a
              href={getLoginUrl()}
              className="px-4 py-2 text-sm font-semibold rounded-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: "oklch(0.68 0.12 65)",
                color: "oklch(0.18 0.06 145)",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Join Free
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-sm"
          style={{ color: "oklch(0.82 0.02 85)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu — accordion groups */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: "oklch(0.20 0.06 145)", borderColor: "oklch(0.28 0.06 145)" }}
        >
          {NAV_GROUPS.map((group) => (
            <MobileGroup
              key={group.label}
              group={group}
              location={location}
              onNavigate={() => setMenuOpen(false)}
            />
          ))}

          {/* Mobile Auth */}
          <div className="px-4 py-4">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-sm transition-all"
                  style={{
                    backgroundColor: "oklch(0.68 0.12 65)",
                    color: "oklch(0.18 0.06 145)",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="px-4 py-2 text-sm text-left rounded-sm"
                  style={{ color: "oklch(0.60 0.02 85)" }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <a
                href={getLoginUrl()}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold rounded-sm text-center transition-all"
                style={{
                  backgroundColor: "oklch(0.68 0.12 65)",
                  color: "oklch(0.18 0.06 145)",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                Join Free
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

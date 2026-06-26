/**
 * AdUnit — Reusable Google AdSense ad unit components
 *
 * Three variants:
 *  - AdSidebar      : 300×250 medium rectangle, ideal for sidebars
 *  - AdInArticle    : Responsive in-article unit, sits between blog paragraphs
 *  - AdResponsive   : Full-width responsive display unit for page footers/banners
 *
 * Usage:
 *   import { AdSidebar, AdInArticle, AdResponsive } from "@/components/AdUnit";
 *   <AdSidebar />
 *   <AdInArticle />
 *   <AdResponsive />
 *
 * Ad slot IDs below are placeholder values — replace with the real slot IDs
 * generated in your Google AdSense dashboard under Ads → By ad unit.
 *
 * Publisher ID: ca-pub-9769749963870548
 */

import { useEffect, useRef } from "react";

const PUBLISHER_ID = "ca-pub-9769749963870548";

// ─── Slot IDs — replace with real values from AdSense dashboard ─────────────
// To get real slot IDs: AdSense → Ads → By ad unit → Create new ad unit
const SLOT_SIDEBAR = "1234567890";      // 300×250 medium rectangle
const SLOT_IN_ARTICLE = "0987654321";   // In-article responsive
const SLOT_RESPONSIVE = "1122334455";   // Responsive display

// ─── Base hook — pushes the ad after mount ───────────────────────────────────
function useAdPush(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    try {
      if (ref.current && typeof window !== "undefined") {
        // @ts-expect-error adsbygoogle is injected by the AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Silently ignore — ad blockers or SSR environments
    }
  }, [ref]);
}

// ─── Sidebar Ad (300×250 medium rectangle) ───────────────────────────────────
export function AdSidebar() {
  const ref = useRef<HTMLDivElement>(null);
  useAdPush(ref);

  return (
    <div ref={ref} className="flex justify-center my-4" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "300px", height: "250px" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={SLOT_SIDEBAR}
      />
    </div>
  );
}

// ─── In-Article Ad (responsive, sits between paragraphs) ─────────────────────
export function AdInArticle() {
  const ref = useRef<HTMLDivElement>(null);
  useAdPush(ref);

  return (
    <div ref={ref} className="my-6 w-full" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={SLOT_IN_ARTICLE}
      />
    </div>
  );
}

// ─── Responsive Display Ad (full-width banner / footer) ──────────────────────
export function AdResponsive() {
  const ref = useRef<HTMLDivElement>(null);
  useAdPush(ref);

  return (
    <div ref={ref} className="my-6 w-full overflow-hidden" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={SLOT_RESPONSIVE}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

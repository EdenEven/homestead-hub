/**
 * ShareButtons — Reusable social sharing component
 * Supports: Facebook, X (Twitter), Pinterest, Copy Link
 */

import { useState } from "react";
import { Facebook, Twitter, Link2, Check, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  /** Visual style: "bar" (horizontal row) or "compact" (icon-only) */
  variant?: "bar" | "compact";
}

const PINTEREST_ICON = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

export default function ShareButtons({
  url,
  title,
  description = "",
  imageUrl = "",
  variant = "bar",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);
  const encodedImage = encodeURIComponent(imageUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}%20${encodedDesc}`,
  };

  function openShare(href: string) {
    window.open(href, "_blank", "width=600,height=450,noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link");
    }
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.55 0.05 65)" }}>
          Share
        </span>
        <button
          onClick={() => openShare(shareLinks.facebook)}
          aria-label="Share on Facebook"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ backgroundColor: "#1877F2", color: "#fff" }}
        >
          <Facebook className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => openShare(shareLinks.twitter)}
          aria-label="Share on X"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ backgroundColor: "#000", color: "#fff" }}
        >
          <Twitter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => openShare(shareLinks.pinterest)}
          aria-label="Share on Pinterest"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ backgroundColor: "#E60023", color: "#fff" }}
        >
          <PINTEREST_ICON />
        </button>
        <button
          onClick={copyLink}
          aria-label="Copy link"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ backgroundColor: "oklch(0.88 0.04 75)", color: "oklch(0.25 0.06 50)" }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  // "bar" variant — full labeled buttons
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm font-semibold mr-1" style={{ color: "oklch(0.45 0.05 65)" }}>
        <Share2 className="w-4 h-4" /> Share
      </span>

      <button
        onClick={() => openShare(shareLinks.facebook)}
        aria-label="Share on Facebook"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-80"
        style={{ backgroundColor: "#1877F2", color: "#fff" }}
      >
        <Facebook className="w-3.5 h-3.5" /> Facebook
      </button>

      <button
        onClick={() => openShare(shareLinks.twitter)}
        aria-label="Share on X"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-80"
        style={{ backgroundColor: "#000", color: "#fff" }}
      >
        <Twitter className="w-3.5 h-3.5" /> X
      </button>

      <button
        onClick={() => openShare(shareLinks.pinterest)}
        aria-label="Share on Pinterest"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-80"
        style={{ backgroundColor: "#E60023", color: "#fff" }}
      >
        <PINTEREST_ICON /> Pinterest
      </button>

      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-80"
        style={{ backgroundColor: "oklch(0.88 0.04 75)", color: "oklch(0.25 0.06 50)" }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}

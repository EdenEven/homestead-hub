import { useEffect, useState } from "react";
import { X, Download, ArrowRight, Leaf } from "lucide-react";
import { getLoginUrl } from "@/const";

const EBOOK_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/homesteaders-first-30-days_f527c71d.pdf";
const STORAGE_KEY = "homestead_welcome_seen";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const handleDownload = () => {
    window.open(EBOOK_URL, "_blank");
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const handleJoinFree = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    window.location.href = getLoginUrl();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-[#FDFAF4] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#C8860A]/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green header */}
        <div className="bg-[#2D4A2D] px-8 pt-8 pb-6 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-[#C8860A]/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#C8860A]/40">
            <Leaf className="w-7 h-7 text-[#C8860A]" />
          </div>
          <h2 className="text-2xl font-bold text-white font-serif leading-tight">
            Welcome to A1 Homestead Hub
          </h2>
          <p className="text-amber-300 text-sm mt-1 font-medium">
            Your home for self-reliant living
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <p className="text-[#4A3728] text-base leading-relaxed text-center mb-5">
            Master the skills your grandparents knew. Connect with homesteaders
            near you. Trade, barter, and build a life that doesn't depend on a
            fragile system.
          </p>

          {/* E-book offer */}
          <div className="bg-[#EEF5EE] border border-[#4A7A4A]/30 rounded-xl p-5 mb-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-16 bg-[#2D4A2D] rounded-md flex items-center justify-center shadow-md">
                <span className="text-2xl">📗</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#C8860A] uppercase tracking-wider mb-1">
                  Free Download — No Sign-up Required
                </p>
                <p className="text-[#2D4A2D] font-bold text-sm leading-snug">
                  "The Homesteader's First 30 Days: 10 Skills That Will Change Your Life"
                </p>
                <p className="text-[#6B4226] text-xs mt-1">
                  A practical guide from Nikki Russell at A1 Homestead Hub
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#C8860A] hover:bg-[#A06808] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Free E-Book (PDF)
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#C8860A]/20" />
            <span className="text-[#6B4226]/60 text-xs">or</span>
            <div className="flex-1 h-px bg-[#C8860A]/20" />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleJoinFree}
              className="flex-1 flex items-center justify-center gap-2 bg-[#2D4A2D] hover:bg-[#1a2e1a] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
            >
              Join Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="flex-1 flex items-center justify-center gap-2 border border-[#2D4A2D]/30 text-[#4A3728] hover:bg-[#F5F0E8] font-medium py-3 px-4 rounded-lg transition-colors text-sm"
            >
              Explore First
            </button>
          </div>

          <p className="text-center text-[#6B4226]/50 text-xs mt-4">
            Free membership — no credit card required
          </p>
        </div>
      </div>
    </div>
  );
}

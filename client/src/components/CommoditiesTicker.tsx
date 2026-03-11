import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TickerData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  unit?: string;
  isIndex?: boolean;
}

function TickerItem({ item }: { item: TickerData }) {
  const isUp = item.change > 0;
  const isDown = item.change < 0;

  return (
    <span className="inline-flex items-center gap-2 px-4 py-1 whitespace-nowrap text-sm">
      <span className={`font-semibold ${item.isIndex ? "text-sky-300" : "text-amber-200"}`}>
        {item.name}
      </span>
      <span className="text-white font-mono">
        {item.isIndex
          ? item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : `$${item.price.toFixed(2)}`}
        {item.unit && <span className="text-xs text-amber-100/60 ml-1">{item.unit}</span>}
      </span>
      <span
        className={`inline-flex items-center gap-0.5 text-xs font-medium ${
          isUp ? "text-green-300" : isDown ? "text-red-300" : "text-amber-100/50"
        }`}
      >
        {isUp ? (
          <TrendingUp className="w-3 h-3" />
        ) : isDown ? (
          <TrendingDown className="w-3 h-3" />
        ) : (
          <Minus className="w-3 h-3" />
        )}
        {isUp ? "+" : ""}
        {item.changePercent.toFixed(2)}%
      </span>
      <span className="text-amber-700/30 mx-1">|</span>
    </span>
  );
}

// Divider between indices and commodities sections
function SectionDivider({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 whitespace-nowrap">
      <span className="text-amber-700/50 text-xs font-bold tracking-widest uppercase">{label}</span>
      <span className="text-amber-700/30 ml-3">◆</span>
    </span>
  );
}

export default function CommoditiesTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const [paused, setPaused] = useState(false);

  const { data: commodities } = trpc.commodities.getPrices.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  });

  const { data: indices } = trpc.commodities.getIndices.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  });

  const allItems: TickerData[] = [
    ...(indices ?? []).map((i) => ({ ...i, isIndex: true })),
    ...(commodities ?? []).map((c) => ({ ...c, isIndex: false })),
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !allItems.length) return;

    const speed = 0.45;

    const animate = () => {
      if (!paused) {
        posRef.current -= speed;
        const halfWidth = track.scrollWidth / 2;
        if (Math.abs(posRef.current) >= halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [allItems.length, paused]);

  if (!allItems.length) {
    return (
      <div className="w-full bg-[#1a2e1a] border-b border-amber-900/40 h-8 flex items-center px-4">
        <span className="text-amber-200/40 text-xs animate-pulse">Loading market data...</span>
      </div>
    );
  }

  const doubled = [...allItems, ...allItems];

  return (
    <div
      className="w-full bg-[#1a2e1a] border-b border-amber-900/40 overflow-hidden h-8 flex items-center cursor-pointer select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      title="Hover to pause — Live market data updated every 5 minutes"
    >
      {/* Label */}
      <div className="flex-shrink-0 bg-[#2D4A2D] px-3 h-full flex items-center border-r border-amber-900/40 z-10">
        <span className="text-amber-400 text-xs font-bold tracking-wider uppercase">
          Markets
        </span>
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden relative">
        <div ref={trackRef} className="inline-flex items-center will-change-transform">
          {doubled.map((item, i) => (
            <TickerItem key={`${item.symbol}-${i}`} item={item} />
          ))}
        </div>
      </div>

      {paused && (
        <div className="flex-shrink-0 px-3 h-full flex items-center border-l border-amber-900/40">
          <span className="text-amber-400/50 text-xs">⏸</span>
        </div>
      )}
    </div>
  );
}

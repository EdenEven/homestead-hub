/**
 * CommodityChartModal
 * Opens when a user clicks a ticker item.
 * Shows a historical price line chart (recharts) with 1W / 1M / 3M / 1Y range selector.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

type Range = "1W" | "1M" | "3M" | "1Y";

interface Props {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  unit?: string;
  isIndex?: boolean;
  onClose: () => void;
}

const RANGES: Range[] = ["1W", "1M", "3M", "1Y"];

function formatPrice(value: number, isIndex: boolean) {
  if (isIndex) {
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return `$${value.toFixed(2)}`;
}

function formatDate(ts: number, range: Range) {
  const d = new Date(ts);
  if (range === "1W") {
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }
  if (range === "1Y") {
    return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label, range, isIndex, unit }: any) {
  if (!active || !payload?.length) return null;
  const close = payload[0]?.value;
  if (close == null) return null;
  return (
    <div className="bg-[oklch(0.15_0.04_50)] border border-amber-900/40 rounded-xl px-4 py-3 shadow-2xl text-sm">
      <div className="text-amber-200/60 text-xs mb-1">{formatDate(label, range)}</div>
      <div className="text-white font-bold text-base">
        {isIndex
          ? close.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : `$${close.toFixed(2)}`}
        {unit && <span className="text-amber-200/50 text-xs ml-1">{unit}</span>}
      </div>
    </div>
  );
}

export default function CommodityChartModal({
  symbol,
  name,
  currentPrice,
  change,
  changePercent,
  unit,
  isIndex = false,
  onClose,
}: Props) {
  const [range, setRange] = useState<Range>("1M");

  const { data, isLoading, isError } = trpc.commodities.getHistory.useQuery(
    { symbol, range },
    { staleTime: 5 * 60 * 1000 }
  );

  const isUp = change > 0;
  const isDown = change < 0;

  const chartColor = isUp ? "#86efac" : isDown ? "#fca5a5" : "#fde68a";
  const prevClose = data?.prevClose ?? null;

  // Format x-axis ticks — show a subset to avoid crowding
  const points = data?.points ?? [];
  const tickCount = Math.min(6, points.length);
  const tickIndices = tickCount > 1
    ? Array.from({ length: tickCount }, (_, i) => Math.round((i / (tickCount - 1)) * (points.length - 1)))
    : [0];
  const tickTimestamps = tickIndices.map((i) => points[i]?.ts).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[oklch(0.12_0.04_50)] border border-amber-900/30 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-900/30 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{name}</h2>
              <span className="text-amber-200/40 text-sm font-mono">{symbol}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-bold text-white font-mono">
                {formatPrice(currentPrice, isIndex)}
                {unit && <span className="text-base text-amber-200/50 ml-1">{unit}</span>}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
                  isUp
                    ? "bg-green-500/15 text-green-300"
                    : isDown
                    ? "bg-red-500/15 text-red-300"
                    : "bg-amber-500/15 text-amber-300"
                }`}
              >
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : isDown ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                {isUp ? "+" : ""}
                {change.toFixed(isIndex ? 2 : 2)} ({isUp ? "+" : ""}{changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200/40 hover:text-white transition-colors mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Range selector */}
        <div className="px-6 pt-4 flex items-center gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                range === r
                  ? "bg-amber-600/30 text-amber-300 border border-amber-600/50"
                  : "text-amber-200/40 hover:text-amber-200/70 hover:bg-white/5"
              }`}
            >
              {r}
            </button>
          ))}
          <span className="ml-auto text-amber-200/30 text-xs">
            {range === "1W" ? "Hourly" : range === "1Y" ? "Weekly" : "Daily"} · Yahoo Finance
          </span>
        </div>

        {/* OHLC Summary */}
        {!isLoading && points.length > 0 && (() => {
          const latest = points[points.length - 1];
          const fmt = (v: number | null) => v == null ? '—' : isIndex
            ? v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : `$${v.toFixed(2)}`;
          return (
            <div className="px-6 pb-2 grid grid-cols-4 gap-2">
              {[['Open', latest.open], ['High', latest.high], ['Low', latest.low], ['Close', latest.close]].map(([label, val]) => (
                <div key={label as string} className="bg-white/5 rounded-lg px-3 py-2 text-center">
                  <div className="text-amber-200/40 text-xs mb-0.5">{label}</div>
                  <div className="text-white text-sm font-mono font-semibold">{fmt(val as number | null)}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Chart */}
        <div className="px-4 pb-6 pt-2 h-52">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
          ) : isError || !points.length ? (
            <div className="h-full flex items-center justify-center text-amber-200/40 text-sm">
              No data available for this range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="ts"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  scale="time"
                  ticks={tickTimestamps}
                  tickFormatter={(ts) => formatDate(ts, range)}
                  tick={{ fill: "rgba(253,230,138,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => isIndex ? v.toLocaleString("en-US", { maximumFractionDigits: 0 }) : `$${v.toFixed(0)}`}
                  tick={{ fill: "rgba(253,230,138,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip
                  content={<CustomTooltip range={range} isIndex={isIndex} unit={unit} />}
                  cursor={{ stroke: "rgba(253,230,138,0.2)", strokeWidth: 1 }}
                />
                {prevClose != null && (
                  <ReferenceLine
                    y={prevClose}
                    stroke="rgba(253,230,138,0.25)"
                    strokeDasharray="4 4"
                    label={{ value: "Prev Close", fill: "rgba(253,230,138,0.35)", fontSize: 10, position: "insideTopRight" }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: chartColor, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, CloudLightning, Snowflake, Flame, Wind, Droplets, Info } from "lucide-react";

interface Alert {
  id: string;
  event: string;
  headline: string;
  severity: string;
  areaDesc: string;
  effective: string;
  expires: string;
}

function getSeverityColor(severity: string) {
  switch (severity?.toLowerCase()) {
    case "extreme": return "text-red-300 bg-red-900/30";
    case "severe": return "text-orange-300 bg-orange-900/30";
    case "moderate": return "text-yellow-300 bg-yellow-900/30";
    default: return "text-blue-300 bg-blue-900/20";
  }
}

function getEventIcon(event: string) {
  const e = event?.toLowerCase() ?? "";
  if (e.includes("tornado") || e.includes("thunderstorm") || e.includes("lightning")) return <CloudLightning className="w-3 h-3" />;
  if (e.includes("snow") || e.includes("blizzard") || e.includes("ice") || e.includes("freeze") || e.includes("frost") || e.includes("winter")) return <Snowflake className="w-3 h-3" />;
  if (e.includes("fire") || e.includes("heat")) return <Flame className="w-3 h-3" />;
  if (e.includes("wind") || e.includes("hurricane") || e.includes("tropical")) return <Wind className="w-3 h-3" />;
  if (e.includes("flood") || e.includes("rain") || e.includes("coastal")) return <Droplets className="w-3 h-3" />;
  return <AlertTriangle className="w-3 h-3" />;
}

function AlertItem({ alert }: { alert: Alert }) {
  const colorClass = getSeverityColor(alert.severity);
  const area = alert.areaDesc?.split(";")[0]?.trim() ?? "";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 mx-2 rounded text-xs font-medium whitespace-nowrap ${colorClass}`}>
      {getEventIcon(alert.event)}
      <span className="font-bold">{alert.event}</span>
      {area && <span className="opacity-75">— {area}</span>}
      <span className="text-white/30 mx-1">|</span>
    </span>
  );
}

export default function WeatherAlertTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const [paused, setPaused] = useState(false);

  const { data: alerts, isLoading } = trpc.weather.getNationwideAlerts.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !alerts?.length) return;

    const speed = 0.5;

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
  }, [alerts, paused]);

  if (isLoading) return null;

  // If no active alerts, show a calm "All Clear" message
  if (!alerts || alerts.length === 0) {
    return (
      <div className="w-full bg-[#0d1f0d] border-b border-green-900/40 h-7 flex items-center px-4 gap-3">
        <div className="flex-shrink-0 flex items-center gap-1.5 text-green-400 text-xs font-bold">
          <Info className="w-3 h-3" />
          <span className="uppercase tracking-wider">Weather Alerts</span>
        </div>
        <div className="flex-shrink-0 w-px h-4 bg-green-900/40" />
        <span className="text-green-400/60 text-xs">No active weather alerts across the US at this time</span>
      </div>
    );
  }

  const items = [...alerts, ...alerts];

  return (
    <div
      className="w-full bg-[#1a0a00] border-b border-orange-900/50 overflow-hidden h-7 flex items-center cursor-pointer select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      title="Hover to pause — Live NOAA weather alerts"
    >
      {/* Label */}
      <div className="flex-shrink-0 bg-red-900/80 px-3 h-full flex items-center gap-1.5 border-r border-orange-900/50 z-10 flex-shrink-0">
        <AlertTriangle className="w-3 h-3 text-orange-300 animate-pulse" />
        <span className="text-orange-300 text-xs font-bold tracking-wider uppercase">
          ALERTS
        </span>
      </div>

      {/* Scrolling alerts */}
      <div className="flex-1 overflow-hidden relative">
        <div ref={trackRef} className="inline-flex items-center will-change-transform">
          {items.map((alert, i) => (
            <AlertItem key={`${alert.id}-${i}`} alert={alert} />
          ))}
        </div>
      </div>

      {paused && (
        <div className="flex-shrink-0 px-2 h-full flex items-center border-l border-orange-900/40">
          <span className="text-orange-400/50 text-xs">⏸</span>
        </div>
      )}
    </div>
  );
}

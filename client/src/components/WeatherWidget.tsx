import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import {
  MapPin, Search, Thermometer, Wind, Droplets, Eye,
  CloudRain, Sun, Cloud, CloudSnow, Zap, CloudFog, X
} from "lucide-react";

interface GridPoint {
  forecastUrl: string;
  hourlyUrl: string;
  countyZone: string;
  city: string;
  state: string;
}

interface ForecastPeriod {
  name: string;
  temperature: number;
  temperatureUnit: string;
  shortForecast: string;
  detailedForecast: string;
  windSpeed: string;
  windDirection: string;
  icon: string;
  isDaytime: boolean;
  probabilityOfPrecipitation: number | null;
}

function getWeatherIcon(forecast: string, isDaytime: boolean) {
  const f = forecast?.toLowerCase() ?? "";
  if (f.includes("thunder") || f.includes("lightning")) return <Zap className="w-5 h-5 text-yellow-400" />;
  if (f.includes("snow") || f.includes("blizzard") || f.includes("ice")) return <CloudSnow className="w-5 h-5 text-blue-300" />;
  if (f.includes("rain") || f.includes("shower") || f.includes("drizzle")) return <CloudRain className="w-5 h-5 text-blue-400" />;
  if (f.includes("fog") || f.includes("mist") || f.includes("haze")) return <CloudFog className="w-5 h-5 text-gray-400" />;
  if (f.includes("cloud") || f.includes("overcast")) return <Cloud className="w-5 h-5 text-gray-300" />;
  if (f.includes("sun") || f.includes("clear") || f.includes("fair")) {
    return isDaytime
      ? <Sun className="w-5 h-5 text-yellow-400" />
      : <Sun className="w-5 h-5 text-yellow-200" />;
  }
  return <Cloud className="w-5 h-5 text-gray-400" />;
}

function geocodeZip(zip: string): Promise<{ lat: number; lon: number } | null> {
  return fetch(
    `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=US&format=json&limit=1`,
    { headers: { "User-Agent": "A1HomesteadHub/1.0 (a1homesteadhub.com)" } }
  )
    .then((r) => r.json())
    .then((data: Array<{lat: string; lon: string}>) => {
      if (!data?.length) return null;
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    })
    .catch(() => null);
}

export default function WeatherWidget() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [gridPoint, setGridPoint] = useState<GridPoint | null>(null);
  const [zipInput, setZipInput] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [locationError, setLocationError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const gridQuery = trpc.weather.getGridPoint.useQuery(
    { lat: coords?.lat ?? 0, lon: coords?.lon ?? 0 },
    { enabled: !!coords, retry: false }
  );

  const forecastQuery = trpc.weather.getForecast.useQuery(
    { forecastUrl: gridPoint?.forecastUrl ?? "" },
    { enabled: !!gridPoint?.forecastUrl, retry: false }
  );

  const alertsQuery = trpc.weather.getAlerts.useQuery(
    { lat: coords?.lat ?? 0, lon: coords?.lon ?? 0 },
    { enabled: !!coords, refetchInterval: 5 * 60 * 1000 }
  );

  useEffect(() => {
    if (gridQuery.data) {
      setGridPoint(gridQuery.data);
      if (gridQuery.data.city && gridQuery.data.state) {
        setLocationLabel(`${gridQuery.data.city}, ${gridQuery.data.state}`);
      }
    }
  }, [gridQuery.data]);

  const requestGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("GPS not available in your browser");
      return;
    }
    setIsGettingLocation(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setIsGettingLocation(false);
      },
      () => {
        setLocationError("Location denied — enter your zip code below");
        setIsGettingLocation(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const handleZipSearch = async () => {
    if (zipInput.length < 5) return;
    setLocationError("");
    setIsGettingLocation(true);
    const result = await geocodeZip(zipInput);
    setIsGettingLocation(false);
    if (!result) {
      setLocationError("Zip code not found — try again");
      return;
    }
    setCoords(result);
    setLocationLabel(`Zip: ${zipInput}`);
  };

  const forecast = forecastQuery.data ?? [];
  const alerts = alertsQuery.data ?? [];
  const currentPeriod = forecast[0];
  const daytimePeriods = forecast.filter((p: ForecastPeriod) => p.isDaytime).slice(0, 7);

  // Initial state — ask for location
  if (!coords) {
    return (
      <div className="bg-[#1a2e1a] border border-[#2D4A2D] rounded-xl p-5 text-white max-w-sm">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-amber-200 font-serif">Local Weather</h3>
        </div>
        <p className="text-sm text-green-200/70 mb-4">
          Get your local forecast, frost dates, and severe weather alerts.
        </p>
        <button
          onClick={requestGPS}
          disabled={isGettingLocation}
          className="w-full bg-[#2D4A2D] hover:bg-[#3a5e3a] text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors mb-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <MapPin className="w-4 h-4" />
          {isGettingLocation ? "Getting location..." : "Use My Location"}
        </button>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter zip code"
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value.replace(/\D/g, "").slice(0, 5))}
            onKeyDown={(e) => e.key === "Enter" && handleZipSearch()}
            className="flex-1 bg-[#0d1f0d] border border-[#2D4A2D] text-white placeholder-green-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleZipSearch}
            disabled={zipInput.length < 5 || isGettingLocation}
            className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        {locationError && (
          <p className="text-red-400 text-xs mt-2">{locationError}</p>
        )}
      </div>
    );
  }

  // Loading state
  if (gridQuery.isLoading || forecastQuery.isLoading) {
    return (
      <div className="bg-[#1a2e1a] border border-[#2D4A2D] rounded-xl p-5 text-white max-w-sm">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="text-amber-200 text-sm font-medium">{locationLabel || "Loading weather..."}</span>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-green-900/30 rounded" />
          <div className="h-4 bg-green-900/20 rounded w-3/4" />
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-green-900/20 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a2e1a] border border-[#2D4A2D] rounded-xl overflow-hidden text-white max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1f0d] border-b border-[#2D4A2D]">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-200 text-sm font-medium">{locationLabel}</span>
        </div>
        <button
          onClick={() => { setCoords(null); setGridPoint(null); setLocationLabel(""); }}
          className="text-green-600 hover:text-green-400 transition-colors"
          title="Change location"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active alerts badge */}
      {alerts.length > 0 && (
        <div className="bg-red-900/60 border-b border-red-800/50 px-4 py-2 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-red-300 animate-pulse flex-shrink-0" />
          <span className="text-red-200 text-xs font-medium">
            {alerts.length} active weather alert{alerts.length > 1 ? "s" : ""} in your area
          </span>
        </div>
      )}

      {/* Current conditions */}
      {currentPeriod && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                {getWeatherIcon(currentPeriod.shortForecast, currentPeriod.isDaytime)}
                <span className="text-3xl font-bold text-white">
                  {currentPeriod.temperature}°{currentPeriod.temperatureUnit}
                </span>
              </div>
              <p className="text-green-300 text-sm mt-1">{currentPeriod.shortForecast}</p>
              <p className="text-green-600 text-xs mt-0.5">{currentPeriod.name}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-1 justify-end text-xs text-green-400">
                <Wind className="w-3 h-3" />
                <span>{currentPeriod.windSpeed} {currentPeriod.windDirection}</span>
              </div>
              {currentPeriod.probabilityOfPrecipitation !== null && (
                <div className="flex items-center gap-1 justify-end text-xs text-blue-400">
                  <Droplets className="w-3 h-3" />
                  <span>{currentPeriod.probabilityOfPrecipitation}% precip</span>
                </div>
              )}
            </div>
          </div>

          {/* Toggle detailed forecast */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors"
          >
            {showDetails ? "Hide details ▲" : "Show details ▼"}
          </button>
          {showDetails && (
            <p className="text-green-300/70 text-xs mt-2 leading-relaxed">
              {currentPeriod.detailedForecast}
            </p>
          )}
        </div>
      )}

      {/* 7-day forecast */}
      {daytimePeriods.length > 1 && (
        <div className="border-t border-[#2D4A2D] px-4 py-3">
          <p className="text-xs text-green-600 uppercase tracking-wider mb-2 font-medium">7-Day Forecast</p>
          <div className="grid grid-cols-4 gap-1.5">
            {daytimePeriods.slice(1, 5).map((period: ForecastPeriod, i: number) => (
              <div key={i} className="bg-[#0d1f0d] rounded-lg p-2 text-center">
                <p className="text-green-500 text-xs mb-1 truncate">{period.name.split(" ")[0]}</p>
                <div className="flex justify-center mb-1">
                  {getWeatherIcon(period.shortForecast, true)}
                </div>
                <p className="text-white text-xs font-bold">{period.temperature}°</p>
                {period.probabilityOfPrecipitation !== null && period.probabilityOfPrecipitation > 0 && (
                  <p className="text-blue-400 text-xs">{period.probabilityOfPrecipitation}%</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts detail */}
      {alerts.length > 0 && (
        <div className="border-t border-red-900/40 px-4 py-3 space-y-2">
          <p className="text-xs text-red-400 uppercase tracking-wider font-medium">Active Alerts</p>
          {alerts.slice(0, 3).map((alert: {id: string; event: string; headline: string; severity: string; areaDesc: string; effective: string; expires: string}) => (
            <div key={alert.id} className="bg-red-900/20 rounded-lg p-2.5">
              <p className="text-red-300 text-xs font-bold">{alert.event}</p>
              <p className="text-red-200/70 text-xs mt-0.5 line-clamp-2">{alert.headline}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#2D4A2D] px-4 py-2 flex items-center justify-between">
        <span className="text-green-800 text-xs">Powered by NOAA</span>
        <span className="text-green-800 text-xs">Updated every 5 min</span>
      </div>
    </div>
  );
}

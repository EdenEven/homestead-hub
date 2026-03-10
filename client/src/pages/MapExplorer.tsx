/*
 * Map Explorer Page — Homestead Hub
 * Design: Rugged Americana Craft
 * Interactive Google Maps with homesteader locations, terrain, water sources
 */

import { useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";
import { MapPin, Droplets, Trees, Users, Layers } from "lucide-react";
import { toast } from "sonner";

const MAP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/community-map-nhafFzBS4vyLvNHgXN76iq.webp";

const mapPoints = [
  { lat: 36.1627, lng: -86.7816, type: "homesteader", label: "Ruth & Dale's Farm", desc: "Heritage breed pigs, chickens, market garden", city: "Nashville, TN area" },
  { lat: 30.2672, lng: -97.7431, type: "homesteader", label: "Maria's Herb Farm", desc: "Medicinal herbs, foraging walks", city: "Austin, TX area" },
  { lat: 35.9606, lng: -83.9207, type: "homesteader", label: "James & Carol's Cabin", desc: "Off-grid timber frame, solar, rainwater", city: "Knoxville, TN area" },
  { lat: 32.1656, lng: -82.9001, type: "homesteader", label: "Pastor Ben's Community Garden", desc: "Community food sovereignty project", city: "Rural Georgia" },
  { lat: 44.0521, lng: -123.0868, type: "homesteader", label: "Sarah & Tom's Homestead", desc: "Goats, bees, elk hunting", city: "Eugene, OR area" },
  { lat: 36.7748, lng: -76.0030, type: "water", label: "Spring Source", desc: "Natural spring, tested clean", city: "Virginia coast" },
  { lat: 35.4676, lng: -97.5164, type: "foraging", label: "Pawpaw Grove", desc: "Wild pawpaw trees, ripe September", city: "Oklahoma City area" },
  { lat: 38.2527, lng: -85.7585, type: "foraging", label: "Morel Mushroom Spot", desc: "Excellent morel hunting, April-May", city: "Louisville, KY area" },
  { lat: 40.4406, lng: -79.9959, type: "land", label: "Conservation Easement Land", desc: "100 acres available for stewardship", city: "Pittsburgh, PA area" },
  { lat: 34.0522, lng: -118.2437, type: "community", label: "Urban Homestead Network", desc: "LA-area homesteaders and urban farmers", city: "Los Angeles, CA" },
];

const layerOptions = [
  { id: "homesteaders", label: "Homesteaders", icon: <Users className="w-4 h-4" />, color: "oklch(0.32 0.08 145)", type: "homesteader" },
  { id: "water", label: "Water Sources", icon: <Droplets className="w-4 h-4" />, color: "oklch(0.40 0.10 220)", type: "water" },
  { id: "foraging", label: "Foraging Spots", icon: <Trees className="w-4 h-4" />, color: "oklch(0.38 0.09 140)", type: "foraging" },
  { id: "land", label: "Land Access", icon: <MapPin className="w-4 h-4" />, color: "oklch(0.45 0.10 65)", type: "land" },
  { id: "community", label: "Community Hubs", icon: <Users className="w-4 h-4" />, color: "oklch(0.68 0.12 65)", type: "community" },
];

const pinColors: Record<string, string> = {
  homesteader: "#2D5A27",
  water: "#1A5C8A",
  foraging: "#3A7A35",
  land: "#8A6A1A",
  community: "#C8882A",
};

export default function MapExplorer() {
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["homesteader", "water", "foraging", "land", "community"]));
  const [selectedPoint, setSelectedPoint] = useState<typeof mapPoints[0] | null>(null);

  const toggleLayer = (type: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleMapReady = useCallback((map: google.maps.Map) => {
    const visiblePoints = mapPoints.filter((p) => activeLayers.has(p.type));

    visiblePoints.forEach((point) => {
      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map,
        title: point.label,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: pinColors[point.type] || "#2D5A27",
          fillOpacity: 0.9,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: 'Source Serif 4', Georgia, serif; padding: 8px; max-width: 200px;">
            <h4 style="font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 14px; color: #1C1C1C; margin: 0 0 4px 0;">${point.label}</h4>
            <p style="font-size: 12px; color: #555; margin: 0 0 4px 0;">${point.desc}</p>
            <p style="font-size: 11px; color: #888; margin: 0;">📍 ${point.city}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        setSelectedPoint(point);
      });
    });

    // Add terrain layer
    map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.96 0.025 85)" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${MAP_IMG})` }} />
        <div className="absolute inset-0" style={{ background: "oklch(0.12 0.05 55 / 0.82)" }} />
        <div className="relative container">
          <p className="section-label mb-3">Know Your Territory</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.96 0.025 85)" }}>
            Map Explorer
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Explore terrain, find homesteaders in your region, locate water sources, discover foraging spots, and identify land access opportunities — all on one interactive map.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="flex-1 py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Layer Controls */}
            <div className="lg:col-span-1 space-y-4">
              <div className="p-4 rounded-sm" style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                  <Layers className="w-4 h-4" /> Map Layers
                </h3>
                <div className="space-y-2">
                  {layerOptions.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => toggleLayer(layer.type)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-left transition-all"
                      style={{
                        backgroundColor: activeLayers.has(layer.type) ? `${layer.color}22` : "transparent",
                        border: `1px solid ${activeLayers.has(layer.type) ? layer.color : "oklch(0.82 0.03 75)"}`,
                      }}
                    >
                      <div style={{ color: activeLayers.has(layer.type) ? layer.color : "oklch(0.55 0.03 65)" }}>
                        {layer.icon}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: activeLayers.has(layer.type) ? "oklch(0.18 0.06 145)" : "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        {layer.label}
                      </span>
                      <div
                        className="ml-auto w-3 h-3 rounded-full"
                        style={{ backgroundColor: activeLayers.has(layer.type) ? layer.color : "oklch(0.82 0.03 75)" }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Point Info */}
              {selectedPoint && (
                <div className="p-4 rounded-sm" style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
                  <h3 className="font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)" }}>
                    {selectedPoint.label}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: "oklch(0.38 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {selectedPoint.desc}
                  </p>
                  <p className="text-xs flex items-center gap-1" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    <MapPin className="w-3 h-3" /> {selectedPoint.city}
                  </p>
                  <button
                    onClick={() => toast.success("Contact request sent!")}
                    className="mt-3 w-full py-1.5 text-sm font-bold rounded-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: "oklch(0.22 0.06 145)", color: "oklch(0.96 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Connect
                  </button>
                </div>
              )}

              {/* Map Legend */}
              <div className="p-4 rounded-sm" style={{ backgroundColor: "oklch(0.98 0.01 85)", border: "1px solid oklch(0.82 0.03 75)" }}>
                <h3 className="font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "oklch(0.18 0.06 145)", fontSize: "14px" }}>
                  Legend
                </h3>
                <div className="space-y-1.5">
                  {layerOptions.map((l) => (
                    <div key={l.id} className="flex items-center gap-2 text-xs" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: "oklch(0.42 0.03 65)" }}>
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: pinColors[l.type] }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-3">
              <div className="rounded-sm overflow-hidden" style={{ height: "600px", border: "1px solid oklch(0.82 0.03 75)" }}>
                <MapView
                  onMapReady={handleMapReady}
                  initialCenter={{ lat: 37.5, lng: -95.0 }}
                  initialZoom={4}
                />
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: "oklch(0.55 0.03 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Click any marker to see details. Toggle layers using the controls on the left. Map shows terrain view.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

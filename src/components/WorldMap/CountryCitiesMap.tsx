import { useState, useCallback, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { CONTINENTS } from "../../data/continents";
import { getContinentId } from "../../data/continentMapping";
import { COUNTRY_CITIES } from "../../data/countryCities";
import NameRevealBubble from "./NameRevealBubble";
import ConfettiEffect from "../Overlays/ConfettiEffect";
import MilestoneModal from "../Overlays/MilestoneModal";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CONTINENT_COLOR: Record<string, string> = Object.fromEntries(
  CONTINENTS.map((c) => [c.id, c.color])
);

// Set of country IDs that have city data
const DRILLABLE_IDS = new Set(COUNTRY_CITIES.map((c) => c.countryId));

const zoomBtnStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.92)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  fontSize: 24,
  fontWeight: 800,
  color: "#1a365d",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Heebo, sans-serif",
};

// All cities flat, with their country info attached
const ALL_CITIES = COUNTRY_CITIES.flatMap((cw) =>
  cw.cities.map((city) => ({
    ...city,
    countryId: cw.countryId,
    countryNameHebrew: cw.countryNameHebrew,
  }))
);

interface Props {
  discoveredSet: Set<string>;
  onDiscover: (id: string) => boolean;
  speakHebrew: (text: string) => void;
}

export default function CountryCitiesMap({ discoveredSet, onDiscover, speakHebrew }: Props) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 25]);

  const [activeBubble, setActiveBubble] = useState<{
    name: string;
    subName?: string;
    color: string;
  } | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 0.5, y: 0.5 });
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState("");
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Geo fill colors ───────────────────────────────────────────────────────

  const getGeoFill = useCallback(
    (geoId: string): string => {
      if (DRILLABLE_IDS.has(geoId)) {
        const cId = getContinentId(geoId);
        const color = CONTINENT_COLOR[cId] ?? "#d1d5db";
        return color + "aa";
      }
      return "#e2e8f0";
    },
    []
  );

  // ─── City click handler ────────────────────────────────────────────────────

  const handleCityClick = useCallback(
    (cityId: string, cityName: string, color: string, countryName: string, countryId: string, event?: React.MouseEvent) => {
      setActiveBubble({ name: cityName, subName: countryName, color });

      if (event) {
        setConfettiOrigin({
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight,
        });
      }

      const isNew = onDiscover(cityId);
      if (isNew) setConfettiTrigger((p) => p + 1);

      speakHebrew(cityName);

      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = setTimeout(() => setActiveBubble(null), 2800);

      if (isNew) {
        const cw = COUNTRY_CITIES.find((c) => c.countryId === countryId);
        if (cw) {
          const updatedDone = cw.cities.filter(
            (c) => c.id === cityId || discoveredSet.has(c.id)
          ).length;
          if (updatedDone === cw.cities.length) {
            setTimeout(() => {
              setMilestoneMessage(`גילית את כל הערים ב${countryName}! 🎉`);
              setMilestoneOpen(true);
            }, 1500);
          }
        }
      }
    },
    [onDiscover, speakHebrew, discoveredSet]
  );

  const dismissBubble = useCallback(() => {
    setActiveBubble(null);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full h-full" style={{ minHeight: "400px" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 125, center: [0, 25] }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          onMoveEnd={({ coordinates, zoom: z }) => {
            setCenter(coordinates as [number, number]);
            setZoom(z);
          }}
          minZoom={1}
          maxZoom={150}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoId = String(geo.id);
                const fill = getGeoFill(geoId);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill, stroke: "#ffffff", strokeWidth: 0.5, outline: "none" },
                      hover:   { fill, stroke: "#ffffff", strokeWidth: 0.5, outline: "none" },
                      pressed: { fill, stroke: "#ffffff", strokeWidth: 0.5, outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* City pins — all countries, always visible, scale with zoom */}
          {ALL_CITIES.map((city) => {
            const isFound = discoveredSet.has(city.id);
            const cId = getContinentId(city.countryId);
            const color = CONTINENT_COLOR[cId] ?? "#818cf8";
            const hitR   = 10 / zoom;
            const pulseR = 7  / zoom;
            const pinR   = (isFound ? 5 : 4.5) / zoom;
            const dotR   = 1.8 / zoom;
            const starSz = 6  / zoom;
            const strokeW = 1.5 / zoom;

            return (
              <Marker
                key={city.id}
                coordinates={city.coordinates}
                onClick={(event) =>
                  handleCityClick(
                    city.id,
                    city.nameHebrew,
                    color,
                    city.countryNameHebrew,
                    city.countryId,
                    event as unknown as React.MouseEvent
                  )
                }
              >
                {/* Invisible hit area */}
                <circle r={hitR} fill="transparent" style={{ cursor: "pointer" }} />

                {/* Pulse ring for undiscovered */}
                {!isFound && (
                  <circle
                    r={pulseR}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeW}
                    strokeOpacity={0.5}
                    style={{ animation: "cityPulse 2s ease-out infinite", pointerEvents: "none" }}
                  />
                )}

                {/* Main pin */}
                <circle
                  r={pinR}
                  fill={isFound ? color : "#fff"}
                  stroke={color}
                  strokeWidth={strokeW}
                  style={{ cursor: "pointer", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))", pointerEvents: "none" }}
                />

                {isFound ? (
                  <text textAnchor="middle" dominantBaseline="central" style={{ fontSize: `${starSz}px`, pointerEvents: "none" }}>
                    ⭐
                  </text>
                ) : (
                  <circle r={dotR} fill={color} style={{ pointerEvents: "none" }} />
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 20,
        }}
      >
        <button onClick={() => setZoom((z) => Math.min(z * 1.5, 150))} style={zoomBtnStyle}>+</button>
        <button onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}   style={zoomBtnStyle}>−</button>
        {zoom > 1.1 && (
          <button
            onClick={() => { setZoom(1); setCenter([0, 25]); }}
            style={{ ...zoomBtnStyle, fontSize: 18 }}
          >
            🔄
          </button>
        )}
      </div>

      {/* Name reveal bubble */}
      <NameRevealBubble
        name={activeBubble?.name ?? null}
        subName={activeBubble?.subName}
        color={activeBubble?.color ?? "#818cf8"}
        position={null}
        onDismiss={dismissBubble}
      />

      <ConfettiEffect
        trigger={confettiTrigger}
        originX={confettiOrigin.x}
        originY={confettiOrigin.y}
      />

      <MilestoneModal
        isOpen={milestoneOpen}
        onClose={() => setMilestoneOpen(false)}
        message={milestoneMessage}
      />
    </div>
  );
}

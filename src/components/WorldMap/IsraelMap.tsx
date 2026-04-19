import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { geoMercator, geoPath } from "d3-geo";
import {
  ISRAEL_CITIES,
  ISRAEL_CITIES_BY_ID,
  ISRAEL_DISTRICTS,
  DISTRICT_BY_ID,
  TOTAL_ISRAEL_CITIES,
} from "../../data/israelCities";
import NameRevealBubble from "./NameRevealBubble";
import ConfettiEffect from "../Overlays/ConfettiEffect";
import MilestoneModal from "../Overlays/MilestoneModal";

const GEO_URL = "/israel-districts.json";

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

interface Props {
  discoveredSet: Set<string>;
  onDiscover: (id: string) => boolean;
  speakHebrew: (text: string) => void;
}

export default function IsraelMap({ discoveredSet, onDiscover, speakHebrew }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 400, h: 700 });
  const [geoData, setGeoData] = useState<any>(null);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastPan = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setSize({ w: el.clientWidth, h: el.clientHeight })
    );
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    fetch(GEO_URL).then((r) => r.json()).then(setGeoData);
  }, []);

  const projection = useMemo(() => {
    if (!geoData) return null;
    return geoMercator().fitSize([size.w, size.h], geoData);
  }, [geoData, size]);

  // For each city, project its coordinates to screen pixels
  const cityPoints = useMemo(() => {
    if (!projection) return new Map<string, [number, number]>();
    const map = new Map<string, [number, number]>();
    for (const city of ISRAEL_CITIES) {
      const pt = projection(city.coordinates);
      if (pt) map.set(city.id, pt as [number, number]);
    }
    return map;
  }, [projection]);

  // Group cities by district
  const citiesByDistrict = useMemo(() => {
    const map = new Map<string, typeof ISRAEL_CITIES>();
    for (const d of ISRAEL_DISTRICTS) map.set(d.id, []);
    for (const city of ISRAEL_CITIES) {
      map.get(city.districtId)?.push(city);
    }
    return map;
  }, []);

  // Handle city click — triggered by clicking anywhere in the district, hitting nearest city
  const handleDistrictClick = useCallback(
    (districtId: string, clickX: number, clickY: number, event: React.MouseEvent) => {
      const cities = citiesByDistrict.get(districtId) ?? [];
      // Find the undiscovered city nearest the click point
      const undiscovered = cities.filter((c) => !discoveredSet.has(c.id));
      const pool = undiscovered.length > 0 ? undiscovered : cities;

      let nearest = pool[0];
      let minDist = Infinity;
      for (const c of pool) {
        const pt = cityPoints.get(c.id);
        if (!pt) continue;
        // adjust for pan/scale transform
        const tx = (pt[0] - 0) * scale + pan.x;
        const ty = (pt[1] - 0) * scale + pan.y;
        const dist = Math.hypot(clickX - tx, clickY - ty);
        if (dist < minDist) {
          minDist = dist;
          nearest = c;
        }
      }
      if (!nearest) return;

      const district = DISTRICT_BY_ID.get(nearest.districtId);
      const color = district?.color ?? "#3b82f6";

      setActiveBubble({ name: nearest.nameHebrew, subName: district?.nameHebrew, color });
      setConfettiOrigin({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });

      const isNew = onDiscover(nearest.id);
      if (isNew) setConfettiTrigger((p) => p + 1);
      speakHebrew(nearest.nameHebrew);

      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = setTimeout(() => setActiveBubble(null), 2800);

      if (isNew) {
        const newTotal = Array.from(discoveredSet).length + 1;
        if (newTotal === TOTAL_ISRAEL_CITIES) {
          setTimeout(() => {
            setMilestoneMessage("גילית את כל ערי ישראל! 🇮🇱✨");
            setMilestoneOpen(true);
          }, 1500);
        }
      }
    },
    [citiesByDistrict, cityPoints, discoveredSet, onDiscover, speakHebrew, scale, pan]
  );

  // Direct city click (dot)
  const handleCityClick = useCallback(
    (cityId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      const city = ISRAEL_CITIES_BY_ID.get(cityId);
      if (!city) return;
      const district = DISTRICT_BY_ID.get(city.districtId);
      const color = district?.color ?? "#3b82f6";

      setActiveBubble({ name: city.nameHebrew, subName: district?.nameHebrew, color });
      setConfettiOrigin({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });

      const isNew = onDiscover(cityId);
      if (isNew) setConfettiTrigger((p) => p + 1);
      speakHebrew(city.nameHebrew);

      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = setTimeout(() => setActiveBubble(null), 2800);

      if (isNew && discoveredSet.size + 1 === TOTAL_ISRAEL_CITIES) {
        setTimeout(() => {
          setMilestoneMessage("גילית את כל ערי ישראל! 🇮🇱✨");
          setMilestoneOpen(true);
        }, 1500);
      }
    },
    [onDiscover, speakHebrew, discoveredSet]
  );

  const dismissBubble = useCallback(() => {
    setActiveBubble(null);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
  }, []);

  // Pan
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isPanning.current = true;
    lastPan.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPan.current.x;
    const dy = e.clientY - lastPan.current.y;
    lastPan.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  }, []);
  const onPointerUp = useCallback(() => { isPanning.current = false; }, []);

  const zoomIn  = () => setScale((s) => Math.min(s * 1.4, 12));
  const zoomOut = () => setScale((s) => {
    const next = s / 1.4;
    if (next <= 1) { setPan({ x: 0, y: 0 }); return 1; }
    return next;
  });
  const resetView = () => { setScale(1); setPan({ x: 0, y: 0 }); };

  const transform = `translate(${pan.x},${pan.y}) scale(${scale})`;
  const totalDiscovered = ISRAEL_CITIES.filter((c) => discoveredSet.has(c.id)).length;
  const pathGen = projection ? geoPath(projection) : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{ minHeight: "400px", touchAction: "none", background: "#bfdbfe" }}
    >
      <svg
        ref={svgRef}
        width={size.w}
        height={size.h}
        style={{ display: "block", cursor: "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <g transform={transform}>
          {/* District polygons — colored, clickable */}
          {geoData && pathGen && geoData.features.map((feature: any) => {
            const distId: string = feature.properties?.iso_3166_2 ?? "";
            const district = DISTRICT_BY_ID.get(distId);
            if (!district) return null;

            const cities = citiesByDistrict.get(distId) ?? [];
            const allDone = cities.length > 0 && cities.every((c) => discoveredSet.has(c.id));
            const anyDone = cities.some((c) => discoveredSet.has(c.id));

            const fill = allDone
              ? district.color
              : anyDone
              ? district.color + "bb"
              : district.color + "66";

            return (
              <path
                key={distId}
                d={pathGen(feature) ?? ""}
                fill={fill}
                stroke="#ffffff"
                strokeWidth={2 / scale}
                style={{ cursor: "pointer", transition: "fill 0.25s ease" }}
                onClick={(e) => {
                  const rect = svgRef.current!.getBoundingClientRect();
                  handleDistrictClick(distId, e.clientX - rect.left, e.clientY - rect.top, e);
                }}
              />
            );
          })}

          {/* City dots + labels */}
          {geoData && pathGen && ISRAEL_CITIES.map((city) => {
            const pt = cityPoints.get(city.id);
            if (!pt) return null;
            const isFound = discoveredSet.has(city.id);
            const district = DISTRICT_BY_ID.get(city.districtId);
            const color = district?.color ?? "#3b82f6";
            const r = 4.5 / scale;
            const fs = 11 / scale;

            return (
              <g key={city.id} onClick={(e) => handleCityClick(city.id, e)} style={{ cursor: "pointer" }}>
                {/* Dot */}
                <circle
                  cx={pt[0]}
                  cy={pt[1]}
                  r={r}
                  fill={isFound ? color : "#fff"}
                  stroke={isFound ? "#fff" : color}
                  strokeWidth={1.5 / scale}
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
                />
                {/* Label */}
                <text
                  x={pt[0]}
                  y={pt[1] - 8 / scale}
                  textAnchor="middle"
                  style={{
                    fontSize: `${fs}px`,
                    fontFamily: "Heebo, sans-serif",
                    fontWeight: 800,
                    fill: isFound ? "#1e3a5f" : "#374151",
                    filter:
                      "drop-shadow(0 0 2px rgba(255,255,255,1)) drop-shadow(0 0 3px rgba(255,255,255,1))",
                    pointerEvents: "none",
                  }}
                >
                  {isFound ? `⭐ ${city.nameHebrew}` : "❓"}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Progress badge */}
      <div
        style={{
          position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
          zIndex: 20, background: "rgba(255,255,255,0.92)", borderRadius: 12,
          padding: "6px 18px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontFamily: "Heebo, sans-serif", fontWeight: 700, fontSize: 15,
          color: "#1a365d", direction: "rtl", whiteSpace: "nowrap",
        }}
      >
        🇮🇱 ערי ישראל: {totalDiscovered} / {TOTAL_ISRAEL_CITIES}
      </div>

      {/* Zoom controls */}
      <div style={{ position: "absolute", bottom: 20, left: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: 20 }}>
        <button onClick={zoomIn} style={zoomBtnStyle}>+</button>
        <button onClick={zoomOut} style={zoomBtnStyle}>−</button>
        {(scale > 1.05 || Math.abs(pan.x) > 5 || Math.abs(pan.y) > 5) && (
          <button onClick={resetView} style={{ ...zoomBtnStyle, fontSize: 18 }}>🔄</button>
        )}
      </div>

      <NameRevealBubble
        name={activeBubble?.name ?? null}
        subName={activeBubble?.subName}
        color={activeBubble?.color ?? "#3b82f6"}
        position={null}
        onDismiss={dismissBubble}
      />
      <ConfettiEffect trigger={confettiTrigger} originX={confettiOrigin.x} originY={confettiOrigin.y} />
      <MilestoneModal isOpen={milestoneOpen} onClose={() => setMilestoneOpen(false)} message={milestoneMessage} />
    </div>
  );
}

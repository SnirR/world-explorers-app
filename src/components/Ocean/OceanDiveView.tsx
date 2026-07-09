// The ocean-dive screen: pick an ocean (5 tabs) and a depth zone (3), then
// swim with tappable low-poly creatures. Shares the discovery flow.

import { useCallback, useEffect, useRef, useState } from "react";
import { OceanDiveScene, type OceanPick } from "../../three/OceanDiveScene";
import {
  OCEANS,
  OCEAN_BY_ID,
  OCEAN_ZONES,
  ZONE_BY_ID,
  type OceanId,
  type OceanZoneId,
} from "../../data/oceans";
import {
  CREATURE_BY_ID,
  TOTAL_MARINE_CREATURES,
  creaturesFor,
} from "../../data/marineLife";
import type { DiscoveryState } from "../../hooks/useDiscovery";
import type { SfxName } from "../../hooks/useSfx";
import NameRevealBubble from "../WorldMap/NameRevealBubble";
import ConfettiEffect from "../Overlays/ConfettiEffect";
import MilestoneModal from "../Overlays/MilestoneModal";
import InfoSheet from "../Cards/InfoSheet";

const roundBtn: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  fontSize: 22,
  fontWeight: 800,
  color: "#1a365d",
  cursor: "pointer",
  fontFamily: "Heebo, sans-serif",
};

interface OceanDiveViewProps {
  oceanDiscovery: DiscoveryState;
  speakHebrew: (text: string) => void;
  playSfx: (name: SfxName) => void;
  initialOcean?: OceanId;
}

export default function OceanDiveView({
  oceanDiscovery,
  speakHebrew,
  playSfx,
  initialOcean,
}: OceanDiveViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<OceanDiveScene | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [oceanId, setOceanId] = useState<OceanId>(initialOcean ?? "pacific");
  const [zone, setZone] = useState<OceanZoneId>("reef");
  const [webglFailed, setWebglFailed] = useState(false);
  const [activeBubble, setActiveBubble] = useState<{ id: string; name: string; color: string } | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 0.5, y: 0.5 });
  const [milestone, setMilestone] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);

  const ocean = OCEAN_BY_ID.get(oceanId)!;
  const zoneSpec = ZONE_BY_ID.get(zone)!;

  const stateRef = useRef({ oceanDiscovery, playSfx, speakHebrew });
  useEffect(() => {
    stateRef.current = { oceanDiscovery, playSfx, speakHebrew };
  }, [oceanDiscovery, playSfx, speakHebrew]);

  const handlePick = useCallback((pick: OceanPick | null) => {
    const s = stateRef.current;
    if (!pick) return;
    const creature = CREATURE_BY_ID.get(pick.id);
    if (!creature) return;

    s.playSfx("pop");
    const isNew = s.oceanDiscovery.discover(pick.id);
    s.speakHebrew(creature.nameHebrew);
    setActiveBubble({ id: pick.id, name: `${creature.emoji} ${creature.nameHebrew}`, color: "#0e7490" });

    if (isNew) {
      s.playSfx("chime");
      setConfettiOrigin({ x: pick.screenX / window.innerWidth, y: pick.screenY / window.innerHeight });
      setConfettiTrigger((p) => p + 1);
      if (s.oceanDiscovery.discovered.size + 1 === TOTAL_MARINE_CREATURES) {
        setTimeout(() => setMilestone("גילית את כל חיות הים! 🌊👑"), 1600);
      }
    }

    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => setActiveBubble(null), 3400);
  }, []);

  // engine lifecycle — rebuilt per ocean/zone (small scenes, fast to build)
  useEffect(() => {
    if (!containerRef.current) return;
    let scene: OceanDiveScene | null = null;
    try {
      scene = new OceanDiveScene(containerRef.current, {
        ocean: OCEAN_BY_ID.get(oceanId)!,
        zone,
        discovered: stateRef.current.oceanDiscovery.discovered,
        reducedMotion:
          typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        onPick: handlePick,
      });
      engineRef.current = scene;
    } catch {
      setTimeout(() => setWebglFailed(true), 0);
    }
    return () => {
      engineRef.current = null;
      scene?.dispose();
    };
  }, [oceanId, zone, handlePick]);

  useEffect(() => {
    engineRef.current?.setDiscovered(oceanDiscovery.discovered);
  }, [oceanDiscovery.discovered]);

  const hereCount = creaturesFor(oceanId, zone).filter((c) => oceanDiscovery.discovered.has(c.id)).length;
  const hereTotal = creaturesFor(oceanId, zone).length;

  if (webglFailed) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-4 p-8"
        style={{ direction: "rtl", fontFamily: "Heebo, sans-serif", textAlign: "center", background: "#052e42" }}
      >
        <div style={{ fontSize: 60 }}>🤿</div>
        <div style={{ fontWeight: 800, fontSize: 20, color: "white" }}>
          הצוללת לא הצליחה לצלול במכשיר הזה 😢
        </div>
      </div>
    );
  }

  const card = cardId ? CREATURE_BY_ID.get(cardId) : undefined;

  return (
    <div className="relative w-full h-full" style={{ minHeight: 400, background: ocean.waterColors[zone] }}>
      <div ref={containerRef} className="absolute inset-0" data-testid="ocean-container" />

      {/* Ocean tabs */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: 4,
          background: "rgba(255,255,255,0.88)",
          borderRadius: 999,
          padding: 4,
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          direction: "rtl",
          maxWidth: "94vw",
          overflowX: "auto",
        }}
      >
        {OCEANS.map((o) => (
          <button
            key={o.id}
            data-testid={`ocean-tab-${o.id}`}
            onClick={() => {
              playSfx("pop");
              setOceanId(o.id);
              speakHebrew(o.nameHebrew);
            }}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "7px 12px",
              fontFamily: "Heebo, sans-serif",
              fontWeight: 800,
              fontSize: 13.5,
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: oceanId === o.id ? `linear-gradient(135deg, ${o.color}, #164e63)` : "transparent",
              color: oceanId === o.id ? "white" : "#475569",
            }}
          >
            {o.emoji} {o.nameHebrew.replace("האוקיינוס ", "").replace("אוקיינוס ", "")}
          </button>
        ))}
      </div>

      {/* Zone (depth) selector */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          direction: "rtl",
        }}
      >
        <div
          style={{
            background: "rgba(2,20,35,0.72)",
            borderRadius: 12,
            padding: "4px 14px",
            fontFamily: "Heebo, sans-serif",
            fontWeight: 800,
            fontSize: 13,
            color: "#bae6fd",
          }}
        >
          🤿 עומק: {zoneSpec.depthHebrew} · גיליתם כאן {hereCount}/{hereTotal}
        </div>
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 999,
            padding: 4,
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
          }}
        >
          {OCEAN_ZONES.map((z) => (
            <button
              key={z.id}
              data-testid={`zone-${z.id}`}
              onClick={() => {
                playSfx(z.id === "deep" ? "whoosh" : "pop");
                setZone(z.id);
                speakHebrew(z.nameHebrew);
              }}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "8px 14px",
                fontFamily: "Heebo, sans-serif",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                background:
                  zone === z.id
                    ? z.id === "deep"
                      ? "linear-gradient(135deg,#312e81,#111827)"
                      : "linear-gradient(135deg,#0ea5e9,#0369a1)"
                    : "transparent",
                color: zone === z.id ? "white" : "#475569",
              }}
            >
              {z.emoji} {z.nameHebrew}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom */}
      <div style={{ position: "absolute", bottom: 96, left: 16, display: "flex", flexDirection: "column", gap: 8, zIndex: 20 }}>
        <button style={roundBtn} onClick={() => engineRef.current?.zoomIn()} aria-label="התקרבות">+</button>
        <button style={roundBtn} onClick={() => engineRef.current?.zoomOut()} aria-label="התרחקות">−</button>
      </div>

      <NameRevealBubble
        name={activeBubble?.name ?? null}
        color={activeBubble?.color ?? "#0e7490"}
        position={null}
        onDismiss={() => {
          setActiveBubble(null);
          if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        }}
        onMore={
          activeBubble
            ? () => {
                if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
                setCardId(activeBubble.id);
                setActiveBubble(null);
              }
            : undefined
        }
      />

      <ConfettiEffect trigger={confettiTrigger} originX={confettiOrigin.x} originY={confettiOrigin.y} />
      <MilestoneModal isOpen={!!milestone} onClose={() => setMilestone(null)} message={milestone ?? ""} />

      {/* Creature card */}
      <InfoSheet open={!!card} onClose={() => setCardId(null)} accentColor={ocean.color}>
        {card && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 50 }}>{card.emoji}</span>
              <div>
                <div
                  style={{ fontWeight: 900, fontSize: 28, color: "#0f172a", cursor: "pointer" }}
                  onClick={() => speakHebrew(card.nameHebrew)}
                >
                  {card.nameHebrew} 🔊
                </div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#e0f2fe",
                    color: "#075985",
                    borderRadius: 999,
                    padding: "2px 12px",
                    fontWeight: 700,
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  {ZONE_BY_ID.get(card.zone)?.emoji} גר ב{ZONE_BY_ID.get(card.zone)?.nameHebrew}
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                playSfx("pop");
                speakHebrew(card.factHebrew);
              }}
              style={{
                marginTop: 14,
                background: "linear-gradient(135deg,#cffafe,#a5f3fc)",
                borderRadius: 16,
                padding: "12px 16px",
                fontWeight: 700,
                fontSize: 17,
                color: "#155e75",
                cursor: "pointer",
                lineHeight: 1.45,
              }}
            >
              💡 {card.factHebrew} <span style={{ fontSize: 14 }}>🔊</span>
            </div>

            <div style={{ marginTop: 12, fontWeight: 800, fontSize: 14.5, color: "#334155" }}>
              🌊 אפשר לפגוש אותו ב:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {card.oceans.map((oid) => {
                const oc = OCEAN_BY_ID.get(oid)!;
                return (
                  <span
                    key={oid}
                    style={{
                      background: oc.color + "22",
                      border: `1.5px solid ${oc.color}55`,
                      color: "#0f172a",
                      borderRadius: 999,
                      padding: "3px 12px",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {oc.emoji} {oc.nameHebrew}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </InfoSheet>
    </div>
  );
}
